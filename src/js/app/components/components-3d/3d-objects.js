import * as THREE from "three";
import Helpers from "../../helpers/helpers";
import TWEEN from '@tweenjs/tween.js';
import ConfigurableParams from "../../../data/configurable_params";

export default class SceneObjects
    extends THREE.Object3D {
    constructor() {
        super();
        this.count = 0;
        this._asset = null;
        this.flipX = new THREE.Vector3(-1, 1, 1);

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
        this._init();
    }

    _init() {
        this._initEnvironment();
        this._initStand();
        this._initAssset();

        this._initHands();
        this._initSpray();

    }
    _initEnvironment() {

    }
    _initStand() {
        this._standForHead = new THREE.Group();
        this.add(this._standForHead)
        const cylinder = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 30)
        const material = new THREE.MeshPhongMaterial({ color: 0x555555, metalness: 10, reflectivity: 10 })
        const stand = new THREE.Mesh(cylinder, material)
        stand.position.y = 0.25;
        const baseshape = new THREE.CylinderGeometry(0.1, 0.1, 0.01, 30)
        const base = new THREE.Mesh(baseshape, material)
        base.position.y = 0;
        this._standForHead.add(stand);
        this._standForHead.add(base);
        this._standForHead.position.y -= 0.5;
        this._standForHead.visible = true;

        this._standForBody = new THREE.Group();
        this.add(this._standForBody)
        const height = 1.3;
        const cylinderBody = new THREE.CylinderGeometry(0.02, 0.02, height, 30)
        const standBody = new THREE.Mesh(cylinderBody, material)
        standBody.position.y = height / 2;
        const baseshapeBody = new THREE.CylinderGeometry(0.1, 0.1, 0.01, 30)
        const baseBody = new THREE.Mesh(baseshapeBody, material)
        baseBody.position.y = 0;
        this._standForBody.add(standBody);
        this._standForBody.add(baseBody);
        this._standForBody.position.y -= height + 0.005;
        this._standForBody.visible = false;

    }
    _initAssset() {
        this._asset = THREE.Cache.get('assets').scene
        const material = new THREE.MeshPhongMaterial({ color: 0x555555, transparent: true, opacity: 0.5 })

        const selectedCharacter = ConfigurableParams.getData()['character']['select_character']['value'];
        const characterMappings = {
            Big: { bodyName: 'b_big1', headName: 'h_bride' },
            Bride: { bodyName: 'b_bride1', headName: 'h_bride' },
            Harley: { bodyName: 'b_harley1', headName: 'h_harley' },
            Tuxedo: { bodyName: 'b_tuxedo2', headName: 'h_tuxedo' }
        };

        this.accessories = [];
        this._headsParts = [];
        this.bodies3d = [];

        this._asset.traverse((child) => {
            const mapping = characterMappings[selectedCharacter];

            if (child.material) child.material.side = THREE.DoubleSide;

            if (child.name === "b_harley")
                child.material = new THREE.MeshPhongMaterial({ map: THREE.Cache.get('harleybody') }
                )
            if (child.name === "h_harley")
                child.material = new THREE.MeshPhongMaterial({ map: THREE.Cache.get('harleyhead') }
                )
            if (child.name == "glasses" ||
                child.name == "veil" ||
                child.name == "spiderman" ||
                child.name == "moustache") {
                child.visible = false;
                child.scale.set(10, 10, 10)
                child.rotation.set(0, 0, 0)
                child.position.z = 0;
                this.accessories.push(child)
            }
            this.accessories.visible = false;

            if (mapping && child.name === mapping.headName) {
                this._heads = child;

                this._heads.traverse((child) => {
                    child.visible = false;
                    let childName = child.name.toLowerCase();
                    if (childName.includes("mask")) { child.position.y += 0.3; child.scale.set(10, 10, 10); const childmat = new THREE.MeshPhysicalMaterial({ color: 0xffffff }); child.material = childmat; this.mask = child; this.add(this.mask) }
                    if (!childName.includes("h_") && !childName.includes("mask")) {

                        if (childName.includes("ear") || childName.includes("eye")) {
                            const child_l = child.clone();
                            child_l.name += "_l";
                            const child_r = child.clone();
                            child_r.name += "_r";
                            child_r.scale.multiply(this.flipX);
                            child_r.position.multiply(this.flipX);

                            this._heads.add(child_l)
                            this._heads.add(child_r)

                            this._headsParts.push(child_l);
                            this._headsParts.push(child_r);
                        } else
                            this._headsParts.push(child);

                    }
                })
            }
        })




        this._heads.children = this._headsParts;

        this._asset.rotation.set(0, 0, 0);
        this._asset.scale.set(0.4, 0.4, 0.4);

        this._asset.position.set(0, 0, 0);

        this._armature = this._asset.children[0].children[0]
        this._armature.position.set(0, -1.85, 0)
        this._armature.visible = false;
        // this._heads = this._asset.children[0].children[1]
        this._heads.position.set(0, 0, 0)
        this._heads.scale.set(1.6, 1.6, 1.6)
        this._heads.visible = false;

        this.add(this._asset)
        this._initTexture(this._asset)

    }
    _initSpray() {
        console.log("spray")

    }
    _initHands() {
        this._armGroup = new THREE.Group();
        this.add(this._armGroup)

        this._leftArm = THREE.Cache.get("arm").scene;
        this._leftArm.scale.copy(this._heads.scale);
        this._leftArm.rotation.set(0.5, 4.8, 0);
        this._leftArm.traverse((child) => {
            child.material = new THREE.MeshPhysicalMaterial({ color: 0xe5c59a, metalness: 0.2, reflectivity: 1 })
            if (child.name === "ref_position") {
                child.visible = false;
                this.positionref = child;
            }
        });

        this._armGroup.add(this._leftArm);

        this._rightArm = THREE.Cache.get('rightArm').scene;
        this._rightArm.scale.copy(this._heads.scale);
        const scale = new THREE.Vector3(1, 1, -1)
        this._rightArm.scale.multiply(scale);

        this._rightArm.rotation.set(this._leftArm.rotation.x, this._leftArm.rotation.y - 0.3, this._leftArm.rotation.z);
        this._rightArm.traverse((child) => {
            child.material = new THREE.MeshPhysicalMaterial({ color: 0xe5c59a, metalness: 0.2, reflectivity: 1 })
            if (child.name === "ref_position") {
                child.visible = false;
                this.mask = child;
            }
        })

        this._rightArm.position.set(-0.3, this._leftArm.position.y, this._leftArm.position.z)
        this._armGroup.add(this._rightArm);
        this._armGroup.visible = false;

        const radius = 0.1;
        const geometry = new THREE.SphereGeometry(radius, 10, 20);
        const fingerprintTexture = THREE.Cache.get('fingerprint');

        this.customMaterial = new THREE.MeshPhysicalMaterial({
            map: fingerprintTexture,
            blending: THREE.NormalBlending,
            transparent: true,
            opacity: 0.4
        });

        this.sphere = new THREE.Mesh(geometry, this.clayMaterial)
        this.sphere.position.set(0 - radius, this.positionref.position.y + radius * 4, -0.7);
        this._armGroup.add(this.sphere);
        this.fingerprintSphere = new THREE.Mesh(geometry, this.customMaterial);
        this.fingerprintSphere.position.copy(this.sphere.position.x);

        this._armGroup.add(this.fingerprintSphere);


        const armAnimations = THREE.Cache.get('arm').animations;

        if (Array.isArray(armAnimations) && armAnimations.length > 0) {
            const animationsNames = ["sculpt"];

            for (let i = 0; i < animationsNames.length; i++) {
                const animName = animationsNames[i];
                const anim = armAnimations[i];

                this._animations[animName].duration = anim.duration;
                this._animations[animName].mixer = new THREE.AnimationMixer(this._leftArm);
                this._animations[animName].action = this._animations[animName].mixer.clipAction(anim);

                this._rightAnimations[animName].duration = anim.duration;
                this._rightAnimations[animName].mixer = new THREE.AnimationMixer(this._rightArm);
                this._rightAnimations[animName].action = this._rightAnimations[animName].mixer.clipAction(anim);
            }
        }
    }

    _initTexture(asset) {
    }

    playAnim(name) {
        if (this._animations[name].tween != null) this._animations[name].tween.stop();

        this._animations[name].action.play();
        this._rightAnimations[name].action.play();

        if (!this._animations[name].currentTime) {
            this._animations[name].currentTime = 0;
        }

        this._animations[name].currentTime += 0.01;
        if (this._animations[name].currentTime >= this._animations[name].duration) {
            this._animations[name].currentTime = 0
        }

        this._animations[name].mixer.setTime(this._animations[name].currentTime);
        this._rightAnimations[name].mixer.setTime(-this._animations[name].currentTime);

    }

    smooth(callback) {
        this.fingerprintSphere.material.opacity -= 0.01;
        this.playAnim("sculpt");
        this.count++;
        if (this.count >= 100) {
            callback()
        }
        console.log(this.count)
    }
    animateHead() {
        this._heads.morphTargetInfluences[0] = 1;
        this._heads.visible = true;

    }

    stopAnim(name) {
        if (this._animations[name].tween != null) this._animations[name].tween.stop();

    }
    stopIdle(callback) {
        this.idleTweens.forEach(tween => {
            if (tween) {
                tween.stop();
            }
        });
        if (this.objectrotationTween) {
            this.objectrotationTween.end()
            this.objectrotationTween = null;

            this.objectpositionTween.end()
            this.objectpositionTween = null;
            this.object.position.x = 0.05;
            if (callback) callback();
        }

    }
    changeAnim(oldAnimName, newAnimName) {
        this.stopAnim(oldAnimName);
        this.playAnim(newAnimName);
    }

    show(object) {
        this.object = object;

        // Calculate the bounding box based on the children of the object
        const boundingBox = new THREE.Box3();
        if (this.object.isGroup) {
            this.object.children.forEach(child => {
                const childBoundingBox = new THREE.Box3().setFromObject(child);
                boundingBox.union(childBoundingBox);
            });
        } else {
            boundingBox.setFromObject(this.object);
        }

        if (isNaN(boundingBox.min.x) || isNaN(boundingBox.min.y) || isNaN(boundingBox.min.z) ||
            isNaN(boundingBox.max.x) || isNaN(boundingBox.max.y) || isNaN(boundingBox.max.z)) {
            boundingBox.set(
                new THREE.Vector3(0.5, 1, 0.7), // Minimum corner
                new THREE.Vector3(1, 2, 1)    // Maximum corner
            );
        }

        const objectHeight = boundingBox.min.y;
        const pivotOffset = new THREE.Vector3(boundingBox.min.x / 2, boundingBox.min.y / 2, boundingBox.min.z);

        // Target position is always 0,0,0
        const initialPosition = new THREE.Vector3(0, 0, 0);

        const duration = 1000;

        // Calculate the initial position based on the offset
        const targetPosition = new THREE.Vector3(
            initialPosition.x + pivotOffset.x / 2,
            initialPosition.y - pivotOffset.y,
            initialPosition.z + pivotOffset.z
        );

        this.object.position.set(-5, 4, 4);
        this.object.visible = true;

        const tween = new TWEEN.Tween(this.object.position)
            .to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, duration)
            .easing(TWEEN.Easing.Sinusoidal.Out)
            .onComplete(() => {
                // setTimeout(() => { this.idle(this.object); }, 400)
            })
            .start();
    }
    idle(object) {
        this.object = object;
        const duration = 1000;
        const amplitude = 0.1;
        const frequency = 2;

        this.objectrotationTween = new TWEEN.Tween(this.object.rotation)
            .to(
                {
                    x: this.object.rotation.x + amplitude,
                    y: this.object.rotation.y - amplitude,
                },
                duration * 2
            )
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onUpdate(() => {
                const time = performance.now() / 1000;
                const angle = Math.sin(time * frequency) * amplitude;
                this.object.rotation.x = this.object.rotation.x + angle * 2;
            })
            .repeat(Infinity)
            .yoyo(true)
            .start();

        this.objectpositionTween = new TWEEN.Tween(this.object.position)
            .to(
                {
                    x: this.object.position.x - amplitude * 2,
                },
                duration * 1.3
            )
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onUpdate(() => {
                const time = performance.now() / 1000;

                if (time >= duration / 2) {
                    const positionYTween = new TWEEN.Tween(this.object.position)
                        .to(
                            {
                                y: this.object.position.y - amplitude,
                            },
                            duration * 1.2
                        )
                        .easing(TWEEN.Easing.Sinusoidal.InOut)
                        .start();

                    this.idleTweens.push(positionYTween);
                }
            })
            .repeat(Infinity)
            .yoyo(true)
            .start();

        this.idleTweens = [this.objectpositionTween, this.objectrotationTween];

        const animate = () => {
            this.objectpositionTween.update();
            this.objectrotationTween.update();
            requestAnimationFrame(animate);
        };

        animate();
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

    placeMask() {
        this.mask.visible = true;
        const targetpos = new THREE.Vector3(this._heads.position.x, this._heads.position.y, this._heads.position.z + 0.3);
        const targetrotation = new THREE.Vector3(Math.PI / 2, 0, 0);
        this.mask.position.set(-7, 4, 4);
        this.mask.rotation.z += 0.3;
        const tween = new TWEEN.Tween(this.mask.position)
            .to({ x: targetpos.x, y: targetpos.y, z: targetpos.z }, 1000)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .delay(200)
            .onUpdate(() => {
                if (this.mask.position === targetpos) { }
            })
            .onComplete(() => {


            })
            .start();
        const rotatetween = new TWEEN.Tween(this.mask.rotation)
            .to({ x: targetrotation.x, y: targetrotation.y, z: targetrotation.z }, 1000)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .delay(800)
            .onUpdate(() => {
                if (this.mask.rotatetween === targetrotation) console.log("mask");
            })
            .start();
    }

    removeMask(callback) {
        const targetpos = new THREE.Vector3(-4, 4, 10);
        const targetrotation = new THREE.Vector3(0, 0, 0);


        const tween = new TWEEN.Tween(this.mask.position)
            .to({ x: targetpos.x, y: targetpos.y, z: targetpos.z }, 1000)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .delay(800)
            .onUpdate(() => {
                if (this.mask.position === targetpos) console.log("mask");
            })
            .onComplete(() => {
                callback();
            })
            .start();

        const rotatetween = new TWEEN.Tween(this.mask.rotation)
            .to({ x: targetrotation.x, y: targetrotation.y, z: targetrotation.z }, 1000)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .delay(200)
            .onUpdate(() => {
                if (this.mask.rotatetween === targetrotation) console.log("mask");
            })
            .start();
    }
}