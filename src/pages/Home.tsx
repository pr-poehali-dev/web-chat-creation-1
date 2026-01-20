import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUnreadMessages(user.id === 2 ? 2 : 0);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="h-14 md:h-16 border-b border-border flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
            М
          </div>
          <h1 className="text-lg md:text-xl font-bold">Мессенджер</h1>
        </div>
        <Button variant="ghost" size="icon" className="rounded-xl">
          <Icon name="Settings" size={20} />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
        <div className="text-center mb-4">
          <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Icon name="MessageCircle" size={40} className="md:w-12 md:h-12" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Добро пожаловать!</h2>
          <p className="text-muted-foreground">Выберите раздел для продолжения</p>
        </div>

        <div className="w-full max-w-md grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/chats')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 to-primary p-6 md:p-8 text-white transition-transform hover:scale-105 active:scale-95"
          >
            {unreadMessages > 0 && (
              <Badge className="absolute top-3 right-3 z-20 bg-red-500 text-white min-w-[24px] h-6 flex items-center justify-center px-2 animate-pulse">
                {unreadMessages}
              </Badge>
            )}
            <div className="relative z-10">
              <div className="w-12 h-12 md:w-14 md:h-14 mb-3 rounded-xl bg-white/20 flex items-center justify-center">
                <Icon name="MessageCircle" size={24} className="md:w-7 md:h-7" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-1">Чаты</h3>
              <p className="text-sm text-white/80">Связь с поддержкой</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={() => navigate('/shop')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 md:p-8 text-white transition-transform hover:scale-105 active:scale-95"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 md:w-14 md:h-14 mb-3 rounded-xl bg-white/20 flex items-center justify-center">
                <Icon name="ShoppingBag" size={24} className="md:w-7 md:h-7" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-1">Магазин</h3>
              <p className="text-sm text-white/80">Товары и услуги</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-around px-4 py-2">
          <button className="flex flex-col items-center gap-1 py-2 px-4 text-primary">
            <Icon name="Home" size={24} />
            <span className="text-xs font-medium">Главная</span>
          </button>
          <button 
            onClick={() => navigate('/chats')}
            className="relative flex flex-col items-center gap-1 py-2 px-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            {unreadMessages > 0 && (
              <Badge className="absolute top-1 right-2 bg-red-500 text-white min-w-[18px] h-[18px] flex items-center justify-center text-[10px] px-1">
                {unreadMessages}
              </Badge>
            )}
            <Icon name="MessageCircle" size={24} />
            <span className="text-xs">Чаты</span>
          </button>
          <button 
            onClick={() => navigate('/shop')}
            className="flex flex-col items-center gap-1 py-2 px-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="ShoppingBag" size={24} />
            <span className="text-xs">Магазин</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;