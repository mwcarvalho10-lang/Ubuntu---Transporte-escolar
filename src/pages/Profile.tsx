import React, { useState } from 'react';
import { useAppContext } from '../store';
import { User, Mail, Shield, Save, Camera, LogOut } from 'lucide-react';

const AVATARS = [
  { id: 'afro-1', label: 'Crespo Curto', emoji: '🧑🏾‍🦱' },
  { id: 'afro-2', label: 'Black Power', emoji: '🧑🏾‍' },
  { id: 'braids-1', label: 'Tranças Nagô', emoji: '🧑🏾‍🦱' },
  { id: 'braids-2', label: 'Dreadlocks', emoji: '🧔🏾‍♂️' },
  { id: 'turban-1', label: 'Turbante', emoji: '👳🏾‍♀️' },
  { id: 'indigenous-1', label: 'Indígena', emoji: '🧑🏽‍🌾' },
  { id: 'classic-1', label: 'Clássico', emoji: '👤' },
  { id: 'afro-3', label: 'Crespo Longo', emoji: '👩🏾‍🦱' },
  { id: 'afro-4', label: 'Afro Puff', emoji: '👧🏾' },
  { id: 'hijab-1', label: 'Hijab', emoji: '🧕🏾' },
  { id: 'elder-1', label: 'Ancião', emoji: '👴🏾' },
  { id: 'elder-2', label: 'Anciã', emoji: '👵🏾' },
];

export const Profile: React.FC = () => {
  const { currentUser, updateProfile, logout } = useAppContext();
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || 'afro-1');
  const [securityQuestion, setSecurityQuestion] = useState(currentUser?.securityQuestion || '');
  const [securityAnswer, setSecurityAnswer] = useState(currentUser?.securityAnswer || '');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email, avatar, securityQuestion, securityAnswer });
    setMessage('Perfil atualizado com sucesso!');
    setIsEditing(false);
    setTimeout(() => setMessage(''), 3000);
  };

  if (!currentUser) return null;

  const isBase64Avatar = avatar.startsWith('data:image');

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-school-text dark:text-dark-text font-serif">Meu Perfil</h1>
          <p className="text-school-text/60 dark:text-dark-text/60">Gerencie suas informações pessoais e segurança</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-accent-mustard text-accent-brown font-bold rounded-xl hover:bg-accent-terracotta hover:text-white transition-all shadow-md flex items-center justify-center gap-2"
            >
              Editar Perfil
            </button>
          )}
          <button 
            onClick={logout}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-accent-terracotta/10 text-accent-terracotta hover:bg-accent-terracotta hover:text-white rounded-xl font-semibold shadow-sm flex items-center justify-center gap-2 transition-all"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </header>

      {message && (
        <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-xl mb-6 font-medium border border-green-200 dark:border-green-800 animate-in fade-in slide-in-from-top-2">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Avatar Selection Card */}
        <div className="lg:col-span-1">
          <div className="school-card p-6 sm:p-8 text-center sticky top-24">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 sm:w-40 sm:h-40 bg-accent-mustard/20 rounded-full flex items-center justify-center text-6xl sm:text-7xl shadow-inner border-4 border-accent-mustard/30 overflow-hidden">
                {isBase64Avatar ? (
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  AVATARS.find(a => a.id === avatar)?.emoji || '👤'
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-2 right-2 p-2 bg-accent-terracotta text-white rounded-full shadow-lg border-2 border-white dark:border-dark-card cursor-pointer hover:scale-110 transition-transform">
                  <Camera size={20} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
              )}
            </div>
            <h2 className="text-xl font-bold text-school-text dark:text-dark-text font-serif mb-1">{currentUser.name}</h2>
            <p className="text-accent-terracotta font-bold text-sm uppercase tracking-wider mb-6">
              {currentUser.role === 'admin' ? 'Administrador' : currentUser.role === 'manager' ? 'Gestor' : currentUser.role === 'monitor' ? 'Monitor' : 'Usuário'}
            </p>

            {isEditing && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-school-text/50 dark:text-dark-text/50 uppercase tracking-widest">Escolha seu Avatar</p>
                  <label className="text-[10px] font-bold text-accent-terracotta uppercase cursor-pointer hover:underline">
                    Ou envie foto
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </label>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {AVATARS.map((av) => (
                    <button
                      key={av.id}
                      onClick={() => setAvatar(av.id)}
                      className={`w-full aspect-square flex items-center justify-center text-2xl rounded-xl transition-all ${
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
          </div>
        </div>

        {/* Form Card */}
        <div className="lg:col-span-2">
          <div className="school-card p-6 sm:p-8">
            <form onSubmit={handleSave} className="space-y-6 sm:space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-school-sankofa/10">
                  <User className="text-accent-mustard" size={20} />
                  <h3 className="font-bold text-school-text dark:text-dark-text font-serif">Informações Básicas</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Nome Completo</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 text-school-text dark:text-dark-text focus:border-accent-mustard focus:ring-accent-mustard transition-all outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-school-text/40 dark:text-dark-text/40" size={18} />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 text-school-text dark:text-dark-text focus:border-accent-mustard focus:ring-accent-mustard transition-all outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-school-sankofa/10">
                  <Shield className="text-accent-mustard" size={20} />
                  <h3 className="font-bold text-school-text dark:text-dark-text font-serif">Segurança e Recuperação</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Pergunta de Segurança</label>
                    <select 
                      value={securityQuestion}
                      onChange={(e) => setSecurityQuestion(e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 text-school-text dark:text-dark-text focus:border-accent-mustard focus:ring-accent-mustard transition-all outline-none disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                    >
                      <option value="" className="bg-school-bg dark:bg-dark-bg text-school-text dark:text-dark-text">Selecione uma pergunta...</option>
                      <option value="Qual o nome do seu primeiro animal de estimação?" className="bg-school-bg dark:bg-dark-bg text-school-text dark:text-dark-text">Qual o nome do seu primeiro animal de estimação?</option>
                      <option value="Qual a cidade onde você nasceu?" className="bg-school-bg dark:bg-dark-bg text-school-text dark:text-dark-text">Qual a cidade onde você nasceu?</option>
                      <option value="Qual o nome da sua primeira escola?" className="bg-school-bg dark:bg-dark-bg text-school-text dark:text-dark-text">Qual o nome da sua primeira escola?</option>
                      <option value="Qual a sua comida favorita?" className="bg-school-bg dark:bg-dark-bg text-school-text dark:text-dark-text">Qual a sua comida favorita?</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Resposta de Segurança</label>
                    <input 
                      type="text" 
                      value={securityAnswer}
                      onChange={(e) => setSecurityAnswer(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Sua resposta secreta"
                      className="w-full px-4 py-3 rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 text-school-text dark:text-dark-text focus:border-accent-mustard focus:ring-accent-mustard transition-all outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                  <button 
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 bg-accent-terracotta text-white font-bold rounded-xl hover:bg-accent-brown transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    Salvar Alterações
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setName(currentUser?.name || '');
                      setEmail(currentUser?.email || '');
                      setAvatar(currentUser?.avatar || 'afro-1');
                      setSecurityQuestion(currentUser?.securityQuestion || '');
                      setSecurityAnswer(currentUser?.securityAnswer || '');
                    }}
                    className="w-full sm:w-auto px-8 py-3 bg-school-bg dark:bg-dark-bg text-school-text dark:text-dark-text font-bold rounded-xl border border-school-sankofa/20 hover:bg-school-sankofa/10 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
