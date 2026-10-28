import React, { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Clock,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";

// GPU starfield: stars fly toward the camera entirely in the vertex shader
// (no per-frame CPU loop over points), glow as soft round sprites, twinkle,
// lean toward the mouse, and burst into warp speed while the page scrolls.

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uTravel;
  uniform float uDepth;
  uniform float uPixelRatio;
  uniform float uWarp;

  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    // Loop each star from the far plane to just past the camera
    pos.z = mod(pos.z + uTravel, uDepth) - uDepth;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float dist = -mvPosition.z;
    float fadeIn = smoothstep(uDepth, uDepth * 0.6, dist);
    float fadeOut = smoothstep(0.0, 8.0, dist);
    float twinkle = 0.65 + 0.35 * sin(uTime * (1.5 + aPhase) + aPhase * 6.2831);

    vAlpha = fadeIn * fadeOut * twinkle;
    vColor = aColor;

    // Perspective size, swelling slightly at warp speed
    gl_PointSize = min(
      aSize * uPixelRatio * (1.0 + uWarp * 1.5) * (260.0 / dist),
      18.0 * uPixelRatio
    );
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    // Bright core with a soft halo
    float core = smoothstep(0.5, 0.0, d);
    float glow = pow(core, 3.0) + core * 0.25;
    gl_FragColor = vec4(vColor, glow * vAlpha);
  }
`;

// Mostly white, with a few cool and warm stars echoing the cursor gradient
const palette = [
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [0.65, 0.9, 1], // cyan
  [0.75, 0.65, 1], // violet
  [1, 0.7, 0.85], // pink
];

const Starfield = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;

    const renderer = new WebGLRenderer({
      alpha: true,
      antialias: false, // round point sprites don't need MSAA
      powerPreference: "high-performance",
    });
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(
      70,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );

    const depth = 600;
    const count = isSmallScreen ? 1600 : 3600;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Keep a clear tunnel down the middle so stars stream past, not into, the text
      const angle = Math.random() * Math.PI * 2;
      const radius = 12 + Math.pow(Math.random(), 0.7) * 220;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = Math.random() * depth;

      sizes[i] = 0.6 + Math.pow(Math.random(), 3) * 3.2;
      phases[i] = Math.random();

      const [r, g, b] = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setAttribute("aSize", new BufferAttribute(sizes, 1));
    geometry.setAttribute("aPhase", new BufferAttribute(phases, 1));
    geometry.setAttribute("aColor", new BufferAttribute(colors, 3));

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uTravel: { value: 0 },
        uDepth: { value: depth },
        uPixelRatio: { value: pixelRatio },
        uWarp: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });

    const stars = new Points(geometry, material);
    stars.frustumCulled = false; // positions are rewritten in the shader
    scene.add(stars);

    let mouseX = 0;
    let mouseY = 0;
    let lastScrollY = window.scrollY;
    let warp = 0;
    let raf = null;
    let visible = true;
    const clock = new Clock();

    const handleMouseMove = (e) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
    };

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      if (raf === null) renderer.render(scene, camera);
    };

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.05);
      const { uniforms } = material;

      // Scroll speed drives warp; ease in fast, settle slowly
      const scrollSpeed = Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
      const targetWarp = Math.min(scrollSpeed / 40, 1);
      warp += (targetWarp - warp) * (targetWarp > warp ? 0.2 : 0.04);

      uniforms.uTime.value += delta;
      uniforms.uTravel.value += delta * (14 + warp * 260);
      uniforms.uWarp.value = warp;

      stars.rotation.y += (mouseX * 0.25 - stars.rotation.y) * 0.04;
      stars.rotation.x += (mouseY * 0.15 - stars.rotation.x) * 0.04;
      stars.rotation.z += delta * 0.01;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf === null && visible && !reduceMotion) {
        clock.getDelta(); // don't jump after a pause
        lastScrollY = window.scrollY;
        raf = requestAnimationFrame(tick);
      }
    };

    const stop = () => {
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
    };

    // Stop rendering once the hero has scrolled out of view
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });

    renderer.render(scene, camera); // static frame for reduced motion
    start();
    observer.observe(mount);
    window.addEventListener("resize", handleResize);
    if (!reduceMotion) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      mount.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="absolute inset-0 z-[2] pointer-events-none"
    />
  );
};

export default Starfield;
