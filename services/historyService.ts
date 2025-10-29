// Service for managing analysis history with Firestore
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  deleteDoc, 
  doc,
  Timestamp 
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { HistoryEntry } from "../types";

const HISTORY_COLLECTION = "analysis_history";

// Get a unique identifier for the current session/user
const getSessionId = (): string => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

// Normalizar strings para comparación
const normalizeString = (str: string): string => {
  return str.trim().toUpperCase().replace(/\s+/g, ' ');
};

// Verificar si ya existe un análisis duplicado
export const checkDuplicate = async (entry: HistoryEntry): Promise<boolean> => {
  try {
    console.log('🔍 Verificando duplicados para:', {
      serviceNumber: entry.serviceNumber,
      billingPeriod: entry.billingPeriod,
      customerName: entry.customerName
    });
    
    // Buscar en localStorage primero
    const localHistory = localStorage.getItem('billHistory');
    console.log('📦 Historial en localStorage:', localHistory ? JSON.parse(localHistory).length + ' análisis' : 'vacío');
    if (localHistory) {
      const historyArray: HistoryEntry[] = JSON.parse(localHistory);
      const duplicate = historyArray.find(item => {
        const itemSN = normalizeString(item.serviceNumber);
        const itemBP = normalizeString(item.billingPeriod);
        const itemCN = normalizeString(item.customerName);
        const entrySN = normalizeString(entry.serviceNumber);
        const entryBP = normalizeString(entry.billingPeriod);
        const entryCN = normalizeString(entry.customerName);
        
        const match = itemSN === entrySN && itemBP === entryBP && itemCN === entryCN;
        
        if (match) {
          console.log('⚠️ Coincidencia encontrada en localStorage:', {
            item: {
              serviceNumber: item.serviceNumber,
              billingPeriod: item.billingPeriod,
              customerName: item.customerName
            },
            entry: {
              serviceNumber: entry.serviceNumber,
              billingPeriod: entry.billingPeriod,
              customerName: entry.customerName
            },
            normalized: {
              itemSN, itemBP, itemCN,
              entrySN, entryBP, entryCN,
              match: match
            }
          });
        }
        return match;
      });
      
      if (duplicate) {
        console.log('⚠️ Análisis duplicado encontrado en localStorage');
        return true;
      }
    }
    
    // Buscar en Firestore
    const sessionId = getSessionId();
    console.log('🔍 Buscando en Firestore con sessionId:', sessionId);
    const q = query(collection(db, HISTORY_COLLECTION), limit(100));
    const querySnapshot = await getDocs(q);
    
    let duplicateCount = 0;
    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data();
      
      // Normalizar valores para comparación
      const dataServiceNumber = normalizeString(data.serviceNumber || '');
      const dataBillingPeriod = normalizeString(data.billingPeriod || '');
      const dataCustomerName = normalizeString(data.customerName || '');
      const entryServiceNumber = normalizeString(entry.serviceNumber);
      const entryBillingPeriod = normalizeString(entry.billingPeriod);
      const entryCustomerName = normalizeString(entry.customerName);
      
      console.log(`📄 Comparando documento ${docSnap.id}:`, {
        sessionId: data.sessionId === sessionId,
        sessionMatch: data.sessionId,
        currentSession: sessionId,
        serviceNumberMatch: dataServiceNumber === entryServiceNumber,
        dataSN: dataServiceNumber,
        entrySN: entryServiceNumber,
        billingPeriodMatch: dataBillingPeriod === entryBillingPeriod,
        dataBP: dataBillingPeriod,
        entryBP: entryBillingPeriod,
        customerNameMatch: dataCustomerName === entryCustomerName,
        dataCN: dataCustomerName,
        entryCN: entryCustomerName
      });
      
      // NO filtrar por sessionId - verificar duplicados independientemente de la sesión
      if (dataServiceNumber === entryServiceNumber &&
          dataBillingPeriod === entryBillingPeriod &&
          dataCustomerName === entryCustomerName) {
        duplicateCount++;
        console.log('⚠️ Análisis duplicado encontrado en Firestore:', {
          docId: docSnap.id,
          sessionId: data.sessionId,
          esLaMismaSesion: data.sessionId === sessionId
        });
      }
    }
    
    console.log(`✅ Verificación completada. Duplicados encontrados: ${duplicateCount}`);
    return duplicateCount > 0;
  } catch (error) {
    console.error("Error verificando duplicados:", error);
    return false; // Si hay error, permitir guardar para no bloquear al usuario
  }
};

