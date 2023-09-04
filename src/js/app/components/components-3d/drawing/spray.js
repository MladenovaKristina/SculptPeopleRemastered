import * as THREE from "three";
import UTween from "../../../../utils/utween";

export default class Spray extends THREE.Object3D {
  constructor() {
    super();

    this.visible = true;
    this._initView();
  }

  _initView() {
    console.log(THREE.Cache.get("sprayCan").scene);

    this._view = THREE.Cache.get("sprayCan").scene;
    this._view.scale.set(4, 4, 4);

    this.add(this._view);

    this._view.traverse((child) => {
      child.material = new THREE.MeshPhongMaterial({
        color: 0xeeeeee,
        metalness: 10,
        reflectivity: 1,
      })
      if (child.name === "Mesh_1") {
        this._canColor = child
      }
      if (child.name === "tip") {
        this._tip = child;
      }
    })


  }

  setColor(id) {
    const colors = [0x00ff00, 0xff0000, 0x0000ff, 0x0f0f0f, 0x000000];
    console.log("this view", colors[id])

    this._canColor.material.color = new THREE.Color(colors[id]);
  }

  show() {
    this.visible = true;
    this.position.set(1.5, 0, 0);

    new UTween(this.position, {
      x: 0
    }, 0.4);
  }

  onDown() {
    this._tip.position.z = this._tip.position.z + 0.1;
    console.log("tip spray")
  }
  onUp() {
    this._tip.position.z = this._tip.position.z - 0.1;
    console.log("tip notspraying")

  }

  hide() {
    this.visible = false;
  }
}