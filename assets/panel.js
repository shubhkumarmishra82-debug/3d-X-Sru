/* =========================================================================
   BUILDING INFO PANEL + LIST
   Shared by the Real Campus Map and Live Navigate: pick a building (from
   the map pins, the list, or search) and this renders the same info card
   and highlights the matching row.
   ========================================================================= */

(function(){
  const panel = document.getElementById('locatorPanel');
  const listEl = document.getElementById('locatorList');
  if (!panel || !listEl || !SRU_DATA) return;

  let selectedId = null;

  function selectBuilding(id){
    const data = SRU_DATA.buildings.find(b => b.id === id);
    if (!data) return;
    selectedId = id;
    renderPanel(data);
    highlightList(id);
    if (window.SRU_setMapPlace) window.SRU_setMapPlace(id);
  }
  // exposed so the map, the building list, and Live Navigate all share it
  window.SRU_selectBuilding = selectBuilding;

  function renderPanel(b){
    panel.innerHTML = `
      <div class="badge">${icon(b.icon)}</div>
      <span class="tour-zone">${b.zone}</span>
      <h3 style="margin-top:8px;">${b.name}</h3>
      <p>${b.blurb}</p>
      <div class="chip-row">${b.facilities.map(f => `<span class="chip">${f}</span>`).join('')}</div>`;
  }

  function buildList(){
    const sorted = [...SRU_DATA.buildings].sort((a, b) => a.name.localeCompare(b.name));
    listEl.innerHTML = sorted.map(b => `<li data-id="${b.id}">${b.name} <span>${b.zone}</span></li>`).join('');
    listEl.addEventListener('click', (e) => {
      const li = e.target.closest('li');
      if (li) selectBuilding(li.dataset.id);
    });
  }
  function highlightList(id){
    listEl.querySelectorAll('li').forEach(li => {
      li.style.color = li.dataset.id === id ? 'var(--maroon)' : '';
      li.style.fontWeight = li.dataset.id === id ? '700' : '400';
    });
  }
  buildList();
})();
