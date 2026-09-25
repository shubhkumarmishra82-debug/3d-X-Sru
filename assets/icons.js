/* Minimal hand-drawn-blueprint style line icons, returned as inline SVG strings. */
const ICONS = {
  admin: '<svg viewBox="0 0 24 24"><path d="M3 10l9-6 9 6"/><path d="M5 10v9h14v-9"/><path d="M10 19v-6h4v6"/></svg>',
  library: '<svg viewBox="0 0 24 24"><path d="M4 4h4v16H4z"/><path d="M10 4h4v16h-4z"/><path d="M16 5l4 1v14l-4-1z"/></svg>',
  lab: '<svg viewBox="0 0 24 24"><path d="M9 2v6L4 20a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3L15 8V2"/><path d="M9 2h6"/><path d="M7 15h10"/></svg>',
  business: '<svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="12" rx="1"/><path d="M8 8V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3"/></svg>',
  agriculture: '<svg viewBox="0 0 24 24"><path d="M12 22V10"/><path d="M12 10C8 10 5 7 5 3c4 0 7 3 7 7z"/><path d="M12 14c4 0 7-3 7-7-4 0-7 3-7 7z"/></svg>',
  health: '<svg viewBox="0 0 24 24"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/><path d="M12 9v6M9 12h6"/></svg>',
  incubator: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
  hostel: '<svg viewBox="0 0 24 24"><rect x="4" y="9" width="16" height="12"/><path d="M2 9l10-6 10 6"/><path d="M9 21v-6h6v6"/></svg>',
  sports: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
  cafeteria: '<svg viewBox="0 0 24 24"><path d="M4 3v8a4 4 0 0 0 8 0V3M6 3v5M8 3v5M10 3v5"/><path d="M17 3v18M17 3a4 4 0 0 1 4 4v3h-4"/></svg>',
  auditorium: '<svg viewBox="0 0 24 24"><path d="M4 20l8-16 8 16"/><path d="M8 20l4-8 4 8"/></svg>',
  chat: '<svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.2-4.8A8 8 0 1 1 21 12z"/></svg>',
  cube: '<svg viewBox="0 0 24 24"><path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/></svg>',
  map: '<svg viewBox="0 0 24 24"><path d="M9 3L3 6v15l6-3 6 3 6-3V3l-6 3-6-3z"/><path d="M9 3v15M15 6v15"/></svg>',
  phone: '<svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2C9.5 21 3 14.5 3 6a2 2 0 0 1 2-2z"/></svg>',
  wifi: '<svg viewBox="0 0 24 24"><path d="M2 8.5a16 16 0 0 1 20 0M5.5 12a11 11 0 0 1 13 0M9 15.5a6 6 0 0 1 6 0"/><circle cx="12" cy="19" r="1"/></svg>'
};
function icon(name){ return ICONS[name] || ICONS.cube; }
