import * as THREE from 'three';
import { WorldData } from '../data/types';
import { TerrainGenerator } from './TerrainGenerator';
import { RoadGenerator } from './RoadGenerator';
import { POIGenerator } from './POIGenerator';
import { VegetationGenerator } from './VegetationGenerator';
import { DecorationGenerator } from './DecorationGenerator';

export class WorldGenerator {
  public terrain: TerrainGenerator;
  public roads: RoadGenerator;
  public pois: POIGenerator;
  public vegetation: VegetationGenerator;
  public decorations: DecorationGenerator;

  constructor(worldData: WorldData) {
    const radius = worldData.config.planetRadius;
    const density = worldData.config.density;

    this.terrain = new TerrainGenerator(radius);
    this.roads = new RoadGenerator(worldData.pois, radius);
    this.pois = new POIGenerator(worldData.pois, radius);
    this.vegetation = new VegetationGenerator(radius, density);
    this.decorations = new DecorationGenerator(radius, density);
  }

  public addToScene(scene: THREE.Scene): void {
    scene.add(this.terrain.mesh);
    scene.add(this.roads.group);
    scene.add(this.pois.group);
    scene.add(this.vegetation.group);
    scene.add(this.decorations.group);
  }
}
