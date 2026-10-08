# -*- coding: utf-8 -*-
import sys, re, json

# 1. Parse existing JFT and N3 verbs from src/data/preloadedVerbs.ts
with open('src/data/preloadedVerbs.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(
    r'\{\s*id:\s*\"([^\"]+)\",\s*sinhalaMeaning:\s*\"([^\"]+)\"(?:,\s*englishMeaning:\s*\"([^\"]*)\")?,\s*kanji:\s*\"([^\"]+)\",\s*furigana:\s*\"([^\"]+)\",\s*kanjiStem:\s*\"([^\"]*)\",\s*okurigana:\s*\"([^\"]*)\",\s*masu:\s*\"([^\"]+)\",\s*dictionary:\s*\"([^\"]+)\",\s*nai:\s*\"([^\"]+)\",\s*ta:\s*\"([^\"]+)\",\s*nakatta:\s*\"([^\"]+)\",\s*te:\s*\"([^\"]+)\"(?:,\s*group:\s*\"([^\"]+)\")?(?:,\s*level:\s*\"([^\"]+)\")?(?:,\s*lesson:\s*\"([^\"]*)\")?\s*\}',
    re.DOTALL
)

existing_jft = []
existing_n3 = []

for m in pattern.finditer(text):
    vid, sin, eng, kanji, furi, stem, okuri, masu, dictf, nai, ta, nakatta, te, grp, lvl, les = m.groups()
    v = {
        'id': vid,
        'sinhalaMeaning': sin,
        'englishMeaning': eng or '',
        'kanji': kanji,
        'furigana': furi,
        'kanjiStem': stem or '',
        'okurigana': okuri or '',
        'masu': masu,
        'dictionary': dictf,
        'nai': nai,
        'ta': ta,
        'nakatta': nakatta,
        'te': te,
        'group': grp or 'Group 1',
        'level': lvl or 'JFT',
        'lesson': les or ''
    }
    if lvl == 'N3':
        existing_n3.append(v)
    else:
        existing_jft.append(v)

print(f"Loaded existing JFT: {len(existing_jft)}, N3: {len(existing_n3)}")

# 2. Load 331 verbs from extract_n4_verbs.py
sys.path.insert(0, 'tmp')
import extract_n4_verbs

raw_verbs = extract_n4_verbs.N4_RAW_DATA
print(f"Loaded {len(raw_verbs)} new verbs from extract_n4_verbs.")

# Official JLPT N5 verb dictionary forms:
N5_DICT_SET = {
    # Group 1
    '会う', 'あう', '開く', 'あく', '洗う', 'あらう', '有る', 'ある', '歩く', 'あるく',
    '言う', 'いう', '行く', 'いく', '要る', 'いる', '歌う', 'うたう', '置く', 'おく',
    '押す', 'おす', '泳ぐ', 'およぐ', '終わる', 'おわる', '買う', 'かう', '返す', 'かえす',
    '帰る', 'かえる', '掛かる', 'かかる', '書く', 'かく', '貸す', 'かす', '聞く', 'きく',
    '切る', 'きる', '困る', 'こまる', '咲く', 'さく', '差す', 'さす', '死ぬ', 'しぬ',
    '閉まる', 'しまる', '知る', 'しる', '吸う', 'すう', '住む', 'すむ', '座る', 'すわる',
    '出す', 'だす', '立つ', 'たつ', '頼む', 'たのむ', '違う', 'ちがう', '使う', 'つかう',
    '着く', 'つく', '作る', 'つくる', '飛ぶ', 'とぶ', '止まる', 'とまる', '取る', 'とる',
    '撮る', '鳴く', 'なく', '並ぶ', 'ならぶ', '習う', 'ならう', '成る', 'なる',
    '脱ぐ', 'ぬぐ', '登る', 'のぼる', '飲む', 'のむ', '乗る', 'のる', '入る', 'はいる',
    '履く', 'はく', '始まる', 'はじまる', '走る', 'はしる', '働く', 'はたらく', '話す', 'はなす',
    '張る', '貼る', 'はる', '引く', 'ひく', '弾く', '吹く', 'ふく', '降る', 'ふる',
    '磨く', 'みがく', '待つ', 'まつ', '持つ', 'もつ', '休む', 'やすむ', '呼ぶ', 'よぶ',
    '読む', 'よむ', '分かる', 'わかる', '渡す', 'わたす', '渡る', 'わたる',
    # Group 2
    '開ける', 'あける', '上げる', 'あげる', '浴びる', 'あびる', '居る', 'いる', '入れる', 'いれる',
    '起きる', 'おきる', '降りる', 'おりる', '教える', 'おしえる', '覚える', 'おぼえる', '掛ける', 'かける',
    '借りる', 'かりる', '消える', 'きえる', '着る', 'きる', '答える', 'こたえる', '締める', 'しめる',
    '閉める', 'しめる', '食べる', 'たべる', '疲れる', 'つかれる', '出かける', 'でかける', '出る', 'でる',
    '並べる', 'ならべる', '寝る', 'ねる', '晴れる', 'はれる', '見せる', 'みせる', '見る', 'みる',
    '忘れる', 'わすれる', '勤める', 'つとめる', '始める', 'はじめる',
    # Group 3
    '来る', 'くる', 'する', '買い物する', '散歩する', '仕事をする', '質問する',
    '宿題をする', '掃除をする', '洗濯をする', '電話をする', '旅行する', '練習する', '結婚する'
}

