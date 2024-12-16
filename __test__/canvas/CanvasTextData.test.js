import Canvas from "@/js/Canvas.js";
import TextData from "@/js/TextData.js";
import { FONT } from "@/js/constants.js";
import { setTestCanvas } from "../setup.js";

describe("Canvas 클래스 textData 생성 테스트", () => {
	let canvasInst;
	const userInput = "텍스트 데이터 생성";
	const fontSize = 100;

	let spySetMainFontsize;
	let spySetSubFontsize;

	beforeEach(() => {
		setTestCanvas();

		canvasInst = new Canvas();
		canvasInst.text = userInput;
		canvasInst.textLength = userInput.length;
		canvasInst.mainFontSize = fontSize;

		spySetMainFontsize = jest.spyOn(canvasInst, "setMainFontSize");
		spySetSubFontsize = jest.spyOn(canvasInst, "setSubFontSize");
	});

	afterEach(() => {
		spySetMainFontsize.mockClear();
		spySetSubFontsize.mockClear();
	});

	test("adjustFontSize 테스트 | textWidth가 maxWidth 미만일 때", () => {
		canvasInst.getTextWidth = jest.fn(() => fontSize);

		canvasInst.adjustFontSize();

		expect(spySetMainFontsize).not.toHaveBeenCalled();
		expect(spySetSubFontsize).not.toHaveBeenCalled();
		expect(canvasInst.mainFontSize).toBe(fontSize);
	});

	test("adjustFontSize 테스트 | textWidth가 maxWidth 이상일 때", () => {
		canvasInst.getTextWidth = jest.fn((tempSize) => tempSize * 10);

		canvasInst.adjustFontSize();

		const expectedTempSize = 85.7375; // 간단하므로 수기계산함
		const expectedMainFontSize = Math.round(expectedTempSize);

		expect(spySetMainFontsize).toHaveBeenCalledWith(expectedTempSize);
		expect(spySetMainFontsize).toHaveBeenCalledTimes(1);
		expect(canvasInst.mainFontSize).toBe(expectedMainFontSize);
		expect(spySetSubFontsize).toHaveBeenCalledTimes(1);
		expect(canvasInst.subFontSize).toBe(Math.round(expectedMainFontSize * FONT.SUB_RATIO));
	});

	test("createTextDatas 테스트", () => {
		const spyDrawText = jest.spyOn(TextData.prototype, "drawText");
		canvasInst.createTextDatas();

		expect(spyDrawText).toHaveBeenCalledTimes(2);
		expect(canvasInst.mainTextData).not.toEqual({});
		expect(canvasInst.subTextData).not.toEqual({});

		spyDrawText.mockClear();
	});
});
