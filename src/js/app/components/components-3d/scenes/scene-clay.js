import * as THREE from "three";

export default class ClayScene extends THREE.Object3D {
    constructor(assets, layout2d) {
        super();

        this._assets = assets;
        this._layout2d = layout2d;
    }
    start() {
        this.visible = true;
        this._init()
    }
    _init() {
        this._layout2d._startClayHint()
    }
    onDown(x, y) {

    }
    onMove(x, y) {


    }
    onUp() { }

}