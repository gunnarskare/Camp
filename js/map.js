// Map management using Leaflet

let map = null;
let marker = null;

export function ensureMap(containerId, lat, lon, zoom) {
  const z = typeof zoom === 'number' ? zoom : 8;
  const container = document.getElementById(containerId);
  
  // Prevent "already initialized" error
  if (container && container._leaflet_id && !map) {
    const fresh = container.cloneNode(false);
    fresh.id = containerId;
    container.parentNode.replaceChild(fresh, container);
  }
  
  if (!map) {
    map = L.map(containerId).setView([lat, lon], z);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);
  } else {
    map.setView([lat, lon], z);
  }
  
  setTimeout(() => { map.invalidateSize(); }, 0);
  return map;
}

export function setMarker(lat, lon, onDrag) {
  if (!map) return;
  
  if (!marker) {
    marker = L.marker([lat, lon], { draggable: true }).addTo(map);
    if (onDrag) {
      marker.on('dragend', function() {
        const pos = marker.getLatLng();
        onDrag(pos.lat, pos.lng);
      });
    }
  } else {
    marker.setLatLng([lat, lon]);
  }
  
  return marker;
}

export function getMap() {
  return map;
}

export function getMarker() {
  return marker;
}

export function setMapClickHandler(handler) {
  if (map) {
    map.off('click');
    map.on('click', function(e) {
      handler(e.latlng.lat, e.latlng.lng);
    });
  }
}

export function flyTo(lat, lon, zoom) {
  if (map && map.flyTo) {
    map.flyTo([lat, lon], zoom || 11);
  }
}

