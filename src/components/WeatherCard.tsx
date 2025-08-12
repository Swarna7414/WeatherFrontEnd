import React, { useState } from 'react';
import { WeatherRecord, WeatherData } from '../types';
import { format } from 'date-fns';
import { 
  MapPin, 
  Calendar, 
  Thermometer, 
  Droplets, 
  Edit, 
  Trash2, 
  Play, 
  Map,
  ChevronDown,
  ChevronUp,
  Cloud
} from 'lucide-react';

interface WeatherCardProps {
  record: WeatherRecord;
  onEdit: (record: WeatherRecord) => void;
  onDelete: (id: number) => void;
  onViewYouTube: (id: number) => void;
  onViewMaps: (id: number) => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  record,
  onEdit,
  onDelete,
  onViewYouTube,
  onViewMaps,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getWeatherIcon = (description: string): string => {
    const desc = description.toLowerCase();
    if (desc.includes('rain') || desc.includes('drizzle')) return '🌧️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('clear') || desc.includes('sun')) return '☀️';
    if (desc.includes('thunder')) return '⛈️';
    if (desc.includes('fog') || desc.includes('mist')) return '🌫️';
    return '🌤️';
  };

  const getAverageTemperature = (): number => {
    if (!record.temperature_data || record.temperature_data.length === 0) return 0;
    const sum = record.temperature_data.reduce((acc, data) => acc + data.temperature, 0);
    return Math.round(sum / record.temperature_data.length);
  };

  const getTemperatureRange = (): { min: number; max: number } => {
    if (!record.temperature_data || record.temperature_data.length === 0) {
      return { min: 0, max: 0 };
    }
    const temps = record.temperature_data.map(data => data.temperature);
    return {
      min: Math.round(Math.min(...temps)),
      max: Math.round(Math.max(...temps))
    };
  };

  const tempRange = getTemperatureRange();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 weather-card">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <MapPin className="w-5 h-5 text-primary-500 mr-2" />
            <h3 className="text-xl font-bold text-gray-800">{record.location}</h3>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {format(new Date(record.start_date), 'MMM dd')} - {format(new Date(record.end_date), 'MMM dd, yyyy')}
            </span>
          </div>
        </div>
        
        {/* Temperature Summary */}
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600">
            {getAverageTemperature()}°C
          </div>
          <div className="text-sm text-gray-500">
            {tempRange.min}° - {tempRange.max}°
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => onEdit(record)}
          className="flex items-center px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </button>
        <button
          onClick={() => onViewYouTube(record.id)}
          className="flex items-center px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          <Play className="w-4 h-4 mr-1" />
          Videos
        </button>
        <button
          onClick={() => onViewMaps(record.id)}
          className="flex items-center px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
        >
          <Map className="w-4 h-4 mr-1" />
          Map
        </button>
        <button
          onClick={() => onDelete(record.id)}
          className="flex items-center px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </button>
      </div>

      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center py-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="w-4 h-4 mr-1" />
            Hide Details
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4 mr-1" />
            Show Details
          </>
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 animate-slide-up">
          {/* Weather Data Grid */}
          {record.temperature_data && record.temperature_data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {record.temperature_data.map((data: WeatherData, index: number) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-gray-800">
                      {format(new Date(data.date), 'MMM dd')}
                    </span>
                    <span className="text-2xl">{getWeatherIcon(data.description)}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-gray-700">
                      <Thermometer className="w-4 h-4 mr-2" />
                      <span>{Math.round(data.temperature)}°C</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Droplets className="w-4 h-4 mr-2" />
                      <span>{data.humidity}% humidity</span>
                    </div>
                    <div className="text-sm text-gray-600 capitalize">
                      {data.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Cloud className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No weather data available</p>
            </div>
          )}

          {/* Record Metadata */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Created:</span> {format(new Date(record.created_at), 'MMM dd, yyyy HH:mm')}
              </div>
              <div>
                <span className="font-medium">Updated:</span> {format(new Date(record.updated_at), 'MMM dd, yyyy HH:mm')}
              </div>
              <div>
                <span className="font-medium">Coordinates:</span> {record.latitude.toFixed(4)}, {record.longitude.toFixed(4)}
              </div>
              <div>
                <span className="font-medium">Days:</span> {record.temperature_data?.length || 0} days
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
