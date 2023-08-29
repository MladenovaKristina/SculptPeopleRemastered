import * as THREE from "three";

export default class Environment extends THREE.Object3D {
    constructor() {
        super();
        this.visible = true;

        console.log("Environment, visible", this.visible)
        this.start();
    }

    start() {
        this.visible = true;
        console.log("Environment, visible", this.visible)
    }

    onDown(x, y) {

    }
    onMove(x, y) {


    }
    onUp() { }

}