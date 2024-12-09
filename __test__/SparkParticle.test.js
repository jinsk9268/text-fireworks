import Particle from "@/js/particle/Particle.js";
import SparkParticle from "@/js/particle/SparkParticle.js";
import { randomFloat, setRgbaColor } from "@/js/utils.js";
import { SPARK, TEST_OPTION } from "@/js/constants.js";
import { createMockCanvasCtx, expectAllParticleVars } from "./setup.js";

jest.mock("@/js/utils.js", () => ({
	randomFloat: jest.fn(),
	setRgbaColor: jest.fn(),
}));

describe("SparkParticle 클래스 단위 테스트", () => {
	let ctx;
	let isSmallScreen = false;
	const { PARTICLE_DEFAULT_VALUES } = TEST_OPTION;

	beforeAll(() => {
		randomFloat.mockReturnValue(PARTICLE_DEFAULT_VALUES.opacity);
		setRgbaColor.mockReturnValue(PARTICLE_DEFAULT_VALUES.color);
	});

	beforeEach(() => {
		ctx = createMockCanvasCtx();
	});

	test("SpartParticle 생성자와 멤버변수 초기화 테스트", () => {
		const params = { x: 1, y: 1, vx: 20, vy: 20, radius: 10, opacity: 0.45, color: "hsla(270, 60%, 70%)" };
		const spark = new SparkParticle({ ctx, isSmallScreen, ...params });

		expectAllParticleVars(spark, { ...PARTICLE_DEFAULT_VALUES, ...params });
	});

	test("SparkParticle draw 테스트", () => {
		jest.spyOn(Particle.prototype, "draw");

		const spark = new SparkParticle({ ctx, isSmallScreen, x: 10, y: 10, vx: -1.25, vy: 1.25 });

		spark.draw();

		expect(Particle.prototype.draw).toHaveBeenCalled();
	});

	test("SparkParticle update 테스트", () => {
		jest.spyOn(Particle.prototype, "updatePosition");

		const [x, y, vx, vy, radius, opacity] = [20, 20, 10, 10, 5, 1];
		const spark = new SparkParticle({ ctx, isSmallScreen, x, y, vx, vy, radius, opacity });

		spark.update();

		const expectedResult = {
			...PARTICLE_DEFAULT_VALUES,
			x: x + vx,
			y: y + vy,
			vx,
			vy,
			radius: radius * SPARK.RADIUS_ADJUST_RATE,
			opacity: opacity - SPARK.OPACITY_ADJUST_RATE,
		};
		expectAllParticleVars(spark, expectedResult);

		expect(Particle.prototype.updatePosition).toHaveBeenCalled();
	});

	test("SparkParticle reset 테스트 - 사용된 파티클 풀에 반환시 초기화", () => {
		jest.spyOn(Particle.prototype, "reset");

		const spark = new SparkParticle({ ctx, isSmallScreen, x: 5, y: 3, vx: 2, vy: -2, radius: 3, opacity: 0.2, color: "rgba(255, 0, 0, 0.8)" });
		spark.reset();

		expectAllParticleVars(spark, PARTICLE_DEFAULT_VALUES);
		expect(Particle.prototype.reset).toHaveBeenCalled;
	});

	test("SparkParticle reset 테스트 - 풀에서 꺼내와서 재사용", () => {
		const spark = new SparkParticle({ ctx, isSmallScreen });

		const params = { x: 23, y: 145, vx: 2, vy: 3.35, radius: 2.87, opacity: 0.86 };
		spark.reset(params);

		expectAllParticleVars(spark, { ...PARTICLE_DEFAULT_VALUES, ...params });
	});
});
