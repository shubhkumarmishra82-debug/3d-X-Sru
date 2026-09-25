# SRU × SARATHI — complete Vercel project

This contains the full original website plus the 3D entrance update.
See DEPLOY-VERCEL.txt. No API keys or environment variables are needed.

Build: `npm run build`. Vercel configuration is included.

## Scroll-driven campus entrance

The homepage now starts with a people-free version of the supplied campus photo.
Scrolling moves a Three.js camera toward the recessed central entrance, transitions
through a stylized 3D vestibule, and reveals the existing campus companion content.
Reverse scrolling reverses the sequence. Map, tour and chatbot pages are unchanged.

### Run locally

Serve the repository over HTTP (ES modules do not run from `file://`):

```sh
npm install
npm start
```

Or use `python -m http.server 3000`, then open `http://localhost:3000`.
Vercel runs the dependency-free build script to copy all pages and assets into dist/.

### Implementation and tuning

- `assets/entrance.js`: scroll progress, scene lifecycle, skip/focus behavior,
  reduced-motion/data-saving preference and WebGL failure fallback.
- `assets/campus-scene.js`: photo-projected depth geometry, camera route, and
  procedural 3D interior. `depthAt()` and `facadeOutline` describe the approximate
  exterior relief; `render()` controls the camera and transition point.
- `assets/entrance.css`: responsive pinned introduction, text and page reveal.
  `.campus-entrance.is-enhanced` controls the scroll distance.
- `assets/images/campus-clean.webp`: optimized people-free photographic asset.
- `assets/vendor/`: locally hosted Three.js 0.180.0 modules with MIT license.
  The animation makes no CDN or API requests.

The exterior is **single-view, photo-projected 3D relief (2.5D)**, not a complete
survey-accurate building model. Hidden facades cannot be recovered from one image.
The interior is an artistic transition, not a representation of SRU's actual
interior. More photographs or a supplied GLB would allow an accurate volumetric
replacement. People removal used the built-in image editor with this brief:
"Remove all people; reconstruct the paving and landscaping; preserve the building,
composition, sky, trees, parked vehicles, and original camera perspective."

### Accessibility and performance

Normal scrolling is retained; no wheel/touch events are captured. Skip intro and
Explore campus move focus to the main content. The decorative canvas is hidden
from assistive technology. Reduced-motion, data-saving, JavaScript-disabled and
WebGL-unavailable visitors get the still photo and ordinary document flow.
Rendering runs only while the intro is near the viewport and progress changes;
pixel ratio is capped at 1.5. The photo is about 336 KiB, and the two local Three.js
modules total about 703 KiB before HTTP compression.

Validated in headless Chromium at desktop (1440×1000) and mobile (390×844): forward
scroll stages and return to start, skip focus/position, mobile overflow and menu,
live reduced-motion changes, WebGL context loss, no-JavaScript fallback, and
availability of the three existing destination pages. No JavaScript exceptions.
The pre-existing Google Fonts import could not load in the test environment;
local fallback fonts were used for visual checks.
