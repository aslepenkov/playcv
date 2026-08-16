import * as THREE from 'three';

/**
 * Creates low-poly spherical planet terrain mesh with subtle geometric details.
 */
export class TerrainGenerator {
  public mesh: THREE.Mesh;
  public material: THREE.MeshStandardMaterial;

  constructor(radius: number) {
    const geometry = new THREE.IcosahedronGeometry(radius, 5); // dense sphere for smooth deformation

    // Add subtle low-poly terrain displacement/noise
    const posAttribute = geometry.attributes.position;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < posAttribute.count; i++) {
      vertex.fromBufferAttribute(posAttribute, i);
      const norm = vertex.clone().normalize();

      // Simple deterministic low-frequency elevation sine waves
      const noise =
        Math.sin(norm.x * 12) * Math.cos(norm.y * 12) * 0.15 +
        Math.sin(norm.z * 18) * 0.1;

      vertex.add(norm.multiplyScalar(noise));
      posAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    geometry.computeVertexNormals();

    this.material = new THREE.MeshStandardMaterial({
      color: 0x4895ef,
      roughness: 0.8,
      metalness: 0.1,
      flatShading: true
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.name = 'planet_terrain';
    this.mesh.receiveShadow = true;
  }

  public updateSeasonalColor(baseColor: THREE.Color, snowFactor: number = 0): void {
    if (snowFactor > 0.1) {
      const snowColor = new THREE.Color(0xe0e6ed);
      this.material.color.copy(baseColor).lerp(snowColor, snowFactor * 0.7);
    } else {
      this.material.color.copy(baseColor);
    }
  }
}
