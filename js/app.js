// Main application logic

import { loadThresholds, saveThresholds, loadPlaces, savePlaces, DEFAULT_THRESHOLDS } from './storage.js';
import { fetchForecast, reverseGeocode, searchPlaces } from './api.js';
import { debounce, pickHours, getPrecipPerHour, formatLocalTime } from './utils.js';
import { ensureMap, setMarker, setMapClickHandler, flyTo } from './map.js';

// Constants
let HOURS_FROM = 7;
let HOURS_TO = 22;
const TIMEZONE = 'Europe/Oslo';
const MAX_PLACES = 9;

// State
let selectedDayOffset = 0;
let TH = loadThresholds();
let editorMode = 'new'; // 'new' | 'edit'
let currentIndex = null;

// DOM elements
const cardsEl = document.getElementById('cards');
const daySelect = document.getElementById('daySelect');
const refreshBtn = document.getElementById('refreshBtn');
const settingsBtn = document.getElementById('settingsBtn');
const useGeoBtn = document.getElementById('useGeoBtn');
const alertEl = document.getElementById('alert');

// Settings elements
const settingsPanel = document.getElementById('settingsPanel');
const settingsOverlay = document.getElementById('settingsOverlay');
const settingsClose = document.getElementById('settingsClose');
const settingsCancel = document.getElementById('settingsCancel');
const settingsSave = document.getElementById('settingsSave');
const settingsReset = document.getElementById('settingsReset');

const rain_y = document.getElementById('rain_y');
const rain_o = document.getElementById('rain_o');
const rain_r = document.getElementById('rain_r');
const wind_y = document.getElementById('wind_y');
const wind_o = document.getElementById('wind_o');
const wind_r = document.getElementById('wind_r');
const temp_y = document.getElementById('temp_y');
const temp_o = document.getElementById('temp_o');
const temp_r = document.getElementById('temp_r');
const time_start = document.getElementById('time_start');
const time_end = document.getElementById('time_end');

// Editor elements
const editorPanel = document.getElementById('editorPanel');
const editorOverlay = document.getElementById('editorOverlay');
const editorCloseBtn = document.getElementById('editorCloseBtn');
const editorTitle = document.getElementById('editorTitle');
const editorName = document.getElementById('editorName');
const editorSearch = document.getElementById('editorSearch');
const searchResults = document.getElementById('searchResults');
const editorLat = document.getElementById('editorLat');
const editorLon = document.getElementById('editorLon');
const editorCancel = document.getElementById('editorCancel');
const editorSave = document.getElementById('editorSave');

// Badge color functions
function rainBadgeClass(rain) {
  if (rain >= TH.rain.red) return 'bg-red-200 border border-red-400 text-slate-900';
  if (rain >= TH.rain.orange) return 'bg-orange-200 border border-orange-400 text-slate-900';
  if (rain >= TH.rain.yellow) return 'bg-yellow-100 border border-yellow-300 text-slate-900';
  return 'bg-slate-100 border border-slate-200 text-slate-700';
}

function windBadgeClass(wind) {
  if (wind >= TH.wind.red) return 'bg-red-200 border border-red-400 text-slate-900';
  if (wind >= TH.wind.orange) return 'bg-orange-200 border border-orange-400 text-slate-900';
  if (wind >= TH.wind.yellow) return 'bg-yellow-100 border border-yellow-300 text-slate-900';
  return 'bg-slate-100 border border-slate-200 text-slate-700';
}

function tempBadgeClass(temp) {
  if (temp <= TH.temp.red) return 'bg-red-200 border border-red-400 text-slate-900';
  if (temp <= TH.temp.orange) return 'bg-orange-200 border border-orange-400 text-slate-900';
  if (temp <= TH.temp.yellow) return 'bg-yellow-100 border border-yellow-300 text-slate-900';
  return 'bg-slate-100 border border-slate-200 text-slate-700';
}

// Settings management
function fillSettingsFormFromTH() {
  rain_y.value = TH.rain.yellow;
  rain_o.value = TH.rain.orange;
  rain_r.value = TH.rain.red;
  wind_y.value = TH.wind.yellow;
  wind_o.value = TH.wind.orange;
  wind_r.value = TH.wind.red;
  temp_y.value = TH.temp.yellow;
  temp_o.value = TH.temp.orange;
  temp_r.value = TH.temp.red;
  if (time_start) time_start.value = HOURS_FROM;
  if (time_end) time_end.value = HOURS_TO;
}

