import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, RefreshCw, Eye, Image as ImageIcon, Box, Maximize2, Sparkles, Activity, Layers, Zap } from 'lucide-react';

interface Product3DViewerProps {
  modelUrl?: string;
  images?: string[];
  title?: string;
  categorySlug?: string;
  lightColorHex?: string;
  wattage?: number | string;
  lumens?: number | string;
}

export const Product3DViewer: React.FC<Product3DViewerProps> = ({
  modelUrl,
  images = [],
  title = 'Product Preview',
  categorySlug = 'ceiling-lights',
  lightColorHex = '#ffedc2',
  wattage = 12,
  lumens = 1200,
}) => {
  const [activeMode, setActiveMode] = useState<'3d' | '2d'>('3d');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMotionGraph, setShowMotionGraph] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const lightPointRef = useRef<THREE.PointLight | null>(null);
  const beamMeshRef = useRef<THREE.Mesh | null>(null);
  const animatedPartsRef = useRef<THREE.Object3D[]>([]);

  // Initialize 3D Scene when mode is '3d'
  useEffect(() => {
    if (activeMode !== '3d' || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a0d14'); // sleek dark studio background
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.2, 4.5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.minDistance = 1.5;
    controls.maxDistance = 8;
    controls.autoRotate = isAutoRotating;
    controls.autoRotateSpeed = 1.5;
    controls.target.set(0, 0.5, 0);
    controls.update();
    controlsRef.current = controls;

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(5, 8, 5);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 1024;
    dirLight1.shadow.mapSize.height = 1024;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.6); // cool fill
    dirLight2.position.set(-5, 4, -5);
    scene.add(dirLight2);

    // Dynamic fixture emission light
    const emissivePoint = new THREE.PointLight(lightColorHex, 2.5, 10);
    emissivePoint.position.set(0, 0.8, 0);
    scene.add(emissivePoint);
    lightPointRef.current = emissivePoint;

    // Display Stage Podium
    const stageGeo = new THREE.CylinderGeometry(2.2, 2.4, 0.15, 64);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0x131926,
      roughness: 0.3,
      metalness: 0.8,
    });
    const stage = new THREE.Mesh(stageGeo, stageMat);
    stage.position.y = -0.075;
    stage.receiveShadow = true;
    scene.add(stage);

    const stageRingGeo = new THREE.RingGeometry(2.1, 2.18, 64);
    stageRingGeo.rotateX(-Math.PI / 2);
    const stageRingMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
    const stageRing = new THREE.Mesh(stageRingGeo, stageRingMat);
    stageRing.position.y = 0.005;
    scene.add(stageRing);

    // Group for fixture model
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    let loadedModel = false;
    animatedPartsRef.current = [];

    if (modelUrl) {
      setIsLoadingModel(true);
      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          setIsLoadingModel(false);
          loadedModel = true;
          const loadedScene = gltf.scene;

          const bbox = new THREE.Box3().setFromObject(loadedScene);
          const center = bbox.getCenter(new THREE.Vector3());
          const size = bbox.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2 / (maxDim || 1);

          loadedScene.position.sub(center.multiplyScalar(scale));
          loadedScene.position.y += 0.8;
          loadedScene.scale.set(scale, scale, scale);

          loadedScene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          modelGroup.add(loadedScene);
        },
        undefined,
        (error) => {
          console.warn('Could not load 3D GLB model, building category 3D model.', error);
          setIsLoadingModel(false);
          buildCategorySpecific3DModel(categorySlug, modelGroup, lightColorHex, beamMeshRef, animatedPartsRef);
        }
      );
    }

    if (!modelUrl || !loadedModel) {
      buildCategorySpecific3DModel(categorySlug, modelGroup, lightColorHex, beamMeshRef, animatedPartsRef);
    }

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (controlsRef.current) {
        controlsRef.current.update();
        const angleDeg = Math.round((controlsRef.current.getAzimuthalAngle() * 180) / Math.PI + 180) % 360;
        setRotationAngle(angleDeg);
      }

      // Animate custom parts (e.g. spinning fan blades, floating smart orbit rings)
      animatedPartsRef.current.forEach((part) => {
        if (part.userData.animationType === 'spin') {
          part.rotation.y += 0.08;
        } else if (part.userData.animationType === 'float') {
          part.position.y = (part.userData.initialY || 0.8) + Math.sin(elapsedTime * 2) * 0.05;
          part.rotation.y += 0.01;
        } else if (part.userData.animationType === 'pulseRing') {
          part.rotation.z += 0.02;
          part.rotation.x += 0.01;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 500;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.remove();
      }
      scene.clear();
      renderer.dispose();
    };
  }, [activeMode, modelUrl, categorySlug]);

  // Update auto rotate state when state changes
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotating;
    }
  }, [isAutoRotating]);

  // Update light color dynamically in 3D scene
  useEffect(() => {
    if (lightPointRef.current) {
      lightPointRef.current.color = new THREE.Color(lightColorHex);
    }
    if (beamMeshRef.current) {
      (beamMeshRef.current.material as THREE.MeshBasicMaterial).color = new THREE.Color(lightColorHex);
    }
  }, [lightColorHex]);

  const handleResetView = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 2.2, 4.5);
      controlsRef.current.target.set(0, 0.5, 0);
      controlsRef.current.update();
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : 'h-[480px] md:h-[560px]'
      }`}
    >
      {/* Top Overlay Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Category & Mode Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/60 text-xs font-semibold text-slate-200 flex items-center gap-2 shadow-lg"
        >
          {activeMode === '3d' ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="capitalize font-bold text-amber-400">
                {categorySlug.replace('-', ' ')}
              </span>
              <span className="text-slate-500">• 3D Motion Studio</span>
            </>
          ) : (
            <>
              <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>2D Photo Gallery</span>
            </>
          )}
        </motion.div>

        {/* Tab Switcher: 3D vs 2D */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md p-1 rounded-full border border-slate-700 flex items-center gap-1 shadow-xl">
          <button
            onClick={() => setActiveMode('3d')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
              activeMode === '3d'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            3D Motion
          </button>
          <button
            onClick={() => setActiveMode('2d')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
              activeMode === '2d'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            2D Photos ({images.length})
          </button>
        </div>
      </div>

      {/* Live Motion Graph Overlay */}
      {activeMode === '3d' && showMotionGraph && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-16 left-4 z-20 pointer-events-auto bg-slate-900/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800/90 text-xs w-48 space-y-2 shadow-2xl hidden sm:block"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-slate-300 font-bold">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Activity className="w-3.5 h-3.5" />
              Motion Graph
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">60 FPS</span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>Azimuth Angle:</span>
              <span className="font-mono text-white font-bold">{rotationAngle}°</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Wattage Load:</span>
              <span className="font-mono text-amber-400 font-bold">{wattage}W</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Flux Output:</span>
              <span className="font-mono text-sky-400 font-bold">{lumens} lm</span>
            </div>
          </div>

          {/* Animated SVG Wave Graph */}
          <div className="h-8 w-full pt-1">
            <svg className="w-full h-full text-amber-400" viewBox="0 0 100 30" fill="none">
              <motion.path
                d="M 0 15 Q 25 5, 50 15 T 100 15"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                animate={{
                  d: [
                    'M 0 15 Q 25 5, 50 15 T 100 15',
                    'M 0 15 Q 25 25, 50 15 T 100 15',
                    'M 0 15 Q 25 5, 50 15 T 100 15',
                  ],
                }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              />
            </svg>
          </div>
        </motion.div>
      )}

      {/* 3D Canvas Container */}
      {activeMode === '3d' && (
        <div className="w-full h-full flex-1">
          {isLoadingModel && (
            <div className="absolute inset-0 z-10 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-slate-300">
              <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
              <p className="text-sm font-medium">Loading 3D Lighting Model...</p>
            </div>
          )}

          {/* 3D Bottom Floating Control Bar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700/80 shadow-2xl">
            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              title={isAutoRotating ? 'Pause Auto Rotate' : 'Start Auto Rotate'}
              className={`p-2 rounded-full transition-colors ${
                isAutoRotating ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <RotateCw className={`w-4 h-4 ${isAutoRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '10s' }} />
            </button>

            <button
              onClick={handleResetView}
              title="Reset View"
              className="p-2 rounded-full text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-slate-700 mx-1" />

            <button
              onClick={() => setShowMotionGraph(!showMotionGraph)}
              title="Toggle Motion Graph"
              className={`p-2 rounded-full transition-colors ${
                showMotionGraph ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Activity className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-slate-700 mx-1" />

            <div className="text-[11px] text-slate-400 px-2 flex items-center gap-1.5 hidden md:flex">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Drag to rotate • Scroll to zoom</span>
            </div>

            <div className="h-4 w-px bg-slate-700 mx-1 hidden md:block" />

            <button
              onClick={toggleFullscreen}
              title="Fullscreen"
              className="p-2 rounded-full text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2D Gallery View Container */}
      {activeMode === '2d' && (
        <div className="w-full h-full flex flex-col justify-between p-6 pt-16">
          <div className="flex-1 flex items-center justify-center min-h-0">
            {images.length > 0 ? (
              <motion.img
                key={selectedImageIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                src={images[selectedImageIndex] || images[0]}
                alt={title}
                className="max-h-full max-w-full object-contain rounded-xl shadow-xl transition-all duration-300"
              />
            ) : (
              <div className="text-center text-slate-400 py-12">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No 2D high-res images available</p>
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2 overflow-x-auto py-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-amber-500 scale-105 shadow-md'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Builds CATEGORY-SPECIFIC distinct 3D procedural geometries & motion signature.
 */
function buildCategorySpecific3DModel(
  categorySlug: string,
  group: THREE.Group,
  lightColorHex: string,
  beamRef: React.MutableRefObject<THREE.Mesh | null>,
  animatedPartsRef: React.MutableRefObject<THREE.Object3D[]>
) {
  while (group.children.length > 0) {
    group.remove(group.children[0]);
  }

  const mainColor = new THREE.Color('#1e293b');
  const goldColor = new THREE.Color('#d97706');
  const lightColor = new THREE.Color(lightColorHex);

  const cat = categorySlug.toLowerCase();

  // 1. SMART LIGHTING & LED BULBS CATEGORY -> 3D Smart Light Bulb with Levitating Smart Ring
  if (cat.includes('smart') || cat.includes('bulb')) {
    // Metal Base B22 Cap
    const capGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.35, 32);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 0.3;
    group.add(cap);

    // Bulb Ceramic Body
    const bodyGeo = new THREE.CylinderGeometry(0.45, 0.26, 0.45, 32);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.1 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.65;
    group.add(body);

    // Glowing Diffuser Dome
    const domeGeo = new THREE.SphereGeometry(0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshBasicMaterial({ color: lightColor });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 0.85;
    group.add(dome);

    // Floating Animated Smart Ring Orbit
    const ringGeo = new THREE.TorusGeometry(0.75, 0.03, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: lightColor });
    const smartRing = new THREE.Mesh(ringGeo, ringMat);
    smartRing.position.y = 0.85;
    smartRing.userData = { animationType: 'pulseRing' };
    animatedPartsRef.current.push(smartRing);
    group.add(smartRing);

    return;
  }

  // 2. SPOTLIGHTS & TRACK LIGHTING CATEGORY -> 48V Magnetic Track & Rotatable Track Spotlight
  if (cat.includes('spot') || cat.includes('track')) {
    // Track Rail Top
    const railGeo = new THREE.BoxGeometry(2.4, 0.1, 0.2);
    const railMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 });
    const rail = new THREE.Mesh(railGeo, railMat);
    rail.position.y = 1.8;
    group.add(rail);

    // Swivel Mounting Adapter
    const adaptGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.2, 16);
    const adaptMat = new THREE.MeshStandardMaterial({ color: goldColor, metalness: 0.9, roughness: 0.2 });
    const adapt = new THREE.Mesh(adaptGeo, adaptMat);
    adapt.position.y = 1.65;
    group.add(adapt);

    // Rotatable Cylinder Spotlight Body
    const spotBodyGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.8, 32);
    const spotBodyMat = new THREE.MeshStandardMaterial({ color: mainColor, metalness: 0.8, roughness: 0.2 });
    const spotBody = new THREE.Mesh(spotBodyGeo, spotBodyMat);
    spotBody.rotation.z = Math.PI / 4;
    spotBody.position.set(0.2, 1.2, 0);

    const emitterGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 32);
    const emitterMat = new THREE.MeshBasicMaterial({ color: lightColor });
    const emitter = new THREE.Mesh(emitterGeo, emitterMat);
    emitter.position.y = -0.38;
    spotBody.add(emitter);

    // Directional Cone Beam
    const beamGeo = new THREE.ConeGeometry(1.2, 1.4, 32, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: lightColor,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.rotation.x = Math.PI;
    beam.position.y = -1.0;
    beamRef.current = beam;
    spotBody.add(beam);

    group.add(spotBody);
    return;
  }

  // 3. FANS & BLDC FANS CATEGORY -> Modern 3-Blade BLDC Smart Ceiling Fan with Spin Motion
  if (cat.includes('fan')) {
    // Ceiling Downrod
    const rodGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 16);
    const rodMat = new THREE.MeshStandardMaterial({ color: mainColor, metalness: 0.8 });
    const rod = new THREE.Mesh(rodGeo, rodMat);
    rod.position.y = 1.7;
    group.add(rod);

    // Motor Hub Group (Spins continuous Y axis)
    const rotorGroup = new THREE.Group();
    rotorGroup.position.y = 1.35;
    rotorGroup.userData = { animationType: 'spin' };
    animatedPartsRef.current.push(rotorGroup);

    const motorGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.25, 32);
    const motorMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.2, metalness: 0.8 });
    const motor = new THREE.Mesh(motorGeo, motorMat);
    rotorGroup.add(motor);

    // LED Hub Light Disc
    const fanLightGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.05, 32);
    const fanLightMat = new THREE.MeshBasicMaterial({ color: lightColor });
    const fanLight = new THREE.Mesh(fanLightGeo, fanLightMat);
    fanLight.position.y = -0.13;
    rotorGroup.add(fanLight);

    // 3 Fan Blades Spaced 120 Deg
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const bladeGeo = new THREE.BoxGeometry(1.2, 0.02, 0.18);
      const bladeMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3 });
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.x = Math.cos(angle) * 0.85;
      blade.position.z = Math.sin(angle) * 0.85;
      blade.rotation.y = -angle;
      rotorGroup.add(blade);
    }

    group.add(rotorGroup);
    return;
  }

  // 4. DEFAULT / CEILING LIGHTS / DECORATIVE -> Architectural Pendant / COB Ceiling Light
  const roseGeo = new THREE.CylinderGeometry(0.3, 0.35, 0.08, 32);
  const roseMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.2, metalness: 0.8 });
  const rose = new THREE.Mesh(roseGeo, roseMat);
  rose.position.y = 2.0;
  group.add(rose);

  const wireGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.8, 16);
  const wireMat = new THREE.MeshBasicMaterial({ color: 0x475569 });
  const wire = new THREE.Mesh(wireGeo, wireMat);
  wire.position.y = 1.56;
  group.add(wire);

  const housingGeo = new THREE.CylinderGeometry(0.7, 0.9, 0.5, 32);
  const housingMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.15, metalness: 0.85 });
  const housing = new THREE.Mesh(housingGeo, housingMat);
  housing.position.y = 1.0;
  housing.castShadow = true;
  group.add(housing);

  const trimGeo = new THREE.TorusGeometry(0.8, 0.04, 16, 64);
  const trimMat = new THREE.MeshStandardMaterial({ color: goldColor, roughness: 0.2, metalness: 0.9 });
  const trim = new THREE.Mesh(trimGeo, trimMat);
  trim.rotation.x = Math.PI / 2;
  trim.position.y = 0.76;
  group.add(trim);

  const diffuserGeo = new THREE.CylinderGeometry(0.68, 0.68, 0.04, 32);
  const diffuserMat = new THREE.MeshBasicMaterial({ color: lightColor });
  const diffuser = new THREE.Mesh(diffuserGeo, diffuserMat);
  diffuser.position.y = 0.74;
  group.add(diffuser);

  const beamGeo = new THREE.ConeGeometry(1.6, 1.2, 32, 1, true);
  const beamMat = new THREE.MeshBasicMaterial({
    color: lightColor,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.rotation.x = Math.PI;
  beam.position.y = 0.14;
  beamRef.current = beam;
  group.add(beam);
}
