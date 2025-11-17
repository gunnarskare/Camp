// Storage utilities for managing localStorage

const DEFAULT_THRESHOLDS = {
  rain: { yellow: 1.4, orange: 2.9, red: 4.0 },          // mm/h
  wind: { yellow: 8.0, orange: 12.0, red: 17.0 },        // m/s
  temp: { yellow: 0.0, orange: -5.0, red: -10.0 }        // °C (≤ terskel)
};

export function loadThresholds() {
  try {
    const stored = JSON.parse(localStorage.getItem('alertThresholds'));
    if (stored && stored.rain && stored.wind && stored.temp) return stored;
    return { ...DEFAULT_THRESHOLDS };
  } catch {
    return { ...DEFAULT_THRESHOLDS };
  }
}

export function saveThresholds(th) {
  localStorage.setItem('alertThresholds', JSON.stringify(th));
}

export function loadPlaces() {
  try {
    return JSON.parse(localStorage.getItem('places') || '[]');
  } catch {
    return [];
  }
}

export function savePlaces(places) {
  localStorage.setItem('places', JSON.stringify(places));
}

export { DEFAULT_THRESHOLDS };