function openSettings() {
  fillSettingsFormFromTH();
  settingsPanel.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
}

function closeSettings() {
  settingsPanel.classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
}

// Editor management
function openEditorForNew(lat, lon) {
  editorMode = 'new';
  currentIndex = null;
  editorTitle.textContent = 'Legg til sted';
  editorName.value = '';
  editorSearch.value = '';
  searchResults.innerHTML = '';
  searchResults.classList.add('hidden');
  const la = lat != null ? lat : 59.9139;
  const lo = lon != null ? lon : 10.7522;
  editorLat.value = la.toFixed(6);
  editorLon.value = lo.toFixed(6);

  editorPanel.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');

  setTimeout(() => {
    const updateCoords = (lat, lon) => {
      editorLat.value = lat.toFixed(6);
      editorLon.value = lon.toFixed(6);
      reverseGeocode(lat, lon).then(name => {
        if (name && !editorName.value) {
          editorName.value = name;
        }
      });
    };
    
    ensureMap('pickMap', la, lo, 8);
    setMarker(la, lo, updateCoords);
    setMapClickHandler((lat, lon) => {
      setMarker(lat, lon, updateCoords);
      updateCoords(lat, lon);
    });
  }, 0);
}

function openEditorForEdit(index) {
  const places = loadPlaces();
  const place = places[index];
  if (!place) return;
  
  editorMode = 'edit';
  currentIndex = index;
  editorTitle.textContent = 'Rediger sted';
  editorName.value = place.name || '';
  editorSearch.value = '';
  searchResults.innerHTML = '';
  searchResults.classList.add('hidden');
  editorLat.value = place.lat;
  editorLon.value = place.lon;

  editorPanel.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');

  setTimeout(() => {
    const updateCoords = (lat, lon) => {
      editorLat.value = lat.toFixed(6);
      editorLon.value = lon.toFixed(6);
      reverseGeocode(lat, lon).then(name => {
        if (name && !editorName.value) {
          editorName.value = name;
        }
      });
    };
    
    ensureMap('pickMap', place.lat, place.lon, 8);
    setMarker(place.lat, place.lon, updateCoords);
    setMapClickHandler((lat, lon) => {
      setMarker(lat, lon, updateCoords);
      updateCoords(lat, lon);
    });
  }, 0);
}

function closeEditor() {
  editorPanel.classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
  searchResults.classList.add('hidden');
}

