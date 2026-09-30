import sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'tools'))
try:
    from build_site import render_lesson,load_lessons
except ImportError:
    render_lesson=load_lessons=None
class BuildTest(unittest.TestCase):
    def test_widgets_become_renderable_containers(self):
        self.assertTrue(callable(render_lesson))
        self.assertIn('data-widget="compound"',render_lesson('## 시각자료\n\n:::compound'))
    def test_unknown_widget_is_rejected(self):
        self.assertTrue(callable(render_lesson))
        with self.assertRaises(ValueError):render_lesson(':::unknown')
    def test_nested_lessons_loaded_with_unique_ids(self):
        self.assertTrue(callable(load_lessons))
        lessons=load_lessons()
        self.assertEqual(len(lessons),13)
        self.assertEqual(len({x['id'] for x in lessons}),13)
        self.assertEqual(next(x for x in lessons if x['id']=='06-isa')['parent'],'06-accounts')
if __name__=='__main__':unittest.main()
