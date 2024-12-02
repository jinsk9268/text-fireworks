import Particle from "@/js/particle/Particle.js";
import { SPARK } from "@/js/constants.js";

class SparkParticle extends Particle {
	/**
	 * 불꽃 놀이 잔상 효과
	 * @param {object} params
	 * @param {CanvasRenderingContext2D} params.ctx
	 * @param {boolean} params.isSmallScreen
	 * @param {number} params.x
	 * @param {number} params.y
	 * @param {number} params.vx
	 * @param {number} params.vy
	 * @param {number} params.radius
	 * @param {number} params.opacity
	 * @param {string} params.color
	 */
	constructor({ ctx, isSmallScreen, x, y, vx, vy, radius, opacity, color }) {
		super({ ctx, isSmallScreen, x, y, vx, vy, radius, opacity, color });
	}

	update() {
		this.opacity -= SPARK.OPACITY_ADJUST_RATE;
		this.radius *= SPARK.RADIUS_ADJUST_RATE;

		super.updatePosition();
	}
}

export default SparkParticle;
