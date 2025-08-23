# RahulGram - Netflix-like Movie Streaming Platform

A modern, responsive movie streaming website built with React, TypeScript, and styled-components. Features a Netflix-like UI/UX with movie browsing, search, and streaming capabilities.

## 🎬 Features

- **Netflix-like UI/UX**: Modern, responsive design with smooth animations
- **Movie Browsing**: Browse trending, popular, top-rated, and upcoming movies
- **Movie Details**: Detailed movie information with cast, ratings, and descriptions
- **Movie Streaming**: Integrated with 111movies API for movie streaming
- **Search Functionality**: Search for movies by title
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Watchlist**: Add/remove movies to your personal watchlist

## 🚀 Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **TMDB API** - Movie database and metadata
- **111movies API** - Movie streaming service

## 📋 Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rahulgram
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application.

## 🔧 Configuration

The application uses the following APIs:

### TMDB API
- Used for movie metadata, posters, and information
- API key is already configured in `src/services/api.ts`
- Provides movie data including titles, descriptions, ratings, etc.

### 111movies API
- Used for movie streaming
- Endpoint: `https://111movies.com/movie/{id}`
- Supports both TMDB IDs and IMDB IDs (with 'tt' prefix)

## 📱 Usage

### Browsing Movies
- **Home Page**: View trending movies and different categories
- **Categories**: Navigate through Trending, Popular, Top Rated, and Upcoming movies
- **Movie Cards**: Hover over movie cards to see details and play options

### Watching Movies
- Click the "Play" button on any movie card or detail page
- Movies will open in the integrated player using 111movies API
- Full-screen viewing experience with movie information overlay

### Search
- Use the search icon in the navigation bar
- Type movie titles to find specific movies
- Results are displayed in a Netflix-style grid

### Movie Details
- Click "More Info" on any movie card
- View detailed information including:
  - Cast and crew
  - Ratings and reviews
  - Release date and runtime
  - Genre tags
  - Movie overview

## 🎨 UI Components

### Navigation
- Fixed navbar with Netflix-style branding
- Search functionality with expandable input
- User profile and notification icons

### Hero Banner
- Featured movie display with backdrop image
- Play and More Info buttons
- Movie title, rating, and overview

### Movie Rows
- Horizontal scrolling movie lists
- Navigation arrows for browsing
- Responsive grid layout

### Movie Cards
- Hover effects with movie information
- Add to watchlist functionality
- Play button overlay

### Movie Player
- Full-screen video player
- Movie information overlay
- Control buttons for playback

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Navigation component
│   ├── HeroBanner.tsx  # Featured movie banner
│   ├── MovieCard.tsx   # Individual movie card
│   └── MovieRow.tsx    # Horizontal movie list
├── pages/              # Page components
│   ├── Home.tsx        # Home page with movie browsing
│   ├── MovieDetail.tsx # Movie detail page
│   └── MoviePlayer.tsx # Movie streaming player
├── services/           # API services
│   └── api.ts         # TMDB and 111movies API integration
├── styles/            # Global styles
│   └── GlobalStyles.ts # Global CSS and animations
├── types/             # TypeScript type definitions
│   └── index.ts       # Movie and API interfaces
└── App.tsx            # Main application component
```

## 🌟 Key Features

### Responsive Design
- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly navigation

### Performance
- Lazy loading for images
- Optimized API calls
- Smooth scrolling and animations

### User Experience
- Intuitive navigation
- Loading states and error handling
- Smooth transitions between pages

## 🔒 API Integration

### TMDB API
The application fetches movie data from The Movie Database (TMDB) API:
- Movie listings (trending, popular, top-rated, upcoming)
- Movie details and metadata
- Poster and backdrop images
- Cast and crew information

### 111movies API
For movie streaming, the app integrates with 111movies:
- Direct streaming links
- Support for both TMDB and IMDB IDs
- Full-screen video playback

## 🚀 Deployment

To build the application for production:

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational purposes. Please respect the terms of service for the APIs used (TMDB and 111movies).

## 🙏 Acknowledgments

- **TMDB** for providing comprehensive movie data
- **111movies** for streaming capabilities
- **Netflix** for UI/UX inspiration
- **React** and **TypeScript** communities for excellent documentation

## 📞 Support

If you encounter any issues or have questions:
1. Check the browser console for error messages
2. Verify your internet connection
3. Ensure all dependencies are properly installed
4. Check that the APIs are accessible

---

**Note**: This is a demo application for educational purposes. The streaming functionality depends on the availability and terms of service of the 111movies API.
