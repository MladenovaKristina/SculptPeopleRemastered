import * as THREE from "three";

export default class AccesorizeScene extends THREE.Object3D {
    constructor() {
        super();
        this.visible = false;


    }
    start() {
        this.visible = true; console.log("Accesorize, visible ", this.visible)
    }

    onDown(x, y) {

    }
    onMove(x, y) {


    }
    onUp() { }

}