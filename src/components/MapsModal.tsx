import React, { useState, useEffect } from 'react';
import { GoogleMapsData } from '../types';
import { weatherApi } from '../services/api';
import { MapPin, X, ExternalLink, Navigation, Globe } from 'lucide-react';

interface MapsModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordId: number;
  locationName: string;
}

const MapsModal: React.FC<MapsModalProps> = ({
  isOpen,
  onClose,
  recordId,
  locationName,
}) => {
  const [mapsData, setMapsData] = useState<GoogleMapsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen && recordId) {
      fetchMapsData();
    }
  }, [isOpen, recordId]);

  const fetchMapsData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await weatherApi.getMapsData(recordId);
      setMapsData(response.maps_data);
    } catch (err) {
      setError('Failed to load location data. Please try again.');
      console.error('Google Maps API error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const openGoogleMaps = () => {
    if (mapsData) {
      const url = `https://www.google.com/maps?q=${mapsData.latitude},${mapsData.longitude}`;
      window.open(url, '_blank');
    }
  };

  const openDirections = () => {
    if (mapsData) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${mapsData.latitude},${mapsData.longitude}`;
      window.open(url, '_blank');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <MapPin className="w-6 h-6 text-green-500 mr-2" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">Location Details</h2>
              <p className="text-sm text-gray-600">{locationName}</p>
            </div>
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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="loading-spinner mr-3"></div>
              <span className="text-gray-600">Loading location data...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
              </div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchMapsData}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : mapsData ? (
            <div className="space-y-6">
              {/* Location Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start">
                  <Globe className="w-5 h-5 text-blue-500 mr-3 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">Formatted Address</h3>
                    <p className="text-gray-600">{mapsData.formatted_address}</p>
                  </div>
                </div>
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Coordinates</h3>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="font-medium">Latitude:</span> {mapsData.latitude.toFixed(6)}
                    </div>
                    <div>
                      <span className="font-medium">Longitude:</span> {mapsData.longitude.toFixed(6)}
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Place ID</h3>
                  <p className="text-sm text-green-700 font-mono break-all">
                    {mapsData.place_id}
                  </p>
                </div>
              </div>

              {/* Map Preview */}
              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Map Preview</h3>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">
                      {mapsData.formatted_address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={openGoogleMaps}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Google Maps
                </button>
                <button
                  onClick={openDirections}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
              </div>
              <p className="text-gray-600">No location data available.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Powered by Google Maps API
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapsModal;
