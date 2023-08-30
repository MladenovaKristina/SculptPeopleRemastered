import ConfigurableParams from '../../../../data/configurable_params'

import { Object3D, Group, Cache, CylinderGeometry, MeshPhongMaterial, DoubleSide, Vector3, PlaneGeometry, Mesh } from 'three';
export default class Environment extends Object3D {
    constructor() {
        super();
        this.visible = true;
        this.flipX = new Vector3(1, 1, 1);
        this.init()
    }
    init() {
        this._initAssets();
        this._initBackground();
        this._initStand();
    }
    _initStand() {
        this.stand = new Group();
        this.stand.position.x = 0;
        this.add(this.stand);

        const cylinderGeometry = new CylinderGeometry(0.1, 0.1, 5, 10);
        const cylinderMaterial = new MeshPhongMaterial({ color: 0xdadada, metalness: 1, reflectivity: 10 });

        const cylinder = new Mesh(cylinderGeometry, cylinderMaterial);
        cylinder.position.y = -2;

        this.stand.add(cylinder);

        const baseGeometry = new CylinderGeometry(1.5, 1.5, 0.1, 30);
        const base = new Mesh(baseGeometry, cylinderMaterial);
        base.position.y = -4.5;

        this.stand.add(base);
        this.stand.scale.set(0.1, 0.1, 0.1);
    }

    _initAssets() {
        this._assets = Cache.get("assets").scene;
        this.add(this._assets);
        this._assets.visible = false;

        const selectedCharacter = ConfigurableParams.getData()['character']['select_character']['value'];
        const characterMappings = {
            Big: { bodyName: 'b_big1', headName: 'h_rock' },
            Bride: { bodyName: 'b_bride1', headName: 'h_bride' },
            Harley: { bodyName: 'b_harley1', headName: 'h_harley' },
            Tuxedo: { bodyName: 'b_tuxedo2', headName: 'h_tuxedo' }
        };

        this.accessories = [];
        this.headParts = [];
        this.bodies = []

        this._assets.traverse((child) => {
            child.receiveShadow = true;
            child.castShadow = true;
            child.material = new MeshPhongMaterial({ color: 0x555555 });
            child.material.side = DoubleSide;

            if (child.name === "Armature") {
                this.armature = child;
            }
            if (child.name === "Heads") { this.heads = child; }
        })

        this.armature.position.set(0, -1.065, 0);
        this.armature.traverse((bodies) => {
            bodies.rotation.set(0, 0, 0);
            bodies.visible = false;

            if (bodies.name.includes("b_")) {
                this.bodies.push(bodies)
            }

        })

        this.heads.traverse((head) => {
            if (head.name == "glasses" ||
                head.name == "veil" ||
                head.name == "spiderman" ||
                head.name == "moustache") {
                head.visible = false;
                head.rotation.set(Math.PI / 2, 0, 0);
                this.accessories.push(head)
            }
            const mapping = characterMappings[selectedCharacter];

            if (mapping && head.name === mapping.headName) {
                this.head = head;

            } else if (head.name.includes("h_"))
                head.visible = false;
        })

        this.initHeadParts()
    }

    initHeadParts() {
        this.head.traverse((child) => {
            const childName = child.name.toLowerCase();
            child.visible = false;
            if (!childName.includes("mask") && childName != this.head.name) {
                if (childName.includes("ring") || childName.includes("ear") || childName.includes("eye")) {

                    const child_r = child.clone();
                    child_r.name += "_r";
                    child_r.scale.multiply(this.flipX);
                    child_r.position.multiply(this.flipX);
                    this.head.add(child_r)

                    child.name += "_l";
                    this.headParts.push(child);
                    this.headParts.push(child_r);
                }
                else
                    this.headParts.push(child);
            } else if (childName.includes("mask")) {
                this.mask = child;
                this.mask.material = new MeshPhongMaterial({ color: 0xffffff })
            }

        });

        this.head.children = this.head.children.concat(...this.accessories)
    }

    _initBackground() {
        const backgroundGeometry = new PlaneGeometry(35, 35);
        const backgroundMaterial = new MeshPhongMaterial({ map: Cache.get("bg_image") });
        backgroundMaterial.side = DoubleSide;

        const backgroundMesh = new Mesh(backgroundGeometry, backgroundMaterial);
        backgroundMesh.position.set(0, 0, -15);
        backgroundMesh.rotation.z = Math.PI;
        backgroundMesh.rotation.y = Math.PI;

        this.add(backgroundMesh);

        const geo = new PlaneGeometry(8, 1);
        const mat = new MeshPhongMaterial({ transparent: true, opacity: 0.9, color: 0x000000 });
        this.bg = new Mesh(geo, mat);
        this.bg.visible = false;
        this.bg.scale.set(0.1, 0.1, 0.1)
        this.add(this.bg);

    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;

        this.messageDispatcher.post(this.onFinishEvent);
    }


}