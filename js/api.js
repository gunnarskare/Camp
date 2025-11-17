// API calls for weather and geocoding

export async function fetchForecast(lat, lon) {
  const res = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`);
  if (!res.ok) throw new Error('Feil fra MET');
  return res.json();
}

export async function reverseGeocode(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=10&accept-language=no`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    const data = await res.json();
    if (data && data.display_name) {
      return data.display_name.split(',')[0];
    }
  } catch (e) {
    console.error('Reverse geocoding error:', e);
  }
  return null;
}

export async function searchPlaces(query) {
  if (!query || query.length < 2) return [];
  const url = 'https://nominatim.openstreetmap.org/search?format=jsonv2&q=' + encodeURIComponent(query) + '&limit=7&accept-language=no';
  try {
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    const results = await res.json();
    return Array.isArray(results) ? results : [];
  } catch (e) {
    console.error('Place search error:', e);
    return [];
  }
}

