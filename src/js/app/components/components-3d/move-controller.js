import * as THREE from "three";
import Helpers from "../../helpers/helpers";
import TWEEN from '@tweenjs/tween.js';

export default class MoveController {
    constructor(camera, renderer) {
        this._camera = camera;
        this._renderer = renderer;
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



    animate() {
        TWEEN.update();
        requestAnimationFrame(() => this.animate());
    }
}