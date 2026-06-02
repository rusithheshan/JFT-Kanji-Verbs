export interface JFTAdjective {
  id: string;
  type: "i" | "na";
  kanji: string;
  hiragana: string;
  sinhalaMeaning: string;
}

export const PRELOADED_ADJECTIVES: JFTAdjective[] = [
  // --- 1. i-Adjectives (ඉ-විශේෂණ පද) ---
  {
    id: "adj-i-1",
    type: "i",
    kanji: "危ない",
    hiragana: "あぶない",
    sinhalaMeaning: "අනතුරුදායක"
  },
  {
    id: "adj-i-2",
    type: "i",
    kanji: "甘い",
    hiragana: "あまい",
    sinhalaMeaning: "පැණිරස"
  },
  {
    id: "adj-i-3",
    type: "i",
    kanji: "怪しい",
    hiragana: "あやしい",
    sinhalaMeaning: "සැකකටයුතු"
  },
  {
    id: "adj-i-4",
    type: "i",
    kanji: "荒い",
    hiragana: "あらい",
    sinhalaMeaning: "රළු / සැර"
  },
  {
    id: "adj-i-5",
    type: "i",
    kanji: "新しい",
    hiragana: "あたらしい",
    sinhalaMeaning: "අලුත්"
  },
  {
    id: "adj-i-6",
    type: "i",
    kanji: "暖かい",
    hiragana: "あたたかい",
    sinhalaMeaning: "උණුසුම් (කාලගුණය)"
  },
  {
    id: "adj-i-7",
    type: "i",
    kanji: "温かい",
    hiragana: "あたたかい",
    sinhalaMeaning: "උණුසුම් (කෑම/බීම)"
  },
  {
    id: "adj-i-8",
    type: "i",
    kanji: "厚い",
    hiragana: "あつい",
    sinhalaMeaning: "මහත / ඝනකම්"
  },
  {
    id: "adj-i-9",
    type: "i",
    kanji: "熱い",
    hiragana: "あつい",
    sinhalaMeaning: "රස්න (ස්පර්ශයට)"
  },
  {
    id: "adj-i-10",
    type: "i",
    kanji: "暑い",
    hiragana: "あつい",
    sinhalaMeaning: "රස්න (කාලගුණය)"
  },
  {
    id: "adj-i-11",
    type: "i",
    kanji: "忙しい",
    hiragana: "いそがしい",
    sinhalaMeaning: "කාර්යබහුල"
  },
  {
    id: "adj-i-12",
    type: "i",
    kanji: "痛い",
    hiragana: "いたい",
    sinhalaMeaning: "රිදෙන / කැක්කුම ඇති"
  },
  {
    id: "adj-i-13",
    type: "i",
    kanji: "偉い",
    hiragana: "えらい",
    sinhalaMeaning: "ශ්‍රේෂ්ඨ / උදාර"
  },
  {
    id: "adj-i-14",
    type: "i",
    kanji: "美味しい",
    hiragana: "おいしい",
    sinhalaMeaning: "රසවත්"
  },
  {
    id: "adj-i-15",
    type: "i",
    kanji: "大きい",
    hiragana: "おおきい",
    sinhalaMeaning: "ලොකු"
  },
  {
    id: "adj-i-16",
    type: "i",
    kanji: "多い",
    hiragana: "おおい",
    sinhalaMeaning: "බොහෝ / ගොඩක්"
  },
  {
    id: "adj-i-17",
    type: "i",
    kanji: "遅い",
    hiragana: "おそい",
    sinhalaMeaning: "ප්‍රමාද / හෙමින්"
  },
  {
    id: "adj-i-18",
    type: "i",
    kanji: "恐ろしい",
    hiragana: "おそろしい",
    sinhalaMeaning: "බියකරු"
  },
  {
    id: "adj-i-19",
    type: "i",
    kanji: "重い",
    hiragana: "おもい",
    sinhalaMeaning: "බර"
  },
  {
    id: "adj-i-20",
    type: "i",
    kanji: "面白い",
    hiragana: "おもしろい",
    sinhalaMeaning: "සිත්ගන්නාසුලු / විහිළු"
  },
  {
    id: "adj-i-21",
    type: "i",
    kanji: "可愛い",
    hiragana: "かわいい",
    sinhalaMeaning: "හුරුබුහුටි / ලස්සන"
  },
  {
    id: "adj-i-22",
    type: "i",
    kanji: "構わない",
    hiragana: "かまわない",
    sinhalaMeaning: "කමක් නැහැ"
  },
  {
    id: "adj-i-23",
    type: "i",
    kanji: "痒い",
    hiragana: "かゆい",
    sinhalaMeaning: "කසන / කඩියන"
  },
  {
    id: "adj-i-24",
    type: "i",
    kanji: "辛い",
    hiragana: "からい",
    sinhalaMeaning: "සැර (කටදැවිල්ල ඇති)"
  },
  {
    id: "adj-i-25",
    type: "i",
    kanji: "軽い",
    hiragana: "かるい",
    sinhalaMeaning: "සැහැල්ලු"
  },
  {
    id: "adj-i-26",
    type: "i",
    kanji: "厳しい",
    hiragana: "きびしい",
    sinhalaMeaning: "දැඩි / තදින් ක්‍රියා කරන"
  },
  {
    id: "adj-i-27",
    type: "i",
    kanji: "汚い",
    hiragana: "きたない",
    sinhalaMeaning: "අපිරිසිදු"
  },
  {
    id: "adj-i-28",
    type: "i",
    kanji: "暗い",
    hiragana: "くらい",
    sinhalaMeaning: "අඳුරු"
  },
  {
    id: "adj-i-29",
    type: "i",
    kanji: "苦しい",
    hiragana: "くるしい",
    sinhalaMeaning: "වේදනාකාරී / අපහසු"
  },
  {
    id: "adj-i-30",
    type: "i",
    kanji: "黒い",
    hiragana: "くろい",
    sinhalaMeaning: "කළු"
  },
  {
    id: "adj-i-31",
    type: "i",
    kanji: "細かい",
    hiragana: "こまかい",
    sinhalaMeaning: "සිහින් / කුඩා (විස්තරාත්මක)"
  },
  {
    id: "adj-i-32",
    type: "i",
    kanji: "寂しい",
    hiragana: "さびしい",
    sinhalaMeaning: "පාලුයි"
  },
  {
    id: "adj-i-33",
    type: "i",
    kanji: "寒い",
    hiragana: "さむい",
    sinhalaMeaning: "සීතල (කාලගුණය)"
  },
  {
    id: "adj-i-34",
    type: "i",
    kanji: "白い",
    hiragana: "しろい",
    sinhalaMeaning: "සුදු"
  },
  {
    id: "adj-i-35",
    type: "i",
    kanji: "凄い",
    hiragana: "すごい",
    sinhalaMeaning: "පුදුමාකාර / නියමයි"
  },
  {
    id: "adj-i-36",
    type: "i",
    kanji: "素晴らしい",
    hiragana: "すばらしい",
    sinhalaMeaning: "විශිෂ්ට / අගනා"
  },
  {
    id: "adj-i-37",
    type: "i",
    kanji: "酸っぱい",
    hiragana: "すっぱい",
    sinhalaMeaning: "ඇඹුල්"
  },
  {
    id: "adj-i-38",
    type: "i",
    kanji: "涼しい",
    hiragana: "すずしい",
    sinhalaMeaning: "සිසිල්"
  },
  {
    id: "adj-i-39",
    type: "i",
    kanji: "狭い",
    hiragana: "せまい",
    sinhalaMeaning: "පටු / ඉඩකඩ අඩු"
  },
  {
    id: "adj-i-40",
    type: "i",
    kanji: "正しい",
    hiragana: "ただしい",
    sinhalaMeaning: "නිවැරදි"
  },
  {
    id: "adj-i-41",
    type: "i",
    kanji: "高い",
    hiragana: "たかい",
    sinhalaMeaning: "උස් / මිල අධික"
  },
  {
    id: "adj-i-42",
    type: "i",
    kanji: "楽しい",
    hiragana: "たのしい",
    sinhalaMeaning: "විනෝදජනක"
  },
  {
    id: "adj-i-43",
    type: "i",
    kanji: "小さい",
    hiragana: "ちいさい",
    sinhalaMeaning: "කුඩා"
  },
  {
    id: "adj-i-44",
    type: "i",
    kanji: "近い",
    hiragana: "ちかい",
    sinhalaMeaning: "ළඟ / ආසන්න"
  },
  {
    id: "adj-i-45",
    type: "i",
    kanji: "つまらない",
    hiragana: "つまらない",
    sinhalaMeaning: "කම්මැලි / වැඩකට නැති"
  },
  {
    id: "adj-i-46",
    type: "i",
    kanji: "冷たい",
    hiragana: "つめたい",
    sinhalaMeaning: "සීතල (ස්පර්ශයට)"
  },
  {
    id: "adj-i-47",
    type: "i",
    kanji: "強い",
    hiragana: "つよい",
    sinhalaMeaning: "ශක්තිමත් / බලවත්"
  },
  {
    id: "adj-i-48",
    type: "i",
    kanji: "遠い",
    hiragana: "とおい",
    sinhalaMeaning: "ඈත / දුර"
  },
  {
    id: "adj-i-49",
    type: "i",
    kanji: "尊い",
    hiragana: "とうとい",
    sinhalaMeaning: "වටිනා / උතුම්"
  },
  {
    id: "adj-i-50",
    type: "i",
    kanji: "長い",
    hiragana: "ながい",
    sinhalaMeaning: "දිග"
  },
  {
    id: "adj-i-51",
    type: "i",
    kanji: "苦い",
    hiragana: "にがい",
    sinhalaMeaning: "තිත්ත"
  },
  {
    id: "adj-i-52",
    type: "i",
    kanji: "温い",
    hiragana: "ぬるい",
    sinhalaMeaning: "මඳ උණුසුම්"
  },
  {
    id: "adj-i-53",
    type: "i",
    kanji: "眠い",
    hiragana: "ねむい",
    sinhalaMeaning: "නිදිමත"
  },
  {
    id: "adj-i-54",
    type: "i",
    kanji: "激しい",
    hiragana: "はげしい",
    sinhalaMeaning: "දරුණු / තදබල"
  },
  {
    id: "adj-i-55",
    type: "i",
    kanji: "恥ずかしい",
    hiragana: "はずかしい",
    sinhalaMeaning: "ලැජ්ජාශීලී"
  },
  {
    id: "adj-i-56",
    type: "i",
    kanji: "早い",
    hiragana: "はやい",
    sinhalaMeaning: "වේලාසන"
  },
  {
    id: "adj-i-57",
    type: "i",
    kanji: "速い",
    hiragana: "はやい",
    sinhalaMeaning: "වේගවත්"
  },
  {
    id: "adj-i-58",
    type: "i",
    kanji: "低い",
    hiragana: "ひくい",
    sinhalaMeaning: "මිටි / පහත"
  },
  {
    id: "adj-i-59",
    type: "i",
    kanji: "ひどい",
    hiragana: "ひどい",
    sinhalaMeaning: "දරුණු / නරක"
  },
  {
    id: "adj-i-60",
    type: "i",
    kanji: "広い",
    hiragana: "ひろい",
    sinhalaMeaning: "පළල් / ඉඩකඩ ඇති"
  },
  {
    id: "adj-i-61",
    type: "i",
    kanji: "深い",
    hiragana: "ふかい",
    sinhalaMeaning: "ගැඹුරු"
  },
  {
    id: "adj-i-62",
    type: "i",
    kanji: "太い",
    hiragana: "ふとい",
    sinhalaMeaning: "මහත"
  },
  {
    id: "adj-i-63",
    type: "i",
    kanji: "古い",
    hiragana: "ふるい",
    sinhalaMeaning: "පැරණි / පරණ"
  },
  {
    id: "adj-i-64",
    type: "i",
    kanji: "欲しい",
    hiragana: "ほしい",
    sinhalaMeaning: "අවශ්‍ය / ඕනෑ"
  },
  {
    id: "adj-i-65",
    type: "i",
    kanji: "細い",
    hiragana: "ほそい",
    sinhalaMeaning: "කෙට්ටු / සිහින්"
  },
  {
    id: "adj-i-66",
    type: "i",
    kanji: "不味い",
    hiragana: "まずい",
    sinhalaMeaning: "රස නැති / අප්‍රිය"
  },
  {
    id: "adj-i-67",
    type: "i",
    kanji: "丸い",
    hiragana: "まるい",
    sinhalaMeaning: "රවුම්"
  },
  {
    id: "adj-i-68",
    type: "i",
    kanji: "短い",
    hiragana: "みじかい",
    sinhalaMeaning: "කෙටි"
  },
  {
    id: "adj-i-69",
    type: "i",
    kanji: "珍しい",
    hiragana: "めずらしい",
    sinhalaMeaning: "දුර්ලභ"
  },
  {
    id: "adj-i-70",
    type: "i",
    kanji: "優しい",
    hiragana: "やさしい",
    sinhalaMeaning: "කරුණාවන්ත"
  },
  {
    id: "adj-i-71",
    type: "i",
    kanji: "易しい",
    hiragana: "やさしい",
    sinhalaMeaning: "ලේසි / සරල"
  },
  {
    id: "adj-i-72",
    type: "i",
    kanji: "安い",
    hiragana: "やすい",
    sinhalaMeaning: "ලාභ (මිල අඩු)"
  },
  {
    id: "adj-i-73",
    type: "i",
    kanji: "柔らかい",
    hiragana: "やわらかい",
    sinhalaMeaning: "මෘදු / මොලොක්"
  },
  {
    id: "adj-i-74",
    type: "i",
    kanji: "宜しい",
    hiragana: "よろしい",
    sinhalaMeaning: "හොඳයි (Polite)"
  },
  {
    id: "adj-i-75",
    type: "i",
    kanji: "若い",
    hiragana: "わかい",
    sinhalaMeaning: "තරුණ"
  },
  {
    id: "adj-i-76",
    type: "i",
    kanji: "悪い",
    hiragana: "わるい",
    sinhalaMeaning: "නරක"
  },

  // --- 2. na-Adjectives (න-විශේෂණ පද) ---
  {
    id: "adj-na-1",
    type: "na",
    kanji: "安全な",
    hiragana: "あんぜんな",
    sinhalaMeaning: "ආරක්ෂිත"
  },
  {
    id: "adj-na-2",
    type: "na",
    kanji: "嫌な",
    hiragana: "いやな",
    sinhalaMeaning: "අප්‍රිය / අකමැති"
  },
  {
    id: "adj-na-3",
    type: "na",
    kanji: "一生懸命な",
    hiragana: "いっしょうけんめいな",
    sinhalaMeaning: "උපරිම උත්සාහයෙන් යුත්"
  },
  {
    id: "adj-na-4",
    type: "na",
    kanji: "盛んな",
    hiragana: "さかんな",
    sinhalaMeaning: "ජනප්‍රිය / දියුණු වන"
  },
  {
    id: "adj-na-5",
    type: "na",
    kanji: "簡単な",
    hiragana: "かんたんな",
    sinhalaMeaning: "සරල / ලේසි"
  },
  {
    id: "adj-na-6",
    type: "na",
    kanji: "急な",
    hiragana: "きゅうな",
    sinhalaMeaning: "හදිසි"
  },
  {
    id: "adj-na-7",
    type: "na",
    kanji: "器用な",
    hiragana: "きような",
    sinhalaMeaning: "දක්ෂ / ශිල්පීය"
  },
  {
    id: "adj-na-8",
    type: "na",
    kanji: "嫌いな",
    hiragana: "きらいな",
    sinhalaMeaning: "අකමැති"
  },
  {
    id: "adj-na-9",
    type: "na",
    kanji: "綺麗な",
    hiragana: "きれいな",
    sinhalaMeaning: "ලස්සන / පිරිසිදු"
  },
  {
    id: "adj-na-10",
    type: "na",
    kanji: "元気な",
    hiragana: "げんきな",
    sinhalaMeaning: "සුවසනීපයෙන් ඉන්න / ක්‍රියාශීලී"
  },
  {
    id: "adj-na-11",
    type: "na",
    kanji: "健康な",
    hiragana: "けんこうな",
    sinhalaMeaning: "සෞඛ්‍ය සම්පන්න"
  },
  {
    id: "adj-na-12",
    type: "na",
    kanji: "危険な",
    hiragana: "きけんな",
    sinhalaMeaning: "අනතුරුදායක"
  },
  {
    id: "adj-na-13",
    type: "na",
    kanji: "残念な",
    hiragana: "ざんねんな",
    sinhalaMeaning: "කණගාටුදායක"
  },
  {
    id: "adj-na-14",
    type: "na",
    kanji: "静かな",
    hiragana: "しずかな",
    sinhalaMeaning: "නිශ්ශබ්ද"
  },
  {
    id: "adj-na-15",
    type: "na",
    kanji: "幸せな",
    hiragana: "しあわせな",
    sinhalaMeaning: "සන්තෝෂවත් / වාසනාවන්ත"
  },
  {
    id: "adj-na-16",
    type: "na",
    kanji: "自由な",
    hiragana: "じゆうな",
    sinhalaMeaning: "නිදහස්"
  },
  {
    id: "adj-na-17",
    type: "na",
    kanji: "十分な",
    hiragana: "じゅうぶんな",
    sinhalaMeaning: "ප්‍රමාණවත්"
  },
  {
    id: "adj-na-18",
    type: "na",
    kanji: "不十分な",
    hiragana: "ふじゅうぶんな",
    sinhalaMeaning: "ප්‍රමාණවත් නොවන"
  },
  {
    id: "adj-na-19",
    type: "na",
    kanji: "親切な",
    hiragana: "しんせつな",
    sinhalaMeaning: "කරුණාවන්ත"
  },
  {
    id: "adj-na-20",
    type: "na",
    kanji: "新鮮な",
    hiragana: "しんせんな",
    sinhalaMeaning: "නැවුම්"
  },
  {
    id: "adj-na-21",
    type: "na",
    kanji: "上手な",
    hiragana: "じょうずな",
    sinhalaMeaning: "දක්ෂ"
  },
  {
    id: "adj-na-22",
    type: "na",
    kanji: "好きな",
    hiragana: "すきな",
    sinhalaMeaning: "කැමති"
  },
  {
    id: "adj-na-23",
    type: "na",
    kanji: "大嫌いな",
    hiragana: "だいきらいな",
    sinhalaMeaning: "ගොඩක් අකමැති"
  },
  {
    id: "adj-na-24",
    type: "na",
    kanji: "大好きな",
    hiragana: "だいすきな",
    sinhalaMeaning: "ගොඩක් කැමති"
  },
  {
    id: "adj-na-25",
    type: "na",
    kanji: "大切な",
    hiragana: "たいせつな",
    sinhalaMeaning: "වැදගත් / වටිනා"
  },
  {
    id: "adj-na-26",
    type: "na",
    kanji: "大事な",
    hiragana: "だいじな",
    sinhalaMeaning: "වැදගත්"
  },
  {
    id: "adj-na-27",
    type: "na",
    kanji: "確かな",
    hiragana: "たしかな",
    sinhalaMeaning: "විශ්වාසවන්ත / ස්ථිර"
  },
  {
    id: "adj-na-28",
    type: "na",
    kanji: "適当な",
    hiragana: "てきとうな",
    sinhalaMeaning: "සුදුසු"
  },
  {
    id: "adj-na-29",
    type: "na",
    kanji: "不適当な",
    hiragana: "ふてきとうな",
    sinhalaMeaning: "නුසුදුසු"
  },
  {
    id: "adj-na-30",
    type: "na",
    kanji: "特別な",
    hiragana: "とくべつな",
    sinhalaMeaning: "විශේෂ"
  },
  {
    id: "adj-na-31",
    type: "na",
    kanji: "丁寧な",
    hiragana: "ていねいな",
    sinhalaMeaning: "ආචාරශීලී / පිළිවෙලකට ඇති"
  },
  {
    id: "adj-na-32",
    type: "na",
    kanji: "得意な",
    hiragana: "とくいな",
    sinhalaMeaning: "තමන් දක්ෂ විෂයයක්"
  },
  {
    id: "adj-na-33",
    type: "na",
    kanji: "熱心な",
    hiragana: "ねっしんな",
    sinhalaMeaning: "උනන්දුවක් දක්වන"
  },
  {
    id: "adj-na-34",
    type: "na",
    kanji: "賑やかな",
    hiragana: "にぎやかな",
    sinhalaMeaning: "ජනාකීර්ණ / ශබ්දය බහුල"
  },
  {
    id: "adj-na-35",
    type: "na",
    kanji: "苦手な",
    hiragana: "にがてな",
    sinhalaMeaning: "තමන් දුර්වල විෂයයක්"
  },
  {
    id: "adj-na-36",
    type: "na",
    kanji: "暇な",
    hiragana: "ひまな",
    sinhalaMeaning: "නිදහස් (වේලාව)"
  },
  {
    id: "adj-na-37",
    type: "na",
    kanji: "不便な",
    hiragana: "ふべんな",
    sinhalaMeaning: "අපහසු / ප්‍රයෝජනයක් නැති"
  },
  {
    id: "adj-na-38",
    type: "na",
    kanji: "下手な",
    hiragana: "へたな",
    sinhalaMeaning: "අදක්ෂ"
  },
  {
    id: "adj-na-39",
    type: "na",
    kanji: "複雑な",
    hiragana: "ふくざつな",
    sinhalaMeaning: "සංකීර්ණ"
  },
  {
    id: "adj-na-40",
    type: "na",
    kanji: "不思議な",
    hiragana: "ふしぎな",
    sinhalaMeaning: "අද්භੂත / පුදුම සහගත"
  },
  {
    id: "adj-na-41",
    type: "na",
    kanji: "不自由な",
    hiragana: "ふじゆうな",
    sinhalaMeaning: "අපහසුතා ඇති / නිදහස නැති"
  },
  {
    id: "adj-na-42",
    type: "na",
    kanji: "便利な",
    hiragana: "べんりな",
    sinhalaMeaning: "පහසු / ප්‍රයෝජනවත්"
  },
  {
    id: "adj-na-43",
    type: "na",
    kanji: "変な",
    hiragana: "へんな",
    sinhalaMeaning: "අමුතු"
  },
  {
    id: "adj-na-44",
    type: "na",
    kanji: "真面目な",
    hiragana: "まじめな",
    sinhalaMeaning: "කීකරු / අවංක / බැරෑරුම්"
  },
  {
    id: "adj-na-45",
    type: "na",
    kanji: "無理な",
    hiragana: "むりな",
    sinhalaMeaning: "කළ නොහැකි"
  },
  {
    id: "adj-na-46",
    type: "na",
    kanji: "有名な",
    hiragana: "ゆうめいな",
    sinhalaMeaning: "ප්‍රසිද්ධ"
  },
  {
    id: "adj-na-47",
    type: "na",
    kanji: "愉快な",
    hiragana: "ゆかいな",
    sinhalaMeaning: "ප්‍රීතිමත් / සතුටුදායක"
  },
  {
    id: "adj-na-48",
    type: "na",
    kanji: "豊かな",
    hiragana: "ゆたかな",
    sinhalaMeaning: "පොහොසත් / සාරවත්"
  },
  {
    id: "adj-na-49",
    type: "na",
    kanji: "立派な",
    hiragana: "りっぱな",
    sinhalaMeaning: "විශිෂ්ට / කැපී පෙනෙන"
  },
  {
    id: "adj-na-50",
    type: "na",
    kanji: "楽な",
    hiragana: "らくな",
    sinhalaMeaning: "පහසු / සුවපහසු"
  },
  {
    id: "adj-na-51",
    type: "na",
    kanji: "必要な",
    hiragana: "ひつような",
    sinhalaMeaning: "අවශ්‍ය"
  }
];
