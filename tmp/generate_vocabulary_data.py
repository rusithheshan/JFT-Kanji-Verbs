# -*- coding: utf-8 -*-
import re, json

KANA_MAP = {
    'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
    'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
    'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
    'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
    'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
    'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
    'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
    'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
    'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo',
    'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
    'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',
    'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
    'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
    'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
    'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
    'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
    'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
    'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
    'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
    'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
    'わ': 'wa', 'を': 'o', 'ん': 'n',
    'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
    'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
    'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'де': 'de', 'ど': 'do',
    'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
    'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
    'ア': 'a', 'イ': 'i', 'ウ': 'u', 'エ': 'e', 'オ': 'o',
    'カ': 'ka', 'キ': 'ki', 'ク': 'ku', 'ケ': 'ke', 'コ': 'ko',
    'サ': 'sa', 'シ': 'shi', 'ス': 'su', 'セ': 'se', 'ソ': 'so',
    'タ': 'ta', 'チ': 'chi', 'ツ': 'tsu', 'テ': 'te', 'ト': 'to',
    'ナ': 'na', 'ニ': 'ni', 'ヌ': 'nu', 'ネ': 'ne', 'ノ': 'no',
    'ハ': 'ha', 'ヒ': 'hi', 'フ': 'fu', 'ヘ': 'he', 'ホ': 'ho',
    'マ': 'ma', 'ミ': 'mi', 'ム': 'mu', 'メ': 'me', 'モ': 'mo',
    'ヤ': 'ya', 'ユ': 'yu', 'ヨ': 'yo',
    'ラ': 'ra', 'リ': 'ri', 'ル': 'ru', 'レ': 're', 'ロ': 'ro',
    'ワ': 'wa', 'ヲ': 'o', 'ン': 'n',
    'ガ': 'ga', 'ギ': 'gi', 'グ': 'gu', 'ゲ': 'ge', 'ゴ': 'go',
    'ザ': 'za', 'ジ': 'ji', 'ズ': 'zu', 'ゼ': 'ze', 'ゾ': 'zo',
    'ダ': 'da', 'ヂ': 'ji', 'ヅ': 'zu', 'デ': 'de', 'ド': 'do',
    'バ': 'ba', 'ビ': 'bi', 'ブ': 'bu', 'ベ': 'be', 'ボ': 'bo',
    'パ': 'pa', 'ピ': 'pi', 'プ': 'pu', 'ペ': 'pe', 'ポ': 'po',
    'キャ': 'kya', 'キュ': 'kyu', 'キョ': 'kyo',
    'シャ': 'sha', 'シュ': 'shu', 'ショ': 'sho',
    'チャ': 'cha', 'チュ': 'chu', 'チョ': 'cho',
    'ニャ': 'nya', 'ニュ': 'nyu', 'ニョ': 'nyo',
    'ヒャ': 'hya', 'ヒュ': 'hyu', 'ヒョ': 'hyo',
    'ミャ': 'mya', 'ミュ': 'myu', 'ミョ': 'myo',
    'リャ': 'rya', 'リュ': 'ryu', 'リョ': 'ryo',
    'ギャ': 'gya', 'ギュ': 'gyu', 'ギョ': 'gyo',
    'ジャ': 'ja', 'ジュ': 'ju', 'ジョ': 'jo',
    'ビャ': 'bya', 'ビュ': 'byu', 'ビョ': 'byo',
    'ピャ': 'pya', 'ピュ': 'pyu', 'ピョ': 'pyo',
    'っ': '', 'ッ': '', 'ー': '', '〜': '~', '、': ', ', '。': '.'
}

def kana_to_romaji(text):
    if not text:
        return ""
    res = []
    i = 0
    t_len = len(text)
    while i < t_len:
        if i + 1 < t_len and text[i:i+2] in KANA_MAP:
            res.append(KANA_MAP[text[i:i+2]])
            i += 2
        elif (text[i] == 'っ' or text[i] == 'ッ') and i + 1 < t_len:
            next_k = text[i+1]
            if next_k in KANA_MAP:
                r = KANA_MAP[next_k]
                res.append(r[0] if r else 't')
            else:
                res.append('t')
            i += 1
        elif text[i] in KANA_MAP:
            res.append(KANA_MAP[text[i]])
            i += 1
        else:
            res.append(text[i])
            i += 1
    return "".join(res)

