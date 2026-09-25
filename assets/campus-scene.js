import * as THREE from './vendor/three.module.min.js';

// Photo-projected architectural relief, not a survey-accurate reconstruction.
// Coordinates below are normalized against the supplied, people-free photograph.
// The facade, recessed entry, garden and foreground have independent depths.
const WIDTH = 40;
const HEIGHT = WIDTH * 984 / 1599;
const REFERENCE_DISTANCE = 32;
const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
const mix = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, n) => { const t = clamp((n - a) / (b - a)); return t * t * (3 - 2 * t); };

function inside(x, y, polygon) {
  let result = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i], [xj, yj] = polygon[j];
    if (((yi > y) !== (yj > y)) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) result = !result;
  }
  return result;
}
const facadeOutline = [[.038,.206],[.163,.194],[.202,.225],[.399,.222],[.404,.146],[.456,.146],[.464,.223],[.483,.223],[.483,.190],[.617,.183],[.605,.324],[.672,.322],[.674,.474],[.041,.467]];
function depthAt(u, v) {
  if (v > .478) return mix(.8, 2.2, smooth(.478, 1, v)); // ground coming toward the viewer
  if (inside(u, v, facadeOutline)) {
    if (u > .463 && u < .492 && v > .232) return .2; // open central circulation space
    if (u > .404 && u < .459) return 1.4; // projecting stone tower
    if (u > .492) return 1.0;
    return .8;
  }
  if (v > .34) return -.2; // gardens, trees and low annex
  return -.5; // distant sky
}
function createPhotoRelief(texture) {
  const geometry = new THREE.PlaneGeometry(WIDTH, HEIGHT, 160, 100);
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < position.count; i++) {
    const u = uv.getX(i), v = 1 - uv.getY(i);
    const depth = depthAt(u, v);
    // Project each point along its original camera ray so the starting view
    // exactly preserves the photograph despite the non-flat geometry.
    const project = (REFERENCE_DISTANCE - depth) / REFERENCE_DISTANCE;
    position.setXYZ(i, (u - .5) * WIDTH * project, (.5 - v) * HEIGHT * project, depth);
  }
  geometry.computeVertexNormals();
  const material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});
  return new THREE.Mesh(geometry, material);
}

function createInterior() {
  // An intentionally stylized vestibule; the supplied image shows no interior.
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#e3d9be');
  scene.fog = new THREE.Fog('#e3d9be', 16, 40);
  scene.add(new THREE.HemisphereLight('#fff4d6', '#756252', 3));
  const sunlight = new THREE.DirectionalLight('#fff1cf', 3);
  sunlight.position.set(2, 4, -20);
  scene.add(sunlight);
  const materials = {
    plaster: new THREE.MeshStandardMaterial({color: '#c8bda7', roughness: .93}),
    stone: new THREE.MeshStandardMaterial({color: '#d9d2c2', roughness: .78}),
    trim: new THREE.MeshStandardMaterial({color: '#775e43', roughness: .55}),
    dark: new THREE.MeshStandardMaterial({color: '#30272a', roughness: .5}),
    light: new THREE.MeshBasicMaterial({color: '#fff1c9'}),
    portal: new THREE.MeshBasicMaterial({color: '#f1eee6'})
  };
  const box = (w, h, d, x, y, z, material) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z); scene.add(mesh); return mesh;
  };
  box(8,.2,40,0,-.1,-6,materials.stone);
  box(.3,5.6,40,-4,2.8,-6,materials.plaster);
  box(.3,5.6,40,4,2.8,-6,materials.plaster);
  box(8,.2,40,0,5.6,-6,materials.plaster);
  // Repeating real 3D posts, lintels, ceiling lights and floor joints make
  // the forward camera travel perceptible even on a narrow mobile viewport.
  for (let z = 10; z >= -22; z -= 4) {
    for (const x of [-3.8,3.8]) {
      box(.25,5.5,.3,x,2.75,z,materials.trim);
      box(.045,1.2,.12,x * 1.006,2.7,z+1.4,materials.light);
      box(.035,1.3,2.25,x * 1.012,2.8,z-1.6,materials.dark);
    }
    box(7.6,.2,.3,0,5.4,z,materials.trim);
    box(3.4,.03,.14,0,5.47,z-1.8,materials.light);
    box(8,.008,.022,0,.005,z,materials.trim);
  }
  for (const x of [-2,0,2]) box(.015,.008,40,x,.006,-6,materials.trim);
  box(7.8,5.4,.12,0,2.7,-25,materials.portal);
  box(.12,5.4,.2,-2.7,2.7,-24.8,materials.trim);
  box(.12,5.4,.2,2.7,2.7,-24.8,materials.trim);
  return scene;
}

export async function createCampusScene(container, imageURL) {
  const renderer = new THREE.WebGLRenderer({antialias: true, alpha: false, powerPreference: 'low-power'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.append(renderer.domElement);
  let texture;
  try { texture = await new THREE.TextureLoader().loadAsync(imageURL); }
  catch (error) { renderer.dispose(); renderer.domElement.remove(); throw error; }
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  const exterior = new THREE.Scene();
  exterior.background = new THREE.Color('#748d9a');
  exterior.add(createPhotoRelief(texture));
  const interior = createInterior();
  const camera = new THREE.PerspectiveCamera(42, 1, .08, 130);
  let exteriorFov = 42;

  function resize() {
    const width = container.clientWidth, height = container.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(height, 1);
    // Cover the viewport with the photograph, with a small overscan margin.
    const visibleHeight = Math.min(HEIGHT, WIDTH / camera.aspect) * .96;
    exteriorFov = 2 * Math.atan(visibleHeight / (2 * REFERENCE_DISTANCE)) * 180 / Math.PI;
    camera.updateProjectionMatrix();
  }
  function render(progress) {
    if (progress < .64) {
      const travel = smooth(.02,.68,progress);
      camera.fov = exteriorFov;
      // Approach the recessed entrance, with a small curved lateral dolly.
      camera.position.set(mix(0,-.90,travel) + Math.sin(travel * Math.PI)*.65,
        mix(0,1.85,travel), mix(REFERENCE_DISTANCE,6.5,travel));
      camera.lookAt(mix(0,-.90,travel), mix(0,1.85,travel), 0);
      camera.updateProjectionMatrix();
      renderer.render(exterior,camera);
    } else {
      const travel = smooth(.64,1,progress);
      camera.fov = 58;
      camera.position.set(mix(.14,0,travel),1.8,mix(10,-21,travel));
      camera.lookAt(0,2,-30);
      camera.updateProjectionMatrix();
      renderer.render(interior,camera);
    }
  }
  function dispose() {
    for (const scene of [exterior,interior]) {
      scene.traverse(object => {
        object.geometry?.dispose();
        if (object.material) object.material.dispose();
      });
    }
    texture.dispose(); renderer.dispose(); renderer.domElement.remove();
  }
  resize();
  return {resize, render, dispose, canvas: renderer.domElement};
}
