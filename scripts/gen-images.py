#!/usr/bin/env python3
"""从 Wikimedia Commons 取 62 张图的真实 PNG URL，生成 src/utils/images.js"""
import urllib.request, urllib.parse, json, sys, os

UA = {'User-Agent': 'taro-weapp-demo/1.0 (image url resolver)'}

def api(params):
    url = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=UA)
    return json.load(urllib.request.urlopen(req, timeout=30))

RANKS = ['A'] + [str(i) for i in range(2, 11)] + ['J', 'Q', 'K']
SUIT_ORDER = ['spade', 'heart', 'club', 'diamond']  # 1-13 黑桃, 14-26 红心, 27-39 梅花, 40-52 方块

titles = []
for si, suit in enumerate(SUIT_ORDER):
    for r in RANKS:
        titles.append(('File:Playing card %s %s.svg' % (suit, r), si * 13 + RANKS.index(r) + 1))
titles.append(('File:Playing card black Joker.svg', 53))
titles.append(('File:Playing card red Joker.svg', 54))
for i in range(1, 7):
    titles.append(('File:Dice-%d.svg' % i, i))
titles.append(('File:Rolling-dice-cup - Delapouite - game-icons.svg', 'bg'))
titles.append(('File:Twemoji 1f64c.svg', 'shake'))

# 分批查询（每批 50 个）
puke, dice, extra = {}, {}, {}
batch = titles[:]
while batch:
    chunk, batch = batch[:50], batch[50:]
    d = api({'action': 'query', 'titles': '|'.join(t for t, _ in chunk),
             'prop': 'imageinfo', 'iiprop': 'url', 'iiurlwidth': 360, 'format': 'json'})
    # title -> 归一化映射
    norm = {}
    for n in d['query'].get('normalized', []):
        norm[n['from']] = n['to']
    info = {}
    for p in d['query']['pages'].values():
        if 'missing' in p:
            print('MISSING:', p['title']); continue
        info[p['title']] = p['imageinfo'][0].get('thumburl') or p['imageinfo'][0]['url']
    for t, key in chunk:
        nt = norm.get(t, t)
        u = info.get(nt)
        if not u:
            print('NO-URL:', t); sys.exit(1)
        (puke if isinstance(key, int) and key <= 54 and key not in (1,) or isinstance(key, int) and key <= 54 else extra)
        # 简单分流
        if isinstance(key, int) and 1 <= key <= 54 and t.startswith('File:Playing card'):
            puke[key] = u
        elif isinstance(key, int):
            dice[key] = u
        else:
            extra[key] = u

assert len(puke) == 54, 'puke=%d' % len(puke)
assert len(dice) == 6, 'dice=%d' % len(dice)

# 验证 URL 可达（抽样 + 全量 HEAD）
import concurrent.futures
def head(u):
    req = urllib.request.Request(u, headers=UA, method='HEAD')
    try:
        r = urllib.request.urlopen(req, timeout=20)
        return u, r.status, r.headers.get('Content-Type')
    except Exception as e:
        return u, 'ERR', str(e)

all_urls = list(puke.values()) + list(dice.values()) + list(extra.values())
bad = []
with concurrent.futures.ThreadPoolExecutor(8) as ex:
    for u, st, ct in ex.map(head, all_urls):
        if st != 200: bad.append((u, st, ct))
if bad:
    print('BAD URLS:', bad); sys.exit(1)
print('全部 %d 个 URL 验证 200 OK' % len(all_urls))

# 生成 images.js
def js_map(m):
    return '{\n' + ',\n'.join('  %s: "%s"' % (k, v) for k, v in sorted(m.items(), key=lambda x: (isinstance(x[0], str), x[0]))) + '\n}'

js = """/**
 * 图片资源映射（自动生成，勿手改）
 * 来源：Wikimedia Commons（开源免费媒体库，扑克牌白牌组/骰子为公有领域，game-icons 为 CC-BY 3.0，Twemoji 为 CC-BY 4.0）
 * 生成脚本：scripts/gen-images.py
 * 替代已失效的 http://assets.ytuj.cn 图源
 */

// 扑克牌 1-52：1-13 黑桃 14-26 红心 27-39 梅花 40-52 方块（A,2-10,J,Q,K）；53 小王；54 大王
export const PUKE_IMAGES = %s

// 骰子面 1-6
export const DICE_IMAGES = %s

// 骰盅背景图
export const DICE_BG = "%s"

// 摇一摇图标
export const SHAKE_ICON = "%s"
""" % (js_map(puke), js_map(dice), extra['bg'], extra['shake'])

out = os.path.join(os.path.dirname(__file__), '..', 'src', 'utils', 'images.js')
os.makedirs(os.path.dirname(out), exist_ok=True)
open(out, 'w').write(js)
print('已生成', os.path.normpath(out))
