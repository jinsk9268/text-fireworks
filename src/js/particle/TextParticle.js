import Particle from "@/js/particle/Particle.js";
import { TEXT } from "@/js/constants.js";

class TextParticle extends Particle {
	/**
	 * 불꽃놀이의 글자
	 * @param {object} params
	 * @param {CanvasRenderingContext2D} params.ctx
	 * @param {boolean} isSmallScreen
	 * @param {number} x
	 * @param {number} y
	 * @param {number} vx
	 * @param {number} vy
	 * @param {string} color
	 */
	constructor({ ctx, isSmallScreen, x, y, vx, vy, color }) {
		super({ ctx, isSmallScreen, x, y, vx, vy, color });

		this.gravity = TEXT.GRAVITY;
	}

	update() {
		this.opacity -= TEXT.OPACITY_OFFSET;
		this.vy += this.gravity;
		super.update();
	}
}

export default TextParticle;
