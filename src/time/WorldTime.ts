import { DayNightCycle } from './DayNightCycle';
import { SeasonCycle, SeasonState } from './SeasonCycle';

export class WorldTime {
  public dayNight: DayNightCycle;
  public seasons: SeasonCycle;

  constructor(dayLengthSeconds: number = 60, seasonLengthSeconds: number = 300) {
    this.dayNight = new DayNightCycle(dayLengthSeconds);
    this.seasons = new SeasonCycle(seasonLengthSeconds);
  }

  public update(delta: number, scene: any): SeasonState {
    this.dayNight.update(delta, scene);
    return this.seasons.getState(delta);
  }
}
