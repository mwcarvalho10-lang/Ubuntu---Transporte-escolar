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
          <h1 className="text-3xl sm:text-4xl font-bold text-school-blue dark:text-school-yellow font-serif">Meu Perfil</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-2 text-base sm:text-lg">Gerencie suas informações de conta</p>
        </div>
        <button 
          onClick={logout}
          className="w-full sm:w-auto bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white px-6 py-3 rounded-2xl font-semibold shadow-sm flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut size={20} />
          Sair da Conta
        </button>
      </header>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="p-8 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 flex items-center gap-6">
          <div className="w-24 h-24 bg-blue-100 dark:bg-slate-700 text-school-blue dark:text-school-yellow rounded-full flex items-center justify-center text-4xl font-bold shadow-inner">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 font-serif">{currentUser.name}</h2>
            <p className="text-gray-500 dark:text-slate-400">{currentUser.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-school-yellow/20 text-school-blue dark:text-school-yellow">
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
              <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Nome Completo</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:border-school-blue dark:focus:border-school-yellow focus:ring-school-blue dark:focus:ring-school-yellow transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Tipo de Perfil</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  disabled={currentUser.role !== null}
                  onClick={() => setRole('manager')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${currentUser.role !== null ? 'opacity-80 cursor-default' : 'hover:border-school-blue/50 dark:hover:border-school-yellow/50'} ${
                    role === 'manager' 
                      ? 'border-school-blue dark:border-school-yellow bg-blue-50 dark:bg-slate-700/50' 
                      : 'border-gray-200 dark:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-xl ${role === 'manager' ? 'bg-school-blue text-white dark:bg-school-yellow dark:text-school-blue' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400'}`}>
                      <Shield size={24} />
                    </div>
                    <span className="font-bold text-gray-900 dark:text-slate-100">Gestor</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Acesso total ao sistema, relatórios e configurações.</p>
                </button>

                <button
                  type="button"
                  disabled={currentUser.role !== null}
                  onClick={() => setRole('monitor')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${currentUser.role !== null ? 'opacity-80 cursor-default' : 'hover:border-school-blue/50 dark:hover:border-school-yellow/50'} ${
                    role === 'monitor' 
                      ? 'border-school-blue dark:border-school-yellow bg-blue-50 dark:bg-slate-700/50' 
                      : 'border-gray-200 dark:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-xl ${role === 'monitor' ? 'bg-school-blue text-white dark:bg-school-yellow dark:text-school-blue' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400'}`}>
                      <User size={24} />
                    </div>
                    <span className="font-bold text-gray-900 dark:text-slate-100">Monitor</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Acesso restrito à sua rota para lista de presença.</p>
                </button>
              </div>
              {currentUser.role !== null && (
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
                  O tipo de perfil é definido pelo seu email de cadastro e não pode ser alterado.
                </p>
              )}
            </div>

            {role === 'monitor' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Sua Rota</label>
                <select 
                  value={routeId}
                  onChange={(e) => setRouteId(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:border-school-blue dark:focus:border-school-yellow focus:ring-school-blue dark:focus:ring-school-yellow transition-colors"
                >
                  <option value="">Selecione a rota que você monitora...</option>
                  {routes.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="pt-6 border-t border-gray-100 dark:border-slate-700">
              <button 
                type="submit"
                disabled={!role || (role === 'monitor' && !routeId)}
                className="w-full sm:w-auto px-8 py-3.5 bg-school-blue dark:bg-school-yellow text-white dark:text-school-blue font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
