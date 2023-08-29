import * as THREE from "three";
import Helpers from "../../helpers/helpers";
import MoveController from "./move-controller";
import Environment from "./scenes/scene";
import ClayScene from "./scenes/scene-clay";
import MorphScene from "./scenes/scene_morph";
import AccesorizeScene from "./scenes/scene-accessories";
import BodySelectionScene from "./scenes/scene-body";

export default class SceneController extends THREE.Object3D {
    constructor(layout2d, renderer, camera) {
        super();
        this._layout2d = layout2d;
        this._renderer = renderer;
        this._camera = camera;
        this.init();
    }
    start() { this._environment.start() }
    init() {
        this._environment = new Environment();
        this.add(this._environment);

        this._clayScene = new ClayScene();
        this.add(this._clayScene);

        this._morphScene = new MorphScene();
        this.add(this._morphScene);

        this._accessorize = new AccesorizeScene();
        this.add(this._accessorize);

        this._bodySelectScene = new BodySelectionScene();
        this.add(this._bodySelectScene);
    }

    nextScene(id) { }

    onDown(x, y) {
    }
    onMove(x, y) {
    }
    onUp() { }

}