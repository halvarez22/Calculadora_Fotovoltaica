import React, { useState } from 'react';
import { BillData } from '../types';
import ConsumptionChart from './ConsumptionChart';
import DataSection from './DataSection';
import { UserIcon, InvoiceIcon, ChartIcon, TableIcon, WrenchIcon, MoneyIcon } from './Icons';
import FinancialPanel from './FinancialPanel';

interface BillDisplayProps {
  data: BillData;
  onSave?: () => void;
  isSaved?: boolean;
}

const BillDisplay: React.FC<BillDisplayProps> = ({ data, onSave, isSaved = false }) => {
  const [saved, setSaved] = useState(isSaved);

  const handleSave = () => {
    if (onSave) {
      onSave();
      setSaved(true);
    }
  };
  const consumptionDetailsColumns = [
    { key: 'Concepto', label: 'Concepto' },
    { key: 'Medida', label: 'Medida' },
    { key: 'Precio (MXN)', label: 'Precio (MXN)' },
    { key: 'Subtotal (MXN)', label: 'Subtotal (MXN)' },
  ];

  const marketCostsColumns = [
    { key: 'Concepto', label: 'Concepto' },
    { key: 'Suministro', label: 'Suministro' },
    { key: 'Transmisión', label: 'Transmisión' },
    { key: 'Distribución', label: 'Distribución' },
    { key: 'CENACE', label: 'CENACE' },
    { key: 'Generación P', label: 'Generación P' },
    { key: 'Generación I', label: 'Generación I' },
    { key: 'SCnMEM', label: 'SCnMEM' },
    { key: 'Importe (MXN)', label: 'Importe (MXN)' },
  ];
  
  const paymentBreakdownColumns = [
    { key: 'Concepto', label: 'Concepto' },
    { key: 'Importe (MXN)', label: 'Importe (MXN)' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Botón de Guardar */}
      {onSave && !saved && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">¿Deseas guardar este análisis?</h3>
            <p className="text-sm text-neutral-300 mt-1">El análisis quedará disponible en tu historial</p>
          </div>
          <button
            onClick={handleSave}
            className="bg-brand-yellow text-neutral-950 font-bold px-8 py-3 rounded-full hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 touch-manipulation flex items-center space-x-2"
          >
            <span>💾</span>
            <span>Guardar Análisis</span>
          </button>
        </div>
      )}
      
      {saved && (
        <div className="bg-green-500/10 backdrop-blur-sm border border-green-500/30 rounded-xl p-4">
          <p className="text-green-400 font-semibold flex items-center space-x-2">
            <span>✅</span>
            <span>Análisis guardado correctamente</span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DataSection icon={<UserIcon/>} title="Información del Cliente" data={data.customerInfo} type="kv" />
        <DataSection icon={<InvoiceIcon/>} title="Resumen de Facturación" data={data.billingSummary} type="kv" />
      </div>
      
      <DataSection 
        icon={<ChartIcon/>} 
        title="Consumo Histórico" 
        data={data.historicalConsumption} 
        type="chart"
      >
        <ConsumptionChart data={data.historicalConsumption} />
      </DataSection>

      {data.consumptionDetails && data.consumptionDetails.length > 0 && (
        <DataSection icon={<TableIcon/>} title="Detalles del Consumo" data={data.consumptionDetails} type="table" columns={consumptionDetailsColumns} />
      )}
      
      {data.marketCosts && data.marketCosts.length > 0 && (
        <DataSection icon={<WrenchIcon/>} title="Costos del Mercado Eléctrico" data={data.marketCosts} type="table" columns={marketCostsColumns} />
      )}

      {data.paymentBreakdown && data.paymentBreakdown.length > 0 && (
        <DataSection icon={<MoneyIcon/>} title="Desglose del Importe a Pagar" data={data.paymentBreakdown} type="table" columns={paymentBreakdownColumns} />
      )}

      {/* Motor Financiero (beta) */}
      <FinancialPanel bill={data} />
    </div>
  );
};

export default BillDisplay;