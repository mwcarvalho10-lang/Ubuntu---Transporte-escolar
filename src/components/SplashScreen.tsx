import React, { useEffect, useState } from 'react';
import { Bus } from 'lucide-react';
import { IllustratedBackground } from './IllustratedBackground';

export const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-bg transition-opacity duration-700">
      <IllustratedBackground />
      
      <div className="text-center animate-in fade-in zoom-in duration-1000">
        <div className="w-32 h-32 bg-accent-mustard rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl animate-bounce">
          <Bus size={64} className="text-accent-brown" />
        </div>
        <h1 className="text-5xl font-bold text-white font-serif tracking-tight">Ubuntu</h1>
        <p className="text-xl text-accent-mustard mt-2 font-medium uppercase tracking-[0.3em]">Escolar</p>
        
        <div className="mt-12 w-48 h-1.5 bg-dark-sankofa/20 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-accent-mustard animate-progress-bar"></div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress-bar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress-bar {
          animation: progress-bar 2.5s ease-in-out forwards;
        }
      `}} />
    </div>
  );
};
