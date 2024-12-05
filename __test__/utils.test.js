import { randomFloat, randomInt, setRgbaColor, setHslaColor, isEven } from "@/js/utils.js";
import { PARTICLE } from "@/js/constants.js";

const NOTICE_UNDEFINED = "| 파라미터 기본값 적용: 테스트-인자에 undefined, 실사용-인자 전달 X";

describe("utils.js 테스트", () => {
	/** randomFloat */
	test.each([
		{ min: 1, max: 3, decimal: undefined, NOTICE_UNDEFINED },
		{ min: 0.8, max: 2.5, decimal: 1, NOTICE_UNDEFINED },
		{ min: -5, max: 5, decimal: 4, NOTICE_UNDEFINED },
	])("randomFloat 테스트 (min: $min, max: $max, decimal: $decimal) $NOTICE_UNDEFINED", ({ min, max, decimal }) => {
		for (let i = 0; i < 100; i++) {
			const result = randomFloat(min, max, decimal);
			expect(result).toBeGreaterThanOrEqual(min);
			expect(result).toBeLessThanOrEqual(max);
			expect(result).toBeCloseTo(result, decimal ?? 2);
		}
	});

	/** randomInt */
	test("randomInt 테스트", () => {
		for (let i = 0; i < 100; i++) {
			const result = randomInt(-50, 50);
			expect(result).toBeGreaterThanOrEqual(-50);
			expect(result).toBeLessThanOrEqual(50);
			expect(Number.isInteger(result)).toBe(true);
		}
	});

	/** setRgbaColor */
	test.each([
		{ rgb: undefined, opacity: undefined, NOTICE_UNDEFINED },
		{ rgb: "0, 10, 255", opacity: undefined, NOTICE_UNDEFINED },
		{ rgb: undefined, opacity: 0.5, NOTICE_UNDEFINED },
		{ rgb: "255, 255, 255", opacity: 0.8, NOTICE_UNDEFINED },
	])("setRgbaColor 테스트(rgb: $rgb, opacity: $opacity) $NOTICE_UNDEFINED", ({ rgb, opacity }) => {
		const result = setRgbaColor(rgb, opacity);
		expect(result).toBe(`rgba(${rgb ?? PARTICLE.RGB}, ${opacity ?? 1})`);
	});

	/** setHslaColor */
	test.each([
		{ hue: undefined, saturation: undefined, lightness: undefined, NOTICE_UNDEFINED },
		{ hue: 100, saturation: undefined, lightness: undefined, NOTICE_UNDEFINED },
		{ hue: undefined, saturation: 100, lightness: undefined, NOTICE_UNDEFINED },
		{ hue: undefined, saturation: undefined, lightness: 100, NOTICE_UNDEFINED },
		{ hue: 5, saturation: 20, lightness: 100, NOTICE_UNDEFINED },
	])("setHslaColor 테스트 (hue: $hue, saturation: $saturation, lightness: $lightness) $NOTICE_UNDEFINED", ({ hue, saturation, lightness }) => {
		const result = setHslaColor({ hue, lightness, saturation });
		const expectResult = new RegExp(`^hsla\\(${hue ?? PARTICLE.HUE}, ${saturation ?? "\\d{1,3}"}%, ${lightness ?? "\\d{1,3}"}%\\)$`);
		expect(result).toMatch(expectResult);
	});
});
