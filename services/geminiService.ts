// Fix: Import `Type` to use in the response schema.
import { GoogleGenAI, Type } from "@google/genai";
import { BillData } from '../types';

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
};

interface BillImages {
    front: { base64: string; mimeType: string };
    back: { base64: string; mimeType: string };
}

export const extractBillData = async (
  images: BillImages
): Promise<BillData> => {
  // Fix: Use import.meta.env instead of process.env for Vite
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("La clave API no está configurada. Contacta al administrador.");
  }
  const ai = new GoogleGenAI({ apiKey });

  const imagePartFront = fileToGenerativePart(images.front.base64, images.front.mimeType);
  const imagePartBack = fileToGenerativePart(images.back.base64, images.back.mimeType);

  // Fix: Simplified prompt since responseSchema handles JSON structure enforcement.
  const prompt = `
    Analiza los dos archivos adjuntos. Pueden ser imágenes (JPG, PNG, WEBP) o documentos PDF. El primer archivo debería ser el FRENTE del recibo (con el logo de CFE, nombre, dirección) y el segundo el REVERSO (con el consumo histórico y desglose de pago).
    
    1. Determina si los archivos están en el orden correcto. En el campo 'imageOrientation', responde con 'correct', 'swapped' o 'unknown'.
    2. Independientemente del orden, extrae la información de AMBOS archivos y combínala en un único objeto JSON estructurado según el schema.
    
    Asegúrate de extraer todos los renglones de cada tabla, especialmente de la sección de consumo histórico.
    Para 'historicalConsumption', 'demandKW' y 'consumptionKWh' deben ser números. Todos los demás valores deben ser strings.
  `;
  
  // Fix: Define a responseSchema to ensure the model returns structured JSON data reliably.
  const schema = {
    type: Type.OBJECT,
    properties: {
      imageOrientation: {
        type: Type.STRING,
        description: "Indica si los archivos fueron subidos en el orden correcto. Posibles valores: 'correct' si el primer archivo es el frente y el segundo el reverso; 'swapped' si están intercambiados; 'unknown' si no se puede determinar.",
      },
      customerInfo: {
        type: Type.ARRAY,
        description: "Información del cliente.",
        items: {
          type: Type.OBJECT,
          properties: {
            key: { type: Type.STRING, description: "Etiqueta del dato, ej. 'NOMBRE O RAZÓN SOCIAL'." },
            value: { type: Type.STRING, description: "Valor del dato." },
          },
          required: ['key', 'value'],
        },
      },
      billingSummary: {
        type: Type.ARRAY,
        description: "Resumen de la facturación.",
        items: {
          type: Type.OBJECT,
          properties: {
            key: { type: Type.STRING, description: "Etiqueta del dato, ej. 'TOTAL A PAGAR'." },
            value: { type: Type.STRING, description: "Valor del dato." },
          },
          required: ['key', 'value'],
        },
      },
      consumptionDetails: {
        type: Type.ARRAY,
        description: "Detalles del consumo facturado. Si no existe, devuelve un array vacío.",
        items: {
          type: Type.OBJECT,
          properties: {
            "Concepto": { type: Type.STRING },
            "Medida": { type: Type.STRING },
            "Precio (MXN)": { type: Type.STRING },
            "Subtotal (MXN)": { type: Type.STRING },
          },
        },
      },
      marketCosts: {
        type: Type.ARRAY,
        description: "Costos del mercado eléctrico. Si no existe, devuelve un array vacío.",
        items: {
          type: Type.OBJECT,
          properties: {
            "Concepto": { type: Type.STRING },
            "Suministro": { type: Type.STRING },
            "Transmisión": { type: Type.STRING },
            "Distribución": { type: Type.STRING },
            "CENACE": { type: Type.STRING },
            "Generación P": { type: Type.STRING },
            "Generación I": { type: Type.STRING },
            "SCnMEM": { type: Type.STRING },
            "Importe (MXN)": { type: Type.STRING },
          },
        },
      },
      paymentBreakdown: {
        type: Type.ARRAY,
        description: "Desglose del importe a pagar. Si no existe, devuelve un array vacío.",
        items: {
          type: Type.OBJECT,
          properties: {
            "Concepto": { type: Type.STRING },
            "Importe (MXN)": { type: Type.STRING },
          },
        },
      },
      historicalConsumption: {
        type: Type.ARRAY,
        description: "Tabla del consumo histórico de los últimos meses.",
        items: {
          type: Type.OBJECT,
          properties: {
            period: { type: Type.STRING, description: "Período (mes y año), ej. 'JUN 24'." },
            demandKW: { type: Type.NUMBER, description: "Demanda en KW." },
            consumptionKWh: { type: Type.NUMBER, description: "Consumo en KWh." },
            powerFactor: { type: Type.STRING, description: "Factor de potencia." },
            loadFactor: { type: Type.STRING, description: "Factor de carga." },
            averagePrice: { type: Type.STRING, description: "Precio promedio." },
          },
          required: ['period', 'demandKW', 'consumptionKWh', 'powerFactor', 'loadFactor', 'averagePrice'],
        },
      },
    },
    required: ['imageOrientation', 'customerInfo', 'billingSummary', 'historicalConsumption'],
  };


  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePartFront, imagePartBack, { text: prompt }] },
      // Fix: Add responseSchema to the config.
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text.trim();
    // With a schema, cleaning markdown fences is less likely needed, but it's a safe fallback.
    const cleanedText = text.replace(/^```json\s*|```$/g, '');
    
    let parsedData;
    try {
        parsedData = JSON.parse(cleanedText);
    } catch (parseError) {
        console.error("Error al parsear JSON:", parseError, "Respuesta recibida:", cleanedText);
        throw new Error("La IA no pudo procesar la estructura del recibo. Asegúrate de que las imágenes sean de alta calidad, bien iluminadas y sin recortes.");
    }
    
    const { imageOrientation, ...billData } = parsedData;
    
    if (imageOrientation === 'swapped') {
        throw new Error("IMAGENES_INTERCAMBIADAS");
    }

    if (!billData.customerInfo || !billData.historicalConsumption || !Array.isArray(billData.customerInfo)) {
        throw new Error("La información extraída está incompleta. La IA no pudo encontrar todos los datos necesarios en las imágenes.");
    }

    return billData as BillData;

  } catch (error) {
    console.error("Error al procesar con Gemini:", error);
     if (error instanceof Error) {
        // Re-lanza errores específicos que ya hemos creado.
        if (error.message === "IMAGENES_INTERCAMBIADAS" || error.message.startsWith("La IA no pudo") || error.message.startsWith("La información extraída")) {
            throw error;
        }
        if (error.message.includes('API key not valid')) {
            throw new Error("Problema de autenticación: La clave API no es válida.");
        }
    }
    // Fallback para otros errores de la API
    throw new Error("Ocurrió un error inesperado al comunicarse con el servicio de IA. Inténtalo de nuevo más tarde.");
  }
};