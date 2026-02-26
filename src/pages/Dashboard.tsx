import React, { useMemo } from 'react';
import { useAppContext, Notification } from '../store';
import { format, isWithinInterval, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Users, Bus, CheckCircle, AlertCircle, Bell, X, Calendar, Info, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { students, routes, attendance, incidents, schoolYearPeriod, notifications, markNotificationAsRead } = useAppContext();
  const navigate = useNavigate();
  
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayDate = new Date();

  const isWithinPeriod = useMemo(() => {
    if (!schoolYearPeriod) return true;
    try {
      return isWithinInterval(todayDate, {
        start: parseISO(schoolYearPeriod.startDate),
        end: parseISO(schoolYearPeriod.endDate)
      });
    } catch (e) {
      return true;
    }
  }, [schoolYearPeriod, todayDate]);
  
  const todayAttendance = useMemo(() => {
    return attendance.filter(a => a.date === today);
  }, [attendance, today]);

  const todayIncidents = useMemo(() => {
    return incidents.filter(i => i.date.startsWith(today));
  }, [incidents, today]);

  const todayNewStudents = useMemo(() => {
    return students.filter(s => s.createdAt && s.createdAt.startsWith(today));
  }, [students, today]);

  const recentNotifications = useMemo(() => {
    return notifications.slice(0, 4);
  }, [notifications]);

  const handleNotificationClick = (notification: Notification) => {
    markNotificationAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const stats = useMemo(() => {
    const activeStudents = students.filter(s => s.active);
    const totalStudents = activeStudents.length;
    const totalRoutes = routes.length;
    const boarded = todayAttendance.filter(a => a.boarding).length;
    const alighted = todayAttendance.filter(a => a.alighting).length;
    const incidentsCount = todayIncidents.length;
    
    return {
      totalStudents,
      totalRoutes,
      boarded,
      alighted,
      incidentsCount,
      pendingBoarding: Math.max(0, totalStudents - boarded),
      pendingAlighting: Math.max(0, totalStudents - alighted),
    };
  }, [students, routes, todayAttendance, todayIncidents]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {!isWithinPeriod && (
        <div className="bg-orange-500 text-white px-6 py-4 rounded-3xl shadow-xl flex items-center justify-between animate-in slide-in-from-top-4 border-4 border-orange-600/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Calendar className="animate-pulse" size={32} />
            </div>
            <div>
              <p className="font-bold text-xl">Fora do Período Letivo</p>
              <p className="text-orange-50 opacity-90">O sistema está em modo de visualização. O ano letivo definido é de {schoolYearPeriod?.startDate} até {schoolYearPeriod?.endDate}.</p>
            </div>
          </div>
        </div>
      )}

      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-school-text dark:text-dark-text font-serif">Painel de Controle</h1>
          <p className="text-school-text/60 dark:text-dark-text/60 mt-2 text-base sm:text-lg">
            Visão geral de hoje, {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
        <div className="bg-accent-mustard text-accent-brown px-6 py-2 rounded-full font-semibold shadow-md text-sm sm:text-base">
          Sincronizado
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard 
          title="Total de Alunos" 
          value={stats.totalStudents} 
          icon={Users} 
          color="bg-accent-mustard/10 text-accent-brown dark:text-accent-mustard" 
        />
        <StatCard 
          title="Rotas Ativas" 
          value={stats.totalRoutes} 
          icon={Bus} 
          color="bg-accent-terracotta/10 text-accent-terracotta" 
        />
        <StatCard 
          title="Embarcaram Hoje" 
          value={stats.boarded} 
          subtitle={`${stats.pendingBoarding} pendentes`}
          icon={CheckCircle} 
          color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" 
        />
        <StatCard 
          title="Desembarcaram Hoje" 
          value={stats.alighted} 
          subtitle={`${stats.pendingAlighting} pendentes`}
          icon={CheckCircle} 
          color="bg-accent-brown/10 text-accent-brown dark:text-accent-mustard" 
        />
        <StatCard 
          title="Ocorrências Hoje" 
          value={stats.incidentsCount} 
          icon={AlertCircle} 
          color="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="school-card p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group min-h-[300px]">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-mustard via-transparent to-transparent group-hover:opacity-20 transition-opacity duration-700"></div>
          <h2 className="text-5xl font-bold text-accent-mustard mb-6 font-serif relative z-10">Ubuntu</h2>
          <p className="text-2xl text-school-text/90 dark:text-dark-text/90 font-light italic relative z-10 max-w-md leading-relaxed">
            "Eu sou porque nós somos."
          </p>
          <div className="mt-8 w-16 h-1 bg-accent-mustard rounded-full relative z-10"></div>
        </div>

        <div className="school-card p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-school-text dark:text-dark-text font-serif">Notificações Recentes</h2>
            <Bell size={20} className="text-school-sankofa" />
          </div>
          <div className="space-y-4">
            {recentNotifications.length > 0 ? (
              recentNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 ${
                    !notification.read 
                      ? 'bg-accent-mustard/10 border-accent-mustard/20 shadow-sm' 
                      : 'bg-school-bg/30 dark:bg-dark-bg/30 border-transparent opacity-70'
                  }`}
                >
                  <div className={`mt-1 shrink-0 ${
                    notification.type === 'success' ? 'text-green-500' :
                    notification.type === 'warning' ? 'text-orange-500' :
                    notification.type === 'error' ? 'text-red-500' : 'text-blue-500'
                  }`}>
                    {notification.type === 'success' ? <CheckCircle2 size={20} /> :
                     notification.type === 'warning' ? <AlertCircle size={20} /> :
                     notification.type === 'error' ? <AlertCircle size={20} /> : <Info size={20} />}
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${!notification.read ? 'text-school-text dark:text-dark-text' : 'text-school-text/60 dark:text-dark-text/60'}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-school-text/70 dark:text-dark-text/70 mt-0.5 line-clamp-2 leading-relaxed">
                      {notification.message}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-school-text/40">
                <Bell size={40} className="mx-auto mb-4 opacity-20" />
                <p>Tudo tranquilo por aqui.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subtitle, icon: Icon, color }: any) => (
  <div className="school-card p-6 flex items-center gap-4 transition-transform hover:scale-105">
    <div className={`p-4 rounded-2xl ${color}`}>
      <Icon size={28} />
    </div>
    <div>
      <p className="text-school-text/50 dark:text-dark-text/50 text-sm font-medium">{title}</p>
      <h3 className="text-3xl font-bold text-school-text dark:text-dark-text">{value}</h3>
      {subtitle && <p className="text-xs text-school-text/40 dark:text-dark-text/40 mt-1">{subtitle}</p>}
    </div>
  </div>
);
