import CanvasOption from "@/js/CanvasOption.js";

class Canvas extends CanvasOption {
	constructor() {
		super();
		this.initCanvasVars();
	}

	init() {
		super.init();

		this.canvas.width = this.canvasCssWidth * this.dpr;
		this.canvas.height = this.canvasCssHeight * this.dpr;
		this.ctx.scale(this.dpr, this.dpr);

		this.canvas.style.width = `${this.canvasCssWidth}px`;
		this.canvas.style.height = `${this.canvasCssHeight}px`;
	}

	initCanvasVars() {
		this.animationId = undefined;

		this.text = "";
		this.textLength = 0;
	}

	animateFireworks() {
		let then = document.timeline.currentTime;

		/**
		 * requestAnimationFrame에 전달할 콜백 함수
		 * @param {number} now requestAnimationFrame의 timestamp (밀리 초)
		 */
		const frame = (now) => {
			const delta = now - then;

			if (delta >= this.interval) {
				// TODO: 애니메이션 코드 업데이트

				then = now - (delta % this.interval);
			}
			console.log("애니메이션 진행중");
			this.animationId = requestAnimationFrame(frame);
		};

		this.animationId = requestAnimationFrame(frame);
	}

	render() {
		if (this.text !== "") {
			this.animateFireworks();
		}
	}
}

export default Canvas;
