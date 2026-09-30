import sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'tools'))
from build_site import render_lesson,load_lessons

class BuildTest(unittest.TestCase):
    def test_tax_guide_widgets_render(self):
        self.assertIn('data-widget="account-map"',render_lesson(':::account-map'))
        self.assertIn('data-widget="pension"',render_lesson(':::pension'))
        self.assertIn('data-widget="tax-compound-compare"',render_lesson(':::tax-compound-compare'))
        self.assertIn('data-widget="account-quiz"',render_lesson(':::account-quiz'))
    def test_unknown_widget_is_rejected(self):
        with self.assertRaises(ValueError):
            render_lesson(':::unknown')
    def test_exact_19_sections(self):
        lessons=load_lessons()
        self.assertEqual(len(lessons),19)
        self.assertEqual([x['id'] for x in lessons],[f'{i:02d}-'+[
            'overview','tax','pension','irp','isa','compare','compound','bridge','purpose',
            'priority','couple','portfolio','mistakes','early','withdraw','faq','summary','onepage','sources'
        ][i-1] for i in range(1,20)])
        self.assertTrue(all(x['phase']=='절세계좌' for x in lessons))
        self.assertTrue(all(not x.get('parent') for x in lessons))
    def test_removed_curriculum_is_not_loaded(self):
        ids={x['id'] for x in load_lessons()}
        for old in ['00-principles','01-money','02-horizon','03-risk','04-allocation','05-etf','06-accounts','07-policy','99-later']:
            self.assertNotIn(old,ids)

if __name__=='__main__':
    unittest.main()
