import * as THREE from "three";
import Helpers from "../../../helpers/helpers";
import { MessageDispatcher } from "../../../../utils/black-engine.module";

export default class StageSculpt extends THREE.Object3D {
    constructor(head, camera) {
        super();

        this.messageDispatcher = new MessageDispatcher();
        this.onFinishEvent = 'onFinishEvent';

        this._head = head;
        this._camera = camera;

        this.visible = false;
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;

        this.messageDispatcher.post(this.onFinishEvent);
    }

    onDown(x, y) {
        if (!this.visible) return;

        // this._drawController.onDown(x, y);
    }

    onMove(x, y) {
        if (!this.visible) return;

        // this._drawController.onMove(x, y);
    }

    onUp() {
        if (!this.visible) return;

        // this._drawController.onUp();
    }
}