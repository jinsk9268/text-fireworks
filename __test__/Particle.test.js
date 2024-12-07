import Particle from "@/js/particle/Particle.js";
import { randomFloat, setRgbaColor, isUndefined } from "@/js/utils";
import { createMockCanvasCtx, expectAllParticleVars } from "./setup.js";
import { PARTICLE, TEST_OPTION } from "@/js/constants.js";

jest.mock("@/js/utils", () => {
	const { isUndefined } = jest.requireActual("@/js/utils");
	return {
		isUndefined,
		randomFloat: jest.fn(),
		setRgbaColor: jest.fn(),
	};
});

describe("Particle 클래스 테스트", () => {
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

	test.each([
		{ params: {}, notice: "기본값" },
		{
			params: { x: 20, y: 20, radius: 5, opacity: 0.8, friction: 0.95, color: "rgba(255, 255, 255, 1)" },
			notice: "커스텀값",
		},
		{ params: { x: 30, y: 30, vx: 2, vy: 2, radius: 4 }, notice: "기본값 + 커스텀값" },
	])("Particle 생성자와 멤버변수 초기화 (PC화면 | $notice)", ({ params }) => {
		const particle = new Particle({ ctx, isSmallScreen, ...params });

		const expectedResult = { ...PARTICLE_DEFAULT_VALUES, ...params };

		expectAllParticleVars(particle, expectedResult);
		if (isUndefined(params.opacity)) expect(randomFloat).toHaveBeenCalled();
		if (isUndefined(params.color)) expect(setRgbaColor).toHaveBeenCalled();
	});

	test("Particle 생성자와 멤버변수 초기화 (모바일 화면 | 기본값 + 커스텀값)", () => {
		const params = { isSmallScreen: true, x: 10, y: 10, radius: 2, opacity: 0.5, color: "hsla(60, 100%, 100%)" };
		const particle = new Particle({ ctx, isSmallScreen, ...params });

		const expectedResult = { ...PARTICLE_DEFAULT_VALUES, ...params };
		expectedResult.radius *= PARTICLE.RADIUS_ADJUST_RATIO;

		expectAllParticleVars(particle, expectedResult);
	});

	test("Particle 생성시 반지름이 음수일 때", () => {
		const particle = new Particle({ ctx, isSmallScreen, radius: -2 });

		expect(particle.radius).toBe(0);
	});

	test("Particle draw 테스트", () => {
		const [x, y, radius, color] = [100, 100, 10, "#171717"];
		const particle = new Particle({ ctx, isSmallScreen, x, y, radius, color });

		particle.draw();

		expect(particle.ctx.beginPath).toHaveBeenCalled();
		expect(particle.ctx.beginPath).toHaveBeenCalledTimes(1);

		expect(particle.ctx.fillStyle).toBe(particle.fillColor);

		expect(particle.ctx.arc).toHaveBeenCalledWith(x, y, radius, 0, Math.PI * 2);
		expect(particle.ctx.arc).toHaveBeenCalledTimes(1);

		expect(particle.ctx.fill).toHaveBeenCalled();
		expect(particle.ctx.fill).toHaveBeenCalledTimes(1);

		expect(particle.ctx.closePath).toHaveBeenCalled();
		expect(particle.ctx.closePath).toHaveBeenCalledTimes(1);
	});

	test("Particle update 테스트 (속도)", () => {
		const [vx, vy, friction] = [10, 10, 0.9];
		const particle = new Particle({ ctx, isSmallScreen, vx, vy, friction });

		particle.updateVelocity();

		expect(particle.vx).toBe(vx * friction);
		expect(particle.vy).toBe(vy * friction);
	});

	test("Particle update 테스트 (위치)", () => {
		const [x, y, vx, vy] = [100, 200, 10, 20];
		const particle = new Particle({ ctx, isSmallScreen, x, y, vx, vy });

		particle.updatePosition();

		expect(particle.x).toBe(x + vx);
		expect(particle.y).toBe(y + vy);
	});

	test.each([
		{ initialState: {}, notice: "initialState 없음" },
		{ initialState: { vx: 5, vy: 5 }, notice: "initialState 있음" },
	])("Particle reset 테스트 (사용된 파티클 풀에 리턴시 초기화 | $notice)", ({ initialState }) => {
		const particle = new Particle({ ctx, isSmallScreen, x: 10, y: 10, vx: 1, vy: 1 });
		particle.initialState = initialState;

		particle.reset();
		const expectedResult = { ...PARTICLE_DEFAULT_VALUES, ...initialState };

		expectAllParticleVars(particle, expectedResult);
	});

	test.each([
		{
			params: { x: 5, y: 5, vx: 2, vy: 2, radius: 0.8, opacity: 0.5, friction: 0.6, color: "rgba(0, 0, 0, 1)" },
			initialState: {},
			notice: "initialState 없음",
		},
		{
			params: { x: 10, y: 10, vx: 20, vy: 20, radius: 2, opacity: 0.9 },
			initialState: { friction: 0.6, color: "rgba(0, 0, 0, 1)" },
			notice: "initialState 있음",
		},
	])("Particle reset 테스트 (풀에서 꺼내와서 재사용 | $notice)", ({ params, initialState }) => {
		const particle = new Particle({ ctx, isSmallScreen });
		particle.initialState = initialState;

		particle.reset(params);
		const expectedResult = { ...PARTICLE_DEFAULT_VALUES, ...params, ...initialState };

		expectAllParticleVars(particle, expectedResult);
	});

	test.each([
		{ opacity: 1, opacityLimit: 0.5, expectedResult: false, notice: "커스텀 적용" },
		{ opacity: 0.1, opacityLimit: 0.5, expectedResult: true, notice: "커스텀 적용" },
		{ opacity: -0.004, opacityLimit: 0.1, expectedResult: true, notice: "커스텀 적용" },
		{ opacity: 0.5, opacityLimit: undefined, expectedResult: false, notice: "기본값 0 적용" },
		{ opacity: -0.01, opacityLimit: undefined, expectedResult: true, notice: "기본값 0 적용" },
	])("Particle 투명도 제한 기준 테스트: $opacity < $opacityLimit (opacityLimit $notice)", ({ opacity, opacityLimit, expectedResult }) => {
		const particle = new Particle({ ctx, isSmallScreen, opacity });

		expect(particle.belowOpacityLimit(opacityLimit)).toBe(expectedResult);
	});
});
