import React from 'react';
import { AlertTriangleIcon, RefreshCwIcon } from './Icons';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  let displayMessage = message;
  let userAction = "Por favor, inténtalo de nuevo.";

  if (message === 'IMAGENES_INTERCAMBIADAS') {
    displayMessage = 'Imágenes intercambiadas.';
    userAction = 'Parece que subiste el reverso antes que el frente. Por favor, súbelas en el orden correcto.';
  } else if (message.startsWith('La IA no pudo procesar')) {
    displayMessage = 'Error de procesamiento de la IA.';
    userAction = message;
  } else if (message.startsWith('La información extraída')) {
    displayMessage = 'Datos incompletos.';
    userAction = message;
  } else if (message.startsWith('Problema de autenticación')) {
    displayMessage = 'Error de API Key.';
    userAction = "Hubo un problema con la clave API. Contacta al administrador.";
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-red-500/30 p-6 rounded-xl shadow-xl text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/10">
        <AlertTriangleIcon className="h-6 w-6 text-red-500" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-red-400">{displayMessage}</h3>
      <div className="mt-2 text-sm text-red-400/80">
        <p>{userAction}</p>
      </div>
      <div className="mt-6">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-bold rounded-full shadow-sm text-neutral-950 bg-brand-yellow hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-brand-yellow touch-manipulation"
        >
          <RefreshCwIcon className="-ml-1 mr-2 h-5 w-5" />
          Intentar de Nuevo
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;