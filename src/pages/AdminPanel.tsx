import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface User {
  id: number;
  email: string;
  full_name: string;
  avatar_initials: string;
  is_blocked: boolean;
  is_muted: boolean;
  blocked_at: string | null;
  muted_until: string | null;
  created_at: string;
  last_seen: string;
}

interface AdminPanelProps {
  adminId: number;
  onClose: () => void;
}

const AdminPanel = ({ adminId, onClose }: AdminPanelProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const API_URL = 'https://functions.poehali.dev/dc6bfdf3-8f1b-49f7-938b-825548e3c8cb';

  const loadUsers = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: { 'X-Admin-Id': adminId.toString() }
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAction = async (userId: number, action: string, duration_hours?: number) => {
    setActionLoading(userId);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Id': adminId.toString()
        },
        body: JSON.stringify({ action, user_id: userId, duration_hours })
      });

      if (response.ok) {
        await loadUsers();
      }
    } catch (error) {
      console.error('Ошибка действия:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="h-16 border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Icon name="Shield" size={24} className="text-primary" />
          <div>
            <h2 className="font-semibold text-lg">Панель администратора</h2>
            <p className="text-xs text-muted-foreground">Управление пользователями</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
          <Icon name="X" size={20} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Icon name="Loader2" size={48} className="animate-spin text-muted-foreground" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <Icon name="Users" size={64} className="mx-auto mb-4 opacity-20" />
            <p>Нет пользователей для модерации</p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className={`bg-card border border-border rounded-2xl p-5 transition-all ${
                  user.is_blocked ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-lg flex-shrink-0">
                    {user.avatar_initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-semibold text-base mb-1">{user.full_name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex gap-2">
                        {user.is_blocked && (
                          <Badge variant="destructive" className="gap-1">
                            <Icon name="Ban" size={12} />
                            Заблокирован
                          </Badge>
                        )}
                        {user.is_muted && (
                          <Badge variant="secondary" className="gap-1">
                            <Icon name="VolumeX" size={12} />
                            Заглушён
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground mb-4">
                      Создан: {formatDate(user.created_at)} • Последний визит: {formatDate(user.last_seen)}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {!user.is_blocked ? (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="rounded-xl gap-2"
                          onClick={() => handleAction(user.id, 'block')}
                          disabled={actionLoading === user.id}
                        >
                          <Icon name="Ban" size={14} />
                          Заблокировать
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl gap-2"
                          onClick={() => handleAction(user.id, 'unblock')}
                          disabled={actionLoading === user.id}
                        >
                          <Icon name="CheckCircle" size={14} />
                          Разблокировать
                        </Button>
                      )}

                      {!user.is_muted ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl gap-2"
                            onClick={() => handleAction(user.id, 'mute', 1)}
                            disabled={actionLoading === user.id}
                          >
                            <Icon name="VolumeX" size={14} />
                            Заглушить на 1ч
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl gap-2"
                            onClick={() => handleAction(user.id, 'mute', 24)}
                            disabled={actionLoading === user.id}
                          >
                            <Icon name="VolumeX" size={14} />
                            Заглушить на 24ч
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl gap-2"
                          onClick={() => handleAction(user.id, 'unmute')}
                          disabled={actionLoading === user.id}
                        >
                          <Icon name="Volume2" size={14} />
                          Снять заглушку
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-xl gap-2 text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm(`Удалить пользователя ${user.full_name}?`)) {
                            handleAction(user.id, 'delete');
                          }
                        }}
                        disabled={actionLoading === user.id}
                      >
                        <Icon name="Trash2" size={14} />
                        Удалить
                      </Button>

                      {actionLoading === user.id && (
                        <Icon name="Loader2" size={16} className="animate-spin text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
