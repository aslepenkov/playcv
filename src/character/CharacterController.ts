import * as THREE from 'three';

export interface TouchState {
  moveVector: THREE.Vector2;
  interactPressed: boolean;
}

export class CharacterController {
  private keysPressed: Record<string, boolean> = {};
  public touchState: TouchState = {
    moveVector: new THREE.Vector2(),
    interactPressed: false
  };
  public onInteractCallback?: () => void;

  constructor() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  private handleKeyDown(e: KeyboardEvent): void {
    this.keysPressed[e.key.toLowerCase()] = true;
    this.keysPressed[e.code] = true;

    if (e.key === 'Enter' || e.code === 'Space') {
      if (this.onInteractCallback) {
        this.onInteractCallback();
      }
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    this.keysPressed[e.key.toLowerCase()] = false;
    this.keysPressed[e.code] = false;
  }

  /**
   * Retrieves current movement vector combining keyboard and touch input.
   */
  public getMovementInput(): THREE.Vector2 {
    const input = new THREE.Vector2(0, 0);

    if (this.keysPressed['arrowleft'] || this.keysPressed['a'] || this.keysPressed['keya']) {
      input.x -= 1;
    }
    if (this.keysPressed['arrowright'] || this.keysPressed['d'] || this.keysPressed['keyd']) {
      input.x += 1;
    }
    if (this.keysPressed['arrowup'] || this.keysPressed['w'] || this.keysPressed['keyw']) {
      input.y += 1;
    }
    if (this.keysPressed['arrowdown'] || this.keysPressed['s'] || this.keysPressed['keys']) {
      input.y -= 1;
    }

    if (this.touchState.moveVector.lengthSq() > 0.01) {
      input.add(this.touchState.moveVector);
    }

    if (input.lengthSq() > 1) {
      input.normalize();
    }

    return input;
  }

  public destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
  }
}