N5_ITEMS = [
    ["v_n5_1", "学生", "がくせい", "gakusei", "ශිෂ්‍යයා / ඉගෙනුම ලබන්නා", "student", "noun", "N5", 1, "School"],
    ["v_n5_2", "先生", "せんせい", "sensei", "ගුරුවරයා / ආචාර්යවරයා", "teacher / doctor", "noun", "N5", 2, "School"],
    ["v_n5_3", "学校", "がっこう", "gakkou", "පාසල", "school", "noun", "N5", 3, "School"],
    ["v_n5_4", "本", "ほん", "hon", "පොත", "book", "noun", "N5", 4, "Study"],
    ["v_n5_5", "辞書", "じしょ", "jisho", "ශබ්දකෝෂය", "dictionary", "noun", "N5", 5, "Study"],
    ["v_n5_6", "鉛筆", "えんぴつ", "enpitsu", "පැන්සල", "pencil", "noun", "N5", 6, "Study"],
    ["v_n5_7", "傘", "かさ", "kasa", "කුඩය", "umbrella", "noun", "N5", 7, "Daily"],
    ["v_n5_8", "時計", "とけい", "tokei", "ඔරලෝසුව", "clock / watch", "noun", "N5", 8, "Daily"],
    ["v_n5_9", "鞄", "かばん", "kaban", "බෑගය / මල්ල", "bag", "noun", "N5", 9, "Daily"],
    ["v_n5_10", "机", "つくえ", "tsukue", "මේසය", "desk", "noun", "N5", 10, "Room"],
    ["v_n5_11", "椅子", "いす", "isu", "පුටුව", "chair", "noun", "N5", 11, "Room"],
    ["v_n5_12", "部屋", "へや", "heya", "කාමරය", "room", "noun", "N5", 12, "Home"],
    ["v_n5_13", "家", "いえ", "ie", "නිවස / ගෙදර", "house / home", "noun", "N5", 13, "Home"],
    ["v_n5_14", "家族", "かぞく", "kazoku", "පවුල", "family", "noun", "N5", 14, "Family"],
    ["v_n5_15", "父", "ちち", "chichi", "පියා (මගේ)", "father (my)", "noun", "N5", 15, "Family"],
    ["v_n5_16", "母", "はは", "haha", "මව (මගේ)", "mother (my)", "noun", "N5", 16, "Family"],
    ["v_n5_17", "兄", "あに", "ani", "අයියා (මගේ)", "older brother", "noun", "N5", 17, "Family"],
    ["v_n5_18", "姉", "あね", "ane", "අක්කා (මගේ)", "older sister", "noun", "N5", 18, "Family"],
    ["v_n5_19", "弟", "おとうと", "otouto", "මල්ලී", "younger brother", "noun", "N5", 19, "Family"],
    ["v_n5_20", "妹", "いもうと", "imouto", "නංගී", "younger sister", "noun", "N5", 20, "Family"],
    ["v_n5_21", "友達", "ともだち", "tomodachi", "මිතුරා / යහළුවා", "friend", "noun", "N5", 21, "Social"],
    ["v_n5_22", "人", "ひと", "hito", "පුද්ගලයා / මනුෂ්‍යයා", "person", "noun", "N5", 22, "People"],
    ["v_n5_23", "男", "おとこ", "otoko", "පිරිමි / පුරුෂයා", "man", "noun", "N5", 23, "People"],
    ["v_n5_24", "女", "おんな", "onna", "ගැහැණු / කාන්තාව", "woman", "noun", "N5", 24, "People"],
    ["v_n5_25", "子ども", "こども", "kodomo", "ළමයා / දරුවා", "child", "noun", "N5", 25, "People"],
    ["v_n5_26", "水", "みず", "mizu", "වතුර / ජලය", "water", "noun", "N5", 26, "Food"],
    ["v_n5_27", "お茶", "おちゃ", "ocha", "තේ පැන් / ග්‍රීන් ටී", "green tea", "noun", "N5", 27, "Food"],
    ["v_n5_28", "ご飯", "ごはん", "gohan", "බත් / ආහාරය", "cooked rice / meal", "noun", "N5", 28, "Food"],
    ["v_n5_29", "朝ご飯", "あさごはん", "asagohan", "උදෑසන ආහාරය", "breakfast", "noun", "N5", 29, "Food"],
    ["v_n5_30", "昼ご飯", "ひるごはん", "hirugohan", "දහවල් ආහාරය", "lunch", "noun", "N5", 30, "Food"],
    ["v_n5_31", "晩ご飯", "ばんごはん", "bangohan", "රාත්‍රී ආහාරය", "dinner", "noun", "N5", 31, "Food"],
    ["v_n5_32", "魚", "さかな", "sakana", "මාළුවා", "fish", "noun", "N5", 32, "Food"],
    ["v_n5_33", "肉", "にく", "niku", "මස්", "meat", "noun", "N5", 33, "Food"],
    ["v_n5_34", "卵", "たまご", "tamago", "බිත්තරය", "egg", "noun", "N5", 34, "Food"],
    ["v_n5_35", "野菜", "やさい", "yasai", "එළවළු", "vegetables", "noun", "N5", 35, "Food"],
    ["v_n5_36", "果物", "くだもの", "kudamono", "පලතුරු", "fruits", "noun", "N5", 36, "Food"],
    ["v_n5_37", "林檎", "りんご", "ringo", "ඇපල්", "apple", "noun", "N5", 37, "Food"],
    ["v_n5_38", "パン", "パン", "pan", "පාන්", "bread", "noun", "N5", 38, "Food"],
    ["v_n5_39", "牛乳", "ぎゅうにゅう", "gyuunyuu", "එළකිරි", "cow milk", "noun", "N5", 39, "Food"],
    ["v_n5_40", "手", "て", "te", "අත", "hand", "noun", "N5", 40, "Body"],
    ["v_n5_41", "足", "あし", "ashi", "කකුල", "leg / foot", "noun", "N5", 41, "Body"],
    ["v_n5_42", "目", "め", "me", "ඇස", "eye", "noun", "N5", 42, "Body"],
    ["v_n5_43", "耳", "みみ", "mimi", "කන", "ear", "noun", "N5", 43, "Body"],
    ["v_n5_44", "口", "くち", "kuchi", "කට", "mouth", "noun", "N5", 44, "Body"],
    ["v_n5_45", "鼻", "はな", "hana", "නාසය", "nose", "noun", "N5", 45, "Body"],
    ["v_n5_46", "頭", "あたま", "atama", "හිස / ඔලුව", "head", "noun", "N5", 46, "Body"],
    ["v_n5_47", "病院", "びょういん", "byouin", "රෝහල", "hospital", "noun", "N5", 47, "Places"],
    ["v_n5_48", "駅", "えき", "eki", "දුම්රිය ස්ථානය", "train station", "noun", "N5", 48, "Places"],
    ["v_n5_49", "銀行", "ぎんこう", "ginkou", "බැංකුව", "bank", "noun", "N5", 49, "Places"],
    ["v_n5_50", "郵便局", "ゆうびんきょく", "yuubinkyoku", "තැපැල් කන්තෝරුව", "post office", "noun", "N5", 50, "Places"],
    ["v_n5_51", "図書館", "としょかん", "toshokan", "පුස්තකාලය", "library", "noun", "N5", 51, "Places"],
    ["v_n5_52", "公園", "こうえん", "kouen", "උද්‍යානය", "park", "noun", "N5", 52, "Places"],
    ["v_n5_53", "交番", "こうばん", "kouban", "පොලිස් මුරපොළ", "police box", "noun", "N5", 53, "Places"],
    ["v_n5_54", "店", "みせ", "mise", "කඩය / සාප්පුව", "shop / store", "noun", "N5", 54, "Places"],
    ["v_n5_55", "会社", "かいしゃ", "kaisha", "සමාගම / ආයතනය", "company", "noun", "N5", 55, "Places"],
    ["v_n5_56", "車", "くるま", "kuruma", "කාර් රථය / වාහනය", "car", "noun", "N5", 56, "Transport"],
    ["v_n5_57", "電車", "でんしゃ", "densha", "විදුලි දුම්රිය", "electric train", "noun", "N5", 57, "Transport"],
    ["v_n5_58", "地下鉄", "ちかてつ", "chikatetsu", "උමං දුම්රිය", "subway", "noun", "N5", 58, "Transport"],
    ["v_n5_59", "飛行機", "ひこうき", "hikouki", "ගුවන් යානය", "airplane", "noun", "N5", 59, "Transport"],
    ["v_n5_60", "自転車", "じてんしゃ", "jitensha", "පාපැදිය", "bicycle", "noun", "N5", 60, "Transport"],
    ["v_n5_61", "バス", "バス", "basu", "බස් රථය", "bus", "noun", "N5", 61, "Transport"],
    ["v_n5_62", "道", "みち", "michi", "පාර / මාර්ගය", "road / street", "noun", "N5", 62, "Transport"],
    ["v_n5_63", "今日", "きょう", "kyou", "අද", "today", "noun", "N5", 63, "Time"],
    ["v_n5_64", "明日", "あした", "ashita", "හෙට", "tomorrow", "noun", "N5", 64, "Time"],
    ["v_n5_65", "昨日", "きのう", "kinou", "ඊයේ", "yesterday", "noun", "N5", 65, "Time"],
    ["v_n5_66", "今", "いま", "ima", "දැන්", "now", "noun", "N5", 66, "Time"],
    ["v_n5_67", "朝", "あさ", "asa", "උදෑසන", "morning", "noun", "N5", 67, "Time"],
    ["v_n5_68", "昼", "ひる", "hiru", "දහවල", "afternoon / noon", "noun", "N5", 68, "Time"],
    ["v_n5_69", "夜", "よる", "yoru", "රාත්‍රිය", "night", "noun", "N5", 69, "Time"],
    ["v_n5_70", "週", "しゅう", "shuu", "සතිය", "week", "noun", "N5", 70, "Time"],
    ["v_n5_71", "月", "つき", "tsuki", "මාසය / සඳ", "month / moon", "noun", "N5", 71, "Time"],
    ["v_n5_72", "年", "とし", "toshi", "වසර / අවුරුද්ද", "year", "noun", "N5", 72, "Time"],
    ["v_n5_73", "天気", "てんき", "tenki", "කාලගුණය", "weather", "noun", "N5", 73, "Nature"],
    ["v_n5_74", "雨", "あめ", "ame", "වැස්ස", "rain", "noun", "N5", 74, "Nature"],
    ["v_n5_75", "雪", "ゆき", "yuki", "හිම", "snow", "noun", "N5", 75, "Nature"],
    ["v_n5_76", "風", "かぜ", "kaze", "සුළඟ", "wind", "noun", "N5", 76, "Nature"],
    ["v_n5_77", "空", "そら", "sora", "අහස", "sky", "noun", "N5", 77, "Nature"],
    ["v_n5_78", "山", "やま", "yama", "කන්ද", "mountain", "noun", "N5", 78, "Nature"],
    ["v_n5_79", "川", "かわ", "kawa", "ගඟ / ඇළ", "river", "noun", "N5", 79, "Nature"],
    ["v_n5_80", "海", "うみ", "umi", "මුහුද", "sea / ocean", "noun", "N5", 80, "Nature"],
    ["v_n5_81", "犬", "いぬ", "inu", "බල්ලා", "dog", "noun", "N5", 81, "Animals"],
    ["v_n5_82", "猫", "ねこ", "neko", "පූසා", "cat", "noun", "N5", 82, "Animals"],
    ["v_n5_83", "鳥", "とり", "tori", "කුරුල්ලා", "bird", "noun", "N5", 83, "Animals"],
    ["v_n5_84", "花", "はな", "hana", "මල", "flower", "noun", "N5", 84, "Nature"],
    ["v_n5_85", "木", "き", "ki", "ගස / ලී", "tree / wood", "noun", "N5", 85, "Nature"],
    ["v_n5_86", "お金", "おかね", "okane", "සල්ලි / මුදල්", "money", "noun", "N5", 86, "Daily"],
    ["v_n5_87", "切符", "きっぷ", "kippu", "ප්‍රවේශ පත්‍රය (ටිකට්පත)", "ticket", "noun", "N5", 87, "Daily"],
    ["v_n5_88", "写真", "しゃしん", "shashin", "ඡායාරූපය", "photo", "noun", "N5", 88, "Daily"],
    ["v_n5_89", "手紙", "てがみ", "tegami", "ලිපිය / ලියුම", "letter", "noun", "N5", 89, "Daily"],
    ["v_n5_90", "電話", "でんわ", "denwa", "දුරකථනය", "telephone", "noun", "N5", 90, "Daily"],
    ["v_n5_91", "名前", "なまえ", "namae", "නම", "name", "noun", "N5", 91, "Daily"],
    ["v_n5_92", "国", "くに", "kuni", "රට / දේශය", "country", "noun", "N5", 92, "Places"],
    ["v_n5_93", "言葉", "ことば", "kotoba", "වචනය / භාෂාව", "word / language", "noun", "N5", 93, "Study"],
    ["v_n5_94", "質問", "しつもん", "shitsumon", "ප්‍රශ්නය", "question", "noun", "N5", 94, "Study"],
    ["v_n5_95", "答え", "こたえ", "kotae", "පිළිතුර", "answer", "noun", "N5", 95, "Study"],
    ["v_n5_96", "テスト", "テスト", "tesuto", "පරීක්ෂණය / විභාගය", "test / exam", "noun", "N5", 96, "Study"],
    ["v_n5_97", "問題", "もんだい", "mondai", "ගැටලුව / ප්‍රශ්නය", "problem / issue", "noun", "N5", 97, "Study"],
    ["v_n5_98", "時間", "じかん", "jikan", "වේලාව / කාලය", "time / hour", "noun", "N5", 98, "Time"],
    ["v_n5_99", "毎朝", "まいあさ", "maiasa", "සෑම උදෑසනකම", "every morning", "noun", "N5", 99, "Time"],
    ["v_n5_100", "毎日", "まいにち", "mainichi", "සෑම දිනකම", "every day", "noun", "N5", 100, "Time"]
]

