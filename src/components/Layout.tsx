import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Bus, CheckSquare, MessageSquare, FileText, AlertTriangle, Search, Moon, Sun, Menu, X, Shield, Bell, Check, Trash, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { useAppContext, Notification } from '../store';
import { formatDistanceToNow } from 'date-fns';
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
];

export const Layout: React.FC = () => {
  const { students, currentUser, logout, notifications, markNotificationAsRead, clearNotifications } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = notifications.filter(n => !n.read).length;

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

  const searchResults = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.contact1Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.contact2Name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const handleSearchSelect = (studentId: string) => {
    setSearchQuery('');
    setShowSearchResults(false);
    navigate(`/students?search=${studentId}`);
  };

  const filteredNavItems = navItems.filter(item => {
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
      <aside className={`fixed inset-y-0 left-0 w-64 bg-accent-brown text-school-bg flex flex-col shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-mustard rounded-xl flex items-center justify-center shadow-lg">
              <Bus size={24} className="text-accent-brown" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white leading-none">Ubuntu</h1>
              <p className="text-[10px] uppercase tracking-widest text-accent-mustard font-bold mt-1">Escolar</p>
            </div>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-2 text-white/80 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-accent-mustard text-accent-brown font-semibold shadow-md translate-x-1'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-white/10 space-y-2">
          {currentUser?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-accent-mustard text-accent-brown font-semibold shadow-md translate-x-1'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Shield size={20} />
              <span>Admin</span>
            </NavLink>
          )}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-accent-mustard text-accent-brown font-semibold shadow-md translate-x-1'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Users size={20} />
            <span>Meu Perfil</span>
          </NavLink>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <X size={20} />
            <span>Sair</span>
          </button>
        </div>

        <div className="p-4 border-t border-white/10 text-center text-sm text-white/50">
          <p>Conexão África-Salvador</p>
          <p className="mt-1">© 2026 Ubuntu</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen relative w-full overflow-hidden">
        {/* Subtle overlay to make content readable over the background pattern */}
        <div className="absolute inset-0 bg-school-bg/40 dark:bg-dark-bg/60 backdrop-blur-[1px] -z-10 transition-colors duration-300"></div>
        
        {/* Top Bar with Wavy Header */}
        <div className="relative z-10">
          <svg className="absolute top-0 left-0 w-full h-24 -z-10 text-accent-terracotta dark:text-accent-brown opacity-90" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
          </svg>
          
          <header className="h-auto min-h-[5rem] py-4 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 z-20">
            <div className="flex items-center w-full sm:w-auto gap-4">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 text-white hover:bg-white/10 rounded-lg"
              >
                <Menu size={24} />
              </button>
              <div className="relative flex-1 sm:w-72 md:w-96">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 text-white/60" size={20} />
                  <input 
                    type="text"
                    placeholder="Busca global..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchResults(e.target.value.length > 0);
                    }}
                    onFocus={() => setShowSearchResults(searchQuery.length > 0)}
                    onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                    className="w-full pl-12 pr-4 py-2.5 bg-white/20 border border-white/30 rounded-full focus:outline-none focus:ring-2 focus:ring-accent-mustard text-white placeholder-white/60 backdrop-blur-md transition-all text-sm sm:text-base"
                  />
                </div>
                
                {/* Search Results Dropdown */}
                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-school-card dark:bg-dark-card rounded-2xl shadow-xl border border-school-sankofa/20 overflow-hidden z-50">
                    {searchResults.length > 0 ? (
                      <ul className="py-2">
                        {searchResults.map(student => (
                          <li key={student.id}>
                            <button 
                              onClick={() => handleSearchSelect(student.id)}
                              className="w-full text-left px-4 py-3 hover:bg-accent-mustard/10 transition-colors flex flex-col"
                            >
                              <span className="font-semibold text-school-text dark:text-dark-text">{student.name}</span>
                              <span className="text-xs text-school-text/60 dark:text-dark-text/60">
                                Resp: {student.contact1Name} / {student.contact2Name}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-4 text-center text-school-text/60 dark:text-dark-text/60 text-sm">
                        Nenhum resultado encontrado.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 self-end sm:self-auto">
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2.5 rounded-full bg-white/20 border border-white/30 text-white hover:bg-white/30 transition-colors backdrop-blur-md relative"
                  title="Notificações"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-accent-terracotta text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-accent-brown">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute top-full right-0 mt-4 w-80 sm:w-96 bg-school-card dark:bg-dark-card rounded-3xl shadow-2xl border border-school-sankofa/20 overflow-hidden z-[60] animate-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-school-sankofa/10 flex items-center justify-between bg-school-bg/50 dark:bg-dark-bg/50">
                      <h3 className="font-bold text-school-text dark:text-dark-text">Notificações</h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={clearNotifications}
                          className="p-1.5 text-school-text/40 hover:text-accent-terracotta transition-colors"
                          title="Limpar tudo"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {notifications.length > 0 ? (
                        <div className="divide-y divide-school-sankofa/10">
                          {notifications.map(notification => (
                            <div 
                              key={notification.id} 
                              onClick={() => handleNotificationClick(notification)}
                              className={`p-4 hover:bg-accent-mustard/5 transition-colors relative group cursor-pointer ${!notification.read ? 'bg-accent-mustard/10' : ''}`}
                            >
                              <div className="flex gap-3">
                                <div className="mt-1 shrink-0">
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <h4 className={`text-sm font-bold ${!notification.read ? 'text-school-text dark:text-dark-text' : 'text-school-text/60 dark:text-dark-text/60'}`}>
                                      {notification.title}
                                    </h4>
                                    <span className="text-[10px] text-school-text/40 dark:text-dark-text/40 whitespace-nowrap ml-2">
                                      {formatDistanceToNow(new Date(notification.date), { addSuffix: true, locale: ptBR })}
                                    </span>
                                  </div>
                                  <p className="text-xs text-school-text/70 dark:text-dark-text/70 mt-1 leading-relaxed">
                                    {notification.message}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-12 text-center">
                          <Bell size={40} className="mx-auto text-school-sankofa/30 mb-4" />
                          <p className="text-school-text/50 dark:text-dark-text/50 text-sm">Nenhuma notificação por aqui.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </header>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 relative">
          <div className="max-w-7xl mx-auto pb-24">
            <Outlet />
          </div>
          
          {/* Wavy Footer Overlay */}
          <svg className="absolute bottom-0 left-0 w-full h-32 -z-10 text-accent-mustard dark:text-accent-brown opacity-80" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,96L80,85.3C160,75,320,53,480,53.3C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </main>
    </div>
  );
};
