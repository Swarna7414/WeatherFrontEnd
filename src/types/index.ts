export interface WeatherData {
  date: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  description: string;
  icon: string;
}

export interface WeatherRecord {
  id: number;
  location: string;
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string;
  temperature_data: WeatherData[];
  created_at: string;
  updated_at: string;
}

export interface CreateWeatherRequest {
  location: string;
  start_date: string;
  end_date: string;
}

export interface UpdateWeatherRequest {
  location?: string;
  start_date?: string;
  end_date?: string;
}

export interface YouTubeVideo {
  title: string;
  description: string;
  thumbnail: string;
  video_id: string;
  url: string;
}

export interface GoogleMapsData {
  formatted_address: string;
  latitude: number;
  longitude: number;
  place_id: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface WeatherRecordsResponse {
  records: WeatherRecord[];
}

export interface YouTubeResponse {
  videos: YouTubeVideo[];
}

export interface MapsResponse {
  maps_data: GoogleMapsData;
}
