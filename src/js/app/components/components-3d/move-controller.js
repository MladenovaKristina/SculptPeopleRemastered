import * as THREE from "three";
import Helpers from "../../helpers/helpers";
import TWEEN from '@tweenjs/tween.js';

export default class MoveController {
    constructor() {
        console.log("movecontroller")
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
        let targetX = setX, targetY = setY, targetZ = setZ;
        if (bool === "false") {
            this._camera.threeCamera.position.set(targetX, targetY, targetZ);
            this.animating = false;

            callback();
        } else {
            const tempCameraPosition = { x: this._camera.threeCamera.position.x, y: this._camera.threeCamera.position.y, z: this._camera.threeCamera.position.z }; // Temporary object to hold camera position
            if (!setX) targetX = this._camera.threeCamera.position.x; else targetX = this._camera.threeCamera.position.x - setX;

            if (!setY) targetY = this._camera.threeCamera.position.y; else targetY = this._camera.threeCamera.position.y - setY;
            if (!setZ) targetZ = this._camera.threeCamera.position.z; else targetZ = this._camera.threeCamera.position.z - setZ;

            const tween = new TWEEN.Tween(tempCameraPosition)
                .to({ x: targetX, y: targetY, z: targetZ }, 400)
                .easing(TWEEN.Easing.Quadratic.Out)
                .delay(300)
                .onUpdate(() => {
                    this._camera.threeCamera.position.x = tempCameraPosition.x;
                    this._camera.threeCamera.position.y = tempCameraPosition.y;
                    this._camera.threeCamera.position.z = tempCameraPosition.z;
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

    show(object) {
        object.visible = true;

        const targetPosition = 0;

        const duration = 1000;
        object.position.x = -5;

        const tween = new TWEEN.Tween(object.position.y)
            .to({ targetPosition }, duration)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onUpdate(() => {
                object.position.x += 0.1;

                if (object.position.x >= targetPosition) {
                    object.position.x = targetPosition;

                }
            })
            .onComplete(() => {
                this.idle(object)
            })
            .start();
    }


    hide(object) {
        const target = -5;
        const tween = new TWEEN.Tween(object.position.y)
            .to({ target }, 200)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onUpdate(() => {
                object.position.y -= 3 / 10;
                object.position.x -= 5 / 100;
                if (object.position.y <= target) object.visible = false;
            })
            .onComplete(() => {
                object.visible = false;
            })
            .start();
    }

    placeMask(object) {
        object.visible = true;
        const targetpos = new THREE.Vector3(this.head.position.x, this.head.position.y, this.head.position.z + 0.3);
        const targetrotation = new THREE.Vector3(Math.PI / 2, 0, 0);
        object.position.set(-7, 4, 4);
        object.rotation.z += 0.3;
        const tween = new TWEEN.Tween(object.position)
            .to({ x: targetpos.x, y: targetpos.y, z: targetpos.z }, 1000)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .delay(200)
            .onUpdate(() => {
                if (object.position === targetpos) console.log("mask");
            })
            .onComplete(() => {


            })
            .start();
        const rotatetween = new TWEEN.Tween(object.rotation)
            .to({ x: targetrotation.x, y: targetrotation.y, z: targetrotation.z }, 1000)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .delay(800)
            .onUpdate(() => {
                if (object.rotatetween === targetrotation) console.log("mask");
            })
            .start();
    }

    removeMask(object, callback) {
        const targetpos = new THREE.Vector3(-4, 4, 10);
        const targetrotation = new THREE.Vector3(0, 0, 0);


        const tween = new TWEEN.Tween(object.position)
            .to({ x: targetpos.x, y: targetpos.y, z: targetpos.z }, 1000)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .delay(800)
            .onUpdate(() => {
                if (object.position === targetpos) console.log("mask");
            })
            .onComplete(() => {
                callback();
            })
            .start();

        const rotatetween = new TWEEN.Tween(object.rotation)
            .to({ x: targetrotation.x, y: targetrotation.y, z: targetrotation.z }, 1000)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .delay(200)
            .onUpdate(() => {
                if (object.rotatetween === targetrotation) console.log("mask");
            })
            .start();
    }

    animate() {
        TWEEN.update();
        requestAnimationFrame(() => this.animate());
    }
}