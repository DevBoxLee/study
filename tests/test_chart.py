import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HUB = (ROOT/'src'/'chart'/'index.html').read_text(encoding='utf-8')
CANDLE = (ROOT/'src'/'chart'/'beginner'/'candlestick.html').read_text(encoding='utf-8')
JS = (ROOT/'src'/'chart'/'assets'/'candlestick.js').read_text(encoding='utf-8')
CSS = (ROOT/'src'/'chart'/'assets'/'chart.css').read_text(encoding='utf-8')
FOUNDATIONS = (ROOT/'src'/'chart'/'assets'/'foundations.js').read_text(encoding='utf-8')
VOLUME = (ROOT/'src'/'chart'/'beginner'/'volume.html').read_text(encoding='utf-8')
TREND = (ROOT/'src'/'chart'/'beginner'/'trend-structure.html').read_text(encoding='utf-8')
SUPPORT = (ROOT/'src'/'chart'/'beginner'/'support-resistance.html').read_text(encoding='utf-8')
MA = (ROOT/'src'/'chart'/'beginner'/'moving-average.html').read_text(encoding='utf-8')
PRACTICE = (ROOT/'src'/'chart'/'beginner'/'beginner-practice.html').read_text(encoding='utf-8')
BEGINNER_LAB = (ROOT/'src'/'chart'/'assets'/'beginner-lab.js').read_text(encoding='utf-8')
LEVEL_LAB = (ROOT/'src'/'chart'/'assets'/'level-lab.js').read_text(encoding='utf-8')
INTERMEDIATE = {
    p.name: p.read_text(encoding='utf-8')
    for p in sorted((ROOT/'src'/'chart'/'intermediate').glob('*.html'))
}
ADVANCED = {
    p.name: p.read_text(encoding='utf-8')
    for p in sorted((ROOT/'src'/'chart'/'advanced').glob('*.html'))
}

class ChartLearningTest(unittest.TestCase):
    def test_hub_has_three_learning_levels_and_lab(self):
        for needle in ['01 · BEGINNER','02 · INTERMEDIATE','03 · ADVANCED','04 · LAB','캔들 이해']:
            self.assertIn(needle, HUB)

    def test_candlestick_lesson_covers_essential_concepts(self):
        for needle in ['시가','고가','저가','종가','OHLC','장중 순서','거래량','지지','분할매수']:
            self.assertIn(needle, CANDLE)
        self.assertGreaterEqual(CANDLE.count('class="quiz"'), 3)

    def test_interactive_chart_has_offline_fallback(self):
        self.assertIn('lightweight-charts@5.2.1', CANDLE)
        self.assertIn('initLearningChart', JS)
        self.assertIn('fallback', JS)
        self.assertIn('marketChart', JS)

    def test_foundation_lessons_cover_decision_sequence(self):
        for needle in ['최근 평균','가격 ↑ · 거래량 ↑','거래량만으로 매매 금지']:
            self.assertIn(needle, VOLUME)
        for needle in ['HH','HL','LH','LL','시간축']:
            self.assertIn(needle, TREND)
        for needle in ['선보다 구간','재테스트','역할 전환','가짜 돌파']:
            self.assertIn(needle, SUPPORT)
        for needle in ['drawVolume','drawTrend','drawSR']:
            self.assertIn(needle, FOUNDATIONS)
        for needle in ['후행지표','SMA 20','골든크로스','횡보장']:
            self.assertIn(needle, MA)
        for needle in ['미래를 가린','무효화 기준','분할매수','초급 최종']:
            self.assertIn(needle, PRACTICE)
        for needle in ['drawMA','drawLab','미래 구간','labScenarios']:
            self.assertIn(needle, BEGINNER_LAB)
        combined = HUB + CANDLE + VOLUME + TREND + SUPPORT + MA + PRACTICE
        for forbidden in ['와이프','남편','아내']:
            self.assertNotIn(forbidden, combined)

    def test_intermediate_curriculum_is_complete(self):
        self.assertEqual(len(INTERMEDIATE), 6)
        combined = '\n'.join(INTERMEDIATE.values())
        for needle in ['시장구조와 추세전환','돌파와 이탈','눌림목과 되돌림','거래량 검증','패턴 · RSI · MACD','분할매수 · 분할매도']:
            self.assertIn(needle, combined)
        for needle in ['구조 변화 후보','가짜 돌파','구조 실패','다이버전스','물타기']:
            self.assertIn(needle, combined)

    def test_advanced_curriculum_is_complete(self):
        self.assertEqual(len(ADVANCED), 6)
        combined = '\n'.join(ADVANCED.values())
        for needle in ['멀티 타임프레임','실패 신호','변동성 · ATR','손절 · Risk/Reward','포지션 사이징','스윙 · 매매 복기']:
            self.assertIn(needle, combined)
        for needle in ['시간축 쇼핑','Bull/Bear Trap','ATR 기반 손절','기대값','1회 위험예산','과정 점수']:
            self.assertIn(needle, combined)
        for needle in ['initScenario','initAtr','initRR','initPosition','initMTF','initReview']:
            self.assertIn(needle, LEVEL_LAB)

    def test_all_chart_copy_uses_neutral_learner_language(self):
        combined = HUB + CANDLE + VOLUME + TREND + SUPPORT + MA + PRACTICE + '\n'.join(INTERMEDIATE.values()) + '\n'.join(ADVANCED.values())
        for forbidden in ['와이프','남편','아내']:
            self.assertNotIn(forbidden, combined)

    def test_chart_module_is_responsive(self):
        self.assertIn('@media(max-width:760px)', CSS)
        self.assertIn('.anatomy', CSS)
        self.assertIn('.market-chart', CSS)

if __name__ == '__main__':
    unittest.main()
