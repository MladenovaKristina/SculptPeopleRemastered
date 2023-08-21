import * as THREE from "three";
import Helpers from "../../helpers/helpers";
import MoveController from "./move-controller";
import SceneObjects from "./3d-objects";

export default class SceneController extends THREE.Object3D {
    constructor(layout2d, renderer, camera) {
        super();
        this._layout2d = layout2d;
        this._renderer = renderer;
        this._camera = camera;
        this._initView();
    }

    _initView() {
        this._objects = new SceneObjects();
        this.add(this._objects);

        this._moveController = new MoveController()

        const view = new THREE.Object3D();
        this.add(view);

        this.scene0();
    }

    nextScene() { }

    scene0() {
        console.log("choose clay")
        // this._moveController.show(this._objects._armGroup)
    }

    scene1() {
        console.log("idle sculpt hands, clay turns to head")
    }
    scene2() {
        console.log("hands hide, morphed head unmorphs")
    }
    scene3() {
        console.log("unmorphed head turns to original head with stick")
    }
    scene4() {
        console.log("paint scene")
    }
    scene5() {
        console.log("add head parts to head")
    }
    scene6() {
        console.log("add accessories to head")
    }
    scene7() {
        console.log("celebrate confetti, praise, move camera")
    }
    scene8() {
        console.log("choose body")
    }
    scene9() {
        console.log("wiggle body a little")
    }

    scene9(exist) {
        if (exist) console.log("end scene")
    }
}