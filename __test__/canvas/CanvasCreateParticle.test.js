import Canvas from "@/js/Canvas.js";
import ParticleManager from "@/js/particle/ParticleManager.js";
import TailParticle from "@/js/particle/TailParticle.js";
import TextParticle from "@/js/particle/TextParticle.js";
import CircleParticle from "@/js/particle/CircleParticle.js";
import SparkParticle from "@/js/particle/SparkParticle.js";
import { TEST_OPTION, TEXT, CIRCLE, SPARK } from "@/js/constants.js";
import { setTestCanvas } from "../setup.js";

describe("Canvas 클래스 파티클 생성 테스트", () => {
	let canvasInst;
	const userInput = "텍스트 데이터 생성";
	const fontSize = 100;
	const { INNER_HEIGHT } = TEST_OPTION;

	let spyAcquireParticle;

	beforeEach(() => {
		setTestCanvas();

		spyAcquireParticle = jest.spyOn(ParticleManager.prototype, "acquireParticle");

		canvasInst = new Canvas();
		canvasInst.text = userInput;
		canvasInst.textLength = userInput.length;
		canvasInst.isSmallScreen = false;
		canvasInst.mainFontSize = fontSize;
	});

	afterEach(() => {
		spyAcquireParticle.mockClear();
	});

	function expectedCreatedParticleArr({ particleArr, expectedLen, particle, callTimeCnt }) {
		expect(particleArr).toHaveLength(expectedLen);
		expect(particleArr[0]).toBeInstanceOf(particle);
		expect(spyAcquireParticle).toHaveBeenCalledTimes(callTimeCnt ?? expectedLen);
	}

	describe("TailParticle 생성 테스트", () => {
		test("createTailParticle 테스트 | tailCount = 0일 때", () => {
			canvasInst.createTailParticle();

			expect(spyAcquireParticle).toHaveBeenCalledTimes(1);
			expect(canvasInst.tailParticles).toHaveLength(1);
			const createdTail = canvasInst.tailParticles[0];

			expect(createdTail).toBeInstanceOf(TailParticle);
			expect(createdTail.x).toBe(canvasInst.mainX);
			expect(createdTail.y).toBe(INNER_HEIGHT);
			expect(createdTail.vy).toBe(canvasInst.mainTailVY);
			expect(canvasInst.tailCount).toBe(1);
			expect(canvasInst.isLeft).toBeTruthy();
		});

		test.each([
			{ tailCount: 1, afterTailCount: 2, isLeft: true },
			{ tailCount: 4, afterTailCount: 0, isLeft: false },
		])("createTailParticle 테스트 | tailCount = $tailCount, isLeft = $isLeft일 때", ({ tailCount, afterTailCount, isLeft }) => {
			canvasInst.isLeft = isLeft;
			canvasInst.tailCount = tailCount;

			canvasInst.init();
			canvasInst.createTailParticle();

			const reusedTail = canvasInst.tailParticles[0];
			expectedCreatedParticleArr({ particleArr: canvasInst.tailParticles, expectedLen: 1, particle: TailParticle });
			expect(isLeft ? canvasInst.tailsLeftPosX : canvasInst.tailsRightPosX).toContain(reusedTail.x);
			expect(reusedTail.y).toBe(INNER_HEIGHT);
			expect(canvasInst.tailsVY).toContain(reusedTail.vy);
			expect(canvasInst.tailCount).toBe(afterTailCount);
			expect(canvasInst.isLeft).toBe(!isLeft);
		});
	});

	describe("TextParticle 생성 테스트", () => {
		function getTextData({ widthOrHeightZero, width, height, alphaValue }) {
			width = widthOrHeightZero ? 0 : width;
			height = widthOrHeightZero ? 0 : height;

			return { data: new Array(width * 4 * height * 4).fill(alphaValue), width, height };
		}

		test.each([
			{ isMain: true, isSmallScreen: false, alphaValue: 255, widthOrHeightZero: false },
			{ isMain: true, isSmallScreen: true, alphaValue: 255, widthOrHeightZero: false },
			{ isMain: false, isSmallScreen: false, alphaValue: 0, widthOrHeightZero: false },
			{ isMain: false, isSmallScreen: true, alphaValue: 0, widthOrHeightZero: false },
			{ isMain: true, isSmallScreen: false, alphaValue: 255, widthOrHeightZero: true },
			{ isMain: false, isSmallScreen: true, alphaValue: 255, widthOrHeightZero: true },
		])(
			"createTextParticles 테스트 | isMain = $isMain, isSmallScreen = $isSmallScreen, alpha = $alphaValue, (width || height) = $widthOrHeightZero일 때",
			({ isMain, isSmallScreen, alphaValue, widthOrHeightZero }) => {
				const [x, y, vx, vy, width, height, offset] = [100, 100, 10, 10, 8, 10, 4];
				jest.spyOn(canvasInst, "isMain").mockReturnValue(isMain).mockClear();
				jest.spyOn(canvasInst, "calculateTextParticleVelocity").mockReturnValue({ vx, vy });

				canvasInst.mainTextData = getTextData({ widthOrHeightZero, width, height, alphaValue });
				canvasInst.subTextData = getTextData({ widthOrHeightZero, width: width - offset, height: height - offset, alphaValue });
				canvasInst.isSmallScreen = isSmallScreen;

				canvasInst.createTextParticle(x, y);

				if (alphaValue === 0 || widthOrHeightZero) {
					expect(canvasInst.textParticles).toHaveLength(0);
					expect(spyAcquireParticle).not.toHaveBeenCalled();
				} else {
					const expectedFrequency = canvasInst.isSmallScreen ? TEXT.SMALL_FREQUENCY : TEXT.GENERAL_FREQUENCY;
					const expectedData = isMain ? canvasInst.mainTextData : canvasInst.subTextData;
					const expectedLen = Math.ceil(expectedData.width / expectedFrequency) * Math.ceil(expectedData.height / expectedFrequency);
					expectedCreatedParticleArr({ particleArr: canvasInst.textParticles, expectedLen, particle: TextParticle });
				}
			},
		);

		test.each([
			{ isMain: true, mainTextData: {}, notice: "mainTextData" },
			{ isMain: false, subTextData: {}, notice: "subTextData" },
		])("createTextParticle 테스트 | $notice가 없는 경우", ({ isMain, mainTextData, subTextData }) => {
			const mockTextData = getTextData({ widthOrHeightZero: false, width: 8, height: 8, alphaValue: 255 });

			jest.spyOn(canvasInst, "isMain").mockReturnValue(isMain).mockClear();
			canvasInst.mainTextData = mainTextData ?? mockTextData;
			canvasInst.subTextData = subTextData ?? mockTextData;
			canvasInst.createTextParticle(5, 5);

			expect(canvasInst.textParticles).toHaveLength(0);
			expect(spyAcquireParticle).not.toHaveBeenCalled();
		});
	});

	describe("CircleParticle 생성 테스트", () => {
		test("createCircleParticle 테스트", () => {
			canvasInst.createCircleParticle(100, 100);

			expectedCreatedParticleArr({
				particleArr: canvasInst.circleParticles,
				expectedLen: CIRCLE.LAYERS * CIRCLE.PER_QTY,
				particle: CircleParticle,
			});
		});
	});

	describe("SparkParticle 생성 테스트", () => {
		test("updateTailParticle에서 SparkParticle 생성", () => {
			canvasInst.init();
			canvasInst.createTailParticle();
			canvasInst.updateTailParticle();

			const expectedLen = Math.round(Math.abs(canvasInst.tailParticles[0].vy * SPARK.TAIL_CREATION_RATE));
			expectedCreatedParticleArr({
				particleArr: canvasInst.sparkParticles,
				expectedLen,
				particle: SparkParticle,
				callTimeCnt: expectedLen + 1,
			});
		});

		test("updateCircleParticle에서 SparkParticle 생성", () => {
			const spyMathRandom = jest.spyOn(Math, "random").mockReturnValue(0.1);
			canvasInst.init();
			canvasInst.createCircleParticle();
			canvasInst.updateCircleParticle();

			const expectedLen = CIRCLE.LAYERS * CIRCLE.PER_QTY;
			expectedCreatedParticleArr({
				particleArr: canvasInst.sparkParticles,
				expectedLen,
				particle: SparkParticle,
				callTimeCnt: expectedLen * 2,
			});

			spyMathRandom.mockRestore();
		});
	});
});
