import { WorldData } from './types';
import worldDataJson from './world.json';

export function loadWorldData(): WorldData {
  return worldDataJson as WorldData;
}
