import * as THREE from "three";
import UTween from "../../../../utils/utween";
import TWEEN from '@tweenjs/tween.js';

export default class Spray extends THREE.Object3D {
  constructor(ui) {
    super();
    this._ui = ui
    this.visible = true;
    this._initView();
  }

  _initView() {
    console.log(THREE.Cache.get("sprayCan").scene);

    this._view = THREE.Cache.get("sprayCan").scene;
    this._view.scale.set(4, 4, 4);

    this.add(this._view);
    this._view.visible = false;

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
    this.showAnim();

    this._canColor.material.color = new THREE.Color(colors[id]);
  }

  showAnim() {


    const targetPosition = this._view.position.clone();
    this._view.position.set(1, -0.5, 1);
    this._view.visible = true;

    const duration = 1000;

    this._viewShowTween = new TWEEN.Tween(this._view.position)
      .to({ x: targetPosition.x, y: targetPosition.y, z: 0.5 }, duration)
      .easing(TWEEN.Easing.Sinusoidal.InOut)

      .onComplete(() => {
        this.idle();
        // if (this._ui._tutorial.visible === false) this._ui._tutorial.show();

      })

      .start();
    const animate = () => {
      this._viewShowTween.update();

      requestAnimationFrame(animate);
    };

    animate();
  }


  onDown() {
    this.stopAnim();

    this._tip.position.z = this._tip.position.z + 0.1;
    console.log("tip spray")
  }

  onUp() {
    this.idle();
    this._tip.position.z = this._tip.position.z - 0.1;
    console.log("tip notspraying")

  }

  hide() {
    this.visible = false;
  }



  idle() {
    const duration = 1000;
    const amplitude = 0.01;
    const frequency = 2;
    this._viewTweenRotation = new TWEEN.Tween(this._view.rotation)
      .to(
        {
          x: this._view.rotation.x + amplitude,
          y: this._view.rotation.y - amplitude,
        },
        duration * 2
      )
      .delay(1000)

      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onUpdate(() => {
        const time = performance.now() / 1000;
        const angle = Math.sin(time * frequency) * amplitude;
        this._view.rotation.x = this._view.rotation.x + angle * 2;
      })
      .repeat(Infinity)
      .yoyo(true)
      .start();

    this._viewTweenPosition = new TWEEN.Tween(this._view.position)
      .to(
        {
          x: this._view.position.x + amplitude * 2,
          y: this._view.position.y + amplitude * 2,

        },
        duration * 1.3
      )
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onUpdate(() => {
        const time = performance.now() / 1000;

        if (time >= duration / 2) {
          this._viewTweenPosition = new TWEEN.Tween(this._view.position.y)
            .to(
              {
                y: this._view.position.y - amplitude
              },
              duration * 1.2
            ).easing(TWEEN.Easing.Sinusoidal.InOut)
        }
      })
      .repeat(Infinity)
      .yoyo(true)
      .start();


    const animate = () => {
      this._viewTweenPosition.update();
      this._viewTweenRotation.update();

      requestAnimationFrame(animate);
    };

    animate();
  }
  stopAnim() {

    if (this._viewTweenPosition) this._viewTweenPosition.end();
    if (this._viewTweenRotation) this._viewTweenRotation.end();
    if (this._viewHideTween) this._viewHideTween.end()

  }
}