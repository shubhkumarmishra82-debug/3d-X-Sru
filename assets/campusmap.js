/* =========================================================================
   REAL CAMPUS MAP (Leaflet + OpenStreetMap tiles, with a self-contained fallback)
   Every building from SRU_DATA plotted at its approximate real-world
   coordinates on an actual live map, plus a "you are here" marker when
   location is available. Coordinates are illustrative estimates derived
   from the campus layout, not a surveyed plan — good for orientation;
   each pin's popup links out to Google Maps for the exact walking route.

   Live tiles need a network path to an external tile CDN. Some networks
   (college WiFi, campus firewalls, certain ISPs) block those domains
   outright — no tile provider fixes that, since the block is on the
   visitor's network, not the server. So if live tiles can't load within
   a few seconds, this automatically swaps to a bundled SVG illustration
   of the same campus layout — built entirely from data already in this
   file, no external request involved — so the page is never stuck on a
   spinner. A "Try live map" button lets the visitor retry any time.
   ========================================================================= */

(function () {
  const mapEl = document.getElementById('campusMap');
  const fallbackWrap = document.getElementById('campusMapFallback');
  const fallbackSvg = document.getElementById('fallbackSvg');
  const btnMapLocate = document.getElementById('btnMapLocate');
  const btnRetry = document.getElementById('btnMapRetry');
  if (!mapEl || typeof L === 'undefined' || !SRU_DATA || !SRU_DATA.buildings) return;

  const buildings = SRU_DATA.buildings.filter(b => b.coords);
  const cafeteria = buildings.find(b => b.id === 'cafeteria');
  const center = [cafeteria ? cafeteria.coords.lat : 17.9797, cafeteria ? cafeteria.coords.lng : 79.5800];

  const map = L.map(mapEl, { zoomControl: true, attributionControl: true }).setView(center, 17);

  let tileLayer = null;
  let loadTimer = null;
  let firstTileArrived = false;

  function showFallback() {
    mapEl.style.visibility = 'hidden';
    if (fallbackWrap) fallbackWrap.hidden = false;
  }
  function hideFallback() {
    mapEl.style.visibility = 'visible';
    if (fallbackWrap) fallbackWrap.hidden = true;
  }

  function addTiles() {
    hideFallback();
    firstTileArrived = false;
    if (tileLayer) { map.removeLayer(tileLayer); tileLayer = null; }

    tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
    }).addTo(map);

    tileLayer.on('load', () => { firstTileArrived = true; hideFallback(); clearTimeout(loadTimer); });
    tileLayer.on('tileerror', () => { if (!firstTileArrived) showFallback(); });

    clearTimeout(loadTimer);
    loadTimer = setTimeout(() => { if (!firstTileArrived) showFallback(); }, 6000);
  }
  addTiles();
  if (btnRetry) btnRetry.addEventListener('click', addTiles);

  // ---------- self-contained SVG fallback (needs no network at all) ----------
  function buildFallback() {
    if (!fallbackSvg) return;
    const W = 640, H = 460, PAD = 60;
    const xs = buildings.map(b => b.grid.x), zs = buildings.map(b => b.grid.z);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minZ = Math.min(...zs), maxZ = Math.max(...zs);
    const sx = x => PAD + ((x - minX) / (maxX - minX || 1)) * (W - PAD * 2);
    const sy = z => PAD + ((z - minZ) / (maxZ - minZ || 1)) * (H - PAD * 2);

    const bg = `<rect x="0" y="0" width="${W}" height="${H}" fill="#E7E2D4"/>` +
      `<rect x="${PAD - 20}" y="${PAD - 20}" width="${W - (PAD - 20) * 2}" height="${H - (PAD - 20) * 2}" rx="10" fill="#DDE7DB" stroke="#C9C2AE"/>`;

    const pins = buildings.map(b => {
      const x = sx(b.grid.x), y = sy(b.grid.z);
      const initials = b.name.split(/\s+/).filter(w => /^[A-Z]/.test(w)).slice(0, 2).map(w => w[0]).join('') || b.name[0];
      return `
        <g class="fallback-pin" data-id="${b.id}">
          <title>${b.name} — ${b.zone}</title>
          <circle cx="${x}" cy="${y}" r="9" fill="${b.color}"/>
          <text x="${x}" y="${y - 14}">${initials}</text>
        </g>`;
    }).join('');

    fallbackSvg.innerHTML = bg + pins;
    fallbackSvg.querySelectorAll('.fallback-pin').forEach(g => {
      g.addEventListener('click', () => { if (window.SRU_selectBuilding) window.SRU_selectBuilding(g.dataset.id); });
    });
  }
  buildFallback();

  function pinIcon(color) {
    return L.divIcon({
      className: '',
      html: `<div class="map-pin" style="background:${color};"><span>●</span></div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 26],
      popupAnchor: [0, -24]
    });
  }

  const markers = {};
  const bounds = [];
  buildings.forEach(b => {
    const marker = L.marker([b.coords.lat, b.coords.lng], { icon: pinIcon(b.color) }).addTo(map);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${b.coords.lat},${b.coords.lng}&travelmode=walking`;
    marker.bindPopup(`
      <div class="map-popup">
        <span class="tour-zone">${b.zone}</span>
        <h4>${b.name}</h4>
        <p style="margin:0 0 8px;">${b.blurb}</p>
        <a href="${mapsUrl}" target="_blank" rel="noopener">Get walking directions ↗</a>
      </div>`);
    marker.on('click', () => { if (window.SRU_selectBuilding) window.SRU_selectBuilding(b.id); });
    markers[b.id] = marker;
    bounds.push([b.coords.lat, b.coords.lng]);
  });
  if (bounds.length) map.fitBounds(bounds, { padding: [30, 30] });

  // ---------- "you are here" ----------
  let youMarker = null, watchId = null;
  function showMe(recenter) {
    if (!('geolocation' in navigator)) return;
    if (btnMapLocate) btnMapLocate.disabled = true;
    navigator.geolocation.getCurrentPosition(pos => {
      if (btnMapLocate) btnMapLocate.disabled = false;
      placeYou(pos, recenter);
      if (watchId === null) {
        watchId = navigator.geolocation.watchPosition(p => placeYou(p, false), () => {}, { enableHighAccuracy: true, maximumAge: 5000 });
      }
    }, () => { if (btnMapLocate) btnMapLocate.disabled = false; }, { enableHighAccuracy: true, timeout: 10000 });
  }
  function placeYou(pos, recenter) {
    const ll = [pos.coords.latitude, pos.coords.longitude];
    if (!youMarker) {
      youMarker = L.marker(ll, { icon: L.divIcon({ className: '', html: '<div class="map-pin-you"></div>', iconSize: [16, 16], iconAnchor: [8, 8] }) })
        .addTo(map).bindPopup('You are here');
    } else {
      youMarker.setLatLng(ll);
    }
    if (recenter) map.setView(ll, 18);
  }
  if (btnMapLocate) btnMapLocate.addEventListener('click', () => showMe(true));

  // expose so the building list / Live Navigate can drop a pin + open its popup
  window.SRU_setMapPlace = function (id) {
    const m = markers[id];
    if (!m) return;
    if (!fallbackWrap.hidden) return; // fallback is showing — nothing to pan on the live map
    map.setView(m.getLatLng(), 18);
    m.openPopup();
  };
  window.SRU_focusOnMap = window.SRU_setMapPlace;
})();
