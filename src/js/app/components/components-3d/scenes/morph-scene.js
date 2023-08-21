import * as THREE from "three";

export default class MorphScene extends THREE.Object3D {
    constructor(layout2d, camera, renderer, objects) {
        super();
        this._layout2d = layout2d;
        this._renderer = renderer;
        this._camera = camera;
        this._objects = objects
        this._initView();
    }

    _initView() {

    }

    onDown(x, y) {

    }
    onMove(x, y) {


    }
    onUp() { }

}