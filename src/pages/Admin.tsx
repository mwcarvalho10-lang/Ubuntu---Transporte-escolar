import React, { useState } from 'react';
import { useAppContext } from '../store';
import { User, Trash2, Shield, ShieldAlert, ShieldCheck, Calendar, Save } from 'lucide-react';

export const Admin: React.FC = () => {
  const { users, currentUser, deleteUser, schoolYearPeriod, updateSchoolYearPeriod, addNotification } = useAppContext();
  const [startDate, setStartDate] = useState(schoolYearPeriod?.startDate || '');
  const [endDate, setEndDate] = useState(schoolYearPeriod?.endDate || '');

  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <ShieldAlert size={64} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Acesso Negado</h2>
          <p className="text-gray-500 dark:text-slate-400">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  const handleDeleteUser = (id: string, name: string) => {
    if (id === currentUser.id) {
      alert("Você não pode excluir seu próprio perfil.");
      return;
    }
    if (window.confirm(`Tem certeza que deseja excluir o perfil de ${name}?`)) {
      deleteUser(id);
      addNotification({
        title: 'Usuário Excluído',
        message: `O perfil de ${name} foi removido do sistema por um administrador.`,
        type: 'warning'
      });
    }
  };

  const handleSavePeriod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert("Por favor, preencha ambas as datas.");
      return;
    }
    updateSchoolYearPeriod({ startDate, endDate });
    addNotification({
      title: 'Ano Letivo Atualizado',
      message: `O período do ano letivo foi atualizado para ${startDate} até ${endDate}.`,
      type: 'success'
    });
    alert("Período do ano letivo atualizado com sucesso!");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl sm:text-4xl font-bold text-school-text dark:text-dark-text font-serif">Gerenciamento do Sistema</h1>
        <p className="text-school-text/60 dark:text-dark-text/60 mt-2 text-base sm:text-lg">Configure o ano letivo e gerencie os perfis cadastrados</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="school-card p-8 sticky top-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-accent-mustard/10 text-accent-terracotta dark:text-accent-mustard rounded-2xl">
                <Calendar size={24} />
              </div>
              <h2 className="text-xl font-bold text-school-text dark:text-dark-text font-serif">Ano Letivo</h2>
            </div>
            
            <form onSubmit={handleSavePeriod} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Data de Início</label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 text-school-text dark:text-dark-text focus:border-accent-mustard focus:ring-accent-mustard"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Data de Término</label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 text-school-text dark:text-dark-text focus:border-accent-mustard focus:ring-accent-mustard"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3.5 bg-accent-mustard hover:bg-accent-terracotta text-accent-brown hover:text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Save size={20} />
                Salvar Período
              </button>
            </form>
            
            <div className="mt-8 p-4 bg-accent-mustard/10 rounded-2xl border border-accent-mustard/20">
              <p className="text-xs text-accent-brown dark:text-accent-mustard leading-relaxed">
                <strong>Dica:</strong> O período definido aqui afetará a disponibilidade do sistema de presença e os cálculos nos relatórios.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="school-card overflow-hidden">
            <div className="p-6 border-b border-school-sankofa/10 bg-school-bg/30 dark:bg-dark-bg/30">
              <h2 className="text-xl font-bold text-school-text dark:text-dark-text font-serif">Usuários Cadastrados</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-school-bg/50 dark:bg-dark-bg/50 border-b border-school-sankofa/10">
                    <th className="px-6 py-4 text-sm font-bold text-school-text/50 dark:text-dark-text/50 uppercase tracking-wider">Usuário</th>
                    <th className="px-6 py-4 text-sm font-bold text-school-text/50 dark:text-dark-text/50 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-sm font-bold text-school-text/50 dark:text-dark-text/50 uppercase tracking-wider">Perfil</th>
                    <th className="px-6 py-4 text-sm font-bold text-school-text/50 dark:text-dark-text/50 uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-school-sankofa/10 dark:divide-dark-sankofa/10">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-accent-mustard/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-accent-mustard/20 text-accent-terracotta dark:text-accent-mustard rounded-full flex items-center justify-center font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-school-text dark:text-dark-text">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-school-text/60 dark:text-dark-text/60">{user.email}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {user.role === 'admin' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent-terracotta/10 text-accent-terracotta dark:bg-accent-terracotta/20 dark:text-accent-terracotta uppercase tracking-wider">
                              <ShieldAlert size={12} /> Admin
                            </span>
                          ) : user.role === 'manager' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent-mustard/10 text-accent-brown dark:bg-accent-mustard/20 dark:text-accent-mustard uppercase tracking-wider">
                              <ShieldCheck size={12} /> Gestor
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-school-bg dark:bg-dark-bg text-school-text/60 dark:text-dark-text/60 uppercase tracking-wider border border-school-sankofa/20">
                              <User size={12} /> Monitor
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          disabled={user.id === currentUser?.id}
                          className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl disabled:opacity-10 disabled:cursor-not-allowed transition-all shadow-sm"
                          title="Excluir Usuário"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
