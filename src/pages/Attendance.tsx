import React, { useState, useMemo } from 'react';
import { useAppContext } from '../store';
import { format, isSunday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, X, Filter, Lock, Unlock, Bus } from 'lucide-react';

export const Attendance: React.FC = () => {
  const { students, routes, attendance, markAttendance } = useAppContext();
  const [unlockedRouteId, setUnlockedRouteId] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const today = format(new Date(), 'yyyy-MM-dd');
  const isTodaySunday = isSunday(new Date());

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
    if (unlockedRouteId === 'all') return students;
    if (unlockedRouteId) return students.filter(s => s.routeId === unlockedRouteId);
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
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700 w-full max-w-md text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-school-yellow"></div>
          <div className="w-20 h-20 bg-blue-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6 text-school-blue dark:text-school-yellow">
            <Lock size={40} />
          </div>
          <h2 className="text-3xl font-bold text-school-blue dark:text-school-yellow mb-2 font-serif">Acesso Restrito</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-8">Digite a senha da sua rota para acessar a lista de presença.</p>
          
          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <input 
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Senha da Rota (ex: 123456A)"
                className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-center text-xl tracking-widest text-gray-900 dark:text-slate-100 focus:border-school-blue dark:focus:border-school-yellow focus:ring-school-blue dark:focus:ring-school-yellow transition-all"
                autoFocus
              />
              {errorMsg && <p className="text-red-500 text-sm mt-2 animate-bounce">{errorMsg}</p>}
            </div>
            <button 
              type="submit"
              className="w-full bg-school-blue dark:bg-school-yellow text-white dark:text-school-blue py-4 rounded-2xl font-bold text-lg shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
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
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-school-blue dark:text-school-yellow font-serif">Controle de Presença</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-2 text-lg">
            {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {unlockedRouteId === 'all' && (
            <div className="bg-school-yellow text-school-blue px-4 py-2 rounded-xl font-bold text-sm shadow-sm">
              Modo Administrador
            </div>
          )}
          <button 
            onClick={() => setUnlockedRouteId(null)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors font-medium border border-gray-200 dark:border-slate-700"
          >
            <Lock size={18} />
            Bloquear Tela
          </button>
        </div>
      </header>

      {unlockedRoute && (
        <div className="bg-blue-50 dark:bg-slate-800 p-6 rounded-3xl border border-blue-100 dark:border-slate-700 flex items-center justify-between shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-school-blue dark:text-school-yellow font-serif">{unlockedRoute.name}</h2>
            <p className="text-gray-600 dark:text-slate-400 mt-1 font-medium">Monitor(a): {unlockedRoute.monitorName || 'Não cadastrado'}</p>
          </div>
          <div className="w-14 h-14 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-school-blue dark:text-school-yellow shadow-sm">
            <Bus size={28} />
          </div>
        </div>
      )}

      {isTodaySunday ? (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-300 p-8 rounded-3xl text-center shadow-sm">
          <h2 className="text-2xl font-bold mb-2 font-serif">Check-in Fechado</h2>
          <p className="text-lg">O sistema de presença não opera aos domingos. O funcionamento é de segunda a sábado.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800/80 text-gray-500 dark:text-slate-400 text-sm uppercase tracking-wider">
                  <th className="p-6 font-medium">Aluno</th>
                  <th className="p-6 font-medium text-center">Embarque (Ida)</th>
                  <th className="p-6 font-medium text-center">Desembarque (Volta)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {filteredStudents.map(student => {
                  const record = getAttendanceRecord(student.id);
                  const isBoarded = record?.boarding || false;
                  const isAlighted = record?.alighting || false;

                  return (
                    <tr key={student.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="p-6">
                        <div>
                          <p className="font-bold text-gray-900 dark:text-slate-100 text-lg font-serif">{student.name}</p>
                          <p className="text-sm text-gray-500 dark:text-slate-400">{student.school} • {student.class}</p>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <button
                          onClick={() => markAttendance(student.id, today, 'boarding', !isBoarded)}
                          className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 shadow-sm ${
                            isBoarded 
                              ? 'bg-green-500 text-white shadow-green-500/30 scale-105' 
                              : 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500 hover:bg-gray-200 dark:hover:bg-slate-600'
                          }`}
                        >
                          {isBoarded ? <Check size={28} /> : <X size={28} />}
                        </button>
                        {isBoarded && record?.boardingTime && (
                          <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-2">{record.boardingTime}</p>
                        )}
                      </td>
                      <td className="p-6 text-center">
                        <button
                          onClick={() => markAttendance(student.id, today, 'alighting', !isAlighted)}
                          className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 shadow-sm ${
                            isAlighted 
                              ? 'bg-school-blue dark:bg-school-yellow text-white dark:text-school-blue shadow-school-blue/30 scale-105' 
                              : 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500 hover:bg-gray-200 dark:hover:bg-slate-600'
                          }`}
                        >
                          {isAlighted ? <Check size={28} /> : <X size={28} />}
                        </button>
                        {isAlighted && record?.alightingTime && (
                          <p className="text-xs text-school-blue dark:text-school-yellow font-medium mt-2">{record.alightingTime}</p>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-12 text-center text-gray-500 dark:text-slate-400 text-lg">
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
