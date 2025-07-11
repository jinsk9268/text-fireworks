import CanvasOption from "@/js/CanvasOption.js";
import { FONT } from "@/js/constants.js";

class TextData extends CanvasOption {
	/**
	 * 사용자가 입력한 Text를 캔버스에 그리고 픽셀 데이터를 생성하기 위한 클래스
	 * @param {string} userInput
	 * @param {number} fontSize
	 */
	constructor(userInput, fontSize) {
		super();

		this.text = userInput;
		this.fontSize = fontSize;
		this.ctx.font = this.setFontStyle(fontSize);
		this.ctx.textAlign = FONT.TEXT_ALIGN;
		this.ctx.textBaseline = FONT.TEXT_BASELINE;
		this.ctx.strokeStyle = FONT.TEXT_COLOR;
		this.textPixelData = {};
	}

	drawText() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.strokeText(this.text, this.mainX, this.mainY);

		const { width, fontBoundingBoxAscent = 0, fontBoundingBoxDescent = 0 } = this.ctx.measureText(this.text);

		let isMobile;
		if(navigator.userAgentData) {
			isMobile = navigator.userAgentData.mobile;
		} else {
			isMobile = /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent);
		}

		const x = (this.mainX - width / 2) * this.dpr;
		const y = isMobile 
					? (this.mainY - this.fontSize / 2 - fontBoundingBoxAscent) * this.dpr
					: (this.mainY - this.fontSize / 2 - fontBoundingBoxDescent - fontBoundingBoxAscent) * this.dpr;
		const imgWidth = width * this.dpr;
		const imgHeight = isMobile
							? (this.fontSize + fontBoundingBoxDescent) * this.dpr
							: (this.fontSize + fontBoundingBoxAscent + fontBoundingBoxDescent) * this.dpr;

		if (width) {
			this.textPixelData = this.ctx.getImageData(x, y, imgWidth, imgHeight);
			this.textPixelData.fontBoundingBoxAscent = fontBoundingBoxAscent;
			this.textPixelData.fontBoundingBoxDescent = fontBoundingBoxDescent;
		}
	}
}

export default TextData;
