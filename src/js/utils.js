import { PARTICLE } from "@/js/constants.js";

/**
 * @param {number} min
 * @param {number} max
 * @param {number} [decimal=2]
 * @returns {number} min과 max 사이의 소수점 decimal(기본값:2)자리의 랜덤한 소수 반환
 */
export function randomFloat(min, max, decimal = 2) {
	return parseFloat((Math.random() * (max - min) + min).toFixed(decimal));
}

/**
 * @param {number} min
 * @param {number} max
 * @returns {number} min과 max 사이의 랜덤한 정수 반환
 */
export function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * @param {string} [rgb] "255, 255, 210" (반드시 옆의 형식으로 기입)
 * @param {number} [opacity]
 * @returns {string} 파티클 색성에 적용할 RGBA 문자열 반환
 */
export function setRgbaColor(rgb = PARTICLE.RGB, opacity = 1) {
	return `rgba(${rgb}, ${opacity})`;
}

/**
 * @param {object} [params]
 * @param {number} [params.hue]
 * @param {number} [params.saturation]
 * @param {number} [params.lightness]
 * @returns {string} 파티클 색상애 적용할 HSLA 문자열 반환
 */
export function setHslaColor(params = {}) {
	const {
		hue = PARTICLE.HUE,
		saturation = randomInt(PARTICLE.MIN_SATURATION, PARTICLE.MAX_SATURATION),
		lightness = randomInt(PARTICLE.MIN_LIGHTNESS, PARTICLE.MAX_LIGHTNESS),
	} = params;

	return `hsla(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * @param {number} num
 * @returns {boolean} 짝수면 true 반환, 홀수면 false 반환
 */
export function isEven(num) {
	return num % 2 === 0;
}
