import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const Starfield = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    // Fog for depth fading
    scene.fog = new THREE.FogExp2(0x000000, 0.002);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 1;
    camera.rotation.x = Math.PI / 2; // Look up/down? No, let's look forward.

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Stars
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 6000;
    const posArray = new Float32Array(starCount * 3);
    const velocityArray = new Float32Array(starCount);

    for (let i = 0; i < starCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 600; // x
      posArray[i + 1] = (Math.random() - 0.5) * 600; // y
      posArray[i + 2] = (Math.random() - 0.5) * 600; // z

      velocityArray[i / 3] = 0.1 + Math.random() * 0.5; // Individual speed
    }

    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );

    // Create a circular texture for stars
    // const sprite = new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/disc.png');

    const starMaterial = new THREE.PointsMaterial({
      size: 0.5,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      // map: sprite, // Optional: use texture if available, else squares
      blending: THREE.AdditiveBlending,
    });

    const starMesh = new THREE.Points(starGeometry, starMaterial);
    scene.add(starMesh);

    // Animation
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      mouseX = event.clientX - window.innerWidth / 2;
      mouseY = event.clientY - window.innerHeight / 2;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    // const clock = new THREE.Clock();

    const animate = () => {
      //   const elapsedTime = clock.getElapsedTime();

      targetX = mouseX * 0.001;
      targetY = mouseY * 0.001;

      // Rotate entire system based on mouse
      starMesh.rotation.y += 0.05 * (targetX - starMesh.rotation.y);
      starMesh.rotation.x += 0.05 * (targetY - starMesh.rotation.x);

      // Move stars towards camera (Warp effect)
      const positions = starGeometry.attributes.position.array;

      for (let i = 0; i < starCount; i++) {
        // Move Z
        positions[i * 3 + 1] -= 0.5; // Move "down" or "forward" depending on rotation

        // If star passes camera, reset to back
        if (positions[i * 3 + 1] < -300) {
          positions[i * 3 + 1] = 300;
        }
      }

      starGeometry.attributes.position.needsUpdate = true;

      // Gentle rotation
      starMesh.rotation.z += 0.001;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      starGeometry.dispose();
      starMaterial.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />
  );
};

export default Starfield;
