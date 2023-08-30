import * as THREE from "three";

export default class Head extends THREE.Object3D {
    constructor(headasset) {
        super();

        this._head = headasset.head;

        this._mask = headasset.mask;
        this._initView();
        this._initMaterials();
        this._initHeadForDrawing();
        this._initMask();

        // this._hideProps();
    }

    _initView() {
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

        // makes a transparent mask copy to draw on it 
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
        //         this._mask.visible = false;
        //         this._maskForDrawing.visible = false;
        // 
        //         this._eye.visible = true;
    }
}