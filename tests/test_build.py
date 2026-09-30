import sys, unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'tools'))
from build_site import validate, EXPECTED

ROOT=Path(__file__).resolve().parents[1]
TEXT=(ROOT/'src'/'index.html').read_text(encoding='utf-8')

class CanonicalGuideTest(unittest.TestCase):
    def test_all_19_sections_in_exact_order(self):
        validate(TEXT)
        self.assertEqual(len(EXPECTED),19)
    def test_old_curriculum_removed(self):
        for title in ['00. 우리집 투자원칙','01. 투자 가능한 돈 찾기','02. 투자기간과 목표',
                      '03. 위험과 수익','04. 자산배분','05. ETF를 이름이 아니라 구조로 읽기',
                      '07. 우리집 투자 운영규칙','99. 필요할 때 공부']:
            self.assertNotIn(title,TEXT)
    def test_original_learning_depth_is_present(self):
        for needle in ['과세표준 5,000','11년차 이후','삼성증권','138.6만원',
                       '1,891만원','7,249만원','1,650만원','총 550만원',
                       '전환금액의 10%, 최대 300만원']:
            self.assertIn(needle,TEXT)
    def test_quiz_and_faq_counts(self):
        self.assertEqual(TEXT.count('class="quiz"'),16)
        self.assertEqual(TEXT.count('<details><summary>'),33)

if __name__=='__main__':
    unittest.main()
