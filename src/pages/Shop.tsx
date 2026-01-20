import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

const Shop = () => {
  const navigate = useNavigate();
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUnreadMessages(user.id === 2 ? 2 : 0);
    }
  }, []);

  const products = [
    {
      id: 1,
      name: "Премиум подписка",
      description: "Месяц без рекламы",
      price: "299 ₽",
      image: "💎",
      category: "Подписки"
    },
    {
      id: 2,
      name: "Стикерпак 'Котики'",
      description: "50 эксклюзивных стикеров",
      price: "99 ₽",
      image: "🐱",
      category: "Стикеры"
    },
    {
      id: 3,
      name: "Тема 'Космос'",
      description: "Тёмная тема оформления",
      price: "149 ₽",
      image: "🚀",
      category: "Темы"
    },
    {
      id: 4,
      name: "Годовая подписка",
      description: "Скидка 40%",
      price: "1999 ₽",
      image: "⭐",
      category: "Подписки",
      badge: "-40%"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="h-14 md:h-16 border-b border-border flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => navigate('/')}
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted"
          >
            <Icon name="ChevronLeft" size={20} />
          </button>
          <h1 className="text-lg md:text-xl font-bold">Магазин</h1>
        </div>
        <Button variant="ghost" size="icon" className="rounded-xl">
          <Icon name="ShoppingCart" size={20} />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Categories */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <Button variant="default" size="sm" className="rounded-full whitespace-nowrap">
              Все
            </Button>
            <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">
              Подписки
            </Button>
            <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">
              Стикеры
            </Button>
            <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">
              Темы
            </Button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative bg-card border border-border rounded-2xl p-4 hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {product.badge && (
                  <Badge className="absolute top-4 right-4 bg-red-500 text-white">
                    {product.badge}
                  </Badge>
                )}
                
                <div className="flex gap-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-muted flex items-center justify-center text-4xl md:text-5xl flex-shrink-0">
                    {product.image}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base md:text-lg mb-1 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-lg md:text-xl font-bold text-primary">
                        {product.price}
                      </span>
                      <Button size="sm" className="rounded-xl">
                        Купить
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-around px-4 py-2">
          <button 
            onClick={() => navigate('/')}
            className="flex flex-col items-center gap-1 py-2 px-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="Home" size={24} />
            <span className="text-xs">Главная</span>
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
          <button className="flex flex-col items-center gap-1 py-2 px-4 text-primary">
            <Icon name="ShoppingBag" size={24} />
            <span className="text-xs font-medium">Магазин</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Shop;