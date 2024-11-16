import { ANIMATION, SCREEN, POS, FONT } from "@/js/constants.js";

class CanvasOption {
	constructor() {
		this.canvas = document.getElementById("canvas");
		if (!this.canvas) {
			throw new Error("캔버스 객체를 발견하지 못했습니다. 다시 확인해주세요.");
		}
		this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
		this.fps = ANIMATION.FPS;
		this.interval = 1000 / this.fps;
		this.initCanvasOptionVars();
	}

	init() {
		this.initCanvasOptionVars();
	}

	initCanvasOptionVars() {
		this.dpr = Math.min(window.devicePixelRatio, SCREEN.MAX_DPR) || 1;
		this.canvasCssWidth = window.innerWidth;
		this.canvasCssHeight = window.innerHeight;
		this.isSmallScreen = window.matchMedia(`max-width: ${SCREEN.SMALL_WIDTH}px`).matches;
		this.mainX = this.canvasCssWidth / 2;
		this.mainY = Math.floor(this.canvas * POS.MAIN_Y_RATIO);
		this.mainFontSize = this.setMainFontSize();
		this.subFontSize = this.setSubFontSize();
	}

	/**
	 *
	 * @param {number} fontSize
	 * @returns {number} 메인 폰트 사이즈 반환 (작은 화면일 경우 별도의 비율 적용)
	 */
	setMainFontSize(fontSize) {
		if (!fontSize) {
			const ratio = this.isSmallScreen ? FONT.MAIN_RATIO_SMALL : FONT.MAIN_RATIO_GENERAL;
			fontSize = ((this.canvasCssWidth + this.canvasCssHeight) / 2) * ratio;
		}

		return Math.round(fontSize);
	}

	/**
	 * @returns {number} 서브 폰트 사이즈 반환
	 */
	setSubFontSize() {
		return Math.round(this.mainFontSize) * FONT.SUB_RATIO;
	}
}

export default CanvasOption;
