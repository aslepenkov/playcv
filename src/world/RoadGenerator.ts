import * as THREE from 'three';
import { POI } from '../data/types';
import { latLongToVector3 } from '../utils/spherical';

/**
 * Generates an interconnected spherical road & path network that connects POIs into a walkable miniature town grid.
 */
export class RoadGenerator {
  public group: THREE.Group;

  constructor(pois: POI[], radius: number) {
    this.group = new THREE.Group();
    this.group.name = 'road_network';

    this.generatePaths(pois, radius);
  }

  private generatePaths(pois: POI[], radius: number): void {
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x333533,
      roughness: 0.9,
      flatShading: true
    });

    // Create a connected loop connecting POIs sequentially + central cross roads
    const points: THREE.Vector3[] = pois.map((poi) =>
      latLongToVector3(poi.coordinates.latitude, poi.coordinates.longitude, radius + 0.02)
    );

    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      this.createArcRoad(p1, p2, radius, roadMat);

      // Connect every 2nd node across planet center to form dense town grid/blocks
      if (i % 2 === 0) {
        const pCross = points[(i + 3) % points.length];
        this.createArcRoad(p1, pCross, radius, roadMat);
      }
    }
  }

  private sphericalInterpolate(v1: THREE.Vector3, v2: THREE.Vector3, t: number): THREE.Vector3 {
    const q1 = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), v1.clone().normalize());
    const q2 = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), v2.clone().normalize());
    const q = new THREE.Quaternion().slerpQuaternions(q1, q2, t);
    return new THREE.Vector3(0, 1, 0).applyQuaternion(q);
  }

  private createArcRoad(p1: THREE.Vector3, p2: THREE.Vector3, radius: number, material: THREE.Material): void {
    const numSegments = 16;
    const roadWidth = 0.8;

    for (let i = 0; i < numSegments; i++) {
      const t1 = i / numSegments;
      const t2 = (i + 1) / numSegments;

      const seg1 = this.sphericalInterpolate(p1, p2, t1).multiplyScalar(radius + 0.03);
      const seg2 = this.sphericalInterpolate(p1, p2, t2).multiplyScalar(radius + 0.03);

      const center = new THREE.Vector3().addVectors(seg1, seg2).multiplyScalar(0.5);
      const up = center.clone().normalize();
      const dir = new THREE.Vector3().subVectors(seg2, seg1).normalize();
      const right = new THREE.Vector3().crossVectors(up, dir).normalize();

      const segLength = seg1.distanceTo(seg2);

      const tileGeo = new THREE.PlaneGeometry(roadWidth, segLength + 0.05);
      const tile = new THREE.Mesh(tileGeo, material);

      const matrix = new THREE.Matrix4().makeBasis(right, dir, up);
      tile.position.copy(center);
      tile.rotation.setFromRotationMatrix(matrix);
      tile.receiveShadow = true;

      this.group.add(tile);
    }
  }
}
