import TextData from "@/js/TextData.js";
import { FONT, TEST_OPTION } from "@/js/constants.js";
import { defineWidowProperty } from "./setup.js";

describe("TextData 클래스 단위 테스트", () => {
	let textData;
	const [userInput, fontSize] = ["TextData 테스트", 100];
	const { TYPE_INNER_WIDTH, TYPE_INNER_HEIGHT, INNER_WIDTH, INNER_HEIGHT } = TEST_OPTION;

	beforeEach(() => {
		document.body.innerHTML = '<canvas id="canvas"></canvas>';
		defineWidowProperty(TYPE_INNER_WIDTH, INNER_WIDTH);
		defineWidowProperty(TYPE_INNER_HEIGHT, INNER_HEIGHT);

		textData = new TextData(userInput, fontSize);
		textData.canvas.width = INNER_WIDTH * textData.dpr;
		textData.canvas.height = INNER_HEIGHT * textData.dpr;
	});

	test("TextData 생성자와 멤버변수 초기화", () => {
		expect(textData.text).toBe(userInput);
		expect(textData.fontSize).toBe(fontSize);
		expect(textData.textPixelData).toEqual({});

		expect(textData.ctx.font).toBe(`${fontSize}px "${FONT.FAMILY}"`);
		expect(textData.ctx.textAlign).toBe(FONT.TEXT_ALIGN);
		expect(textData.ctx.textBaseline).toBe(FONT.TEXT_BASELINE);
		expect(textData.ctx.strokeStyle).toBe(FONT.TEXT_COLOR);
	});

	test.each([
		{ width: 200, fontBoundingBoxAscent: 20, fontBoundingBoxDescent: 20 },
		{ width: 200, fontBoundingBoxAscent: undefined, fontBoundingBoxDescent: undefined },
	])(
		"TextData 클래스 drawText - 텍스트를 그리고 픽셀데이터 추출 (fontBoundingBoxAscent,fontBoundingBoxDescent: $fontBoundingBoxAscent일때)",
		(measureTextMockData) => {
			jest.spyOn(textData.ctx, "measureText").mockReturnValue(measureTextMockData);

			const { width, fontBoundingBoxAscent = 0, fontBoundingBoxDescent = 0 } = measureTextMockData;
			const expectedImgX = (textData.mainX - width / 2) * textData.dpr;
			const expectedImgY = (textData.mainY - fontSize / 2 - fontBoundingBoxAscent) * textData.dpr;
			const expectedImgWidth = width * textData.dpr;
			const expectedImgHeight = (fontSize + fontBoundingBoxDescent) * textData.dpr;
			const getImageDataMockData = {
				data: new Uint8ClampedArray(100), // 더미 데이터
				width: expectedImgWidth,
				height: expectedImgHeight,
			};
			jest.spyOn(textData.ctx, "getImageData").mockReturnValue(getImageDataMockData);

			textData.drawText();

			expect(textData.ctx.clearRect).toHaveBeenCalledWith(0, 0, textData.canvas.width, textData.canvas.height);
			expect(textData.ctx.strokeText).toHaveBeenCalledWith(userInput, textData.mainX, textData.mainY);
			expect(textData.ctx.measureText).toHaveBeenCalledWith(userInput);

			expect(textData.ctx.getImageData).toHaveBeenCalledWith(expectedImgX, expectedImgY, expectedImgWidth, expectedImgHeight);
			expect(textData.textPixelData).toBeDefined();
			expect(textData.textPixelData.data).toBeInstanceOf(Uint8ClampedArray);
			expect(textData.textPixelData).toEqual(getImageDataMockData);
		},
	);
});
