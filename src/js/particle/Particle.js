import { randomFloat, setRgbaColor } from "@/js/utils.js";
import { PARTICLE } from "@/js/constants.js";

class Particle {
	constructor({ ctx, isSmallScreen, x, y, vx, vy, radius, opacity, friction, color }) {
		this.ctx = ctx;
		this.isSmallScreen = isSmallScreen;

		this.initParticleVars({ x, y, vx, vy, radius, opacity, friction, color });
	}

	initParticleVars(params = {}) {
		const {
			x = 0,
			y = 0,
			vx = 0,
			vy = 0,
			radius = PARTICLE.RADIUS,
			opacity = randomFloat(PARTICLE.MIN_OPACITY, PARTICLE.MAX_OPACITY),
			friction = PARTICLE.FRICTION,
			color = setRgbaColor(PARTICLE.RGB, opacity),
		} = params;

		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.radius = this.isSmallScreen ? radius * PARTICLE.RADIUS_ADJUST_RATIO : radius;
		this.opacity = opacity;
		this.friction = friction;
		this.fillColor = color;
	}

	draw() {
		this.ctx.beginPath();
		this.ctx.fillStyle = this.fillColor;
		this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		this.ctx.fill();
		this.ctx.closePath();
	}

	updateVelocity() {
		this.vx *= this.friction;
		this.vy *= this.friction;
	}

	updatePosition() {
		this.x += this.vx;
		this.y += this.vy;
	}

	update() {
		this.updateVelocity();
		this.updatePosition();
	}
}

export default Particle;
