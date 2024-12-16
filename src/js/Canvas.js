import CanvasOption from "@/js/CanvasOption.js";
import ParticleManager from "@/js/particle/ParticleManager.js";
import TextData from "@/js/TextData.js";
import { TAIL, PARTICLE, ANIMATION, SCREEN, FONT, TEXT, CIRCLE, SPARK } from "@/js/constants.js";
import { randomInt, setHslaColor, isEven, randomFloat, setRgbaColor } from "@/js/utils.js";

const { TYPE_TAIL, TYPE_TEXT, TYPE_CIRCLE, TYPE_SPARK } = PARTICLE;

class Canvas extends CanvasOption {
	/**
	 * 애니메이션을 실행할 캔버스 클래스
	 * - 화면에 불꽃놀이와 텍스트 파티클을 그리기 위한 기능을 제공
	 * - CanvasOption을 확장하여 캔버스의 다양한 설정을 관리
	 */
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
		this.pm.maxPoolSize[TYPE_TEXT] *= this.textLength;
		this.pm.maxPoolSize[TYPE_SPARK] *= this.textLength;
	}

	initCanvasVars() {
		this.animationId = undefined;

		this.text = "";
		this.textLength = 0;
		this.mainTextData = {};
		this.subTextData = {};

		this.tailQty = TAIL.BASE_QTY;
		this.mainTailVY = 0;
		this.tailsLeftPosX = [];
		this.tailsRightPosX = [];
		this.tailsVY = [];
		this.tailCount = 0;
		this.isLeft = false;

		this.tailParticles = [];
		this.textParticles = [];
		this.circleParticles = [];
		this.sparkParticles = [];

		this.pm = new ParticleManager(this.ctx, this.isSmallScreen);
	}

	/**
	 * @param {number} fontSize
	 * @returns {number} 사용자가 입력한 문자열의 width를 반환
	 */
	getTextWidth(fontSize) {
		this.ctx.font = this.setFontStyle(fontSize);
		return this.ctx.measureText(this.text).width;
	}

	adjustFontSize() {
		const maxWidth = this.canvasCssWidth * SCREEN.MAX_WIDTH_RATIO;
		let textWidth = this.getTextWidth(this.mainFontSize);

		if (textWidth < maxWidth) return;

		const minFontSize = this.mainFontSize * FONT.MIN_SIZE_RATIO;
		let tempSize = this.mainFontSize;

		while (textWidth > maxWidth && tempSize > minFontSize) {
			tempSize *= FONT.ADJUST_RATIO;
			textWidth = this.getTextWidth(tempSize);
		}

		if (tempSize < minFontSize) tempSize = minFontSize;

		this.mainFontSize = this.setMainFontSize(tempSize);
		this.subFontSize = this.setSubFontSize();
	}

	/**
	 * @param {number} fontSize
	 * @returns {object} 캔버스에 그려진 텍스트의 픽셀 데이터 반환
	 */
	getTextData(fontSize) {
		const textData = new TextData(this.text, fontSize);
		textData.drawText();

		return textData.textPixelData;
	}

	createTextDatas() {
		this.adjustFontSize();

		this.mainTextData = this.getTextData(this.mainFontSize);
		this.subTextData = this.getTextData(this.subFontSize);
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
	 * @returns {number} y좌표를 인자로 받아 y의 속도를 반환
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

			const sparkQty = Math.round(Math.abs(tail.vy * SPARK.TAIL_CREATION_RATE));
			for (let i = 0; i < sparkQty; i++) {
				const sparkParams = {
					x: tail.x,
					y: tail.y,
					vx: randomFloat(SPARK.TAIL_MIN_VX, SPARK.TAIL_MAX_VX),
					vy: randomFloat(SPARK.TAIL_MIN_VY, SPARK.TAIL_MAX_VY),
					opacity: randomFloat(SPARK.TAIL_MIN_OPACITY, SPARK.TAIL_MAX_OPACITY),
					color: tail.fillColor,
				};
				this.sparkParticles.push(this.pm.acquireParticle(TYPE_SPARK, sparkParams));
			}

			if (tail.belowOpacityLimit(TAIL.OPACITY_LIMIT)) {
				this.createTextParticle(tail.x, tail.y);
				this.createCircleParticle(tail.x, tail.y);

				this.tailParticles.splice(i, 1);
				this.pm.returnToPool(TYPE_TAIL, tail);
			}
		}
	}

	/**
	 * @param {number} x
	 * @returns {boolean} x좌표가 메인 위치에 있으면 true 반환, 그 외의 영역은 false 반환
	 */
	isMain(x) {
		return x > this.tailsLeftPosX.at(-1) && x < this.tailsRightPosX.at(0);
	}

	/**
	 * @param {object} params
	 * @param {number} params.stringCenterX 문자열 중심의 x좌표 (물리적 크기)
	 * @param {number} params.stringCenterY 문자열 중심의 y좌표 (물리적 크기)
	 * @param {number} params.w 픽셀 데이터의 현재 가로 위치 (물리적 크기)
	 * @param {number} params.h 필셀 데이터의 현재 세로 위치 (물리적 크기)
	 * @param {number} params.x 꼬리의 x좌표 (css 크기)
	 * @param {number} params.y 꼬리의 y좌표 (css 크기)
	 * @returns {object} TextParticle x,y 좌표의 초기 속도 반환
	 */
	calculateTextParticleVelocity({ stringCenterX, stringCenterY, w, h, x, y }) {
		const targetX = (stringCenterX + w) / this.dpr;
		const targetY = (stringCenterY + h) / this.dpr;

		return { vx: (targetX - x) / this.interval, vy: (targetY - y) / this.interval };
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 */
	createTextParticle(x, y) {
		const { data, width, height, fontBoundingBoxAscent, fontBoundingBoxDescent } = this.isMain(x) ? this.mainTextData : this.subTextData;
		const stringCenterX = x * this.dpr - width / 2;
		const stringCenterY = y * this.dpr - (height + fontBoundingBoxAscent + fontBoundingBoxDescent) / 2;

		const particleFrequency = this.isSmallScreen ? TEXT.SMALL_FREQUENCY : TEXT.GENERAL_FREQUENCY;
		for (let h = 0; h < height; h += particleFrequency) {
			for (let w = 0; w < width; w += particleFrequency) {
				const index = (h * width + w) * 4;
				const alpha = data[index + 3];

				if (alpha > 0) {
					const { vx, vy } = this.calculateTextParticleVelocity({ stringCenterX, stringCenterY, w, h, x, y });
					const params = { x, y, vx, vy, color: setHslaColor({ hue: randomInt(TEXT.MIN_HUE, TEXT.MAX_HUE) }) };

					this.textParticles.push(this.pm.acquireParticle(TYPE_TEXT, params));
				}
			}
		}
	}

	updateTextParticle() {
		for (let i = this.textParticles.length - 1; i >= 0; i--) {
			const text = this.textParticles[i];
			text.update();
			text.draw();

			if (text.belowOpacityLimit() || this.isOutOfCanvasArea(text.x, text.y)) {
				this.textParticles.splice(i, 1);
				this.pm.returnToPool(TYPE_TEXT, text);
			}
		}
	}

	/**
	 * @param {number} textWidth
	 * @returns {number} 문자열 width의 절반 또는 글자당 width중 더 큰 값을 기준으로 계층별 간격 반환
	 */
	calculateLayerOffset(textWidth) {
		const radiusFromCssWidth = textWidth / 2 / this.dpr;
		const radiusFromCharWidth = textWidth / this.textLength;

		return Math.max(radiusFromCssWidth, radiusFromCharWidth) / CIRCLE.LAYERS;
	}

	/**
	 * @param {number} circleIdx
	 * @returns {object} 삼각함수 계산에 필요한 코사인, 사인값 반환
	 */
	calculateCosSin(circleIdx) {
		const angleDegree = CIRCLE.PER_ANGLE * circleIdx;
		const radian = PARTICLE.DEGREE_TO_RADIAN * angleDegree;

		return { xCos: Math.cos(radian), ySin: Math.sin(radian) };
	}

	/**
	 * @param {number} layerIdx
	 * @param {number} circleIdx
	 * @param {number} layerOffset
	 * @param {number} textLengthOffset
	 * @returns {number} 생성지점으로부터의 레이어별 CircleParticle의 거리 반환
	 */
	calculateDistFromCreationPoint(layerIdx, circleIdx, layerOffset, textLengthOffset) {
		const dist = layerOffset + textLengthOffset;
		const layerDist = (dist * layerIdx) / 2;
		const additionalDist = isEven(circleIdx) ? 0 : dist / 2;

		return layerDist + additionalDist;
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 */
	createCircleParticle(x, y) {
		const layerOffset = this.calculateLayerOffset(this.isMain(x) ? this.mainTextData.width : this.subTextData.width);
		const textLengthOffset = CIRCLE.BASE_TEXT_OFFSET - this.textLength;
		const baseSpeed = layerOffset / this.interval;

		for (let layerIdx = 0; layerIdx < CIRCLE.LAYERS; layerIdx++) {
			const speedFactor = baseSpeed + layerIdx;
			const radius = CIRCLE.RADII[layerIdx];
			const opacity = CIRCLE.OPACITY_BASE + layerIdx * CIRCLE.OPACITY_OFFSET;
			const color = setHslaColor({ hue: CIRCLE.HUES[layerIdx], saturation: CIRCLE.SATURATION, lightness: CIRCLE.LIGHTNESS });

			for (let circleIdx = 0; circleIdx < CIRCLE.PER_QTY; circleIdx++) {
				const distFromCreationPoint = this.calculateDistFromCreationPoint(layerIdx, circleIdx, layerOffset, textLengthOffset);
				const { xCos, ySin } = this.calculateCosSin(circleIdx);

				const circleParams = {
					x: x + distFromCreationPoint * xCos,
					y: y + distFromCreationPoint * ySin,
					vx: speedFactor * xCos,
					vy: speedFactor * ySin,
					radius,
					opacity,
					color,
				};
				this.circleParticles.push(this.pm.acquireParticle(TYPE_CIRCLE, circleParams));
			}
		}
	}

	updateCircleParticle() {
		for (let i = this.circleParticles.length - 1; i >= 0; i--) {
			const circle = this.circleParticles[i];
			circle.update();
			circle.draw();

			if (Math.random() < SPARK.CIRCLE_CREATION_RATE * this.textLength) {
				const sparkParams = {
					x: circle.x,
					y: circle.y,
					vx: randomFloat(SPARK.CIRCLE_MIN_VX, SPARK.CIRCLE_MAX_VX),
					vy: SPARK.CIRCLE_VY,
					color: circle.fillColor,
					radius: circle.radius,
					opacity: circle.opacity + SPARK.CIRCLE_OPACITY_OFFSET,
				};
				this.sparkParticles.push(this.pm.acquireParticle(TYPE_SPARK, sparkParams));
			}

			if (circle.belowOpacityLimit() || this.isOutOfCanvasArea(circle.x, circle.y)) {
				this.circleParticles.splice(i, 1);
				this.pm.returnToPool(TYPE_CIRCLE, circle);
			}
		}
	}

	updateSparkParticle() {
		for (let i = this.sparkParticles.length - 1; i >= 0; i--) {
			const spark = this.sparkParticles[i];
			spark.update();
			spark.draw();

			if (spark.belowOpacityLimit() || this.isOutOfCanvasArea(spark.x, spark.y)) {
				this.sparkParticles.splice(i, 1);
				this.pm.returnToPool(TYPE_SPARK, spark);
			}
		}
	}

	animateFireworks() {
		let then = document.timeline.currentTime;
		let frameCount = 0;
		const bgCleanUp = setRgbaColor(SCREEN.BG_RGB, SCREEN.ALPHA_CLEANUP);
		const addFrameCountDivisor = ANIMATION.TAIL_FPS + this.textLength * ANIMATION.TEXT_LEN_MULTIPLIER;

		/**
		 * requestAnimationFrame에 전달할 콜백 함수
		 * @param {number} now requestAnimationFrame의 timestamp (밀리 초)
		 */
		const frame = (now) => {
			const delta = now - then;

			if (delta >= this.interval) {
				const alpha = SCREEN.ALPHA_BASE + SCREEN.ALPHA_OFFSET * Math.sin(frameCount / SCREEN.SPEED_CONTROL);
				this.fillFullCanvas(setRgbaColor(SCREEN.BG_RGB, alpha));

				if (frameCount === 0) {
					this.fillFullCanvas(bgCleanUp);
					this.createTailParticle();
				}

				this.updateTailParticle();
				this.updateCircleParticle();
				this.updateTextParticle();
				this.updateSparkParticle();

				frameCount = (frameCount + 1) % addFrameCountDivisor;
				then = now - (delta % this.interval);
			}

			this.animationId = requestAnimationFrame(frame);
		};

		this.animationId = requestAnimationFrame(frame);
	}

	render() {
		if (this.text !== "") {
			this.createTextDatas();
			this.animateFireworks();
		}
	}
}

export default Canvas;
