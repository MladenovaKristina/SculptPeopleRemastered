import * as THREE from "three";
import { MessageDispatcher } from "../../../../utils/black-engine.module";

export default class ClayScene extends THREE.Object3D {
    constructor(layout2d, cameraController) {
        super();

        this.messageDispatcher = new MessageDispatcher();
        this.onFinishEvent = 'onFinishEvent';

        this._layout2d = layout2d;
        this._cameraController = cameraController;
        this._init();

    }


    _init() {
        this._layout2d._startClayHint()
    }
    onDown(x, y) {
    }
    onMove(x, y) {


    }
    onUp() { }

    show() {
        this.visible = true;
    }

    hide() {
        this._layout2d._selectHint.hide(() => {
            this._cameraController.switchToHead();
            this.visible = false;
            this.messageDispatcher.post(this.onFinishEvent);
        })

    }
}