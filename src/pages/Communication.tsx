import React, { useState, useMemo } from 'react';
import { useAppContext } from '../store';
import { Phone, MessageCircle, Filter } from 'lucide-react';

export const Communication: React.FC = () => {
  const { students, routes } = useAppContext();
  const [selectedRoute, setSelectedRoute] = useState<string>('all');

  const filteredStudents = useMemo(() => {
    if (selectedRoute === 'all') return students;
    return students.filter(s => s.routeId === selectedRoute);
  }, [students, selectedRoute]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-school-blue dark:text-school-yellow font-serif">Comunicação</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-2 text-base sm:text-lg">Contatos dos responsáveis por aluno</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 w-full sm:w-auto">
          <div className="p-2 bg-blue-50 dark:bg-slate-700 text-school-blue dark:text-school-yellow rounded-xl">
            <Filter size={20} />
          </div>
          <select 
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-gray-700 dark:text-slate-200 font-medium pr-8 cursor-pointer w-full"
          >
            <option value="all">Todas as Rotas</option>
            {routes.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStudents.map(student => {
          const route = routes.find(r => r.id === student.routeId);
          return (
            <div key={student.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-md border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-shadow relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-school-yellow"></div>
              
              <div className="mb-4 mt-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 font-serif leading-tight">{student.name}</h3>
                <div className="flex gap-2 mt-1.5 flex-wrap">
                  <p className="text-xs text-school-blue dark:text-school-yellow font-medium bg-blue-50 dark:bg-slate-700 px-2 py-0.5 rounded-md inline-block">
                    {route?.name || 'Sem rota'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 font-medium bg-gray-100 dark:bg-slate-600 px-2 py-0.5 rounded-md inline-block">
                    {student.class}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-slate-700">
                <ContactCard name={student.contact1Name} phone={student.contact1Phone} />
                <ContactCard name={student.contact2Name} phone={student.contact2Phone} />
              </div>
            </div>
          );
        })}
        {filteredStudents.length === 0 && (
          <div className="col-span-full p-12 text-center text-gray-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-gray-300 dark:border-slate-600 text-lg">
            Nenhum aluno encontrado para esta rota.
          </div>
        )}
      </div>
    </div>
  );
};

const ContactCard = ({ name, phone }: { name: string, phone: string }) => {
  const handleWhatsApp = () => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${phone}`, '_self');
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-700/50 p-2.5 rounded-xl border border-gray-100 dark:border-slate-600 flex items-center justify-between group hover:bg-white dark:hover:bg-slate-700 hover:border-school-yellow/50 dark:hover:border-school-yellow/50 transition-colors">
      <div className="overflow-hidden pr-2">
        <p className="text-xs font-semibold text-gray-900 dark:text-slate-200 truncate">{name}</p>
        <p className="text-xs text-gray-500 dark:text-slate-400 font-mono mt-0.5">{phone}</p>
      </div>
      <div className="flex gap-1.5 shrink-0">
        <button 
          onClick={handleWhatsApp}
          className="p-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white dark:hover:bg-green-500 dark:hover:text-white rounded-lg transition-colors shadow-sm"
          title="WhatsApp"
        >
          <MessageCircle size={14} />
        </button>
        <button 
          onClick={handleCall}
          className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white rounded-lg transition-colors shadow-sm"
          title="Ligar"
        >
          <Phone size={14} />
        </button>
      </div>
    </div>
  );
};
