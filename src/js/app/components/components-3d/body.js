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

  _initBodyCharacter(characterId) {
    if (this._bodyCharacter) this._bodyCharacter.visible = false;
    console.log("character showing", characterId)
    const bodies = ["harley", "big", "bride", "tuxedo"];

    let characterName;
    if (characterId)
      characterName = "b_" + bodies[characterId];
    console.log(bodies[characterId])

    this._bodyCharacter = this._bodies.children.find(x => x.name.includes(characterName));

    this._bodyCharacter.frustumCulled = false;
    this._bodyCharacter.visible = true;
    this._initCharacterSize(characterName);
  }

  showBodyCharacter(character) {
    this._initBodyCharacter(character);
  }

  get rig() {
    return this._bones;
  }

  _initCharacterSize(characterName) {
    const defaultPosition = new THREE.Vector3(0, -0.35, 0.6);

    const scaleup = new THREE.Vector3(0.007, 0.007, 0.007)
    const scaledown = new THREE.Vector3(0.0035, 0.0035, 0.0035)

    const defaultScale = new THREE.Vector3(0.004999999888241291, 0.004999999888241291, 0.004999999888241291);

    if (characterName.includes("harley")) {
      this._armature.scale.copy(defaultScale);

      this._armature.position.y = defaultPosition.y;

      this._armature.position.z = defaultPosition.z + 0.1;
    }

    if (characterName.includes("bride")) {
      this._armature.scale.copy(scaledown);
      this._armature.position.y = defaultPosition.y + 0.1;

      this._armature.position.z = defaultPosition.z - 0.1;

    }
    if (characterName.includes("big")) {
      this._armature.scale.copy(scaleup);
      this._armature.position.y = defaultPosition.y - 0.1;
      this._armature.position.z = defaultPosition.z + 0.3;

    }
  }
}