// Utility functions

export function debounce(fn, wait) {
  let t;
  return function() {
    const args = arguments;
    clearTimeout(t);
    t = setTimeout(() => fn.apply(null, args), wait);
  };
}

export function toLocalHour(iso, timezone) {
  const d = new Date(iso);
  return Number(new Intl.DateTimeFormat('no-NO', {
    hour: '2-digit',
    hour12: false,
    timeZone: timezone
  }).format(d));
}

export function formatLocalTime(iso, timezone) {
  return new Intl.DateTimeFormat('no-NO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: timezone
  }).format(new Date(iso));
}

export function formatLocalDate(iso, timezone) {
  return new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: timezone
  }).format(new Date(iso));
}

export function pickHours(series, dayOffset, hoursFrom, hoursTo, timezone) {
  const base = new Date();
  base.setDate(base.getDate() + dayOffset);
  const y = base.getFullYear();
  const m = String(base.getMonth() + 1).padStart(2, '0');
  const d = String(base.getDate()).padStart(2, '0');
  const targetDate = `${y}-${m}-${d}`;

  return series.filter(entry => {
    const dateLocal = formatLocalDate(entry.time, timezone);
    const h = toLocalHour(entry.time, timezone);
    return dateLocal === targetDate && h >= hoursFrom && h <= hoursTo;
  });
}

export function getPrecipPerHour(entry) {
  try {
    const n1 = entry.data && entry.data['next_1_hours'];
    if (n1 && n1.details && typeof n1.details.precipitation_amount === 'number') {
      return Number(n1.details.precipitation_amount);
    }
    const n6 = entry.data && entry.data['next_6_hours'];
    if (n6 && n6.details && typeof n6.details.precipitation_amount === 'number') {
      return Number(n6.details.precipitation_amount) / 6;
    }
    const n12 = entry.data && entry.data['next_12_hours'];
    if (n12 && n12.details && typeof n12.details.precipitation_amount === 'number') {
      return Number(n12.details.precipitation_amount) / 12;
    }
  } catch (e) {
    console.error('Error getting precipitation:', e);
  }
  return 0;
}

