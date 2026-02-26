import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, Users, Bus, CheckSquare, MessageSquare, FileText, AlertTriangle, Menu, X, Shield, Bell, Trash, Info, AlertCircle, CheckCircle, Settings, Clock, Download } from 'lucide-react';
import { useAppContext, Notification } from '../store';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { IllustratedBackground } from './IllustratedBackground';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/students', icon: Users, label: 'Alunos' },
  { to: '/routes', icon: Bus, label: 'Rotas' },
  { to: '/attendance', icon: CheckSquare, label: 'Presença' },
  { to: '/incidents', icon: AlertTriangle, label: 'Ocorrências' },
  { to: '/communication', icon: MessageSquare, label: 'Comunicação' },
  { to: '/reports', icon: FileText, label: 'Relatórios' },
  { to: '/admin', icon: Shield, label: 'Administração' },
];

export const Layout: React.FC = () => {
  const { students, currentUser, logout, notifications, markNotificationAsRead, clearNotifications, isMonitorAccessAllowed } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = notifications.filter(n => !n.read).length;
  const accessAllowed = isMonitorAccessAllowed();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBtn(false);
    }
    setDeferredPrompt(null);
  };

  const filteredNavItems = navItems.filter(item => {
    if (item.to === '/admin') return currentUser?.role === 'admin';
    if (currentUser?.role === 'admin' || currentUser?.role === 'manager') return true;
    if (currentUser?.role === 'monitor') {
      return ['/attendance', '/incidents'].includes(item.to);
    }
    return false;
  });

  const handleNotificationClick = (notification: Notification) => {
    markNotificationAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
      setShowNotifications(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={18} className="text-green-500" />;
      case 'warning': return <AlertCircle size={18} className="text-orange-500" />;
      case 'error': return <AlertCircle size={18} className="text-red-500" />;
      default: return <Info size={18} className="text-blue-500" />;
    }
  };

  const AVATARS = [
    { id: 'afro-1', emoji: '🧑🏾‍🦱' },
    { id: 'afro-2', emoji: '🧑🏾‍' },
    { id: 'braids-1', emoji: '🧑🏾‍🦱' },
    { id: 'braids-2', emoji: '🧔🏾‍♂️' },
    { id: 'turban-1', emoji: '👳🏾‍♀️' },
    { id: 'indigenous-1', emoji: '🧑🏽‍🌾' },
    { id: 'classic-1', emoji: '👤' },
    { id: 'afro-3', emoji: '👩🏾‍🦱' },
    { id: 'afro-4', emoji: '👧🏾' },
    { id: 'hijab-1', emoji: '🧕🏾' },
    { id: 'elder-1', emoji: '👴🏾' },
    { id: 'elder-2', emoji: '👵🏾' },
  ];

  const avatar = currentUser?.avatar || 'afro-1';
  const isBase64Avatar = avatar.startsWith('data:image');
  const userAvatar = isBase64Avatar ? (
    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
  ) : (
    AVATARS.find(a => a.id === avatar)?.emoji || '👤'
  );

  return (
    <div className="flex h-screen overflow-hidden bg-transparent dark">
      <IllustratedBackground />
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-accent-brown text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-8 border-b border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-accent-mustard rounded-xl text-accent-brown">
                <Bus size={28} />
              </div>
              <h1 className="text-2xl font-bold font-serif tracking-tight">Ubuntu</h1>
            </div>
            <p className="text-accent-mustard text-xs font-bold uppercase tracking-[0.2em] opacity-80">Escolar</p>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-accent-mustard text-accent-brown font-bold shadow-lg scale-[1.02]' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-accent-brown' : 'text-accent-mustard group-hover:scale-110 transition-transform'} />
                  <span className="text-sm tracking-wide">{item.label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-brown" />}
                </Link>
              );
            })}

            {showInstallBtn && (
              <button
                onClick={handleInstallClick}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-accent-mustard hover:bg-white/10 mt-4 border border-accent-mustard/30"
              >
                <Download size={20} />
                <span className="text-sm font-bold">Instalar App</span>
              </button>
            )}
          </nav>

          <div className="p-4 border-t border-white/10 bg-black/20">
            <Link to="/profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-accent-mustard/20 flex items-center justify-center text-2xl border border-white/10 group-hover:scale-105 transition-transform">
                {userAvatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{currentUser?.name}</p>
                <p className="text-xs text-accent-mustard font-medium truncate opacity-80 uppercase tracking-tighter">
                  {currentUser?.role === 'admin' ? 'Administrador' : currentUser?.role === 'manager' ? 'Gestor' : 'Monitor'}
                </p>
              </div>
              <Settings size={18} className="text-white/40 group-hover:rotate-90 transition-transform" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Wavy Header SVG */}
        <div className="absolute top-0 left-0 w-full h-16 -z-10 opacity-20 pointer-events-none">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full preserve-aspect-none">
            <path d="M0 0H1440V80C1440 80 1080 120 720 80C360 40 0 80 0 80V0Z" fill="var(--color-accent-terracotta)" />
          </svg>
        </div>

        {/* Top Bar */}
        <header className="h-20 flex items-center justify-between px-4 sm:px-8 bg-transparent relative z-30">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors relative backdrop-blur-md"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-terracotta text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-accent-brown">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-dark-card border border-dark-sankofa/30 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 bg-accent-brown flex items-center justify-between">
                    <h3 className="font-bold text-white font-serif">Notificações</h3>
                    <button 
                      onClick={clearNotifications}
                      className="text-xs text-accent-mustard hover:underline"
                    >
                      Limpar tudo
                    </button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell size={40} className="mx-auto text-dark-text/20 mb-3" />
                        <p className="text-dark-text/40 text-sm">Nenhuma notificação por enquanto.</p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`w-full p-4 text-left border-b border-dark-sankofa/10 hover:bg-white/5 transition-colors flex gap-3 ${!n.read ? 'bg-accent-mustard/5' : ''}`}
                        >
                          <div className="mt-1 flex-shrink-0">
                            {getNotificationIcon(n.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold text-dark-text ${!n.read ? 'pr-4' : ''}`}>
                              {n.title}
                              {!n.read && <span className="absolute top-5 right-4 w-2 h-2 bg-accent-terracotta rounded-full" />}
                            </p>
                            <p className="text-xs text-dark-text/60 mt-1 line-clamp-2">{n.message}</p>
                            <p className="text-[10px] text-dark-text/40 mt-2 font-medium uppercase tracking-wider">
                              {format(new Date(n.date), "dd 'de' MMMM, HH:mm", { locale: ptBR })}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar relative">
          {!accessAllowed ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-red-900/20 rounded-full flex items-center justify-center mb-6 border-4 border-red-900/30">
                <Shield size={48} className="text-red-500 sm:w-16 sm:h-16" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-dark-text font-serif mb-4">Acesso Restrito</h2>
              <div className="max-w-md space-y-4">
                <p className="text-dark-text/70 text-base sm:text-lg leading-relaxed">
                  Olá, <span className="font-bold text-accent-mustard">{currentUser?.name}</span>. Por medidas de segurança, o acesso aos dados é permitido apenas durante o seu horário de trabalho.
                </p>
                <div className="p-4 bg-accent-brown/40 rounded-2xl border border-dark-sankofa/20 inline-block">
                  <p className="text-accent-mustard font-bold flex items-center justify-center gap-2">
                    <Clock size={20} />
                    Horário: Segunda a Sexta, das 06:00 às 18:00
                  </p>
                </div>
                <p className="text-dark-text/50 text-sm italic">
                  Seus dados estão protegidos e ficarão disponíveis novamente no próximo período de trabalho.
                </p>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Outlet />
            </div>
          )}
          
          {/* Wavy Footer SVG */}
          <div className="absolute bottom-0 left-0 w-full h-16 -z-10 opacity-10 pointer-events-none">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full preserve-aspect-none">
              <path d="M0 40C0 40 360 0 720 40C1080 80 1440 40 1440 40V120H0V40Z" fill="var(--color-accent-mustard)" />
            </svg>
          </div>
        </main>
      </div>
    </div>
  );
};
