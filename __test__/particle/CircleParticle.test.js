import Particle from "@/js/particle/Particle.js";
import CircleParticle from "@/js/particle/CircleParticle.js";
import { randomFloat, setRgbaColor } from "@/js/utils.js";
import { CIRCLE, TEST_OPTION } from "@/js/constants.js";
import { createMockCanvasCtx, expectAllParticleVars } from "../setup";

jest.mock("@/js/utils.js", () => ({
	randomFloat: jest.fn(),
	setRgbaColor: jest.fn(),
}));

describe("CircleParticle 단위 테스트", () => {
	let ctx;
	const isSmallScreen = false;
	const { PARTICLE_DEFAULT_VALUES } = TEST_OPTION;

	beforeAll(() => {
		randomFloat.mockReturnValue(PARTICLE_DEFAULT_VALUES.opacity);
		setRgbaColor.mockReturnValue(PARTICLE_DEFAULT_VALUES.color);
	});

	beforeEach(() => {
		ctx = createMockCanvasCtx();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	function expectAllCircleVars(circle, expectedresult) {
		expectAllParticleVars(circle, expectedresult);
		expect(circle.gravity).toBe(CIRCLE.GRAVITY);
		expect(circle.initialState).toEqual({ friction: CIRCLE.FRICTION });
	}

	test("CirCleParticle 생성자와 멤버변수 테스트", () => {
		const params = { x: 1, y: 2, vx: 10, vy: 4, radius: 2, opacity: 1, color: "rgba(255, 0, 0, 1)" };
		const circle = new CircleParticle({ ctx, isSmallScreen, ...params });

		expectAllCircleVars(circle, { ...params, friction: CIRCLE.FRICTION });
	});

	test("CircleParticle draw 메서드 테스트", () => {
		const color = "hsla(25, 50%, 50%)";
		const circle = new CircleParticle({ ctx, isSmallScreen, x: 10, y: 10, x: 5, y: 5, radius: 1, opacity: 0.5, color });
		const spyParticleDraw = jest.spyOn(Particle.prototype, "draw");
		circle.draw();

		expect(circle.ctx.save).toHaveBeenCalledTimes(1);
		expect(spyParticleDraw).toHaveBeenCalled();
		expect(circle.ctx.restore).toHaveBeenCalledTimes(1);
	});

	test("CircleParticle update 메서드 테스트", () => {
		const [x, y, vx, vy, radius, opacity, color] = [10, 10, 1, 1, 10, 0.8, "hsla(15, 50%, 50%)"];
		const circle = new CircleParticle({ ctx, isSmallScreen, x, y, vx, vy, radius, opacity, color });
		const spyParticleUpdate = jest.spyOn(Particle.prototype, "update");
		circle.update();

		const expectedVy = (vy + CIRCLE.GRAVITY) * CIRCLE.FRICTION;
		const expectedVx = vx * CIRCLE.FRICTION;
		const expectedResult = {
			x: x + expectedVx,
			y: y + expectedVy,
			vx: expectedVx,
			vy: expectedVy,
			radius: (radius + CIRCLE.RADIUS_ADJUST_OFFSET) * CIRCLE.RADIUS_ADJUST_RATE,
			opacity: opacity - CIRCLE.OPACITY_ADJUST_OFFSET,
			color,
			friction: CIRCLE.FRICTION,
		};
		expectAllCircleVars(circle, expectedResult);
		expect(spyParticleUpdate).toHaveBeenCalled();
	});

	test("CircleParticle reset 테스트 - 사용된 파티클 풀에 반환시 초기화", () => {
		const circle = new CircleParticle({
			ctx,
			isSmallScreen,
			x: 5,
			y: 3,
			vx: -4,
			vy: 2,
			radius: 3,
			opacity: 0.67,
			color: "rgba(255, 255, 255, 1)",
		});
		const spyParticleReset = jest.spyOn(Particle.prototype, "reset");
		circle.reset();

		expectAllCircleVars(circle, { ...PARTICLE_DEFAULT_VALUES, friction: CIRCLE.FRICTION });
		expect(spyParticleReset).toHaveBeenCalled();
	});

	test("CircleParticle reset 테스트 - 풀에서 꺼내와서 재사용", () => {
		const circle = new CircleParticle({ ctx, isSmallScreen });
		const params = { x: 3, y: 45, vx: -1, vy: 2, radius: 1.5, opacity: 0.78 };
		circle.reset(params);

		expectAllCircleVars(circle, { ...PARTICLE_DEFAULT_VALUES, ...params, friction: CIRCLE.FRICTION });
	});
});
