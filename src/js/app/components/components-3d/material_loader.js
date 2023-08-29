import ConfigurableParams from "../../../data/configurable_params";

import { MeshPhongMaterial, NormalBlending, Cache, DoubleSide } from "three";

export default class MaterialLoader {
    constructor(assets) {
        this._assets = assets;

        this._init()
    }

    _initClayMaterial(clayMaterial) {
        const colors = [
            ConfigurableParams.getData()['clay']['clay1']['value'].replace('#', '0x')
            ,
            ConfigurableParams.getData()['clay']['clay2']['value'].replace('#', '0x')
            ,
            ConfigurableParams.getData()['clay']['clay3']['value'].replace('#', '0x')
        ];

        this.clayMaterial = new MeshPhongMaterial({ color: colors[clayMaterial] })
        this._assets.traverse((child) => {
            const childName = child.name.toLowerCase();
            if (childName.includes("ear") && !childName.includes("ring") || childName.startsWith("h_") && !childName.includes("hair") && !childName === "h_mask") {
                child.material = this.clayMaterial;
                console.log(child.name)
            }

        })
    }

    _init() {
        const whiteMaterial = new MeshPhongMaterial({
            color: 0xffffff, side: DoubleSide,
        })
        const blackMaterial = new MeshPhongMaterial({ color: 0x000000 })
        this.skinMaterial = new MeshPhongMaterial({
            color: 0xF5F5DC, blending: NormalBlending, side: DoubleSide,

        })
        const goldMaterial = new MeshPhongMaterial({ color: 0xFFD700 })

        this._assets.traverse((child) => {
            const childName = child.name.toLowerCase()
            child.material.side = DoubleSide;
            if (childName === "b_big") {
                child.children[0].material = blackMaterial;
                child.children[1].material = this.skinMaterial;
                child.children[2].material = whiteMaterial;
            }
            if (childName === "b_bride") {

                child.children[0].material = this.skinMaterial;
                child.children[1].material = whiteMaterial;

            }
            if (childName === "b_harley") { child.material = new MeshPhongMaterial({ map: Cache.get("harleybody") }) }
            if (childName === "b_tuxedo") {
                child.children[0].material = blackMaterial;
                child.children[1].material = this.skinMaterial;
                child.children[2].material = whiteMaterial;

            }

            if (childName === "h_harley") { child.material = new MeshPhongMaterial({ map: Cache.get("harleyhead") }) }
            if (childName === "h_tuxedo") { child.material = new MeshPhongMaterial({ map: Cache.get("mrbeanhead") }) }
            if (childName === "h_bride") { child.material = new MeshPhongMaterial({ map: Cache.get("arianagrandehead") }) }
            if (childName === "h_rock") { child.material = new MeshPhongMaterial({ map: Cache.get("rockhead") }) }

            if (childName === "Heads" || childName.includes("ear")) { child.material = whiteMaterial }

            if (childName.includes("eye")) {
                child.material = whiteMaterial.clone();
                child.material.map = Cache.get("arianagrandehead");
            }

            if (childName.includes("mask") || childName.includes("clip") || childName === "h_mask") { child.material = whiteMaterial; }
            if (childName.includes("ring")) { child.material = goldMaterial }

            if (childName.includes("hair") && !childName.includes("clip") || childName === "moustache") { child.material = new MeshPhongMaterial({ color: 0x664238 }) }

            if (childName === "glasses") { child.material = blackMaterial }

            if (childName === "spiderman") { child.material = new MeshPhongMaterial({ color: 0xff0000 }) }

            if (childName === "veil") { child.material = whiteMaterial }

            if (childName === "hair3") { child.material = new MeshPhongMaterial({ color: 0xfaf0be }) }

            if (childName.includes("teeth")) { child.material = whiteMaterial; }

        })


    }

    setClay(id) {
        const colors = [
            ConfigurableParams.getData()['clay']['clay1']['value'].replace('#', '0x')
            ,
            ConfigurableParams.getData()['clay']['clay2']['value'].replace('#', '0x')
            ,
            ConfigurableParams.getData()['clay']['clay3']['value'].replace('#', '0x')
        ];

        console.log(colors[id]);
        this._initClayMaterial(colors[id])
    }
}