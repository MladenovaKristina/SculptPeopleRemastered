import * as THREE from "three";
import UTween from "../../../../utils/utween";

export default class Spray extends THREE.Object3D {
  constructor() {
    super();

    this.visible = false;
    this._initView();
  }

  _initView() {
    this._view = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.1, 0.05),
      new THREE.MeshBasicMaterial({
        color: 0xff0000
      })
    );
    this.add(this._view);
  }

  setColor(color) {
    this.position.set(0, 0, 0.2);
    this._view.material.color = new THREE.Color(color);
  }

  show() {
    this.visible = true;
    this.position.set(1.5, 0, 0.2);

    new UTween(this.position, {
      x: 0
    }, 0.4);
  }

  hide() {
    this.visible = false;
  }
}