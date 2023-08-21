import * as THREE from "three";
import Helpers from "../../helpers/helpers";

export default class SceneObjects
    extends THREE.Object3D {
    constructor() {
        super();
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
        console.log("Environment")

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
        this._asset.visible = true;
        const material = new THREE.MeshPhongMaterial({ color: 0x555555, transparent: true, opacity: 0.5 })
        this._asset.traverse((child) => {
            if (child.name === "b_harley")
                child.material = new THREE.MeshPhongMaterial({ map: THREE.Cache.get('harleybody') }
                )
            if (child.name === "h_harley")
                child.material = new THREE.MeshPhongMaterial({ map: THREE.Cache.get('harleyhead') }
                )
        })

        this._asset.rotation.set(0, 0, 0);
        this._asset.scale.set(0.4, 0.4, 0.4);
        this._asset.position.set(0, 0, 0);

        this._armature = this._asset.children[0].children[0]
        this._armature.position.set(0, -1.85, 0)

        this._heads = this._asset.children[0].children[1]
        this._heads.position.set(0, 0, 0)
        this._heads.scale.set(1.6, 1.6, 1.6)
        this.add(this._asset)
        console.log(this._asset)
        this._initTexture(this._asset)

    }
    _initSpray() {
        console.log("spray")

    }
    _initHands() {
        this._armGroup = new THREE.Group();
        this.add(this._armGroup)

        this.leftArm = THREE.Cache.get("arm").scene;
        this.leftArm.scale.copy(this._heads.scale);
        this.leftArm.rotation.set(0.5, 4.8, 0);
        this.leftArm.traverse((child) => {
            child.material = new THREE.MeshPhysicalMaterial({ color: 0xe5c59a, metalness: 0.2, reflectivity: 1 })
        });

        this._armGroup.add(this.leftArm);

        this.rightArm = THREE.Cache.get('rightArm').scene;
        this.rightArm.scale.copy(this._heads.scale);
        const scale = new THREE.Vector3(1, 1, -1)
        this.rightArm.scale.multiply(scale);

        this.rightArm.rotation.set(this.leftArm.rotation.x, this.leftArm.rotation.y - 0.3, this.leftArm.rotation.z);
        this.rightArm.traverse((child) => {
            child.material = new THREE.MeshPhysicalMaterial({ color: 0xe5c59a, metalness: 0.2, reflectivity: 1 })
            if (child.name === "ref_position") {
                child.visible = false;
            }
        })
        this.rightArm.position.set(-0.3, this.leftArm.position.y, this.leftArm.position.z)
        this._armGroup.add(this.rightArm);
        this._armGroup.position.set(1, 0, 0)

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

        this.sphere.position.set(this._heads.position.x, this._heads.position.y + radius / 2, 0)
        this._armGroup.add(this.sphere);
        this.fingerprintSphere = new THREE.Mesh(geometry, this.customMaterial);
        this.fingerprintSphere.position.set(this.sphere.position.x, this.sphere.position.y, this.sphere.position.z);

        this._armGroup.add(this.fingerprintSphere);

        console.log(THREE.Cache.get("arm").animations)
        const animationsNames = ["sculpt"];
        const armAnimations = THREE.Cache.get('arm').animations;

        for (let index = 0; index < animationsNames.length; index++) {
            const animName = animationsNames[index];
            const anim = armAnimations.find(a => a.name === animName);

            if (anim) {
                this._animations[animName].duration = anim.duration;
                this._animations[animName].mixer = new THREE.AnimationMixer(this.leftArm);
                this._animations[animName].action = this._animations[animName].mixer.clipAction(anim);

                this._rightAnimations[animName].duration = anim.duration;
                this._rightAnimations[animName].mixer = new THREE.AnimationMixer(this.rightArm);
                this._rightAnimations[animName].action = this._rightAnimations[animName].mixer.clipAction(anim);
            }
        }
    }

    _initTexture(asset) {
        console.log("initTextures", asset)
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

    smooth() {
        this.fingerprintSphere.material.opacity -= 0.01;
    }


    stopAnim(name) {
        if (this._animations[name].tween != null) this._animations[name].tween.stop();

        if (this.groupTweenRotation && this.groupTweenPosition) {
            this.groupTweenPosition.end();
            this.groupTweenRotation.end();
            this.groupTweenPosition = null;
            this.groupTweenRotation = null;
            this.group.visible = false;
        }
    }

    changeAnim(oldAnimName, newAnimName) {
        this.stopAnim(oldAnimName);
        this.playAnim(newAnimName);
    }
}