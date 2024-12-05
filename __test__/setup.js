/**
 * @param {string} property 지정할 속성
 * @param {*} value 속성값
 */
export const defineWidowProperty = (property, value) => {
	Object.defineProperty(window, property, { writable: true, value });
};

Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: jest.fn().mockImplementation((query) => ({
		matches: window.innerWidth <= parseInt(query.match(/\d+/)[0], 10), // 조건에 따라 true/false 반환
	})),
});
