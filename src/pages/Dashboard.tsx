import React, { useMemo, useState, useEffect } from 'react';
import { useAppContext } from '../store';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Users, Bus, CheckCircle, AlertCircle, Bell, X } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { students, routes, attendance, incidents } = useAppContext();
  const [showNotification, setShowNotification] = useState(false);
  
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const todayAttendance = useMemo(() => {
    return attendance.filter(a => a.date === today);
  }, [attendance, today]);

  const todayIncidents = useMemo(() => {
    return incidents.filter(i => i.date.startsWith(today));
  }, [incidents, today]);

  const todayNewStudents = useMemo(() => {
    return students.filter(s => s.createdAt && s.createdAt.startsWith(today));
  }, [students, today]);

  useEffect(() => {
    if (todayIncidents.length > 0 || todayNewStudents.length > 0) {
      setShowNotification(true);
    }
  }, [todayIncidents.length, todayNewStudents.length]);

  const stats = useMemo(() => {
    const totalStudents = students.length;
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
      pendingBoarding: totalStudents - boarded,
      pendingAlighting: totalStudents - alighted,
    };
  }, [students, routes, todayAttendance, todayIncidents]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {showNotification && (
        <div className="bg-red-500 text-white px-6 py-4 rounded-2xl shadow-lg flex items-center justify-between animate-in slide-in-from-top-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="animate-bounce" size={28} />
              <span className="absolute -top-2 -right-2 bg-white text-red-500 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                {todayIncidents.length + todayNewStudents.length}
              </span>
            </div>
            <div>
              <p className="font-bold text-lg">Atenção!</p>
              {todayIncidents.length > 0 && <p>Há {todayIncidents.length} nova(s) ocorrência(s) registrada(s) hoje.</p>}
              {todayNewStudents.length > 0 && <p>Há {todayNewStudents.length} novo(s) aluno(s) registrado(s) hoje.</p>}
            </div>
          </div>
          <button 
            onClick={() => setShowNotification(false)}
            className="p-2 hover:bg-red-600 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-school-blue dark:text-school-yellow font-serif">Painel de Controle</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-2 text-base sm:text-lg">
            Visão geral de hoje, {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
        <div className="bg-school-yellow text-school-blue px-6 py-2 rounded-full font-semibold shadow-md text-sm sm:text-base">
          Sincronizado
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard 
          title="Total de Alunos" 
          value={stats.totalStudents} 
          icon={Users} 
          color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" 
        />
        <StatCard 
          title="Rotas Ativas" 
          value={stats.totalRoutes} 
          icon={Bus} 
          color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" 
        />
        <StatCard 
          title="Embarcaram Hoje" 
          value={stats.boarded} 
          subtitle={`${stats.pendingBoarding} pendentes`}
          icon={CheckCircle} 
          color="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" 
        />
        <StatCard 
          title="Desembarcaram Hoje" 
          value={stats.alighted} 
          subtitle={`${stats.pendingAlighting} pendentes`}
          icon={CheckCircle} 
          color="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" 
        />
        <StatCard 
          title="Ocorrências Hoje" 
          value={stats.incidentsCount} 
          icon={AlertCircle} 
          color="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-school-blue dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-school-blue/20 dark:border-slate-700 flex flex-col justify-center items-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-school-yellow via-transparent to-transparent group-hover:opacity-20 transition-opacity duration-700"></div>
          <h2 className="text-5xl font-bold text-school-yellow mb-6 font-serif relative z-10">Ubuntu</h2>
          <p className="text-2xl text-school-yellow/90 font-light italic relative z-10 max-w-md leading-relaxed">
            "Eu sou porque nós somos."
          </p>
          <div className="mt-8 w-16 h-1 bg-school-yellow rounded-full relative z-10"></div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-school-blue dark:text-school-yellow mb-6 font-serif">Últimos Registros</h2>
          <div className="space-y-4">
            {students.slice(0, 5).map(student => {
              const record = todayAttendance.find(a => a.studentId === student.id);
              return (
                <div key={student.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-slate-600">
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-slate-700 text-school-blue dark:text-school-yellow flex items-center justify-center font-bold text-lg border-2 border-school-yellow/30">
                    {student.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 dark:text-slate-100 truncate">{student.name}</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400 truncate">{student.school} • {student.class}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-slate-300">
                      {record?.boarding ? 'Embarcou' : 'Pendente'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{record?.boardingTime || '--:--'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subtitle, icon: Icon, color }: any) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border border-gray-50 dark:border-slate-700 flex items-center gap-4 transition-transform hover:scale-105">
    <div className={`p-4 rounded-2xl ${color}`}>
      <Icon size={28} />
    </div>
    <div>
      <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">{title}</p>
      <h3 className="text-3xl font-bold text-gray-800 dark:text-slate-100">{value}</h3>
      {subtitle && <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{subtitle}</p>}
    </div>
  </div>
);
