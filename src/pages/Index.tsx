import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Listing {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  contact: string;
  views: number;
  isVip: boolean;
  createdAt: Date;
}

const mockListings: Listing[] = [
  {
    id: 1,
    title: 'Помощь семье погорельцев',
    description: 'Семья с двумя детьми осталась без крыши над головой после пожара. Нужна помощь с временным жильём и одеждой.',
    category: 'Жильё',
    author: 'Мария К.',
    contact: '+7 (999) 123-45-67',
    views: 234,
    isVip: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: 2,
    title: 'Поддержка пожилой соседки',
    description: 'Одинокой бабушке нужна помощь с покупкой продуктов и лекарств. Может кто-то рядом живёт?',
    category: 'Бытовая помощь',
    author: 'Алексей П.',
    contact: 'telegram: @aleksey_p',
    views: 156,
    isVip: false,
    createdAt: new Date('2024-01-16')
  },
  {
    id: 3,
    title: 'Нужны средства на лечение',
    description: 'Собираем на операцию для ребёнка. Любая помощь важна и будет принята с благодарностью.',
    category: 'Медицина',
    author: 'Елена С.',
    contact: 'elena.s@example.com',
    views: 892,
    isVip: true,
    createdAt: new Date('2024-01-14')
  },
  {
    id: 4,
    title: 'Помощь с ремонтом инвалиду',
    description: 'Человеку с ограниченными возможностями нужна помощь с мелким ремонтом в квартире.',
    category: 'Бытовая помощь',
    author: 'Дмитрий В.',
    contact: '+7 (987) 654-32-10',
    views: 78,
    isVip: false,
    createdAt: new Date('2024-01-17')
  }
];

const categories = ['Все категории', 'Жильё', 'Медицина', 'Бытовая помощь', 'Финансы', 'Образование'];

