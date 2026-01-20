import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta

def handler(event: dict, context) -> dict:
    """API для модерации пользователей администратором"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Id'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    
    try:
        conn = psycopg2.connect(dsn)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        admin_id = event.get('headers', {}).get('X-Admin-Id') or event.get('headers', {}).get('x-admin-id')
        
        if not admin_id:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Требуется авторизация'}),
                'isBase64Encoded': False
            }
        
        cur.execute("SELECT is_admin FROM users WHERE id = %s", (admin_id,))
        admin = cur.fetchone()
        
        if not admin or not admin['is_admin']:
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Доступ запрещён. Только для администраторов'}),
                'isBase64Encoded': False
            }
        
        if method == 'GET':
            cur.execute("""
                SELECT id, email, full_name, avatar_initials, is_blocked, is_muted, 
                       blocked_at, muted_until, created_at, last_seen, is_admin
                FROM users 
                WHERE is_admin = FALSE
                ORDER BY created_at DESC
            """)
            users = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'users': [
                        {
                            'id': u['id'],
                            'email': u['email'],
                            'full_name': u['full_name'],
                            'avatar_initials': u['avatar_initials'],
                            'is_blocked': u['is_blocked'],
                            'is_muted': u['is_muted'],
                            'blocked_at': u['blocked_at'].isoformat() if u['blocked_at'] else None,
                            'muted_until': u['muted_until'].isoformat() if u['muted_until'] else None,
                            'created_at': u['created_at'].isoformat() if u['created_at'] else None,
                            'last_seen': u['last_seen'].isoformat() if u['last_seen'] else None
                        }
                        for u in users
                    ]
                }, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            user_id = body.get('user_id')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'user_id обязателен'}),
                    'isBase64Encoded': False
                }
            
            if action == 'block':
                cur.execute(
                    "UPDATE users SET is_blocked = TRUE, blocked_at = CURRENT_TIMESTAMP WHERE id = %s AND is_admin = FALSE",
                    (user_id,)
                )
                conn.commit()
                message = 'Пользователь заблокирован'
            
            elif action == 'unblock':
                cur.execute(
                    "UPDATE users SET is_blocked = FALSE, blocked_at = NULL WHERE id = %s",
                    (user_id,)
                )
                conn.commit()
                message = 'Пользователь разблокирован'
            
            elif action == 'mute':
                duration_hours = body.get('duration_hours', 24)
                cur.execute(
                    "UPDATE users SET is_muted = TRUE, muted_until = %s WHERE id = %s AND is_admin = FALSE",
                    (datetime.now() + timedelta(hours=duration_hours), user_id)
                )
                conn.commit()
                message = f'Пользователь заглушён на {duration_hours} часов'
            
            elif action == 'unmute':
                cur.execute(
                    "UPDATE users SET is_muted = FALSE, muted_until = NULL WHERE id = %s",
                    (user_id,)
                )
                conn.commit()
                message = 'Заглушка снята'
            
            elif action == 'delete':
                cur.execute(
                    "DELETE FROM users WHERE id = %s AND is_admin = FALSE",
                    (user_id,)
                )
                conn.commit()
                message = 'Пользователь удалён'
            
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Неизвестное действие'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': message}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Метод не поддерживается'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
