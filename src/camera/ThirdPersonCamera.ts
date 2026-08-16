import * as THREE from 'three';

export class ThirdPersonCamera {
  public camera: THREE.PerspectiveCamera;
  public distance: number = 10;
  public height: number = 6;
  public pitchAngle: number = 0.4; // pitch down angle
  private currentCameraPos: THREE.Vector3 = new THREE.Vector3();

  constructor(fov: number = 60, aspect: number = 16 / 9) {
    this.camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
    this.camera.up.set(0, 1, 0);
  }

  public updateAspect(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  /**
   * Updates camera position and orientation relative to character position on spherical world.
   */
  public update(targetPos: THREE.Vector3, targetForward: THREE.Vector3, delta: number): void {
    const up = targetPos.clone().normalize();

    // Compute surface relative forward and right basis vectors
    const right = new THREE.Vector3().crossVectors(up, targetForward).normalize();
    if (right.lengthSq() < 0.001) {
      right.crossVectors(up, new THREE.Vector3(1, 0, 0)).normalize();
    }
    const forward = new THREE.Vector3().crossVectors(right, up).normalize();

    // Target ideal camera position behind and above character relative to surface normal
    const idealOffset = forward.clone().multiplyScalar(-this.distance).add(up.clone().multiplyScalar(this.height));
    const idealCameraPos = targetPos.clone().add(idealOffset);

    // Smoothly interpolate current camera position
    if (this.currentCameraPos.lengthSq() < 0.001) {
      this.currentCameraPos.copy(idealCameraPos);
    } else {
      const lerpFactor = 1.0 - Math.exp(-8 * delta);
      this.currentCameraPos.lerp(idealCameraPos, lerpFactor);
    }

    this.camera.position.copy(this.currentCameraPos);

    // Orient camera to look at target position elevated slightly above ground
    const lookAtPoint = targetPos.clone().add(up.clone().multiplyScalar(1.2));
    this.camera.up.copy(up);
    this.camera.lookAt(lookAtPoint);
  }

  /**
   * Returns tangent frame camera direction vectors projected on local planet surface for character movement calculations.
   */
  public getTangentialDirections(planetNormal: THREE.Vector3): { forward: THREE.Vector3; right: THREE.Vector3 } {
    const camDir = new THREE.Vector3();
    this.camera.getWorldDirection(camDir);

    // Project camera direction onto planet tangent plane
    const forward = camDir.clone().sub(planetNormal.clone().multiplyScalar(camDir.dot(planetNormal))).normalize();
    const right = new THREE.Vector3().crossVectors(forward, planetNormal).normalize();

    return { forward, right };
  }
}
