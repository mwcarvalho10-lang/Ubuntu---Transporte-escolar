import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Bus, CheckSquare, MessageSquare, FileText, AlertTriangle, Search, Moon, Sun, Menu, X, Shield } from 'lucide-react';
import { useAppContext } from '../store';

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
  const { theme, toggleTheme, students, currentUser, logout } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

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

  return (
    <div className={`flex h-screen overflow-hidden bg-transparent ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-school-blue text-white flex flex-col shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-school-yellow">Ubuntu</h1>
            <p className="cursive-accent text-xl text-white/80 mt-1">Transporte Escolar</p>
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
                    ? 'bg-school-yellow text-school-blue font-semibold shadow-md translate-x-1'
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
                    ? 'bg-school-yellow text-school-blue font-semibold shadow-md translate-x-1'
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
                  ? 'bg-school-yellow text-school-blue font-semibold shadow-md translate-x-1'
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
        <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/90 backdrop-blur-[2px] -z-10 transition-colors duration-300"></div>
        
        {/* Top Bar */}
        <header className="h-auto min-h-[5rem] py-4 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200/50 dark:border-slate-700/50 z-10">
          <div className="flex items-center w-full sm:w-auto gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <div className="relative flex-1 sm:w-72 md:w-96">
              <div className="relative flex items-center">
                <Search className="absolute left-4 text-gray-400 dark:text-slate-500" size={20} />
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
                  className="w-full pl-12 pr-4 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-school-blue dark:focus:ring-school-yellow text-gray-800 dark:text-slate-200 backdrop-blur-sm transition-all text-sm sm:text-base"
                />
              </div>
              
              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50">
                  {searchResults.length > 0 ? (
                    <ul className="py-2">
                      {searchResults.map(student => (
                        <li key={student.id}>
                          <button 
                            onClick={() => handleSearchSelect(student.id)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors flex flex-col"
                          >
                            <span className="font-semibold text-gray-900 dark:text-slate-100">{student.name}</span>
                            <span className="text-xs text-gray-500 dark:text-slate-400">
                              Resp: {student.contact1Name} / {student.contact2Name}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-slate-400 text-sm">
                      Nenhum resultado encontrado.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-auto">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors backdrop-blur-sm"
              title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