N4_ITEMS = [
    ["v_n4_1", "案内", "あんない", "annai", "මඟ පෙන්වීම", "guidance / guide", "noun", "N4", 1, "Daily"],
    ["v_n4_2", "意見", "いけん", "iken", "අදහස / මතය", "opinion", "noun", "N4", 2, "Daily"],
    ["v_n4_3", "意味", "いみ", "imi", "තේරුම / අර්ථය", "meaning", "noun", "N4", 3, "Study"],
    ["v_n4_4", "運転", "うんてん", "unten", "රිය පැදවීම", "driving", "noun", "N4", 4, "Transport"],
    ["v_n4_5", "運動", "うんどう", "undou", "ව්‍යායාම", "exercise / sport", "noun", "N4", 5, "Health"],
    ["v_n4_6", "お正月", "おしょうがつ", "oshougatsu", "ජපන් අලුත් අවුරුද්ද", "New Year", "noun", "N4", 6, "Culture"],
    ["v_n4_7", "お祭り", "おまつり", "omatsuri", "උත්සවය / සැණකෙළිය", "festival", "noun", "N4", 7, "Culture"],
    ["v_n4_8", "お見舞い", "おみまい", "omimai", "රෝගියෙකු බැලීමට යෑම", "visiting a sick person", "noun", "N4", 8, "Health"],
    ["v_n4_9", "お土産", "おみやげ", "omiyage", "සිහිවටන තෑග්ග", "souvenir / gift", "noun", "N4", 9, "Daily"],
    ["v_n4_10", "海岸", "かいがん", "kaigan", "වෙරළ තීරය", "coast / beach", "noun", "N4", 10, "Nature"],
    ["v_n4_11", "会議", "かいぎ", "kaigi", "රැස්වීම / සාකච්ඡාව", "meeting / conference", "noun", "N4", 11, "Business"],
    ["v_n4_12", "火事", "かじ", "kaji", "ගිනි ගැනීමක් / ගින්න", "fire accident", "noun", "N4", 12, "Disaster"],
    ["v_n4_13", "地震", "じしん", "jishin", "භූමිකම්පාව", "earthquake", "noun", "N4", 13, "Disaster"],
    ["v_n4_14", "台風", "たいふう", "taifuu", "සුළි කුණාටුව", "typhoon", "noun", "N4", 14, "Disaster"],
    ["v_n4_15", "関係", "かんけい", "kankei", "සම්බන්ධතාවය", "relationship", "noun", "N4", 15, "Social"],
    ["v_n4_16", "規則", "きそく", "kisoku", "නීතිරීති / රෙගුලාසි", "rules / regulation", "noun", "N4", 16, "Rules"],
    ["v_n4_17", "気分", "きぶん", "kibun", "සුවය / හැඟීම", "mood / feeling", "noun", "N4", 17, "Health"],
    ["v_n4_18", "教育", "きょういく", "kyouiku", "අධ්‍යාපනය", "education", "noun", "N4", 18, "Study"],
    ["v_n4_19", "興味", "きょうみ", "kyoumi", "උනන්දුව / ඇල්ම", "interest", "noun", "N4", 19, "Daily"],
    ["v_n4_20", "経験", "けいけん", "keiken", "අත්දැකීම", "experience", "noun", "N4", 20, "Work"],
    ["v_n4_21", "計画", "けいかく", "keikaku", "සැලැස්ම", "plan / project", "noun", "N4", 21, "Work"],
    ["v_n4_22", "研究", "けんきゅう", "kenkyuu", "පර්යේෂණය", "research", "noun", "N4", 22, "Study"],
    ["v_n4_23", "原因", "げんいん", "gen'in", "හේතුව", "cause / origin", "noun", "N4", 23, "Logic"],
    ["v_n4_24", "事故", "じこ", "jiko", "අනතුර", "accident", "noun", "N4", 24, "Daily"],
    ["v_n4_25", "習慣", "しゅうかん", "shuukan", "පුරුද්ද / සිරිත", "custom / habit", "noun", "N4", 25, "Culture"],
    ["v_n4_26", "出発", "しゅっぱつ", "shuppatsu", "පිටත්වීම", "departure", "noun", "N4", 26, "Travel"],
    ["v_n4_27", "準備", "じゅんび", "junbi", "සූදානම / ලෑස්තිවීම", "preparation", "noun", "N4", 27, "Daily"],
    ["v_n4_28", "紹介", "しょうかい", "shoukai", "හඳුන්වා දීම", "introduction", "noun", "N4", 28, "Social"],
    ["v_n4_29", "将来", "しょうらい", "shourai", "අනාගතය", "future", "noun", "N4", 29, "Time"],
    ["v_n4_30", "都合", "つごう", "tsugou", "පහසුකම / වේලාව ගැළපීම", "convenience / schedule", "noun", "N4", 30, "Daily"],
    ["v_n4_31", "予定", "よてい", "yotei", "වැඩසටහන / බලාපොරොත්තුව", "schedule / plan", "noun", "N4", 31, "Daily"],
    ["v_n4_32", "利用", "りよう", "riyou", "භාවිතය / ප්‍රයෝජනයට ගැනීම", "use / utilization", "noun", "N4", 32, "Daily"],
    ["v_n4_33", "理由", "りゆう", "riyuu", "හේතුව", "reason", "noun", "N4", 33, "Logic"],
    ["v_n4_34", "連絡", "れんらく", "renraku", "සන්නිවේදනය / දැනුම් දීම", "contact / message", "noun", "N4", 34, "Work"],
    ["v_n4_35", "約束", "やくそく", "yakusoku", "පොරොන්දුව / හමුවීම", "promise / appointment", "noun", "N4", 35, "Daily"],
    ["v_n4_36", "遠慮", "えんりょ", "enryo", "පැකිළීම / සංකෝචනය", "hesitation / restraint", "noun", "N4", 36, "Social"],
    ["v_n4_37", "故障", "こしょう", "koshou", "කාර්මික දෝෂය / කැඩී යාම", "breakdown / out of order", "noun", "N4", 37, "Tools"],
    ["v_n4_38", "心配", "しんぱい", "shinpai", "කනස්සල්ල / බිය", "worry / concern", "noun", "N4", 38, "Daily"],
    ["v_n4_39", "招待", "しょうたい", "shoutai", "ආරාධනය", "invitation", "noun", "N4", 39, "Social"],
    ["v_n4_40", "相談", "そうだん", "soudan", "උපදෙස් පැතීම / සාකච්ඡාව", "consultation / discussion", "noun", "N4", 40, "Social"],
    ["v_n4_41", "世話", "せわ", "sewa", "බලාකියා ගැනීම / උපකාරය", "care / assistance", "noun", "N4", 41, "Social"],
    ["v_n4_42", "注文", "ちゅうもん", "chuumon", "ඇණවුම් කිරීම (Order එක)", "order / request", "noun", "N4", 42, "Daily"],
    ["v_n4_43", "発音", "はつおん", "hatsuon", "උච්චාරණය", "pronunciation", "noun", "N4", 43, "Study"],
    ["v_n4_44", "反対", "はんたい", "hantai", "විරුද්ධත්වය / විරුද්ධ පැත්ත", "opposition / opposite", "noun", "N4", 44, "Logic"],
    ["v_n4_45", "複雑", "ふくざつ", "fukuzatsu", "සංකීර්ණ බව", "complexity", "noun", "N4", 45, "Logic"],
    ["v_n4_46", "法律", "ほうりつ", "houritsu", "නීතිය", "law", "noun", "N4", 46, "Rules"],
    ["v_n4_47", "貿易", "ぼうえき", "boueki", "විදේශ වෙළඳාම", "trade / commerce", "noun", "N4", 47, "Business"],
    ["v_n4_48", "目的", "もくてき", "mokuteki", "අරමුණ / පරමාර්ථය", "purpose / objective", "noun", "N4", 48, "Logic"],
    ["v_n4_49", "輸出", "ゆしゅつ", "yushutsu", "අපනයනය", "export", "noun", "N4", 49, "Business"],
    ["v_n4_50", "輸入", "ゆにゅう", "yunyuu", "ආනයනය", "import", "noun", "N4", 50, "Business"],
    ["v_n4_51", "歴史", "れきし", "rekishi", "ඉතිහාසය", "history", "noun", "N4", 51, "Study"],
    ["v_n4_52", "連絡先", "れんらくさき", "renrakusaki", "සම්බන්ධ කරගත හැකි ලිපිනය / අංකය", "contact address", "noun", "N4", 52, "Social"],
    ["v_n4_53", "道具", "どうぐ", "dougu", "මෙවලම් / ආයුධ", "tool / equipment", "noun", "N4", 53, "Tools"],
    ["v_n4_54", "値段", "ねだん", "nedan", "මිල", "price / cost", "noun", "N4", 54, "Daily"],
    ["v_n4_55", "給料", "きゅうりょう", "kyuuryou", "වැටුප / පඩිය", "salary / wage", "noun", "N4", 55, "Work"],
    ["v_n4_56", "面接", "めんせつ", "mensetsu", "සම්මුඛ පරීක්ෂණය (Interview)", "interview", "noun", "N4", 56, "Work"],
    ["v_n4_57", "履歴書", "りれきしょ", "rirekisho", "ජීව දත්ත පත්‍රිකාව (CV)", "resume / CV", "noun", "N4", 57, "Work"],
    ["v_n4_58", "書類", "しょるい", "shorui", "ලේඛන / ලියකියවිලි", "documents / papers", "noun", "N4", 58, "Work"],
    ["v_n4_59", "受付", "うけつけ", "uketsuke", "පිළිගැනීමේ කවුන්ටරය (Reception)", "reception desk", "noun", "N4", 59, "Places"],
    ["v_n4_60", "忘れ物", "わすれもの", "wasuremono", "අමතක වී දමා ගිය දෙය", "lost property", "noun", "N4", 60, "Daily"]
]

