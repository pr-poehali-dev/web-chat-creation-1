import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import Auth from './Auth';

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  online: boolean;
}

interface Message {
  id: number;
  text: string;
  time: string;
  isMine: boolean;
}

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('chats');
  const [activeChat, setActiveChat] = useState<number | null>(1);
  const [messageInput, setMessageInput] = useState('');
  const [showNotifications, setShowNotifications] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return <Auth onAuthSuccess={setUser} />;
  }

  const chats: Chat[] = [
    { id: 1, name: 'Анна Смирнова', lastMessage: 'Отлично, созвонимся завтра!', time: '14:32', unread: 3, avatar: 'АС', online: true },
    { id: 2, name: 'Команда Проекта', lastMessage: 'Новые задачи добавлены', time: '12:15', unread: 1, avatar: 'КП', online: false },
    { id: 3, name: 'Максим Петров', lastMessage: 'Спасибо за помощь 👍', time: 'Вчера', unread: 0, avatar: 'МП', online: true },
    { id: 4, name: 'Ольга Иванова', lastMessage: 'Файлы отправлю сегодня', time: 'Вчера', unread: 0, avatar: 'ОИ', online: false },
    { id: 5, name: 'Техподдержка', lastMessage: 'Ваш вопрос решён', time: '15 янв', unread: 0, avatar: 'ТП', online: true },
  ];

  const messages: Message[] = [
    { id: 1, text: 'Привет! Как дела с проектом?', time: '14:25', isMine: false },
    { id: 2, text: 'Привет! Всё отлично, завтра отправлю финальную версию', time: '14:28', isMine: true },
    { id: 3, text: 'Супер! Созвонимся по видео?', time: '14:30', isMine: false },
    { id: 4, text: 'Отлично, созвонимся завтра!', time: '14:32', isMine: true },
  ];

  const navItems = [
    { id: 'home', label: 'Главная', icon: 'Home' },
    { id: 'chats', label: 'Чаты', icon: 'MessageCircle' },
    { id: 'profile', label: 'Профиль', icon: 'User' },
    { id: 'settings', label: 'Настройки', icon: 'Settings' },
    { id: 'support', label: 'Поддержка', icon: 'HelpCircle' },
  ];

  const totalUnread = chats.reduce((sum, chat) => sum + chat.unread, 0);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div className="w-20 bg-card border-r border-border flex flex-col items-center py-6 gap-6">
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-semibold text-xl">
          C
        </div>
        
        <div className="flex-1 flex flex-col gap-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                activeSection === item.id
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon name={item.icon as any} size={22} />
              {item.id === 'chats' && totalUnread > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white rounded-full text-xs flex items-center justify-center font-semibold">
                  {totalUnread}
                </div>
              )}
            </button>
          ))}
        </div>

        <button 
          onClick={handleLogout}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          title="Выход"
        >
          <Icon name="LogOut" size={22} />
        </button>
      </div>

      {activeSection === 'chats' && (
        <>
          <div className="w-80 bg-card flex flex-col">
            <div className="p-6 border-b border-border">
              <h1 className="text-2xl font-semibold mb-4">Чаты</h1>
              <div className="relative">
                <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Поиск сообщений"
                  className="pl-10 bg-muted border-0 focus-visible:ring-1"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`w-full p-4 flex items-start gap-3 transition-colors border-b border-border hover:bg-muted ${
                    activeChat === chat.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-medium flex items-center justify-center">
                      {chat.avatar}
                    </div>
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm truncate">{chat.name}</h3>
                      <span className="text-xs text-muted-foreground ml-2">{chat.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <Badge className="ml-2 bg-primary text-primary-foreground min-w-[20px] h-5 rounded-full px-1.5">
                          {chat.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="w-px bg-border"></div>

          <div className="flex-1 flex flex-col">
            {activeChat ? (
              <>
                <div className="h-16 border-b border-border flex items-center justify-between px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-medium flex items-center justify-center">
                      {chats.find(c => c.id === activeChat)?.avatar}
                    </div>
                    <div>
                      <h2 className="font-semibold text-sm">{chats.find(c => c.id === activeChat)?.name}</h2>
                      <p className="text-xs text-muted-foreground">
                        {chats.find(c => c.id === activeChat)?.online ? 'Онлайн' : 'Был(а) недавно'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-xl">
                      <Icon name="Phone" size={20} />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-xl">
                      <Icon name="Video" size={20} />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-xl">
                      <Icon name="MoreVertical" size={20} />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4 max-w-3xl mx-auto">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isMine ? 'justify-end' : 'justify-start'} animate-fade-in`}
                      >
                        <div
                          className={`max-w-md px-4 py-3 rounded-2xl ${
                            message.isMine
                              ? 'bg-primary text-primary-foreground rounded-br-md'
                              : 'bg-card border border-border rounded-bl-md'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <span className={`text-xs mt-1 block ${message.isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {message.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border-t border-border">
                  <div className="flex items-end gap-2 max-w-3xl mx-auto">
                    <Button variant="ghost" size="icon" className="rounded-xl mb-1">
                      <Icon name="Paperclip" size={20} />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Напишите сообщение..."
                        className="pr-12 rounded-2xl bg-muted border-0 focus-visible:ring-1"
                      />
                      <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-xl">
                        <Icon name="Smile" size={20} />
                      </Button>
                    </div>
                    <Button className="rounded-2xl px-6">
                      <Icon name="Send" size={18} />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Icon name="MessageCircle" size={64} className="mx-auto mb-4 opacity-20" />
                  <p className="text-lg">Выберите чат для начала общения</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {activeSection === 'home' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <Icon name="Home" size={64} className="mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-semibold mb-2">Главная</h2>
            <p className="text-muted-foreground">Добро пожаловать в ваш чат-центр</p>
          </div>
        </div>
      )}

      {activeSection === 'profile' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 rounded-full bg-primary/10 text-primary font-semibold text-3xl mx-auto mb-4 flex items-center justify-center">
              {user.avatar_initials}
            </div>
            <h2 className="text-2xl font-semibold mb-2">{user.full_name}</h2>
            <p className="text-muted-foreground mb-6">{user.email}</p>
            <Button onClick={handleLogout} variant="outline" className="rounded-xl">
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти из аккаунта
            </Button>
          </div>
        </div>
      )}

      {activeSection === 'settings' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <Icon name="Settings" size={64} className="mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-semibold mb-2">Настройки</h2>
            <p className="text-muted-foreground">Настройте приложение под себя</p>
          </div>
        </div>
      )}

      {activeSection === 'support' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <Icon name="HelpCircle" size={64} className="mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-semibold mb-2">Поддержка</h2>
            <p className="text-muted-foreground">Мы всегда готовы помочь</p>
          </div>
        </div>
      )}

      {showNotifications && totalUnread > 0 && (
        <div className="fixed top-4 right-4 bg-card border border-border rounded-2xl shadow-2xl p-4 max-w-sm animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon name="Bell" size={20} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1">Новые сообщения</h3>
              <p className="text-sm text-muted-foreground">У вас {totalUnread} непрочитанных сообщений</p>
            </div>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="X" size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;