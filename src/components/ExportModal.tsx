import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, FileCode, X } from 'lucide-react';
import { exportApi, downloadFile } from '../services/api';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<string>('');

  const exportOptions = [
    {
      id: 'json',
      name: 'JSON',
      description: 'Structured data format for developers',
      icon: FileCode,
      color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
    },
    {
      id: 'csv',
      name: 'CSV',
      description: 'Spreadsheet-compatible format',
      icon: FileSpreadsheet,
      color: 'bg-green-100 text-green-700 hover:bg-green-200',
    },
    {
      id: 'pdf',
      name: 'PDF',
      description: 'Professional document format',
      icon: FileText,
      color: 'bg-red-100 text-red-700 hover:bg-red-200',
    },
    {
      id: 'markdown',
      name: 'Markdown',
      description: 'Documentation-friendly format',
      icon: FileText,
      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    },
  ];

  const handleExport = async (type: string) => {
    if (isExporting) return;

    setIsExporting(true);
    setExportType(type);

    try {
      let blob: Blob;
      let filename: string;

      switch (type) {
        case 'json':
          blob = await exportApi.json();
          filename = 'weather_data.json';
          break;
        case 'csv':
          blob = await exportApi.csv();
          filename = 'weather_data.csv';
          break;
        case 'pdf':
          blob = await exportApi.pdf();
          filename = 'weather_data.pdf';
          break;
        case 'markdown':
          blob = await exportApi.markdown();
          filename = 'weather_data.md';
          break;
        default:
          throw new Error('Invalid export type');
      }

      downloadFile(blob, filename);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
      setExportType('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Download className="w-6 h-6 text-primary-500 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Export Weather Data</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Choose a format to export all your weather records:
          </p>

          <div className="space-y-3">
            {exportOptions.map((option) => {
              const IconComponent = option.icon;
              const isCurrentlyExporting = isExporting && exportType === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => handleExport(option.id)}
                  disabled={isExporting}
                  className={`w-full flex items-center p-4 rounded-lg border transition-all duration-200 ${
                    isCurrentlyExporting
                      ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                      : `border-gray-200 hover:border-gray-300 ${option.color}`
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  <div className="flex-1 text-left">
                    <div className="font-semibold">{option.name}</div>
                    <div className="text-sm opacity-75">{option.description}</div>
                  </div>
                  {isCurrentlyExporting && (
                    <div className="loading-spinner ml-2"></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> The export will include all weather records 
              in your database, including location data, temperature information, 
              and timestamps.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
