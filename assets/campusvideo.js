/* =========================================================================
   CAMPUS TOUR VIDEO
   Opens the campus tour video in an on-page modal. The mp4 is served
   directly from this project (assets/video/campus-tour.mp4) — no third
   party file host (catbox etc.) needed, since Vercel serves it like any
   other static file.
   ========================================================================= */

(function () {
  const btn = document.getElementById('btnCampusVideo');
  const modal = document.getElementById('videoModal');
  const backdrop = document.getElementById('videoModalBackdrop');
  const closeBtn = document.getElementById('videoModalClose');
  const video = document.getElementById('campusVideo');
  if (!btn || !modal || !video) return;

  const VIDEO_SRC = 'assets/video/campus-tour.mp4';

  function open() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (!video.src) video.src = VIDEO_SRC;
    video.play().catch(() => {}); // ignored — some browsers block autoplay until a user gesture, which this already is
  }
  function close() {
    modal.hidden = true;
    document.body.style.overflow = '';
    video.pause();
  }

  btn.addEventListener('click', open);
  backdrop.addEventListener('click', close);
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) close(); });

  video.addEventListener('error', () => {
    if (!video.querySelector('.video-fallback-msg')) {
      const box = modal.querySelector('.video-modal-box');
      const msg = document.createElement('p');
      msg.className = 'video-fallback-msg';
      msg.style.cssText = 'color:#fff; font-family:var(--font-body); padding:28px; margin:0; text-align:center;';
      msg.textContent = "Couldn't load the campus tour video — make sure campus-tour.mp4 is uploaded to assets/video/ in this project.";
      box.appendChild(msg);
    }
  });
})();
