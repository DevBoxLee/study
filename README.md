# 우리집 금융공부 & 투자설계

부부가 같은 교육용 사례로 금융 개념을 배우고 투자 운영규칙까지 만드는 정적 학습 사이트입니다.

**사이트:** https://devboxlee.github.io/study/

## v2 학습방식

모든 챕터를 같은 템플릿에 끼워 넣지 않습니다. 주제에 가장 잘 맞는 학습경험을 선택합니다.

- 00: 로드맵
- 01: A/B 사고 시나리오
- 02: 시간축 + 복리 시뮬레이션
- 03: 손실 체험
- 04: 자산배분 실험
- 05: ETF 해부·비교
- 06: 절세계좌 카드·세금흐름·퀴즈
- 07: 투자 운영 대시보드

공통 사례는 금융자산 1억원, 비상금 1,500만원, 목적자금 2,500만원, 장기자금 6,000만원, 월 150만원, 기간 20~30년입니다. 실제 평균 가구나 개인 재무자료가 아닙니다.

## 내용 추가

1. content/_template.md를 참고해 고유 id, 제목, 분류, experience, 확인일을 작성합니다.
2. experience는 페이지의 학습방식입니다. 동일한 10개 섹션은 더 이상 강제하지 않습니다.
3. 새 주제는 투자 의사결정·세금·비용·위험·계좌 선택에 영향을 주는지 먼저 판단합니다.
4. 세법·제도는 현행법과 정부안을 분리하고 공식자료 링크와 확인일을 남깁니다.
5. 시각·계산 블록은 :::money-story, :::compound, :::risk-lab, :::account-map처럼 등록된 블록을 조합합니다.
6. PR 검증 후 main에 병합하면 GitHub Pages가 자동 배포됩니다.

## 향후 확장

주식 차트·캔들·거래량·추세·차트패턴은 별도 학습 모듈로 추가할 예정입니다. docs/v2-learning-experience.md에 확장 원칙을 기록했습니다. 실제 시장데이터를 사용할 경우 출처·시간대·조정주가 여부를 명시합니다.

## 로컬 실행

```bash
python tools/build_site.py
python -m http.server 8000 --directory dist
node tests/math.test.cjs
python -m unittest discover -s tests -p 'test_*.py'
```

화면 검증은 Playwright를 사용합니다.

```bash
npm install --no-save playwright@1.56.1
npx playwright install --with-deps chromium
node tests/browser.cjs
```

## 저장소 구조

- content: 원본 Markdown
- tools: Python 빌더
- src/shell.html: 공통 페이지 셸
- assets/widgets.js: 학습 인터랙션
- assets/style.css: 디자인 시스템
- tests: 계산·빌드·브라우저 검사
- docs/fact-check.md: 공식자료 검증 기록
- docs/v2-learning-experience.md: v2 UX 및 향후 차트 확장 설계
- .github/workflows/pages.yml: 자동 검증·배포

dist는 자동 생성되며 커밋하지 않습니다. 실제 소득·계좌번호·개인 잔액 등 민감한 재무정보는 공개 저장소에 기록하지 않습니다.