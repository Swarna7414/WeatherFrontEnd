import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { 
  Cloud, 
  Plus, 
  Download, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import WeatherForm from './components/WeatherForm';
import WeatherCard from './components/WeatherCard';
import ExportModal from './components/ExportModal';
import YouTubeModal from './components/YouTubeModal';
import MapsModal from './components/MapsModal';
import { WeatherRecord, CreateWeatherRequest, UpdateWeatherRequest } from './types';
import { weatherApi } from './services/api';

const App: React.FC = () => {
  // state for weather records and loading
  const [weatherRecords, setWeatherRecords] = useState<WeatherRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  // state for editing and modals
  const [editingRecord, setEditingRecord] = useState<WeatherRecord | null>( null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);
  const [showMapsModal, setShowMapsModal] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<number>(0);
  const [selectedLocationName, setSelectedLocationName] = useState<string>('');

  // Load weather records on component mount
  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await weatherApi.getAll();
      setWeatherRecords(data);
    } catch (error) {
      console.error('Failed to load records:', error);
      toast.error('Failed to load weather records');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecord = async (data: CreateWeatherRequest | UpdateWeatherRequest) => {
    if ('location' in data && data.location && 'start_date' in data && data.start_date && 'end_date' in data && data.end_date) {
      setCreating(true);
      try {
        const newRecord = await weatherApi.create(data as CreateWeatherRequest);
        setWeatherRecords(prev => [newRecord, ...prev]);
        toast.success('Weather record created successfully!');
      } catch (error: any) {
        console.error('Failed to create record:', error);
        const errorMessage = error.response?.data?.error || 'Failed to create weather record';
        toast.error(errorMessage);
      } finally {
        setCreating(false);
      }
    }
  };

  const handleUpdateRecord = async (data: CreateWeatherRequest | UpdateWeatherRequest) => {
    if (!editingRecord) return;

    setUpdating(true);
    try {
      const updatedRecord = await weatherApi.update(editingRecord.id, data as UpdateWeatherRequest);
      setWeatherRecords(prev => 
        prev.map(record => 
          record.id === editingRecord.id ? updatedRecord : record
        )
      );
      setEditingRecord(null);
      toast.success('Weather record updated successfully!');
    } catch (error: any) {
      console.error('Failed to update record:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update weather record';
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteRecord = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this weather record?')) {
      return;
    }

    try {
      await weatherApi.delete(id);
      setWeatherRecords(prev => prev.filter(record => record.id !== id));
      toast.success('Weather record deleted successfully!');
    } catch (error) {
      console.error('Failed to delete record:', error);
      toast.error('Failed to delete weather record');
    }
  };

  const handleEditRecord = (record: WeatherRecord) => {
    setEditingRecord(record);
  };

  const handleViewYouTube = (id: number) => {
    const record = weatherRecords.find((r: WeatherRecord) => r.id === id);
    if (record) {
      setSelectedRecordId(id);
      setSelectedLocationName(record.location);
      setShowYouTubeModal(true);
    }
  };

  const handleViewMaps = (id: number) => {
    const record = weatherRecords.find((r: WeatherRecord) => r.id === id);
    if (record) {
      setSelectedRecordId(id);
      setSelectedLocationName(record.location);
      setShowMapsModal(true);
    }
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Cloud className="w-8 h-8 text-primary-500 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">Weather App</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button
                onClick={loadRecords}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-1">
            <WeatherForm
              onSubmit={editingRecord ? handleUpdateRecord : handleCreateRecord}
              initialData={editingRecord || undefined}
              isLoading={creating || updating}
              mode={editingRecord ? 'update' : 'create'}
            />
            
            {editingRecord && (
              <div className="mt-4">
                <button
                  onClick={handleCancelEdit}
                  className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel Edit
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Records */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Weather Records ({weatherRecords.length})
              </h2>
                              {weatherRecords.length > 0 && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>All systems operational</span>
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="loading-spinner mr-3"></div>
                <span className="text-gray-600">Loading weather records...</span>
              </div>
            ) : weatherRecords.length === 0 ? (
              <div className="text-center py-12">
                <Cloud className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No weather records yet</h3>
                <p className="text-gray-600 mb-6">
                  Create your first weather record by entering a location and date range above.
                </p>
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span>Weather data will be fetched automatically</span>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {weatherRecords.map((record) => (
                  <WeatherCard
                    key={record.id}
                    record={record}
                    onEdit={handleEditRecord}
                    onDelete={handleDeleteRecord}
                    onViewYouTube={handleViewYouTube}
                    onViewMaps={handleViewMaps}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />

      <YouTubeModal
        isOpen={showYouTubeModal}
        onClose={() => setShowYouTubeModal(false)}
        recordId={selectedRecordId}
        locationName={selectedLocationName}
      />

      <MapsModal
        isOpen={showMapsModal}
        onClose={() => setShowMapsModal(false)}
        recordId={selectedRecordId}
        locationName={selectedLocationName}
      />
    </div>
  );
};

export default App;
