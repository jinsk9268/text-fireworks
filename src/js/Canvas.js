import CanvasOption from "@/js/CanvasOption.js";
import ParticleManager from "@/js/particle/ParticleManager.js";
import { TAIL, PARTICLE, ANIMATION, SCREEN } from "@/js/constants.js";
import { randomInt } from "@/js/utils.js";

const { TYPE_TAIL } = PARTICLE;

class Canvas extends CanvasOption {
	constructor() {
		super();
		this.initCanvasVars();
	}

	init() {
		super.init();

		this.canvas.width = this.canvasCssWidth * this.dpr;
		this.canvas.height = this.canvasCssHeight * this.dpr;
		this.ctx.scale(this.dpr, this.dpr);

		this.canvas.style.width = `${this.canvasCssWidth}px`;
		this.canvas.style.height = `${this.canvasCssHeight}px`;

		this.mainTailVY = this.calculateTailVY(this.mainY);
		this.createTailPosX();
		this.createTailVY();

		this.pm.isSmallScreen = this.isSmallScreen;
	}

	initCanvasVars() {
		this.animationId = undefined;

		this.text = "";
		this.textLength = 0;

		this.tailQty = TAIL.BASE_QTY;
		this.mainTailVY = 0;
		this.tailsLeftPosX = [];
		this.tailsRightPosX = [];
		this.tailsVY = [];
		this.tailCount = 0;
		this.isLeft = false;

		this.tailParticles = [];

		this.pm = new ParticleManager(this.ctx, this.isSmallScreen);
	}

	createTailPosX() {
		const length = this.tailQty;
		const exclusionDist = this.isSmallScreen ? TAIL.SMALL_EXCLUSION : TAIL.EXCLUSION;
		const leftStart = this.canvasCssWidth * TAIL.START_X_RATIO;
		const leftEnd = this.mainX - exclusionDist;
		const rightStart = this.mainX + exclusionDist;
		const xOffset = (leftEnd - leftStart) / (length - 1);

		this.tailsLeftPosX = Array.from({ length }, (_, i) => Math.floor(leftStart + i * xOffset));
		this.tailsRightPosX = Array.from({ length }, (_, i) => Math.floor(rightStart + i * xOffset));
	}

	/**
	 * @param {number} yPos
	 * @returns y좌표를 인자로 받아 y의 속도를 반환
	 */
	calculateTailVY(yPos) {
		return (yPos - this.canvasCssHeight) / this.interval;
	}

	createTailVY() {
		const length = this.tailQty;
		const minTailVY = this.calculateTailVY(this.canvasCssHeight * TAIL.MIN_Y_RATIO);
		const maxTailVY = this.calculateTailVY(this.canvasCssHeight * TAIL.MAX_Y_RATIO);
		const vyOffset = (maxTailVY - minTailVY) / (length - 1);

		this.tailsVY = Array.from({ length }, (_, i) => minTailVY + i * vyOffset);
	}

	createTailParticle() {
		let params = { y: this.canvasCssHeight };

		if (this.tailCount === 0) {
			params.x = this.mainX;
			params.vy = this.mainTailVY;
		} else {
			const max = this.tailQty - 1;
			params.x = (this.isLeft ? this.tailsLeftPosX : this.tailsRightPosX)[randomInt(0, max)];
			params.vy = this.tailsVY[randomInt(0, max)];
		}
		this.tailParticles.push(this.pm.acquireParticle(TYPE_TAIL, params));

		this.tailCount = (this.tailCount + 1) % this.tailQty;
		this.isLeft = !this.isLeft;
	}

	updateTailParticle() {
		for (let i = this.tailParticles.length - 1; i >= 0; i--) {
			const tail = this.tailParticles[i];
			tail.update();
			tail.draw();

			if (tail.opacity <= TAIL.OPACITY_LIMIT) {
				this.tailParticles.splice(i, 1);
				this.pm.returnToPool(TYPE_TAIL, tail);
			}
		}
	}

	animateFireworks() {
		let then = document.timeline.currentTime;
		let frameCount = 0;

		/**
		 * requestAnimationFrame에 전달할 콜백 함수
		 * @param {number} now requestAnimationFrame의 timestamp (밀리 초)
		 */
		const frame = (now) => {
			const delta = now - then;
			frameCount = (frameCount + 1) % ANIMATION.TAIL_FPS;

			if (delta >= this.interval) {
				// TODO: 애니메이션 코드 업데이트
				this.fillFullCanvas(SCREEN.BG_RGBA);

				if (frameCount === 0) this.createTailParticle();

				this.updateTailParticle();

				then = now - (delta % this.interval);
			}

			this.animationId = requestAnimationFrame(frame);
		};

		this.animationId = requestAnimationFrame(frame);
	}

	render() {
		if (this.text !== "") {
			this.animateFireworks();
		}
	}
}

export default Canvas;
