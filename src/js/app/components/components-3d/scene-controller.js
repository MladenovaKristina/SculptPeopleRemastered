import * as THREE from "three";
import Head from "./head";
import Body from "./body";
import Environment from "./scenes/scene";
import ClayScene from "./scenes/scene-clay";
import StageSculpt from "./scenes/scene_morph";
import StageColorMask from "./scenes/stage-color-mask";
import HeadParts from "./scenes/scene-headParts";
import AccesoriesScene from "./scenes/scene-accessories";
import StageMoveBody from "./scenes/scene-body";

import MaterialLoader from "./material_loader";

import { MessageDispatcher } from "../../../utils/black-engine.module";

export default class SceneController extends THREE.Object3D {
    constructor(ui, cameraController, camera) {
        super();

        this.messageDispatcher = new MessageDispatcher();
        this.onFinishEvent = 'onFinishEvent';

        this._ui = ui;
        this._cameraController = cameraController;
        this._camera = camera;
        this._currentStageId = 0;
        this._initView();

        this._initStages();

        this._stages = [
            { stage: this._stageClaySelect, enabled: true },
            { stage: this._stageSculpt, enabled: false },
            { stage: this._stageColorMask, enabled: true },
            { stage: this._stageHeadParts, enabled: true },
            { stage: this._stageAccesories, enabled: true },
            { stage: this._stageMoveBody, enabled: true },
        ];


        this.showNextStage();
    }

    _initStages() {
        this._initClaySelect();
        this._initStageSculpt();
        this._initStageColorMask();
        this._initStageHeadParts();
        this._initAccesories();
        this._initStageMoveBody();

    }
    _initView() {
        this._environment = new Environment();
        this.add(this._environment);

        this._head = new Head(this._environment);
        this.add(this._head);

        this._body = new Body(this._environment.armature);
        this.add(this._body);

        this._materialLoader = new MaterialLoader(this._environment._assets);
    }

    _initClaySelect() {
        this._clayScene = new ClayScene(this._ui, this._cameraController);
        this.add(this._clayScene);

        this._clayScene.messageDispatcher.on(this._clayScene.onFinishEvent, msg => {
            this._currentStageId++;
            this.showNextStage();
        });
    }


    _initStageSculpt() {
        this._stageSculpt = new StageSculpt(this._head, this._cameraController);
        this.add(this._stageSculpt);

        this._stageSculpt.messageDispatcher.on(this._stageSculpt.onFinishEvent, msg => {
            this._currentStageId++;
            this.showNextStage();
        });
    }

    _initStageColorMask() {
        this._stageColorMask = new StageColorMask(this._head, this._cameraController);
        this.add(this._stageColorMask);

        this._stageColorMask.messageDispatcher.on(this._stageColorMask.onFinishEvent, msg => {
            this._currentStageId++;
            this.showNextStage();
        });
    }

    _initAccesories() {
        this._stageAccessorize = new AccesoriesScene(this._environment, this._cameraController, this._camera);
        this.add(this._stageAccessorize);

        this._stageAccessorize.messageDispatcher.on(this._stageAccessorize.onFinishEvent, msg => {
            this._currentStageId++;
            this.showNextStage();
        });
    }

    _initStageHeadParts() {
        this._stageHeadParts = new HeadParts(this._environment, this._camera);
        this.add(this._stageHeadParts);

        this._stageHeadParts.messageDispatcher.on(this._stageHeadParts.onFinishEvent, msg => {
            this._currentStageId++;
            this.showNextStage();
        });
    }

    _initStageMoveBody() {
        this._stageMoveBody = new StageMoveBody(this._body, this._cameraController);
        this.add(this._stageMoveBody);

        this._stageMoveBody.messageDispatcher.on(this._stageMoveBody.onFinishEvent, msg => {
            this._currentStageId++;
            this.showNextStage();
        });
    }
    setClay(clay) {
        this._materialLoader._initClayMaterial(clay);
    }
    showNextStage() {
        if (this._currentStageId >= this._stages.length) {
            console.log('no stages left');
            this.messageDispatcher.post(this.onFinishEvent);
            return;
        }

        if (this._stages[this._currentStageId].enabled) {
            const stage = this._stages[this._currentStageId].stage;
            if (stage && typeof stage.show === 'function') {
                stage.show();
                console.log('show stage');
            } else {
                console.log('stage', this._currentStageId, 'is invalid or does not have a show method');
            }
        } else {
            console.log('stage', this._currentStageId, 'skipped')
            this._currentStageId++;
            this.showNextStage();
        }
    }

    onDown(x, y) {
        this._stageSculpt.onDown(x, y);
        this._stageMoveBody.onDown(x, y);
        this._stageColorMask.onDown(x, y);
    }

    onMove(x, y) {
        this._stageSculpt.onMove(x, y);
        this._stageMoveBody.onMove(x, y);
        this._stageColorMask.onMove(x, y);
    }

    onUp() {
        this._stageMoveBody.onUp();
        this._stageColorMask.onUp();
        this._stageSculpt.onUp();
    }

    onUpdate(dt) {

    }
}