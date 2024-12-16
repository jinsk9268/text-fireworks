import { ANIMATION, SCREEN, POS, FONT } from "@/js/constants.js";

class CanvasOption {
	/**
	 * 캔버스 기본 설정을 관리하고 초기화하는 클래스
	 * - 캔버스 엘리먼트를 정의하고, 물리적 및 CSS 크기, DPI, 폰트 설정 등을 처리
	 * - 화면 크기에 따라 캔버스 옵션을 동적으로 조정
	 */
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
		this.dpr = Math.min(Math.round(window.devicePixelRatio), SCREEN.MAX_DPR) || 1;
		this.canvasCssWidth = window.innerWidth;
		this.canvasCssHeight = window.innerHeight;
		this.isSmallScreen = window.matchMedia(`(max-width: ${SCREEN.SMALL_WIDTH}px)`).matches;
		this.mainX = this.canvasCssWidth / POS.MAIN_X_DIVISOR;
		this.mainY = Math.floor(this.canvasCssHeight * POS.MAIN_Y_RATIO);
		this.mainFontSize = this.setMainFontSize();
		this.subFontSize = this.setSubFontSize();
	}

	/**
	 * @param {number} [fontSize] 폰트 사이즈, 없을 시 화면 크기에 따라 설정
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
		return Math.round(this.mainFontSize * FONT.SUB_RATIO);
	}

	/**
	 * @param {number} fontSize
	 * @returns ctx font 설정을 위한 문자열 반환
	 */
	setFontStyle(fontSize) {
		return `${fontSize}px ${FONT.FAMILY}`;
	}

	/**
	 * @param {string} color
	 */
	fillFullCanvas(color) {
		this.ctx.fillStyle = color;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 * @returns 파티클이 캔버스 영역을 벗어날 경우 true를 반환, 영역안이면 false를 반환
	 */
	isOutOfCanvasArea(x, y) {
		return x < 0 || x > this.canvasCssWidth || y < 0 || y > this.canvasCssHeight;
	}
}

export default CanvasOption;
