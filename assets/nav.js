/* Shared header + footer, built from SRU_DATA so contact info stays in sync. */
(function(){
  const u = SRU_DATA.university;
  const page = document.body.getAttribute('data-page') || '';

  const links = [
    { href: 'index.html', label: 'Home', key: 'home' },
    { href: 'tour.html', label: 'Campus Tour', key: 'tour' },
    { href: 'locator.html', label: 'Campus Map', key: 'locator' },
    { href: 'chatbot.html', label: 'Ask SRU Bot', key: 'chatbot' }
  ];

  const headerHTML = `
    <div class="wrap nav">
      <a class="brand" href="index.html">
        <span class="brand-mark">SR</span>
        <span class="brand-text"><b>${u.name}</b><span>CAMPUS COMPANION</span></span>
      </a>
      <ul class="nav-links" id="navLinks">
        ${links.map(l => `<li><a href="${l.href}" class="${page===l.key?'active':''}">${l.label}</a></li>`).join('')}
      </ul>
      <button class="nav-toggle" id="navToggle" aria-label="Toggle menu"><span></span></button>
    </div>`;

  const footerHTML = `
    <div class="wrap footer-grid">
      <div>
        <h4>SR University</h4>
        <p>${u.address}</p>
        <p class="coord-tag mono">${u.coords}</p>
      </div>
      <div>
        <h4>Quick links</h4>
        <ul>
          ${links.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}
          <li><a href="${u.website}" target="_blank" rel="noopener">Official website ↗</a></li>
        </ul>
      </div>
      <div>
        <h4>Contact</h4>
        <ul>
          ${u.phones.map(p => `<li><a href="tel:${p.split(' ').join('')}">${p}</a></li>`).join('')}
          <li><a href="mailto:${u.email}">${u.email}</a></li>
          <li>Admission helpline: ${u.admissionHelpline.join(' · ')}</li>
        </ul>
      </div>
    </div>
    <div class="wrap footer-bottom">
      <span>Unofficial student-built campus companion — not the official SR University website.</span>
      <span>Built without any external AI API — pure rule-based JavaScript.</span>
    </div>`;

  document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('site-header');
    const footer = document.getElementById('site-footer');
    if (header){ header.innerHTML = headerHTML; }
    if (footer){ footer.innerHTML = footerHTML; }
    const toggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (toggle && navLinks){
      toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    }
  });
})();
