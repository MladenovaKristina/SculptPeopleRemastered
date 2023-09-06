import * as THREE from "three";
import Helpers from "../../../helpers/helpers";
import UTween from "../../../../utils/utween";

export default class MovePair extends THREE.Object3D {
  constructor(bone, position, clamp, direction) {
    super();

    this._bone = bone;
    this._position = position;
    this._clamp = clamp;
    this._direction = direction;

    this._dt = 0;

    this._initHandle();

    if (this._direction === MovePair.DIRECTIONS.HORIZONTAL) {
      this._handle.position.x = this._clamp.start;
    }
    else {
      this._handle.position.y = this._clamp.start;
    }

    this.onUpdate();
  }

  _initHandle() {
    this._handle = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xeeeeee, depthTest: false, depthWrite: false })
    );
    this._handle.position.copy(this._position);
    this.add(this._handle);
  }

  move(x, y) {
    if (this._direction === MovePair.DIRECTIONS.HORIZONTAL) {
      this._handle.position.x = Helpers.clamp(x, this._clamp.min, this._clamp.max);
    }
    else {
      this._handle.position.y = Helpers.clamp(y, this._clamp.min, this._clamp.max);
    }

    this.onUpdate();
  }

  onUpdate() {
    if (this._direction === MovePair.DIRECTIONS.HORIZONTAL) {
      const diff = Math.abs((this._handle.position.x - this._clamp.min) / (this._clamp.max - this._clamp.min));
      this._bone.rotation.z = this._clamp.minAngle + (this._clamp.maxAngle - this._clamp.minAngle) * diff;
    }
    else {
      const diff = Math.abs((this._handle.position.y - this._clamp.min) / (this._clamp.max - this._clamp.min));
      this._bone.rotation.z = this._clamp.minAngle + (this._clamp.maxAngle - this._clamp.minAngle) * diff;
    }
  }

  get handle() {
    return this._handle;
  }
}

MovePair.DIRECTIONS = {
  HORIZONTAL: 0,
  VERTICAL: 1
};