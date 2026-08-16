import * as THREE from 'three';

/**
 * Continuous accelerated day/night cycle system.
 * Exactly 1 real minute = 1 full in-game day (60 seconds).
 */
export class DayNightCycle {
  public sunLight: THREE.DirectionalLight;
  public ambientLight: THREE.AmbientLight;
  public dayLengthSeconds: number;
  public elapsedTime: number = 0;
  public isNight: boolean = false;

  constructor(dayLengthSeconds: number = 60) {
    this.dayLengthSeconds = dayLengthSeconds;

    this.sunLight = new THREE.DirectionalLight(0xfffaed, 1.4);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.sunLight.shadow.bias = -0.0005;

    this.ambientLight = new THREE.AmbientLight(0xddeeff, 0.4);
  }

  public update(delta: number, scene: THREE.Scene): void {
    this.elapsedTime += delta;
    const dayProgress = (this.elapsedTime % this.dayLengthSeconds) / this.dayLengthSeconds;

    // Angle from 0 to 2*PI over 1 minute
    const angle = dayProgress * Math.PI * 2;

    // Rotate sun around planet center
    const sunDistance = 100;
    this.sunLight.position.x = Math.cos(angle) * sunDistance;
    this.sunLight.position.y = Math.sin(angle) * sunDistance;
    this.sunLight.position.z = Math.sin(angle * 0.5) * 30;

    const sunHeight = this.sunLight.position.y / sunDistance; // -1 to 1

    this.isNight = sunHeight < -0.1;

    if (sunHeight > 0.2) {
      // Full Day
      this.sunLight.intensity = 1.4;
      this.sunLight.color.setHex(0xffffff);
      this.ambientLight.intensity = 0.5;
      this.ambientLight.color.setHex(0xddeeff);
      scene.background = new THREE.Color(0x70d6ff);
    } else if (sunHeight >= -0.2 && sunHeight <= 0.2) {
      // Sunrise / Sunset transition
      const t = (sunHeight + 0.2) / 0.4; // 0 to 1
      this.sunLight.intensity = THREE.MathUtils.lerp(0.2, 1.4, t);
      this.sunLight.color.lerpColors(new THREE.Color(0xff7b00), new THREE.Color(0xffffff), t);
      this.ambientLight.intensity = THREE.MathUtils.lerp(0.15, 0.5, t);
      scene.background = new THREE.Color().lerpColors(new THREE.Color(0x2b1e3a), new THREE.Color(0x70d6ff), t);
    } else {
      // Full Night
      this.sunLight.intensity = 0.15;
      this.sunLight.color.setHex(0x3a0ca3);
      this.ambientLight.intensity = 0.15;
      this.ambientLight.color.setHex(0x101030);
      scene.background = new THREE.Color(0x050515);
    }
  }
}
