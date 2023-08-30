import * as THREE from "three";
import { SkeletonUtils } from "../../../utils/skeleton-utils";

export default class Body extends THREE.Object3D {
  constructor(armature) {
    super();
    this._armature = armature;
    this._initBodies();

    this.showBodyHarley();
  }

  _initBodies() {
    const bodies = this._bodies = SkeletonUtils.clone(THREE.Cache.get('assets').scene.children[0].children[0]);
    this.add(bodies);

    bodies.children.forEach(body => body.visible = false);

    this._bones = bodies.children.find(x => x.type === 'Bone');

    this._initBodyHarley();
  }

  _initBodyHarley() {
    this._bodyHarley = this._bodies.children.find(x => x.name === 'b_harley');

    this._bodyHarley.material = new THREE.MeshStandardMaterial({
      metalness: 0,
      roughness: 0.4,
      map: THREE.Cache.get('Harley_Body_D'),
      skinning: true
    });
    this._bodyHarley.frustumCulled = false;
  }

  showBodyHarley() {
    this._bodyHarley.visible = true;

    const baseScale = this._bodies.scale.x;
    const newScale = baseScale * 1;
    this._bodies.scale.set(newScale, newScale, newScale);

    this._bodies.position.y = -1.7;
  }

  get rig() {
    return this._bones;
  }
}