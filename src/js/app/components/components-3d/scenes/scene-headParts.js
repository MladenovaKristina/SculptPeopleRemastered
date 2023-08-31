import { PlaneGeometry, Raycaster, Vector2, Mesh, MeshPhongMaterial, Object3D, Group } from "three";
import { MessageDispatcher } from "../../../../utils/black-engine.module";


export default class HeadParts extends Object3D {
    constructor(assets, camera) {
        super();

        this.messageDispatcher = new MessageDispatcher();
        this.onFinishEvent = 'onFinishEvent';

        this.numberOfDecorations = 0;

        this._environment = assets;
        this._camera = camera;
        this.visible = false;
        this._init();

    }

    _init() {
        this._initDock();
        this._initDockElement();
        this._initView()
    }
    _initView() {
        this._environment.head.visible = true;
        this._environment.head.position.set(0, 0, 0)

        this.head = this._environment.head;
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

        const dockelements = this._environment.headParts;
        const dockScale = this.screenWidthUnits / 2;
        let startX = 0 - dockScale;
        const offset = Math.abs(((this.screenWidthUnits / 2 - (dockelements.length - 2)) / (dockelements.length + (dockelements.length - 2))) / 10);
        startX += offset * 3;

        console.log(offset)
        for (let i = 0; i < dockelements.length; i++) {
            const element = dockelements[i];
            element.rotation.set(0, 0, 0);
            element.position.set(startX + offset * i, 0 + 0.07, 0.1);
            element.scale.set(dockScale, dockScale, dockScale)
            element.visible = true;

            if (element.name.includes("hair") && !element.name.includes("clip")) {
                element.scale.set(dockScale / 3, dockScale / 3, dockScale / 3)
                element.rotation.y -= Math.PI / 2;

            }
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
        console.log("aaa")
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

                        selectedDecoration.visible = false;
                        child.visible = true;
                        selectedDecoration = null;
                        this.numberOfDecorations--;
                        console.log(child.name, this.numberOfDecorations, child.position
                        )
                        if (this.numberOfDecorations <= 0) {
                            callback()

                        }
                    }
                })



            }
        }
    }

    onDown(x, y) {
        this.canMove = true;

        this.clickToEquip(x, y, () => {
            console.log("clicked")
        })
    }


    onMove(x, y) {


    }
    onUp() {
        this.canMove = false;

    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
        this.messageDispatcher.post(this.onFinishEvent);
    }

}