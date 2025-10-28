import React from 'react';
import { VoltaicIcon } from './Icons';

interface LoaderProps {
  progress: number;
}

const Loader: React.FC<LoaderProps> = ({ progress }) => {
  const getStatusMessage = () => {
    if (progress < 40) return "Analizando estructura del documento...";
    if (progress < 85) return "Extrayendo datos con IA de Gemini...";
    return "Finalizando y compilando resultados...";
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* Logo de Voltaic */}
      <div className="mb-8 flex justify-center">
        <VoltaicIcon className="h-24 w-auto animate-pulse" />
      </div>
      
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 border-4 border-neutral-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-brand-yellow rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-brand-yellow">
          {Math.round(progress)}%
        </div>
      </div>
      
      <div className="w-full max-w-md">
        <h3 className="text-xl font-semibold text-white">Procesando tu recibo...</h3>
        <p className="mt-2 text-sm text-neutral-300 h-5">{getStatusMessage()}</p>
        
        <div className="w-full bg-neutral-800/50 backdrop-blur-sm border border-white/10 rounded-full h-2.5 mt-4 overflow-hidden">
          <div
            className="bg-brand-yellow h-2.5 rounded-full transition-all duration-300 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;