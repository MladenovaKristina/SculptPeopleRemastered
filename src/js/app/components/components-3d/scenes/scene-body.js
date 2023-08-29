import * as THREE from "three";

export default class BodySelectionScene extends THREE.Object3D {
    constructor() {
        super();
        this.visible = false;

        console.log("Body, visible ", this.visible)

    }
    start() { this.visible = true; }

    onDown(x, y) {

    }
    onMove(x, y) {


    }
    onUp() { }

}