// Search functionality
const doSearch = debounce(async function(q) {
  if (!q || q.length < 2) {
    searchResults.innerHTML = '';
    searchResults.classList.add('hidden');
    return;
  }
  
  const results = await searchPlaces(q);
  if (results.length === 0) {
    searchResults.innerHTML = '<li class="p-2 text-slate-600">Ingen resultater funnet.</li>';
    searchResults.classList.remove('hidden');
    return;
  }
  
  searchResults.innerHTML = results.map(r => {
    const safeName = (r.display_name || '').replace(/"/g, '&quot;');
    const main = (r.display_name || '').split(',')[0];
    return `
      <li class="p-2 hover:bg-slate-50 cursor-pointer" data-lat="${r.lat}" data-lon="${r.lon}" data-name="${safeName}">
        <div class="text-sm font-medium">${main}</div>
        <div class="text-xs text-slate-500 truncate">${safeName}</div>
      </li>
    `;
  }).join('');
  searchResults.classList.remove('hidden');
}, 300);

// Main render function
async function render() {
  cardsEl.innerHTML = '';
  const places = loadPlaces();

  for (let i = 0; i < Math.min(places.length, MAX_PLACES); i++) {
    (function(i) {
      const place = places[i];
      const card = document.createElement('article');
      card.className = 'rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm';
      card.innerHTML = `
        <header class="px-4 py-3 flex items-center justify-between bg-slate-800 text-white">
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-semibold" id="placeTitle-${i}">${place.name}</h3>
          </div>
          <button class="editLocation text-xs px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20">Rediger</button>
        </header>
        <div class="p-3">
          <div class="hourStrip flex gap-2 overflow-x-auto"></div>
        </div>
      `;
      cardsEl.appendChild(card);

      card.querySelector('.editLocation').addEventListener('click', function() {
        openEditorForEdit(i);
      });

      const strip = card.querySelector('.hourStrip');
      strip.innerHTML = '<div class="text-slate-600">Laster data...</div>';

      (async function() {
        try {
          const data = await fetchForecast(place.lat, place.lon);
          console.log(`Rendering ${place.name} med timer: ${HOURS_FROM}-${HOURS_TO}`);
          const hours = pickHours(data.properties.timeseries, selectedDayOffset, HOURS_FROM, HOURS_TO, TIMEZONE);
          
          if (!hours.length) {
            strip.innerHTML = '<div class="text-slate-600">Ingen data for valgt dag.</div>';
          } else {
            strip.innerHTML = hours.map(function(h) {
              const det = h.data.instant.details;
              const rain = getPrecipPerHour(h);
              const wind = Number(det.wind_speed);
              const temp = det.air_temperature;

              const localTime = formatLocalTime(h.time, TIMEZONE);

              const rainBadge = `<span class='inline-flex items-center gap-1 rounded px-1.5 py-0.5 ${rainBadgeClass(rain)}'>💧 ${rain.toFixed(1)} mm</span>`;
              const windBadge = `<span class='inline-flex items-center gap-1 rounded px-1.5 py-0.5 ${windBadgeClass(wind)}'>💨 ${wind.toFixed(1)} m/s</span>`;
              const tempBadge = `<span class='inline-flex items-center gap-2 rounded-xl px-4 py-2 text-base font-semibold ${tempBadgeClass(temp)}'>🌡️ ${Math.round(temp)}°</span>`;

              return `
                <div class='flex flex-col items-center justify-center min-w-[110px] px-2 py-2 rounded-xl border bg-slate-100 border-slate-300'>
                  <div class='text-xs text-slate-600'>${localTime}</div>
                  <div class='mt-1 flex flex-col gap-1 text-[11px] items-center'>
                    ${tempBadge}
                    ${rainBadge}
                    ${windBadge}
                  </div>
                </div>
              `;
            }).join('');
          }
        } catch (e) {
          console.error('Error rendering card:', e);
          strip.innerHTML = '<div class="text-rose-700">Feil ved lasting.</div>';
        }
      })();
    })(i);
  }

  // Add box (always last)
  const addBox = document.createElement('div');
  addBox.className = 'flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white cursor-pointer hover:bg-slate-50 aspect-[4/3]';
  addBox.setAttribute('role', 'button');
  addBox.setAttribute('aria-label', 'Legg til sted');
  addBox.title = 'Legg til sted';
  addBox.innerHTML = '<span class="text-5xl text-slate-400">＋</span>';
  addBox.addEventListener('click', function() {
    const placesNow = loadPlaces();
    const last = placesNow[placesNow.length - 1];
    const lat = last ? last.lat : 59.9139;
    const lon = last ? last.lon : 10.7522;
    openEditorForNew(lat, lon);
  });
  cardsEl.appendChild(addBox);
}

// Event listeners
if (settingsBtn) {
  settingsBtn.addEventListener('click', openSettings);
}
if (settingsOverlay) settingsOverlay.addEventListener('click', closeSettings);
if (settingsClose) settingsClose.addEventListener('click', closeSettings);
if (settingsCancel) settingsCancel.addEventListener('click', closeSettings);

if (settingsSave) {
  settingsSave.addEventListener('click', () => {
    const parse = v => {
      const n = parseFloat(v);
      return Number.isNaN(n) ? null : n;
    };

    const newTH = {
      rain: {
        yellow: parse(rain_y.value),
        orange: parse(rain_o.value),
        red: parse(rain_r.value)
      },
      wind: {
        yellow: parse(wind_y.value),
        orange: parse(wind_o.value),
        red: parse(wind_r.value)
      },
      temp: {
        yellow: parse(temp_y.value),
        orange: parse(temp_o.value),
        red: parse(temp_r.value)
      }
    };

    TH = {
      rain: {
        yellow: newTH.rain.yellow ?? DEFAULT_THRESHOLDS.rain.yellow,
        orange: newTH.rain.orange ?? DEFAULT_THRESHOLDS.rain.orange,
        red: newTH.rain.red ?? DEFAULT_THRESHOLDS.rain.red
      },
      wind: {
        yellow: newTH.wind.yellow ?? DEFAULT_THRESHOLDS.wind.yellow,
        orange: newTH.wind.orange ?? DEFAULT_THRESHOLDS.wind.orange,
        red: newTH.wind.red ?? DEFAULT_THRESHOLDS.wind.red
      },
      temp: {
        yellow: newTH.temp.yellow ?? DEFAULT_THRESHOLDS.temp.yellow,
        orange: newTH.temp.orange ?? DEFAULT_THRESHOLDS.temp.orange,
        red: newTH.temp.red ?? DEFAULT_THRESHOLDS.temp.red
      }
    };

    // Update time period
    if (time_start && time_end) {
      const startHour = parseInt(time_start.value);
      const endHour = parseInt(time_end.value);
      console.log('Oppdaterer tidsperiode:', { startHour, endHour, before: { HOURS_FROM, HOURS_TO } });
      if (!isNaN(startHour) && startHour >= 0 && startHour <= 23) {
        HOURS_FROM = startHour;
        localStorage.setItem('hoursFrom', startHour);
      }
      if (!isNaN(endHour) && endHour >= 0 && endHour <= 23) {
        HOURS_TO = endHour;
        localStorage.setItem('hoursTo', endHour);
      }
      console.log('Etter oppdatering:', { HOURS_FROM, HOURS_TO });
    }

    saveThresholds(TH);
    closeSettings();
    updateTimeDisplay();
    render();
  });
}

if (settingsReset) {
  settingsReset.addEventListener('click', () => {
    TH = {
      rain: { ...DEFAULT_THRESHOLDS.rain },
      wind: { ...DEFAULT_THRESHOLDS.wind },
      temp: { ...DEFAULT_THRESHOLDS.temp }
    };
    HOURS_FROM = 7;
    HOURS_TO = 22;
    localStorage.setItem('hoursFrom', HOURS_FROM);
    localStorage.setItem('hoursTo', HOURS_TO);
    saveThresholds(TH);
    fillSettingsFormFromTH();
    updateTimeDisplay();
    render();
  });
}

editorOverlay.addEventListener('click', closeEditor);
editorCloseBtn.addEventListener('click', closeEditor);
editorCancel.addEventListener('click', closeEditor);

editorSave.addEventListener('click', () => {
  const name = (editorName.value || '').trim() || 'Uten navn';
  const lat = parseFloat(editorLat.value);
  const lon = parseFloat(editorLon.value);
  
  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    alert('Ugyldige koordinater.');
    return;
  }
  
  let places = loadPlaces();
  if (editorMode === 'edit' && currentIndex != null) {
    places[currentIndex] = { name, lat, lon };
  } else {
    places.push({ name, lat, lon });
    if (places.length > MAX_PLACES) places = places.slice(0, MAX_PLACES);
  }
  savePlaces(places);
  closeEditor();
  render();
});

