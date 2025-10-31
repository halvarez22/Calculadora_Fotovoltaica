import * as XLSX from 'xlsx';
import { CurrencyCode, formatCurrency, convertCurrency, CURRENCIES } from '../financial/currencyService';
import { BillData } from '../../types';

// Tipo para jsPDF (dynamic import)
type JsPDF = any;

export interface QuoteData {
  billData?: BillData;
  financialResult: {
    kpis: {
      van: number | null;
      tir: number | null;
      paybackSimple: number | null;
      paybackDescontado: number | null;
      roi: number | null;
      lcoe: number | null;
    };
    projections?: any[];
    cashflow?: any[];
    inputs?: any;
  };
  projectParams: {
    kWp: number;
    capex?: number;
    opexAnual?: number;
    modo: 'CAPEX' | 'PPA';
    costoPpaInicial?: number;
    currency: CurrencyCode;
  };
  customerName?: string;
  serviceNumber?: string;
  date?: string;
}

export function generateExcelQuote(data: QuoteData): void {
  const workbook = XLSX.utils.book_new();
  
  // Hoja 1: Resumen de KPIs
  const kpisData = [
    ['INDICADORES FINANCIEROS', ''],
    ['', ''],
    ['VAN (Valor Actual Neto)', data.financialResult.kpis.van != null ? formatCurrency(convertCurrency(data.financialResult.kpis.van, 'MXN', data.projectParams.currency), data.projectParams.currency) : 'N/A'],
    ['TIR (Tasa Interna de Retorno)', data.financialResult.kpis.tir != null ? `${(data.financialResult.kpis.tir * 100).toFixed(2)}%` : 'N/A'],
    ['Payback Simple (años)', data.financialResult.kpis.paybackSimple ?? 'N/A'],
    ['Payback Descontado (años)', data.financialResult.kpis.paybackDescontado ?? 'N/A'],
    ['ROI', data.financialResult.kpis.roi != null ? `${(data.financialResult.kpis.roi * 100).toFixed(2)}%` : 'N/A'],
    ['LCOE', data.financialResult.kpis.lcoe != null ? formatCurrency(convertCurrency(data.financialResult.kpis.lcoe, 'MXN', data.projectParams.currency), data.projectParams.currency, { minimumFractionDigits: 4, maximumFractionDigits: 4 }) : 'N/A'],
    ['', ''],
    ['PARÁMETROS DEL PROYECTO', ''],
    ['Potencia Instalada (kWp)', `${data.projectParams.kWp} kWp`],
    ['Modo', data.projectParams.modo],
    data.projectParams.modo === 'CAPEX' && data.projectParams.capex ? ['CAPEX', formatCurrency(convertCurrency(data.projectParams.capex, 'MXN', data.projectParams.currency), data.projectParams.currency)] : null,
    ['OPEX Anual', data.projectParams.opexAnual ? formatCurrency(convertCurrency(data.projectParams.opexAnual, 'MXN', data.projectParams.currency), data.projectParams.currency) : 'N/A'],
    data.projectParams.modo === 'PPA' && data.projectParams.costoPpaInicial ? ['Costo PPA Inicial', formatCurrency(data.projectParams.costoPpaInicial, data.projectParams.currency, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '/kWh'] : null,
    ['Moneda', CURRENCIES[data.projectParams.currency].name],
    ['', ''],
    ['INFORMACIÓN DEL CLIENTE', ''],
    ['Cliente', data.customerName || 'N/A'],
    ['Número de Servicio', data.serviceNumber || 'N/A'],
    ['Fecha de Cotización', data.date || new Date().toLocaleDateString('es-MX')],
  ].filter(Boolean);
  
  const kpisSheet = XLSX.utils.aoa_to_sheet(kpisData as any[][]);
  XLSX.utils.book_append_sheet(workbook, kpisSheet, 'Resumen');
  
  // Hoja 2: Proyecciones Anuales
  if (data.financialResult.projections && data.financialResult.projections.length > 0) {
    const projectionsData = [
      ['Año', 'Energía Generada (kWh)', 'Costo Sin Sistema', 'Costo Con Sistema', 'Ahorro', 'OPEX'],
      ...data.financialResult.projections.map((p: any) => [
        p.year,
        p.energia_generada_kwh?.toFixed(2) || p.energia_generada_kwh || 0,
        p.costo_sin_sistema != null ? formatCurrency(convertCurrency(p.costo_sin_sistema, 'MXN', data.projectParams.currency), data.projectParams.currency) : 'N/A',
        p.costo_con_sistema != null ? formatCurrency(convertCurrency(p.costo_con_sistema, 'MXN', data.projectParams.currency), data.projectParams.currency) : 'N/A',
        p.ahorro != null ? formatCurrency(convertCurrency(p.ahorro, 'MXN', data.projectParams.currency), data.projectParams.currency) : 'N/A',
        p.opex != null ? formatCurrency(convertCurrency(p.opex, 'MXN', data.projectParams.currency), data.projectParams.currency) : 'N/A',
      ]),
    ];
    const projectionsSheet = XLSX.utils.aoa_to_sheet(projectionsData);
    XLSX.utils.book_append_sheet(workbook, projectionsSheet, 'Proyecciones');
  }
  
  // Hoja 3: Cashflow
  if (data.financialResult.cashflow && data.financialResult.cashflow.length > 0) {
    const cashflowData = [
      ['Año', 'Flujo', 'Flujo Descontado', 'Acumulado'],
      ...data.financialResult.cashflow.map((cf: any) => [
        cf.year,
        cf.flujo != null ? formatCurrency(convertCurrency(cf.flujo, 'MXN', data.projectParams.currency), data.projectParams.currency) : 'N/A',
        cf.flujoDescontado != null ? formatCurrency(convertCurrency(cf.flujoDescontado, 'MXN', data.projectParams.currency), data.projectParams.currency) : 'N/A',
        cf.acumulado != null ? formatCurrency(convertCurrency(cf.acumulado, 'MXN', data.projectParams.currency), data.projectParams.currency) : 'N/A',
      ]),
    ];
    const cashflowSheet = XLSX.utils.aoa_to_sheet(cashflowData);
    XLSX.utils.book_append_sheet(workbook, cashflowSheet, 'Cashflow');
  }
  
  // Nombre del archivo
  const customerName = (data.customerName || 'Cliente').replace(/[^a-z0-9]/gi, '_').substring(0, 30);
  const fileName = `Cotizacion_Solar_${customerName}_${new Date().toISOString().split('T')[0]}.xlsx`;
  
  XLSX.writeFile(workbook, fileName);
}

// Generador de PDF usando jsPDF
export function generatePDFQuote(data: QuoteData): void {
  // Dynamic import para evitar problemas de SSR
  import('jspdf').then(({ jsPDF }) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yPos = 20;
    const lineHeight = 7;
    const margin = 20;

    // Título
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('COTIZACIÓN DE SISTEMA FOTOVOLTAICO', pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Información del cliente
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN DEL CLIENTE', margin, yPos);
    yPos += lineHeight;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Cliente: ${data.customerName || 'N/A'}`, margin, yPos);
    yPos += lineHeight;
    doc.text(`Número de Servicio: ${data.serviceNumber || 'N/A'}`, margin, yPos);
    yPos += lineHeight;
    doc.text(`Fecha: ${data.date || new Date().toLocaleDateString('es-MX')}`, margin, yPos);
    yPos += 10;

    // Parámetros del proyecto
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PARÁMETROS DEL PROYECTO', margin, yPos);
    yPos += lineHeight;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Potencia Instalada: ${data.projectParams.kWp} kWp`, margin, yPos);
    yPos += lineHeight;
    doc.text(`Modo: ${data.projectParams.modo}`, margin, yPos);
    yPos += lineHeight;
    
    if (data.projectParams.modo === 'CAPEX' && data.projectParams.capex) {
      const capexFormatted = formatCurrency(convertCurrency(data.projectParams.capex, 'MXN', data.projectParams.currency), data.projectParams.currency);
      doc.text(`CAPEX: ${capexFormatted}`, margin, yPos);
      yPos += lineHeight;
    }
    
    if (data.projectParams.opexAnual) {
      const opexFormatted = formatCurrency(convertCurrency(data.projectParams.opexAnual, 'MXN', data.projectParams.currency), data.projectParams.currency);
      doc.text(`OPEX Anual: ${opexFormatted}`, margin, yPos);
      yPos += lineHeight;
    }
    
    if (data.projectParams.modo === 'PPA' && data.projectParams.costoPpaInicial) {
      doc.text(`Costo PPA Inicial: ${formatCurrency(data.projectParams.costoPpaInicial, data.projectParams.currency, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/kWh`, margin, yPos);
      yPos += lineHeight;
    }
    
    doc.text(`Moneda: ${CURRENCIES[data.projectParams.currency].name}`, margin, yPos);
    yPos += 10;

    // KPIs
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('INDICADORES FINANCIEROS (KPIs)', margin, yPos);
    yPos += lineHeight;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const kpis = [
      ['VAN (Valor Actual Neto)', data.financialResult.kpis.van != null ? formatCurrency(convertCurrency(data.financialResult.kpis.van, 'MXN', data.projectParams.currency), data.projectParams.currency) : 'N/A'],
      ['TIR (Tasa Interna de Retorno)', data.financialResult.kpis.tir != null ? `${(data.financialResult.kpis.tir * 100).toFixed(2)}%` : 'N/A'],
      ['Payback Simple (años)', data.financialResult.kpis.paybackSimple ?? 'N/A'],
      ['Payback Descontado (años)', data.financialResult.kpis.paybackDescontado ?? 'N/A'],
      ['ROI', data.financialResult.kpis.roi != null ? `${(data.financialResult.kpis.roi * 100).toFixed(2)}%` : 'N/A'],
      ['LCOE', data.financialResult.kpis.lcoe != null ? formatCurrency(convertCurrency(data.financialResult.kpis.lcoe, 'MXN', data.projectParams.currency), data.projectParams.currency, { minimumFractionDigits: 4, maximumFractionDigits: 4 }) : 'N/A'],
    ];
    
    kpis.forEach(([label, value]) => {
      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`${label}: ${value}`, margin, yPos);
      yPos += lineHeight;
    });

    // Pie de página
    const customerName = (data.customerName || 'Cliente').replace(/[^a-z0-9]/gi, '_').substring(0, 30);
    const fileName = `Cotizacion_Solar_${customerName}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    doc.save(fileName);
  }).catch((error) => {
    console.error('Error al generar PDF:', error);
    alert('Error al generar PDF. Por favor, intente descargar el Excel.');
  });
}

