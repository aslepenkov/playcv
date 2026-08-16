import * as THREE from 'three';

export class DecorationGenerator {
  public group: THREE.Group;
  public nightLamps: THREE.MeshBasicMaterial[] = [];

  constructor(radius: number, density: number) {
    this.group = new THREE.Group();
    this.group.name = 'decorations';

    this.generateProps(radius, density);
  }

  private generateProps(radius: number, density: number): void {
    const propCount = Math.floor(120 * density);

    const postGeo = new THREE.CylinderGeometry(0.04, 0.05, 1.2, 5);
    const postMat = new THREE.MeshLambertMaterial({ color: 0x222222, flatShading: true });

    const bulbGeo = new THREE.SphereGeometry(0.12, 6, 6);

    for (let i = 0; i < propCount; i++) {
      const phi = Math.acos(1 - 2 * ((i + 0.3) / propCount));
      const theta = Math.PI * (1 + Math.sqrt(3)) * i;

      const norm = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      );

      const pos = norm.clone().multiplyScalar(radius);

      const prop = new THREE.Group();

      if (i % 2 === 0) {
        // Street Lamppost
        const post = new THREE.Mesh(postGeo, postMat);
        post.position.y = 0.6;
        post.castShadow = true;
        prop.add(post);

        const lampMat = new THREE.MeshBasicMaterial({ color: 0xffea00 });
        this.nightLamps.push(lampMat);

        const bulb = new THREE.Mesh(bulbGeo, lampMat);
        bulb.position.y = 1.2;
        prop.add(bulb);
      } else {
        // Decorative Rock/Bench
        const rockGeo = new THREE.DodecahedronGeometry(0.3);
        const rockMat = new THREE.MeshLambertMaterial({ color: 0x777777, flatShading: true });
        const rock = new THREE.Mesh(rockGeo, rockMat);
        rock.position.y = 0.15;
        rock.castShadow = true;
        prop.add(rock);
      }

      prop.position.copy(pos);
      const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), norm);
      prop.quaternion.copy(quat);

      this.group.add(prop);
    }
  }

  public setNightLampsEmissive(isNight: boolean): void {
    const lampColor = isNight ? 0xffea00 : 0x555544;
    this.nightLamps.forEach((mat) => {
      mat.color.setHex(lampColor);
    });
  }
}
