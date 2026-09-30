# v2 학습경험 설계

모든 챕터를 같은 10개 섹션에 끼워 넣지 않는다. 각 주제의 이해에 가장 적합한 표현방식을 선택한다.

- 00 roadmap
- 01 scenario
- 02 timeline
- 03 lab
- 04 lab
- 05 anatomy
- 06 decision
- 07 dashboard

공통 요소는 제목·핵심 질문·마지막 결정·공식출처만 유지한다.

## 현재 콘텐츠 블록

roadmap, money-story, horizon-timeline, compound, risk-lab, allocation-lab, etf-anatomy, account-map, account-quiz, policy-dashboard.

## 향후 시장차트 확장

- market-chart: 가격·거래량 기본 차트
- candlestick: OHLC 캔들 구조와 몸통/꼬리
- candle-sequence: 여러 캔들의 연속 변화
- pattern-study: 추세·지지/저항·패턴을 주석과 함께 설명
- indicator-overlay: 이동평균 등 보조지표 원리
- pattern-quiz: 이름 암기보다 관찰 포인트 확인

원칙:
1. 차트는 과거 가격을 설명하는 학습도구로 표시한다.
2. 특정 패턴을 미래 수익 보장 신호로 표현하지 않는다.
3. 장기투자 운영규칙과 단기 차트학습을 분리한다.
4. 실제 가격데이터를 쓰면 출처·시간대·조정주가 여부를 기록한다.
5. 모바일에서도 캔들과 주석을 읽을 수 있게 SVG/Canvas 계층을 분리한다.

향후 차트 렌더러는 assets/market-charts.js로 독립 분리할 수 있도록 유지한다.
