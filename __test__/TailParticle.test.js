import TailParticle from "@/js/particle/TailParticle.js";
import Particle from "@/js/particle/Particle.js";
import { createMockCanvasCtx, expectAllParticleVars } from "./setup.js";
import { randomFloat, setRgbaColor } from "@/js/utils.js";
import { TAIL, TEST_OPTION } from "@/js/constants.js";

jest.mock("@/js/utils", () => {
	return {
		randomFloat: jest.fn(),
		setRgbaColor: jest.fn(),
	};
});

describe("TailParticle 클래스 단위 테스트", () => {
	let ctx;
	let isSmallScreen;
	const { PARTICLE_DEFAULT_VALUES } = TEST_OPTION;

	beforeAll(() => {
		randomFloat.mockReturnValue(PARTICLE_DEFAULT_VALUES.opacity);
		setRgbaColor.mockReturnValue(PARTICLE_DEFAULT_VALUES.color);
	});

	beforeEach(() => {
		ctx = createMockCanvasCtx();
		isSmallScreen = false;
	});

	/**
	 * TailParticle 클래스 모든 멤버변수 검증
	 * @param {TailParticle} tail
	 * @param {object} expectedResult
	 * @param {number} expectedInitialX
	 * @param {number} expectedRadian
	 */
	function expectAllTailVars(tail, expectedResult, expectedInitialX, expectedRadian) {
		expectAllParticleVars(tail, expectedResult);
		expect(tail.initialX).toBe(expectedInitialX);
		expect(tail.radian).toBe(expectedRadian);
	}

	test("TailParticle 생성자와 멤버변수 초기화", () => {
		const [x, y, vy] = [100, 100, 1];
		const tail = new TailParticle({ ctx, isSmallScreen, x, y, vy });

		expectAllTailVars(tail, { ...PARTICLE_DEFAULT_VALUES, x, y, vy }, x, TAIL.RADIAN);

		expect(randomFloat).toHaveBeenCalled();
		expect(setRgbaColor).toHaveBeenCalled();
	});

	test("TailParticle draw 테스트", () => {
		jest.spyOn(Particle.prototype, "draw");

		const tail = new TailParticle({ ctx, isSmallScreen, x: 10, y: 5, vy: 2 });
		tail.draw();

		expect(Particle.prototype.draw).toHaveBeenCalledTimes(1);
	});

	test("TailParticle update 테스트", () => {
		const [x, y, vy] = [10, 10, 1];
		const tail = new TailParticle({ ctx, isSmallScreen, x, y, vy });

		jest.spyOn(Particle.prototype, "updatePosition");
		tail.update();

		const expectedVY = vy * PARTICLE_DEFAULT_VALUES.friction;
		const expectedVX = Math.cos(TAIL.RADIAN) * expectedVY * TAIL.X_ADJUST_RATE;
		const expectedX = x + expectedVX;
		const expectedResult = {
			...PARTICLE_DEFAULT_VALUES,
			vy: expectedVY,
			vx: expectedVX,
			x: expectedX + (x - expectedX) * TAIL.INITIAL_X_RETURN_RATE,
			y: y + expectedVY,
			opacity: -expectedVY,
		};
		expectAllTailVars(tail, expectedResult, x, TAIL.RADIAN + TAIL.RADIAN_OFFSET);

		expect(Particle.prototype.updatePosition).toHaveBeenCalledTimes(1);
		expect(randomFloat).toHaveBeenCalled();
		expect(setRgbaColor).toHaveBeenCalled();
	});

	test("TailParticle reset 테스트 - 사용된 파티클 풀에 반환시 초기화", () => {
		const tail = new TailParticle({ ctx, isSmallScreen, x: 3, y: 5, vy: 1 });
		jest.spyOn(Particle.prototype, "reset");
		jest.spyOn(tail, "initTailParticleVars");
		tail.update();

		tail.reset();

		expectAllTailVars(tail, PARTICLE_DEFAULT_VALUES, 0, TAIL.RADIAN);

		expect(Particle.prototype.reset).toHaveBeenCalledTimes(1);
		expect(randomFloat).toHaveBeenCalled();
		expect(setRgbaColor).toHaveBeenCalled();
		expect(tail.initTailParticleVars).toHaveBeenCalledTimes(1);
	});

	test("TailParticle reset 테스트 - 풀에서 꺼내와서 재사용", () => {
		const tail = new TailParticle({ ctx, isSmallScreen });

		const params = { x: 100, y: 100, vy: 10 };
		tail.reset(params);

		expectAllTailVars(tail, { ...PARTICLE_DEFAULT_VALUES, ...params }, params.x, TAIL.RADIAN);
	});
});
