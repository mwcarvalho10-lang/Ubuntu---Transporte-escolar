import React, { useState, useMemo } from 'react';
import { useAppContext } from '../store';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertCircle, Plus, Filter, Trash2 } from 'lucide-react';

export const Incidents: React.FC = () => {
  const { students, routes, incidents, addIncident, deleteIncident } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [incidentType, setIncidentType] = useState<'indiscipline' | 'health' | 'other'>('indiscipline');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('low');
  const [description, setDescription] = useState('');

  const [filterRoute, setFilterRoute] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredStudents = useMemo(() => {
    if (!selectedRoute) return [];
    return students.filter(s => s.routeId === selectedRoute && s.active);
  }, [students, selectedRoute]);

  const filteredIncidents = useMemo(() => {
    return incidents.filter(incident => {
      const student = students.find(s => s.id === incident.studentId);
      const routeMatch = filterRoute === 'all' || student?.routeId === filterRoute;
      const typeMatch = filterType === 'all' || incident.type === filterType;
      const severityMatch = filterSeverity === 'all' || incident.severity === filterSeverity;
      return routeMatch && typeMatch && severityMatch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [incidents, students, filterRoute, filterType, filterSeverity]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !description || !selectedRoute) return;

    const route = routes.find(r => r.id === selectedRoute);

    addIncident({
      studentId: selectedStudent,
      routeId: selectedRoute,
      type: incidentType,
      severity,
      monitorName: route?.monitorName || 'Não cadastrado',
      description
    });

    setIsModalOpen(false);
    setSelectedRoute('');
    setSelectedStudent('');
    setIncidentType('indiscipline');
    setSeverity('low');
    setDescription('');
  };

  const handleDelete = (id: string) => {
    const password = window.prompt('Digite a senha para excluir a ocorrência:');
    if (password === '123456') {
      deleteIncident(id);
    } else if (password !== null) {
      alert('Senha incorreta!');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-school-text dark:text-dark-text font-serif">Ocorrências</h1>
          <p className="text-school-text/60 dark:text-dark-text/60 mt-2 text-base sm:text-lg">Registro e histórico de incidentes</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-accent-terracotta hover:bg-accent-brown text-white px-6 py-3 rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          <Plus size={20} />
          Nova Ocorrência
        </button>
      </header>

      <div className="school-card overflow-hidden">
        <div className="p-6 border-b border-school-sankofa/10 dark:border-dark-sankofa/10 flex flex-wrap gap-4 items-center bg-school-bg/30 dark:bg-dark-bg/30">
          <div className="flex items-center gap-2 text-accent-terracotta dark:text-accent-mustard font-bold uppercase tracking-wider text-sm">
            <Filter size={20} />
            <span>Filtros:</span>
          </div>
          <select 
            value={filterRoute}
            onChange={(e) => setFilterRoute(e.target.value)}
            className="px-4 py-2 rounded-xl border-2 border-school-sankofa/20 bg-school-bg dark:bg-dark-bg text-school-text dark:text-dark-text font-medium focus:border-accent-mustard focus:ring-4 focus:ring-accent-mustard/20 transition-all appearance-none cursor-pointer"
          >
            <option value="all" className="bg-school-bg dark:bg-dark-bg">Todas as Rotas</option>
            {routes.map(r => (
              <option key={r.id} value={r.id} className="bg-school-bg dark:bg-dark-bg">{r.name}</option>
            ))}
          </select>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 rounded-xl border-2 border-school-sankofa/20 bg-school-bg dark:bg-dark-bg text-school-text dark:text-dark-text font-medium focus:border-accent-mustard focus:ring-4 focus:ring-accent-mustard/20 transition-all appearance-none cursor-pointer"
          >
            <option value="all" className="bg-school-bg dark:bg-dark-bg">Todos os Tipos</option>
            <option value="indiscipline" className="bg-school-bg dark:bg-dark-bg">Indisciplina</option>
            <option value="health" className="bg-school-bg dark:bg-dark-bg">Saúde</option>
            <option value="other" className="bg-school-bg dark:bg-dark-bg">Outros</option>
          </select>
          <select 
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-4 py-2 rounded-xl border-2 border-school-sankofa/20 bg-school-bg dark:bg-dark-bg text-school-text dark:text-dark-text font-medium focus:border-accent-mustard focus:ring-4 focus:ring-accent-mustard/20 transition-all appearance-none cursor-pointer"
          >
            <option value="all" className="bg-school-bg dark:bg-dark-bg">Todas as Gravidades</option>
            <option value="low" className="bg-school-bg dark:bg-dark-bg">Baixa</option>
            <option value="medium" className="bg-school-bg dark:bg-dark-bg">Média</option>
            <option value="high" className="bg-school-bg dark:bg-dark-bg">Alta</option>
          </select>
        </div>

        <div className="divide-y divide-school-sankofa/10 dark:divide-dark-sankofa/10">
          {filteredIncidents.map(incident => {
            const student = students.find(s => s.id === incident.studentId);
            const route = routes.find(r => r.id === student?.routeId);
            
            return (
              <div key={incident.id} className="p-6 hover:bg-accent-mustard/5 transition-colors flex flex-col sm:flex-row gap-4 sm:gap-6 group relative">
                <button
                  onClick={() => handleDelete(incident.id)}
                  className="absolute top-6 right-6 p-2 bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-500 hover:text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                  title="Excluir Ocorrência"
                >
                  <Trash2 size={18} />
                </button>

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  incident.type === 'indiscipline' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                  incident.type === 'health' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' :
                  'bg-school-bg/50 dark:bg-dark-bg/50 text-school-text/60'
                }`}>
                  <AlertCircle size={28} />
                </div>
                <div className="flex-1 sm:pr-12">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-school-text dark:text-dark-text font-serif">{student?.name || 'Aluno Excluído'}</h3>
                      <p className="text-sm text-school-text/60 dark:text-dark-text/60 font-medium">{route?.name || 'Sem rota'} • {student?.class || 'Sem turma'} • Monitor(a): {incident.monitorName}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-sm font-semibold text-school-text dark:text-dark-text block">
                        {format(new Date(incident.date), "dd 'de' MMMM", { locale: ptBR })}
                      </span>
                      <div className="flex gap-2 justify-start sm:justify-end mt-1">
                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md inline-block ${
                          incident.type === 'indiscipline' ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300' :
                          incident.type === 'health' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' :
                          'bg-school-bg/50 dark:bg-dark-bg/50 text-school-text/60'
                        }`}>
                          {incident.type === 'indiscipline' ? 'Indisciplina' : incident.type === 'health' ? 'Saúde' : 'Outros'}
                        </span>
                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md inline-block ${
                          incident.severity === 'high' ? 'bg-red-500 text-white' :
                          incident.severity === 'medium' ? 'bg-accent-terracotta text-white' :
                          'bg-accent-brown text-white'
                        }`}>
                          {incident.severity === 'high' ? 'Alta' : incident.severity === 'medium' ? 'Média' : 'Baixa'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-school-text dark:text-dark-text bg-school-bg/50 dark:bg-dark-bg/50 p-4 rounded-xl border border-school-sankofa/10 dark:border-dark-sankofa/10 mt-3">
                    {incident.description}
                  </p>
                </div>
              </div>
            );
          })}
          {filteredIncidents.length === 0 && (
            <div className="p-12 text-center text-school-text/40 text-lg">
              Nenhuma ocorrência encontrada com os filtros atuais.
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-accent-brown/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="school-card w-full max-w-lg animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-accent-brown dark:text-accent-mustard mb-6 font-serif">
                Registrar Ocorrência
              </h2>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Rota</label>
                  <select 
                    value={selectedRoute}
                    onChange={(e) => {
                      setSelectedRoute(e.target.value);
                      setSelectedStudent('');
                    }}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 text-school-text dark:text-dark-text focus:border-accent-mustard focus:ring-accent-mustard"
                  >
                    <option value="">Selecione a rota...</option>
                    {routes.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Aluno</label>
                  <select 
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    required
                    disabled={!selectedRoute}
                    className="w-full px-4 py-3 rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 text-school-text dark:text-dark-text focus:border-accent-mustard focus:ring-accent-mustard disabled:opacity-50"
                  >
                    <option value="">Selecione o aluno...</option>
                    {filteredStudents.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Tipo de Ocorrência</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setIncidentType('indiscipline')}
                      className={`py-2 px-3 rounded-xl border font-medium text-sm transition-colors ${
                        incidentType === 'indiscipline' 
                          ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400' 
                          : 'bg-school-bg/50 dark:bg-dark-bg/50 border-school-sankofa/20 text-school-text/60 dark:text-dark-text/60 hover:bg-accent-mustard/10'
                      }`}
                    >
                      Indisciplina
                    </button>
                    <button
                      type="button"
                      onClick={() => setIncidentType('health')}
                      className={`py-2 px-3 rounded-xl border font-medium text-sm transition-colors ${
                        incidentType === 'health' 
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400' 
                          : 'bg-school-bg/50 dark:bg-dark-bg/50 border-school-sankofa/20 text-school-text/60 dark:text-dark-text/60 hover:bg-accent-mustard/10'
                      }`}
                    >
                      Saúde
                    </button>
                    <button
                      type="button"
                      onClick={() => setIncidentType('other')}
                      className={`py-2 px-3 rounded-xl border font-medium text-sm transition-colors ${
                        incidentType === 'other' 
                          ? 'bg-accent-mustard/10 border-accent-mustard/30 text-accent-brown' 
                          : 'bg-school-bg/50 dark:bg-dark-bg/50 border-school-sankofa/20 text-school-text/60 dark:text-dark-text/60 hover:bg-accent-mustard/10'
                      }`}
                    >
                      Outros
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Gravidade</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setSeverity('low')}
                      className={`py-2 px-3 rounded-xl border font-medium text-sm transition-colors ${
                        severity === 'low' 
                          ? 'bg-accent-brown text-white border-accent-brown' 
                          : 'bg-school-bg/50 dark:bg-dark-bg/50 border-school-sankofa/20 text-school-text/60 dark:text-dark-text/60 hover:bg-accent-mustard/10'
                      }`}
                    >
                      Baixa
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeverity('medium')}
                      className={`py-2 px-3 rounded-xl border font-medium text-sm transition-colors ${
                        severity === 'medium' 
                          ? 'bg-accent-terracotta text-white border-accent-terracotta' 
                          : 'bg-school-bg/50 dark:bg-dark-bg/50 border-school-sankofa/20 text-school-text/60 dark:text-dark-text/60 hover:bg-accent-mustard/10'
                      }`}
                    >
                      Média
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeverity('high')}
                      className={`py-2 px-3 rounded-xl border font-medium text-sm transition-colors ${
                        severity === 'high' 
                          ? 'bg-red-500 text-white border-red-500' 
                          : 'bg-school-bg/50 dark:bg-dark-bg/50 border-school-sankofa/20 text-school-text/60 dark:text-dark-text/60 hover:bg-accent-mustard/10'
                      }`}
                    >
                      Alta
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Relato do Ocorrido</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required 
                    rows={4}
                    placeholder="Descreva brevemente o que aconteceu..."
                    className="w-full px-4 py-3 rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 text-school-text dark:text-dark-text focus:border-accent-mustard focus:ring-accent-mustard resize-none"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-school-sankofa/10 dark:border-dark-sankofa/10">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 rounded-xl font-medium text-school-text/60 dark:text-dark-text/60 hover:bg-school-bg dark:hover:bg-dark-bg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-3 rounded-xl font-medium bg-accent-terracotta text-white hover:bg-accent-brown transition-all shadow-md"
                  >
                    Registrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
