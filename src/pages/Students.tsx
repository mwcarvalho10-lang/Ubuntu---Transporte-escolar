import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppContext, Student } from '../store';
import { Plus, Search, Edit2, Trash2, History, Filter } from 'lucide-react';
import { format } from 'date-fns';

export const Students: React.FC = () => {
  const { students, routes, deleteStudent, addStudent, updateStudent, attendance } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [search, setSearch] = useState(initialSearch);
  const [routeFilter, setRouteFilter] = useState(() => {
    return localStorage.getItem('school_students_route_filter') || 'all';
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [historyStudent, setHistoryStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (initialSearch) {
      setSearch(initialSearch);
      // Clear the search param from URL after applying it to state to avoid sticking
      setSearchParams({});
    }
  }, [initialSearch, setSearchParams]);

  useEffect(() => {
    localStorage.setItem('school_students_route_filter', routeFilter);
  }, [routeFilter]);

  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.school.toLowerCase().includes(search.toLowerCase()) ||
      s.id === search; // Match exact ID from global search
    
    const matchesRoute = routeFilter === 'all' || s.routeId === routeFilter;
    
    return matchesSearch && matchesRoute;
  });

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const studentData: Omit<Student, 'id'> = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      class: formData.get('class') as string,
      school: formData.get('school') as string,
      routeId: formData.get('routeId') as string,
      contact1Name: formData.get('contact1Name') as string,
      contact1Phone: formData.get('contact1Phone') as string,
      contact2Name: formData.get('contact2Name') as string,
      contact2Phone: formData.get('contact2Phone') as string,
    };

    if (editingStudent) {
      updateStudent(editingStudent.id, studentData);
    } else {
      addStudent(studentData);
    }
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-school-blue dark:text-school-yellow font-serif">Alunos</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-2 text-base sm:text-lg">Gerencie o cadastro dos estudantes</p>
        </div>
        <button 
          onClick={() => { setEditingStudent(null); setIsModalOpen(true); }}
          className="w-full sm:w-auto bg-school-yellow hover:bg-school-yellow-hover text-school-blue px-6 py-3 rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Novo Aluno
        </button>
      </header>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-4 bg-gray-50/50 dark:bg-slate-800/50">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={20} />
            <input 
              type="text"
              placeholder="Buscar aluno por nome ou escola..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm focus:border-school-blue dark:focus:border-school-yellow focus:ring-school-blue dark:focus:ring-school-yellow"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="p-3 bg-blue-50 dark:bg-slate-700 text-school-blue dark:text-school-yellow rounded-xl">
              <Filter size={20} />
            </div>
            <select 
              value={routeFilter}
              onChange={(e) => setRouteFilter(e.target.value)}
              className="w-full sm:w-48 px-4 py-3 rounded-2xl border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm focus:border-school-blue dark:focus:border-school-yellow focus:ring-school-blue dark:focus:ring-school-yellow"
            >
              <option value="all">Todas as Rotas</option>
              {routes.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800/80 text-gray-500 dark:text-slate-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Aluno</th>
                <th className="p-4 font-medium">Escola / Turma</th>
                <th className="p-4 font-medium">Rota</th>
                <th className="p-4 font-medium">Contatos</th>
                <th className="p-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {filteredStudents.map(student => {
                const route = routes.find(r => r.id === student.routeId);
                return (
                  <tr key={student.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-slate-100">{student.name}</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400 truncate max-w-[200px]">{student.address}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-gray-800 dark:text-slate-200">{student.school}</p>
                      <p className="text-sm text-gray-500 dark:text-slate-400">{student.class}</p>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 dark:bg-school-blue/20 text-school-blue dark:text-school-yellow">
                        {route?.name || 'Sem rota'}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-800 dark:text-slate-200">{student.contact1Name}: {student.contact1Phone}</p>
                      <p className="text-sm text-gray-500 dark:text-slate-400">{student.contact2Name}: {student.contact2Phone}</p>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setHistoryStudent(student)}
                          className="p-2 text-gray-400 dark:text-slate-400 hover:text-school-blue dark:hover:text-school-yellow hover:bg-blue-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                          title="Histórico de Presença"
                        >
                          <History size={18} />
                        </button>
                        <button 
                          onClick={() => { setEditingStudent(student); setIsModalOpen(true); }}
                          className="p-2 text-gray-400 dark:text-slate-400 hover:text-school-yellow dark:hover:text-school-yellow hover:bg-yellow-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            if(window.confirm('Tem certeza que deseja excluir este aluno?')) {
                              deleteStudent(student.id);
                            }
                          }}
                          className="p-2 text-gray-400 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-slate-400">
                    Nenhum aluno encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-school-blue dark:text-school-yellow mb-6 font-serif">
                {editingStudent ? 'Editar Aluno' : 'Novo Aluno'}
              </h2>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Nome Completo</label>
                    <input name="name" defaultValue={editingStudent?.name} required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:border-school-blue dark:focus:border-school-yellow focus:ring-school-blue dark:focus:ring-school-yellow" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Endereço</label>
                    <input name="address" defaultValue={editingStudent?.address} required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:border-school-blue dark:focus:border-school-yellow focus:ring-school-blue dark:focus:ring-school-yellow" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Escola</label>
                    <input name="school" defaultValue={editingStudent?.school} required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:border-school-blue dark:focus:border-school-yellow focus:ring-school-blue dark:focus:ring-school-yellow" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Turma</label>
                    <select name="class" defaultValue={editingStudent?.class} required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:border-school-blue dark:focus:border-school-yellow focus:ring-school-blue dark:focus:ring-school-yellow">
                      <option value="">Selecione a turma</option>
                      <option value="1º Ano A (Manhã)">1º Ano A (Manhã)</option>
                      <option value="1º Ano B (Manhã)">1º Ano B (Manhã)</option>
                      <option value="1º Ano C (Tarde)">1º Ano C (Tarde)</option>
                      <option value="1º Ano D (Tarde)">1º Ano D (Tarde)</option>
                      <option value="2º Ano A (Manhã)">2º Ano A (Manhã)</option>
                      <option value="2º Ano B (Manhã)">2º Ano B (Manhã)</option>
                      <option value="2º Ano C (Tarde)">2º Ano C (Tarde)</option>
                      <option value="2º Ano D (Tarde)">2º Ano D (Tarde)</option>
                      <option value="3º Ano A (Manhã)">3º Ano A (Manhã)</option>
                      <option value="3º Ano B (Manhã)">3º Ano B (Manhã)</option>
                      <option value="3º Ano C (Tarde)">3º Ano C (Tarde)</option>
                      <option value="3º Ano D (Tarde)">3º Ano D (Tarde)</option>
                      <option value="4º Ano A (Manhã)">4º Ano A (Manhã)</option>
                      <option value="4º Ano B (Manhã)">4º Ano B (Manhã)</option>
                      <option value="4º Ano C (Tarde)">4º Ano C (Tarde)</option>
                      <option value="4º Ano D (Tarde)">4º Ano D (Tarde)</option>
                      <option value="5º Ano A (Manhã)">5º Ano A (Manhã)</option>
                      <option value="5º Ano B (Manhã)">5º Ano B (Manhã)</option>
                      <option value="5º Ano C (Tarde)">5º Ano C (Tarde)</option>
                      <option value="5º Ano D (Tarde)">5º Ano D (Tarde)</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Rota</label>
                    <select name="routeId" defaultValue={editingStudent?.routeId} required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:border-school-blue dark:focus:border-school-yellow focus:ring-school-blue dark:focus:ring-school-yellow">
                      <option value="">Selecione uma rota</option>
                      {routes.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="md:col-span-2 pt-4 border-t border-gray-100 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-school-blue dark:text-school-yellow mb-4">Contatos (Responsáveis)</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Contato 1 - Nome/Parentesco</label>
                    <input name="contact1Name" defaultValue={editingStudent?.contact1Name} required placeholder="Ex: Mãe (Ana)" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:border-school-blue dark:focus:border-school-yellow focus:ring-school-blue dark:focus:ring-school-yellow" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Contato 1 - Telefone</label>
                    <input name="contact1Phone" defaultValue={editingStudent?.contact1Phone} required placeholder="(00) 00000-0000" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:border-school-blue dark:focus:border-school-yellow focus:ring-school-blue dark:focus:ring-school-yellow" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Contato 2 - Nome/Parentesco</label>
                    <input name="contact2Name" defaultValue={editingStudent?.contact2Name} required placeholder="Ex: Avó (Maria)" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:border-school-blue dark:focus:border-school-yellow focus:ring-school-blue dark:focus:ring-school-yellow" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Contato 2 - Telefone</label>
                    <input name="contact2Phone" defaultValue={editingStudent?.contact2Phone} required placeholder="(00) 00000-0000" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:border-school-blue dark:focus:border-school-yellow focus:ring-school-blue dark:focus:ring-school-yellow" />
                  </div>
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
                    className="px-6 py-3 rounded-xl font-medium bg-school-blue text-white hover:bg-school-blue/90 transition-colors shadow-md"
                  >
                    Salvar Aluno
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {historyStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-school-blue dark:text-school-yellow font-serif">Histórico de Presença</h2>
                <p className="text-gray-600 dark:text-slate-400 mt-1">{historyStudent.name}</p>
              </div>
              <button 
                onClick={() => setHistoryStudent(null)}
                className="p-2 text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-8 overflow-y-auto flex-1">
              <div className="space-y-4">
                {attendance
                  .filter(a => a.studentId === historyStudent.id)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(record => (
                    <div key={record.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                      <div className="font-medium text-gray-900 dark:text-slate-100">
                        {format(new Date(record.date + 'T12:00:00'), 'dd/MM/yyyy')}
                      </div>
                      <div className="flex gap-6">
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Embarque</span>
                          <span className={`font-medium ${record.boarding ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                            {record.boarding ? `Sim (${record.boardingTime})` : 'Não'}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Desembarque</span>
                          <span className={`font-medium ${record.alighting ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                            {record.alighting ? `Sim (${record.alightingTime})` : 'Não'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                {attendance.filter(a => a.studentId === historyStudent.id).length === 0 && (
                  <div className="text-center text-gray-500 dark:text-slate-400 py-8">
                    Nenhum registro de presença encontrado para este aluno.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
