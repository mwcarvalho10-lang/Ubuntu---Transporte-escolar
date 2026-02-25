import React, { useState, useMemo } from 'react';
import { useAppContext } from '../store';
import { format, parseISO, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Download, FileText, Filter, Calendar } from 'lucide-react';

export const Reports: React.FC = () => {
  const { students, attendance } = useAppContext();
  const [reportType, setReportType] = useState<'student' | 'class' | 'school'>('student');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'7days' | '30days' | 'all'>('30days');

  const uniqueClasses = useMemo(() => Array.from(new Set(students.map(s => s.class))), [students]);
  const uniqueSchools = useMemo(() => Array.from(new Set(students.map(s => s.school))), [students]);

  const filteredData = useMemo(() => {
    let filteredStudents = students;
    if (reportType === 'student' && selectedFilter !== 'all') {
      filteredStudents = students.filter(s => s.id === selectedFilter);
    } else if (reportType === 'class' && selectedFilter !== 'all') {
      filteredStudents = students.filter(s => s.class === selectedFilter);
    } else if (reportType === 'school' && selectedFilter !== 'all') {
      filteredStudents = students.filter(s => s.school === selectedFilter);
    }

    const today = new Date();
    let startDate = new Date(0);
    if (dateRange === '7days') startDate = subDays(today, 7);
    if (dateRange === '30days') startDate = subDays(today, 30);

    const report = filteredStudents.map(student => {
      const studentAttendance = attendance.filter(a => 
        a.studentId === student.id && 
        new Date(a.date) >= startDate
      );
      
      const totalDays = studentAttendance.length;
      const boardedDays = studentAttendance.filter(a => a.boarding).length;
      const alightedDays = studentAttendance.filter(a => a.alighting).length;
      
      const boardingRate = totalDays > 0 ? Math.round((boardedDays / totalDays) * 100) : 0;
      
      return {
        ...student,
        totalDays,
        boardedDays,
        alightedDays,
        boardingRate
      };
    });

    return report.sort((a, b) => b.boardingRate - a.boardingRate);
  }, [students, attendance, reportType, selectedFilter, dateRange]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end print:hidden">
        <div>
          <h1 className="text-4xl font-bold text-school-blue">Relatórios</h1>
          <p className="text-gray-600 mt-2 text-lg">Gere relatórios de frequência detalhados</p>
        </div>
        
        <button 
          onClick={handlePrint}
          className="bg-school-blue hover:bg-school-blue/90 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg flex items-center gap-2 transition-colors"
        >
          <Download size={20} />
          Imprimir / PDF
        </button>
      </header>

      <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 print:hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FileText size={16} /> Tipo de Relatório
            </label>
            <select 
              value={reportType}
              onChange={(e) => {
                setReportType(e.target.value as any);
                setSelectedFilter('all');
              }}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-school-blue focus:ring-school-blue bg-gray-50"
            >
              <option value="student">Por Aluno</option>
              <option value="class">Por Turma</option>
              <option value="school">Por Escola</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Filter size={16} /> Filtro Específico
            </label>
            <select 
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-school-blue focus:ring-school-blue bg-gray-50"
            >
              <option value="all">Todos</option>
              {reportType === 'student' && students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              {reportType === 'class' && uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
              {reportType === 'school' && uniqueSchools.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Calendar size={16} /> Período
            </label>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-school-blue focus:ring-school-blue bg-gray-50"
            >
              <option value="7days">Últimos 7 dias</option>
              <option value="30days">Últimos 30 dias</option>
              <option value="all">Todo o período</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden print:shadow-none print:border-none">
        <div className="p-8 border-b border-gray-100 bg-school-blue text-white print:bg-white print:text-black">
          <h2 className="text-2xl font-bold font-serif">Relatório de Frequência Escolar</h2>
          <p className="opacity-80 mt-1">
            {reportType === 'student' ? 'Visão por Aluno' : reportType === 'class' ? 'Visão por Turma' : 'Visão por Escola'} 
            {' • '} 
            {dateRange === '7days' ? 'Últimos 7 dias' : dateRange === '30days' ? 'Últimos 30 dias' : 'Todo o período'}
          </p>
          <p className="opacity-60 text-sm mt-4">Gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm")}</p>
        </div>

        <div className="overflow-x-auto p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider print:bg-transparent print:border-b-2 print:border-black">
                <th className="p-4 font-medium">Aluno</th>
                <th className="p-4 font-medium">Escola / Turma</th>
                <th className="p-4 font-medium text-center">Dias Registrados</th>
                <th className="p-4 font-medium text-center">Embarques</th>
                <th className="p-4 font-medium text-center">Taxa de Frequência</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 print:divide-gray-300">
              {filteredData.map(student => (
                <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-semibold text-gray-900">{student.name}</td>
                  <td className="p-4">
                    <p className="text-gray-800">{student.school}</p>
                    <p className="text-sm text-gray-500">{student.class}</p>
                  </td>
                  <td className="p-4 text-center font-mono text-gray-600">{student.totalDays}</td>
                  <td className="p-4 text-center font-mono text-gray-600">{student.boardedDays}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            student.boardingRate >= 80 ? 'bg-indigo-500' : 
                            student.boardingRate >= 50 ? 'bg-school-yellow' : 'bg-red-500'
                          }`}
                          style={{ width: `${student.boardingRate}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-gray-700 w-12 text-right">{student.boardingRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500 text-lg">
                    Nenhum dado encontrado para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
