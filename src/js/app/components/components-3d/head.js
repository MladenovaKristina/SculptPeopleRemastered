import * as THREE from "three";
import ConfigurableParams from "../../../data/configurable_params";

export default class Head extends THREE.Object3D {
    constructor(headasset, claymaterial) {
        super();

        this._head = headasset.head;
        this.flipX = new THREE.Vector3(-1, 1, 1);

        this._mask = headasset.mask;
        this._claymaterial = claymaterial;
        this._initView();
        this._initMaterials();
        this._initHeadForDrawing();
        this._initMask();

        // this._hideProps();
    }

    _initView() {


        const selectedCharacter = ConfigurableParams.getData()['character']['select_character']['value'];
        const characterMappings = {
            Big: { bodyName: 'b_big1', headName: 'h_rock', model: THREE.Cache.get("head_model_harley").scene.children[0] },
            Bride: { bodyName: 'b_bride1', headName: 'h_bride', model: THREE.Cache.get("head_model_harley").scene.children[0] },
            Harley: { bodyName: 'b_harley1', headName: 'h_harley', model: THREE.Cache.get("head_model_harley").scene.children[0] },
            Tuxedo: { bodyName: 'b_tuxedo2', headName: 'h_tuxedo', model: THREE.Cache.get("head_model_harley").scene.children[0] }
        };

        this.head = characterMappings[selectedCharacter].model;
        this.add(this.head);
        if (selectedCharacter === "Harley") this._initHeadHarley();
        this._initHeadParts();
    }
    _initHeadHarley() {
        this.head.traverse((child) => {
            if (child.isMesh && child.geometry) {
                //why?
                if (child.name === "Harly") {
                    if (child.geometry.computeFaceNormals) {
                        child.geometry.computeFaceNormals();
                        child.geometry.computeVertexNormals();
                    } else {
                        console.warn("computeFaceNormals function not available on this child's geometry.");
                    }
                }

                child.name = child.name.toLowerCase();
                child.visible = false;

                const childName = child.name;
                if (!childName.includes("mask") && childName !== this.head.name) {
                    if (childName.includes("ring") || childName.includes("ear") || childName.includes("eye")) {
                        const child_l = child.clone();
                        const child_r = child.clone();

                        child_r.name += "_r";
                        child_r.scale.multiply(this.flipX);
                        child_r.position.multiply(this.flipX);

                        child_l.name += "_l";
                        this.head.add(child_r);
                    }
                }
            }
        });
    }

    _initHeadParts() {
        this.headParts = this.head.children.filter((child) => {
            const childName = child.name;

            return !childName.includes("mask") && childName !== this.head.name || !childName === "Harly";
        });
        console.log(this.headParts)

        this._eye = this._head.children.find(X => X.name === 'EyeR');
    }
    _initMaterials() {
        this._head.material = new THREE.MeshStandardMaterial({
            metalness: 0,
            roughness: 0.7,
            color: 0xFFCC99,
            morphNormals: true,
            morphTargets: true
        });

        this._head.morphTargetInfluences[0] = 0;
        this._head.morphTargetInfluences[1] = 0;
    }

    _changeClayColor(clayMaterial) {
        let colorClay;

        if (clayMaterial === 0)
            colorClay = ConfigurableParams.getData()['clay']['clay1']['value'].replace('#', '0x');
        if (clayMaterial === 1)

            colorClay = ConfigurableParams.getData()['clay']['clay2']['value'].replace('#', '0x');
        if (clayMaterial === 2)

            colorClay = ConfigurableParams.getData()['clay']['clay3']['value'].replace('#', '0x');
        // this._head.material.color = colorClay;
        // console.log(colorClay)
        //why not change?
    }

    // makes a transparent head copy to draw on it 
    _initHeadForDrawing() {
        this._headForDrawing = this._head.clone();
        this._headForDrawing.position.z = 0.001;
        this.add(this._headForDrawing);

        this._headForDrawing.children.forEach(child => child.visible = false);

        this._headForDrawing.material = new THREE.MeshStandardMaterial({
            metalness: 0,
            roughness: 0.7,
            alphaMap: THREE.Cache.get('harleyhead'),
            transparent: true,
            morphNormals: true,
            morphTargets: true
        });

        this._headForDrawing.visible = false;
    }

    _initMask() {
        this._mask.position.z = 0.01;

        this._mask.material = new THREE.MeshStandardMaterial({
            metalness: 0,
            roughness: 0.7,
            color: 0xcdcdc0
        });

        this._maskForDrawing = this._mask.clone();
        this._maskForDrawing.position.z = 0.011;
        this._head.add(this._maskForDrawing);

        this._maskForDrawing.material = new THREE.MeshStandardMaterial({
            metalness: 0,
            roughness: 0.7,
            transparent: true
        });

        this._maskForDrawing.visible = false;
        this._mask.visible = false;
    }

    _hideProps() {
        this._head.children.forEach(child => child.visible = false);
    }

    // assign out CanvasTexture which we created - as map for mask and head
    updateCanvasTexture(canvasTexture) {
        this._maskForDrawing.material.map = canvasTexture;
        this._headForDrawing.material.map = canvasTexture;
    }

    showMask() {
        this._mask.visible = true;
        this._maskForDrawing.visible = true;
        this._headForDrawing.visible = true;

        this._eye.visible = false;
    }

    hideMask() {
        this._mask.visible = false;
        this._maskForDrawing.visible = false;

        this._eye.visible = true;
    }
}