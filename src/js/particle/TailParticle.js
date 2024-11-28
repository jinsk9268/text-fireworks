import Particle from "@/js/particle/Particle.js";
import { setRgbaColor } from "@/js/utils.js";
import { TAIL } from "@/js/constants.js";

class TailParticle extends Particle {
	/**
	 * 불꽃놀이의 꼬리
	 * @param {object} params
	 * @param {CanvasRenderingContext2D} params.ctx
	 * @param {boolean} params.isSmallScreen
	 * @param {number} params.x
	 * @param {number} params.y
	 * @param {number} params.vy
	 */
	constructor({ ctx, isSmallScreen, x, y, vy }) {
		super({ ctx, isSmallScreen, x, y, vy, color: setRgbaColor(TAIL.DEFAULT_RGB) });
		this.initTailParticleVars();

		this.initialState = { color: this.fillColor };
	}

	initTailParticleVars() {
		this.initialX = this.x;
		this.radian = TAIL.RADIAN;
	}

	update() {
		this.vy *= this.friction;
		this.vx = Math.cos(this.radian) * this.vy * TAIL.X_ADJUST_RATE;

		this.opacity = -this.vy;
		this.radian += TAIL.RADIAN_OFFSET;

		this.updatePosition();
		this.x += (this.initialX - this.x) * TAIL.INITIAL_X_RETURN_RATE;
	}

	/**
	 * TailParticle 멤버 변수 초기화
	 * @param {object} [params]
	 */
	reset(params) {
		super.reset(params);
		this.initTailParticleVars();
	}
}

export default TailParticle;
