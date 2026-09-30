# 이 저장소 작업 원칙

- 목표: 부부의 필수 금융학습을 실제 투자 운영규칙으로 연결한다. 백과사전식 범위 확장을 피한다.
- 새 주제는 투자 의사결정/세금·비용·위험/계좌·자산배분/지금 필요한가 기준으로 선별한다.
- 현재 교육용 공통 사례는 docs/design.md 기준. 실제 개인 자산·소득·계좌번호를 커밋하지 않는다.
- 계좌별 한도는 기본적으로 1인 기준. 초기금과 월 적립을 중복집계하지 않는다.
- 정부안/발의안/현행법을 명시적으로 구분한다. 국세청·법령·감독기관·거래소·공식 금융회사·운용사의 원문과 확인일을 기록한다.
- 기본 제품은 HTML/CSS/JS + Python stdlib 빌더. 불필요한 프레임워크·DB·외부 CDN 의존성을 추가하지 않는다.
- content Markdown을 편집한다. dist는 자동 생성되며 커밋하지 않는다.
- 검증: node tests/math.test.cjs, python -m unittest discover -s tests -p 'test_*.py', python tools/build_site.py. 계산 변경은 명확한 기대값을 먼저 검증한다.
- 화면 변경은 tests/browser.cjs와 데스크톱·모바일 screenshot으로 검증한다. /study/ 경로, 내비게이션, 빈 검색, 계산 입력범위를 확인한다.
- feature 브랜치→PR→검증→main 병합→Pages 배포. 사용자가 전체 구현·병합·게시 권한을 위임한 이 프로젝트에서는 routine 승인 질문을 반복하지 않는다.