editorSearch.addEventListener('input', e => doSearch(e.target.value));

searchResults.addEventListener('click', e => {
  const li = e.target.closest('li[data-lat]');
  if (!li) return;
  
  const lat = parseFloat(li.getAttribute('data-lat'));
  const lon = parseFloat(li.getAttribute('data-lon'));
  const main = li.querySelector('.text-sm')?.textContent || li.getAttribute('data-name');
  
  ensureMap('pickMap', lat, lon, 11);
  setMarker(lat, lon, (lat, lon) => {
    editorLat.value = lat.toFixed(6);
    editorLon.value = lon.toFixed(6);
  });
  flyTo(lat, lon, 11);
  editorName.value = main || editorName.value;
  searchResults.classList.add('hidden');
});

if (useGeoBtn) {
  useGeoBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      openEditorForNew();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        openEditorForNew(pos.coords.latitude, pos.coords.longitude);
      },
      () => openEditorForNew(),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  });
}

daySelect.addEventListener('change', function() {
  selectedDayOffset = parseInt(daySelect.value);
  render();
});

refreshBtn.addEventListener('click', function() {
  render();
});

// Update time display
function updateTimeDisplay() {
  const timeDisplay = document.getElementById('timeDisplay');
  if (timeDisplay) {
    const formatHour = h => h.toString().padStart(2, '0') + ':00';
    timeDisplay.innerHTML = `Viser temperatur (°C), nedbør (mm) og vind (m/s) fra <strong>${formatHour(HOURS_FROM)} til ${formatHour(HOURS_TO)}</strong> (Europa/Oslo).`;
  }
}

// Initialize
if (!localStorage.getItem('alertThresholds')) {
  saveThresholds(TH);
  setTimeout(openSettings, 0);
}

// Load saved time period
const savedHoursFrom = localStorage.getItem('hoursFrom');
const savedHoursTo = localStorage.getItem('hoursTo');
if (savedHoursFrom !== null) HOURS_FROM = parseInt(savedHoursFrom);
if (savedHoursTo !== null) HOURS_TO = parseInt(savedHoursTo);

updateTimeDisplay();
render();

