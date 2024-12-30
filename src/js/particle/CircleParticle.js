import Particle from "@/js/particle/Particle.js";
import { CIRCLE } from "@/js/constants.js";

class CircleParticle extends Particle {
	/**
	 * 불꽃놀이 원형 효과
	 * @param {object} params
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {boolean} isSmallScreen
	 * @param {number} x
	 * @param {number} y
	 * @param {number} vx
	 * @param {number} vy
	 * @param {number} radius
	 * @param {number} opacity
	 * @param {string} [color]
	 */
	constructor({ ctx, isSmallScreen, x, y, vx, vy, radius, opacity, color }) {
		super({ ctx, isSmallScreen, x, y, vx, vy, radius, opacity, friction: CIRCLE.FRICTION, color });
		this.gravity = CIRCLE.GRAVITY;

		this.initialState = { friction: CIRCLE.FRICTION };
	}

	draw() {
		this.ctx.save();
		this.ctx.shadowBlur = CIRCLE.SHADOW_BLUR;
		this.ctx.shadowColor = this.fillColor;
		super.draw();
		this.ctx.restore();
	}

	update() {
		this.radius += CIRCLE.RADIUS_ADJUST_OFFSET;
		this.opacity -= CIRCLE.OPACITY_ADJUST_OFFSET;
		this.vy += this.gravity;
		super.update();
		this.radius *= CIRCLE.RADIUS_ADJUST_RATE;
	}
}

export default CircleParticle;
