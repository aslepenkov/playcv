import * as THREE from 'three';
import { latLongToVector3 } from '../utils/spherical';

export interface CharacterConfig {
  bodyColor?: number;
  shirtColor?: number;
  pantsColor?: number;
}

/**
 * Creates a low-poly character mesh group.
 * Designed to be modular and easy to swap/replace with GLTF or custom models.
 */
export function createLowPolyCharacterMesh(config: CharacterConfig = {}): THREE.Group {
  const characterGroup = new THREE.Group();
  characterGroup.name = 'player_character_mesh';

  const bodyMat = new THREE.MeshLambertMaterial({
    color: config.shirtColor ?? 0x2a9d8f,
    flatShading: true
  });
  const pantsMat = new THREE.MeshLambertMaterial({
    color: config.pantsColor ?? 0x264653,
    flatShading: true
  });
  const skinMat = new THREE.MeshLambertMaterial({
    color: config.bodyColor ?? 0xe9c46a,
    flatShading: true
  });
  const shoeMat = new THREE.MeshLambertMaterial({
    color: 0x1d3557,
    flatShading: true
  });

  // Torso
  const torsoGeo = new THREE.BoxGeometry(0.5, 0.6, 0.3);
  const torso = new THREE.Mesh(torsoGeo, bodyMat);
  torso.position.y = 0.8;
  torso.castShadow = true;
  characterGroup.add(torso);

  // Head
  const headGeo = new THREE.BoxGeometry(0.35, 0.35, 0.35);
  const head = new THREE.Mesh(headGeo, skinMat);
  head.position.y = 1.35;
  head.castShadow = true;
  characterGroup.add(head);

  // Eyes (Retro visual cue for facing direction)
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const eyeGeo = new THREE.BoxGeometry(0.06, 0.06, 0.02);
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(-0.09, 1.38, 0.18);
  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeR.position.set(0.09, 1.38, 0.18);
  characterGroup.add(eyeL, eyeR);

  // Left Leg
  const legGeo = new THREE.BoxGeometry(0.2, 0.5, 0.2);
  const legL = new THREE.Mesh(legGeo, pantsMat);
  legL.name = 'leg_l';
  legL.position.set(-0.14, 0.25, 0);
  legL.castShadow = true;
  characterGroup.add(legL);

  // Right Leg
  const legR = new THREE.Mesh(legGeo, pantsMat);
  legR.name = 'leg_r';
  legR.position.set(0.14, 0.25, 0);
  legR.castShadow = true;
  characterGroup.add(legR);

  // Left Arm
  const armGeo = new THREE.BoxGeometry(0.15, 0.5, 0.15);
  const armL = new THREE.Mesh(armGeo, bodyMat);
  armL.name = 'arm_l';
  armL.position.set(-0.35, 0.75, 0);
  armL.castShadow = true;
  characterGroup.add(armL);

  // Right Arm
  const armR = new THREE.Mesh(armGeo, bodyMat);
  armR.name = 'arm_r';
  armR.position.set(0.35, 0.75, 0);
  armR.castShadow = true;
  characterGroup.add(armR);

  // Shoes
  const shoeGeo = new THREE.BoxGeometry(0.22, 0.12, 0.28);
  const shoeL = new THREE.Mesh(shoeGeo, shoeMat);
  shoeL.position.set(-0.14, 0.06, 0.03);
  const shoeR = new THREE.Mesh(shoeGeo, shoeMat);
  shoeR.position.set(0.14, 0.06, 0.03);
  characterGroup.add(shoeL, shoeR);

  return characterGroup;
}

export class Character {
  public group: THREE.Group;
  public meshGroup: THREE.Group;
  public position: THREE.Vector3;
  public forward: THREE.Vector3;
  public planetRadius: number;
  public speed: number = 7.0;
  public isMoving: boolean = false;
  private animTime: number = 0;

  constructor(planetRadius: number) {
    this.planetRadius = planetRadius;
    this.group = new THREE.Group();
    this.group.name = 'player_character';

    this.meshGroup = createLowPolyCharacterMesh();
    this.group.add(this.meshGroup);

    // Initial position slightly offset near Hometown POI (lat 0, lon 2)
    this.position = latLongToVector3(0, 2, planetRadius);
    this.forward = new THREE.Vector3(0, 0, 1);
    this.updateTransform();
  }

