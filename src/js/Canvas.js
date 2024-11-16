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
		this.text = "";
		this.textLength = 0;
	}
}

export default Canvas;
