import React from 'react';
import * as XLSX from 'xlsx';
import { KeyValue, HistoricalConsumptionData } from '../types';
import { DownloadIcon } from './Icons';

interface DataSectionProps {
  title: string;
  icon?: React.ReactNode;
  data?: KeyValue[] | Record<string, any>[];
  type?: 'kv' | 'table' | 'chart';
  columns?: { key: string; label: string }[];
  children?: React.ReactNode;
}

const DataSection: React.FC<DataSectionProps> = ({ title, icon, data, type, columns, children }) => {
  if ((!data || data.length === 0) && !children) {
    return null;
  }

  const handleDownload = () => {
    if (!data) return;

    let worksheetData;
    let headers: string[] | undefined;

    if (type === 'table' && columns) {
      worksheetData = data.map(row => {
        const newRow: Record<string, any> = {};
        columns.forEach(col => {
          newRow[col.label] = row[col.key];
        });
        return newRow;
      });
    } else if (type === 'kv') {
      worksheetData = (data as KeyValue[]).map(item => ({
        'Concepto': item.key,
        'Valor': item.value,
      }));
    } else if (type === 'chart') {
        worksheetData = (data as HistoricalConsumptionData[]).map(item => ({
            'Periodo': item.period,
            'Consumo (KWh)': item.consumptionKWh,
            'Demanda (KW)': item.demandKW,
            'Factor de Potencia': item.powerFactor,
            'Factor de Carga': item.loadFactor,
            'Precio Promedio (MXN)': item.averagePrice,
        }));
    } else {
      return; 
    }

    const worksheet = XLSX.utils.json_to_sheet(worksheetData, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    const sanitizedTitle = title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '_');

    const fileName = `${sanitizedTitle}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const renderContent = () => {
    if (children) {
      return children;
    }

    if (type === 'kv' && data) {
      return (
        <dl className="divide-y divide-neutral-800">
          {(data as KeyValue[]).map((item, index) => (
            <div key={index} className="py-3 grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-300">{item.key}</dt>
              <dd className="text-sm text-white col-span-2 font-semibold">{item.value}</dd>
            </div>
          ))}
        </dl>
      );
    }
    
    if (type === 'table' && columns && data) {
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-800">
            <thead className="bg-neutral-800/50">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-transparent divide-y divide-neutral-800">
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return null;
  };
  
  const hasDownloadableData = (type === 'table' || type === 'kv' || type === 'chart') && data && data.length > 0;

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 sm:p-6 rounded-xl shadow-xl">
      <div className="flex items-center border-b border-white/10 pb-3 mb-4">
        {icon && <span className="text-brand-yellow mr-3">{React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}</span>}
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      {renderContent()}
      {hasDownloadableData && (
        <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
            <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-bold rounded-full shadow-sm text-neutral-950 bg-brand-yellow hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-brand-yellow touch-manipulation"
            >
                <DownloadIcon className="-ml-0.5 mr-2 h-4 w-4" />
                {type === 'chart' ? 'Descargar Datos' : 'Descargar Tabla'}
            </button>
        </div>
     )}
    </div>
  );
};

export default DataSection;