JFT_ITEMS = [
    ["v_jft_1", "点検", "てんけん", "tenken", "පරීක්ෂා කර බැලීම (චෙක් කිරීම)", "inspection / check", "noun", "JFT", 1, "Workplace"],
    ["v_jft_2", "安全", "あんぜん", "anzen", "ආරක්ෂාව / සුරක්ෂිතභාවය", "safety", "noun", "JFT", 2, "Workplace"],
    ["v_jft_3", "危険", "きけん", "kiken", "අනතුර / අවදානම", "danger / hazard", "noun", "JFT", 3, "Workplace"],
    ["v_jft_4", "ヘルメット", "ヘルメット", "herumetto", "ආරක්ෂිත හිස්වැස්ම", "helmet", "noun", "JFT", 4, "Safety Gear"],
    ["v_jft_5", "手袋", "てぶくろ", "tebukuro", "අත්වැසුම්", "gloves", "noun", "JFT", 5, "Safety Gear"],
    ["v_jft_6", "作業着", "さぎょうぎ", "sagyougi", "වැඩ ඇඳුම (වැඩපොළ නිල ඇඳුම)", "work clothes", "noun", "JFT", 6, "Safety Gear"],
    ["v_jft_7", "長靴", "ながぐつ", "nagagutsu", "දිගු රබර් බූට් සපත්තු", "rubber boots", "noun", "JFT", 7, "Safety Gear"],
    ["v_jft_8", "休憩", "きゅうけい", "kyuukei", "විවේකය", "rest / break", "noun", "JFT", 8, "Workplace"],
    ["v_jft_9", "指示", "しじ", "shiji", "උපදෙස් / නියෝගය", "instruction / direction", "noun", "JFT", 9, "Workplace"],
    ["v_jft_10", "残業", "ざんぎょう", "zangyou", "අතිකාල වැඩ (OT)", "overtime work", "noun", "JFT", 10, "Workplace"],
    ["v_jft_11", "有給休暇", "ゆうきゅうきゅうか", "yuukyuukyuuka", "වැටුප් සහිත නිවාඩු", "paid leave", "noun", "JFT", 11, "Workplace"],
    ["v_jft_12", "道具", "どうぐ", "dougu", "උපකරණ / ආයුධ", "tools / equipment", "noun", "JFT", 12, "Tools"],
    ["v_jft_13", "荷物", "にもつ", "nimotsu", "බඩු බාහිරාදිය / පාර්සලය", "luggage / baggage", "noun", "JFT", 13, "Workplace"],
    ["v_jft_14", "清掃", "せいそう", "seisou", "පිරිසිදු කිරීම", "cleaning", "noun", "JFT", 14, "Workplace"],
    ["v_jft_15", "整理整頓", "せいりせいとん", "seiriseiton", "අස්පස් කර පිළිවෙළට තැබීම (5S)", "organizing and tidying", "noun", "JFT", 15, "Workplace"],
    ["v_jft_16", "報告", "ほうこく", "houkoku", "වාර්තා කිරීම (හෝ-රෙන්-සෝ)", "report", "noun", "JFT", 16, "Workplace"],
    ["v_jft_17", "相談", "そうだん", "soudan", "විමසීම / සාකච්ඡා කිරීම", "consultation", "noun", "JFT", 17, "Workplace"],
    ["v_jft_18", "確認", "かくにん", "kakunin", "තහවුරු කර ගැනීම", "confirmation", "noun", "JFT", 18, "Workplace"],
    ["v_jft_19", "始業", "しぎょう", "shigyou", "වැඩ ආරම්භය", "start of work", "noun", "JFT", 19, "Workplace"],
    ["v_jft_20", "終業", "しゅうぎょう", "shuugyou", "වැඩ අවසානය", "end of work", "noun", "JFT", 20, "Workplace"],
    ["v_jft_21", "交代", "こうたい", "koutai", "මුර මාරුව (Shift change)", "shift change / relief", "noun", "JFT", 21, "Workplace"],
    ["v_jft_22", "機械", "きかい", "kikai", "යන්ත්‍රය / මැෂිම", "machine", "noun", "JFT", 22, "Tools"],
    ["v_jft_23", "工具", "こうぐ", "kougu", "අත් ආයුධ / අළුත්වැඩියා මෙවලම්", "hand tools", "noun", "JFT", 23, "Tools"],
    ["v_jft_24", "倉庫", "そうこ", "souko", "ගබඩාව", "warehouse / storehouse", "noun", "JFT", 24, "Workplace"],
    ["v_jft_25", "運搬", "うんぱん", "unpan", "ප්‍රවාහනය / බඩු ඇදීම", "transport / conveyance", "noun", "JFT", 25, "Workplace"],
    ["v_jft_26", "台車", "だいしゃ", "daisha", "ට්‍රොලිය (අතින් තල්ලු කරන කරත්තය)", "handcart / trolley", "noun", "JFT", 26, "Tools"],
    ["v_jft_27", "段ボール", "だんボール", "danbooru", "කාඩ්බෝඩ් පෙට්ටිය", "cardboard box", "noun", "JFT", 27, "Tools"],
    ["v_jft_28", "ゴミ箱", "ゴミばこ", "gomibako", "කුණු කූඩය", "trash bin / wastebasket", "noun", "JFT", 28, "Workplace"],
    ["v_jft_29", "分別", "ぶんべつ", "bunbetsu", "කුණු වෙන් කිරීම (වර්ගීකරණය)", "sorting / classification", "noun", "JFT", 29, "Workplace"],
    ["v_jft_30", "禁煙", "きんえん", "kin'en", "දුම්පානය තහනම්", "no smoking", "noun", "JFT", 30, "Rules"],
    ["v_jft_31", "非常口", "ひじょうぐち", "hijouguchi", "හදිසි පිටවීමේ දොරටුව", "emergency exit", "noun", "JFT", 31, "Rules"],
    ["v_jft_32", "消火器", "しょうかき", "shoukaki", "ගිනි නිවන උපකරණය", "fire extinguisher", "noun", "JFT", 32, "Safety Gear"],
    ["v_jft_33", "体調", "たいちょう", "taichou", "ශාරීරික තත්ත්වය", "physical condition", "noun", "JFT", 33, "Health"],
    ["v_jft_34", "発熱", "はつねつ", "hatsunetsu", "උණ ගැනීම", "fever", "noun", "JFT", 34, "Health"],
    ["v_jft_35", "怪我", "けが", "kega", "තුවාලය", "injury", "noun", "JFT", 35, "Health"],
    ["v_jft_36", "薬品", "やくひん", "yakuhin", "රසායනික ද්‍රව්‍ය / බෙහෙත්", "chemicals / medicines", "noun", "JFT", 36, "Workplace"],
    ["v_jft_37", "マスク", "マスク", "masuku", "මුහුණු ආවරණය (මාස්ක්)", "mask", "noun", "JFT", 37, "Safety Gear"],
    ["v_jft_38", "耳栓", "みみせん", "mimisen", "කන් ආවරණ (කන් ඇබ)", "earplugs", "noun", "JFT", 38, "Safety Gear"],
    ["v_jft_39", "安全靴", "あんぜんぐつ", "anzengutsu", "ආරක්ෂිත සපත්තු (Safety boots)", "safety shoes", "noun", "JFT", 39, "Safety Gear"],
    ["v_jft_40", "取扱注意", "とりあつかいちゅうい", "toriatsukaichuui", "ප්‍රවේශමෙන් පරිහරණය කරන්න", "handle with care", "noun", "JFT", 40, "Rules"]
]

