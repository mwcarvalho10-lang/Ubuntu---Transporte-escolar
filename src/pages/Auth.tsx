import React, { useState } from 'react';
import { useAppContext } from '../store';
import { Bus, UserPlus, LogIn } from 'lucide-react';
import { IllustratedBackground } from '../components/IllustratedBackground';

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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <IllustratedBackground />
      
      <div className="w-full max-w-md school-card overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-accent-brown p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="w-20 h-20 bg-accent-mustard rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg">
            <Bus size={40} className="text-accent-brown" />
          </div>
          <h1 className="text-3xl font-bold text-white font-serif relative z-10">Ubuntu Escolar</h1>
          <p className="text-accent-mustard mt-2 relative z-10 font-medium">Gestão Inteligente de Transporte</p>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-school-text dark:text-dark-text mb-6 text-center font-serif">
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
                <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Nome Completo</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full px-4 py-3 rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 text-school-text dark:text-dark-text focus:border-accent-mustard focus:ring-accent-mustard transition-colors"
                />
              </div>
            )}
            
            {isLogin ? (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 text-school-text dark:text-dark-text focus:border-accent-mustard focus:ring-accent-mustard transition-colors"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Email</label>
                <div className="flex rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 focus-within:border-accent-mustard focus-within:ring-1 focus-within:ring-accent-mustard transition-colors overflow-hidden">
                  <input 
                    type="text" 
                    value={emailPrefix}
                    onChange={(e) => setEmailPrefix(e.target.value)}
                    placeholder="usuario"
                    className="w-full px-4 py-3 bg-transparent text-school-text dark:text-dark-text focus:outline-none"
                  />
                  <select 
                    value={emailDomain}
                    onChange={(e) => setEmailDomain(e.target.value)}
                    className="px-4 py-3 bg-school-bg/80 dark:bg-dark-bg/80 text-school-text dark:text-dark-text border-l border-school-sankofa/20 focus:outline-none cursor-pointer"
                  >
                    <option value="@gestao.com">@gestao.com</option>
                    <option value="@monitor.com">@monitor.com</option>
                    <option value="@admin.com">@admin.com</option>
                  </select>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 text-school-text dark:text-dark-text focus:border-accent-mustard focus:ring-accent-mustard transition-colors"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 bg-accent-mustard hover:bg-accent-terracotta text-accent-brown hover:text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
              {isLogin ? 'Entrar' : 'Cadastrar'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-school-text/60 dark:text-dark-text/60 text-sm">
              {isLogin ? 'Ainda não tem uma conta?' : 'Já possui uma conta?'}
            </p>
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="mt-2 text-accent-terracotta dark:text-accent-mustard font-bold hover:underline transition-all"
            >
              {isLogin ? 'Crie uma conta agora' : 'Faça login aqui'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