GODAN_A_MAP = {'う': 'わ', 'く': 'か', 'ぐ': 'が', 'す': 'さ', 'つ': 'た', 'ぬ': 'な', 'ぶ': 'ば', 'む': 'ま', 'る': 'ら'}
GODAN_I_MAP = {'う': 'い', 'く': 'き', 'ぐ': 'ぎ', 'す': 'し', 'つ': 'ち', 'ぬ': 'に', 'ぶ': 'び', 'む': 'み', 'る': 'り'}

SPECIAL_HONORIFIC = {
    'いらっしゃる': {'masu': 'いらっしゃいます', 'te': 'いらっしゃって', 'ta': 'いらっしゃった', 'nai': 'いらっしゃらない', 'nakatta': 'いらっしゃらなかった'},
    'おっしゃる': {'masu': 'おっしゃいます', 'te': 'おっしゃって', 'ta': 'おっしゃった', 'nai': 'おっしゃらない', 'nakatta': 'おっしゃらなかった'},
    'くださる': {'masu': 'くださいます', 'te': 'くださって', 'ta': 'くださった', 'nai': 'くださらない', 'nakatta': 'くださらなかった'},
    'なさる': {'masu': 'なさいます', 'te': 'なさって', 'ta': 'なさった', 'nai': 'なさらない', 'nakatta': 'なさらなかった'},
    'ござる': {'masu': 'ございます', 'te': 'ござって', 'ta': 'ござった', 'nai': 'ござらない', 'nakatta': 'ござらなかった'},
}

