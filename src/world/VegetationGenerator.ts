import * as THREE from 'three';

export class VegetationGenerator {
  public group: THREE.Group;
  private foliageMaterials: THREE.MeshStandardMaterial[] = [];

  constructor(radius: number, density: number) {
    this.group = new THREE.Group();
    this.group.name = 'vegetation';

    this.generateTreesAndFoliage(radius, density);
  }

  private generateTreesAndFoliage(radius: number, density: number): void {
    const treeCount = Math.floor(180 * density);

    const trunkGeo = new THREE.CylinderGeometry(0.12, 0.2, 0.8, 5);
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x5c4033, flatShading: true });

    const foliageGeo = new THREE.ConeGeometry(0.8, 1.6, 5);

    // Seeded pseudo-random positioning across sphere surface
    for (let i = 0; i < treeCount; i++) {
      const phi = Math.acos(1 - 2 * ((i + 0.5) / treeCount));
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const norm = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      );

      const pos = norm.clone().multiplyScalar(radius);

      const tree = new THREE.Group();

      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.4;
      trunk.castShadow = true;
      tree.add(trunk);

      const folMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.33 + (i % 5) * 0.02, 0.7, 0.4),
        roughness: 0.8,
        flatShading: true
      });
      this.foliageMaterials.push(folMat);

      const foliage = new THREE.Mesh(foliageGeo, folMat);
      foliage.position.y = 1.3;
      foliage.castShadow = true;
      tree.add(foliage);

      // Random scale variation
      const s = 0.6 + (i % 7) * 0.1;
      tree.scale.set(s, s, s);

      // Orient tree to surface normal
      tree.position.copy(pos);
      const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), norm);
      tree.quaternion.copy(quat);

      this.group.add(tree);
    }
  }

  public updateSeasonalFoliage(foliageColor: THREE.Color, scaleY: number = 1.0): void {
    this.foliageMaterials.forEach((mat) => {
      mat.color.copy(foliageColor);
    });
    this.group.children.forEach((tree) => {
      tree.scale.y = tree.scale.x * scaleY;
    });
  }
}