// Save a new analysis entry to Firestore
export const saveAnalysisToFirestore = async (entry: HistoryEntry): Promise<void> => {
  try {
    console.log('💾 saveAnalysisToFirestore called with entry:', entry);

    // Verificar duplicados antes de guardar
    const isDuplicate = await checkDuplicate(entry);
    if (isDuplicate) {
      console.log('⚠️ Entrada duplicada detectada, abortando guardado');
      throw new Error('DUPLICATE_ENTRY');
    }

    // Always save to localStorage first (primary storage for now)
    const localHistory = localStorage.getItem('billHistory');
    const historyArray = localHistory ? JSON.parse(localHistory) : [];
    historyArray.unshift(entry);
    localStorage.setItem('billHistory', JSON.stringify(historyArray));
    console.log('✅ Guardado en localStorage');

    // Save to Firestore with session metadata
    const sessionId = getSessionId();
    console.log('🔑 Session ID para guardado:', sessionId);

    const entryWithMeta = {
      ...entry,
      sessionId,
      createdAt: Timestamp.now(),
    };

    console.log('🌐 Guardando en Firestore...', entryWithMeta);
    const docRef = await addDoc(collection(db, HISTORY_COLLECTION), entryWithMeta);
    console.log('✅ Guardado en Firestore con ID:', docRef.id);
  } catch (error) {
    console.error("❌ Error guardando en Firestore:", error);
    throw error; // Re-throw para que App.tsx sepa que hubo un error
  }
};

// Load analysis history from Firestore (with localStorage fallback)
export const loadHistoryFromFirestore = async (): Promise<HistoryEntry[]> => {
  console.log('🔄 loadHistoryFromFirestore called');

  // Primero cargar de localStorage (más rápido y confiable)
  const localHistory = localStorage.getItem('billHistory');
  if (localHistory) {
    try {
      const parsedHistory = JSON.parse(localHistory);
      console.log('📚 Historial cargado de localStorage:', parsedHistory.length, 'análisis');
      return parsedHistory;
    } catch (parseError) {
      console.error("Error parsing localStorage history:", parseError);
    }
  }

  // Intentar cargar de Firestore para sincronizar
  try {
    console.log('🌐 Intentando cargar de Firestore...');
    const sessionId = getSessionId();
    console.log('🔑 Session ID actual:', sessionId);

    const q = query(
      collection(db, HISTORY_COLLECTION),
      limit(100) // Sin orderBy para evitar errores de índice
    );

    console.log('📡 Ejecutando query a Firestore...');
    const querySnapshot = await getDocs(q);
    console.log('📊 Query completada. Documentos encontrados:', querySnapshot.size);

    const history: HistoryEntry[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      console.log(`📄 Procesando documento ${docSnap.id}:`, {
        sessionId: data.sessionId,
        customerName: data.customerName,
        serviceNumber: data.serviceNumber,
        createdAt: data.createdAt
      });

      const entry: HistoryEntry = {
        id: data.id || Number(docSnap.id),
        date: data.createdAt?.toDate?.().toLocaleString('es-MX') || data.date || new Date().toLocaleString('es-MX'),
        customerName: data.customerName,
        serviceNumber: data.serviceNumber,
        totalAmount: data.totalAmount,
        billingPeriod: data.billingPeriod,
        fullData: data.fullData
      };

      // Solo incluir entradas de esta sesión
      if (data.sessionId === sessionId) {
        console.log('✅ Documento incluido (misma sesión)');
        history.push(entry);
      } else {
        console.log('❌ Documento excluido (sesión diferente)');
      }
    });

    console.log('📋 Documentos filtrados por sesión:', history.length);

    // Ordenar por fecha más reciente primero
    history.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

    if (history.length > 0) {
      console.log('✅ Historial sincronizado desde Firestore:', history.length, 'análisis');
      localStorage.setItem('billHistory', JSON.stringify(history));
      return history;
    } else {
      console.log('⚠️ No se encontraron documentos para esta sesión en Firestore');
    }
  } catch (error) {
    console.error("❌ Error cargando de Firestore:", error);
    console.log("Firestore no disponible, usando localStorage");
  }

  return [];
};

// Clear all analysis history (localStorage only for now)
export const clearHistoryFromFirestore = async (): Promise<void> => {
  try {
    // Clear localStorage (always works)
    localStorage.removeItem('billHistory');
    
    // Try to clear from Firestore (optional, non-blocking)
    const sessionId = getSessionId();
    const q = query(collection(db, HISTORY_COLLECTION));
    const querySnapshot = await getDocs(q);
    
    const deletePromises = querySnapshot.docs
      .filter(doc => doc.data().sessionId === sessionId)
      .map(doc => deleteDoc(doc.ref));
    
    await Promise.all(deletePromises);
  } catch (error) {
    console.log("Firestore clear not available, localStorage cleared:", error);
    // Continue - localStorage is cleared
  }
};

