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

  const handleExportCSV = () => {
    const headers = ['Nome', 'Escola', 'Turma', 'Dias Registrados', 'Embarques', 'Taxa de Frequência'];
    const rows = filteredData.map(s => [
      s.name,
      s.school,
      s.class,
      s.totalDays.toString(),
      s.boardedDays.toString(),
      `${s.boardingRate}%`
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_frequencia_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Watermark for PDF */}
      <div className="print-watermark">Ubuntu Escolar</div>

      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 print-hidden">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-school-text dark:text-dark-text font-serif">Relatórios</h1>
          <p className="text-school-text/60 dark:text-dark-text/60 mt-2 text-lg">Gere relatórios de frequência detalhados</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none bg-accent-brown hover:bg-accent-terracotta text-white px-6 py-3 rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2 transition-all"
          >
            <Download size={20} />
            Exportar CSV
          </button>
          <button 
            onClick={handlePrint}
            className="flex-1 sm:flex-none bg-accent-mustard hover:bg-accent-terracotta text-accent-brown hover:text-white px-6 py-3 rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2 transition-all"
          >
            <FileText size={20} />
            Imprimir / PDF
          </button>
        </div>
      </header>

      {/* Print Only Header */}
      <div className="print-only mb-8 border-b-4 border-accent-mustard pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-accent-brown font-serif">Ubuntu Escolar</h1>
            <p className="text-accent-terracotta font-bold uppercase tracking-widest text-sm">Gestão de Transporte</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold">Relatório Oficial de Frequência</p>
            <p className="text-xs opacity-60">{format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
          </div>
        </div>
      </div>

      <div className="school-card p-6 print-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-accent-terracotta flex items-center gap-2 uppercase tracking-wider">
              <FileText size={16} /> Tipo de Relatório
            </label>
            <select 
              value={reportType}
              onChange={(e) => {
                setReportType(e.target.value as any);
                setSelectedFilter('all');
              }}
              className="w-full px-4 py-3 rounded-xl border-2 border-school-sankofa/20 focus:border-accent-mustard focus:ring-4 focus:ring-accent-mustard/20 bg-school-bg dark:bg-dark-bg text-school-text dark:text-dark-text font-medium transition-all appearance-none cursor-pointer"
            >
              <option value="student" className="bg-school-bg dark:bg-dark-bg">Por Aluno</option>
              <option value="class" className="bg-school-bg dark:bg-dark-bg">Por Turma</option>
              <option value="school" className="bg-school-bg dark:bg-dark-bg">Por Escola</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-accent-terracotta flex items-center gap-2 uppercase tracking-wider">
              <Filter size={16} /> Filtro Específico
            </label>
            <select 
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-school-sankofa/20 focus:border-accent-mustard focus:ring-4 focus:ring-accent-mustard/20 bg-school-bg dark:bg-dark-bg text-school-text dark:text-dark-text font-medium transition-all appearance-none cursor-pointer"
            >
              <option value="all" className="bg-school-bg dark:bg-dark-bg">Todos</option>
              {reportType === 'student' && students.map(s => <option key={s.id} value={s.id} className="bg-school-bg dark:bg-dark-bg">{s.name}</option>)}
              {reportType === 'class' && uniqueClasses.map(c => <option key={c} value={c} className="bg-school-bg dark:bg-dark-bg">{c}</option>)}
              {reportType === 'school' && uniqueSchools.map(s => <option key={s} value={s} className="bg-school-bg dark:bg-dark-bg">{s}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-accent-terracotta flex items-center gap-2 uppercase tracking-wider">
              <Calendar size={16} /> Período
            </label>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border-2 border-school-sankofa/20 focus:border-accent-mustard focus:ring-4 focus:ring-accent-mustard/20 bg-school-bg dark:bg-dark-bg text-school-text dark:text-dark-text font-medium transition-all appearance-none cursor-pointer"
            >
              <option value="7days" className="bg-school-bg dark:bg-dark-bg">Últimos 7 dias</option>
              <option value="30days" className="bg-school-bg dark:bg-dark-bg">Últimos 30 dias</option>
              <option value="all" className="bg-school-bg dark:bg-dark-bg">Todo o período</option>
            </select>
          </div>
        </div>
      </div>

      <div className="school-card overflow-hidden print:shadow-none print:border-none">
        <div className="p-8 border-b border-school-sankofa/10 bg-accent-brown text-white dark:bg-accent-brown print:bg-transparent print:text-black print:p-0 print:mb-6">
          <h2 className="text-2xl font-bold font-serif">Relatório de Frequência Escolar</h2>
          <p className="opacity-80 mt-1">
            {reportType === 'student' ? 'Visão por Aluno' : reportType === 'class' ? 'Visão por Turma' : 'Visão por Escola'} 
            {' • '} 
            {dateRange === '7days' ? 'Últimos 7 dias' : dateRange === '30days' ? 'Últimos 30 dias' : 'Todo o período'}
          </p>
          <p className="opacity-60 text-sm mt-4 print:hidden">Gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm")}</p>
        </div>

        <div className="overflow-x-auto p-6 print:p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-school-bg/50 dark:bg-dark-bg/50 text-school-text/50 dark:text-dark-text/50 text-sm uppercase tracking-wider print:bg-gray-100 print:text-black print:border-b-2 print:border-black">
                <th className="p-4 font-medium">Aluno</th>
                <th className="p-4 font-medium">Escola / Turma</th>
                <th className="p-4 font-medium text-center">Dias Registrados</th>
                <th className="p-4 font-medium text-center">Embarques</th>
                <th className="p-4 font-medium text-center">Taxa de Frequência</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-school-sankofa/10 dark:divide-dark-sankofa/10 print:divide-gray-300">
              {filteredData.map(student => (
                <tr key={student.id} className="hover:bg-accent-mustard/5 transition-colors">
                  <td className="p-4 font-semibold text-school-text dark:text-dark-text print:text-black">{student.name}</td>
                  <td className="p-4">
                    <p className="text-school-text dark:text-dark-text print:text-black">{student.school}</p>
                    <p className="text-sm text-school-text/60 dark:text-dark-text/60 print:text-gray-600">{student.class}</p>
                  </td>
                  <td className="p-4 text-center font-mono text-school-text/60 dark:text-dark-text/60 print:text-black">{student.totalDays}</td>
                  <td className="p-4 text-center font-mono text-school-text/60 dark:text-dark-text/60 print:text-black">{student.boardedDays}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 h-2 bg-school-bg/50 dark:bg-dark-bg/50 rounded-full overflow-hidden print:hidden">
                        <div 
                          className={`h-full rounded-full ${
                            student.boardingRate >= 80 ? 'bg-accent-brown' : 
                            student.boardingRate >= 50 ? 'bg-accent-mustard' : 'bg-accent-terracotta'
                          }`}
                          style={{ width: `${student.boardingRate}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-school-text dark:text-dark-text w-12 text-right print:text-black">{student.boardingRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-school-text/40 text-lg">
                    Nenhum dado encontrado para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Print Only Footer */}
        <div className="print-only mt-12 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase text-gray-400">Assinatura do Responsável</p>
              <div className="w-64 h-px bg-black mt-8"></div>
            </div>
            <div className="text-right text-[10px] text-gray-400">
              <p>Ubuntu Escolar - Sistema de Gestão de Transporte</p>
              <p>Documento gerado eletronicamente em {format(new Date(), "dd/MM/yyyy HH:mm")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
