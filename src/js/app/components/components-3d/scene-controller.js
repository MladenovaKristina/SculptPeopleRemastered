import { Object3D } from "three";

import Helpers from "../../helpers/helpers";
import MoveController from "./move-controller";
import Environment from "./scenes/scene";
import ClayScene from "./scenes/scene-clay";
import MorphScene from "./scenes/scene_morph";
import AccesorizeScene from "./scenes/scene-accessories";
import BodySelectionScene from "./scenes/scene-body";
import MaterialLoader from "./material_loader";
export default class SceneController extends Object3D {
    constructor(layout2d, renderer, camera) {
        super();
        this._layout2d = layout2d;
        this._renderer = renderer;
        this._camera = camera;
        this.init();
        this.nextScene("clay")
    }
    init() {
        this._environment = new Environment();
        this.add(this._environment);

        console.log(this._environment._assets)

        this._materialLoader = new MaterialLoader(this._environment._assets)
        this.add(this._materialLoader);

        this._clayScene = new ClayScene(this._environment._assets, this._layout2d);
        this.add(this._clayScene);

        this._morphScene = new MorphScene();
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
    }

    onDown(x, y) {
    }
    onMove(x, y) {
    }
    onUp() { }

}