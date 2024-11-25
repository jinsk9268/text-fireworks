const FIREWORKS = "fireworks";
export const LOCATION_HASH = {
	HOME: "home",
	FIREWORKS,
	FIREWORKS_HASH: `#${FIREWORKS}`,
};

export const ANIMATION = {
	FPS: 60,
	TAIL_FPS: 60,
};

export const SCREEN = {
	MAX_DPR: 3,
	SMALL_WIDTH: 480,
	MAX_WIDTH_RATIO: 0.9,
	BG_RGBA: "rgba(0, 0, 0, 0.2)",
};

export const POS = {
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
	MIN_SIZE_RATIO: 0.7,
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
};

export const TAIL = {
	BASE_QTY: 5,
	SMALL_EXCLUSION: 75,
	EXCLUSION: 150,
	START_X_RATIO: 0.1,
	MIN_Y_RATIO: 0.7,
	MAX_Y_RATIO: 0.3,
	OPACITY_LIMIT: 0.05,
	DEFAULT_RGB: "255, 255, 210",
	RADIAN: 0,
	RADIAN_OFFSET: 1,
	X_ADJUST_RATE: 0.8,
};
