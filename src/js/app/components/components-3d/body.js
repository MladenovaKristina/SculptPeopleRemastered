import ConfigurableParams from "../../../data/configurable_params";
import * as THREE from "three";
import { SkeletonUtils } from "../../../utils/skeleton-utils";

export default class Body extends THREE.Object3D {
  constructor(armature, stand) {
    super();
    this._armature = armature;
    this._stand = stand;
    this._initBodies();
  }

  _initBodies() {
    const bodies = this._bodies = this._armature;
    this.add(bodies);

    bodies.children.forEach(body => body.visible = false);

    this._bones = bodies.children.find(x => x.type === 'Bone');

  }

  _initBodyCharacter(character) {
    let characterName;
    if (character)
      characterName = character;
    else {
      characterName = "b_";
      characterName = characterName + ConfigurableParams.getData()['character']['select_character']['value'].toLowerCase(); console.log(characterName)
    }


    this._bodyCharacter = this._bodies.children.find(x => x.name === characterName);

    this._bodyCharacter.frustumCulled = false;
    this._bodyCharacter.visible = true;

  }

  showBodyCharacter(character) {
    this._initBodyCharacter(character);
  }

  get rig() {
    return this._bones;
  }
}