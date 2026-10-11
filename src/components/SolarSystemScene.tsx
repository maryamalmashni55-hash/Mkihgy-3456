import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PLANETS, PlanetData } from '../data/spaceData';
import { 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Play, 
  Pause, 
  Eye, 
  Info, 
  Compass, 
  Zap, 
  Globe2, 
  Rocket, 
  Crosshair, 
  Sliders,
  Layers
} from 'lucide-react';
import { cosmicAudio } from './CosmicAudio';

interface SolarSystemSceneProps {
  onSelectPlanet?: (planet: PlanetData | null) => void;
}

// Procedural Canvas Texture Generator for realistic space bodies
function createProceduralTexture(type: string, baseHex: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (type === 'earth') {
    // Oceans base
    ctx.fillStyle = '#0f386b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Continents
    ctx.fillStyle = '#1e6f42';
    for (let i = 0; i < 40; i++) {
      const cx = Math.random() * canvas.width;
      const cy = Math.random() * canvas.height;
      const cr = 40 + Math.random() * 120;
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Polar ice caps
    ctx.fillStyle = '#e2f3fc';
    ctx.fillRect(0, 0, canvas.width, 45);
    ctx.fillRect(0, canvas.height - 45, canvas.width, 45);

    // Swirling atmospheric clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.ellipse(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        100 + Math.random() * 150,
        15 + Math.random() * 30,
        Math.random() * Math.PI,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  } else if (type === 'gas-bands' || type === 'jupiter') {
    // Banded atmosphere for Jupiter / gas giants
    const bandCount = 36;
    for (let i = 0; i < bandCount; i++) {
      const y = (i / bandCount) * canvas.height;
      const h = canvas.height / bandCount;
      const shade = i % 2 === 0 ? 'rgba(180, 83, 9, 0.65)' : 'rgba(245, 158, 11, 0.55)';
      ctx.fillStyle = shade;
      ctx.fillRect(0, y, canvas.width, h);
    }
    // Great Red Spot
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.ellipse(canvas.width * 0.65, canvas.height * 0.68, 65, 38, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'rust' || type === 'mars') {
    // Mars dust canyons and polar caps
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#7f1d1d';
    for (let i = 0; i < 25; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 30 + Math.random() * 80, 0, Math.PI * 2);
      ctx.fill();
    }
    // Polar white cap
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(0, 0, canvas.width, 25);
  } else if (type === 'dense-gas' || type === 'saturn') {
    // Saturn creamy bands
    for (let i = 0; i < 20; i++) {
      const y = (i / 20) * canvas.height;
      ctx.fillStyle = i % 2 === 0 ? '#ca8a04' : '#eab308';
      ctx.fillRect(0, y, canvas.width, canvas.height / 20);
    }
  } else if (type === 'rocky' || type === 'mercury') {
    // Cratering
    ctx.fillStyle = '#475569';
    for (let i = 0; i < 60; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 5 + Math.random() * 25, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export const SolarSystemScene: React.FC<SolarSystemSceneProps> = ({ onSelectPlanet }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [showOrbits, setShowOrbits] = useState<boolean>(true);
  const [showAsteroids, setShowAsteroids] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [cameraMode, setCameraMode] = useState<'free' | 'planet' | 'spacecraft'>('free');

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const planetsMeshesRef = useRef<Map<string, { mesh: THREE.Mesh; orbitGroup: THREE.Group; data: PlanetData }>>(new Map());
  const orbitsGroupRef = useRef<THREE.Group | null>(null);
  const asteroidsMeshRef = useRef<THREE.InstancedMesh | null>(null);
  const spacecraftGroupRef = useRef<THREE.Group | null>(null);
  const spacecraftTrailRef = useRef<THREE.Line | null>(null);

  const targetCameraPos = useRef<THREE.Vector3 | null>(null);
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Dragging / Rotation state
  const isDragging = useRef<boolean>(false);
  const previousMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const sphericalCoord = useRef<{ radius: number; theta: number; phi: number }>({
    radius: 145,
    theta: Math.PI / 4,
    phi: Math.PI / 3.4
  });

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x030509);
    scene.fog = new THREE.FogExp2(0x030509, 0.0007);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 3000);
    cameraRef.current = camera;

    const updateCameraFromSpherical = () => {
      const { radius, theta, phi } = sphericalCoord.current;
      camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = radius * Math.cos(phi);
      camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(currentLookAt.current);
    };
    updateCameraFromSpherical();

    // 3. Renderer with cinematic ACESFilmic Tone Mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Starfield with deep celestial dust
    const starCount = 4200;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      const r = 600 + Math.random() * 1200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = r * Math.cos(phi);

      const dice = Math.random();
      if (dice > 0.85) {
        starColors[i] = 0.6; starColors[i + 1] = 0.85; starColors[i + 2] = 1.0; // cyan-blue
      } else if (dice > 0.7) {
        starColors[i] = 1.0; starColors[i + 1] = 0.8; starColors[i + 2] = 0.6; // amber
      } else {
        starColors[i] = 0.95; starColors[i + 1] = 0.95; starColors[i + 2] = 1.0; // crisp white
      }
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMat = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });
    scene.add(new THREE.Points(starGeo, starMat));

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0x1e293b, 0.45);
    scene.add(ambientLight);

    const sunPointLight = new THREE.PointLight(0xfffbeb, 4.2, 500, 0.5);
    sunPointLight.position.set(0, 0, 0);
    scene.add(sunPointLight);

    const secondaryGlowLight = new THREE.PointLight(0x0ea5e9, 0.7, 350, 0.6);
    scene.add(secondaryGlowLight);

    // 6. The Sun with realistic fiery flares & multilayer corona
    const sunGroup = new THREE.Group();
    scene.add(sunGroup);

    const sunCore = new THREE.Mesh(
      new THREE.SphereGeometry(6.5, 48, 48),
      new THREE.MeshBasicMaterial({ color: 0xffedd5 })
    );
    sunGroup.add(sunCore);

    // Corona flare 1
    const corona1 = new THREE.Mesh(
      new THREE.SphereGeometry(7.8, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.38,
        side: THREE.BackSide
      })
    );
    sunGroup.add(corona1);

    // Corona flare 2 (Atmosphere haze)
    const corona2 = new THREE.Mesh(
      new THREE.SphereGeometry(10.2, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0xd97706,
        transparent: true,
        opacity: 0.18,
        side: THREE.BackSide
      })
    );
    sunGroup.add(corona2);

    // 7. Orbits & Procedural Planets
    const orbitsGroup = new THREE.Group();
    scene.add(orbitsGroup);
    orbitsGroupRef.current = orbitsGroup;

    planetsMeshesRef.current.clear();

    PLANETS.forEach((planet) => {
      // Orbit Line
      const orbitCurve = new THREE.EllipseCurve(
        0, 0,
        planet.orbitRadius, planet.orbitRadius,
        0, 2 * Math.PI,
        false, 0
      );
      const orbitPoints = orbitCurve.getPoints(120);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(
        orbitPoints.map((p) => new THREE.Vector3(p.x, 0, p.y))
      );
      const orbitMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(planet.color),
        transparent: true,
        opacity: 0.28
      });
      const orbitLine = new THREE.LineLoop(orbitGeo, orbitMat);
      orbitsGroup.add(orbitLine);

      // Orbit Rotator Group
      const orbitGroup = new THREE.Group();
      orbitGroup.rotation.y = Math.random() * Math.PI * 2;
      scene.add(orbitGroup);

      // Planet Texture & Mesh
      const texture = createProceduralTexture(planet.texturePattern, planet.color);
      const pGeo = new THREE.SphereGeometry(planet.size, 36, 36);
      const pMat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.7,
        metalness: 0.05
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.set(planet.orbitRadius, 0, 0);
      pMesh.castShadow = true;
      pMesh.receiveShadow = true;
      pMesh.userData = { id: planet.id, planet };
      orbitGroup.add(pMesh);

      // Earth atmosphere glow & moon
      if (planet.id === 'earth') {
        const atmoGeo = new THREE.SphereGeometry(planet.size * 1.15, 32, 32);
        const atmoMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.25,
          side: THREE.BackSide
        });
        pMesh.add(new THREE.Mesh(atmoGeo, atmoMat));

        // Luna (Moon)
        const moonGeo = new THREE.SphereGeometry(0.42, 18, 18);
        const moonMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.85 });
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        moonMesh.position.set(3.4, 0.5, 0);
        pMesh.add(moonMesh);
      }

      // Saturn Rings with Cassini Division
      if (planet.hasRings) {
        // Inner ring
        const ringGeoA = new THREE.RingGeometry(planet.size * 1.4, planet.size * 2.1, 64);
        ringGeoA.rotateX(Math.PI / 2.25);
        const ringMatA = new THREE.MeshStandardMaterial({
          color: 0xfef08a,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.88,
          roughness: 0.5
        });
        pMesh.add(new THREE.Mesh(ringGeoA, ringMatA));

        // Outer ring (Cassini gap separation)
        const ringGeoB = new THREE.RingGeometry(planet.size * 2.25, planet.size * 2.8, 64);
        ringGeoB.rotateX(Math.PI / 2.25);
        const ringMatB = new THREE.MeshStandardMaterial({
          color: 0xd97706,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.65,
          roughness: 0.6
        });
        pMesh.add(new THREE.Mesh(ringGeoB, ringMatB));
      }

      planetsMeshesRef.current.set(planet.id, {
        mesh: pMesh,
        orbitGroup,
        data: planet
      });
    });

    // 8. Asteroid Belt (Between Mars 48 and Jupiter 65)
    const asteroidCount = 420;
    const asteroidGeo = new THREE.DodecahedronGeometry(0.35, 1);
    const asteroidMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.9 });
    const asteroidMesh = new THREE.InstancedMesh(asteroidGeo, asteroidMat, asteroidCount);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < asteroidCount; i++) {
      const radius = 54 + (Math.random() - 0.5) * 8; // 50 to 58
      const angle = (i / asteroidCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.1;
      const height = (Math.random() - 0.5) * 3;
      dummy.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const s = 0.5 + Math.random() * 1.2;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      asteroidMesh.setMatrixAt(i, dummy.matrix);
    }
    asteroidMesh.instanceMatrix.needsUpdate = true;
    scene.add(asteroidMesh);
    asteroidsMeshRef.current = asteroidMesh;

    // 9. Interplanetary Starship Model & Hohmann Transfer Orbit
    const shipGroup = new THREE.Group();
    scene.add(shipGroup);
    spacecraftGroupRef.current = shipGroup;

    // Rocket Hull
    const hullGeo = new THREE.ConeGeometry(0.7, 3.2, 16);
    hullGeo.rotateX(Math.PI / 2);
    const hullMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.85,
      roughness: 0.2
    });
    const hull = new THREE.Mesh(hullGeo, hullMat);
    shipGroup.add(hull);

    // Solar Wings
    const wingGeo = new THREE.BoxGeometry(4.5, 0.05, 0.8);
    const wingMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.5 });
    const wings = new THREE.Mesh(wingGeo, wingMat);
    shipGroup.add(wings);

    // Blue Ion Engine Exhaust Plasma Flame
    const engineFlameGeo = new THREE.ConeGeometry(0.35, 1.8, 12);
    engineFlameGeo.rotateX(-Math.PI / 2);
    const engineFlameMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.85
    });
    const flame = new THREE.Mesh(engineFlameGeo, engineFlameMat);
    flame.position.set(0, 0, -1.8);
    shipGroup.add(flame);

    // 10. Interaction Handlers (Mouse drag, wheel zoom, touch)
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      sphericalCoord.current.theta -= deltaX * 0.005;
      sphericalCoord.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, sphericalCoord.current.phi - deltaY * 0.005));

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
      targetCameraPos.current = null;
      setCameraMode('free');
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      sphericalCoord.current.radius = Math.max(25, Math.min(280, sphericalCoord.current.radius + e.deltaY * 0.12));
      targetCameraPos.current = null;
      setCameraMode('free');
    };

    // Touch support for tablets/smartphones
    let touchStartDist = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDragging.current) {
        const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
        const deltaY = e.touches[0].clientY - previousMousePosition.current.y;

        sphericalCoord.current.theta -= deltaX * 0.006;
        sphericalCoord.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, sphericalCoord.current.phi - deltaY * 0.006));

        previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        targetCameraPos.current = null;
        setCameraMode('free');
      } else if (e.touches.length === 2) {
        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const diff = touchStartDist - currentDist;
        sphericalCoord.current.radius = Math.max(25, Math.min(280, sphericalCoord.current.radius + diff * 0.22));
        touchStartDist = currentDist;
        targetCameraPos.current = null;
      }
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    // Raycast on click
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);

      const meshesToTest: THREE.Mesh[] = [];
      planetsMeshesRef.current.forEach(({ mesh }) => {
        meshesToTest.push(mesh);
      });

      const intersects = raycaster.intersectObjects(meshesToTest, false);
      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        const planet = clickedMesh.userData.planet as PlanetData;
        if (planet) {
          selectPlanet(planet);
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    dom.addEventListener('wheel', handleWheel, { passive: false });
    dom.addEventListener('click', handleClick);

    dom.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Resize
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 11. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let shipAngle = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Sun flares rotation
      sunCore.rotation.y += 0.002;
      corona1.rotation.y -= 0.0015;
      corona2.rotation.z += 0.001;

      // Asteroid belt subtle orbit
      if (asteroidsMeshRef.current && !isPaused) {
        asteroidsMeshRef.current.rotation.y += 0.0012 * speedMultiplier;
      }

      // Spacecraft Hohmann transfer path between Earth & Mars
      if (!isPaused) {
        shipAngle += 0.015 * delta * speedMultiplier;
        const shipRadius = 42 + Math.sin(shipAngle) * 5; // oscillates between Earth (36) and Mars (48)
        const shipX = Math.cos(shipAngle) * shipRadius;
        const shipZ = Math.sin(shipAngle) * shipRadius;
        const shipY = Math.sin(shipAngle * 2) * 1.5;

        shipGroup.position.set(shipX, shipY, shipZ);
        // Face forward along orbital tangent
        shipGroup.rotation.y = -shipAngle + Math.PI / 2;

        // Animate plasma flame flicker
        flame.scale.set(
          1 + Math.sin(clock.getElapsedTime() * 25) * 0.15,
          1 + Math.cos(clock.getElapsedTime() * 30) * 0.25,
          1
        );
      }

      // Update planets orbits & axial rotations
      if (!isPaused) {
        planetsMeshesRef.current.forEach(({ mesh, orbitGroup, data }) => {
          orbitGroup.rotation.y += data.orbitSpeed * delta * 0.8 * speedMultiplier;
          mesh.rotation.y += data.rotationSpeed * delta * 15 * speedMultiplier;
        });
      }

      // Spacecraft chase camera view
      if (cameraMode === 'spacecraft' && shipGroup) {
        const offset = new THREE.Vector3(-8, 4, -12);
        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), shipGroup.rotation.y);
        const desiredCamPos = shipGroup.position.clone().add(offset);
        camera.position.lerp(desiredCamPos, 0.06);
        currentLookAt.current.lerp(shipGroup.position, 0.08);
        camera.lookAt(currentLookAt.current);
      } else if (targetCameraPos.current) {
        camera.position.lerp(targetCameraPos.current, 0.05);
        currentLookAt.current.lerp(targetLookAt.current, 0.06);
        camera.lookAt(currentLookAt.current);
      } else {
        updateCameraFromSpherical();
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('wheel', handleWheel);
      dom.removeEventListener('click', handleClick);

      dom.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);

      renderer.dispose();
      if (container.contains(dom)) {
        container.removeChild(dom);
      }
    };
  }, []);

  // Update orbit line visibility
  useEffect(() => {
    if (orbitsGroupRef.current) {
      orbitsGroupRef.current.visible = showOrbits;
    }
  }, [showOrbits]);

  // Update asteroids visibility
  useEffect(() => {
    if (asteroidsMeshRef.current) {
      asteroidsMeshRef.current.visible = showAsteroids;
    }
  }, [showAsteroids]);

  const selectPlanet = (planet: PlanetData | null) => {
    setSelectedPlanet(planet);
    if (onSelectPlanet) {
      onSelectPlanet(planet);
    }

    if (!planet) {
      targetLookAt.current.set(0, 0, 0);
      sphericalCoord.current.radius = 145;
      targetCameraPos.current = null;
      setCameraMode('free');
      return;
    }

    setCameraMode('planet');
    cosmicAudio.playTelemetryBeep(920);

    const planetItem = planetsMeshesRef.current.get(planet.id);
    if (planetItem && cameraRef.current) {
      const worldPos = new THREE.Vector3();
      planetItem.mesh.getWorldPosition(worldPos);
      targetLookAt.current.copy(worldPos);

      const offsetDist = planet.size * 5 + 11;
      const camPos = new THREE.Vector3(
        worldPos.x + offsetDist * 0.7,
        worldPos.y + offsetDist * 0.45,
        worldPos.z + offsetDist * 0.7
      );
      targetCameraPos.current = camPos;
    }
  };

  const followSpacecraft = () => {
    setSelectedPlanet(null);
    setCameraMode('spacecraft');
    cosmicAudio.playQuindarTone(true);
  };

  const resetCamera = () => {
    cosmicAudio.playTelemetryBeep(650);
    selectPlanet(null);
    setCameraMode('free');
    sphericalCoord.current = {
      radius: 145,
      theta: Math.PI / 4,
      phi: Math.PI / 3.4
    };
    targetCameraPos.current = null;
    currentLookAt.current.set(0, 0, 0);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-3xl overflow-hidden border border-cyan-500/30 bg-[#030509] transition-all duration-300 shadow-2xl ${
        isFullscreen ? 'h-screen w-screen rounded-none' : 'h-[640px] md:h-[760px]'
      }`}
    >
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing select-none" />

      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-20">
        {/* Left: Quick Planet Pills & Spacecraft Chase Cam Button */}
        <div className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-cyan-500/25 shadow-xl">
          <button
            onClick={resetCamera}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              cameraMode === 'free' && selectedPlanet === null
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>نظرة شاملة</span>
          </button>

          {/* Follow Spacecraft Starship Chase Cam */}
          <button
            onClick={followSpacecraft}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 border ${
              cameraMode === 'spacecraft'
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/30'
                : 'text-amber-300 border-amber-500/30 bg-amber-950/20 hover:bg-amber-900/30'
            }`}
          >
            <Rocket className="w-3.5 h-3.5 animate-pulse" />
            <span>تتبع المركبة الفضائية (Starship Cam)</span>
          </button>

          <span className="text-slate-700">|</span>

          {PLANETS.map((planet) => (
            <button
              key={planet.id}
              onClick={() => selectPlanet(planet)}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedPlanet?.id === planet.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full inline-block shadow-sm"
                style={{ backgroundColor: planet.color }}
              />
              <span>{planet.name}</span>
            </button>
          ))}
        </div>

        {/* Right: Simulation Tactical Controls */}
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700/60 shadow-xl">
          {/* Pause / Play */}
          <button
            onClick={() => {
              setIsPaused(!isPaused);
              cosmicAudio.playTelemetryBeep(700);
            }}
            title={isPaused ? "تشغيل المحاكاة" : "إيقاف مؤقت"}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Speed multiplier */}
          <button
            onClick={() => {
              const speeds = [0.5, 1, 2, 5];
              const nextIdx = (speeds.indexOf(speedMultiplier) + 1) % speeds.length;
              setSpeedMultiplier(speeds[nextIdx]);
              cosmicAudio.playTelemetryBeep(850);
            }}
            className="px-2.5 py-1 text-xs font-mono text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors border border-cyan-500/30"
            title="مضاعف السرعة المدارية"
          >
            {speedMultiplier}x
          </button>

          {/* Toggle Orbits */}
          <button
            onClick={() => setShowOrbits(!showOrbits)}
            title="إظهار/إخفاء المدارات"
            className={`p-1.5 rounded-lg transition-colors ${
              showOrbits ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Toggle Asteroid Belt */}
          <button
            onClick={() => setShowAsteroids(!showAsteroids)}
            title="إظهار/إخفاء حزام الكويكبات"
            className={`p-1.5 rounded-lg transition-colors ${
              showAsteroids ? 'text-amber-400 bg-amber-950/40' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Reset Camera */}
          <button
            onClick={resetCamera}
            title="إعادة ضبط زاوية الكاميرا"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            title="ملء الشاشة"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Telemetry Status HUD (Bottom-left) */}
      <div className="absolute bottom-5 left-5 pointer-events-none hidden sm:flex flex-col gap-1.5 text-xs text-slate-400 bg-slate-950/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-cyan-500/20 shadow-2xl">
        <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>HELIOCENTRIC COORDINATE SYSTEM • THREE.JS WEBGL</span>
        </div>
        <div className="text-[11px] text-slate-400">
          اسحب للتدوير التكتيكي • عجلة الفأرة للتقريب • انقر على أي كوكب لعرض المقاييس العلمية
        </div>
      </div>

      {/* Selected Planet HUD Panel */}
      {selectedPlanet && (
        <div className="absolute bottom-5 right-5 max-w-sm sm:max-w-md w-[calc(100%-2.5rem)] z-30 pointer-events-auto transition-all duration-300">
          <div className="glass-panel-glow rounded-3xl p-5 sm:p-6 border border-cyan-500/35 text-right shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-700/60 pb-3">
              <button
                onClick={() => selectPlanet(null)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800/80 transition-colors text-xs font-mono"
              >
                إغلاق [ESC]
              </button>

              <div className="flex items-center gap-3">
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 justify-end">
                    <span>{selectedPlanet.name}</span>
                    <span
                      className="w-3.5 h-3.5 rounded-full shadow-lg"
                      style={{ backgroundColor: selectedPlanet.color }}
                    />
                  </h4>
                  <p className="text-xs text-cyan-400 font-mono">
                    {selectedPlanet.nameEn} • {selectedPlanet.arabicSubtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Scientific Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5 my-4 text-xs">
              <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block mb-1">الجاذبية السطحية:</span>
                <span className="font-bold text-white font-mono text-base">{selectedPlanet.gravity} م/ث²</span>
                <span className="text-[10px] text-cyan-400 block mt-0.5">
                  {selectedPlanet.gravity > 9.8 ? 'أعلى من جاذبية الأرض' : 'أخف من جاذبية الأرض'}
                </span>
              </div>

              <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block mb-1">البعد عن الشمس:</span>
                <span className="font-bold text-cyan-300 font-mono text-base">
                  {selectedPlanet.distanceFromSunKmMillion} م.كم
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  {selectedPlanet.distanceFromSunAU} وحدة فلكية (AU)
                </span>
              </div>

              <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block mb-1">دورة اليوم الكامل:</span>
                <span className="font-bold text-slate-100 font-mono text-base">
                  {selectedPlanet.dayLengthHours} ساعة
                </span>
              </div>

              <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block mb-1">السنة المدارية:</span>
                <span className="font-bold text-amber-300 font-mono text-base">
                  {selectedPlanet.yearLengthDays} يوم أرضي
                </span>
              </div>
            </div>

            {/* Atmosphere & Rocket Exploration */}
            <div className="space-y-2.5 text-xs bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
              <div>
                <span className="text-cyan-400 font-bold block mb-1 flex items-center gap-1.5 justify-end">
                  <span>الغلاف الجوي والبيئة:</span>
                  <Globe2 className="w-3.5 h-3.5" />
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed font-light">{selectedPlanet.atmosphere}</p>
              </div>

              <div className="border-t border-slate-800 pt-2">
                <span className="text-amber-400 font-bold block mb-1 flex items-center gap-1.5 justify-end">
                  <span>دور الصواريخ والاستكشاف البشري:</span>
                  <Zap className="w-3.5 h-3.5" />
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed font-light">
                  {selectedPlanet.explorationHistory.rocketryRole}
                </p>
              </div>
            </div>

            {/* Missions List */}
            <div className="mt-3.5 text-[11px] text-slate-400 flex flex-wrap gap-1.5 items-center justify-end">
              {selectedPlanet.explorationHistory.keyMissions.map((m, idx) => (
                <span
                  key={idx}
                  className="bg-slate-800/90 text-cyan-200 px-2.5 py-0.5 rounded-lg text-[10px] border border-cyan-500/20"
                >
                  {m}
                </span>
              ))}
              <span className="text-slate-500">:أبرز البعثات</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
