import * as THREE from "three";
import Helpers from "../../helpers/helpers";

export default class Enviroment extends THREE.Object3D {
  constructor() {
    super();

    this._initView();
  }

  _initView() {
    const view = new THREE.Object3D();
    this.add(view);


  }
}