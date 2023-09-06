import * as THREE from "three";
import { MessageDispatcher } from "../../../../utils/black-engine.module";

export default class SelectDock extends THREE.Object3D {
    constructor(objectType, ui, cameraController) {
        super();
        this.objectType = objectType;
        console.log(this.objectType)
        this.messageDispatcher = new MessageDispatcher();
        this.onFinishEvent = 'onFinishEvent';

        this._ui = ui;
        this._cameraController = cameraController;

        this.visible = false;

        this._init();

    }


    _init() {
        if (this.objectType === "spray") this._initSpray();
        if (this.objectType === "body") this._initBody();

    }
    _initSpray() {
        this._ui._initSprayDock();

    }
    _initBody() {
        this._ui._initBodyDock();
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
        this._ui._objectsInDock.hide();
        this.visible = false;
        this.messageDispatcher.post(this.onFinishEvent);

    }
}