export default function Index() {
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [selectedCategory, setSelectedCategory] = useState('Все категории');
  const [activeTab, setActiveTab] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [totalVisits] = useState(1247);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    category: 'Бытовая помощь'
  });

  const filteredListings = listings
    .filter(l => selectedCategory === 'Все категории' || l.category === selectedCategory)
    .filter(l => {
      if (activeTab === 'my') return l.author === 'Мария К.';
      return true;
    })
    .sort((a, b) => {
      if (a.isVip && !b.isVip) return -1;
      if (!a.isVip && b.isVip) return 1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

  const handleCreateListing = () => {
    if (!newListing.title || !newListing.description) {
      toast.error('Заполните все поля');
      return;
    }
    
    toast.success('Объявление отправлено на модерацию! Для публикации переведите 10₽ на счёт 2204311315839002');
    
    setNewListing({ title: '', description: '', category: 'Бытовая помощь' });
    setIsCreateOpen(false);
  };

  const handleBoost = (id: number) => {
    toast.info('Для поднятия объявления переведите 20₽ на счёт 2204311315839002 с комментарием "Поднять #' + id + '"');
  };

  const handleVip = (id: number) => {
    toast.info('Для VIP-статуса переведите 100₽ на счёт 2204311315839002 с комментарием "VIP #' + id + '"');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Heart" className="text-primary-foreground" size={20} />
              </div>
              <h1 className="text-2xl font-heading font-bold text-foreground">Рука помощи</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Icon name="Plus" size={18} />
                    Создать объявление
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="font-heading">Новое объявление</DialogTitle>
                    <DialogDescription>
                      Стоимость публикации: 10₽. После оплаты объявление появится автоматически.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Заголовок</Label>
                      <Input
                        id="title"
                        placeholder="Кратко опишите ситуацию"
                        value={newListing.title}
                        onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Описание</Label>
                      <Textarea
                        id="description"
                        placeholder="Подробно расскажите о ситуации и необходимой помощи"
                        rows={5}
                        value={newListing.description}
                        onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Категория</Label>
                      <Select value={newListing.category} onValueChange={(v) => setNewListing({ ...newListing, category: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.filter(c => c !== 'Все категории').map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <p className="text-sm font-medium">Инструкция по оплате:</p>
                      <p className="text-sm text-muted-foreground">
                        Переведите 10₽ на Яндекс счёт: <span className="font-mono font-semibold text-foreground">2204311315839002</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        После подтверждения оплаты объявление будет опубликовано автоматически
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setIsCreateOpen(false)}>
                      Отмена
                    </Button>
                    <Button className="flex-1" onClick={handleCreateListing}>
                      Отправить
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsAdmin(!isAdmin)}
              >
                <Icon name="Settings" size={18} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isAdmin && (
          <Card className="mb-6 border-2 border-primary/20 animate-fade-in">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Icon name="BarChart3" size={20} />
                Админ-панель
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-primary/10 rounded-lg p-4 text-center">
                  <p className="text-3xl font-heading font-bold text-primary">{totalVisits}</p>
                  <p className="text-sm text-muted-foreground mt-1">Всего посещений</p>
                </div>
                <div className="bg-secondary/10 rounded-lg p-4 text-center">
                  <p className="text-3xl font-heading font-bold text-secondary">{listings.length}</p>
                  <p className="text-sm text-muted-foreground mt-1">Активных объявлений</p>
                </div>
                <div className="bg-accent/10 rounded-lg p-4 text-center">
                  <p className="text-3xl font-heading font-bold text-accent">
                    {listings.filter(l => l.isVip).length}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">VIP объявлений</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="all" className="gap-2">
              <Icon name="Grid3x3" size={16} />
              Все объявления
            </TabsTrigger>
            <TabsTrigger value="my" className="gap-2">
              <Icon name="User" size={16} />
              Мои объявления
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mb-6">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((listing, index) => (
            <Card
              key={listing.id}
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setSelectedListing(listing)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="font-heading text-lg leading-tight">
                    {listing.title}
                  </CardTitle>
                  {listing.isVip && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shrink-0">
                      <Icon name="Crown" size={12} className="mr-1" />
                      VIP
                    </Badge>
                  )}
                </div>
                <CardDescription className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <Icon name="Tag" size={12} />
                    {listing.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Eye" size={12} />
                    {listing.views} просмотров
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {listing.description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon name="User" size={12} />
                  <span>{listing.author}</span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBoost(listing.id);
                  }}
                >
                  <Icon name="TrendingUp" size={14} />
                  Поднять (20₽)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVip(listing.id);
                  }}
                  disabled={listing.isVip}
                >
                  <Icon name="Crown" size={14} />
                  {listing.isVip ? 'VIP активен' : 'VIP (100₽)'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <Icon name="Inbox" size={64} className="mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-heading text-xl text-muted-foreground mb-2">
              Объявлений не найдено
            </h3>
            <p className="text-muted-foreground">
              Попробуйте изменить фильтр или создайте первое объявление
            </p>
          </div>
        )}
      </main>

      <Dialog open={!!selectedListing} onOpenChange={() => setSelectedListing(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          {selectedListing && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-3">
                  <DialogTitle className="font-heading text-xl pr-8">
                    {selectedListing.title}
                  </DialogTitle>
                  {selectedListing.isVip && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shrink-0">
                      <Icon name="Crown" size={12} className="mr-1" />
                      VIP
                    </Badge>
                  )}
                </div>
                <DialogDescription className="flex flex-wrap items-center gap-3 text-xs pt-2">
                  <span className="flex items-center gap-1">
                    <Icon name="Tag" size={12} />
                    {selectedListing.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Eye" size={12} />
                    {selectedListing.views} просмотров
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Calendar" size={12} />
                    {selectedListing.createdAt.toLocaleDateString('ru-RU')}
                  </span>
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div>
                  <h4 className="font-heading font-semibold mb-2 flex items-center gap-2">
                    <Icon name="FileText" size={16} className="text-primary" />
                    Описание ситуации
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedListing.description}
                  </p>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-heading font-semibold mb-3 flex items-center gap-2">
                    <Icon name="User" size={16} className="text-primary" />
                    Контактная информация
                  </h4>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Автор:</span> {selectedListing.author}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Связаться:</span> {selectedListing.contact}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-heading font-semibold mb-3 flex items-center gap-2">
                    <Icon name="TrendingUp" size={16} className="text-primary" />
                    Продвижение объявления
                  </h4>
                  <div className="grid gap-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 h-auto py-3"
                      onClick={() => {
                        handleBoost(selectedListing.id);
                        setSelectedListing(null);
                      }}
                    >
                      <Icon name="TrendingUp" size={18} className="text-primary" />
                      <div className="text-left">
                        <div className="font-semibold">Поднять объявление — 20₽</div>
                        <div className="text-xs text-muted-foreground">Поднимется в начало ленты</div>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 h-auto py-3"
                      onClick={() => {
                        handleVip(selectedListing.id);
                        setSelectedListing(null);
                      }}
                      disabled={selectedListing.isVip}
                    >
                      <Icon name="Crown" size={18} className="text-orange-500" />
                      <div className="text-left">
                        <div className="font-semibold">VIP статус — 100₽</div>
                        <div className="text-xs text-muted-foreground">
                          {selectedListing.isVip ? 'VIP уже активен' : 'Неделю в топе с золотой меткой'}
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedListing(null)}>
                  Закрыть
                </Button>
                <Button className="flex-1 gap-2">
                  <Icon name="MessageCircle" size={16} />
                  Откликнуться
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <footer className="border-t mt-16 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-heading font-semibold mb-3 flex items-center gap-2">
                <Icon name="Heart" size={18} className="text-primary" />
                О платформе
              </h3>
              <p className="text-sm text-muted-foreground">
                Платформа для размещения и отклика на объявления о помощи людям в сложных жизненных ситуациях.
              </p>
            </div>
            <div>
              <h3 className="font-heading font-semibold mb-3">Контакты</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Icon name="Mail" size={14} />
                  support@example.com
                </p>
                <p className="flex items-center gap-2">
                  <Icon name="Phone" size={14} />
                  +7 (999) 123-45-67
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-heading font-semibold mb-3">Поддержка</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Icon name="MessageCircle" size={14} />
                  Написать в поддержку
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
            <p>© 2024 Рука помощи. Создано с заботой о людях.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}