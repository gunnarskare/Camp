# Været for Agder avdelingen

A weather forecast application for the Agder region in Norway. Displays temperature, precipitation, and wind data from MET Norway's API for multiple locations.

## Features

- **Multi-location weather forecasts**: Add and manage up to 9 locations
- **Customizable alert thresholds**: Configure color-coded warnings for rain, wind, and temperature
- **Interactive map**: Search and select locations using OpenStreetMap
- **Geolocation support**: Use your current location to add places quickly
- **Time range filtering**: View forecasts from 07:00 to 14:00 (Europe/Oslo timezone)
- **Day selection**: View today's, tomorrow's, or the day after's forecast

## Project Structure

```
Campino/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Custom styles
├── js/
│   ├── app.js          # Main application logic
│   ├── api.js          # API calls (MET Norway, geocoding)
│   ├── storage.js      # LocalStorage management
│   ├── map.js          # Leaflet map functionality
│   └── utils.js        # Utility functions
├── mve-mobil-color.svg # Logo
└── README.md           # This file
```

## Technologies Used

- **HTML5**: Semantic markup
- **Tailwind CSS**: Utility-first CSS framework (via CDN)
- **Vanilla JavaScript (ES6 Modules)**: Modern JavaScript with module system
- **Leaflet**: Interactive maps
- **MET Norway API**: Weather forecast data
- **OpenStreetMap Nominatim**: Geocoding and reverse geocoding

## Setup

1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. No build process or dependencies required - it's a static website!

## Usage

### Adding a Location

1. Click the "+" card or "Bruk min posisjon" button
2. Search for a place or click on the map
3. Enter a name and save

### Configuring Alert Thresholds

1. Click "Innstillinger" (Settings)
2. Set thresholds for rain (mm/h), wind (m/s), and temperature (°C)
3. Colors indicate severity:
   - **Yellow**: First threshold reached
   - **Orange**: Second threshold reached
   - **Red**: Highest threshold reached

### Viewing Forecasts

- Select a day from the dropdown (Today, Tomorrow, or Day after tomorrow)
- Weather cards show hourly data from 07:00 to 14:00
- Click "Oppdater" (Refresh) to reload data

## Browser Support

Requires a modern browser with support for:
- ES6 Modules
- Fetch API
- LocalStorage
- Geolocation API

## Data Sources

- Weather data: [MET Norway API](https://api.met.no/)
- Maps: [OpenStreetMap](https://www.openstreetmap.org/)
- Geocoding: [Nominatim](https://nominatim.openstreetmap.org/)

## License

This project uses data from MET Norway and OpenStreetMap contributors. Please respect their usage policies.

## Deployment

### GitHub Pages

This project is ready to deploy to GitHub Pages. See [DEPLOY.md](DEPLOY.md) for detailed instructions.

Quick steps:
1. Create a new GitHub repository
2. Push this code to the `main` branch
3. Enable GitHub Pages in repository Settings → Pages
4. Your site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

The `.nojekyll` file ensures GitHub Pages serves ES6 modules correctly.

## Notes

- Data is stored locally in the browser (LocalStorage)
- No server or backend required
- Can be deployed to any static hosting service (GitHub Pages, Netlify, Vercel, etc.)

