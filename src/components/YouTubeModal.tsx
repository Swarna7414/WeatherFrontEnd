import React, { useState, useEffect } from 'react';
import { YouTubeVideo } from '../types';
import { weatherApi } from '../services/api';
import { Play, X, ExternalLink, Clock, User } from 'lucide-react';

interface YouTubeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordId: number;
  locationName: string;
}

const YouTubeModal: React.FC<YouTubeModalProps> = ({
  isOpen,
  onClose,
  recordId,
  locationName,
}) => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen && recordId) {
      fetchVideos();
    }
  }, [isOpen, recordId]);

  const fetchVideos = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await weatherApi.getYouTubeVideos(recordId);
      setVideos(response.videos);
    } catch (err) {
      setError('Failed to load videos. Please try again.');
      console.error('YouTube API error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const openVideo = (url: string) => {
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Play className="w-6 h-6 text-red-500 mr-2" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">Travel Videos</h2>
              <p className="text-sm text-gray-600">Videos about {locationName}</p>
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="loading-spinner mr-3"></div>
              <span className="text-gray-600">Loading videos...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <Play className="w-12 h-12 mx-auto mb-2" />
              </div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchVideos}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Play className="w-12 h-12 mx-auto mb-2" />
              </div>
              <p className="text-gray-600">No videos found for this location.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((video, index) => (
                <div
                  key={video.video_id}
                  className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Thumbnail */}
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                      <div className="bg-red-500 rounded-full p-3">
                        <Play className="w-6 h-6 text-white fill-current" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {truncateText(video.title, 60)}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {truncateText(video.description, 120)}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => openVideo(video.url)}
                        className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Watch
                      </button>
                      <div className="flex items-center text-xs text-gray-500">
                        <User className="w-3 h-3 mr-1" />
                        YouTube
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {videos.length > 0 && `${videos.length} video${videos.length !== 1 ? 's' : ''} found`}
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

export default YouTubeModal;
