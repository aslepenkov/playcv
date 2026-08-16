import * as THREE from 'three';

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

export interface SeasonState {
  currentSeason: Season;
  progress: number; // 0 to 1 progress within current 5-minute season
  groundColor: THREE.Color;
  foliageColor: THREE.Color;
  snowFactor: number;
  fogColor: THREE.Color;
}

/**
 * Four-season cycle system.
 * Each season lasts 5 minutes (300 seconds). Full 4-season cycle = 20 minutes (1200 seconds).
 */
export class SeasonCycle {
  public seasonLengthSeconds: number; // 300s per season
  public elapsedTime: number = 0;

  constructor(seasonLengthSeconds: number = 300) {
    this.seasonLengthSeconds = seasonLengthSeconds;
  }

  public getState(delta: number): SeasonState {
    this.elapsedTime += delta;
    const totalCycle = this.seasonLengthSeconds * 4; // 1200s
    const cycleTime = this.elapsedTime % totalCycle;

    const seasonIndex = Math.floor(cycleTime / this.seasonLengthSeconds); // 0: Spring, 1: Summer, 2: Autumn, 3: Winter
    const progress = (cycleTime % this.seasonLengthSeconds) / this.seasonLengthSeconds;

    const springGround = new THREE.Color(0x52b788);
    const summerGround = new THREE.Color(0x2d6a4f);
    const autumnGround = new THREE.Color(0xd97706);
    const winterGround = new THREE.Color(0x94a3b8);

    const springFoliage = new THREE.Color(0x74c69d);
    const summerFoliage = new THREE.Color(0x1b4332);
    const autumnFoliage = new THREE.Color(0xe63946);
    const winterFoliage = new THREE.Color(0xe2e8f0);

    let currentSeason: Season = 'Spring';
    let groundColor = new THREE.Color();
    let foliageColor = new THREE.Color();
    let snowFactor = 0;
    let fogColor = new THREE.Color(0xcccccc);

    if (seasonIndex === 0) {
      currentSeason = 'Spring';
      groundColor.lerpColors(winterGround, springGround, progress);
      foliageColor.lerpColors(winterFoliage, springFoliage, progress);
      snowFactor = 1.0 - progress;
    } else if (seasonIndex === 1) {
      currentSeason = 'Summer';
      groundColor.lerpColors(springGround, summerGround, progress);
      foliageColor.lerpColors(springFoliage, summerFoliage, progress);
      snowFactor = 0;
    } else if (seasonIndex === 2) {
      currentSeason = 'Autumn';
      groundColor.lerpColors(summerGround, autumnGround, progress);
      foliageColor.lerpColors(summerFoliage, autumnFoliage, progress);
      snowFactor = 0;
    } else {
      currentSeason = 'Winter';
      groundColor.lerpColors(autumnGround, winterGround, progress);
      foliageColor.lerpColors(autumnFoliage, winterFoliage, progress);
      snowFactor = progress;
    }

    return {
      currentSeason,
      progress,
      groundColor,
      foliageColor,
      snowFactor,
      fogColor
    };
  }
}
