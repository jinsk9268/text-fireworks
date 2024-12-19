import { TEST_OPTION } from "@/js/constants.js";

/** 공통 설정 적용 */
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: jest.fn().mockImplementation((query) => ({
		matches: window.innerWidth <= parseInt(query.match(/\d+/)[0], 10), // 조건에 따라 true/false 반환
	})),
});

/** 공통 함수 */
/**
 * @param {object} params
 * @param {Window | Document} params.domObj Dom Object
 * @param {string} params.property 지정할 속성
 * @param {*} params.value 속성값
 */
export const defineDomObjectProperty = ({ domObj, property, value }) => {
	Object.defineProperty(domObj, property, { writable: true, value });
};

const { CANVAS_ELEMENT, TYPE_INNER_WIDTH, TYPE_INNER_HEIGHT, INNER_WIDTH, INNER_HEIGHT } = TEST_OPTION;
export const setTestCanvas = () => {
	document.body.innerHTML = CANVAS_ELEMENT;

	defineDomObjectProperty({ domObj: window, property: TYPE_INNER_WIDTH, value: INNER_WIDTH });
	defineDomObjectProperty({ domObj: window, property: TYPE_INNER_HEIGHT, value: INNER_HEIGHT });
};

/**
 * @returns {CanvasRenderingContext2D} jest-canvas-mock의 ctx 반환
 */
export const createMockCanvasCtx = () => {
	const canvas = document.createElement("canvas");
	return canvas.getContext("2d");
};

/**
 * 파티클의 멤버 변수값이 예측 결과값과 일치하는지 검증
 * @param {Particle} particle
 * @param {object} expectedResult
 */
export const expectAllParticleVars = (particle, expectedResult) => {
	expect(particle.x).toBe(expectedResult.x);
	expect(particle.y).toBe(expectedResult.y);
	expect(particle.vx).toBe(expectedResult.vx);
	expect(particle.vy).toBe(expectedResult.vy);
	expect(particle.radius).toBe(expectedResult.radius);
	expect(particle.opacity).toBe(expectedResult.opacity);
	expect(particle.friction).toBe(expectedResult.friction);
	expect(particle.fillColor).toBe(expectedResult.color);
};
