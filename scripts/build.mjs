import { cpSync, mkdirSync, rmSync, existsSync } from 'node:fs';
const pages = ['index.html', 'tour.html', 'locator.html', 'chatbot.html'];
for (const path of [...pages, 'assets/style.css', 'assets/data.js', 'assets/entrance.js', 'assets/campus-scene.js', 'assets/images/campus-clean.webp', 'assets/vendor/three.module.min.js', 'assets/vendor/three.core.min.js', 'assets/video/campus-tour.mp4']) {
  if (!existsSync(path)) throw new Error(`Missing required website file: ${path}`);
}
rmSync('dist', { recursive: true, force: true });
mkdirSync('dist');
for (const page of pages) cpSync(page, `dist/${page}`);
cpSync('assets', 'dist/assets', { recursive: true });
console.log('Built complete static website in dist/ (4 pages and all assets).');
