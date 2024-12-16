import { setTestCanvas, defineWidowProperty } from "../setup";
import CanvasOption from "@/js/CanvasOption.js";
import { ANIMATION, SCREEN, POS, FONT, TEST_OPTION } from "@/js/constants.js";

const { TYPE_INNER_WIDTH, INNER_WIDTH, SMALL_INNER_WIDTH, INNER_HEIGHT } = TEST_OPTION;

describe("CanvasOption 테스트 (jest-canvas-mock 활용)", () => {
	let canvasOption;

	beforeEach(() => {
		setTestCanvas();
		canvasOption = new CanvasOption();
	});

	/** 캔버스 멤버변수 초기화 관련 메서드 테스트 */
	describe("캔버스 초기화 테스트", () => {
		test("캔버스 객체 관련 멤버변수 초기화", () => {
			expect(canvasOption.canvas).toBeInstanceOf(HTMLCanvasElement);
			expect(canvasOption.ctx).toBeInstanceOf(CanvasRenderingContext2D);
		});

		test("캔버스 객체를 불러오지 못할 경우 에러 처리", () => {
			document.getElementById(TEST_OPTION.CANVAS_ID).remove();

			expect(() => new CanvasOption()).toThrow("캔버스 객체를 발견하지 못했습니다. 다시 확인해주세요.");
		});

		test("애니메이션 관련 멤버변수 초기화", () => {
			expect(canvasOption.fps).toBe(ANIMATION.FPS);
			expect(canvasOption.interval).toBe(1000 / canvasOption.fps);
			expect(canvasOption.dpr).toBeGreaterThanOrEqual(1);
			expect(canvasOption.dpr).toBeLessThanOrEqual(SCREEN.MAX_DPR);
		});

		test("캔버스 css 크기, 메인좌표 관련 멤버변수 초기화", () => {
			expect(canvasOption.canvasCssWidth).toBe(INNER_WIDTH);
			expect(canvasOption.canvasCssHeight).toBe(INNER_HEIGHT);
			expect(canvasOption.mainX).toBe(INNER_WIDTH / POS.MAIN_X_DIVISOR);
			expect(canvasOption.mainY).toBe(Math.floor(INNER_HEIGHT * POS.MAIN_Y_RATIO));
		});

		test("PC 화면일때", () => {
			expect(canvasOption.isSmallScreen).toBe(false);
		});

		test("모바일 화면일때", () => {
			defineWidowProperty(TYPE_INNER_WIDTH, SMALL_INNER_WIDTH);
			canvasOption.initCanvasOptionVars();

			expect(canvasOption.isSmallScreen).toBe(true);
		});

		test.each([
			{ fontsize: undefined, testWidth: INNER_WIDTH, notice: "PC 화면-인자 전달하지 않아 기본값 적용" },
			{ fontsize: 100, testWidth: SMALL_INNER_WIDTH, notice: "모바일 화면-인자 100 전달" },
		])("mainFontSize($fontsize) 테스트 ($notice)", ({ fontsize, testWidth }) => {
			defineWidowProperty(TYPE_INNER_WIDTH, testWidth);
			canvasOption.initCanvasOptionVars();

			const result = canvasOption.setMainFontSize(fontsize);
			const ratio = canvasOption.isSmallScreen ? FONT.MAIN_RATIO_SMALL : FONT.MAIN_RATIO_GENERAL;
			const expectedResult = fontsize ?? Math.round(((testWidth + INNER_HEIGHT) / 2) * ratio);

			expect(result).toBe(expectedResult);
			expect(canvasOption.isSmallScreen).toBe(testWidth <= SMALL_INNER_WIDTH);
		});

		test("subFontSize 테스트", () => {
			const result = canvasOption.setSubFontSize();

			expect(result).toBe(Math.round(canvasOption.mainFontSize * FONT.SUB_RATIO));
		});
	});

	/** 캔버스 전체 화면 덮기 테스트 */
	test("fillFullCanvas 테스트", () => {
		canvasOption.fillFullCanvas("#121212");

		expect(canvasOption.ctx.fillStyle).toBe("#121212");
		expect(canvasOption.ctx.fillRect).toHaveBeenCalledWith(0, 0, canvasOption.canvas.width, canvasOption.canvas.height);
	});

	/** 캔버스 영역 밖으로 벗어났는지 테스트 */
	test.each([
		{ x: 10, y: 10, expected: false, notice: "캔버스 내부" },
		{ x: INNER_WIDTH, y: INNER_HEIGHT, expected: false, notice: "캔버스 내부" },
		{ x: -10, y: 10, expected: true, notice: "캔버스 왼쪽 밖" },
		{ x: 10, y: -10, expected: true, notice: "캔버스 위쪽 밖" },
		{ x: -10, y: -10, expected: true, notice: "캔버스 왼쪽, 위쪽 밖" },
		{ x: INNER_WIDTH + 10, y: 10, expected: true, notice: "캔버스 오른쪽 밖" },
		{ x: 10, y: INNER_HEIGHT + 10, expected: true, notice: "캔버스 아래쪽 밖" },
		{ x: INNER_WIDTH + 10, y: INNER_HEIGHT + 10, expected: true, notice: "캔버스 오른쪽, 아래쪽 밖" },
	])("isOutOfCanvas($x, $y) 테스트 / $notice", ({ x, y, expected }) => {
		expect(canvasOption.isOutOfCanvasArea(x, y)).toBe(expected);
	});
});
