import * as THREE from "three";
import { MessageDispatcher } from "../../../../utils/black-engine.module";
import Spray from "../drawing/spray";
import CanvasDrawController from "../drawing/canvas-draw-controller";
import DrawController from "../drawing/draw-controller";
import SelectDock from "./select-dock";

export default class StageColorMask extends THREE.Object3D {
    constructor(head, camera, ui) {
        super();

        this.messageDispatcher = new MessageDispatcher();
        this.onFinishEvent = 'onFinishEvent';

        this._ui = ui;
        this._head = head;
        this._camera = camera;
        this.visible = false;
        this._finished = false;

        this._initSpray();
        this._initCanvasDrawController();
        this._initDrawController();
        this._initDrawingPlane();
        // this._ui._initSprayDock();

    }

    _initSpray() {
        this._spray = new Spray(this._ui);
        this.add(this._spray);
    }

    _initDrawingPlane() {
        const canvasDOM = document.getElementById('drawingCanvas');
        this._canvasTexture = new THREE.CanvasTexture(canvasDOM);
        this._canvasTexture.flipY = true;
        this._head.updateCanvasTexture(this._canvasTexture);
    }

    _initCanvasDrawController() {
        this._canvasDrawController = new CanvasDrawController();

        this._canvasDrawController.messageDispatcher.on(this._canvasDrawController.onDrawEvent, msg => {
            this._canvasTexture.needsUpdate = true;
        });
        console.log(this._canvasDrawController)

        this._canvasDrawController.color = '#ff0000';
    }

    _initDrawController() {
        const material = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            transparent: true,
            opacity: 0
        });

        const geom = new THREE.PlaneGeometry(0.4, 0.6);
        const plane = new THREE.Mesh(geom, material);
        plane.position.set(0, 0.1, 0.1);
        this.add(plane);

        this._drawController = new DrawController(this._camera.camera, plane, this._canvasDrawController, this._spray);
    }

    onDown(x, y) {

        if (!this.visible) return;
        this._drawController.onDown(x, y);
        this._spray.onDown();
    }

    onMove(x, y) {

        if (!this.visible) return;

        this._drawController.onMove(x, y);
    }

    onUp() {

        if (!this.visible) return;
        this._spray.onUp();

        this._drawController.onUp();

        if (this._finished) return;
        this._finished = true;
        this._head.hideMask();

        setTimeout(() => {
            this.hide();
        }, 500);
    }
    show() {
        this.visible = true;
        this._ui._showCheckmark();
        this._ui._sprayInDock.show()

    }

    hide() {
        this._ui.hideSprayDock();
        this._ui._hideCheckmark();

        this.visible = false;


        this.messageDispatcher.post(this.onFinishEvent);
    }
}