# Read N3 cards
with open('src/data/preloadedN3Kanji.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(
    r'\{\s*id:\s*\"([^\"]+)\",\s*kanji:\s*\"([^\"]+)\",\s*furigana:\s*\"([^\"]+)\",.*?sinhalaMeaning:\s*\"([^\"]+)\",\s*englishMeaning:\s*\"([^\"]+)\",\s*level:\s*\"([^\"]+)\",\s*lesson:\s*\"([^\"]+)\",\s*indexNumber:\s*(\d+)',
    re.DOTALL
)

n3_items = []
for m in pattern.finditer(text):
    cid, kanji, furigana, sinhala, english, level, lesson, idx = m.groups()
    k_decoded = kanji.encode().decode('unicode_escape')
    f_decoded = furigana.encode().decode('unicode_escape')
    s_decoded = sinhala.encode().decode('unicode_escape')
    rom = kana_to_romaji(f_decoded)
    n3_items.append({
        'id': f"v_{cid}",
        'kanji': k_decoded,
        'reading': f_decoded,
        'romaji': rom,
        'sinhalaMeaning': s_decoded,
        'englishMeaning': english,
        'partOfSpeech': 'verb' if k_decoded.endswith(('る', 'く', 'す', 'つ', 'ぬ', 'む', 'う', 'ぐ', 'ぶ')) and not k_decoded.endswith('車') else ('adjective' if k_decoded.endswith('い') else 'noun'),
        'level': 'N3',
        'category': lesson,
        'indexNumber': int(idx)
    })

