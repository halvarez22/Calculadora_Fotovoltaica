import React from 'react';
import { HistoricalConsumptionData } from '../types';

const ConsumptionChart: React.FC<{ data: HistoricalConsumptionData[] }> = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-neutral-300">No hay datos de consumo histórico disponibles.</p>;
  }

  const maxConsumption = Math.max(...data.map((d) => d.consumptionKWh), 0);
  const maxDemand = Math.max(...data.map((d) => d.demandKW), 0);

  // Escala combinada para que ninguna barra se salga del contenedor
  const baseMax = Math.max(maxConsumption, maxDemand);
  const yAxisMax = baseMax > 0 ? baseMax * 1.1 : 100; // 10% padding

  const reversedData = [...data].reverse();

  return (
    <div className="space-y-4">
        <div className="flex space-x-6 text-sm text-neutral-300">
            <div className="flex items-center">
                <span className="w-4 h-4 rounded-sm bg-brand-yellow mr-2"></span>
                Consumo (KWh)
            </div>
            <div className="flex items-center">
                <span className="w-4 h-4 rounded-sm bg-neutral-500 mr-2"></span>
                Demanda (KW)
            </div>
        </div>
      <div className="w-full h-72 pr-4 pl-0 py-4 relative flex items-end space-x-2 sm:space-x-4">
        {/* Y-Axis Labels */}
        <div className="h-full absolute left-0 top-0 flex flex-col justify-between text-xs text-neutral-300 -translate-x-full pr-2 text-right">
            <span>{yAxisMax.toFixed(0)}</span>
            <span>{(yAxisMax * 0.5).toFixed(0)}</span>
            <span>0</span>
        </div>
        {/* Y-Axis Line */}
         <div className="absolute top-0 left-0 h-full w-px bg-neutral-800"></div>


        {reversedData.map((item, index) => {
          const consumptionHeight = baseMax > 0 ? Math.min((item.consumptionKWh / yAxisMax) * 100, 100) : 0;
          const demandHeight = baseMax > 0 ? Math.min((item.demandKW / yAxisMax) * 100, 100) : 0;

          return (
            <div key={`${item.period}-${index}`} className="flex-1 h-full flex flex-col justify-end items-center group">
              <div className="relative w-full h-full flex items-end justify-center gap-1">
                {/* Consumption Bar */}
                <div
                  className="w-1/2 bg-brand-yellow rounded-t-sm transition-all duration-300 ease-out"
                  style={{ height: `${consumptionHeight}%` }}
                  title={`Consumo: ${item.consumptionKWh} KWh`}
                ></div>
                {/* Demand Bar */}
                <div
                  className="w-1/2 bg-neutral-500 rounded-t-sm transition-all duration-300 ease-out"
                  style={{ height: `${demandHeight}%` }}
                  title={`Demanda: ${item.demandKW} KW`}
                ></div>

                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 w-40 p-2 bg-neutral-950/95 backdrop-blur-sm border border-white/10 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none transform -translate-x-1/2 left-1/2 shadow-xl">
                  <p className="font-bold text-center border-b border-white/10 pb-1 mb-1">{item.period}</p>
                  <p className="flex items-center"><span className="w-2 h-2 rounded-full bg-brand-yellow mr-2"></span>Consumo: {item.consumptionKWh} KWh</p>
                  <p className="flex items-center"><span className="w-2 h-2 rounded-full bg-neutral-500 mr-2"></span>Demanda: {item.demandKW} KW</p>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-neutral-950"></div>
                </div>

              </div>
              <span className="mt-2 text-xs text-neutral-300 font-medium">{item.period}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default ConsumptionChart;