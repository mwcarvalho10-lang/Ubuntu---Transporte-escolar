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
          <h1 className="text-3xl sm:text-4xl font-bold text-school-text dark:text-dark-text font-serif">Rotas</h1>
          <p className="text-school-text/60 dark:text-dark-text/60 mt-2 text-base sm:text-lg">Gerencie as rotas e veículos</p>
        </div>
        <button 
          onClick={() => { setEditingRoute(null); setIsModalOpen(true); }}
          className="w-full sm:w-auto bg-accent-mustard hover:bg-accent-terracotta text-accent-brown hover:text-white px-6 py-3 rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          <Plus size={20} />
          Nova Rota
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map(route => {
          const routeStudentsCount = students.filter(s => s.routeId === route.id && s.active).length;
          return (
            <div key={route.id} className="school-card p-6 hover:shadow-2xl transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button 
                  onClick={() => { setEditingRoute(route); setIsModalOpen(true); }}
                  className="p-2 bg-school-bg/90 dark:bg-dark-bg/90 backdrop-blur text-accent-terracotta dark:text-accent-mustard hover:bg-accent-mustard dark:hover:bg-accent-terracotta rounded-xl shadow-sm transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => {
                    if(window.confirm('Tem certeza que deseja excluir esta rota?')) {
                      deleteRoute(route.id);
                    }
                  }}
                  className="p-2 bg-school-bg/90 dark:bg-dark-bg/90 backdrop-blur text-red-500 hover:bg-red-50 rounded-xl shadow-sm transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-accent-mustard/10 text-accent-terracotta dark:text-accent-mustard rounded-2xl flex items-center justify-center">
                  <Bus size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-school-text dark:text-dark-text font-serif">{route.name}</h3>
                  <p className="text-sm text-school-text/60 dark:text-dark-text/60 font-medium">{routeStudentsCount} alunos</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-school-sankofa/10 dark:border-dark-sankofa/10">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs text-school-text/40 dark:text-dark-text/40 uppercase tracking-wider font-semibold block">Motorista</span>
                    <span className="font-medium text-school-text dark:text-dark-text">{route.driver}</span>
                  </div>
                  {route.driverPhone && (
                    <button 
                      onClick={() => handleWhatsApp(route.driverPhone)}
                      className="p-2 bg-accent-mustard/10 text-accent-terracotta dark:text-accent-mustard hover:bg-accent-terracotta hover:text-white rounded-xl transition-colors"
                      title="WhatsApp Motorista"
                    >
                      <MessageCircle size={18} />
                    </button>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs text-school-text/40 dark:text-dark-text/40 uppercase tracking-wider font-semibold block">Monitor(a)</span>
                    <span className="font-medium text-school-text dark:text-dark-text">{route.monitorName || 'Não cadastrado'}</span>
                  </div>
                  {route.monitorPhone && (
                    <button 
                      onClick={() => handleWhatsApp(route.monitorPhone)}
                      className="p-2 bg-accent-mustard/10 text-accent-terracotta dark:text-accent-mustard hover:bg-accent-terracotta hover:text-white rounded-xl transition-colors"
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
          <div className="col-span-full p-12 text-center text-school-text/40 school-card border-dashed border-school-sankofa/30">
            Nenhuma rota cadastrada.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-accent-brown/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="school-card w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-accent-brown dark:text-accent-mustard mb-6 font-serif">
                {editingRoute ? 'Editar Rota' : 'Nova Rota'}
              </h2>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Nome da Rota</label>
                  <input name="name" defaultValue={editingRoute?.name} required placeholder="Ex: Rota Pelourinho" className="w-full px-4 py-3 rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 text-school-text dark:text-dark-text focus:border-accent-mustard focus:ring-accent-mustard" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Motorista</label>
                    <input name="driver" defaultValue={editingRoute?.driver} required className="w-full px-4 py-3 rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 text-school-text dark:text-dark-text focus:border-accent-mustard focus:ring-accent-mustard" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Tel. Motorista</label>
                    <input name="driverPhone" defaultValue={editingRoute?.driverPhone} required placeholder="(00) 00000-0000" className="w-full px-4 py-3 rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 text-school-text dark:text-dark-text focus:border-accent-mustard focus:ring-accent-mustard" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Monitor(a)</label>
                    <input name="monitorName" defaultValue={editingRoute?.monitorName} required className="w-full px-4 py-3 rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 text-school-text dark:text-dark-text focus:border-accent-mustard focus:ring-accent-mustard" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-school-text/70 dark:text-dark-text/70">Tel. Monitor</label>
                    <input name="monitorPhone" defaultValue={editingRoute?.monitorPhone} required placeholder="(00) 00000-0000" className="w-full px-4 py-3 rounded-xl border border-school-sankofa/20 bg-school-bg/50 dark:bg-dark-bg/50 text-school-text dark:text-dark-text focus:border-accent-mustard focus:ring-accent-mustard" />
                  </div>
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
                    className="px-6 py-3 rounded-xl font-medium bg-accent-mustard text-accent-brown hover:bg-accent-terracotta hover:text-white transition-all shadow-md"
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