  /**
   * Replaces character visual model with custom group or model.
   */
  public setCustomMesh(newMesh: THREE.Group): void {
    this.group.remove(this.meshGroup);
    this.meshGroup = newMesh;
    this.group.add(this.meshGroup);
  }

  /**
   * Updates character position across spherical planet based on movement vector (dx, dz) in local screen/camera relative frame.
   */
  public move(inputDir: THREE.Vector2, cameraRight: THREE.Vector3, cameraForward: THREE.Vector3, delta: number): void {
    if (inputDir.lengthSq() < 0.001) {
      this.isMoving = false;
      this.animateIdle(delta);
      return;
    }

    this.isMoving = true;
    inputDir.normalize();

    const up = this.position.clone().normalize();

    // Compute movement direction vector aligned with camera frame on tangent plane
    const moveDir = new THREE.Vector3()
      .addScaledVector(cameraRight, inputDir.x)
      .addScaledVector(cameraForward, -inputDir.y);

    // Project moveDir onto local planet tangent plane
    moveDir.sub(up.clone().multiplyScalar(moveDir.dot(up))).normalize();

    if (moveDir.lengthSq() < 0.001) return;

    // Travel distance along curved surface arc
    const distance = this.speed * delta;
    const angle = distance / this.planetRadius;

    // Rotation axis perpendicular to movement and local surface normal
    const rotationAxis = new THREE.Vector3().crossVectors(up, moveDir).normalize();
    const rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(rotationAxis, angle);

    // Rotate position vector around sphere center
    this.position.applyQuaternion(rotationQuaternion);

    // Update facing direction
    this.forward.copy(moveDir);

    this.updateTransform();
    this.animateWalk(delta);
  }

  /**
   * Aligns character root object to surface normal and points mesh towards facing forward vector.
   */
  public updateTransform(): void {
    this.group.position.copy(this.position);

    const up = this.position.clone().normalize();

    // Compute surface-aligned facing matrix
    const right = new THREE.Vector3().crossVectors(up, this.forward).normalize();
    if (right.lengthSq() < 0.001) {
      // Fallback right vector if forward is collinear with up
      right.crossVectors(up, new THREE.Vector3(1, 0, 0)).normalize();
    }
    const realForward = new THREE.Vector3().crossVectors(right, up).normalize();

    const matrix = new THREE.Matrix4().makeBasis(right, up, realForward);
    this.group.rotation.setFromRotationMatrix(matrix);
  }

  private animateWalk(delta: number): void {
    this.animTime += delta * 12;
    const legL = this.meshGroup.getObjectByName('leg_l');
    const legR = this.meshGroup.getObjectByName('leg_r');
    const armL = this.meshGroup.getObjectByName('arm_l');
    const armR = this.meshGroup.getObjectByName('arm_r');

    const swing = Math.sin(this.animTime) * 0.4;

    if (legL) legL.rotation.x = swing;
    if (legR) legR.rotation.x = -swing;
    if (armL) armL.rotation.x = -swing;
    if (armR) armR.rotation.x = swing;
  }

  private animateIdle(delta: number): void {
    this.animTime += delta * 2;
    const legL = this.meshGroup.getObjectByName('leg_l');
    const legR = this.meshGroup.getObjectByName('leg_r');
    const armL = this.meshGroup.getObjectByName('arm_l');
    const armR = this.meshGroup.getObjectByName('arm_r');

    if (legL) legL.rotation.x = THREE.MathUtils.lerp(legL.rotation.x, 0, 0.1);
    if (legR) legR.rotation.x = THREE.MathUtils.lerp(legR.rotation.x, 0, 0.1);
    if (armL) armL.rotation.x = THREE.MathUtils.lerp(armL.rotation.x, 0, 0.1);
    if (armR) armR.rotation.x = THREE.MathUtils.lerp(armR.rotation.x, 0, 0.1);

    this.meshGroup.position.y = Math.sin(this.animTime) * 0.03;
  }
}
