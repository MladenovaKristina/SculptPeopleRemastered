import * as THREE from "three";
import MovePair from "./move-pair";
import UTween from "../../../../utils/utween";
import { Ease } from "../../../../utils/black-engine.module";

export default class BodyMovement extends THREE.Object3D {
  constructor(rig, camera) {
    super();

    this._rig = rig;
    this._camera = camera;

    this._initMovePairs();
    this._initRaycaster();
  }

  _initMovePairs() {
    this._leftHandPair = new MovePair(
      this._rig.children.find(x => x.name === 'hand_l'),
      new THREE.Vector3(1, -1, 0),
      { min: -1, max: 0.5, start: -0.4, minAngle: -50 * Math.PI / 180, maxAngle: 60 * Math.PI / 180 },
      MovePair.DIRECTIONS.VERTICALs
    );
    this.add(this._leftHandPair);

    this._rightHandPair = new MovePair(
      this._rig.children.find(x => x.name === 'hand_r'),
      new THREE.Vector3(-1, -1, 0),
      { min: -1, max: 0.5, start: 0, minAngle: 60 * Math.PI / 180, maxAngle: -50 * Math.PI / 180 },
      MovePair.DIRECTIONS.VERTICALs
    );
    this.add(this._rightHandPair);

    this._leftLegPair = new MovePair(
      this._rig.children.find(x => x.name === 'leg_l'),
      new THREE.Vector3(1, -2, 0),
      { min: 0.1, max: 1, start: 0.3, minAngle: -5 * Math.PI / 180, maxAngle: 50 * Math.PI / 180 },
      MovePair.DIRECTIONS.HORIZONTAL
    );
    this.add(this._leftLegPair);

    this._rightLegPair = new MovePair(
      this._rig.children.find(x => x.name === 'leg_r'),
      new THREE.Vector3(1, -2, 0),
      { min: -1, max: 0, start: -0.4, minAngle: -50 * Math.PI / 180, maxAngle: 5 * Math.PI / 180 },
      MovePair.DIRECTIONS.HORIZONTAL
    );
    this.add(this._rightLegPair);

    this._handles = [
      this._leftHandPair.handle,
      this._rightHandPair.handle,
      this._leftLegPair.handle,
      this._rightLegPair.handle
    ];
  }

  _initRaycaster() {
    this._raycaster = new THREE.Raycaster();
    this._pointer = new THREE.Vector2();

    const geometry = new THREE.PlaneGeometry(10, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0 });
    const plane = this._raycastPlane = new THREE.Mesh(geometry, material);
    this.add(plane);
  }

  onDown(x, y) {
    this._pointer.x = (x / window.innerWidth) * 2 - 1;
    this._pointer.y = -(y / window.innerHeight) * 2 + 1;

    this._raycaster.setFromCamera(this._pointer, this._camera);

    const intersects = this._raycaster.intersectObjects(this._handles);
    if (intersects.length === 0) return null;

    if (this._hintTween) {
      this._hintTween.stop();
      this._hintTween = null;
    }

    this._pair = intersects[0].object.parent;
  }

  onMove(x, y) {
    if (this._pair) {
      this._pointer.x = (x / window.innerWidth) * 2 - 1;
      this._pointer.y = -(y / window.innerHeight) * 2 + 1;

      this._raycaster.setFromCamera(this._pointer, this._camera);

      const intersects = this._raycaster.intersectObjects([this._raycastPlane]);
      if (intersects.length === 0) return null;

      this._pair.move(intersects[0].point.x, intersects[0].point.y);
    }
  }

  onUp() {
    this._pair = null;
  }

  playHint() {
    const point = { y: -0.5 };
    this._hintTween = new UTween(point, { y: [0, -0.5] }, 1.5, { loop: true, ease: Ease.sinusoidalOut });

    this._hintTween.on('update', msg => {
      // console.log(point.y)
      this._leftHandPair.move(0, point.y);
    });
  }
}
