import * as THREE from "three";
import Helpers from "../../helpers/helpers";
import UTween from "../../../utils/utween";
import { Ease } from "../../../utils/black-engine.module";

export default class CameraController {
  constructor(camera) {
    this._camera = camera;

    this._state = STATES.CLAY;


    this._clayPosition = new THREE.Vector3(0, 0, 0);
    this._clayRotationX = -0.14;

    this._headPosition = new THREE.Vector3(0, 0, 0);
    this._headRotationX = 0.1418;

    this._bodyPosition = new THREE.Vector3(0, 0, 0);
    this._bodyRotationX = 0;

    this._updatePositions();
    this._updateTransform();
  }

  onResize() {
    this._updatePositions();
    this._updateTransform();

    // this._camera.lookAt(0, 0.1, 0);
    // console.log(this._camera.rotation)
  }

  _updateTransform() {
    const position = this._getPosition();
    this._camera.position.copy(position);

    this._camera.rotation.x = this._getRotationX();
  }

  _updatePositions() {
    if (Helpers.LP(false, true)) {
      this._clayPosition = new THREE.Vector3(0.5, 0, 0.7);

      this._headPosition = new THREE.Vector3(0, -0.1, 1);
      this._bodyPosition = new THREE.Vector3(0, -0.5, 2.4);
    }
    else {
      this._clayPosition = new THREE.Vector3(0.3, 0, 1);

      this._headPosition = new THREE.Vector3(0, 0, 1);
      this._bodyPosition = new THREE.Vector3(0, 0, 2);
    }
  }

  _getPosition() {
    if (this._state === STATES.HEAD) {
      return this._headPosition;
    } if (this._state === STATES.CLAY) {
      return this._clayPosition;
    }
    else {
      return this._bodyPosition;
    }
  }

  _getRotationX() {
    if (this._state === STATES.HEAD) {
      return this._headRotationX;
    } if (this._state === STATES.CLAY) {
      return this._clayRotationX;
    }
    else {
      return this._bodyRotationX;
    }
  }

  switchToBody() {
    if (this._state === STATES.BODY) return;
    this._state = STATES.BODY;

    const position = this._getPosition();
    const rotationX = this._getRotationX();

    new UTween(this._camera.position, {
      x: position.x,
      y: position.y,
      z: position.z
    }, 0.8, { ease: Ease.sinusoidalOut });

    new UTween(this._camera.rotation, {
      x: rotationX
    }, 1, { ease: Ease.sinusoidalOut });
  }


  switchToHead(callback) {
    if (this._state === STATES.HEAD) return;
    this._state = STATES.HEAD;

    const position = this._getPosition();
    const rotationX = this._getRotationX();

    new UTween(this._camera.position, {
      x: position.x,
      y: position.y,
      z: position.z
    }, 0.4, { ease: Ease.sinusoidalOut });

    new UTween(this._camera.rotation, {
      x: rotationX
    }, 0.4, { ease: Ease.sinusoidalOut });
  }

  get camera() {
    return this._camera;
  }
}

const STATES = {
  CLAY: 0,
  HEAD: 1,
  BODY: 2
};