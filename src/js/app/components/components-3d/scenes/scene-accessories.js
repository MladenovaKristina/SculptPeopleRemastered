import * as THREE from "three";

export default class AccesorizeScene extends THREE.Object3D {
    constructor() {
        super();
        this.visible = false;

        console.log("Accesorize, visible ", this.visible)

    }
    start() { this.visible = true; }

    onDown(x, y) {

    }
    onMove(x, y) {


    }
    onUp() { }

}