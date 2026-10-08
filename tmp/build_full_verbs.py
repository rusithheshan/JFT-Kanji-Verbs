# -*- coding: utf-8 -*-
import sys, re, json
sys.path.insert(0, 'tmp')
import build_n3, build_n3_p2, build_n3_p3, build_n3_p4

# 1. Parse existing 113 verbs from src/data/preloadedVerbs.ts
with open('src/data/preloadedVerbs.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(
    r'\{\s*id:\s*\"([^\"]+)\",\s*sinhalaMeaning:\s*\"([^\"]+)\",\s*kanji:\s*\"([^\"]+)\",\s*furigana:\s*\"([^\"]+)\",\s*kanjiStem:\s*\"([^\"]*)\",\s*okurigana:\s*\"([^\"]*)\",\s*masu:\s*\"([^\"]+)\",\s*dictionary:\s*\"([^\"]+)\",\s*nai:\s*\"([^\"]+)\",\s*ta:\s*\"([^\"]+)\",\s*nakatta:\s*\"([^\"]+)\",\s*te:\s*\"([^\"]+)\"',
    re.DOTALL
)

existing_verbs = []
for m in pattern.finditer(text):
    vid, sin, kanji, furi, stem, okuri, masu, dictf, nai, ta, nakatta, te = m.groups()
    if dictf.endswith('する') or dictf in ['くる', '来る'] or dictf.endswith('くる'):
        grp = 'Group 3'
    elif dictf.endswith('る') and (masu[:-2] == dictf[:-1] or (masu[:-2].endswith(('え', 'け', 'せ', 'て', 'ね', 'へ', 'め', 'れ', 'げ', 'ぜ', 'で', 'べ', 'い', 'き', 'し', 'ち', 'に', 'ひ', 'み', 'り', 'ぎ', 'じ', 'び')) and dictf[:-1] == masu[:-2])):
        grp = 'Group 2'
    else:
        grp = 'Group 1'
    existing_verbs.append({
        'id': vid,
        'sinhalaMeaning': sin,
        'kanji': kanji,
        'furigana': furi,
        'kanjiStem': stem,
        'okurigana': okuri,
        'masu': masu,
        'dictionary': dictf,
        'nai': nai,
        'ta': ta,
        'nakatta': nakatta,
        'te': te,
        'group': grp,
        'level': 'JFT'
    })

print(f"Loaded {len(existing_verbs)} existing JFT verbs.")

# 2. Extract N3 verbs
all_n3 = build_n3.RAW_N3 + build_n3_p2.RAW_N3_PART2 + build_n3_p3.RAW_N3_PART3 + build_n3_p4.RAW_N3_PART4

FALSE_POSITIVES = {
    '無休', '〜号車', '非常（の）', '日常（の）', '〜階', '〜等', '〜点', '〜用', '〜様', 
    '〜制', '〜法', '〜的', '〜化', '〜中', '〜界', '〜費', '〜料', '〜代', '〜賃',
    '下宿', '宿泊', '留学', '神社', 'ご存じです', '押しボタン式', '数式', '入学式', '信号', '飛行場',
    '自動（の）'
}

GODAN_EXCEPTIONS = {'要る', '減る', '限る', '参る', '召し上がる', '走る', '切る', '知る', '帰る', '入る'}

HIRAGANA_START = 0x3040
HIRAGANA_END = 0x309F

def is_hiragana(c):
    return HIRAGANA_START <= ord(c) <= HIRAGANA_END

def get_stem_and_okuri(kanji, furigana):
    if kanji.endswith('する'):
        return kanji[:-2], 'する'
    if kanji.endswith('来る'):
        return kanji[:-2] + '来', 'る'
    
    trailing = []
    for c in reversed(kanji):
        if is_hiragana(c):
            trailing.append(c)
        else:
            break
    if trailing:
        okuri = ''.join(reversed(trailing))
        stem = kanji[:-len(okuri)]
        return stem, okuri
    else:
        if len(kanji) > 1:
            return kanji[:-1], kanji[-1]
        return kanji, furigana[-1]

