# 연금저축 · IRP · ISA 절세계좌 교과서

첨부 `index.html`을 기준 문서(source of truth)로 삼아, 연금저축·IRP·ISA 내용을 **19개 섹션**으로 그대로 재구성한 GitHub Pages 사이트입니다.

**사이트:** https://devboxlee.github.io/study/

## 현재 구조

기존의 00 투자원칙, 투자 가능한 돈, 투자기간, 위험과 수익, 자산배분, ETF 기초, 투자 운영규칙, 99 후순위 공부 메뉴는 제거했습니다.

사이트 메뉴는 첨부 `index.html`의 다음 19개 섹션만 사용합니다.

1. 3대 절세계좌 한눈에 보기
2. 세금 기초
3. 연금저축 완전정복
4. IRP 완전정복
5. ISA 완전정복
6. 연금저축 · IRP · ISA 완전 비교
7. 일반계좌까지 포함한 장기 시뮬레이션 · 복리와 과세이연
8. ISA → 연금저축/IRP 절세 파이프라인
9. 어떤 돈을 어디에 넣을까? — 사용시점 타임라인
10. 가입 우선순위
11. 맞벌이 부부 절세 전략
12. 세제계좌를 만든 뒤 실제 ETF 운용
13. 자주 하는 실수 — O/X 퀴즈
14. 중도해지 시나리오
15. 연금수령 전략
16. FAQ 33개
17. 마지막 5분 요약
18. 한 장 정리
19. Fact Check · 공식 출처

## 원본 충실도 원칙

- 원본의 숫자 예제, 비교표, FAQ, O/X 설명, 수령 시나리오를 생략하지 않습니다.
- 원본의 인터랙티브 영역은 현재 사이트 위젯으로 다시 구현합니다.
- `[S1]~[S15]` 참조코드는 19번 Fact Check에서 공식 출처와 연결합니다.
- 정부안·개정안·시행 예정 내용은 현행 제도와 구분합니다.
- 내용 변경 시 먼저 첨부 기준문서와 비교한 뒤 수정합니다.

## 저장소 구조

- `content/01-overview.md ... content/19-sources.md`: 19개 섹션
- `tools/build_site.py`: 정적 사이트 빌더
- `src/shell.html`: 공통 페이지 셸
- `assets/widgets.js`: 세액공제·ISA·IRP·과세이연·퀴즈 인터랙션
- `assets/style.css`: 디자인 시스템
- `tests`: 섹션 수, 삭제된 구 메뉴, 계산, 브라우저·모바일 검증
- `.github/workflows/pages.yml`: GitHub Pages 자동 검증·배포

## 로컬 실행

```bash
python tools/build_site.py
python -m http.server 8000 --directory dist
python -m unittest discover -s tests -p 'test_*.py'
node tests/math.test.cjs
node tests/navigation.test.cjs
```

브라우저 검증:

```bash
npm install --no-save playwright@1.56.1
npx playwright install --with-deps chromium
node tests/browser.cjs
```
