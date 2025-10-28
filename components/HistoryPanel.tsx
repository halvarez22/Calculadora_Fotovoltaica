import React from 'react';
import { HistoryEntry } from '../types';
import { HistoryIcon } from './Icons';

interface HistoryPanelProps {
  isVisible: boolean;
  history: HistoryEntry[];
  onViewEntry: (id: number) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ isVisible, history, onViewEntry, onClearHistory, onClose }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-20 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-neutral-950/80 backdrop-blur-sm shadow-xl z-30 transform transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-panel-title"
      >
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <HistoryIcon className="w-6 h-6 text-brand-yellow" />
              <h2 id="history-panel-title" className="text-lg font-semibold text-white">Historial de Análisis</h2>
            </div>
            <button onClick={onClose} className="p-1 rounded-full text-neutral-300 hover:bg-white/10 hover:text-white transition-colors duration-300" aria-label="Cerrar panel de historial">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </header>

          <div className="flex-grow overflow-y-auto p-4">
            {history.length === 0 ? (
              <div className="text-center text-neutral-300 mt-10">
                <p>No hay análisis guardados.</p>
                <p className="text-sm text-neutral-400">Completa un análisis para verlo aquí.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {history.map(entry => (
                  <li key={entry.id}>
                    <button
                      onClick={() => onViewEntry(entry.id)}
                      className="w-full text-left bg-white/5 backdrop-blur-sm p-4 rounded-xl cursor-pointer hover:bg-white/10 border border-transparent hover:border-brand-yellow/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                    >
                      <p className="font-semibold text-white truncate">{entry.customerName}</p>
                      <div className="text-xs text-neutral-300 mt-2 space-y-1">
                          <p><strong>Fecha:</strong> {entry.date}</p>
                          <p><strong>Servicio:</strong> {entry.serviceNumber}</p>
                          <p><strong>Periodo:</strong> {entry.billingPeriod}</p>
                          <p className="font-bold text-brand-yellow text-sm mt-1">Total: {entry.totalAmount}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {history.length > 0 && (
            <footer className="p-4 border-t border-white/10">
              <button
                onClick={onClearHistory}
                className="w-full bg-red-600/80 text-white font-bold py-3 rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-105 touch-manipulation"
              >
                Limpiar Historial
              </button>
            </footer>
          )}
        </div>
      </div>
    </>
  );
};

export default HistoryPanel;