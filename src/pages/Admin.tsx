import React from 'react';
import { useAppContext } from '../store';
import { User, Trash2, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

export const Admin: React.FC = () => {
  const { users, currentUser, deleteUser } = useAppContext();

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
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl sm:text-4xl font-bold text-school-blue dark:text-school-yellow font-serif">Gerenciamento de Usuários</h1>
        <p className="text-gray-600 dark:text-slate-400 mt-2 text-base sm:text-lg">Visualize e gerencie todos os perfis cadastrados no sistema</p>
      </header>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-100 dark:border-slate-700">
                <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">Usuário</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">Perfil</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-slate-700 text-school-blue dark:text-school-yellow rounded-full flex items-center justify-center font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-slate-100">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-slate-400">{user.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {user.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 uppercase tracking-wider">
                          <ShieldAlert size={12} /> Admin
                        </span>
                      ) : user.role === 'manager' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 uppercase tracking-wider">
                          <ShieldCheck size={12} /> Gestor
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 uppercase tracking-wider">
                          <User size={12} /> Monitor
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      disabled={user.id === currentUser?.id}
                      className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Excluir Usuário"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
