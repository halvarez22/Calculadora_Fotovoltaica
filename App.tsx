import React, { useState, useRef, useEffect } from 'react';
import { BillData, HistoryEntry } from './types';
import { extractBillData } from './services/geminiService';
import { saveAnalysisToFirestore, loadHistoryFromFirestore, clearHistoryFromFirestore, checkDuplicate } from './services/historyService';

// Función auxiliar para normalizar strings
const normalizeString = (str: string): string => {
  return str.trim().toUpperCase().replace(/\s+/g, ' ');
};
const normalizeServiceNumber = (sn: string): string => {
  const digits = (sn || '').replace(/\D+/g, '');
  return digits.replace(/^0+/, '') || '0';
};
import FileUpload from './components/FileUpload';
import BillDisplay from './components/BillDisplay';
import Loader from './components/Loader';
import ErrorDisplay from './components/ErrorDisplay';
import HistoryPanel from './components/HistoryPanel';
import { VoltaicIcon, HistoryIcon } from './components/Icons';

interface UploadedImage {
  base64: string;
  mimeType: string;
}

function App() {
  const [billData, setBillData] = useState<BillData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Load history from Firestore on initial render
    const loadHistory = async () => {
      try {
        const loadedHistory = await loadHistoryFromFirestore();
        setHistory(loadedHistory);
      } catch (error) {
        console.error("Failed to load history from Firestore:", error);
        setHistory([]);
      }
    };
    loadHistory();
  }, []);
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const saveHistory = async (newHistory: HistoryEntry[]) => {
    try {
      setHistory(newHistory);
    } catch (error) {
      console.error("Failed to update history state:", error);
    }
  };

  const handleExtract = async (front: UploadedImage, back: UploadedImage) => {
    setIsLoading(true);
    setError(null);
    setBillData(null);
    setProgress(0);

    intervalRef.current = window.setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 95;
        }
        if (prev < 60) return prev + 1;
        if (prev < 90) return prev + 0.5;
        return prev + 0.2;
      });
    }, 100);

    try {
      const data = await extractBillData({ front, back });
      
      // Verificar duplicados INMEDIATAMENTE después de extraer
      const customerName = data.customerInfo.find(i => i.key.toUpperCase().includes('NOMBRE'))?.value || 'N/A';
      const serviceNumber = data.customerInfo.find(i => i.key.includes('NO. DE SERVICIO'))?.value || 'N/A';
      const billingPeriod = data.billingSummary.find(i => i.key.includes('PERIODO FACTURADO'))?.value || 'N/A';
      
      console.log('🔍 Verificando duplicados después de extracción...', {
        customerName,
        serviceNumber,
        billingPeriod
      });
      
      // Crear entrada temporal para verificar
      const tempEntry: HistoryEntry = {
        id: Date.now(),
        date: new Date().toLocaleString('es-MX'),
        customerName,
        serviceNumber,
        totalAmount: data.billingSummary.find(i => i.key.includes('TOTAL A PAGAR'))?.value || 'N/A',
        billingPeriod,
        fullData: data
      };
      
      // Verificar duplicados
      const isDuplicate = await checkDuplicate(tempEntry);
      
      if (isDuplicate) {
        // Encontró duplicado - buscar el registro existente
        console.log('⚠️ Duplicado encontrado, buscando registro existente...');
        
        // Buscar en localStorage
        const localHistory = localStorage.getItem('billHistory');
        if (localHistory) {
          const historyArray: HistoryEntry[] = JSON.parse(localHistory);
          const existingEntry = historyArray.find(item => 
            normalizeServiceNumber(item.serviceNumber) === normalizeServiceNumber(serviceNumber) &&
            normalizeString(item.billingPeriod) === normalizeString(billingPeriod) &&
            normalizeString(item.customerName) === normalizeString(customerName)
          );
          
          if (existingEntry) {
            console.log('📋 Mostrando registro existente desde localStorage');
            if (intervalRef.current) clearInterval(intervalRef.current);
            setProgress(100);
            setTimeout(() => {
              setBillData(existingEntry.fullData);
              setIsLoading(false);
              alert('⚠️ Este análisis ya existe en tu historial. Se muestra el registro existente.');
            }, 500);
            return;
          }
        }
        
        // Si no está en localStorage, cargar desde Firestore
        console.log('📥 localStorage vacío, cargando desde Firestore...');
        const firestoreHistory = await loadHistoryFromFirestore();
        const existingEntry = firestoreHistory.find(item => 
          normalizeServiceNumber(item.serviceNumber) === normalizeServiceNumber(serviceNumber) &&
          normalizeString(item.billingPeriod) === normalizeString(billingPeriod) &&
          normalizeString(item.customerName) === normalizeString(customerName)
        );
        
        if (existingEntry) {
          console.log('📋 Mostrando registro existente desde Firestore');
          if (intervalRef.current) clearInterval(intervalRef.current);
          setProgress(100);
          setTimeout(() => {
            setBillData(existingEntry.fullData);
            setIsLoading(false);
            alert('⚠️ Este análisis ya existe en tu historial. Se muestra el registro existente.');
          }, 500);
          return;
        }
      }
      
      // No hay duplicados - mostrar datos nuevos
      console.log('✅ No hay duplicados, mostrando datos extraídos');
      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(100);
      setTimeout(() => {
        setBillData(data);
        setIsLoading(false);
      }, 500);
    } catch (err) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(100);
      setTimeout(() => {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('Ocurrió un error desconocido. Por favor, inténtalo de nuevo.');
        }
        setIsLoading(false);
      }, 500);
    }
  };

  const handleReset = () => {
    setBillData(null);
    setError(null);
    setIsLoading(false);
    setProgress(0);
     if (intervalRef.current) {
        clearInterval(intervalRef.current);
     }
  };

  const handleViewHistoryEntry = (id: number) => {
    const entry = history.find(e => e.id === id);
    if (entry) {
        setBillData(entry.fullData);
        setError(null);
        setIsLoading(false);
        setIsHistoryVisible(false); // Close panel on selection
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('¿Estás seguro de que quieres borrar todo el historial? Esta acción no se puede deshacer.')) {
        try {
            await clearHistoryFromFirestore();
            setHistory([]);
        } catch (error) {
            console.error("Failed to clear history:", error);
            // Update local state anyway
            setHistory([]);
        }
    }
  };

  const handleSaveCurrentAnalysis = async () => {
    if (!billData) return;
    
    try {
      const newEntry: HistoryEntry = {
        id: Date.now(),
        date: new Date().toLocaleString('es-MX'),
        customerName: billData.customerInfo.find(i => i.key.toUpperCase().includes('NOMBRE'))?.value || 'N/A',
        serviceNumber: billData.customerInfo.find(i => i.key.includes('NO. DE SERVICIO'))?.value || 'N/A',
        totalAmount: billData.billingSummary.find(i => i.key.includes('TOTAL A PAGAR'))?.value || 'N/A',
        billingPeriod: billData.billingSummary.find(i => i.key.includes('PERIODO FACTURADO'))?.value || 'N/A',
        fullData: billData
      };
      
      // Save to Firestore
      await saveAnalysisToFirestore(newEntry);
      console.log('✅ Datos guardados correctamente en Firestore');
      
      // Update local state
      setHistory([newEntry, ...history]);
      
      // Mostrar mensaje de éxito
      alert('✅ Análisis guardado correctamente. Estará disponible en tu historial.');
    } catch (error: any) {
      console.error('Error guardando:', error);
      
      if (error.message === 'DUPLICATE_ENTRY') {
        alert('⚠️ Este análisis ya existe en tu historial. No se puede guardar duplicado.');
      } else {
        alert('⚠️ Error al guardar el análisis. Intenta de nuevo.');
      }
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loader progress={progress} />;
    }
    if (error) {
      return <ErrorDisplay message={error} onRetry={handleReset} />;
    }
    if (billData) {
      // Pasar función de guardado al componente
      return <BillDisplay data={billData} onSave={handleSaveCurrentAnalysis} />;
    }
    return <FileUpload onExtract={handleExtract} />;
  };

  return (
    <div className="bg-neutral-950 min-h-screen font-sans text-neutral-300 antialiased flex flex-col">
      <header className="bg-neutral-950/80 backdrop-blur-sm shadow-lg shadow-brand-yellow/10 sticky top-0 z-10 border-b border-neutral-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Calculadora <span className="text-brand-yellow">Fotovoltaica</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsHistoryVisible(true)}
                className="text-neutral-300 hover:text-brand-yellow transition-colors duration-300"
                aria-label="Ver historial"
              >
                <HistoryIcon className="h-6 w-6" />
              </button>
              {billData && !isLoading && (
              <button
                onClick={handleReset}
                className="bg-brand-yellow text-neutral-950 font-bold px-6 py-3 rounded-full hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 text-sm touch-manipulation"
              >
                Analizar Otro
              </button>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        {renderContent()}
      </main>
      <HistoryPanel
        isVisible={isHistoryVisible}
        history={history}
        onViewEntry={handleViewHistoryEntry}
        onClearHistory={handleClearHistory}
        onClose={() => setIsHistoryVisible(false)}
      />
      <footer className="text-center py-6 border-t border-neutral-800/50">
        <p className="text-xs text-neutral-300">
          Powered By <span className="text-brand-yellow">pai-b</span> (Your Private Artificial Intelligence For Business) © Todos los derechos Reservados 2025
        </p>
      </footer>
    </div>
  );
}

export default App;