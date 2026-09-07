import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './Hero3DCanvas.css';

export default function Hero3DCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // Group holding luminaire fixture
    const luminaireGroup = new THREE.Group();
    scene.add(luminaireGroup);

    // 1. Outer Architectural Metal Ring / Frame
    const ringGeo = new THREE.TorusGeometry(1.8, 0.08, 32, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x1a233a,
      metalness: 0.9,
      roughness: 0.2,
    });
    const outerRing = new THREE.Mesh(ringGeo, ringMat);
    luminaireGroup.add(outerRing);

    // 2. Inner Glowing LED Ring
    const innerRingGeo = new THREE.TorusGeometry(1.4, 0.05, 32, 100);
    const innerRingMat = new THREE.MeshStandardMaterial({
      color: 0xffd84d,
      emissive: 0xffb700,
      emissiveIntensity: 2.0,
      roughness: 0.1,
      metalness: 0.5,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    luminaireGroup.add(innerRing);

    // 3. Central Modern LED Bulb Core (Glass Orb with Internal Filament)
    const orbGeo = new THREE.SphereGeometry(0.75, 48, 48);
    const orbMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      opacity: 1,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
      thickness: 0.5,
      clearcoat: 1.0,
    });
    const glassOrb = new THREE.Mesh(orbGeo, orbMat);
    luminaireGroup.add(glassOrb);

    // Internal Glowing Core Mesh
    const coreGeo = new THREE.OctahedronGeometry(0.35, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xfff0b3,
      wireframe: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    glassOrb.add(coreMesh);

    // 4. Floating particles for light dust effect
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 120;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 10;
      posArray[i + 1] = (Math.random() - 0.5) * 10;
      posArray[i + 2] = (Math.random() - 0.5) * 10;
    }

    particlesGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(posArray, 3)
    );

    const particlesMat = new THREE.PointsMaterial({
      size: 0.035,
      color: 0xffd84d,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleSystem);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x071a33, 1.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffd84d, 5, 20);
    pointLight.position.set(0, 0, 0);
    luminaireGroup.add(pointLight);

    const directionalLight = new THREE.DirectionalLight(0x0066ff, 2.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Mouse Tracking with Smooth Lerp Physics
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      mouse.targetX = x;
      mouse.targetY = y;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Resize handler
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', onResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Lerp mouse positions smoothly
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Rotate group smoothly based on mouse & elapsed time
      luminaireGroup.rotation.y = elapsedTime * 0.2 + mouse.x * 0.8;
      luminaireGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.15 - mouse.y * 0.6;
      luminaireGroup.rotation.z = mouse.x * 0.2;

      // Inner core animation
      coreMesh.rotation.x = elapsedTime * 0.8;
      coreMesh.rotation.y = elapsedTime * 0.6;

      // Subtle pulse light intensity based on mouse movement speed
      const mouseDist = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y);
      pointLight.intensity = 4 + Math.sin(elapsedTime * 3) * 1.5 + mouseDist * 3;
      innerRingMat.emissiveIntensity = 1.8 + mouseDist * 1.5;

      // Camera parallax
      camera.position.x = mouse.x * 0.5;
      camera.position.y = mouse.y * 0.5;
      camera.lookAt(0, 0, 0);

      // Particle rotation
      particleSystem.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[450px] md:min-h-[600px] cursor-grab active:cursor-grabbing relative z-10"
      data-cursor="3D LIGHT"
    />
  );
}
