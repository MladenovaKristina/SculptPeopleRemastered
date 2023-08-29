import * as THREE from "three";
import Helpers from "../../helpers/helpers";

export default class CameraController {
  constructor(camera) {
    this._camera = camera;

    this._playerPosition = new THREE.Vector3(0, 0, 0);
    this._position = new THREE.Vector3(0, 0, 0);

    this._updatePositions();
    this._updateTransform();
  }

  onResize() {
    this._updatePositions();
    this._updateTransform();

    this._camera.lookAt(this._camera.position);
  }

  _updateTransform() {
    const position = this._getPosition();
    this._camera.position.copy(position);
  }

  _updatePositions() {
    if (Helpers.LP(false, true)) {
      this._position = new THREE.Vector3(0, 0, 1);

    }
    else {
      this._position = new THREE.Vector3(0, 0.1, 1);
    }

  }

  _getPosition() {
    return this._position;
  }
}
