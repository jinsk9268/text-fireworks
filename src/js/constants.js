import { setRgbaColor } from "@/js/utils.js";

/** 프로젝트 */
const FIREWORKS = "fireworks";
export const LOCATION_HASH = {
	HOME: "home",
	FIREWORKS,
	FIREWORKS_HASH: `#${FIREWORKS}`,
};

export const ANIMATION = {
	FPS: 60,
	TAIL_FPS: 70,
	TEXT_LEN_MULTIPLIER: 2,
};

export const SCREEN = {
	RESIZE_DELAY: 200,
	MAX_DPR: 3,
	SMALL_WIDTH: 480,
	BG_RGB: "0, 0, 0",
	ALPHA_BASE: 0.1,
	MAX_WIDTH_RATIO: 0.97,
	ALPHA_OFFSET: 0.02,
	SPEED_CONTROL: 10,
	ALPHA_CLEANUP: 0.3,
	IOS: /Mac|iPhone|iPad|iPod/i,
};

export const POS = {
	MAIN_X_DIVISOR: 2,
	MAIN_Y_RATIO: 0.1,
};

export const FONT = {
	// CanvasOption class
	MAIN_RATIO_GENERAL: 0.09,
	MAIN_RATIO_SMALL: 0.15,
	SUB_RATIO: 0.9,
	// TextData class
	FAMILY: "Do Hyeon",
	TEXT_ALIGN: "center",
	TEXT_BASELINE: "middle",
	TEXT_COLOR: "#000000",
	// Canvas class
	ADJUST_RATIO: 0.97,
	MIN_SIZE_RATIO: 0.5,
};

export const PARTICLE = {
	// ParticleManager class
	TYPE_TAIL: "tail",
	TYPE_SPARK: "spark",
	TYPE_TEXT: "text",
	TYPE_CIRCLE: "circle",
	TAIL_POOL: 5,
	SPARK_POOL: 600,
	TEXT_POOL: 2100,
	CIRCLE_POOL: 1000,
	// Particle class
	RGB: "255, 255, 210",
	MIN_OPACITY: 0.9,
	MAX_OPACITY: 1,
	RADIUS: 1,
	RADIUS_ADJUST_RATIO: 0.7,
	FRICTION: 0.93,
	DEGREE_TO_RADIAN: Math.PI / 180,
	HUE: 20,
	MIN_SATURATION: 50,
	MAX_SATURATION: 100,
	MIN_LIGHTNESS: 50,
	MAX_LIGHTNESS: 100,
};

export const TAIL = {
	// canvas
	BASE_QTY: 5,
	SMALL_EXCLUSION: 75,
	EXCLUSION: 150,
	START_X_RATIO: 0.1,
	MIN_Y_RATIO: 0.6,
	MAX_Y_RATIO: 0.25,
	OPACITY_LIMIT: 0.05,
	// class
	RADIAN: 0,
	RADIAN_OFFSET: 1,
	X_ADJUST_RATE: 0.4,
	INITIAL_X_RETURN_RATE: 0.1,
};

export const TEXT = {
	// class
	GRAVITY: 0.01,
	OPACITY_OFFSET: 0.01,
	// canvas
	SMALL_FREQUENCY: 3,
	GENERAL_FREQUENCY: 2,
	MIN_HUE: 50,
	MAX_HUE: 60,
};

const PER_QTY = 60;
const PER_ANGLE = 360 / PER_QTY;
export const CIRCLE = {
	// canvas
	LAYERS: 7,
	PER_QTY,
	PER_ANGLE,
	PER_HALF_ANGLE: PER_ANGLE / 2,
	BASE_TEXT_OFFSET: 10,
	SPEED_DIVISOR: 3,
	RADII: [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
	OPACITY_BASE: 0.5,
	OPACITY_OFFSET: 0.085,
	HUES: [280, 240, 200, 120, 60, 30, 0],
	SATURATION: 60,
	LIGHTNESS: 60,
	// class
	FRICTION: 0.94,
	GRAVITY: 0.015,
	SHADOW_BLUR: 10,
	RADIUS_ADJUST_OFFSET: 0.015,
	OPACITY_ADJUST_OFFSET: 0.009,
	OPACITY_ADJUST_OFFSET_SUB: 0.002,
	RADIUS_ADJUST_RATE: 0.99,
};

export const SPARK = {
	// class
	OPACITY_ADJUST_RATE: 0.016,
	RADIUS_ADJUST_RATE: 0.99,
	// canvas
	TAIL_CREATION_RATE: 0.35,
	TAIL_MIN_VX: -0.1,
	TAIL_MAX_VX: 0.1,
	TAIL_MIN_VY: -0.1,
	TAIL_MAX_VY: 0.05,
	TAIL_MIN_OPACITY: 0.3,
	TAIL_MAX_OPACITY: 0.5,
	CIRCLE_CREATION_RATE: 0.03,
	CIRCLE_MIN_VX: -0.08,
	CIRCLE_MAX_VX: 0.08,
	CIRCLE_VY: 0.1,
	CIRCLE_OPACITY_OFFSET: 0.1,
};

/** 테스트 */
const DEFAULT_PARTICLE_COLOR = setRgbaColor(PARTICLE.RGB, PARTICLE.MIN_OPACITY);
export const TEST_OPTION = {
	TYPE_INNER_WIDTH: "innerWidth",
	TYPE_INNER_HEIGHT: "innerHeight",
	INNER_WIDTH: 1000,
	SMALL_INNER_WIDTH: 400,
	INNER_HEIGHT: 500,
	CANVAS_ELEMENT: '<canvas id="canvas"></canvas>',
	CANVAS_ID: "canvas",
	PARTICLE_DEFAULT_VALUES: {
		x: 0,
		y: 0,
		vx: 0,
		vy: 0,
		radius: PARTICLE.RADIUS,
		opacity: PARTICLE.MIN_OPACITY,
		friction: PARTICLE.FRICTION,
		color: DEFAULT_PARTICLE_COLOR,
	},
};
