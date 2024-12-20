import Canvas from "@/js/Canvas.js";
import ParticleManager from "@/js/particle/ParticleManager.js";
import { TAIL, PARTICLE, TEST_OPTION } from "@/js/constants.js";
import { setTestCanvas } from "../setup.js";

describe("Canvas 클래스 초기화 테스트", () => {
	let canvasInst;
	const userInput = "Canvas 초기화";
	const { INNER_WIDTH, INNER_HEIGHT } = TEST_OPTION;
	let spyInitCanvasVars;

	beforeEach(() => {
		setTestCanvas();

		spyInitCanvasVars = jest.spyOn(Canvas.prototype, "initCanvasVars");

		canvasInst = new Canvas();
		canvasInst.text = userInput;
		canvasInst.textLength = userInput.length;
		canvasInst.isSmallScreen = false;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test("constructor, initCanvasVars 테스트 | 생성자와 멤버변수 초기화 테스트", () => {
		expect(spyInitCanvasVars).toHaveBeenCalledTimes(1);
		expect(canvasInst.animationId).toBeUndefined();
		expect(canvasInst.text).toBe(userInput);
		expect(canvasInst.textLength).toBe(userInput.length);
		expect(canvasInst.mainTextData).toEqual({});
		expect(canvasInst.subTextData).toEqual({});
		expect(canvasInst.tailQty).toBe(TAIL.BASE_QTY);
		expect(canvasInst.mainTailVY).toBe(0);
		expect(canvasInst.tailsLeftPosX).toHaveLength(0);
		expect(canvasInst.tailsRightPosX).toHaveLength(0);
		expect(canvasInst.tailsVY).toHaveLength(0);
		expect(canvasInst.tailCount).toBe(0);
		expect(canvasInst.isLeft).toBeFalsy();
		expect(canvasInst.tailParticles).toHaveLength(0);
		expect(canvasInst.textParticles).toHaveLength(0);
		expect(canvasInst.circleParticles).toHaveLength(0);
		expect(canvasInst.sparkParticles).toHaveLength(0);
		expect(canvasInst.pm).toBeInstanceOf(ParticleManager);
	});

	test("init 테스트", () => {
		const spyCreateTailPosX = jest.spyOn(canvasInst, "createTailPosX");
		const spyCreateTailVY = jest.spyOn(canvasInst, "createTailVY");

		canvasInst.init();

		expect(canvasInst.canvas.width).toBe(INNER_WIDTH * canvasInst.dpr);
		expect(canvasInst.canvas.height).toBe(INNER_HEIGHT * canvasInst.dpr);
		expect(canvasInst.ctx.scale).toHaveBeenCalledWith(canvasInst.dpr, canvasInst.dpr);
		expect(canvasInst.canvas.style.width).toBe(`${INNER_WIDTH}px`);
		expect(canvasInst.canvas.style.height).toBe(`${INNER_HEIGHT}px`);

		expect(canvasInst.mainTailVY).toBeCloseTo((canvasInst.mainY - INNER_HEIGHT) / canvasInst.interval);
		expect(canvasInst.tailsLeftPosX).toBeDefined();
		expect(canvasInst.tailsRightPosX).toBeDefined();
		expect(canvasInst.tailsLeftPosX).toHaveLength(TAIL.BASE_QTY);
		expect(canvasInst.tailsRightPosX).toHaveLength(TAIL.BASE_QTY);
		expect(spyCreateTailPosX).toHaveBeenCalledTimes(1);
		expect(spyCreateTailVY).toHaveBeenCalledTimes(1);

		expect(canvasInst.pm.isSmallScreen).toBeFalsy();
		expect(canvasInst.pm.maxPoolSize[PARTICLE.TYPE_TEXT]).toBe(PARTICLE.TEXT_POOL * canvasInst.textLength);
		expect(canvasInst.pm.maxPoolSize[PARTICLE.TYPE_SPARK]).toBe(PARTICLE.SPARK_POOL * canvasInst.textLength);
	});

	test.each([
		{ isSmallScreen: true, notice: "모바일 화면" },
		{ isSmallScreen: false, notice: "PC 화면" },
	])("createTailPosX 테스트 | 멤버변수 tailsLeftPosX, tailsRightPosX 검증, $notice", ({ isSmallScreen }) => {
		canvasInst.isSmallScreen = isSmallScreen;
		canvasInst.createTailPosX();

		expect(canvasInst.tailsLeftPosX).toBeDefined();
		expect(canvasInst.tailsRightPosX).toBeDefined();
		expect(canvasInst.tailsLeftPosX).toHaveLength(canvasInst.tailQty);
		expect(canvasInst.tailsRightPosX).toHaveLength(canvasInst.tailQty);

		const expectedExclusionDist = canvasInst.isSmallScreen ? TAIL.SMALL_EXCLUSION : TAIL.EXCLUSION;
		expect(canvasInst.tailsLeftPosX.at(-1)).toBe(canvasInst.mainX - expectedExclusionDist);
		expect(canvasInst.tailsRightPosX.at(0)).toBe(canvasInst.mainX + expectedExclusionDist);
	});

	test("createTailVY 테스트 | tail의 y 속도 배열 계산", () => {
		canvasInst.createTailVY();

		expect(canvasInst.tailsVY).toBeDefined();
		expect(canvasInst.tailsVY).toHaveLength(TAIL.BASE_QTY);
		expect(canvasInst.tailsVY[0]).toBe(canvasInst.calculateTailVY(INNER_HEIGHT * TAIL.MIN_Y_RATIO));
	});
});
