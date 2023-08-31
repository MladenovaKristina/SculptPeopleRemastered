import * as THREE from "three";
import ConfigurableParams from "../../../../data/configurable_params";
import Helpers from "../../../helpers/helpers";
import { MessageDispatcher } from "../../../../utils/black-engine.module";
import BodyMovement from "../body-movement/body-movement";

export default class StageMoveBody extends THREE.Object3D {
    constructor(body, camera) {
        super();

        this.messageDispatcher = new MessageDispatcher();
        this.onFinishEvent = 'onFinishEvent';

        this._body = body;
        this._camera = camera;

        this.visible = false;

        this._initBodyMovoment();
    }

    _initBodyMovoment() {
        this._bodyMovement = new BodyMovement(this._body.rig, this._camera.camera);
        this.add(this._bodyMovement);
    }


    onDown(x, y) {
        if (!this.visible) return;

        this._bodyMovement.onDown(x, y);
    }

    onMove(x, y) {
        if (!this.visible) return;

        this._bodyMovement.onMove(x, y);
    }

    onUp() {
        if (!this.visible) return;

        this._bodyMovement.onUp();
    }
    show(character) {
        this.visible = true;


        this._body.showBodyCharacter(character);
        this._camera.switchToBody();

        this._bodyMovement.playHint();
    }

    hide() {
        this.visible = false;

        this.messageDispatcher.post(this.onFinishEvent);
    }

}