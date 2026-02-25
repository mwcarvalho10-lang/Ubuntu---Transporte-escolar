import React, { useState } from 'react';
import { useAppContext } from '../store';
import { User, Shield, LogOut, Save } from 'lucide-react';

export const Profile: React.FC = () => {
  const { currentUser, updateProfile, logout, routes } = useAppContext();
  
  const [name, setName] = useState(currentUser?.name || '');
  const [role, setRole] = useState<'manager' | 'monitor' | null>(currentUser?.role || null);
  const [routeId, setRouteId] = useState(currentUser?.routeId || '');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, role, routeId: role === 'monitor' ? routeId : undefined });
    setSuccessMsg('Perfil atualizado com sucesso!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-school-text dark:text-dark-text font-serif">Meu Perfil</h1>
          <p className="text-school-text/60 dark:text-dark-text/60 mt-2 text-base sm:text-lg">Gerencie suas informações de conta</p>
        </div>
        <button 
          onClick={logout}
          className="w-full sm:w-auto bg-accent-terracotta/10 text-accent-terracotta hover:bg-accent-terracotta hover:text-white px-6 py-3 rounded-2xl font-semibold shadow-sm flex items-center justify-center gap-2 transition-all"
        >
          <LogOut size={20} />
          Sair da Conta
        </button>
      </header>

      <div className="school-card overflow-hidden">
        <div className="p-8 border-b border-school-sankofa/10 bg-school-bg/30 dark:bg-dark-bg/30 flex items-center gap-6">
          <div className="w-24 h-24 bg-accent-mustard/20 text-accent-terracotta dark:text-accent-mustard rounded-full flex items-center justify-center text-4xl font-bold shadow-inner">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-school-text dark:text-dark-text font-serif">{currentUser.name}</h2>
            <p className="text-school-text/60 dark:text-dark-text/60">{currentUser.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-accent-mustard/20 text-accent-brown dark:text-accent-mustard">
              <Shield size={14} />
              {currentUser.role === 'manager' ? 'Gestor' : currentUser.role === 'monitor' ? 'Monitor' : 'Não configurado'}
            </div>
          </div>
        </div>

        <div className="p-8">
          {successMsg && (
            <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-xl mb-6 text-sm font-medium border border-green-100 dark:border-green-800 flex items-center gap-2">
              <Save size={18} />
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Nome Completo</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 text-school-text dark:text-dark-text focus:border-accent-mustard focus:ring-accent-mustard transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Tipo de Perfil</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  disabled={currentUser.role !== null}
                  onClick={() => setRole('manager')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${currentUser.role !== null ? 'opacity-80 cursor-default' : 'hover:border-accent-mustard/50'} ${
                    role === 'manager' 
                      ? 'border-accent-brown bg-accent-mustard/10' 
                      : 'border-school-sankofa/10 dark:border-dark-sankofa/10'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-xl ${role === 'manager' ? 'bg-accent-brown text-white' : 'bg-school-bg/50 dark:bg-dark-bg/50 text-school-text/40'}`}>
                      <Shield size={24} />
                    </div>
                    <span className="font-bold text-school-text dark:text-dark-text">Gestor</span>
                  </div>
                  <p className="text-sm text-school-text/60 dark:text-dark-text/60">Acesso total ao sistema, relatórios e configurações.</p>
                </button>

                <button
                  type="button"
                  disabled={currentUser.role !== null}
                  onClick={() => setRole('monitor')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${currentUser.role !== null ? 'opacity-80 cursor-default' : 'hover:border-accent-mustard/50'} ${
                    role === 'monitor' 
                      ? 'border-accent-brown bg-accent-mustard/10' 
                      : 'border-school-sankofa/10 dark:border-dark-sankofa/10'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-xl ${role === 'monitor' ? 'bg-accent-brown text-white' : 'bg-school-bg/50 dark:bg-dark-bg/50 text-school-text/40'}`}>
                      <User size={24} />
                    </div>
                    <span className="font-bold text-school-text dark:text-dark-text">Monitor</span>
                  </div>
                  <p className="text-sm text-school-text/60 dark:text-dark-text/60">Acesso restrito à sua rota para lista de presença.</p>
                </button>
              </div>
              {currentUser.role !== null && (
                <p className="text-xs text-school-text/40 dark:text-dark-text/40 mt-2">
                  O tipo de perfil é definido pelo seu email de cadastro e não pode ser alterado.
                </p>
              )}
            </div>

            {role === 'monitor' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Sua Rota</label>
                <select 
                  value={routeId}
                  onChange={(e) => setRouteId(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 text-school-text dark:text-dark-text focus:border-accent-mustard focus:ring-accent-mustard transition-colors"
                >
                  <option value="">Selecione a rota que você monitora...</option>
                  {routes.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="pt-6 border-t border-school-sankofa/10 dark:border-dark-sankofa/10">
              <button 
                type="submit"
                disabled={!role || (role === 'monitor' && !routeId)}
                className="w-full sm:w-auto px-8 py-3.5 bg-accent-mustard hover:bg-accent-terracotta text-accent-brown hover:text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save size={20} />
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
