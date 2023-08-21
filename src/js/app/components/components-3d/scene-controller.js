import * as THREE from "three";
import Helpers from "../../helpers/helpers";
import MoveController from "./move-controller";
import SceneObjects from "./3d-objects";
import MorphScene from "./scenes/morph-scene";
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

        this._moveController = new MoveController(this._camera, this._renderer)

        const view = new THREE.Object3D();
        this.add(view);
        this.start()
    }

    nextScene() { }
    start() { this.scene0(); }
    scene0() {
        this._morphScene = new MorphScene(this._layout2d, this._camera, this._renderer, this._objects);
        this._moveController.setCam(0.5, -0.1, null, "false", () => {
            this.sceneNumber = 0;
        });
    }

    scene1() {
        console.log("idle sculpt hands, clay turns to head")
        this._moveController.setCam(0, 0, 1, "true", () => {
            this.sceneNumber = 1;
            this._objects.show(this._objects._armGroup);
        });

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
    }
    scene8() {
    }
    scene9() {
    }

    scene9(exist) {
    }
    onDown(x, y) {

    }
    onMove(x, y) {


    }
    onUp() { }

}