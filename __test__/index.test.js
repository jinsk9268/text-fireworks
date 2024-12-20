import { fireEvent, screen } from "@testing-library/dom";
import Canvas from "@/js/Canvas";
import { LOCATION_HASH, SCREEN } from "@/js/constants";
import { defineDomObjectProperty } from "./setup";

describe("index.js 통합 테스트", () => {
	const { HOME, FIREWORKS, FIREWORKS_HASH } = LOCATION_HASH;

	beforeEach(async () => {
		document.body.innerHTML = `
			<div id="home">
				<form id="input_form" aria-label="입력 폼">
					<label for="user_input">글자를 입력해주세요</label>
					<input id="user_input" />
					<button id="submit_btn" type="submit">완료</button>
				</form>
			</div>
			<div id="fireworks">
				<canvas id="canvas"></canvas>
			</div>
		`;
		window.location.hash = "";
		await import("@/index.js");
	});

	afterEach(() => {
		document.body.innerHTML = "";
		jest.resetModules();
	});

	describe("load 이벤트 테스트", () => {
		beforeEach(() => {
			document.body.style.visibility = "hidden";
		});

		test.each([
			{ hash: "", notice: `hash가 ""에서 ""로 변경되지 않는다.` },
			{ hash: FIREWORKS_HASH, notice: `hash가 ${FIREWORKS_HASH}에서 ""로 변경된다.` },
		])("hash에 따른 load 테스트 | 로드 후 $notice", ({ hash }) => {
			window.location.hash = hash;

			const loadEvent = new Event("load");
			window.dispatchEvent(loadEvent);

			expect(document.body.style.visibility).toBe("visible");
			expect(window.location.hash).toBe("");
		});
	});

	describe("resize 이벤트 테스트", () => {
		let spyInit, spyCreateTextDatas;
		let spyClearTimeout, spySetTimeout;

		beforeEach(() => {
			jest.useFakeTimers();
			spyInit = jest.spyOn(Canvas.prototype, "init");
			spyCreateTextDatas = jest.spyOn(Canvas.prototype, "createTextDatas");
			spyClearTimeout = jest.spyOn(global, "clearTimeout");
			spySetTimeout = jest.spyOn(global, "setTimeout");
		});

		afterEach(() => {
			jest.clearAllTimers();
			jest.clearAllMocks();
		});

		test.each([
			{ hash: "", notice: `""일 때 아무것도 실행하지 않는다.` },
			{ hash: FIREWORKS_HASH, notice: `${FIREWORKS_HASH}일 때 canvas 초기화와 텍스트 데이터를 새로 생성한다.` },
		])("hash에 따른 resize 이벤트 | hash가 $notice", ({ hash }) => {
			window.location.hash = hash;

			const resizeEvent = new Event("resize");
			window.dispatchEvent(resizeEvent);

			expect(spyClearTimeout).toHaveBeenCalled();
			expect(spySetTimeout).toHaveBeenCalledWith(expect.any(Function), SCREEN.RESIZE_DELAY);

			jest.runAllTimers();

			if (hash === FIREWORKS_HASH) {
				expect(spyInit).toHaveBeenCalled();
				expect(spyCreateTextDatas).toHaveBeenCalled();
			} else {
				expect(spyInit).not.toHaveBeenCalled();
				expect(spyCreateTextDatas).not.toHaveBeenCalled();
			}
		});
	});

	describe("submit 이벤트 테스트", () => {
		const [enterKey, buttonClick] = ["엔터", "버튼"];
		let spyAlert;

		beforeEach(() => {
			spyAlert = jest.spyOn(window, "alert").mockImplementation(() => {});
		});

		afterEach(() => {
			spyAlert.mockClear();
		});

		function callSubmitEvent({ type, value }) {
			const userInput = screen.getByLabelText("글자를 입력해주세요");
			fireEvent.input(userInput, { target: { value } });

			if (type === enterKey) fireEvent.submit(screen.getByRole("form"));
			if (type === buttonClick) fireEvent.click(screen.getByRole("button", { name: "완료" }));
		}

		test.each([
			{ type: enterKey, value: "테스트 중", notice: "엔터 키 입력" },
			{ type: buttonClick, value: "1234567890", notice: "버튼 클릭" },
		])("$notice으로 submit 이벤트 트리거", ({ type, value }) => {
			callSubmitEvent({ type, value });

			expect(window.location.hash).toBe(FIREWORKS_HASH);
			expect(spyAlert).not.toHaveBeenCalled();
		});

		test.each([
			{ type: enterKey, value: "", notice: "엔터 키 입력" },
			{ type: buttonClick, value: "123456789011", notice: "버튼 클릭" },
		])("1~10 글자가 아닐 때 $notice으로 submit 이벤트 트리거", ({ type, value }) => {
			callSubmitEvent({ type, value });

			expect(window.location.hash).toBe("");
			expect(spyAlert).toHaveBeenCalledWith(expect.any(String));
		});
	});

	describe("hashchange 이벤트 테스트", () => {
		let spyCanvasInit, spyCanvasRender, spyInitCanvasVars;
		let spyCancelAnimaionFrame;

		beforeEach(() => {
			spyCanvasInit = jest.spyOn(Canvas.prototype, "init");
			spyCanvasRender = jest.spyOn(Canvas.prototype, "render");
			spyInitCanvasVars = jest.spyOn(Canvas.prototype, "initCanvasVars");
			spyCancelAnimaionFrame = jest.spyOn(global, "cancelAnimationFrame");

			defineDomObjectProperty({ domObj: document, property: "timeline", value: { currentTime: 0 } });
		});

		afterEach(() => {
			jest.clearAllMocks();
		});

		/**
		 * @param {string} hash
		 */
		function callHashchangeEvent(hash = "") {
			window.location.hash = hash;

			const hashChangeEvent = new Event("hashchange");
			window.dispatchEvent(hashChangeEvent);
		}

		/**
		 * @param {object} params
		 * @param {string} params.home flex || none
		 * @param {string} params.fireworks block || none
		 */
		function expectedPageStyle({ home, fireworks }) {
			expect(document.getElementById(HOME).style.display).toBe(home);
			expect(document.getElementById(FIREWORKS).style.display).toBe(fireworks);
		}

		test(`hash가 ""에서 ${FIREWORKS_HASH}으로 변경될 때`, () => {
			callHashchangeEvent(FIREWORKS_HASH);

			expect(spyCanvasInit).toHaveBeenCalledTimes(1);
			expect(spyCanvasRender).toHaveBeenCalledTimes(1);
			expectedPageStyle({ home: "none", fireworks: "block" });
		});

		test(`hsah가 ${FIREWORKS_HASH}에서 ""으로 변경될 때`, () => {
			callHashchangeEvent();

			expect(spyCancelAnimaionFrame).toHaveBeenCalled();
			expect(document.getElementById("user_input").value).toBe("");
			expect(spyInitCanvasVars).toHaveBeenCalledTimes(1);
			expectedPageStyle({ home: "flex", fireworks: "none" });
		});
	});
});
