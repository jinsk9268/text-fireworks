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
	MAX_DPR: 3,
	SMALL_WIDTH: 480,
	MAX_WIDTH_RATIO: 0.9,
	BG_RGB: "0, 0, 0",
	ALPHA_BASE: 0.1,
	ALPHA_OFFSET: 0.05,
	SPEED_CONTROL: 10,
	ALPHA_CLEANUP: 0.3,
};

export const POS = {
	MAIN_X_DIVISOR: 2,
	MAIN_Y_RATIO: 0.1,
};

export const FONT = {
	MAIN_RATIO_GENERAL: 0.09,
	MAIN_RATIO_SMALL: 0.2,
	SUB_RATIO: 0.85,
	FAMILY: "Do Hyeon",
	TEXT_ALIGN: "center",
	TEXT_BASELINE: "middle",
	TEXT_COLOR: "black",
	ADJUST_RATIO: 0.95,
	MIN_SIZE_RATIO: 0.4,
};

export const PARTICLE = {
	TYPE_TAIL: "tail",
	TYPE_SPARK: "spark",
	TYPE_TEXT: "text",
	TYPE_CIRCLE: "circle",
	TAIL_POOL: 5,
	SPARK_POOL: 1000,
	TEXT_POOL: 5000,
	CIRCLE_POOL: 1000,
	RGB: "255, 255, 210",
	HUE: 20,
	MIN_SATURATION: 50,
	MAX_SATURATION: 100,
	MIN_LIGHTNESS: 50,
	MAX_LIGHTNESS: 100,
	MIN_OPACITY: 0.9,
	MAX_OPACITY: 1,
	RADIUS: 1,
	RADIUS_ADJUST_RATIO: 0.8,
	FRICTION: 0.93,
	DEGREE_TO_RADIAN: Math.PI / 180,
};

export const TAIL = {
	BASE_QTY: 5,
	SMALL_EXCLUSION: 75,
	EXCLUSION: 150,
	START_X_RATIO: 0.1,
	MIN_Y_RATIO: 0.7,
	MAX_Y_RATIO: 0.3,
	OPACITY_LIMIT: 0.05,
	DEFAULT_RGB: "255, 255, 200",
	RADIAN: 0,
	RADIAN_OFFSET: 1,
	X_ADJUST_RATE: 0.4,
	INITIAL_X_RETURN_RATE: 0.1,
};

export const TEXT = {
	GRAVITY: 0.02,
	OPACITY_OFFSET: 0.01,
	SMALL_FREQUENCY: 3,
	GENERAL_FREQUENCY: 2,
	MIN_HUE: 50,
	MAX_HUE: 60,
};

const PER_QTY = 60;
const PER_ANGLE = 360 / PER_QTY;
export const CIRCLE = {
	LAYERS: 7,
	PER_QTY,
	PER_ANGLE,
	PER_HALF_ANGLE: PER_ANGLE / 2,
	BASE_TEXT_OFFSET: 10,
	RADII: [0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1],
	OPACITY_BASE: 0.5,
	OPACITY_OFFSET: 0.085,
	HUES: [280, 240, 200, 120, 60, 30, 0],
	SATURATION: 60,
	LIGHTNESS: 60,
	FRICTION: 0.94,
	GRAVITY: 0.017,
	SHADOW_BLUR: 10,
	RADIUS_ADJUST_OFFSET: 0.015,
	OPACITY_ADJUST_OFFSET: 0.009,
	RADIUS_ADJUST_RATE: 0.99,
};

export const SPARK = {
	OPACITY_ADJUST_RATE: 0.016,
	RADIUS_ADJUST_RATE: 0.99,
	TAIL_CREATION_RATE: 0.4,
	TAIL_MIN_VX: -0.1,
	TAIL_MAX_VX: 0.1,
	TAIL_MIN_VY: -0.1,
	TAIL_MAX_VY: 0.05,
	TAIL_MIN_OPACITY: 0.3,
	TAIL_MAX_OPACITY: 0.5,
	CIRCLE_CREATION_RATE: 0.025,
	CIRCLE_MIN_VX: -0.08,
	CIRCLE_MAX_VX: 0.08,
	CIRCLE_VY: 0.1,
	CIRCLE_OPACITY_OFFSET: 0.1,
};