def conjugate_verb(kanji, furi, grp):
    if kanji in SPECIAL_HONORIFIC or furi in SPECIAL_HONORIFIC:
        spec = SPECIAL_HONORIFIC.get(kanji) or SPECIAL_HONORIFIC.get(furi)
        return {
            'masu': spec['masu'],
            'dictionary': furi,
            'nai': spec['nai'],
            'ta': spec['ta'],
            'nakatta': spec['nakatta'],
            'te': spec['te']
        }
    if grp == 'Group 3':
        if furi in ('くる', '来る') or kanji in ('くる', '来る'):
            return {
                'masu': 'きます',
                'dictionary': furi,
                'nai': 'こない',
                'ta': 'きた',
                'nakatta': 'こなかった',
                'te': 'きて'
            }
        elif furi.endswith('する'):
            stem = furi[:-2]
            return {
                'masu': stem + 'します',
                'dictionary': furi,
                'nai': stem + 'しない',
                'ta': stem + 'した',
                'nakatta': stem + 'しなかった',
                'te': stem + 'して'
            }
        elif furi.endswith('をする'):
            stem = furi[:-3]
            return {
                'masu': stem + 'をします',
                'dictionary': furi,
                'nai': stem + 'をしない',
                'ta': stem + 'をした',
                'nakatta': stem + 'をしなかった',
                'te': stem + 'をして'
            }
    elif grp == 'Group 2':
        stem = furi[:-1]
        return {
            'masu': stem + 'ます',
            'dictionary': furi,
            'nai': stem + 'ない',
            'ta': stem + 'た',
            'nakatta': stem + 'なかった',
            'te': stem + 'て'
        }
    elif grp == 'Group 1':
        last = furi[-1]
        stem = furi[:-1]
        if furi == 'いく' or furi == 'ゆく' or kanji == '行く':
            return {
                'masu': 'いきます',
                'dictionary': furi,
                'nai': 'いかない',
                'ta': 'いった',
                'nakatta': 'いかなかった',
                'te': 'いって'
            }
        i_stem = stem + GODAN_I_MAP[last]
        a_stem = stem + GODAN_A_MAP[last]
        masu = i_stem + 'ます'
        nai = a_stem + 'ない'
        nakatta = a_stem + 'なかった'
        if last == 'く':
            te = stem + 'いて'
            ta = stem + 'いた'
        elif last == 'ぐ':
            te = stem + 'いで'
            ta = stem + 'いだ'
        elif last == 'す':
            te = stem + 'して'
            ta = stem + 'した'
        elif last in ('つ', 'る', 'う'):
            te = stem + 'って'
            ta = stem + 'った'
        elif last in ('ぬ', 'ぶ', 'む'):
            te = stem + 'んで'
            ta = stem + 'んだ'
        else:
            raise ValueError(f'Unknown last char {last} in {furi}')
        return {
            'masu': masu,
            'dictionary': furi,
            'nai': nai,
            'ta': ta,
            'nakatta': nakatta,
            'te': te
        }

HIRAGANA_START = 0x3040
HIRAGANA_END = 0x309F
def is_hiragana(c):
    return HIRAGANA_START <= ord(c) <= HIRAGANA_END

def get_stem_and_okuri(kanji, furigana):
    if kanji.endswith('をする'):
        return kanji[:-3], 'をする'
    if kanji.endswith('する'):
        return kanji[:-2], 'する'
    if kanji.endswith('くる') or kanji.endswith('来る'):
        return kanji[:-1], 'る'
    
    trailing = []
    for c in reversed(kanji):
        if is_hiragana(c):
            trailing.append(c)
        else:
            break
    if trailing and len(trailing) < len(kanji):
        okuri = ''.join(reversed(trailing))
        stem = kanji[:-len(okuri)]
        return stem, okuri
    else:
        if len(kanji) > 1:
            return kanji[:-1], kanji[-1]
        return kanji, furigana[-1]

n5_verbs = []
n4_verbs = []

n5_idx = 1
n4_idx = 1

for item in raw_verbs:
    kanji, furi, sin, eng, grp = item
    
    # Check level
    is_n5 = False
    if (kanji in N5_DICT_SET or furi in N5_DICT_SET):
        if not (kanji == '空く' and furi == 'あく' and 'empty' in eng):
            if not (kanji == '開く' and furi == 'ひらく'):
                is_n5 = True
    
    stem, okuri = get_stem_and_okuri(kanji, furi)
    conj = conjugate_verb(kanji, furi, grp)
    
    if is_n5:
        vid = f"v_n5_{n5_idx}"
        n5_idx += 1
        level = "N5"
        n5_verbs.append({
            'id': vid,
            'sinhalaMeaning': sin,
            'englishMeaning': eng,
            'kanji': kanji,
            'furigana': furi,
            'kanjiStem': stem,
            'okurigana': okuri,
            'masu': conj['masu'],
            'dictionary': conj['dictionary'],
            'nai': conj['nai'],
            'ta': conj['ta'],
            'nakatta': conj['nakatta'],
            'te': conj['te'],
            'group': grp,
            'level': level,
            'lesson': ''
        })
    else:
        vid = f"v_n4_{n4_idx}"
        n4_idx += 1
        level = "N4"
        n4_verbs.append({
            'id': vid,
            'sinhalaMeaning': sin,
            'englishMeaning': eng,
            'kanji': kanji,
            'furigana': furi,
            'kanjiStem': stem,
            'okurigana': okuri,
            'masu': conj['masu'],
            'dictionary': conj['dictionary'],
            'nai': conj['nai'],
            'ta': conj['ta'],
            'nakatta': conj['nakatta'],
            'te': conj['te'],
            'group': grp,
            'level': level,
            'lesson': ''
        })

