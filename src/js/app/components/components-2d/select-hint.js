import ConfigurableParams from '../../../data/configurable_params';
import { Tween, Black, DisplayObject, TextField, Ease, Graphics } from '../../../utils/black-engine.module';
import { TutorialHand } from './tutorial-hand';
import Helpers from '../../helpers/helpers';
export default class SelectHint extends DisplayObject {
  constructor(position) {
    super();
    this.position = position;
    this.scaleX = 1;
    this.scaleY = 1;
    this.y = Black.stage.centerY
    this.visible = false;
  }

  onAdded() {
    const bb = Black.stage.bounds;
    const textValue = 'Choose your clay!';


    this._text = new TextField(
      textValue,
      'Arial',
      0xffffff,
      80
    );

    this._text.weight = 750;
    this._text.strokeColor = 0x000000;
    this._text.strokeThickness = 10;
    if (Helpers.LP(false, true)) {
      this._text.alignAnchor(0.5, 0.5);

    }
    else {
      this._text.alignAnchor(0, 0.5);
    }
    this._text.y = Black.stage.centerY - Black.stage.height / 1.5;
    this._text.x = Black.stage.centerX;

    this.add(this._text);

    this._hand = new TutorialHand();

    this.startX = bb.width / 6;
    this.offset = Black.stage.bounds.width / 5;

    this.clayGroup = new Graphics();
    this.clayGroup.width = bb.width;

    this.clayGroup.height = 100;
    this.add(this.clayGroup)

    const colors = [
      parseInt(ConfigurableParams.getData()['clay']['clay1']['value'].replace('#', '0x')
      ),
      parseInt(ConfigurableParams.getData()['clay']['clay2']['value'].replace('#', '0x')
      ),
      parseInt(ConfigurableParams.getData()['clay']['clay3']['value'].replace('#', '0x')
      )];
    const height = 150;
    const spacing = bb.width / 3;

    for (let i = 0; i < colors.length; i++) {
      let color = colors[i];
      let clay = new Graphics();
      clay.beginPath();
      clay.fillStyle(color, 1);
      clay.lineStyle(5, 0x000000);
      clay.roundedRect(0, 0, height, height, 20);
      clay.fill();
      clay.stroke();
      clay.alignAnchor(0, 0.5)
      clay.x = this.startX / 2 + (spacing * i)
      this.clayGroup.add(clay)
    }

    this._hand.x = this.startX;
    this._hand.y = -30;
    this.add(this._hand);

    if (ConfigurableParams.getData()['hint']['starting_hint_type']['value'] === 'INFINITY ONLY') this._hand.visible = false;
  }

  onResize() {
  }

  show() {
    if (ConfigurableParams.getData()['hint']['starting_hint_type']['value'] === 'NONE') return;

    console.log('show')
    this.visible = true;

    this._hand.start();

    this._makeStep();
  }

  _makeStep() {
    const slidetween = new Tween({
      x: [this.startX, this.startX + this.offset * 3 + this._hand.width / 2, this.startX]
    }, 2, { ease: Ease.linear, delay: 0.5, loop: Infinity });
    this._hand.add(slidetween);

  }

  hide(callback) {
    const hideTween = new Tween({
      y: Black.stage.bounds.bottom + 250
    }, 0.2);

    this.add(hideTween);

    hideTween.on('complete', msg => { this.visible = false; if (callback) callback() });
  }
}

