ALTER TABLE users 
ADD COLUMN is_admin BOOLEAN DEFAULT FALSE,
ADD COLUMN is_blocked BOOLEAN DEFAULT FALSE,
ADD COLUMN is_muted BOOLEAN DEFAULT FALSE,
ADD COLUMN blocked_at TIMESTAMP,
ADD COLUMN muted_until TIMESTAMP;

UPDATE users SET is_admin = TRUE WHERE email = 'admin@admin.ru';

CREATE INDEX idx_users_is_blocked ON users(is_blocked);
CREATE INDEX idx_users_is_admin ON users(is_admin);