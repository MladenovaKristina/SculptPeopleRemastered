import * as THREE from "three";
import { SkeletonUtils } from "../../../utils/skeleton-utils";

export default class Body extends THREE.Object3D {
  constructor(armature, stand) {
    super();
    this._armature = armature;
    this._stand = stand;
    this._initBodies();
    this.showBodyHarley();
  }

  _initBodies() {
    const bodies = this._bodies = this._armature;
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
      map: THREE.Cache.get('harleybody'),
      skinning: true
    });
    this._bodyHarley.frustumCulled = false;
  }

  showBodyHarley() {
    this._bodyHarley.visible = true;

  }

  get rig() {
    return this._bones;
  }
}