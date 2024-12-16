import Canvas from "@/js/Canvas.js";
import ParticleManager from "@/js/particle/ParticleManager.js";
import TailParticle from "@/js/particle/TailParticle.js";
import TextParticle from "@/js/particle/TextParticle.js";
import CircleParticle from "@/js/particle/CircleParticle.js";
import SparkParticle from "@/js/particle/SparkParticle.js";
import { TEST_OPTION, TAIL } from "@/js/constants.js";
import { setTestCanvas } from "../setup.js";

describe("Canvas 클래스 파티클 업데이트 테스트", () => {
	let canvasInst;
	const userInput = "텍스트 데이터 생성";
	const { INNER_WIDTH, INNER_HEIGHT } = TEST_OPTION;

	let spyReturnToPool;

	beforeEach(() => {
		setTestCanvas();

		spyReturnToPool = jest.spyOn(ParticleManager.prototype, "returnToPool");

		canvasInst = new Canvas();
		canvasInst.text = userInput;
		canvasInst.textLength = userInput.length;
	});

	afterEach(() => {
		spyReturnToPool.mockClear();
	});

	describe("TailParticle 업데이트 테스트", () => {
		let spyCreateTextParticle;
		let spyCreateCircleParticle;
		let spyTailUpdate;
		let spyTailDraw;

		beforeEach(() => {
			spyCreateTextParticle = jest.spyOn(canvasInst, "createTextParticle");
			spyCreateCircleParticle = jest.spyOn(canvasInst, "createCircleParticle");
			spyTailUpdate = jest.spyOn(TailParticle.prototype, "update");
			spyTailDraw = jest.spyOn(TailParticle.prototype, "draw");
		});

		afterEach(() => {
			spyCreateTextParticle.mockClear();
			spyCreateCircleParticle.mockClear();
			spyTailUpdate.mockClear();
			spyTailDraw.mockClear();
		});

		test.each([
			{ vy: -10, length: 1, notice: "이상" },
			{ vy: -0.001, length: 0, notice: "미만" },
		])("updateTailParticle 테스트 | opacity 상한선 $notice", ({ vy, length }) => {
			canvasInst.init();
			canvasInst.tailParticles.push(
				new TailParticle({ ctx: canvasInst.ctx, isSmallScreen: canvasInst.isSmallScreen, x: 100, y: INNER_HEIGHT, vy }),
			);
			canvasInst.updateTailParticle();

			expect(spyTailUpdate).toHaveBeenCalledTimes(1);
			expect(spyTailDraw).toHaveBeenCalledTimes(1);
			expect(canvasInst.tailParticles).toHaveLength(length);

			if (length > 0) {
				expect(canvasInst.tailParticles[0].belowOpacityLimit(TAIL.OPACITY_LIMIT)).toBeFalsy();
				expect(spyCreateTextParticle).not.toHaveBeenCalled();
				expect(spyCreateCircleParticle).not.toHaveBeenCalled();
				expect(spyReturnToPool).not.toHaveBeenCalled();
			} else {
				expect(spyCreateTextParticle).toHaveBeenCalledTimes(1);
				expect(spyCreateCircleParticle).toHaveBeenCalledTimes(1);
				expect(spyReturnToPool).toHaveBeenCalledTimes(1);
			}
		});
	});

	describe("TextParticle 업데이트 테스트", () => {
		let spyTextUpdate;
		let spyTextDraw;

		beforeEach(() => {
			spyTextUpdate = jest.spyOn(TextParticle.prototype, "update");
			spyTextDraw = jest.spyOn(TextParticle.prototype, "draw");
		});

		afterEach(() => {
			spyTextUpdate.mockClear();
			spyTextDraw.mockClear();
		});

		function setTextParticles(params = {}) {
			canvasInst.init();
			// 원활한 테스트를 위해 1개만 추가
			const { x = 10, y = 10, vx = 20, vy = 20 } = params;
			canvasInst.textParticles.push(new TextParticle({ ctx: canvasInst.ctx, isSmallScreen: canvasInst.isSmallScreen, x, y, vx, vy }));
		}

		function expectAfterUpdatedReturnToPool() {
			expect(spyTextUpdate).toHaveBeenCalledTimes(1);
			expect(spyTextDraw).toHaveBeenCalledTimes(1);
			expect(canvasInst.textParticles).toHaveLength(0);
			expect(spyReturnToPool).toHaveBeenCalledTimes(1);
		}

		test("updateTextParticle 테스트 | opacity 상한선 이하(X), 캔버스 영역 밖(X)", () => {
			setTextParticles();
			canvasInst.updateTextParticle();

			expect(spyTextUpdate).toHaveBeenCalledTimes(1);
			expect(spyTextDraw).toHaveBeenCalledTimes(1);
			expect(canvasInst.textParticles).toHaveLength(1);

			const updatedParticle = canvasInst.textParticles[0];
			expect(updatedParticle.belowOpacityLimit()).toBeFalsy();
			expect(canvasInst.isOutOfCanvasArea(updatedParticle.x, updatedParticle.y)).toBeFalsy();
			expect(spyReturnToPool).not.toHaveBeenCalled();
		});

		test("updateTextParticle 테스트 | opacity 상한선 이하(O), 캔버스 영역  밖(X)", () => {
			setTextParticles();
			canvasInst.textParticles[0].opacity = 0;
			canvasInst.updateTextParticle();

			expectAfterUpdatedReturnToPool();
		});

		test.each([
			{ params: { x: 0, vx: -10 }, notice: "x축 좌측 밖" },
			{ params: { x: INNER_WIDTH }, notice: "x축 우측 밖" },
			{ params: { y: 0, vy: -30 }, notice: "y축 상단 밖" },
			{ params: { y: INNER_HEIGHT }, notice: "y축 하단 밖" },
		])("updateTextParticle 테스트 | opacity 상한선 이하(X), 캔버스 영역 밖(O, 캔버스 $notice)", ({ params }) => {
			setTextParticles(params);
			canvasInst.updateTextParticle();

			expectAfterUpdatedReturnToPool();
		});
	});

	describe("CircleParticle 업데이트 테스트", () => {
		let spyCircleUpdate;
		let spyCircleDraw;

		beforeEach(() => {
			spyCircleUpdate = jest.spyOn(CircleParticle.prototype, "update");
			spyCircleDraw = jest.spyOn(CircleParticle.prototype, "draw");
		});

		afterEach(() => {
			spyCircleUpdate.mockClear();
			spyCircleDraw.mockClear();
		});

		function setUpdateCircleParticles(params = {}) {
			canvasInst.init();
			// 원활한 테스트를 위해 1개만 추가
			const { x = 10, y = 10, vx = 20, vy = 20, opacity = 0.9 } = params;
			canvasInst.circleParticles.push(
				new CircleParticle({ ctx: canvasInst.ctx, isSmallScreen: canvasInst.isSmallScreen, x, y, vx, vy, opacity }),
			);
			canvasInst.updateCircleParticle();
		}

		function expectedUpdateAndDraw({ length }) {
			expect(spyCircleUpdate).toHaveBeenCalledTimes(1);
			expect(spyCircleDraw).toHaveBeenCalledTimes(1);
			expect(canvasInst.circleParticles).toHaveLength(length);
		}

		test("updateCircleParticle 테스트 | opacity 상한선 이하(X), 캔버스 영역 밖(X)", () => {
			setUpdateCircleParticles();

			expectedUpdateAndDraw({ length: 1 });

			const updatedParticle = canvasInst.circleParticles[0];
			expect(updatedParticle.belowOpacityLimit()).toBeFalsy();
			expect(canvasInst.isOutOfCanvasArea(updatedParticle.x, updatedParticle.y)).toBeFalsy();
			expect(spyReturnToPool).not.toHaveBeenCalled();
		});

		test.each([
			{ params: { opacity: 0 }, opacity: "O", canvasOut: "X", notice: "안" },
			{ params: { x: 0, vx: -10 }, opacity: "X", canvasOut: "O", notice: "x축 좌측 밖" },
			{ params: { x: INNER_WIDTH }, opacity: "X", canvasOut: "O", notice: "x축 우측 밖" },
			{ params: { y: 0, vy: -30 }, opacity: "X", canvasOut: "O", notice: "y축 상단 밖" },
			{ params: { y: INNER_HEIGHT }, opacity: "X", canvasOut: "O", notice: "y축 하단 밖" },
		])("updateCircleParticle 테스트 | opacity 상한선 이하($opacity), 캔버스 영역 밖($canvasOut, 캔버스 $notice)", ({ params }) => {
			setUpdateCircleParticles(params);

			expectedUpdateAndDraw({ length: 0 });

			expect(spyReturnToPool).toHaveBeenCalledTimes(1);
		});
	});

	describe("SparkParticle 업데이트 테스트", () => {
		let spySparkUpdate;
		let spySparkDraw;

		beforeEach(() => {
			spySparkUpdate = jest.spyOn(SparkParticle.prototype, "update");
			spySparkDraw = jest.spyOn(SparkParticle.prototype, "draw");
		});

		afterEach(() => {
			spySparkUpdate.mockClear();
			spySparkDraw.mockClear();
		});

		function setSparkParticles(params = {}) {
			canvasInst.init();
			// 원활한 테스트를 위해 1개만 추가
			const { x = 10, y = 10, vx = 20, vy = 20, opacity = 0.9 } = params;
			canvasInst.sparkParticles.push(
				new SparkParticle({ ctx: canvasInst.ctx, isSmallScreen: canvasInst.isSmallScreen, x, y, vx, vy, opacity }),
			);
			canvasInst.updateSparkParticle();
		}

		function expectAfterUpdatedReturnToPool({ length }) {
			expect(spySparkUpdate).toHaveBeenCalledTimes(1);
			expect(spySparkDraw).toHaveBeenCalledTimes(1);
			expect(canvasInst.sparkParticles).toHaveLength(length);
		}

		test("updateSparkParticle 테스트 | opacity 상한선 이하(X), 캔버스 영역 밖(X)", () => {
			setSparkParticles();

			expectAfterUpdatedReturnToPool({ length: 1 });

			const updatedParticle = canvasInst.sparkParticles[0];
			expect(updatedParticle.belowOpacityLimit()).toBeFalsy();
			expect(canvasInst.isOutOfCanvasArea(updatedParticle.x, updatedParticle.y)).toBeFalsy();
			expect(spyReturnToPool).not.toHaveBeenCalled();
		});

		test.each([
			{ params: { opacity: 0 }, opacity: "O", canvasOut: "X", notice: "안" },
			{ params: { x: 0, vx: -10 }, opacity: "X", canvasOut: "O", notice: "x축 좌측 밖" },
			{ params: { x: INNER_WIDTH }, opacity: "X", canvasOut: "O", notice: "x축 우측 밖" },
			{ params: { y: 0, vy: -30 }, opacity: "X", canvasOut: "O", notice: "y축 상단 밖" },
			{ params: { y: INNER_HEIGHT }, opacity: "X", canvasOut: "O", notice: "y축 하단 밖" },
		])("updateTextParticle 테스트 | opacity 상한선 이하($opacity), 캔버스 영역 밖($canvasOut, 캔버스 $notice)", ({ params }) => {
			setSparkParticles(params);

			expectAfterUpdatedReturnToPool({ length: 0 });
			expect(spyReturnToPool).toHaveBeenCalledTimes(1);
		});
	});
});