print(f"Processed N5: {len(n5_verbs)}, N4: {len(n4_verbs)}")
all_verbs = existing_jft + n5_verbs + n4_verbs + existing_n3
print(f"Total Combined Verbs: {len(all_verbs)} (JFT: {len(existing_jft)}, N5: {len(n5_verbs)}, N4: {len(n4_verbs)}, N3: {len(existing_n3)})")

# 3. Write out to src/data/preloadedVerbs.ts
output_path = "src/data/preloadedVerbs.ts"

with open(output_path, "w", encoding="utf-8") as out:
    out.write('export interface JFTVerb {\n')
    out.write('  id: string;\n')
    out.write('  sinhalaMeaning: string;\n')
    out.write('  kanji: string;\n')
    out.write('  furigana: string;\n')
    out.write('  kanjiStem: string;\n')
    out.write('  okurigana: string;\n')
    out.write('  masu: string;\n')
    out.write('  dictionary: string;\n')
    out.write('  nai: string;\n')
    out.write('  ta: string;\n')
    out.write('  nakatta: string;\n')
    out.write('  te: string;\n')
    out.write('  group?: "Group 1" | "Group 2" | "Group 3";\n')
    out.write('  level?: "JFT" | "N5" | "N4" | "N3";\n')
    out.write('  lesson?: string;\n')
    out.write('  englishMeaning?: string;\n')
    out.write('}\n\n')
    out.write('export const PRELOADED_VERBS: JFTVerb[] = [\n')
    
    for i, v in enumerate(all_verbs):
        out.write('  {\n')
        out.write(f'    id: {json.dumps(v["id"])},\n')
        out.write(f'    sinhalaMeaning: {json.dumps(v["sinhalaMeaning"], ensure_ascii=False)},\n')
        if v.get('englishMeaning'):
            out.write(f'    englishMeaning: {json.dumps(v["englishMeaning"], ensure_ascii=False)},\n')
        out.write(f'    kanji: {json.dumps(v["kanji"], ensure_ascii=False)},\n')
        out.write(f'    furigana: {json.dumps(v["furigana"], ensure_ascii=False)},\n')
        out.write(f'    kanjiStem: {json.dumps(v["kanjiStem"], ensure_ascii=False)},\n')
        out.write(f'    okurigana: {json.dumps(v["okurigana"], ensure_ascii=False)},\n')
        out.write(f'    masu: {json.dumps(v["masu"], ensure_ascii=False)},\n')
        out.write(f'    dictionary: {json.dumps(v["dictionary"], ensure_ascii=False)},\n')
        out.write(f'    nai: {json.dumps(v["nai"], ensure_ascii=False)},\n')
        out.write(f'    ta: {json.dumps(v["ta"], ensure_ascii=False)},\n')
        out.write(f'    nakatta: {json.dumps(v["nakatta"], ensure_ascii=False)},\n')
        out.write(f'    te: {json.dumps(v["te"], ensure_ascii=False)},\n')
        out.write(f'    group: {json.dumps(v["group"])},\n')
        out.write(f'    level: {json.dumps(v["level"])}')
        if v.get('lesson'):
            out.write(',\n')
            out.write(f'    lesson: {json.dumps(v["lesson"])}\n')
        else:
            out.write('\n')
        out.write('  }' + (',' if i < len(all_verbs) - 1 else '') + '\n')
    
    out.write('];\n')

print(f"Successfully generated {output_path} with {len(all_verbs)} verbs!")
