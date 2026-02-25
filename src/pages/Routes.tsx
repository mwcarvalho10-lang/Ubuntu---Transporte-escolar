import React, { useState } from 'react';
import { useAppContext, Route } from '../store';
import { Plus, Edit2, Trash2, Bus, MessageCircle } from 'lucide-react';

export const RoutesPage: React.FC = () => {
  const { routes, addRoute, updateRoute, deleteRoute, students } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const routeData: Omit<Route, 'id'> = {
      name: formData.get('name') as string,
      driver: formData.get('driver') as string,
      driverPhone: formData.get('driverPhone') as string,
      monitorName: formData.get('monitorName') as string,
      monitorPhone: formData.get('monitorPhone') as string,
    };

    if (editingRoute) {
      updateRoute(editingRoute.id, routeData);
    } else {
      addRoute(routeData);
    }
    setIsModalOpen(false);
    setEditingRoute(null);
  };

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-school-blue dark:text-school-yellow font-serif">Rotas</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-2 text-base sm:text-lg">Gerencie as rotas e veículos</p>
        </div>
        <button 
          onClick={() => { setEditingRoute(null); setIsModalOpen(true); }}
          className="w-full sm:w-auto bg-school-yellow hover:bg-school-yellow-hover text-school-blue px-6 py-3 rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Nova Rota
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map(route => {
          const routeStudentsCount = students.filter(s => s.routeId === route.id).length;
          return (
            <div key={route.id} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-slate-700 hover:shadow-2xl transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button 
                  onClick={() => { setEditingRoute(route); setIsModalOpen(true); }}
                  className="p-2 bg-white/90 dark:bg-slate-700/90 backdrop-blur text-school-blue dark:text-school-yellow hover:bg-school-yellow dark:hover:bg-slate-600 rounded-xl shadow-sm transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => {
                    if(window.confirm('Tem certeza que deseja excluir esta rota?')) {
                      deleteRoute(route.id);
                    }
                  }}
                  className="p-2 bg-white/90 dark:bg-slate-700/90 backdrop-blur text-red-500 hover:bg-red-50 dark:hover:bg-slate-600 rounded-xl shadow-sm transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-blue-50 dark:bg-slate-700 text-school-blue dark:text-school-yellow rounded-2xl flex items-center justify-center">
                  <Bus size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 font-serif">{route.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">{routeStudentsCount} alunos</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-semibold block">Motorista</span>
                    <span className="font-medium text-gray-900 dark:text-slate-200">{route.driver}</span>
                  </div>
                  {route.driverPhone && (
                    <button 
                      onClick={() => handleWhatsApp(route.driverPhone)}
                      className="p-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white dark:hover:bg-green-500 dark:hover:text-white rounded-xl transition-colors"
                      title="WhatsApp Motorista"
                    >
                      <MessageCircle size={18} />
                    </button>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-semibold block">Monitor(a)</span>
                    <span className="font-medium text-gray-900 dark:text-slate-200">{route.monitorName || 'Não cadastrado'}</span>
                  </div>
                  {route.monitorPhone && (
                    <button 
                      onClick={() => handleWhatsApp(route.monitorPhone)}
                      className="p-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white dark:hover:bg-green-500 dark:hover:text-white rounded-xl transition-colors"
                      title="WhatsApp Monitor"
                    >
                      <MessageCircle size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {routes.length === 0 && (
          <div className="col-span-full p-12 text-center text-gray-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-gray-300 dark:border-slate-600">
            Nenhuma rota cadastrada.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-school-blue dark:text-school-yellow mb-6 font-serif">
                {editingRoute ? 'Editar Rota' : 'Nova Rota'}
              </h2>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Nome da Rota</label>
                  <input name="name" defaultValue={editingRoute?.name} required placeholder="Ex: Rota Pelourinho" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:border-school-blue dark:focus:border-school-yellow focus:ring-school-blue dark:focus:ring-school-yellow" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Motorista</label>
                    <input name="driver" defaultValue={editingRoute?.driver} required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:border-school-blue dark:focus:border-school-yellow focus:ring-school-blue dark:focus:ring-school-yellow" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Tel. Motorista</label>
                    <input name="driverPhone" defaultValue={editingRoute?.driverPhone} required placeholder="(00) 00000-0000" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:border-school-blue dark:focus:border-school-yellow focus:ring-school-blue dark:focus:ring-school-yellow" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Monitor(a)</label>
                    <input name="monitorName" defaultValue={editingRoute?.monitorName} required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:border-school-blue dark:focus:border-school-yellow focus:ring-school-blue dark:focus:ring-school-yellow" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Tel. Monitor</label>
                    <input name="monitorPhone" defaultValue={editingRoute?.monitorPhone} required placeholder="(00) 00000-0000" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:border-school-blue dark:focus:border-school-yellow focus:ring-school-blue dark:focus:ring-school-yellow" />
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
                    Salvar Rota
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
