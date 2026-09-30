import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HUB = (ROOT/'src'/'chart'/'index.html').read_text(encoding='utf-8')
CANDLE = (ROOT/'src'/'chart'/'beginner'/'candlestick.html').read_text(encoding='utf-8')
JS = (ROOT/'src'/'chart'/'assets'/'candlestick.js').read_text(encoding='utf-8')
CSS = (ROOT/'src'/'chart'/'assets'/'chart.css').read_text(encoding='utf-8')

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

    def test_chart_module_is_responsive(self):
        self.assertIn('@media(max-width:760px)', CSS)
        self.assertIn('.anatomy', CSS)
        self.assertIn('.market-chart', CSS)

if __name__ == '__main__':
    unittest.main()
