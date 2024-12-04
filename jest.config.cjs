module.exports = {
	transform: {
		"^.+\\.js$": "babel-jest", // .js 파일만 변환
	},
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1", // @ 경로 별칭 처리
	},
	testMatch: ["**/__test__/**/*.test.js"], // __tests__ 폴더에서 .test.js 파일 매칭
	testEnvironment: "jsdom", // DOM API 테스트를 위한 환경 설정
};
