import Particle from "@/js/particle/Particle.js";
import TextParticle from "@/js/particle/TextParticle.js";
import { randomFloat, setRgbaColor } from "@/js/utils.js";
import { TEST_OPTION, TEXT } from "@/js/constants.js";
import { createMockCanvasCtx, expectAllParticleVars } from "../setup.js";

jest.mock("@/js/utils.js", () => ({
	randomFloat: jest.fn(),
	setRgbaColor: jest.fn(),
}));

describe("TextParticle 클래스 단위 테스트", () => {
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

	function expectAllTextVars(text, params) {
		expectAllParticleVars(text, params);
		expect(text.gravity).toBe(TEXT.GRAVITY);
	}

	test("TextParticle 생성자와 멤버변수 초기화", () => {
		const [x, y, vx, vy, color] = [10, 10, 1, 1, "hsla(30, 50%, 80%)"];
		const text = new TextParticle({ ctx, isSmallScreen, x, y, vx, vy, color });

		expectAllTextVars(text, { ...PARTICLE_DEFAULT_VALUES, x, y, vx, vy, color });

		expect(randomFloat).toHaveBeenCalled();
	});

	test("TextParticle draw 테스트", () => {
		const text = new TextParticle({ ctx, isSmallScreen, x: 1, y: 1, vx: 10, vy: 10, color: "rgba(255, 255, 255, 1)" });
		const spyParticleDraw = jest.spyOn(Particle.prototype, "draw");
		text.draw();

		expect(spyParticleDraw).toHaveBeenCalledTimes(1);
	});

	test("TextParticle update 테스트", () => {
		const [x, y, vx, vy, color] = [100, 100, 5, 5, "hsla(40, 50%, 50%)"];
		const text = new TextParticle({ ctx, isSmallScreen, x, y, vx, vy, color });
		const spyParticleUpdate = jest.spyOn(Particle.prototype, "update");
		text.update();

		const expectedVx = vx * PARTICLE_DEFAULT_VALUES.friction;
		const expectedVy = (vy + TEXT.GRAVITY) * PARTICLE_DEFAULT_VALUES.friction;
		const expectedResult = {
			...PARTICLE_DEFAULT_VALUES,
			x: x + expectedVx,
			y: y + expectedVy,
			vx: expectedVx,
			vy: expectedVy,
			opacity: PARTICLE_DEFAULT_VALUES.opacity - TEXT.OPACITY_OFFSET,
			color,
		};
		expectAllTextVars(text, expectedResult);
		expect(spyParticleUpdate).toHaveBeenCalled();
	});

	test("TextParticle reset 테스트 - 사용된 파티클 풀에 반환시 초기화", () => {
		const text = new TextParticle({ ctx, isSmallScreen, x: 23, y: 32, vx: 5, vy: 5, color: "hsla(30, 100%, 100%)" });
		const spyParticleReset = jest.spyOn(Particle.prototype, "reset");
		text.reset();

		expectAllTextVars(text, PARTICLE_DEFAULT_VALUES);
		expect(spyParticleReset).toHaveBeenCalled();
	});

	test("TextParticle reset 테스트 - 풀에서 꺼내와서 재사용", () => {
		const text = new TextParticle({ ctx, isSmallScreen });
		const params = { x: 12, y: 45, vx: 0.5, vy: 2.3, color: "rgba(145, 255, 32, 0.8)" };
		text.reset(params);

		expectAllTextVars(text, { ...PARTICLE_DEFAULT_VALUES, ...params });
	});
});
