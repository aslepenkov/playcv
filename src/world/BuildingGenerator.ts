import * as THREE from 'three';
import { VisualSpec } from '../data/types';

export class BuildingGenerator {
  /**
   * Generates low-poly procedural building mesh according to building type spec.
   */
  public static createBuildingMesh(spec: VisualSpec): THREE.Group {
    const buildingGroup = new THREE.Group();
    buildingGroup.name = `building_${spec.building}`;

    const mainColor = spec.color ? new THREE.Color(spec.color) : new THREE.Color(0xd8e2dc);
    const roofColor = spec.roofColor ? new THREE.Color(spec.roofColor) : new THREE.Color(0xe76f51);

    const wallMat = new THREE.MeshLambertMaterial({ color: mainColor, flatShading: true });
    const roofMat = new THREE.MeshLambertMaterial({ color: roofColor, flatShading: true });
    const doorMat = new THREE.MeshLambertMaterial({ color: 0x4a3b32, flatShading: true });
    const windowMat = new THREE.MeshLambertMaterial({ color: 0xffea00, flatShading: true });
    const frameMat = new THREE.MeshLambertMaterial({ color: 0x222222, flatShading: true });

    switch (spec.building) {
      case 'home': {
        // House base
        const bodyGeo = new THREE.BoxGeometry(1.6, 1.2, 1.6);
        const body = new THREE.Mesh(bodyGeo, wallMat);
        body.position.y = 0.6;
        body.castShadow = true;
        body.receiveShadow = true;
        buildingGroup.add(body);

        // Roof (Cone/Pyramid)
        const roofGeo = new THREE.ConeGeometry(1.3, 0.8, 4);
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.y = 1.6;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        buildingGroup.add(roof);

        // Door
        const doorGeo = new THREE.BoxGeometry(0.4, 0.7, 0.05);
        const door = new THREE.Mesh(doorGeo, doorMat);
        door.position.set(0, 0.35, 0.81);
        buildingGroup.add(door);
        break;
      }

      case 'school': {
        // School L-shape structure
        const b1Geo = new THREE.BoxGeometry(2.4, 1.4, 1.4);
        const b1 = new THREE.Mesh(b1Geo, wallMat);
        b1.position.y = 0.7;
        b1.castShadow = true;
        buildingGroup.add(b1);

        const b2Geo = new THREE.BoxGeometry(1.2, 1.2, 2.0);
        const b2 = new THREE.Mesh(b2Geo, wallMat);
        b2.position.set(0.6, 0.6, 0.4);
        b2.castShadow = true;
        buildingGroup.add(b2);

        // Slanted Roof
        const roofGeo = new THREE.BoxGeometry(2.5, 0.2, 1.5);
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.y = 1.5;
        buildingGroup.add(roof);

        // Windows grid
        for (let x = -0.8; x <= 0.8; x += 0.8) {
          const winGeo = new THREE.BoxGeometry(0.3, 0.4, 0.05);
          const win = new THREE.Mesh(winGeo, windowMat);
          win.position.set(x, 0.8, 0.71);
          buildingGroup.add(win);
        }
        break;
      }

      case 'university': {
        // University main hall + pillars + dome
        const mainGeo = new THREE.BoxGeometry(2.8, 1.8, 2.0);
        const main = new THREE.Mesh(mainGeo, wallMat);
        main.position.y = 0.9;
        main.castShadow = true;
        buildingGroup.add(main);

        // Pillars
        const pillarGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.6, 6);
        for (let px = -1.0; px <= 1.0; px += 0.6) {
          const pillar = new THREE.Mesh(pillarGeo, roofMat);
          pillar.position.set(px, 0.8, 1.05);
          pillar.castShadow = true;
          buildingGroup.add(pillar);
        }

        // Dome
        const domeGeo = new THREE.SphereGeometry(0.8, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const dome = new THREE.Mesh(domeGeo, roofMat);
        dome.position.y = 1.8;
        dome.castShadow = true;
        buildingGroup.add(dome);
        break;
      }

      case 'studio':
      case 'office': {
        // Modern multi-story office block
        const towerGeo = new THREE.BoxGeometry(2.0, 3.2, 2.0);
        const tower = new THREE.Mesh(towerGeo, wallMat);
        tower.position.y = 1.6;
        tower.castShadow = true;
        buildingGroup.add(tower);

        // Glass window rows
        for (let y = 0.8; y <= 2.8; y += 0.7) {
          for (let x = -0.6; x <= 0.6; x += 0.6) {
            const win = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.4, 0.05), windowMat);
            win.position.set(x, y, 1.01);
            buildingGroup.add(win);
          }
        }
        break;
      }

      case 'arcade': {
        // Neon retro arcade building
        const baseGeo = new THREE.BoxGeometry(2.2, 1.6, 2.2);
        const base = new THREE.Mesh(baseGeo, wallMat);
        base.position.y = 0.8;
        base.castShadow = true;
        buildingGroup.add(base);

        // Giant marquee top
        const marqueeGeo = new THREE.BoxGeometry(2.4, 0.6, 0.2);
        const marquee = new THREE.Mesh(marqueeGeo, roofMat);
        marquee.position.set(0, 1.8, 1.1);
        buildingGroup.add(marquee);
        break;
      }

      case 'park': {
        // Open park plaza with fountain or monument
        const baseGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.15, 8);
        const base = new THREE.Mesh(baseGeo, wallMat);
        base.position.y = 0.08;
        buildingGroup.add(base);

        // Central monument / sculpture
        const monGeo = new THREE.OctahedronGeometry(0.6);
        const mon = new THREE.Mesh(monGeo, roofMat);
        mon.position.y = 0.9;
        mon.castShadow = true;
        buildingGroup.add(mon);
        break;
      }

      default: {
        // Generic low-poly building block
        const blockGeo = new THREE.BoxGeometry(1.8, 1.5, 1.8);
        const block = new THREE.Mesh(blockGeo, wallMat);
        block.position.y = 0.75;
        block.castShadow = true;
        buildingGroup.add(block);
      }
    }

    // Optional sign/banner label board
    if (spec.sign) {
      const signBoardGeo = new THREE.BoxGeometry(1.2, 0.35, 0.1);
      const signBoard = new THREE.Mesh(signBoardGeo, frameMat);
      signBoard.position.set(0, 2.2, 0.9);
      buildingGroup.add(signBoard);
    }

    const scale = spec.scale ?? 1.0;
    buildingGroup.scale.set(scale, scale, scale);

    return buildingGroup;
  }
}
