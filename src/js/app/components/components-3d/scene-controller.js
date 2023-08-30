import { Object3D } from "three";

import Helpers from "../../helpers/helpers";
import Environment from "./scenes/scene";
import ClayScene from "./scenes/scene-clay";
import MorphScene from "./scenes/scene_morph";
import AccesorizeScene from "./scenes/scene-accessories";
import BodySelectionScene from "./scenes/scene-body";
import MaterialLoader from "./material_loader";

export default class SceneController extends Object3D {
    constructor(layout2d, renderer, camera, cameraController, moveController) {
        super();
        this._camera = camera;
        this._renderer = renderer;
        this._cameraController = cameraController;
        this._moveController = moveController;
        console.log(this._moveController)

        this._layout2d = layout2d;
    }
    start() {
        this.init()
        this.nextScene("morph")
    }

    init() {

        this._environment = new Environment();
        this.add(this._environment);

        this._materialLoader = new MaterialLoader(this._environment._assets)

        this._clayScene = new ClayScene(this._environment._assets, this._layout2d);
        this.add(this._clayScene);

        this._morphScene = new MorphScene(this._environment._assets, this._moveController, this._environment.flipX);
        this.add(this._morphScene);

        this._accessorize = new AccesorizeScene();
        this.add(this._accessorize);

        this._bodySelectScene = new BodySelectionScene();
        this.add(this._bodySelectScene);
    }

    nextScene(id) {
        if (id === "clay") {
            this._clayScene.start();
        }
        if (id === "morph") {
            this._layout2d._hideClayHint();
            this._morphScene.start()
        }
    }

    onDown(x, y) {
    }
    onMove(x, y) {
    }
    onUp() { }

}