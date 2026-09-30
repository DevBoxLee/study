#!/usr/bin/env python3
"""Build the tax-account study site from flexible lesson blocks."""
from pathlib import Path
import json,re,shutil
from markdown import markdown_to_html

ROOT=Path(__file__).resolve().parents[1]
WIDGETS={
    'roadmap','money-story','horizon-timeline','compound','risk-lab','allocation-lab',
    'etf-anatomy','account-map','account-quiz','tax-basics','isa-bridge','account-priority',
    'early-withdrawal','pension-withdrawal','tax-compound-compare','policy-dashboard',
    'buckets','drawdown','allocation','etf','accounts','isa','pension','irp',
    'tax-location','policy','filter'
}
REQUIRED_META=['id','title','summary','phase','updated','classification','experience']

def render_lesson(body):
    widgets=[]
    def token(match):
        key=match.group(1)
        if key not in WIDGETS:
            raise ValueError('Unknown widget: '+key)
        widgets.append(key)
        return f'FINANCEWIDGET{len(widgets)-1}TOKEN'
    body=re.sub(r'^:::([a-z-]+)[ \t]*$',token,body,flags=re.M)
    rendered=markdown_to_html(body)
    for i,key in enumerate(widgets):
        rendered=rendered.replace(
            f'<p>FINANCEWIDGET{i}TOKEN</p>',
            f'<div class="widget widget-{key}" data-widget="{key}"></div>'
        )
    idx=iter(range(1,100))
    rendered=re.sub(
        r'<h2>(.*?)</h2>',
        lambda m:f'<h2 id="section-{next(idx)}">{m.group(1)}</h2>',
        rendered
    )
    return rendered

def load_lessons():
    lessons=[]
    for path in sorted((ROOT/'content').rglob('*.md')):
        if path.name.startswith('_') or path.name=='README.md':
            continue
        text=path.read_text(encoding='utf-8').replace('\r\n','\n')
        if not text.startswith('---\n'):
            raise ValueError('Missing metadata: '+str(path))
        metadata,body=text[4:].split('\n---\n',1)
        meta={k.strip():v.strip() for k,v in (
            line.split(':',1) for line in metadata.splitlines() if ':' in line
        )}
        if meta.get('published')=='false':
            continue
        for key in REQUIRED_META:
            if not meta.get(key):
                raise ValueError(f'Missing {key}: {path}')
        if not re.fullmatch('[a-z0-9-]+',meta['id']):
            raise ValueError('Invalid id')
        if not re.fullmatch(r'\d{4}-\d{2}-\d{2}',meta['updated']):
            raise ValueError('Invalid date')
        has_widget=bool(re.search(r'^:::[a-z-]+[ \t]*$',body,flags=re.M))
        if len(body.strip()) < 180 and not has_widget:
            raise ValueError(f'Lesson too short: {path}')
        has_direct_source=bool(re.search(r'https://',body))
        has_shared_source=meta.get('sources')=='19-sources'
        if meta['classification']=='필수' and not has_direct_source and not has_shared_source:
            raise ValueError(f'Missing official source link or shared source page: {path}')
        meta.update(
            body=render_lesson(body),
            search=body,
            source=str(path.relative_to(ROOT))
        )
        lessons.append(meta)

    ids={l['id'] for l in lessons}
    if len(ids)!=len(lessons):
        raise ValueError('Duplicate lesson id')
    for lesson in lessons:
        if lesson.get('parent') and lesson['parent'] not in ids:
            raise ValueError('Missing parent')
        for target in re.findall(r'\]\(#([a-z0-9-]+)\)',lesson['search']):
            if target not in ids:
                raise ValueError('Broken lesson link: '+target)
    return lessons

def build():
    lessons=load_lessons()
    dist=ROOT/'dist'
    if dist.exists():
        shutil.rmtree(dist)
    (dist/'assets').mkdir(parents=True)
    for p in (ROOT/'assets').iterdir():
        if p.is_file():
            shutil.copy2(p,dist/'assets'/p.name)
    data=json.dumps(lessons,ensure_ascii=False).replace('<','\\u003c').replace('>','\\u003e').replace('&','\\u0026')
    template=(ROOT/'src/shell.html').read_text(encoding='utf-8')
    out=template.replace('<!--LESSONS-->',data)
    (dist/'index.html').write_text(out,encoding='utf-8')
    (dist/'.nojekyll').write_text('')
    (dist/'404.html').write_text(out,encoding='utf-8')
    (dist/'notes').mkdir()
    for lesson in lessons:
        shutil.copy2(ROOT/lesson['source'],dist/'notes'/(lesson['id']+'.md'))
    print(f'Built {len(lessons)} lessons → dist/index.html ({len(out.encode()):,} bytes)')

if __name__=='__main__':
    build()
