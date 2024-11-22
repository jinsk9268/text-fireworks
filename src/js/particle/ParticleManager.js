import { PARTICLE } from "@/js/constants.js";
import TailParticle from "@/js/particle/TailParticle.js";
import SparkParticle from "@/js/particle/SparkParticle.js";
import TextParticle from "@/js/particle/TextParticle.js";
import CircleParticle from "@/js/particle/CircleParticle.js";

const { TYPE_TAIL, TYPE_SPARK, TYPE_TEXT, TYPE_CIRCLE, TAIL_POOL, SPARK_POOL, TEXT_POOL, CIRCLE_POOL } = PARTICLE;
const PARTICLE_MAP = {
	[TYPE_TAIL]: TailParticle,
	[TYPE_SPARK]: SparkParticle,
	[TYPE_TEXT]: TextParticle,
	[TYPE_CIRCLE]: CircleParticle,
};

class ParticleManager {
	constructor(ctx, isSmallScreen) {
		this.ctx = ctx;
		this.isSmallScreen = isSmallScreen;

		this.initParticleManagerVars();
	}

	initParticleManagerVars() {
		this.maxPoolSize = {
			[TYPE_TAIL]: TAIL_POOL,
			[TYPE_SPARK]: SPARK_POOL,
			[TYPE_TEXT]: TEXT_POOL,
			[TYPE_CIRCLE]: CIRCLE_POOL,
		};
		this.pool = {
			[TYPE_TAIL]: [],
			[TYPE_SPARK]: [],
			[TYPE_TEXT]: [],
			[TYPE_CIRCLE]: [],
		};
	}

	/**
	 * @param {string} type tail, spark, text, circle
	 */
	isValidParticleType(type) {
		if (!this.pool.hasOwnProperty(type)) {
			throw new Error(`${type} 유효하지 않는 파티클 타입입니다.`);
		}
	}

	/**
	 * @param {string} type tail, spark, text, circle
	 * @param {object} params 파티클별로 생성에 필요한 파라미터 객체
	 * @returns {TailParticle | SparkParticle | TextParticle | CircleParticle}
	 * 파티클 풀에 해당 파티클이 존재하면 리셋해서 반환, 존재하지 않으면 새로운 파티클을 생성해서 반환
	 */
	acquireParticle(type, params) {
		this.isValidParticleType(type);

		const pool = this.pool[type];
		if (pool.length > 0) {
			const particle = pool.pop();
			particle.reset(params);

			return particle;
		} else {
			params.ctx = this.ctx;
			params.isSmallScreen = this.isSmallScreen;

			return new PARTICLE_MAP[type](params);
		}
	}

	/**
	 * @param {string} type tail, spark, text, circle
	 * @param {TailParticle | SparkParticle | TextParticle | CircleParticle} particle
	 */
	returnToPool(type, particle) {
		this.isValidParticleType(type);

		const pool = this.pool[type];
		if (pool.length < this.maxPoolSize[type]) {
			particle.reset();
			pool.push(particle);
		}
	}
}

export default ParticleManager;
