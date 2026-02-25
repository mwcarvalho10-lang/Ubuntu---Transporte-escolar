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
    return students.filter(s => s.routeId === selectedRoute);
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
          <h1 className="text-3xl sm:text-4xl font-bold text-school-blue dark:text-school-yellow font-serif">Ocorrências</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-2 text-base sm:text-lg">Registro e histórico de incidentes</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Nova Ocorrência
        </button>
      </header>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex flex-wrap gap-4 items-center bg-gray-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 font-medium">
            <Filter size={20} />
            <span>Filtros:</span>
          </div>
          <select 
            value={filterRoute}
            onChange={(e) => setFilterRoute(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 focus:border-school-blue dark:focus:border-school-yellow focus:ring-school-blue dark:focus:ring-school-yellow"
          >
            <option value="all">Todas as Rotas</option>
            {routes.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 focus:border-school-blue dark:focus:border-school-yellow focus:ring-school-blue dark:focus:ring-school-yellow"
          >
            <option value="all">Todos os Tipos</option>
            <option value="indiscipline">Indisciplina</option>
            <option value="health">Saúde</option>
            <option value="other">Outros</option>
          </select>
          <select 
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 focus:border-school-blue dark:focus:border-school-yellow focus:ring-school-blue dark:focus:ring-school-yellow"
          >
            <option value="all">Todas as Gravidades</option>
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-slate-700">
          {filteredIncidents.map(incident => {
            const student = students.find(s => s.id === incident.studentId);
            const route = routes.find(r => r.id === student?.routeId);
            
            return (
              <div key={incident.id} className="p-6 hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors flex flex-col sm:flex-row gap-4 sm:gap-6 group relative">
                <button
                  onClick={() => handleDelete(incident.id)}
                  className="absolute top-6 right-6 p-2 bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-500 hover:text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                  title="Excluir Ocorrência"
                >
                  <Trash2 size={18} />
                </button>

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  incident.type === 'indiscipline' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                  incident.type === 'health' ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                  'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                }`}>
                  <AlertCircle size={28} />
                </div>
                <div className="flex-1 sm:pr-12">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 font-serif">{student?.name || 'Aluno Excluído'}</h3>
                      <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">{route?.name || 'Sem rota'} • {student?.class || 'Sem turma'} • Monitor(a): {incident.monitorName}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-sm font-semibold text-gray-900 dark:text-slate-300 block">
                        {format(new Date(incident.date), "dd 'de' MMMM", { locale: ptBR })}
                      </span>
                      <div className="flex gap-2 justify-start sm:justify-end mt-1">
                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md inline-block ${
                          incident.type === 'indiscipline' ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300' :
                          incident.type === 'health' ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300' :
                          'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                        }`}>
                          {incident.type === 'indiscipline' ? 'Indisciplina' : incident.type === 'health' ? 'Saúde' : 'Outros'}
                        </span>
                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md inline-block ${
                          incident.severity === 'high' ? 'bg-red-500 text-white' :
                          incident.severity === 'medium' ? 'bg-orange-400 text-white' :
                          'bg-green-500 text-white'
                        }`}>
                          {incident.severity === 'high' ? 'Alta' : incident.severity === 'medium' ? 'Média' : 'Baixa'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-slate-300 bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl border border-gray-100 dark:border-slate-700 mt-3">
                    {incident.description}
                  </p>
                </div>
              </div>
            );
          })}
          {filteredIncidents.length === 0 && (
            <div className="p-12 text-center text-gray-500 dark:text-slate-400 text-lg">
              Nenhuma ocorrência encontrada com os filtros atuais.
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-school-blue dark:text-school-yellow mb-6 font-serif">
                Registrar Ocorrência
              </h2>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Rota</label>
                  <select 
                    value={selectedRoute}
                    onChange={(e) => {
                      setSelectedRoute(e.target.value);
                      setSelectedStudent('');
                    }}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:border-school-blue dark:focus:border-school-yellow focus:ring-school-blue dark:focus:ring-school-yellow"
                  >
                    <option value="">Selecione a rota...</option>
                    {routes.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Aluno</label>
                  <select 
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    required
                    disabled={!selectedRoute}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:border-school-blue dark:focus:border-school-yellow focus:ring-school-blue dark:focus:ring-school-yellow disabled:opacity-50"
                  >
                    <option value="">Selecione o aluno...</option>
                    {filteredStudents.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Tipo de Ocorrência</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setIncidentType('indiscipline')}
                      className={`py-2 px-3 rounded-xl border font-medium text-sm transition-colors ${
                        incidentType === 'indiscipline' 
                          ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400' 
                          : 'bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600'
                      }`}
                    >
                      Indisciplina
                    </button>
                    <button
                      type="button"
                      onClick={() => setIncidentType('health')}
                      className={`py-2 px-3 rounded-xl border font-medium text-sm transition-colors ${
                        incidentType === 'health' 
                          ? 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400' 
                          : 'bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600'
                      }`}
                    >
                      Saúde
                    </button>
                    <button
                      type="button"
                      onClick={() => setIncidentType('other')}
                      className={`py-2 px-3 rounded-xl border font-medium text-sm transition-colors ${
                        incidentType === 'other' 
                          ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400' 
                          : 'bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600'
                      }`}
                    >
                      Outros
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Gravidade</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setSeverity('low')}
                      className={`py-2 px-3 rounded-xl border font-medium text-sm transition-colors ${
                        severity === 'low' 
                          ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400' 
                          : 'bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600'
                      }`}
                    >
                      Baixa
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeverity('medium')}
                      className={`py-2 px-3 rounded-xl border font-medium text-sm transition-colors ${
                        severity === 'medium' 
                          ? 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400' 
                          : 'bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600'
                      }`}
                    >
                      Média
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeverity('high')}
                      className={`py-2 px-3 rounded-xl border font-medium text-sm transition-colors ${
                        severity === 'high' 
                          ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400' 
                          : 'bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600'
                      }`}
                    >
                      Alta
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Relato do Ocorrido</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required 
                    rows={4}
                    placeholder="Descreva brevemente o que aconteceu..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:border-school-blue dark:focus:border-school-yellow focus:ring-school-blue dark:focus:ring-school-yellow resize-none"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 dark:border-slate-700">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 rounded-xl font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-3 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md"
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
