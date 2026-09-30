import sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'tools'))
from build_site import render_lesson,load_lessons

class BuildTest(unittest.TestCase):
    def test_flexible_widgets_render(self):
        self.assertIn('data-widget="money-story"',render_lesson('## 사례\\n\\n:::money-story'))
        self.assertIn('data-widget="account-quiz"',render_lesson(':::account-quiz'))
        self.assertIn('data-widget="isa-bridge"',render_lesson(':::isa-bridge'))
    def test_unknown_widget_is_rejected(self):
        with self.assertRaises(ValueError):
            render_lesson(':::unknown')
    def test_lessons_have_experience(self):
        lessons=load_lessons()
        self.assertEqual(len(lessons),14)
        self.assertEqual(len({x['id'] for x in lessons}),14)
        self.assertTrue(all(x.get('experience') for x in lessons))
        self.assertEqual(next(x for x in lessons if x['id']=='01-money')['experience'],'scenario')
        self.assertEqual(next(x for x in lessons if x['id']=='06-isa')['parent'],'06-accounts')
        self.assertEqual(next(x for x in lessons if x['id']=='06-faq')['parent'],'06-accounts')
    def test_fixed_ten_heading_pattern_removed(self):
        html=render_lesson('## 사례부터 보기\\n\\n본문입니다.\\n\\n:::risk-lab')
        self.assertIn('사례부터 보기',html)
        self.assertIn('data-widget="risk-lab"',html)

if __name__=='__main__':
    unittest.main()
