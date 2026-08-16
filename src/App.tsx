import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { loadWorldData } from './data/loader';
import { WorldGenerator } from './world/WorldGenerator';
import { Character } from './character/Character';
import { CharacterController } from './character/CharacterController';
import { ThirdPersonCamera } from './camera/ThirdPersonCamera';
import { WorldTime } from './time/WorldTime';
import { InteractionSystem } from './interaction/InteractionSystem';
import { POI } from './data/types';
import { HUD } from './ui/HUD';
import { InteractionHint } from './ui/InteractionHint';
import { POIPanel } from './ui/POIPanel';
import { Season } from './time/SeasonCycle';

export const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activePOI, setActivePOI] = useState<POI | null>(null);
  const [nearbyPOI, setNearbyPOI] = useState<POI | null>(null);
  const [currentSeason, setCurrentSeason] = useState<Season>('Spring');
  const [isNight, setIsNight] = useState<boolean>(false);

  const activePOIRef = useRef<POI | null>(null);
  activePOIRef.current = activePOI;

  const nearbyPOIRef = useRef<POI | null>(null);
  nearbyPOIRef.current = nearbyPOI;

  const controllerRef = useRef<CharacterController | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const worldData = loadWorldData();
    const planetRadius = worldData.config.planetRadius;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x70d6ff);
    scene.fog = new THREE.FogExp2(0x70d6ff, 0.012);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // Camera
    const cameraSystem = new ThirdPersonCamera(60, window.innerWidth / window.innerHeight);

    // World Generator
    const worldGen = new WorldGenerator(worldData);
    worldGen.addToScene(scene);

    // Character
    const character = new Character(planetRadius);
    scene.add(character.group);

    // Controller
    const controller = new CharacterController();
    controllerRef.current = controller;

    controller.onInteractCallback = () => {
      if (nearbyPOIRef.current) {
        setActivePOI(nearbyPOIRef.current);
      }
    };

    // Time & Environment
    const timeSystem = new WorldTime(worldData.config.dayLengthSeconds, worldData.config.seasonLengthSeconds);
    scene.add(timeSystem.dayNight.sunLight);
    scene.add(timeSystem.dayNight.ambientLight);

    // Interaction System
    const interactionSystem = new InteractionSystem(worldData.pois, planetRadius);

    // Resize Handler
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      cameraSystem.updateAspect(window.innerWidth / window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Clock & Game Loop
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.1);

      // Environment Cycle Updates
      const seasonState = timeSystem.update(delta, scene);
      setCurrentSeason(seasonState.currentSeason);
      setIsNight(timeSystem.dayNight.isNight);

      worldGen.terrain.updateSeasonalColor(seasonState.groundColor, seasonState.snowFactor);
      worldGen.vegetation.updateSeasonalFoliage(seasonState.foliageColor);
      worldGen.decorations.setNightLampsEmissive(timeSystem.dayNight.isNight);

      // Character Movement (freeze when POI modal is active)
      if (!activePOIRef.current) {
        const inputDir = controller.getMovementInput();
        const planetNormal = character.position.clone().normalize();
        const tangential = cameraSystem.getTangentialDirections(planetNormal);

        character.move(inputDir, tangential.right, tangential.forward, delta);
      }

      // Camera Follow
      cameraSystem.update(character.position, character.forward, delta);

      // Check POI Proximity
      const result = interactionSystem.getNearestPOI(character.position);
      setNearbyPOI(result.poi);

      // Render
      renderer.render(scene, cameraSystem.camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      controller.destroy();
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  const handleMobileMove = (dx: number, dy: number) => {
    if (controllerRef.current) {
      controllerRef.current.touchState.moveVector.set(dx, dy);
    }
  };

  const handleInteract = () => {
    if (nearbyPOI) {
      setActivePOI(nearbyPOI);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      <HUD
        season={currentSeason}
        isNight={isNight}
        onMobileMove={handleMobileMove}
        onMobileInteract={handleInteract}
        isNearPOI={!!nearbyPOI}
      />

      <InteractionHint
        poiTitle={nearbyPOI ? nearbyPOI.title : null}
        onInteract={handleInteract}
      />

      <POIPanel
        poi={activePOI}
        onClose={() => setActivePOI(null)}
      />
    </div>
  );
};
