import { PlaneGeometry, Mesh, MeshPhongMaterial, Object3D, Group } from "three";
import { MessageDispatcher } from "../../../../utils/black-engine.module";


export default class HeadParts extends Object3D {
    constructor(assets, camera) {
        super();

        this.messageDispatcher = new MessageDispatcher();
        this.onFinishEvent = 'onFinishEvent';

        this._environment = assets;
        this._camera = camera.threeCamera;
        this.visible = false;
        this._init();

    }

    _init() {
        this._initDock();
        this._initDockElement();

    }
    _initDock() {
        const screenHeightUnits = Math.abs(2 * Math.tan(this._camera.fov * 0.5) * this._camera.position.z) / 100;
        this.screenWidthUnits = Math.abs(2 * Math.tan((this._camera.fov * 0.5) * (Math.PI / 180)) * this._camera.position.z * this._camera.aspect);

        const bg = new PlaneGeometry(this.screenWidthUnits, 0.);
        const mat = new MeshPhongMaterial({ color: 0x000000, transparent: true, opacity: 0.8 })
        this._bg = new Mesh(bg, mat);

        this._bg.position.set(this._camera.position.x, this._camera.position.y, this._camera.position.z / 2)
        if (this._camera.fov === 40) this._bg.position.set(this._camera.position.x, -screenHeightUnits - 0.06, this._camera.position.z / 2)

        this.add(this._bg)
    }

    _initDockElement() {

        const dockelements = this._environment.headParts;
        const dockScale = this.screenWidthUnits / 2;
        let startX = 0 - dockScale / 2;
        const offset = Math.abs(((this.screenWidthUnits / 2 - (dockelements.length - 2)) / (dockelements.length + (dockelements.length - 2))) / 10);
        startX += offset;

        console.log(offset)
        for (let i = 0; i < dockelements.length; i++) {
            const element = dockelements[i];
            element.rotation.set(0, 0, 0);
            element.position.set(startX + offset * i, 0 + 0.07, 0.07);
            element.scale.set(dockScale, dockScale, dockScale)
            element.visible = true;

            if (element.name.includes("hair") && !element.name.includes("clip")) {
                element.scale.set(dockScale / 3, dockScale / 3, dockScale / 3)
                element.rotation.y -= Math.PI / 2;

            }

            this._bg.add(element)
        }
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
        this.visible = false;

        this.messageDispatcher.post(this.onFinishEvent);
    }

}