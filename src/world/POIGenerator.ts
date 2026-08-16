import * as THREE from 'three';
import { POI } from '../data/types';
import { latLongToVector3 } from '../utils/spherical';
import { BuildingGenerator } from './BuildingGenerator';

export class POIGenerator {
  public group: THREE.Group;
  public poiObjects: Map<string, THREE.Group> = new Map();

  constructor(pois: POI[], radius: number) {
    this.group = new THREE.Group();
    this.group.name = 'poi_objects';

    this.generatePOIs(pois, radius);
  }

  private generatePOIs(pois: POI[], radius: number): void {
    pois.forEach((poi) => {
      const poiGroup = new THREE.Group();
      poiGroup.name = `poi_${poi.id}`;
      poiGroup.userData = { poi };

      const pos = latLongToVector3(poi.coordinates.latitude, poi.coordinates.longitude, radius);
      const up = pos.clone().normalize();

      // Create building mesh from visual spec
      const buildingMesh = BuildingGenerator.createBuildingMesh(poi.visual);
      poiGroup.add(buildingMesh);

      // Create glowing interaction base ring marker
      const ringGeo = new THREE.RingGeometry(1.2, 1.5, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: poi.visual.color ? new THREE.Color(poi.visual.color) : 0xffd166,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.05;
      poiGroup.add(ring);

      // Orient POI group to surface normal
      poiGroup.position.copy(pos);
      const orientation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), up);
      poiGroup.quaternion.copy(orientation);

      this.group.add(poiGroup);
      this.poiObjects.set(poi.id, poiGroup);
    });
  }
}
