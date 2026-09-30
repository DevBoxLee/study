#!/usr/bin/env python3
from pathlib import Path
import re, shutil

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'src'/'index.html'
EXPECTED=[
'overview','tax','pension','irp','isa','compare','compound','bridge','purpose',
'priority','couple','portfolio','mistakes','early','withdraw','faq','summary','onepage','sources'
]

def validate(text:str):
    ids=re.findall(r'<section[^>]*id="([^"]+)"',text)
    if ids != EXPECTED:
        raise ValueError(f'Expected 19 canonical sections, got {ids}')
    forbidden=['00. 우리집 투자원칙','01. 투자 가능한 돈 찾기','02. 투자기간과 목표',
               '03. 위험과 수익','04. 자산배분','05. ETF를 이름이 아니라 구조로 읽기',
               '07. 우리집 투자 운영규칙','99. 필요할 때 공부']
    found=[x for x in forbidden if x in text]
    if found:
        raise ValueError(f'Obsolete curriculum remains: {found}')
    if text.count('class="quiz"') != 16:
        raise ValueError('Expected 16 O/X quizzes')
    if text.count('<details><summary>') != 33:
        raise ValueError('Expected 33 FAQ entries')
    required=[
        '과세표준 5,000','11년차 이후','삼성증권','138.6만원',
        'ISA 일반형 단순 세후','1,650만원','총 550만원',
        '전환금액의 10%, 최대 300만원','만기일로부터 60일 이내'
    ]
    missing=[x for x in required if x not in text]
    if missing:
        raise ValueError(f'Missing canonical analysis: {missing}')

def build():
    text=SOURCE.read_text(encoding='utf-8')
    validate(text)
    dist=ROOT/'dist'
    if dist.exists(): shutil.rmtree(dist)
    dist.mkdir()
    (dist/'index.html').write_text(text,encoding='utf-8')
    (dist/'404.html').write_text(text,encoding='utf-8')
    (dist/'.nojekyll').write_text('')
    print(f'Built canonical 19-section guide ({len(text.encode()):,} bytes)')

if __name__=='__main__':
    build()
