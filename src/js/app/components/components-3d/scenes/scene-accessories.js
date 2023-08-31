import { PlaneGeometry, Raycaster, Vector2, Mesh, MeshPhongMaterial, Object3D, Group } from "three";
import { MessageDispatcher } from "../../../../utils/black-engine.module";


export default class AccesoriesScene extends Object3D {
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

        this.head = this._environment.head;
    }

    _initDock() {
        const screenHeightUnits = Math.abs(2 * Math.tan(this._camera.threeCamera.fov * 0.5) * this._camera.threeCamera.position.z) / 100;
        this.screenWidthUnits = Math.abs(2 * Math.tan((this._camera.threeCamera.fov * 0.5) * (Math.PI / 180)) * this._camera.threeCamera.position.z * this._camera.threeCamera.aspect);

        const bg = new PlaneGeometry(this.screenWidthUnits, 0.15);
        const mat = new MeshPhongMaterial({ color: 0x000000, transparent: true, opacity: 0.8 })
        this._bg = new Mesh(bg, mat);

        this._bg.position.set(0, this._camera.threeCamera.position.y - 0.15, this._camera.threeCamera.position.z / 2 + 0.1)
        this._bg.rotation.copy(this._camera.threeCamera.rotation * 2)
        if (this._camera.threeCamera.fov === 40) this._bg.position.set(this._camera.threeCamera.position.x, -screenHeightUnits - 0.06, this._camera.position.z / 2)

        this.add(this._bg)
    }

    _initDockElement() {

        const dockelements = this._environment.accessories;
        const scale = 0.03;
        const width = this.screenWidthUnits;
        const numberOfElements = dockelements.length + 2;
        const rowStartPosition = this._camera.threeCamera.position.x - numberOfElements / numberOfElements;
        console.log(rowStartPosition)
        let element;

        const distanceBetweenElements = (width / 2) / (numberOfElements + 2); // Adjust this for spacing.
        for (let i = 0; i < dockelements.length; i++) {
            element = dockelements[i].clone();
            element.visible = true;
            element.scale.set(scale, scale, scale);
            element.rotation.x = Math.PI / 2;
            let elementName = element.name.toLowerCase();
            if (elementName.includes("_r")) {
                element.scale.multiply(this.model3d.flipX)
            }
            if (elementName.includes("hair") && !elementName.includes("clip")) {
                element.scale.set(scale / 10, scale / 10, scale / 10);
                element.rotation.z = Math.PI / 2;
            }
            if (elementName.includes("veil")) element.scale.set(scale / 5, scale / 5, scale / 5);
            if (elementName.includes("spiderman")) element.scale.set(scale, scale, scale);

            const pos = rowStartPosition + (distanceBetweenElements * i);
            element.position.set(pos, 0, 0.1);

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