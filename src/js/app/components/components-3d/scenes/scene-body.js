import * as THREE from "three";

export default class BodySelectionScene extends THREE.Object3D {
    constructor() {
        super();
        this.visible = false;


    }
    start() {
        this.visible = true; console.log("Body, visible ", this.visible)
    }

    onDown(x, y) {

    }
    onMove(x, y) {


    }
    onUp() { }

}