import React, { useState, useMemo } from 'react';
import { useAppContext } from '../store';
import { format, isSunday, isWithinInterval, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, X, Filter, Lock, Unlock, Bus, Calendar } from 'lucide-react';

export const Attendance: React.FC = () => {
  const { students, routes, attendance, markAttendance, schoolYearPeriod } = useAppContext();
  const [unlockedRouteId, setUnlockedRouteId] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayDate = new Date();
  const isTodaySunday = isSunday(todayDate);

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

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Master password
    if (passwordInput === '123456') {
      setUnlockedRouteId('all');
      setPasswordInput('');
      return;
    }

    // Check route specific passwords (123456A, 123456B, etc.)
    const routeIndex = routes.findIndex((r, index) => {
      const expectedPassword = `123456${String.fromCharCode(65 + index)}`;
      return passwordInput.toUpperCase() === expectedPassword;
    });

    if (routeIndex !== -1) {
      setUnlockedRouteId(routes[routeIndex].id);
      setPasswordInput('');
    } else {
      setErrorMsg('Senha incorreta. Tente novamente.');
    }
  };

  const filteredStudents = useMemo(() => {
    const activeStudents = students.filter(s => s.active);
    if (unlockedRouteId === 'all') return activeStudents;
    if (unlockedRouteId) return activeStudents.filter(s => s.routeId === unlockedRouteId);
    return [];
  }, [students, unlockedRouteId]);

  const unlockedRoute = useMemo(() => {
    if (unlockedRouteId && unlockedRouteId !== 'all') {
      return routes.find(r => r.id === unlockedRouteId);
    }
    return null;
  }, [unlockedRouteId, routes]);

  const getAttendanceRecord = (studentId: string) => {
    return attendance.find(a => a.studentId === studentId && a.date === today);
  };

  if (!unlockedRouteId) {
    return (
      <div className="flex items-center justify-center h-full animate-in fade-in zoom-in-95 duration-500">
        <div className="school-card p-8 w-full max-w-md text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-accent-mustard"></div>
          <div className="w-20 h-20 bg-accent-mustard/10 rounded-full flex items-center justify-center mx-auto mb-6 text-accent-terracotta dark:text-accent-mustard">
            <Lock size={40} />
          </div>
          <h2 className="text-3xl font-bold text-accent-brown dark:text-accent-mustard mb-2 font-serif">Acesso Restrito</h2>
          <p className="text-school-text/60 dark:text-dark-text/60 mb-8">Digite a senha da sua rota para acessar a lista de presença.</p>
          
          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <input 
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Senha da Rota (ex: 123456A)"
                className="w-full px-6 py-4 rounded-2xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 text-center text-xl tracking-widest text-school-text dark:text-dark-text focus:border-accent-mustard focus:ring-accent-mustard transition-all"
                autoFocus
              />
              {errorMsg && <p className="text-red-500 text-sm mt-2 animate-bounce">{errorMsg}</p>}
            </div>
            <button 
              type="submit"
              className="w-full bg-accent-mustard text-accent-brown py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-accent-terracotta hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Unlock size={20} />
              Acessar Presença
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-school-text dark:text-dark-text font-serif">Controle de Presença</h1>
          <p className="text-school-text/60 dark:text-dark-text/60 mt-2 text-base sm:text-lg">
            {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          {unlockedRouteId === 'all' && (
            <div className="bg-accent-mustard text-accent-brown px-4 py-2 rounded-xl font-bold text-sm shadow-sm">
              Modo Administrador
            </div>
          )}
          <button 
            onClick={() => setUnlockedRouteId(null)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-school-bg/50 dark:bg-dark-bg/50 text-school-text dark:text-dark-text rounded-xl hover:bg-accent-mustard/10 transition-colors font-medium border border-school-sankofa/10"
          >
            <Lock size={18} />
            Bloquear Tela
          </button>
        </div>
      </header>

      {unlockedRoute && (
        <div className="school-card p-6 flex items-center justify-between shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-accent-brown dark:text-accent-mustard font-serif">{unlockedRoute.name}</h2>
            <p className="text-school-text/60 dark:text-dark-text/60 mt-1 font-medium">Monitor(a): {unlockedRoute.monitorName || 'Não cadastrado'}</p>
          </div>
          <div className="w-14 h-14 bg-accent-mustard/10 rounded-2xl flex items-center justify-center text-accent-terracotta dark:text-accent-mustard shadow-sm">
            <Bus size={28} />
          </div>
        </div>
      )}

      {isTodaySunday ? (
        <div className="school-card p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold mb-2 font-serif text-accent-terracotta">Check-in Fechado</h2>
          <p className="text-lg text-school-text/60">O sistema de presença não opera aos domingos. O funcionamento é de segunda a sábado.</p>
        </div>
      ) : !isWithinPeriod ? (
        <div className="school-card p-8 text-center shadow-sm">
          <Calendar size={48} className="mx-auto mb-4 text-accent-terracotta opacity-50" />
          <h2 className="text-2xl font-bold mb-2 font-serif text-accent-terracotta">Fora do Período Letivo</h2>
          <p className="text-lg text-school-text/60">O registro de presença está desabilitado pois a data atual está fora do período letivo configurado ({schoolYearPeriod?.startDate} a {schoolYearPeriod?.endDate}).</p>
        </div>
      ) : (
        <div className="school-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-school-bg/50 dark:bg-dark-bg/50 text-school-text/50 dark:text-dark-text/50 text-sm uppercase tracking-wider">
                  <th className="p-6 font-medium">Aluno</th>
                  <th className="p-6 font-medium text-center">Embarque (Ida)</th>
                  <th className="p-6 font-medium text-center">Desembarque (Volta)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-school-sankofa/10 dark:divide-dark-sankofa/10">
                {filteredStudents.map(student => {
                  const record = getAttendanceRecord(student.id);
                  const isBoarded = record?.boarding || false;
                  const isAlighted = record?.alighting || false;

                  return (
                    <tr key={student.id} className="hover:bg-accent-mustard/5 transition-colors">
                      <td className="p-6">
                        <div>
                          <p className="font-bold text-school-text dark:text-dark-text text-lg font-serif">{student.name}</p>
                          <p className="text-sm text-school-text/60 dark:text-dark-text/60">{student.school} • {student.class}</p>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <button
                          onClick={() => markAttendance(student.id, today, 'boarding', !isBoarded)}
                          className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 shadow-sm ${
                            isBoarded 
                              ? 'bg-accent-terracotta text-white shadow-accent-terracotta/30 scale-105' 
                              : 'bg-school-bg/50 dark:bg-dark-bg/50 text-school-sankofa hover:bg-accent-mustard/20'
                          }`}
                        >
                          {isBoarded ? <Check size={28} /> : <X size={28} />}
                        </button>
                        {isBoarded && record?.boardingTime && (
                          <p className="text-xs text-accent-terracotta dark:text-accent-mustard font-medium mt-2">{record.boardingTime}</p>
                        )}
                      </td>
                      <td className="p-6 text-center">
                        <button
                          onClick={() => markAttendance(student.id, today, 'alighting', !isAlighted)}
                          className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 shadow-sm ${
                            isAlighted 
                              ? 'bg-accent-brown text-white shadow-accent-brown/30 scale-105' 
                              : 'bg-school-bg/50 dark:bg-dark-bg/50 text-school-sankofa hover:bg-accent-mustard/20'
                          }`}
                        >
                          {isAlighted ? <Check size={28} /> : <X size={28} />}
                        </button>
                        {isAlighted && record?.alightingTime && (
                          <p className="text-xs text-accent-brown dark:text-accent-mustard font-medium mt-2">{record.alightingTime}</p>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-12 text-center text-school-text/40 text-lg">
                      Nenhum aluno encontrado para esta rota.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
