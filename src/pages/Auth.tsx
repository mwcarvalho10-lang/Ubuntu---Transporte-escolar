import React, { useState } from 'react';
import { useAppContext } from '../store';
import { Bus, UserPlus, LogIn } from 'lucide-react';

export const Auth: React.FC = () => {
  const { login, register } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [emailPrefix, setEmailPrefix] = useState('');
  const [emailDomain, setEmailDomain] = useState('@gestao.com');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (!email || !password) {
        setError('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
      const success = login(email, password);
      if (!success) {
        setError('Email ou senha incorretos.');
      }
    } else {
      if (!emailPrefix || !password || !name) {
        setError('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
      const fullEmail = `${emailPrefix}${emailDomain}`;
      let role: 'admin' | 'manager' | 'monitor' = 'monitor';
      if (emailDomain === '@admin.com') role = 'admin';
      else if (emailDomain === '@gestao.com') role = 'manager';
      
      const result = register(fullEmail, name, password, role);
      if (!result.success) {
        setError(result.error || 'Erro ao criar conta.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700">
        <div className="bg-school-blue p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="w-20 h-20 bg-school-yellow rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg">
            <Bus size={40} className="text-school-blue" />
          </div>
          <h1 className="text-3xl font-bold text-white font-serif relative z-10">RotaEscolar</h1>
          <p className="text-blue-100 mt-2 relative z-10">Gestão Inteligente de Transporte</p>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6 text-center">
            {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
          </h2>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm text-center font-medium border border-red-100 dark:border-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Nome Completo</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:border-school-blue dark:focus:border-school-yellow focus:ring-school-blue dark:focus:ring-school-yellow transition-colors"
                />
              </div>
            )}
            
            {isLogin ? (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:border-school-blue dark:focus:border-school-yellow focus:ring-school-blue dark:focus:ring-school-yellow transition-colors"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Email</label>
                <div className="flex rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus-within:border-school-blue dark:focus-within:border-school-yellow focus-within:ring-1 focus-within:ring-school-blue dark:focus-within:ring-school-yellow transition-colors overflow-hidden">
                  <input 
                    type="text" 
                    value={emailPrefix}
                    onChange={(e) => setEmailPrefix(e.target.value)}
                    placeholder="usuario"
                    className="w-full px-4 py-3 bg-transparent text-gray-900 dark:text-slate-100 focus:outline-none"
                  />
                  <select 
                    value={emailDomain}
                    onChange={(e) => setEmailDomain(e.target.value)}
                    className="px-4 py-3 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-l border-gray-200 dark:border-slate-600 focus:outline-none cursor-pointer"
                  >
                    <option value="@gestao.com">@gestao.com</option>
                    <option value="@monitor.com">@monitor.com</option>
                    <option value="@admin.com">@admin.com</option>
                  </select>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  {emailDomain === '@admin.com' ? 'Acesso total e gerenciamento de usuários.' : emailDomain === '@gestao.com' ? 'Acesso total ao sistema.' : 'Acesso restrito a presença e ocorrências.'}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:border-school-blue dark:focus:border-school-yellow focus:ring-school-blue dark:focus:ring-school-yellow transition-colors"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 bg-school-yellow hover:bg-school-yellow-hover text-school-blue font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
              {isLogin ? 'Entrar' : 'Cadastrar'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-slate-400 text-sm">
              {isLogin ? 'Ainda não tem uma conta?' : 'Já possui uma conta?'}
            </p>
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="mt-2 text-school-blue dark:text-school-yellow font-semibold hover:underline transition-all"
            >
              {isLogin ? 'Crie uma conta agora' : 'Faça login aqui'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
