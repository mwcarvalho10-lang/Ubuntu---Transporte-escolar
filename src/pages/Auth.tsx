import React, { useState } from 'react';
import { useAppContext } from '../store';
import { Bus, UserPlus, LogIn, HelpCircle, Key, ArrowLeft } from 'lucide-react';
import { IllustratedBackground } from '../components/IllustratedBackground';

export const Auth: React.FC = () => {
  const { login, register, resetPassword, users } = useAppContext();
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [emailPrefix, setEmailPrefix] = useState('');
  const [emailDomain, setEmailDomain] = useState('@gestao.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [avatar, setAvatar] = useState('afro-1');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const AVATARS = [
    { id: 'afro-1', emoji: '🧑🏾‍🦱', label: 'Crespo Curto' },
    { id: 'afro-2', emoji: '🧑🏾‍', label: 'Crespo Médio' },
    { id: 'braids-1', emoji: '🧑🏾‍🦱', label: 'Tranças' },
    { id: 'braids-2', emoji: '🧔🏾‍♂️', label: 'Barba Afro' },
    { id: 'turban-1', emoji: '👳🏾‍♀️', label: 'Turbante' },
    { id: 'indigenous-1', emoji: '🧑🏽‍🌾', label: 'Indígena' },
    { id: 'classic-1', emoji: '👤', label: 'Silhueta' },
    { id: 'afro-3', emoji: '👩🏾‍🦱', label: 'Crespo Longo' },
    { id: 'afro-4', emoji: '👧🏾', label: 'Afro Puff' },
    { id: 'hijab-1', emoji: '🧕🏾', label: 'Hijab' },
    { id: 'elder-1', emoji: '👴🏾', label: 'Ancião' },
    { id: 'elder-2', emoji: '👵🏾', label: 'Anciã' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (authMode === 'login') {
      if (!email || !password) {
        setError('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
      const success = login(email, password);
      if (!success) {
        setError('Email ou senha incorretos.');
      }
    } else if (authMode === 'register') {
      if (!emailPrefix || !password || !name || !securityQuestion || !securityAnswer) {
        setError('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
      if (password !== confirmPassword) {
        setError('As senhas não coincidem.');
        return;
      }
      
      if (emailDomain === '@admin.com' && accessCode !== 'Admin123') {
        setError('Senha de autorização para Administrador incorreta.');
        return;
      }
      if (emailDomain === '@gestao.com' && accessCode !== 'Gestor123') {
        setError('Senha de autorização para Gestor incorreta.');
        return;
      }

      const fullEmail = `${emailPrefix}${emailDomain}`;
      let role: 'admin' | 'manager' | 'monitor' = 'monitor';
      if (emailDomain === '@admin.com') role = 'admin';
      else if (emailDomain === '@gestao.com') role = 'manager';
      
      const result = register(fullEmail, name, password, role, securityQuestion, securityAnswer, avatar);
      if (!result.success) {
        setError(result.error || 'Erro ao criar conta.');
      }
    }
 else if (authMode === 'forgot') {
      if (!email || !securityAnswer || !password) {
        setError('Por favor, preencha todos os campos.');
        return;
      }
      if (password !== confirmPassword) {
        setError('As senhas não coincidem.');
        return;
      }
      const result = resetPassword(email, securityAnswer, password);
      if (result.success) {
        setSuccess('Senha redefinida com sucesso! Faça login agora.');
        setTimeout(() => setAuthMode('login'), 2000);
      } else {
        setError(result.error || 'Erro ao redefinir senha.');
      }
    }
  };

  const getSecurityQuestionForEmail = () => {
    const user = users.find(u => u.email === email);
    return user?.securityQuestion || 'Qual o nome do seu primeiro animal de estimação?';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <IllustratedBackground />
      
      <div className="w-full max-w-lg school-card overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-accent-brown p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-accent-mustard rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg">
            <Bus size={32} className="text-accent-brown sm:w-10 sm:h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif relative z-10">Ubuntu Escolar</h1>
          <p className="text-accent-mustard mt-1 sm:mt-2 relative z-10 font-medium text-sm sm:text-base">Gestão Inteligente de Transporte</p>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-center mb-6 relative">
            {authMode !== 'login' && (
              <button 
                onClick={() => setAuthMode('login')}
                className="absolute left-0 p-2 text-school-text/60 dark:text-dark-text/60 hover:text-accent-mustard transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-xl sm:text-2xl font-bold text-school-text dark:text-dark-text font-serif">
              {authMode === 'login' ? 'Bem-vindo de volta!' : 
               authMode === 'register' ? 'Crie sua conta' : 'Recuperar Senha'}
            </h2>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm text-center font-medium border border-red-100 dark:border-red-800 animate-in shake duration-300">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-xl mb-6 text-sm text-center font-medium border border-green-100 dark:border-green-800">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {authMode === 'register' && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Nome Completo</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full px-4 py-3 rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 text-school-text dark:text-dark-text focus:border-accent-mustard focus:ring-accent-mustard transition-colors outline-none"
                />
              </div>
            )}
            
            {authMode !== 'register' ? (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 text-school-text dark:text-dark-text focus:border-accent-mustard focus:ring-accent-mustard transition-colors outline-none"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Email</label>
                <div className="flex flex-col sm:flex-row rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 focus-within:border-accent-mustard focus-within:ring-1 focus-within:ring-accent-mustard transition-colors overflow-hidden">
                  <input 
                    type="text" 
                    value={emailPrefix}
                    onChange={(e) => setEmailPrefix(e.target.value)}
                    placeholder="usuario"
                    className="flex-1 px-4 py-3 bg-transparent text-school-text dark:text-dark-text focus:outline-none"
                  />
                  <select 
                    value={emailDomain}
                    onChange={(e) => setEmailDomain(e.target.value)}
                    className="px-4 py-3 bg-school-bg/80 dark:bg-dark-bg/80 text-school-text dark:text-dark-text border-t sm:border-t-0 sm:border-l border-school-sankofa/20 focus:outline-none cursor-pointer text-sm"
                  >
                    <option value="@gestao.com">@gestao.com</option>
                    <option value="@monitor.com">@monitor.com</option>
                    <option value="@admin.com">@admin.com</option>
                  </select>
                </div>
              </div>
            )}

            {authMode === 'forgot' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Pergunta de Segurança</label>
                <div className="p-3 bg-accent-mustard/10 rounded-xl text-sm text-school-text dark:text-dark-text italic">
                  {getSecurityQuestionForEmail()}
                </div>
                <input 
                  type="text" 
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  placeholder="Sua resposta"
                  className="w-full px-4 py-3 rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 text-school-text dark:text-dark-text focus:border-accent-mustard focus:ring-accent-mustard transition-colors outline-none"
                />
              </div>
            )}

            {authMode === 'register' && (emailDomain === '@admin.com' || emailDomain === '@gestao.com') && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">
                  Senha de Autorização ({emailDomain === '@admin.com' ? 'Admin' : 'Gestor'})
                </label>
                <input 
                  type="password" 
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Digite a senha de autorização"
                  className="w-full px-4 py-3 rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 text-school-text dark:text-dark-text focus:border-accent-mustard focus:ring-accent-mustard transition-colors outline-none"
                />
              </div>
            )}

            {authMode === 'register' && (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Escolha seu Avatar</p>
                <div className="grid grid-cols-6 gap-2">
                  {AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setAvatar(av.id)}
                      className={`aspect-square flex items-center justify-center text-xl rounded-lg transition-all ${
                        avatar === av.id 
                        ? 'bg-accent-mustard ring-2 ring-accent-terracotta shadow-md scale-110 z-10' 
                        : 'bg-school-bg/50 dark:bg-dark-bg/50 hover:bg-accent-mustard/30'
                      }`}
                      title={av.label}
                    >
                      {av.emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {authMode === 'register' && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Pergunta de Segurança</label>
                <select 
                  value={securityQuestion}
                  onChange={(e) => setSecurityQuestion(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 text-school-text dark:text-dark-text focus:border-accent-mustard focus:ring-accent-mustard transition-colors outline-none text-sm"
                >
                  <option value="" className="bg-school-bg dark:bg-dark-bg text-school-text dark:text-dark-text">Selecione uma pergunta...</option>
                  <option value="Qual o nome do seu primeiro animal de estimação?" className="bg-school-bg dark:bg-dark-bg text-school-text dark:text-dark-text">Qual o nome do seu primeiro animal de estimação?</option>
                  <option value="Qual a cidade onde você nasceu?" className="bg-school-bg dark:bg-dark-bg text-school-text dark:text-dark-text">Qual a cidade onde você nasceu?</option>
                  <option value="Qual o nome da sua primeira escola?" className="bg-school-bg dark:bg-dark-bg text-school-text dark:text-dark-text">Qual o nome da sua primeira escola?</option>
                  <option value="Qual a sua comida favorita?" className="bg-school-bg dark:bg-dark-bg text-school-text dark:text-dark-text">Qual a sua comida favorita?</option>
                </select>
                <input 
                  type="text" 
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  placeholder="Sua resposta"
                  className="w-full px-4 py-3 rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 text-school-text dark:text-dark-text focus:border-accent-mustard focus:ring-accent-mustard transition-colors outline-none"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">
                {authMode === 'forgot' ? 'Nova Senha' : 'Senha'}
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 text-school-text dark:text-dark-text focus:border-accent-mustard focus:ring-accent-mustard transition-colors outline-none"
              />
            </div>

            {(authMode === 'register' || authMode === 'forgot') && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Confirmar Senha</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 text-school-text dark:text-dark-text focus:border-accent-mustard focus:ring-accent-mustard transition-colors outline-none"
                />
              </div>
            )}

            {authMode === 'login' && (
              <div className="text-right">
                <button 
                  type="button"
                  onClick={() => setAuthMode('forgot')}
                  className="text-xs font-semibold text-accent-terracotta hover:text-accent-mustard transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-3.5 bg-accent-mustard hover:bg-accent-terracotta text-accent-brown hover:text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
            >
              {authMode === 'login' ? <LogIn size={20} /> : 
               authMode === 'register' ? <UserPlus size={20} /> : <Key size={20} />}
              {authMode === 'login' ? 'Entrar' : 
               authMode === 'register' ? 'Cadastrar' : 'Redefinir Senha'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-school-text/60 dark:text-dark-text/60 text-sm">
              {authMode === 'login' ? 'Ainda não tem uma conta?' : 'Já possui uma conta?'}
            </p>
            <button 
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'register' : 'login');
                setError('');
                setSuccess('');
              }}
              className="mt-2 text-accent-terracotta dark:text-accent-mustard font-bold hover:underline transition-all"
            >
              {authMode === 'login' ? 'Crie uma conta agora' : 'Faça login aqui'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
