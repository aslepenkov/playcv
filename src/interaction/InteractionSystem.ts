import * as THREE from 'three';
import { POI } from '../data/types';
import { latLongToVector3 } from '../utils/spherical';

export interface NearbyPOIResult {
  poi: POI | null;
  distance: number;
}

export class InteractionSystem {
  public pois: POI[];
  public planetRadius: number;
  public interactionThreshold: number = 3.8; // Radius around POI for interaction hint

  constructor(pois: POI[], planetRadius: number) {
    this.pois = pois;
    this.planetRadius = planetRadius;
  }

  public getNearestPOI(playerPosition: THREE.Vector3): NearbyPOIResult {
    let nearest: POI | null = null;
    let minDistance = Infinity;

    for (const poi of this.pois) {
      const poiPos = latLongToVector3(poi.coordinates.latitude, poi.coordinates.longitude, this.planetRadius);
      const dist = playerPosition.distanceTo(poiPos);

      if (dist < minDistance) {
        minDistance = dist;
        nearest = poi;
      }
    }

    if (minDistance <= this.interactionThreshold && nearest) {
      return { poi: nearest, distance: minDistance };
    }

    return { poi: null, distance: minDistance };
  }
}
