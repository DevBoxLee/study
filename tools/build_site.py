#!/usr/bin/env python3
from pathlib import Path
import re, shutil

ROOT=Path(__file__).resolve().parents[1]
SOURCE_DIR=ROOT/'src'
SOURCE=SOURCE_DIR/'index.html'
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
    shutil.copytree(SOURCE_DIR, dist)
    (dist/'404.html').write_text(text,encoding='utf-8')
    (dist/'.nojekyll').write_text('')
    required_paths=[
        dist/'chart'/'index.html',
        dist/'chart'/'beginner'/'candlestick.html',
        dist/'chart'/'beginner'/'volume.html',
        dist/'chart'/'beginner'/'trend-structure.html',
        dist/'chart'/'beginner'/'support-resistance.html',
        dist/'chart'/'beginner'/'moving-average.html',
        dist/'chart'/'beginner'/'beginner-practice.html',
        dist/'chart'/'intermediate'/'market-structure.html',
        dist/'chart'/'intermediate'/'breakout.html',
        dist/'chart'/'intermediate'/'pullback.html',
        dist/'chart'/'intermediate'/'volume-confirmation.html',
        dist/'chart'/'intermediate'/'patterns-indicators.html',
        dist/'chart'/'intermediate'/'scaling-exits.html',
        dist/'chart'/'advanced'/'multi-timeframe.html',
        dist/'chart'/'advanced'/'failed-signals.html',
        dist/'chart'/'advanced'/'volatility-atr.html',
        dist/'chart'/'advanced'/'risk-reward-stop.html',
        dist/'chart'/'advanced'/'position-sizing.html',
        dist/'chart'/'advanced'/'swing-review.html',
        dist/'chart'/'assets'/'chart.css',
        dist/'chart'/'assets'/'candlestick.js',
        dist/'chart'/'assets'/'foundations.js',
        dist/'chart'/'assets'/'beginner-lab.js',
        dist/'chart'/'assets'/'level-lab.js',
    ]
    missing=[str(p.relative_to(dist)) for p in required_paths if not p.exists()]
    if missing:
        raise ValueError(f'Missing chart learning assets: {missing}')
    print(f'Built finance guide + chart learning module ({len(text.encode()):,} index bytes)')

if __name__=='__main__':
    build()
