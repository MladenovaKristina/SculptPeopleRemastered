import * as THREE from "three";

export default class ClayScene extends THREE.Object3D {
    constructor() {
        super();
        this.visible = false;

        console.log("ClayScene, visible ", this.visible)

    }
    start() { this.visible = true; }

    onDown(x, y) {

    }
    onMove(x, y) {


    }
    onUp() { }

}