print(f"Loaded: N5={len(N5_ITEMS)}, N4={len(N4_ITEMS)}, JFT={len(JFT_ITEMS)}, N3={len(n3_items)}")

# Generate src/data/preloadedVocabulary.ts
out_path = "src/data/preloadedVocabulary.ts"
with open(out_path, "w", encoding="utf-8") as out:
    out.write('import { VocabularyItem } from "../types";\n\n')
    out.write('export const PRELOADED_VOCABULARY: VocabularyItem[] = [\n')
    
    # Write N5 items
    out.write('  // ==================== JLPT N5 VOCABULARY ====================\n')
    for item in N5_ITEMS:
        out.write('  {\n')
        out.write(f'    id: {json.dumps(item[0])},\n')
        out.write(f'    kanji: {json.dumps(item[1], ensure_ascii=False)},\n')
        out.write(f'    reading: {json.dumps(item[2], ensure_ascii=False)},\n')
        out.write(f'    romaji: {json.dumps(item[3])},\n')
        out.write(f'    sinhalaMeaning: {json.dumps(item[4], ensure_ascii=False)},\n')
        out.write(f'    englishMeaning: {json.dumps(item[5])},\n')
        out.write(f'    partOfSpeech: {json.dumps(item[6])},\n')
        out.write(f'    level: {json.dumps(item[7])},\n')
        out.write(f'    indexNumber: {item[8]},\n')
        out.write(f'    category: {json.dumps(item[9], ensure_ascii=False)}\n')
        out.write('  },\n')
        
    # Write N4 items
    out.write('\n  // ==================== JLPT N4 VOCABULARY ====================\n')
    for item in N4_ITEMS:
        out.write('  {\n')
        out.write(f'    id: {json.dumps(item[0])},\n')
        out.write(f'    kanji: {json.dumps(item[1], ensure_ascii=False)},\n')
        out.write(f'    reading: {json.dumps(item[2], ensure_ascii=False)},\n')
        out.write(f'    romaji: {json.dumps(item[3])},\n')
        out.write(f'    sinhalaMeaning: {json.dumps(item[4], ensure_ascii=False)},\n')
        out.write(f'    englishMeaning: {json.dumps(item[5])},\n')
        out.write(f'    partOfSpeech: {json.dumps(item[6])},\n')
        out.write(f'    level: {json.dumps(item[7])},\n')
        out.write(f'    indexNumber: {item[8]},\n')
        out.write(f'    category: {json.dumps(item[9], ensure_ascii=False)}\n')
        out.write('  },\n')

    # Write JFT items
    out.write('\n  // ==================== JFT-BASIC VOCABULARY ====================\n')
    for item in JFT_ITEMS:
        out.write('  {\n')
        out.write(f'    id: {json.dumps(item[0])},\n')
        out.write(f'    kanji: {json.dumps(item[1], ensure_ascii=False)},\n')
        out.write(f'    reading: {json.dumps(item[2], ensure_ascii=False)},\n')
        out.write(f'    romaji: {json.dumps(item[3])},\n')
        out.write(f'    sinhalaMeaning: {json.dumps(item[4], ensure_ascii=False)},\n')
        out.write(f'    englishMeaning: {json.dumps(item[5])},\n')
        out.write(f'    partOfSpeech: {json.dumps(item[6])},\n')
        out.write(f'    level: {json.dumps(item[7])},\n')
        out.write(f'    indexNumber: {item[8]},\n')
        out.write(f'    category: {json.dumps(item[9], ensure_ascii=False)}\n')
        out.write('  },\n')

    # Write N3 items
    out.write('\n  // ==================== JLPT N3 VOCABULARY ====================\n')
    for item in n3_items:
        out.write('  {\n')
        out.write(f'    id: {json.dumps(item["id"])},\n')
        out.write(f'    kanji: {json.dumps(item["kanji"], ensure_ascii=False)},\n')
        out.write(f'    reading: {json.dumps(item["reading"], ensure_ascii=False)},\n')
        out.write(f'    romaji: {json.dumps(item["romaji"])},\n')
        out.write(f'    sinhalaMeaning: {json.dumps(item["sinhalaMeaning"], ensure_ascii=False)},\n')
        out.write(f'    englishMeaning: {json.dumps(item["englishMeaning"])},\n')
        out.write(f'    partOfSpeech: {json.dumps(item["partOfSpeech"])},\n')
        out.write(f'    level: {json.dumps(item["level"])},\n')
        out.write(f'    indexNumber: {item["indexNumber"]},\n')
        out.write(f'    category: {json.dumps(item["category"], ensure_ascii=False)}\n')
        out.write('  },\n')

    out.write('];\n')

print(f"Successfully generated {out_path} with {len(N5_ITEMS) + len(N4_ITEMS) + len(JFT_ITEMS) + len(n3_items)} vocabulary items!")
