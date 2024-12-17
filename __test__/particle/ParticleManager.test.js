import ParticleManager, { PARTICLE_MAP } from "@/js/particle/ParticleManager.js";
import Particle from "@/js/particle/Particle.js";
import { PARTICLE, TEST_OPTION, TAIL, TEXT, CIRCLE } from "@/js/constants.js";
import { createMockCanvasCtx, expectAllParticleVars } from "../setup.js";
import { randomFloat, setRgbaColor, isUndefined } from "@/js/utils.js";

jest.mock("@/js/utils", () => {
	const { isUndefined } = jest.requireActual("@/js/utils");
	return {
		isUndefined,
		randomFloat: jest.fn(),
		setRgbaColor: jest.fn(),
	};
});

describe("ParticleManager 단위 테스트", () => {
	let ctx;
	let isSmallScreen = false;
	let particleManager;
	const { PARTICLE_DEFAULT_VALUES } = TEST_OPTION;
	const { TYPE_TAIL, TYPE_SPARK, TYPE_TEXT, TYPE_CIRCLE, TAIL_POOL, SPARK_POOL, TEXT_POOL, CIRCLE_POOL } = PARTICLE;
	const data = [
		{
			type: TYPE_TAIL,
			params: { x: 5, y: 5, vy: 1 },
			originVars: { initialX: 5, radian: TAIL.RADIAN },
			resetOriginVars: { initialX: 0, radian: TAIL.RADIAN },
		},
		{
			type: TYPE_TEXT,
			params: { x: 10, y: 10, vx: 1.5, vy: 2.7, color: "rgba(155, 255, 255, 0,85)" },
			originVars: { gravity: TEXT.GRAVITY },
		},
		{
			type: TYPE_CIRCLE,
			params: { x: 2, y: 2, vx: 1, vy: 2, radius: 2.3, opacity: 0.78, color: "hsla(20, 50%, 50%)" },
			originVars: { gravity: CIRCLE.GRAVITY },
			initialState: { friction: CIRCLE.FRICTION },
		},
		{ type: TYPE_SPARK, params: { x: 300, y: 1000, vx: 20, vy: -30, radius: 2, opacity: 0.78, color: "hsla(270, 50%, 50%)" } },
	];

	let spyPartricleReset;

	beforeAll(() => {
		randomFloat.mockReturnValue(PARTICLE_DEFAULT_VALUES.opacity);
		setRgbaColor.mockReturnValue(PARTICLE_DEFAULT_VALUES.color);
	});

	beforeEach(() => {
		ctx = createMockCanvasCtx();
		particleManager = new ParticleManager(ctx, isSmallScreen);

		spyPartricleReset = jest.spyOn(Particle.prototype, "reset");
	});

	afterEach(() => {
		spyPartricleReset.mockClear();
	});

	/**
	 * 파티클의 모든 속성이 예상값과 일치하는지 검증
	 * @param {object} params
	 * @param {Particle} params.particle Tail | Circle | Text | Spark
	 * @param {object} params.expectedResult
	 * @param {object} params.originVars
	 * @param {object} params.initialState
	 */
	function expectedTestValues({ particle, expectedResult, originVars, initialState }) {
		expectAllParticleVars(particle, expectedResult);
		if (!isUndefined(originVars)) {
			Object.keys(originVars).forEach((key) => {
				expect(particle).toHaveProperty(key, originVars[key]);
			});
		}
		if (!isUndefined(initialState)) {
			expect(particle.initialState).toEqual(initialState);
		}
	}

	test("생성자와 멤버변수 초기화 테스트", () => {
		expect(particleManager.ctx).toBeInstanceOf(CanvasRenderingContext2D);
		expect(particleManager.isSmallScreen).toBe(false);
		expect(particleManager.maxPoolSize).toEqual({
			[TYPE_TAIL]: TAIL_POOL,
			[TYPE_SPARK]: SPARK_POOL,
			[TYPE_TEXT]: TEXT_POOL,
			[TYPE_CIRCLE]: CIRCLE_POOL,
		});
		expect(particleManager.pool).toEqual({
			[TYPE_TAIL]: [],
			[TYPE_SPARK]: [],
			[TYPE_TEXT]: [],
			[TYPE_CIRCLE]: [],
		});
	});

	describe("isValidParticleType 테스트", () => {
		test.each([TYPE_TAIL, TYPE_CIRCLE, TYPE_TEXT, TYPE_SPARK])("유효한 타입 | %s", (type) => {
			expect(() => particleManager.isValidParticleType(type)).not.toThrow();
		});

		test.each(["fireworks", `${TYPE_CIRCLE}s`])("유효하지 않는 타입 | %s", (type) => {
			expect(() => particleManager.isValidParticleType(type)).toThrow(`${type} 유효하지 않는 파티클 타입입니다.`);
		});
	});

	describe("acquireParticle 테스트", () => {
		test.each(data)("풀에 파티클 존재하지 않음 | 전달된 인자로 새로 생성 후 $type 반환", ({ type, params, originVars, initialState }) => {
			expect(particleManager.pool[type]).toHaveLength(0);
			const createdParticle = particleManager.acquireParticle(type, params);

			expectedTestValues({
				particle: createdParticle,
				expectedResult: { ...PARTICLE_DEFAULT_VALUES, ...params, ...initialState },
				originVars,
				initialState,
			});

			expect(spyPartricleReset).not.toHaveBeenCalled();
		});

		test.each(data)("풀에 파티클이 존재함 | 전달된 인자로 재사용 초기화 후 $type 반환", ({ type, params, originVars, initialState }) => {
			particleManager.pool[type].push(new PARTICLE_MAP[type]({ ctx, isSmallScreen }));

			const reusedParticle = particleManager.acquireParticle(type, params);
			expectedTestValues({
				particle: reusedParticle,
				expectedResult: { ...PARTICLE_DEFAULT_VALUES, ...params, ...initialState },
				originVars,
				initialState,
			});

			expect(spyPartricleReset).toHaveBeenCalledTimes(1);
		});
	});

	describe("returnToPool 테스트", () => {
		test.each(data)(
			"풀에 여유 공간이 있음 | 기본값으로 초기화 후 $type 풀에 반환",
			({ type, params, originVars, resetOriginVars, initialState }) => {
				const returnedParticle = new PARTICLE_MAP[type]({ ctx, isSmallScreen, ...params });

				expect(particleManager.pool[type].length).toBeLessThan(particleManager.maxPoolSize[type]);
				particleManager.returnToPool(type, returnedParticle);

				expectedTestValues({
					particle: particleManager.pool[type][0],
					expectedResult: { ...PARTICLE_DEFAULT_VALUES, ...initialState },
					originVars: resetOriginVars ?? originVars,
					initialState,
				});
				expect(particleManager.pool[type]).toHaveLength(1);

				expect(spyPartricleReset).toHaveBeenCalledTimes(1);
			},
		);

		test.each(data)("풀에 여유공간 없음 | $type 풀에 반환되지 않음", ({ type, params }) => {
			particleManager.maxPoolSize[type] = 1; // 원활한 테스트를 위해 1로 설정
			particleManager.pool[type].push(new PARTICLE_MAP[type]({ ctx, isSmallScreen }));
			expect(particleManager.pool[type]).toHaveLength(1);

			const returnedParticle = new PARTICLE_MAP[type]({ ctx, isSmallScreen, ...params });
			particleManager.returnToPool(type, returnedParticle);

			expect(particleManager.pool[type]).toHaveLength(1);
			expect(spyPartricleReset).not.toHaveBeenCalled();
		});
	});
});
