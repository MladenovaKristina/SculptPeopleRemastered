import * as THREE from "three";
import ConfigurableParams from "../../../../data/configurable_params";
import Helpers from "../../../helpers/helpers";
import { MessageDispatcher } from "../../../../utils/black-engine.module";
import BodyMovement from "../body-movement/body-movement";
import SelectDock from "./select-dock";

export default class StageMoveBody extends THREE.Object3D {
    constructor(body, camera, ui) {
        super();

        this.messageDispatcher = new MessageDispatcher();
        this.onFinishEvent = 'onFinishEvent';
        this._ui = ui;
        this._body = body;
        this._camera = camera;

        this.visible = false;
        this.canHide = false;

    }

    _initSelectBodyDock() {
        this._selectBodyDock = new SelectDock("body", this._ui, this._cameraController);
        this.add(this._selectBodyDock);

        this._selectBodyDock.messageDispatcher.on(this._selectBodyDock.onFinishEvent, msg => {
            this._currentStageId++;
            this.showNextStage();
        });
    }

    _initBodyMovoment() {
        this._bodyMovement = new BodyMovement(this._body.rig, this._camera.camera);
        this.add(this._bodyMovement);
    }


    onDown(x, y) {
        if (!this.visible) return;
        this.canHide = true;

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

    show() {
        this._ui._objectsInDock.show()

        this.visible = true;
        this._initBodyMovoment();

        this._camera.switchToBody();
        this._ui._showCheckmark();

    }

    showChar(character) {
        this._bodyMovement.visible = true;

        this._body.showBodyCharacter(character);
        this._bodyMovement.playHint();
    }

    hide() {
        if (this.canHide) {
            this._ui._cheers.show();
            this._ui._confetti.show();
            this._ui._hideCheckmark();
            this._ui._objectsInDock.hide();

            this._bodyMovement.visible = false;
            this.messageDispatcher.post(this.onFinishEvent);
        }
    }

}