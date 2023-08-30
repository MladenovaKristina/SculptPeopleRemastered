import { Object3D, Cache, Vector3, Group, CylinderGeometry, MeshPhongMaterial, Mesh } from "three";
import * as TWEEN from "@tweenjs/tween.js";
export default class MorphScene extends Object3D {
    constructor(moveController, flipX) {
        super();
        this._moveController = moveController;
        this._flipX = flipX
        this.visible = false;
        this._object = null;

    }
    start() {
        this.visible = true;
        console.log("morph visible", this.visible, this._flipX)
        this._init();
    }
    _init() {
        this._initStand();
        this._initArms();
        this.show(this.stand)
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
        this._leftArm.rotation.set(0.5, -Math.PI / 2, 0);
        this._arms.add(this._leftArm);
        const hideobj = this._leftArm.children.find(child => child.name.includes("ref"));
        hideobj.visible = false;

        this._rightArm = Cache.get("rightArm").scene;
        const positionRef = this._rightArm.children.find(child => child.name.includes("ref"));
        this._rightArm.rotation.set(this._leftArm.rotation.x, Math.PI / 2, 0);
        this._rightArm.scale.multiply(new Vector3(-1, 1, 1));
        this._arms.add(this._rightArm);

        // Calculate the offset to make the pivot point centered at positionRef.
        const offset = new Vector3();
        positionRef.getWorldPosition(offset);
        offset.negate(); // Invert the offset.
        offset.setY(-0.6);
        offset.setZ(1);

        this._arms.position.copy(offset);

        this._arms.scale.set(4, 4, 4);

    }

    onDown(x, y) {

    }
    onMove(x, y) {


    }
    onUp() { }

    rotateStick() { }

    show(moveobject) {
        this._object = moveobject;

        this._object.position.set(-5, -5, 5)
        this._object.visible = true;

        const targetPosition = new Vector3(0, 0, 0);

        this._objectMoveTween = new TWEEN.Tween(this._object.position)

            .to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, 1500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
                this.idle(this._object)
            })
            .delay(100)
            .start();

        this.animate();
    }

    idle(obj) {
        this._object = obj;
        const duration = 1000;
        const amplitude = 0.01;
        const frequency = 2;
        const _objectRotate = new TWEEN.Tween(this._object.rotation)
            .to(
                {
                    x: this._object.rotation.x + amplitude,
                    y: this._object.rotation.y - amplitude,
                },
                duration * 2
            )
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onUpdate(() => {
                const time = performance.now() / 1000;
                const angle = Math.sin(time * frequency) * amplitude;
                this._object.rotation.x = this._object.rotation.x + angle * 2;
            })
            .repeat(Infinity)
            .yoyo(true)
            .start();

        const _objectRotation = new TWEEN.Tween(this._object.position)
            .to(
                {
                    x: this._object.position.x - amplitude * 2,
                },
                duration * 1.3
            )
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onUpdate(() => {
                const time = performance.now() / 1000;

                if (time >= duration / 2) {
                    this._objectTweenPosition = new TWEEN.Tween(this._object.position.y)
                        .to(
                            {
                                y: this._object.position.y - amplitude
                            },
                            duration * 1.2
                        ).easing(TWEEN.Easing.Sinusoidal.InOut)
                }
            })
            .repeat(Infinity)
            .yoyo(true)
            .start();

    }

    animate() {
        TWEEN.update();
        requestAnimationFrame(() => this.animate());

    }
}