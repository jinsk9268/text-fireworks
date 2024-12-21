# 불꽃놀이 프로젝트 (Text Fireworks Project)

## 프로젝트 개요

**Text Fireworks**는 사용자가 입력한 문자열을 불꽃놀이 애니메이션으로 시각화한 프로젝트입니다.
이 프로젝트는 **Canvas API**를 사용해 파티클 기반 애니메이션 효과를 구현하며, **Object Pooling**으로 성능을 최적화 했습니다.

## 기능

-   **불꽃놀이 효과** : 사용자 입력 텍스트를 픽셀 단위로 분석하고, 해당 데이터를 기반으로 애니메이션 생성.
-   **반응형 디자인** : 화면 크기에 따라 애니메이션 렌더링 최적화
-   **객체 재사용** : Object Pooling 기법으로 파티클 생성/소멸 비용 절감.
-   **hash 기반 화면 이동** : window.location.hash를 활용한 간단한 라우팅 적용.

## 프로젝트 구조

```plaintext
text-fireworks/src
├── js/
│   ├── Canvas.js             # Canvas의 다양한 설정을 관리하고 애니메이션을 실행
│   ├── CanvasOption.js       # Canvas 기본 설정 관리 및 초기화
│   ├── constants.js          # 프로젝트 전역 상수
│   ├── particle/             # 파티클 관리와 파티클 클래스 모음 (ParticleManager, CircleParticle 등)
│   └── utils.js              # 공통 유틸리티 함수
├── style/
│   └── styles.css            # 스타일 시트
├── __test__/
│   ├── index.test.js         # 통합 테스트
│   ├── canvas/               # Canvas 관련 클래스 단위 테스트
│   ├── particle/             # Particle 관련 클래스 단위 테스트
│   ├── utils.test.js         # 공통 유틸리티 함수 단위 테스트
│   └── setup.js              # 테스트 환경 설정
├── index.js                  # 프로젝트 진입점
├── index.html                # HTML 진입점
├── package.json              # 프로젝트 메타데이터 및 의존성
├── vite.config.js            # vite 설정 파일
├── js.config.js              # JS 컴파일 옵션 설정
├── babel.config.cjs          # babel 설정 파일
├── jest.config.cjs           # jest 설정 파일
└── README.md                 # 프로젝트 설명 파일
```

---

## 프로젝트 실행

**1. Repository Clone**

```bash
git clone https://github.com/jinsk9268/text-fireworks.git
cd text-fireworks
```

**2. 의존성 설치**

```bash
npm install
```

**3. 개발 모드 실행**

```bash
npm run dev
```

---

## 프로젝트 진행 과정

### 1. Canvas 설정

-   Canvas 초기화 및 애니메이션 로직 설정.

### 2. Text Rendering

-   사용자 입력값을 Canvas에 렌더링 하고, 이를 기반으로 픽셀 데이터를 추출.

### 3. Particle Animation

-   각 파티클(Tail, Text, Circle, Spark)의 속도, 크기, 색상등을 개별적으로 계산해 불꽃효과를 만듦.
-   `requestAnimationFrame`으로 애니메이션 실행

### 4. 성능 최적화

-   Object Pooling으로 반복적인 객체 생성/소멸 비용 절감.

### 5. Hash 기반 화면 전환

-   URL의 hash 값을 통해 화면 상태 관리.

---

## 테스트

이 프로젝트는 **Jest와 @testing-library/dom**을 사용하여 단위 및 통합 테스트를 진행합니다.

### 테스트 실행

-   전체 테스트 실행

```bash
npm test
```

-   파일별 테스트 실행

```bash
npx jest .__test__/테스트 파고싶은 파일
```

### 테스트 범위

-   **Unit test**: Canvas, Particle, TextParticle 등 개별 클래스와 메서드 테스트.
-   **Integration Test**: index.js의 이벤트 리스너, 화면 전환, 애니메이션 흐름 검증.

### 테스트 도구

-   jest
-   @testing-library/dom (사용자 인터렉션 시뮬레이션)

---

## 기술 스택

-   **HTML5 / Javascript / CSS** : 프로젝트 기본 구조와 스타일링
-   **Canvas API** : 2D 그래픽 애니메이션 구현
-   **Vite** : 경량화된 빌드 및 개발 환경 설정
-   **Jest** : 테스트 자동화 도구
-   **@testing-library/dom** : DOM 기반 사용자 이벤트 시뮬레이션

---

## 실행 화면

[![Fireworks 애니메이션 보기](.public/images/fireworks.png)](https://youtu.be/e-9-Fs-1yAs)

---

# 추가 자료

-   [Canvas 불꽃놀이 개발 블로그](https://jinsk-joy.tistory.com/category/%EA%B0%9C%EB%B0%9C/Canvas)
-   [Github Repo](https://github.com/jinsk9268/text-fireworks)
