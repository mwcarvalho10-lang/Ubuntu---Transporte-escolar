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
          <h1 className="text-3xl sm:text-4xl font-bold text-school-text dark:text-dark-text font-serif">Comunicação</h1>
          <p className="text-school-text/60 dark:text-dark-text/60 mt-2 text-base sm:text-lg">Contatos dos responsáveis por aluno</p>
        </div>
        
        <div className="flex items-center gap-4 school-card p-2 w-full sm:w-auto">
          <div className="p-2 bg-accent-mustard/10 text-accent-terracotta dark:text-accent-mustard rounded-xl">
            <Filter size={20} />
          </div>
          <select 
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-school-text dark:text-dark-text font-medium pr-8 cursor-pointer w-full"
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
            <div key={student.id} className="school-card p-4 hover:shadow-lg transition-shadow relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-accent-mustard"></div>
              
              <div className="mb-4 mt-1">
                <h3 className="text-lg font-bold text-school-text dark:text-dark-text font-serif leading-tight">{student.name}</h3>
                <div className="flex gap-2 mt-1.5 flex-wrap">
                  <p className="text-xs text-accent-terracotta dark:text-accent-mustard font-medium bg-accent-mustard/10 px-2 py-0.5 rounded-md inline-block">
                    {route?.name || 'Sem rota'}
                  </p>
                  <p className="text-xs text-school-text/60 dark:text-dark-text/60 font-medium bg-school-bg/50 dark:bg-dark-bg/50 px-2 py-0.5 rounded-md inline-block">
                    {student.class}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-school-sankofa/10 dark:border-dark-sankofa/10">
                <ContactCard name={student.contact1Name} phone={student.contact1Phone} />
                <ContactCard name={student.contact2Name} phone={student.contact2Phone} />
              </div>
            </div>
          );
        })}
        {filteredStudents.length === 0 && (
          <div className="col-span-full p-12 text-center text-school-text/40 school-card border-dashed border-school-sankofa/30 text-lg">
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
    <div className="bg-school-bg/30 dark:bg-dark-bg/30 p-2.5 rounded-xl border border-school-sankofa/10 dark:border-dark-sankofa/10 flex items-center justify-between group hover:bg-accent-mustard/10 transition-colors">
      <div className="overflow-hidden pr-2">
        <p className="text-xs font-semibold text-school-text dark:text-dark-text truncate">{name}</p>
        <p className="text-xs text-school-text/40 dark:text-dark-text/40 font-mono mt-0.5">{phone}</p>
      </div>
      <div className="flex gap-1.5 shrink-0">
        <button 
          onClick={handleWhatsApp}
          className="p-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white rounded-lg transition-colors shadow-sm"
          title="WhatsApp"
        >
          <MessageCircle size={14} />
        </button>
        <button 
          onClick={handleCall}
          className="p-1.5 bg-accent-mustard/20 text-accent-terracotta dark:text-accent-mustard hover:bg-accent-terracotta hover:text-white rounded-lg transition-colors shadow-sm"
          title="Ligar"
        >
          <Phone size={14} />
        </button>
      </div>
    </div>
  );
};
