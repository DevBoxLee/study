# v1 실행계획

사용자가 합의한 docs/design.md를 직접 실행한다.

1. 공식자료: 국세청 연금공제/주식세금, 금융회사 ISA/연금 안내, 자산운용사 ETF 설명, SEC 자산배분 자료를 확인하고 docs/fact-check.md에 확인범위 및 제한을 기록한다.
2. 계산: tests/math.test.cjs에서 월말 적립·제로 및 음수 수익률·회복률·자산배분·ISA 세금·연금공제의 기대값을 먼저 검증(RED), assets/math.js에 구현(GREEN).
3. 콘텐츠: content에 00~07, 99와 계좌 상세 4개 Markdown. 공통 숫자, 공식 출처, 가정/사실/전략 구분을 확인한다. content/_template.md로 이후 추가를 지원한다.
4. 빌더·화면: 기존 renderer 재사용, 메타데이터 검사, index에 전체 콘텐츠 포함. assets/style.css, app.js, 시뮬레이터를 구현한다. 본문 렌더링·검색·hash 이동·학습체크·모바일 메뉴·인쇄 확인.
5. 운영: README, AGENTS, Pages Actions, PR용 검증을 추가한다. dist에 학습파일만 담는다.
6. 완료: 계산/콘텐츠/화면 검사, 최종 코드 리뷰, GitHub API로 원격 feature commit/PR/병합. Pages workflow 상태 및 실제 사이트 확인.

Review focus: 0% 계산, 음수 수익률, 원금 중복집계, 부부별 한도, IRP 70%와 가구 80% 배분의 정합성, ISA 해외직접투자 제한, 정부안 혼동, 모바일 가로넘침, localStorage 사용 불가, /study/ 상대경로.
