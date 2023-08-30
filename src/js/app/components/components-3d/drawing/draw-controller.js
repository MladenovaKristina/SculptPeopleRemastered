import * as THREE from "three";
import { Ease, MessageDispatcher } from "../../../../utils/black-engine.module";


export default class DrawController {
  constructor(camera, plane, canvasDrawController, spray) {

    this.messageDispatcher = new MessageDispatcher();
    this.onMovedEvent = 'onMovedEvent';

    this._camera = camera;
    this._raycasterPlane = plane;
    this._canvasDrawController = canvasDrawController;
    this._spray = spray;

    this._initRaycaster();
  }

  _initRaycaster() {
    this._raycaster = new THREE.Raycaster();
    this._pointer = new THREE.Vector2();
  }

  onDown(x, y) {
    this._isDown = true;

    this._pointer.x = (x / window.innerWidth) * 2 - 1;
    this._pointer.y = -(y / window.innerHeight) * 2 + 1;

    const point = this.onRaycast();
    point && this._canvasDrawController.onDown(point.x, point.y);
  }

  onMove(x, y) {
    if (!this._isDown) return;

    this._pointer.x = (x / window.innerWidth) * 2 - 1;
    this._pointer.y = -(y / window.innerHeight) * 2 + 1;

    const point = this.onRaycast();
    point && this._canvasDrawController.onMove(point.x, point.y);
  }

  onRaycast() {
    this._raycaster.setFromCamera(this._pointer, this._camera);

    const intersects = this._raycaster.intersectObjects([this._raycasterPlane]);
    if (intersects.length === 0) return null;

    const aimPoint = new THREE.Vector3(
      intersects[0].point.x * 1,
      -intersects[0].point.y * 0.8 + 0.05,
      intersects[0].point.z
    );

    this._spray.position.set(
      intersects[0].point.x + 0.05,
      intersects[0].point.y - 0.05,
      this._spray.position.z
    );

    this.messageDispatcher.post(this.onMovedEvent, aimPoint);

    return this._getPointForCanvas(aimPoint);
  }

  _getPointForCanvas(point) {
    let newPoint = {
      x: point.x * 2,
      y: -(point.y - 0) * 2
    };

    return newPoint;
  }

  onUp() {
    if (!this._isDown) return;
    this._isDown = false;
    this._canvasDrawController.onUp();
  }
}
