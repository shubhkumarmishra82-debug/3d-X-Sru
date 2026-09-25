/* =========================================================================
   LIVE NAVIGATE
   Type any place on campus (by name or alias, e.g. "mess") and get:
     - live distance + compass direction from the visitor's real GPS position
     - a rotating compass needle (uses the phone's compass when available)
     - a one-tap "Open in Google Maps" walking-directions link
   Coordinates in SRU_DATA.buildings[].coords are illustrative estimates
   derived from the campus layout, not a surveyed site plan — good
   enough for "which way / how far", while Google Maps handles the exact
   real-world walking route.
   ========================================================================= */

(function () {
  const input = document.getElementById('navInput');
  const datalist = document.getElementById('navPlaces');
  const btnGo = document.getElementById('btnNavGo');
  const btnLocate = document.getElementById('btnLocate');
  const resultEl = document.getElementById('navResult');
  if (!input || !SRU_DATA || !SRU_DATA.buildings) return;

  const buildings = SRU_DATA.buildings.filter(b => b.coords);

  // ---------- search index (name + aliases) ----------
  datalist.innerHTML = buildings
    .map(b => `<option value="${b.name}">`)
    .concat(buildings.flatMap(b => (b.aliases || []).map(a => `<option value="${cap(a)}">`)))
    .join('');

  function cap(s) { return s.replace(/\b\w/g, c => c.toUpperCase()); }
  function norm(s) { return (s || '').toLowerCase().trim().replace(/\s+/g, ' '); }

  function matchBuilding(query) {
    const q = norm(query);
    if (!q) return null;
    // 1) exact match on name, id, or an alias
    let hit = buildings.find(b =>
      norm(b.name) === q || norm(b.id) === q || (b.aliases || []).some(a => norm(a) === q)
    );
    if (hit) return hit;
    // 2) substring match either direction, aliases first (more specific)
    hit = buildings.find(b => (b.aliases || []).some(a => norm(a).includes(q) || q.includes(norm(a))));
    if (hit) return hit;
    hit = buildings.find(b => norm(b.name).includes(q) || q.includes(norm(b.name)));
    return hit || null;
  }

  // ---------- geo helpers ----------
  const toRad = d => d * Math.PI / 180;
  const toDeg = r => r * 180 / Math.PI;

  function distanceMeters(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  function bearingDeg(lat1, lng1, lat2, lng2) {
    const y = Math.sin(toRad(lng2 - lng1)) * Math.cos(toRad(lat2));
    const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) - Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lng2 - lng1));
    return (toDeg(Math.atan2(y, x)) + 360) % 360;
  }
  const CARDINALS = ["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West"];
  const cardinal = deg => CARDINALS[Math.round(deg / 45) % 8];

  function fmtDistance(m) {
    if (m < 1000) return `${Math.round(m)} m`;
    return `${(m / 1000).toFixed(m < 10000 ? 2 : 1)} km`;
  }

  // ---------- live position + compass state ----------
  let userPos = null;       // { lat, lng, accuracy }
  let watchId = null;
  let deviceHeading = null; // degrees, 0 = phone facing true north
  let target = null;        // currently selected building

  const GATE = buildings.find(b => b.id === 'gate') || buildings[0];

  function setStatus(msg, isErr) {
    resultEl.innerHTML = `<p class="nav-status${isErr ? ' err' : ''}">${msg}</p>`;
  }

  function locate() {
    if (!('geolocation' in navigator)) {
      setStatus('Your browser doesn\u2019t support live location — showing directions from the Main Gate instead.', true);
      return;
    }
    btnLocate.disabled = true;
    btnLocate.textContent = '📍 Locating…';
    navigator.geolocation.getCurrentPosition(onPosition, onPositionError, { enableHighAccuracy: true, timeout: 10000 });

    if (watchId === null) {
      watchId = navigator.geolocation.watchPosition(onPosition, () => {}, { enableHighAccuracy: true, maximumAge: 4000 });
    }
    // Ask for compass access (iOS needs this inside a user gesture; harmless elsewhere).
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission().then(state => {
        if (state === 'granted') window.addEventListener('deviceorientation', onOrientation);
      }).catch(() => {});
    } else if (typeof DeviceOrientationEvent !== 'undefined') {
      window.addEventListener('deviceorientationabsolute', onOrientation, true);
      window.addEventListener('deviceorientation', onOrientation, true);
    }
  }

  function onPosition(pos) {
    userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy };
    btnLocate.disabled = false;
    btnLocate.textContent = '📍 Update location';
    if (target) render();
    else setStatus('Got your location — now search a place above to get live directions.');
  }
  function onPositionError() {
    btnLocate.disabled = false;
    btnLocate.textContent = '📍 Use my location';
    setStatus('Couldn\u2019t get your location (permission denied or unavailable) — showing directions from the Main Gate instead.', true);
    if (target) render();
  }
  function onOrientation(e) {
    let heading = null;
    if (typeof e.webkitCompassHeading === 'number') heading = e.webkitCompassHeading; // iOS: already true-north
    else if (typeof e.alpha === 'number') heading = 360 - e.alpha; // rough approximation elsewhere
    if (heading !== null && !isNaN(heading)) {
      deviceHeading = heading;
      if (target) render();
    }
  }

  // ---------- rendering ----------
  function compassSVG(rotateDeg) {
    return `
      <div class="compass">
        <svg viewBox="0 0 88 88">
          <circle cx="44" cy="44" r="41" fill="var(--white)" stroke="var(--line)" stroke-width="2"/>
          <circle cx="44" cy="44" r="41" fill="none" stroke="var(--maroon)" stroke-width="1" opacity="0.25"/>
          <text x="44" y="12" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8" fill="var(--maroon)">N</text>
          <text x="44" y="82" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7" fill="var(--ink-soft)">S</text>
          <text x="8" y="47" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7" fill="var(--ink-soft)">W</text>
          <text x="80" y="47" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7" fill="var(--ink-soft)">E</text>
          <g class="compass-needle" id="compassNeedle" style="transform: rotate(${rotateDeg}deg);">
            <path d="M44 14 L50 46 L44 40 L38 46 Z" fill="var(--maroon)"/>
            <circle cx="44" cy="44" r="4" fill="var(--maroon-dark)"/>
          </g>
        </svg>
      </div>`;
  }

  function render() {
    if (!target) return;
    const from = userPos || { lat: GATE.coords.lat, lng: GATE.coords.lng };
    const usingFallback = !userPos;

    const dist = distanceMeters(from.lat, from.lng, target.coords.lat, target.coords.lng);
    const brg = bearingDeg(from.lat, from.lng, target.coords.lat, target.coords.lng);
    // If we have a live compass heading, point the needle at the target relative
    // to where the phone is actually facing. Otherwise default to north-up.
    const needleRotate = deviceHeading !== null ? (brg - deviceHeading + 360) % 360 : brg;

    const mapsUrl = userPos
      ? `https://www.google.com/maps/dir/?api=1&origin=${from.lat},${from.lng}&destination=${target.coords.lat},${target.coords.lng}&travelmode=walking`
      : `https://www.google.com/maps/search/?api=1&query=${target.coords.lat},${target.coords.lng}`;

    resultEl.innerHTML = `
      <div class="nav-result-card">
        ${compassSVG(needleRotate)}
        <div class="nav-result-body">
          <h4>${target.name}</h4>
          <div class="nav-result-meta">
            <span>${fmtDistance(dist)} away</span>
            <span>Head ${cardinal(brg)}</span>
            ${deviceHeading !== null ? '<span>Live compass</span>' : ''}
          </div>
          <div class="nav-result-actions">
            <a class="btn btn-primary" href="${mapsUrl}" target="_blank" rel="noopener">Open live walking directions ↗</a>
            <button class="btn btn-ghost" id="btnViewOnMap" type="button">Show on map</button>
          </div>
          ${usingFallback
            ? '<p class="nav-note">Distance &amp; direction shown from the Main Gate — tap "Use my location" for directions from exactly where you are.</p>'
            : `<p class="nav-note">Live from your current position${userPos.accuracy ? ` (±${Math.round(userPos.accuracy)}m accuracy)` : ''} · updates as you move.</p>`}
        </div>
      </div>`;

    const viewBtn = document.getElementById('btnViewOnMap');
    if (viewBtn) {
      viewBtn.addEventListener('click', () => {
        if (window.SRU_focusOnMap) window.SRU_focusOnMap(target.id);
        document.getElementById('campus-map-wrap').scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }

  // ---------- wire up ----------
  function go() {
    const hit = matchBuilding(input.value);
    if (!hit) {
      setStatus(`Couldn\u2019t find "${input.value}" on campus — try a building name like "library", "mess" or "boys hostel".`, true);
      target = null;
      return;
    }
    target = hit;
    if (!userPos) {
      setStatus(`Found ${hit.name} — getting your live location…`);
      locate();
    } else {
      render();
    }
  }

  btnGo.addEventListener('click', go);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  btnLocate.addEventListener('click', locate);
})();
