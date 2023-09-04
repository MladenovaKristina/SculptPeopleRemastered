import { PlaneGeometry, Vector3, Raycaster, Vector2, Mesh, MeshPhongMaterial, Object3D, Group } from "three";
import { MessageDispatcher } from "../../../../utils/black-engine.module";
import { MeshBasicMaterial } from "three";

import { Black } from "../../../../utils/black-engine.module";
export default class AccesoriesScene extends Object3D {
    constructor(assets, camera, ui) {
        super();

        this.messageDispatcher = new MessageDispatcher();
        this.onFinishEvent = 'onFinishEvent';

        this.numberOfDecorations = 0;
        this._ui = ui;
        this._environment = assets;
        this._camera = camera;
        this.visible = false;

        this._init();

    }

    _init() {
        this._initView()
        this._initDock();
        this._initDockElement();

    }
    _initView() {
        this.head = this._environment.head;
        this.head.visible = true;
    }

    _initDock() {
        const screenHeightUnits = Math.abs(2 * Math.tan(this._camera.threeCamera.fov * 0.5) * this._camera.threeCamera.position.z) / 100;
        this.screenWidthUnits = Math.abs(2 * Math.tan((this._camera.threeCamera.fov * 0.5) * (Math.PI / 180)) * this._camera.threeCamera.position.z * this._camera.threeCamera.aspect);

        const bg = new PlaneGeometry(this.screenWidthUnits, 0.15);
        const mat = new MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 1 })
        this._bg = new Mesh(bg, mat);

        this._bg.position.set(0, this._camera.threeCamera.position.y - 0.15, this._camera.threeCamera.position.z / 2 + 0.1)
        this._bg.rotation.copy(this._camera.threeCamera.rotation * 2)
        if (this._camera.threeCamera.fov === 40) this._bg.position.set(this._camera.threeCamera.position.x, -screenHeightUnits - 0.06, this._camera.position.z / 2)

        this.add(this._bg)
    }

    _initDockElement() {

        const dockelements = this._environment.accessories;
        const dockScale = 0.1;
        const scaledown = new Vector3(dockScale, dockScale, dockScale)
        let startX = 0 - dockScale;
        const offset = Math.abs(((this.screenWidthUnits / 2 - (dockelements.length)) / (dockelements.length + (dockelements.length - 2))) / 10);

        console.log(offset)
        for (let i = 0; i < dockelements.length; i++) {
            const element = dockelements[i].clone();
            element.position.set(startX + offset * i, 0 + 0.06, 0.1);
            if (element.name.includes("spiderman")) {
                element.rotation.set(0, 0, 0);
                element.scale.multiply(new Vector3(0.35, 0.35, 0.35))

            }

            if (element.name.includes("veil")) {
                element.scale.multiply(scaledown)
            } else
                element.scale.multiply(new Vector3(0.3, 0.3, 0.3))

            element.visible = true;


            this.numberOfDecorations++;

            this._bg.add(element)
        }
    }
    getElementAtPosition(x, y) {
        if (this.canMove) {
            const raycaster = new Raycaster();
            const mouse = new Vector2();

            mouse.x = x;
            mouse.y = y;

            raycaster.setFromCamera(mouse, this._camera.threeCamera);
            const intersects = [];
            this._bg.traverse((child) => {
                const intersect = raycaster.intersectObject(child);
                if (intersect.length > 0 && !this.selectedDecoration) {
                    this.selectedDecoration = intersect[0].object;
                }
            });
        }
    }

    clickToEquip(x, y, callback) {
        if (this.canMove) {
            const raycaster = new Raycaster();
            const mouse = new Vector2();

            mouse.x = (x / window.innerWidth) * 2 - 1;
            mouse.y = -(y / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, this._camera.threeCamera);

            const intersects = raycaster.intersectObjects(this._bg.children, true);

            if (intersects.length > 0) {
                let selectedDecoration = intersects[0].object;
                let headGroup, elementInHead;

                headGroup = this.head;
                const selectedName = selectedDecoration.name.toLowerCase(); // Convert to lowercase

                this.head.traverse((child) => {
                    if (child.name.toLowerCase() === selectedName) {
                        if (child.visible) {
                            // If the dock element is already equipped, unequip it
                            selectedDecoration.visible = true;
                            child.visible = false;
                        } else {
                            // Equip the dock element
                            // selectedDecoration.visible = false;
                            child.visible = true;
                            if (this.numberOfDecorations <= 0) {
                                callback();
                            }
                        }
                        return; // Stop traversing after the first matching child
                    }
                });
            }
        }
    }


    onDown(x, y) {
        this.canMove = true;

        this.clickToEquip(x, y, () => {
            this.hide();
        })
    }


    onMove(x, y) {


    }
    onUp() {
        this.canMove = false;

    }

    show() {
        this.visible = true;
        this._ui._showCheckmark();
    }

    hide() {
        this._ui._hideCheckmark();

        this.visible = false;
        this.messageDispatcher.post(this.onFinishEvent);
    }

}