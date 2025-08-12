# Weather App Frontend

A modern React TypeScript frontend for the Weather App with a beautiful, responsive UI and comprehensive functionality.

## Features

### Core Functionality
- **Create Weather Records**: Add new weather records with location and date range
- **View Weather Data**: Display all weather records with detailed information
- **Update Records**: Modify existing weather records
- **Delete Records**: Remove weather records from the database

### Advanced Features
- **YouTube Integration**: View travel videos for specific locations
- **Google Maps Integration**: Get location details and directions
- **Data Export**: Export weather data in multiple formats (JSON, CSV, PDF, Markdown)
- **Real-time Validation**: Form validation with helpful error messages
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

### UI/UX Features
- **Modern Design**: Clean, professional interface with smooth animations
- **Interactive Cards**: Expandable weather cards with detailed information
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Visual feedback during API operations
- **Error Handling**: Graceful error handling with user-friendly messages

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Axios** for API communication
- **React Hot Toast** for notifications
- **Lucide React** for icons
- **Date-fns** for date formatting

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

The application will start on `http://localhost:3000`

### 3. Build for Production
```bash
npm run build
```

## Project Structure

```
src/
├── components/          # React components
│   ├── WeatherForm.tsx  # Form for creating/updating records
│   ├── WeatherCard.tsx  # Individual weather record display
│   ├── ExportModal.tsx  # Data export functionality
│   ├── YouTubeModal.tsx # YouTube videos modal
│   └── MapsModal.tsx    # Google Maps modal
├── services/            # API services
│   └── api.ts          # API communication layer
├── types/              # TypeScript type definitions
│   └── index.ts        # All type definitions
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## API Integration

The frontend communicates with the Python Flask backend through RESTful APIs:

- **Weather Records**: Full CRUD operations
- **YouTube API**: Location-based video search
- **Google Maps API**: Location geocoding and mapping
- **Data Export**: Multiple format support

## Key Components

### WeatherForm
- Handles both creation and updating of weather records
- Real-time validation for location and date inputs
- Support for various location formats (city, zip code, landmarks)

### WeatherCard
- Displays weather record information in an expandable card
- Shows temperature data, humidity, and weather descriptions
- Action buttons for edit, delete, YouTube videos, and maps

### ExportModal
- Supports multiple export formats (JSON, CSV, PDF, Markdown)
- Automatic file download functionality
- Progress indicators during export

### YouTubeModal
- Displays location-based travel videos
- Video thumbnails with play functionality
- Direct links to YouTube

### MapsModal
- Shows detailed location information
- Google Maps integration with directions
- Coordinate display and place details

## Styling

The application uses Tailwind CSS with custom configurations:

- **Color Scheme**: Blue-based primary colors with weather-themed accents
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first design approach
- **Custom Components**: Reusable styled components

## Error Handling

- **API Errors**: Graceful handling of network and server errors
- **Validation Errors**: Real-time form validation with helpful messages
- **User Feedback**: Toast notifications for success and error states
- **Loading States**: Visual indicators during async operations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Environment Variables

The frontend automatically connects to the backend at `http://localhost:5000`. To change this, set the `REACT_APP_API_URL` environment variable.

## Contributing

1. Follow TypeScript best practices
2. Use functional components with hooks
3. Maintain consistent code formatting
4. Add proper error handling
5. Test all functionality before submitting

## License

This project is part of the Weather App assessment and follows the specified requirements.
