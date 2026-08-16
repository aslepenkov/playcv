import * as THREE from 'three';
import { Coordinates } from '../data/types';

/**
 * Converts latitude and longitude (in degrees) to a 3D position vector on a sphere of given radius.
 */
export function latLongToVector3(lat: number, lon: number, radius: number, target = new THREE.Vector3()): THREE.Vector3 {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 90);

  target.x = -(radius * Math.sin(phi) * Math.cos(theta));
  target.y = radius * Math.cos(phi);
  target.z = radius * Math.sin(phi) * Math.sin(theta);

  return target;
}

/**
 * Converts a 3D point on a sphere to latitude and longitude coordinates.
 */
export function vector3ToLatLong(pos: THREE.Vector3): Coordinates {
  const norm = pos.clone().normalize();
  const lat = 90 - THREE.MathUtils.radToDeg(Math.acos(norm.y));
  const lon = THREE.MathUtils.radToDeg(Math.atan2(norm.z, -norm.x)) - 90;
  return { latitude: lat, longitude: lon };
}

/**
 * Calculates local tangent basis vectors (Up, East/Right, North/Forward) on a sphere at a given position.
 */
export function getSphericalBasis(pos: THREE.Vector3): { up: THREE.Vector3; east: THREE.Vector3; north: THREE.Vector3 } {
  const up = pos.clone().normalize();

  // Choose reference vector to compute tangent basis
  let ref = new THREE.Vector3(0, 1, 0);
  if (Math.abs(up.dot(ref)) > 0.99) {
    ref.set(0, 0, 1);
  }

  const east = new THREE.Vector3().crossVectors(ref, up).normalize();
  const north = new THREE.Vector3().crossVectors(up, east).normalize();

  return { up, east, north };
}

/**
 * Geodesic distance between two lat/long points on sphere of given radius.
 */
export function geodesicDistance(c1: Coordinates, c2: Coordinates, radius: number): number {
  const v1 = latLongToVector3(c1.latitude, c1.longitude, radius);
  const v2 = latLongToVector3(c2.latitude, c2.longitude, radius);
  const angle = v1.angleTo(v2);
  return angle * radius;
}
