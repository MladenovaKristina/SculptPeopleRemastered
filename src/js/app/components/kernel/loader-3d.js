import { TextureLoader, Cache } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import assets from '../../../data/textures/3d/assets_v05.glb';
import can from '../../../data/textures/3d/can.glb';

import head_model_harley from '../../../data/textures/3d/heads/Harly_bsh.glb';
import head_model_ariana from '../../../data/textures/3d/heads/Ariana_bsh.glb';
import head_model_mrbean from '../../../data/textures/3d/heads/MrBin.glb';
import head_model_rock from '../../../data/textures/3d/heads/Rock_bsh.glb';

import bg_image from '../../../data/textures/bg_image.png';
import arm from '../../../data/textures/3d/hand_Sculpting.glb';

import arianagrandehead from '../../../data/textures/3d/alphamap/ArianaG_mask.png';
import harleybody from '../../../data/textures/3d/Harley_Body_D.png';
import harleyhead from '../../../data/textures/3d/alphamap/Harley_mask.png';
import mrbeanhead from '../../../data/textures/3d/alphamap/MrBean_mask.png';
import rockhead from '../../../data/textures/3d/alphamap/Rock_mask.png';

import fingerprint from '../../../data/textures/3d/fingerprints.png';

export default class Loader3D {
  constructor() {
    this.textureLoader = new TextureLoader();
    this.GLBLoader = new GLTFLoader();

    this._count = 0;
  }

  load() {
    const objects = [
      { name: 'assets', asset: assets },
      { name: 'arm', asset: arm },
      { name: 'rightArm', asset: arm },
      { name: 'sprayCan', asset: can },
      { name: 'head_model_harley', asset: head_model_harley },
      { name: 'head_model_ariana', asset: head_model_ariana },
      { name: 'head_model_mrbean', asset: head_model_mrbean },
      { name: 'head_model_rock', asset: head_model_rock }
    ];

    const textures = [
      { name: 'bg_image', asset: bg_image },
      { name: 'fingerprint', asset: fingerprint },
      { name: 'arianagrandehead', asset: arianagrandehead },
      { name: 'harleyhead', asset: harleyhead },
      { name: 'harleybody', asset: harleybody },
      { name: 'mrbeanhead', asset: mrbeanhead },
      { name: 'rockhead', asset: rockhead },

    ];

    this._count = objects.length + textures.length;

    return new Promise((resolve, reject) => {
      if (this._count === 0)
        resolve(null);

      objects.forEach((obj, i) => {
        this.GLBLoader.load(obj.asset, (object3d) => {
          Cache.add(obj.name, object3d);
          this._count--;

          if (this._count === 0)
            resolve(null);
        });
      });

      textures.forEach((txt) => {
        const textureMain = this.textureLoader.load(txt.asset);
        textureMain.flipY = false;
        Cache.add(txt.name, textureMain);

        this._count--;

        if (this._count === 0)
          resolve(null);
      });
    });
  }
}