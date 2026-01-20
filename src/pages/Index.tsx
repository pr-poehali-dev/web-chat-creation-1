import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import Auth from './Auth';
import AdminPanel from './AdminPanel';

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
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('chats');
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [showNotifications, setShowNotifications] = useState(true);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);

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

  const adminChat = { 
    id: 999, 
    name: 'Техподдержка', 
    lastMessage: user.id === 2 ? 'У вас новые обращения' : 'Мы всегда на связи', 
    time: '14:32', 
    unread: user.id === 2 ? 2 : 0, 
    avatar: '🛡️', 
    online: true 
  };

  const chats: Chat[] = user.id === 2 
    ? [
        { id: 1, name: 'Пользователь #1234', lastMessage: 'Помогите с оплатой', time: '14:32', unread: 2, avatar: '👤', online: true },
        { id: 2, name: 'Пользователь #5678', lastMessage: 'Спасибо за помощь!', time: '12:15', unread: 0, avatar: '👤', online: false },
        { id: 3, name: 'Пользователь #9012', lastMessage: 'Не работает функция', time: 'Вчера', unread: 0, avatar: '👤', online: true },
      ]
    : [adminChat];

  const messages: Message[] = [
    { id: 1, text: 'Привет! Как дела с проектом?', time: '14:25', isMine: false },
    { id: 2, text: 'Привет! Всё отлично, завтра отправлю финальную версию', time: '14:28', isMine: true },
    { id: 3, text: 'Супер! Созвонимся по видео?', time: '14:30', isMine: false },
    { id: 4, text: 'Отлично, созвонимся завтра!', time: '14:32', isMine: true },
  ];

  const navItems = [
    { id: 'home', label: 'Главная', icon: 'Home', action: () => navigate('/') },
    { id: 'chats', label: 'Чаты', icon: 'MessageCircle' },
    { id: 'shop', label: 'Магазин', icon: 'ShoppingBag', action: () => navigate('/shop') },
    ...(user.id === 2 ? [{ id: 'admin', label: 'Админ-панель', icon: 'Shield' }] : []),
    { id: 'profile', label: 'Профиль', icon: 'User' },
    { id: 'settings', label: 'Настройки', icon: 'Settings' },
  ];

  const totalUnread = chats.reduce((sum, chat) => sum + chat.unread, 0);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    
    if (touchStart) {
      const diff = currentTouch - touchStart;
      setSwipeOffset(diff);
    }
  };

  const triggerHaptic = (style: 'light' | 'medium' | 'heavy' = 'medium') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      navigator.vibrate(patterns[style]);
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setSwipeOffset(0);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    let didNavigate = false;
    
    if (activeChat && isRightSwipe) {
      const currentIndex = chats.findIndex(c => c.id === activeChat);
      if (currentIndex === 0) {
        setActiveChat(null);
        didNavigate = true;
      } else {
        setActiveChat(chats[currentIndex - 1].id);
        didNavigate = true;
      }
    } else if (activeChat && isLeftSwipe) {
      const currentIndex = chats.findIndex(c => c.id === activeChat);
      if (currentIndex < chats.length - 1) {
        setActiveChat(chats[currentIndex + 1].id);
        didNavigate = true;
      }
    }
    
    if (didNavigate) {
      triggerHaptic('medium');
    }
    
    setSwipeOffset(0);
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div className="hidden md:flex w-20 bg-card border-r border-border flex-col items-center py-6 gap-6">
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-semibold text-xl">
          C
        </div>
        
        <div className="flex-1 flex flex-col gap-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if ('action' in item && item.action) {
                  item.action();
                } else {
                  setActiveSection(item.id);
                }
              }}
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
          <div className={`${activeChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 bg-card flex-col`}>
            <div className="p-4 md:p-6 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate('/')}
                    className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted"
                  >
                    <Icon name="ChevronLeft" size={20} />
                  </button>
                  <h1 className="text-2xl font-semibold">Чаты</h1>
                </div>
                <button
                  onClick={() => setShowMobileNav(true)}
                  className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted"
                >
                  <Icon name="Menu" size={22} />
                </button>
              </div>
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
                  onClick={() => {
                    setActiveChat(chat.id);
                    triggerHaptic('light');
                  }}
                  className={`w-full p-3 md:p-4 flex items-start gap-3 transition-colors border-b border-border hover:bg-muted ${
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

          <div className="hidden md:block w-px bg-border"></div>

          <div 
            className={`${activeChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col transition-transform duration-200 md:transform-none`}
            ref={chatContainerRef}
            style={{
              transform: swipeOffset !== 0 ? `translateX(${Math.max(-100, Math.min(100, swipeOffset * 0.3))}px)` : 'translateX(0)',
              transition: swipeOffset === 0 ? 'transform 0.2s ease-out' : 'none'
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {activeChat ? (
              <>
                <div className="h-14 md:h-16 border-b border-border flex items-center justify-between px-4 md:px-6">
                  <div className="flex items-center gap-2 md:gap-3">
                    <button
                      onClick={() => setActiveChat(null)}
                      className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted mr-1"
                    >
                      <Icon name="ChevronLeft" size={20} />
                    </button>
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

                  <div className="flex items-center gap-1 md:gap-2">
                    <Button variant="ghost" size="icon" className="rounded-xl hidden md:flex">
                      <Icon name="Phone" size={20} />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-xl hidden md:flex">
                      <Icon name="Video" size={20} />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-xl">
                      <Icon name="MoreVertical" size={20} />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 relative">
                  {swipeOffset > 30 && (
                    <div className="md:hidden absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center z-10 animate-fade-in">
                      <Icon name="ChevronLeft" size={24} className="text-primary" />
                    </div>
                  )}
                  {swipeOffset < -30 && (
                    <div className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center z-10 animate-fade-in">
                      <Icon name="ChevronRight" size={24} className="text-primary" />
                    </div>
                  )}
                  <div className="space-y-3 md:space-y-4 max-w-3xl mx-auto">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isMine ? 'justify-end' : 'justify-start'} animate-fade-in`}
                      >
                        <div
                          className={`max-w-[85%] md:max-w-md px-3 md:px-4 py-2 md:py-3 rounded-2xl ${
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

                <div className="md:hidden flex justify-center gap-1.5 py-2 bg-background/80 backdrop-blur-sm">
                  {chats.map((chat, index) => (
                    <button
                      key={chat.id}
                      onClick={() => {
                        setActiveChat(chat.id);
                        triggerHaptic('light');
                      }}
                      className="group"
                    >
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          activeChat === chat.id 
                            ? 'w-6 bg-primary' 
                            : 'w-1.5 bg-border group-hover:bg-muted-foreground'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="p-3 md:p-4 border-t border-border">
                  <div className="flex items-end gap-2 max-w-3xl mx-auto">
                    <Button variant="ghost" size="icon" className="rounded-xl mb-1 hidden md:flex">
                      <Icon name="Paperclip" size={20} />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Напишите сообщение..."
                        className="pr-10 md:pr-12 rounded-2xl bg-muted border-0 focus-visible:ring-1 text-sm md:text-base"
                      />
                      <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-xl hidden md:flex">
                        <Icon name="Smile" size={20} />
                      </Button>
                    </div>
                    <Button className="rounded-2xl px-4 md:px-6">
                      <Icon name="Send" size={16} className="md:hidden" />
                      <Icon name="Send" size={18} className="hidden md:block" />
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

      {activeSection === 'admin' && user.id === 2 && (
        <AdminPanel adminId={user.id} onClose={() => setActiveSection('chats')} />
      )}

      {showMobileNav && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setShowMobileNav(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl p-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-1 bg-border rounded-full mx-auto mb-6"></div>
            <div className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setShowMobileNav(false);
                    setActiveChat(null);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
                    activeSection === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <Icon name={item.icon as any} size={22} />
                  <span className="font-medium">{item.label}</span>
                  {item.id === 'chats' && totalUnread > 0 && (
                    <Badge className="ml-auto bg-destructive text-white">
                      {totalUnread}
                    </Badge>
                  )}
                </button>
              ))}
              <button
                onClick={() => {
                  handleLogout();
                  setShowMobileNav(false);
                }}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-muted text-destructive"
              >
                <Icon name="LogOut" size={22} />
                <span className="font-medium">Выход</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showNotifications && totalUnread > 0 && (
        <div className="fixed top-4 right-4 left-4 md:left-auto bg-card border border-border rounded-2xl shadow-2xl p-4 max-w-sm md:mx-0 mx-auto animate-fade-in">
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