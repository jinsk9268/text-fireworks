import Canvas from "@/js/Canvas.js";
import CanvasOption from "@/js/CanvasOption.js";
import { ANIMATION } from "@/js/constants.js";
import { setTestCanvas } from "../setup.js";

describe("Canvas 클래스 애니메이션 테스트", () => {
	let canvasInst;
	const userInput = "텍스트 데이터 생성";

	let spyFillFullCanvas;
	let spyCreateTailParticle;
	let spyUpdateTailParticle;
	let spyUpdateCircleParticle;
	let spyUpdateTextParticle;
	let spyUpdateSparkParticle;

	beforeEach(() => {
		jest.useFakeTimers();

		Object.defineProperty(document, "timeline", {
			writable: true,
			value: { currentTime: 0 },
		});

		setTestCanvas();
		canvasInst = new Canvas();
		canvasInst.text = userInput;
		canvasInst.textLength = userInput.length;

		spyFillFullCanvas = jest.spyOn(CanvasOption.prototype, "fillFullCanvas").mockImplementation(() => {});
		spyCreateTailParticle = jest.spyOn(canvasInst, "createTailParticle").mockImplementation(() => {});
		spyUpdateTailParticle = jest.spyOn(canvasInst, "updateTailParticle").mockImplementation(() => {});
		spyUpdateCircleParticle = jest.spyOn(canvasInst, "updateCircleParticle").mockImplementation(() => {});
		spyUpdateTextParticle = jest.spyOn(canvasInst, "updateTextParticle").mockImplementation(() => {});
		spyUpdateSparkParticle = jest.spyOn(canvasInst, "updateSparkParticle").mockImplementation(() => {});
	});

	afterEach(() => {
		jest.useRealTimers();
		spyFillFullCanvas.mockClear();
		spyCreateTailParticle.mockClear();
		spyUpdateTailParticle.mockClear();
		spyUpdateCircleParticle.mockClear();
		spyUpdateTextParticle.mockClear();
		spyUpdateSparkParticle.mockClear();
	});

	let fpsMultiplier = 1;
	test.each(
		["1", "12", "123", "1234", "12345", "123456", "1234567", "12345678", "123456789", "1234567890"].map((s) => ({
			userInput: s,
			length: s.length,
		})),
	)("animateFireworks 테스트 | 문자열 길이 : $length | fps: 60의 배수 | 관련 동작 호출 횟수 검증", ({ userInput, length }) => {
		canvasInst.text = userInput;
		canvasInst.textLength = length;
		canvasInst.init();
		canvasInst.createTextDatas();

		expect(canvasInst.animationId).toBeUndefined();

		canvasInst.animateFireworks();

		const fps = 60 * fpsMultiplier++;
		const frameCountDivisor = ANIMATION.TAIL_FPS + length * ANIMATION.TEXT_LEN_MULTIPLIER;
		const fillCanvasAndCreateTailCallCnt = Math.ceil(fps / frameCountDivisor);

		jest.advanceTimersByTime(canvasInst.interval * fps);
		jest.runOnlyPendingTimers();

		expect(spyFillFullCanvas).toHaveBeenCalledWith(expect.any(String));
		expect(spyFillFullCanvas).toHaveBeenCalledTimes(fps + fillCanvasAndCreateTailCallCnt);
		expect(spyCreateTailParticle).toHaveBeenCalledTimes(fillCanvasAndCreateTailCallCnt);
		expect(spyUpdateTailParticle).toHaveBeenCalledTimes(fps);
		expect(spyUpdateCircleParticle).toHaveBeenCalledTimes(fps);
		expect(spyUpdateTextParticle).toHaveBeenCalledTimes(fps);
		expect(spyUpdateSparkParticle).toHaveBeenCalledTimes(fps);
		expect(canvasInst.animationId).not.toBeUndefined();
	});
});

describe("Canvas 클래스 렌더 테스트", () => {
	let canvasInst;
	let spyCreateTextData;
	let spyAnimateFireworks;

	beforeEach(() => {
		setTestCanvas();
		canvasInst = new Canvas();

		spyCreateTextData = jest.spyOn(canvasInst, "createTextDatas");
		spyAnimateFireworks = jest.spyOn(canvasInst, "animateFireworks");
	});

	afterEach(() => {
		spyCreateTextData.mockClear();
		spyAnimateFireworks.mockClear();
	});

	test.each([
		{ text: "render 테스트", notice: "있음 (문자열 : render 테스트)", called: true },
		{ text: "", notice: "없음", called: false },
	])("render 테스트 | 사용 문자열: $notice | 텍스트 데이터 생성 & 애니메이션 실행: $called", ({ text }) => {
		canvasInst.text = text;
		canvasInst.textLength = text.length;
		canvasInst.init();

		canvasInst.render();

		if (text.length > 0) {
			expect(spyCreateTextData).toHaveBeenCalled();
			expect(spyAnimateFireworks).toHaveBeenCalled();
		} else {
			expect(spyCreateTextData).not.toHaveBeenCalled();
			expect(spyAnimateFireworks).not.toHaveBeenCalled();
		}
	});
});
