# 우리집 금융 공부 — 연금저축 · IRP · ISA 통합가이드

이 저장소는 현재 **연금저축 · IRP · ISA 통합가이드 한 개만** 제공합니다.

사이트: https://devboxlee.github.io/study/

## 현재 구성

첨부된 교과서 index.html을 단일 원본으로 사용하며 다음 19개 섹션을 그대로 제공합니다.

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

이전의 00~05, 07, 99 투자 기초 커리큘럼 및 해당 콘텐츠는 저장소에서 제거했습니다.

## 빌드

```bash
python tools/build_site.py
node tests/math.test.cjs
node tests/navigation.test.cjs
python -m unittest discover -s tests -p 'test_*.py'
```

GitHub Actions는 원본 19개 섹션, O/X 16문항, FAQ 33개, 핵심 숫자 사례와 브라우저/모바일 렌더링을 검증한 뒤 Pages에 배포합니다.
