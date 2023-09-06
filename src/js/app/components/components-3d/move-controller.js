import { Vector3, Object3D, Group } from "three";
import TWEEN from '@tweenjs/tween.js';

export default class MoveController extends Object3D {
    constructor(camera, renderer) {
        super();
        this.visible = true;
        this._camera = camera;
        this._renderer = renderer;
        this._object = new Group;

        this.add(this._object);

        this._animations = {
            sculpt: {
                tween: null,
                action: null,
                mixer: null,
                duration: null,
                time: 2000,
                repeat: Infinity,
                yoyo: true
            }
        }
        this._rightAnimations = {
            sculpt: {
                tween: null,
                action: null,
                mixer: null,
                duration: null,
                time: 2000,
                repeat: Infinity,
                yoyo: true
            }
        }
    }

    _init() {

    }

    setCam(setX, setY, setZ, bool, callback) {
        this.animating = true;
        let targetX = setX !== null ? setX : this._camera.threeCamera.position.x;
        let targetY = setY !== null ? setY : this._camera.threeCamera.position.y;
        let targetZ = setZ !== null ? setZ : this._camera.threeCamera.position.z;

        if (bool === "false") {
            this._camera.threeCamera.position.set(targetX, targetY, targetZ);
            this.animating = false;
            console.log("set without animation", targetX, targetY, targetZ)
            callback();
        }
        if (bool === "true") {
            const tempCameraPosition = { x: this._camera.threeCamera.position.x, y: this._camera.threeCamera.position.y, z: this._camera.threeCamera.position.z }; // Temporary object to hold camera position

            const tween = new TWEEN.Tween(tempCameraPosition)
                .to({ x: targetX, y: targetY, z: targetZ }, 400)
                .easing(TWEEN.Easing.Quadratic.Out)
                .delay(300)
                .onUpdate(() => {
                    this._camera.threeCamera.position.x = tempCameraPosition.x;
                    this._camera.threeCamera.position.y = tempCameraPosition.y;
                    this._camera.threeCamera.position.z = tempCameraPosition.z;
                    this._camera.threeCamera.lookAt(new THREE.Vector3(tempCameraPosition.x, tempCameraPosition.y, tempCameraPosition.z))
                })
                .onComplete(() => {
                    if (this._camera.threeCamera.position.x == targetX) {
                        this.animating = false;
                        callback();
                    }
                })
                .start();

            this.animate();
        }

    }


    show(moveobject) {
        console.log("move", moveobject, moveobject.visible)
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

    //     stopAnimate() {
    //         if (TWEEN.isPlaying && TWEEN)
    //             TWEEN.end();
    //         TWEEN.stop();
    // 
    //     }
}