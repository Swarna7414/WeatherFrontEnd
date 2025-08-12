import React, { useState } from 'react';
import { CreateWeatherRequest, UpdateWeatherRequest } from '../types';
import { Calendar, MapPin, Cloud } from 'lucide-react';

interface WeatherFormProps {
  onSubmit: (data: CreateWeatherRequest | UpdateWeatherRequest) => void;
  initialData?: Partial<CreateWeatherRequest>;
  isLoading?: boolean;
  mode: 'create' | 'update';
}

const WeatherForm: React.FC<WeatherFormProps> = ({
  onSubmit,
  initialData = {},
  isLoading = false,
  mode,
}) => {
  const [formData, setFormData] = useState<CreateWeatherRequest>({
    location: initialData.location || '',
    start_date: initialData.start_date || '',
    end_date: initialData.end_date || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    }

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (startDate > endDate) {
        newErrors.end_date = 'End date must be after start date';
      } else if (diffDays > 30) {
        newErrors.end_date = 'Date range cannot exceed 30 days';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (mode === 'update') {
        const updateData: UpdateWeatherRequest = {};
        if (formData.location !== initialData.location) updateData.location = formData.location;
        if (formData.start_date !== initialData.start_date) updateData.start_date = formData.start_date;
        if (formData.end_date !== initialData.end_date) updateData.end_date = formData.end_date;
        onSubmit(updateData);
      } else {
        onSubmit(formData);
      }
    }
  };

  const handleInputChange = (field: keyof CreateWeatherRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
      <div className="flex items-center mb-6">
        <Cloud className="w-6 h-6 text-primary-500 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">
          {mode === 'create' ? 'Create New Weather Record' : 'Update Weather Record'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location Input */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Location
          </label>
          <input
            type="text"
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="Enter city, zip code, or landmark..."
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
              errors.location ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location}</p>
          )}
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Start Date
            </label>
            <input
              type="date"
              id="start_date"
              value={formData.start_date}
              onChange={(e) => handleInputChange('start_date', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                errors.start_date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.start_date && (
              <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
            )}
          </div>

          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              End Date
            </label>
            <input
              type="date"
              id="end_date"
              value={formData.end_date}
              onChange={(e) => handleInputChange('end_date', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                errors.end_date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.end_date && (
              <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary-500 hover:bg-primary-600 btn-primary'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="loading-spinner mr-2"></div>
              {mode === 'create' ? 'Creating...' : 'Updating...'}
            </div>
          ) : (
            mode === 'create' ? 'Create Weather Record' : 'Update Weather Record'
          )}
        </button>
      </form>

      {/* Help Text */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Tips:</strong> You can enter any location format - city names, zip codes, 
          postal codes, landmarks, or GPS coordinates. The system will automatically 
          geocode your location and fetch weather data for the specified date range.
        </p>
      </div>
    </div>
  );
};

export default WeatherForm;
