import { Object3D, Cache, Group, Vector3, CylinderGeometry, MeshPhongMaterial, Mesh } from "three";

export default class MorphScene extends Object3D {
    constructor(moveController, flipX) {
        super();
        this._moveController = moveController;
        this._flipX = flipX
        this.visible = false;

    }
    start() {
        this.visible = true;
        console.log("morph visible", this.visible, this._flipX)
        this._init();
    }
    _init() {
        this._initStand();
        this._initArms();
    }

    _initStand() {
        this.stand = new Group();
        this.stand.position.x = 0;

        const cylinderGeometry = new CylinderGeometry(0.1, 0.1, 5, 10);
        const cylinderMaterial = new MeshPhongMaterial({ color: 0xdadada, metalness: 1, reflectivity: 10 });

        const cylinder = new Mesh(cylinderGeometry, cylinderMaterial);
        cylinder.position.y = -2;

        this.stand.add(cylinder);

        const baseGeometry = new CylinderGeometry(1.5, 1.5, 0.1, 30);
        const base = new Mesh(baseGeometry, cylinderMaterial);
        base.position.y = -4.5;

        this.stand.add(base);
        this.stand.scale.set(0.1, 0.1, 0.1)
        this.add(this.stand);
    }
    _initArms() {
        this._arms = new Group();
        this.add(this._arms);
        this._leftArm = Cache.get("arm").scene;
        this._leftArm.rotation.set(0.5, -Math.PI / 2, 0)
        this._arms.add(this._leftArm);

        this._rightArm = Cache.get("rightArm").scene;
        this._rightArm.rotation.set(this._leftArm.rotation.x, Math.PI / 2, 0)

        this._rightArm.scale.multiply(new Vector3(-1, 1, 1));
        this._arms.add(this._rightArm)

        this._arms.scale.set(4, 4, 4)
        this._arms.position.copy(this.stand.position)
    }

    onDown(x, y) {

    }
    onMove(x, y) {


    }
    onUp() { }

}