def conjugate(kanji, furi, group):
    if group == 'Group 3':
        if furi.endswith('する'):
            stem = furi[:-2]
            return {
                'masu': stem + 'します',
                'dictionary': furi,
                'nai': stem + 'しない',
                'ta': stem + 'した',
                'nakatta': stem + 'しなかった',
                'te': stem + 'して'
            }
        elif furi.endswith('くる'):
            stem = furi[:-2]
            return {
                'masu': stem + 'きます',
                'dictionary': furi,
                'nai': stem + 'こない',
                'ta': stem + 'きた',
                'nakatta': stem + 'こなかった',
                'te': stem + 'きて'
            }
    elif group == 'Group 2':
        stem = furi[:-1]
        return {
            'masu': stem + 'ます',
            'dictionary': furi,
            'nai': stem + 'ない',
            'ta': stem + 'た',
            'nakatta': stem + 'なかった',
            'te': stem + 'て'
        }
    else: # Group 1
        root = furi[:-1]
        last = furi[-1]
        if last == 'う':
            return {'masu': root+'います', 'dictionary': furi, 'nai': root+'わない', 'ta': root+'った', 'nakatta': root+'わなかった', 'te': root+'って'}
        elif last == 'く':
            if furi == 'いく' or furi.endswith('ていく'):
                return {'masu': root+'きます', 'dictionary': furi, 'nai': root+'かない', 'ta': root+'った', 'nakatta': root+'かなかった', 'te': root+'って'}
            return {'masu': root+'きます', 'dictionary': furi, 'nai': root+'かない', 'ta': root+'いた', 'nakatta': root+'かなかった', 'te': root+'いて'}
        elif last == 'ぐ':
            return {'masu': root+'ぎます', 'dictionary': furi, 'nai': root+'がない', 'ta': root+'いだ', 'nakatta': root+'がなかった', 'te': root+'いで'}
        elif last == 'す':
            return {'masu': root+'します', 'dictionary': furi, 'nai': root+'さない', 'ta': root+'した', 'nakatta': root+'さなかった', 'te': root+'して'}
        elif last == 'つ':
            return {'masu': root+'ちます', 'dictionary': furi, 'nai': root+'たない', 'ta': root+'った', 'nakatta': root+'たなかった', 'te': root+'って'}
        elif last == 'ぬ':
            return {'masu': root+'にます', 'dictionary': furi, 'nai': root+'なない', 'ta': root+'んだ', 'nakatta': root+'ななかった', 'te': root+'んで'}
        elif last == 'ぶ':
            return {'masu': root+'びます', 'dictionary': furi, 'nai': root+'ばない', 'ta': root+'んだ', 'nakatta': root+'ばなかった', 'te': root+'んで'}
        elif last == 'む':
            return {'masu': root+'みます', 'dictionary': furi, 'nai': root+'まない', 'ta': root+'んだ', 'nakatta': root+'まなかった', 'te': root+'んで'}
        elif last == 'る':
            return {'masu': root+'ります', 'dictionary': furi, 'nai': root+'らない', 'ta': root+'った', 'nakatta': root+'らなかった', 'te': root+'って'}

n3_verbs = []
for item in all_n3:
    idx, kanji, furi, on, kun, sin, eng, lesson = item
    if kanji in FALSE_POSITIVES:
        continue
    
    # Classify Group
    if kanji.endswith('する') or furi.endswith('する'):
        grp = 'Group 3'
    elif kanji == '来る' or kanji.endswith('来る') or furi == 'くる' or furi.endswith('くる'):
        grp = 'Group 3'
    else:
        ends_u = furi.endswith(('う', 'く', 'ぐ', 'す', 'つ', 'ぬ', 'ぶ', 'む', 'る'))
        is_sin_verb = 'නවා' in sin or 'වෙනවා' in sin or 'කරනවා' in sin or 'ගන්නවා' in sin or 'දෙනවා' in sin or 'අරිනවා' in sin or 'වහනවා' in sin
        is_eng_verb = eng.strip().lower().startswith('to ') or 'to ' in eng.lower() or 'verb' in eng.lower()
        if not (ends_u and (is_sin_verb or is_eng_verb)):
            continue
        
        if not furi.endswith('る'):
            grp = 'Group 1'
        else:
            if kanji in GODAN_EXCEPTIONS:
                grp = 'Group 1'
            else:
                char_before = furi[-2] if len(furi) >= 2 else ''
                i_e_sounds = (
                    'い', 'き', 'し', 'ち', 'に', 'ひ', 'み', 'り', 'ぎ', 'じ', 'ぢ', 'び', 'ぴ',
                    'え', 'け', 'せ', 'て', 'ね', 'へ', 'め', 'れ', 'げ', 'ぜ', 'で', 'べ', 'ぺ'
                )
                if char_before in i_e_sounds:
                    grp = 'Group 2'
                else:
                    grp = 'Group 1'
    
    stem, okuri = get_stem_and_okuri(kanji, furi)
    conj = conjugate(kanji, furi, grp)
    n3_verbs.append({
        'id': f"vn3_{idx}",
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
        'level': 'N3',
        'lesson': lesson
    })

print(f"Loaded {len(n3_verbs)} N3 verbs.")

# Total verbs
all_verbs = existing_verbs + n3_verbs
print(f"Total verbs: {len(all_verbs)}")

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
    out.write('  level?: "JFT" | "N3";\n')
    out.write('  lesson?: string;\n')
    out.write('  englishMeaning?: string;\n')
    out.write('}\n\n')
    out.write('export const PRELOADED_VERBS: JFTVerb[] = [\n')
    
    out.write('  // ==================== JFT-BASIC VERBS ====================\n')
    for v in existing_verbs:
        out.write('  {\n')
        out.write(f'    id: {json.dumps(v["id"])},\n')
        out.write(f'    sinhalaMeaning: {json.dumps(v["sinhalaMeaning"], ensure_ascii=False)},\n')
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
        out.write(f'    level: {json.dumps(v["level"])}\n')
        out.write('  },\n')
        
    out.write('\n  // ==================== JLPT N3 VERBS ====================\n')
    for v in n3_verbs:
        out.write('  {\n')
        out.write(f'    id: {json.dumps(v["id"])},\n')
        out.write(f'    sinhalaMeaning: {json.dumps(v["sinhalaMeaning"], ensure_ascii=False)},\n')
        out.write(f'    englishMeaning: {json.dumps(v["englishMeaning"])},\n')
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
        out.write(f'    level: {json.dumps(v["level"])},\n')
        out.write(f'    lesson: {json.dumps(v["lesson"])}\n')
        out.write('  },\n')
        
    out.write('];\n')

print(f"Generated {output_path} with {len(all_verbs)} verbs!")
