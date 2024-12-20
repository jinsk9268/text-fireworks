import Canvas from "@/js/Canvas.js";
import { LOCATION_HASH, SCREEN } from "@/js/constants.js";

const canvas = new Canvas();

const { HOME, FIREWORKS, FIREWORKS_HASH } = LOCATION_HASH;

const domElements = {
	body: document.body,
	home: document.getElementById(HOME),
	fireworks: document.getElementById(FIREWORKS),
	inputForm: document.getElementById("input_form"),
	userInput: document.getElementById("user_input"),
};

const isHashFireworks = () => location.hash == FIREWORKS_HASH;

/**
 * @param {string} screen home || fireworks
 */
const switchScreen = (screen) => {
	domElements.home.style.display = screen == HOME ? "flex" : "none";
	domElements.fireworks.style.display = screen == FIREWORKS ? "block" : "none";
};

/** 리스너 */
const handleLoad = () => {
	domElements.body.style.visibility = "visible";
	if (isHashFireworks()) {
		location.hash = "";
	}
};

let resizeTimeout;
const handleResize = () => {
	clearTimeout(resizeTimeout);

	resizeTimeout = setTimeout(() => {
		if (isHashFireworks()) {
			canvas.init();
			canvas.createTextDatas();
		}
	}, SCREEN.RESIZE_DELAY);
};

const handleSubmit = (e) => {
	e.preventDefault();

	const userInputValue = domElements.userInput.value.trim();
	if (userInputValue.length > 0 && userInputValue.length <= 10) {
		canvas.text = userInputValue;
		canvas.textLength = userInputValue.length;
		location.hash = FIREWORKS_HASH;
	} else {
		alert("글자를 입력해주세요. 1~10글자까지 입력 가능합니다.");
	}
};

const handleHashChange = () => {
	if (isHashFireworks()) {
		canvas.init();
		canvas.render();

		switchScreen(FIREWORKS);
	} else {
		cancelAnimationFrame(canvas.animationId);
		domElements.userInput.value = "";
		canvas.initCanvasVars();

		switchScreen(HOME);
	}
};

/** 이벤트 */
window.addEventListener("load", handleLoad);
window.addEventListener("resize", handleResize);
domElements.inputForm.addEventListener("submit", (e) => handleSubmit(e));
window.addEventListener("hashchange", handleHashChange);

switchScreen(isHashFireworks() ? FIREWORKS : HOME);
