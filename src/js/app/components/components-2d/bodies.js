import config from '../../../data/config';
import { GameObject, Sprite, Graphics, Black, Tween, Ease } from '../../../utils/black-engine.module';

export default class Bodies extends GameObject {
    constructor(bg) {
        super();
        this._bg = bg;
        this._text = null;
        this._container = null;

        this.visible = false;
        this.init();
    }

    init() {
        const height = 320;
        const bb = Black.stage.bounds;

        if (this._bg) this._bg.clear();
        this._bg = new Graphics();
        this._bg.beginPath();
        this._bg.fillStyle(0x000000, 0.9);
        this._bg.rect(bb.left, bb.bottom - height - 110, bb.width, height * 2);
        this._bg.fill();
        this.add(this._bg);
        this._bg.visible = false;

        const totalWidth = this._bg.width || bb.width;
        const startY = bb.bottom - height - 100;

        const bodies = ["harley", "big", "bride", "tuxedo"];

        for (let i = 0; i < bodies.length; i++) {
            const body = new Sprite(bodies[i]);
            body.alignAnchor(0.5, 0)
            const spacing = totalWidth / (bodies.length);

            body.x = spacing / 2 + (spacing * i)
            body.y = startY;
            this._bg.add(body);
        }
    }


    hide() {
        const hideTween = new Tween({
            y: Black.stage.bounds.bottom + 250
        }, 0.2);

        this.add(hideTween);

        hideTween.on('complete', msg => this._bg.visible = false);
    }
    show() {
        this._bg.visible = true;
    }
}
