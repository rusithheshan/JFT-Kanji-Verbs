// Comprehensive Data Extracted Directly from:
// 農業技能測定試験 日本語テキスト にほんご 耕種農業/畜産農業 共通 (ජාතික කෘෂිකර්ම මණ්ඩලය - National Chamber of Agriculture)

export interface JapaneseVocabItem {
  id: string;
  wordJp: string;
  kanji?: string;
  romaji: string;
  meaningSi: string;
  category: "food" | "clothes_ppe" | "tools" | "places" | "health" | "body" | "family_people" | "time_weather" | "general_items" | "positions";
  pageInPdf: number;
  exampleSentenceJp?: string;
  exampleSentenceSi?: string;
}

export interface JapaneseVerbItem {
  id: string;
  masuForm: string;
  dictForm: string;
  kanji?: string;
  romaji: string;
  group: "G1" | "G2" | "G3";
  meaningSi: string;
  teForm: string;
  teKudasaiSi: string;
  naideForm: string;
  naideKudasaiSi: string;
  exampleJp: string;
  exampleSi: string;
  pageInPdf: number;
}

export interface JapaneseAdjItem {
  id: string;
  wordJp: string;
  kanji?: string;
  romaji: string;
  type: "i-adj" | "na-adj" | "adverb" | "color";
  meaningSi: string;
  oppositeJp?: string;
  oppositeSi?: string;
  exampleJp: string;
  exampleSi: string;
  pageInPdf: number;
}

export interface JapaneseExercise {
  id: string;
  exerciseNumber: string;
  pageInPdf: number;
  titleSi: string;
  instructionSi: string;
  dialogueJp?: string;
  dialogueSi?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanationSi: string;
}

// 1. Agricultural Nouns (නාමපද)
export const agriJapaneseNouns: JapaneseVocabItem[] = [
  // Farm Tools & Gear (කෘෂිකාර්මික මෙවලම් සහ යන්ත්‍ර)
  { id: "n_kuwa", wordJp: "くわ", kanji: "鍬", romaji: "kuwa", meaningSi: "උදැල්ල", category: "tools", pageInPdf: 18, exampleSentenceJp: "くわを もってきて ください。", exampleSentenceSi: "කරුණාකර උදැල්ලක් රැගෙන එන්න." },
  { id: "n_kama", wordJp: "かま", kanji: "鎌", romaji: "kama", meaningSi: "දෑකැත්ත", category: "tools", pageInPdf: 18, exampleSentenceJp: "この かまを かたづけて ください。", exampleSentenceSi: "කරුණාකර මේ දෑකැත්ත අස්කරන්න." },
  { id: "n_sukoppu", wordJp: "スコップ", romaji: "sukoppu", meaningSi: "සවල / බෝකු සවල", category: "tools", pageInPdf: 18, exampleSentenceJp: "スコップは どこに ありますか。", exampleSentenceSi: "සවල කොහේද තියෙන්නේ?" },
  { id: "n_baketsu", wordJp: "バケツ", romaji: "baketsu", meaningSi: "බාල්දිය", category: "tools", pageInPdf: 18, exampleSentenceJp: "バケツに みずを いれて ください。", exampleSentenceSi: "කරුණාකර බාල්දියට වතුර පුරවන්න." },
  { id: "n_torakutaa", wordJp: "トラクター", romaji: "torakutaa", meaningSi: "ට්‍රැක්ටරය", category: "tools", pageInPdf: 18, exampleSentenceJp: "トラクターで しごとを します。", exampleSentenceSi: "ට්‍රැක්ටරයෙන් වැඩ කරනවා." },
  { id: "n_ichirinsha", wordJp: "いちりんしゃ", kanji: "一輪車", romaji: "ichirinsha", meaningSi: "වීල්බැරෝව (තනි රෝද කරත්තය)", category: "tools", pageInPdf: 18, exampleSentenceJp: "いちりんしゃで はこんで ください。", exampleSentenceSi: "කරුණාකර වීල්බැරෝවෙන් ප්‍රවාහනය කරන්න." },
  { id: "n_hiryou", wordJp: "ひりょう", kanji: "肥料", romaji: "hiryou", meaningSi: "පොහොර", category: "tools", pageInPdf: 18, exampleSentenceJp: "これは やさいの ひりょうです。", exampleSentenceSi: "මේවා එළවළු සඳහා පොහොර වේ." },
  { id: "n_hasami", wordJp: "はさみ", kanji: "鋏", romaji: "hasami", meaningSi: "කතුර / කප්පාදු කතුර", category: "tools", pageInPdf: 20, exampleSentenceJp: "この はさみで きって ください。", exampleSentenceSi: "කරුණාකර මේ කතුරෙන් කපන්න." },
  { id: "n_teepu", wordJp: "テープ", romaji: "teepu", meaningSi: "පටිය / ටේප් පටිය", category: "tools", pageInPdf: 19, exampleSentenceJp: "しろい テープを つかいましょう。", exampleSentenceSi: "අපි සුදු පටිය භාවිතා කරමු." },
  { id: "n_hako", wordJp: "はこ", kanji: "箱", romaji: "hako", meaningSi: "පෙට්ටිය", category: "tools", pageInPdf: 19, exampleSentenceJp: "トマトの はこを もってきて ください。", exampleSentenceSi: "කරුණාකර තක්කාලි පෙට්ටියක් රැගෙන එන්න." },
  { id: "n_fukuro", wordJp: "ふくろ", kanji: "袋", romaji: "fukuro", meaningSi: "උරය / බෑගය", category: "tools", pageInPdf: 19, exampleSentenceJp: "これを ふくろに いれて ください。", exampleSentenceSi: "කරුණාකර මෙය උරයකට දමන්න." },

  // Farm Places & Structures (ස්ථාන සහ පරිශ්‍ර)
  { id: "n_tanbo", wordJp: "たんぼ", kanji: "田んぼ", romaji: "tanbo", meaningSi: "කුඹුර", category: "places", pageInPdf: 18, exampleSentenceJp: "ふゆは たんぼに みずが ありません。", exampleSentenceSi: "ශීත ඍතුවේදී කුඹුරු වල ජලය නැත." },
  { id: "n_hatake", wordJp: "はたけ", kanji: "畑", romaji: "hatake", meaningSi: "හේන / ගොඩ ඉඩම (එළවළු ක්ෂේත්‍රය)", category: "places", pageInPdf: 18, exampleSentenceJp: "１０じまで はたけで しごとを しました。", exampleSentenceSi: "10 වන තෙක් හේනේ වැඩ කළා." },
  { id: "n_hausu", wordJp: "ハウス", romaji: "hausu", meaningSi: "හරිතාගාරය (විනිල් පටලාගාරය)", category: "places", pageInPdf: 18, exampleSentenceJp: "ハウスの なかは さむく ないです。", exampleSentenceSi: "හරිතාගාරය ඇතුළත සීතල නැත." },
  { id: "n_tsuchi", wordJp: "つち", kanji: "土", romaji: "tsuchi", meaningSi: "පස / පස්", category: "places", pageInPdf: 18, exampleSentenceJp: "これは いい つちですね。", exampleSentenceSi: "මෙය ඉතා හොඳ පසකි." },
  { id: "n_souko", wordJp: "そうこ", kanji: "倉庫", romaji: "souko", meaningSi: "ගබඩාව", category: "places", pageInPdf: 18, exampleSentenceJp: "そうこから ひりょうを もってきて ください。", exampleSentenceSi: "ගබඩාවෙන් පොහොර රැගෙන එන්න." },

  // Farm Clothes & Safety PPE (වැඩ ඇඳුම් සහ ආරක්ෂක ආවරණ)
  { id: "n_sagyoufuku", wordJp: "さぎょうふく", kanji: "作業服", romaji: "sagyoufuku", meaningSi: "වැඩ ඇඳුම", category: "clothes_ppe", pageInPdf: 18, exampleSentenceJp: "さぎょうふくを せんたくしましたか。", exampleSentenceSi: "වැඩ ඇඳුම සේදුවාද?" },
  { id: "n_boushi", wordJp: "ぼうし", kanji: "帽子", romaji: "boushi", meaningSi: "තොප්පිය", category: "clothes_ppe", pageInPdf: 17, exampleSentenceJp: "ぼうしを かぶって ください。", exampleSentenceSi: "කරුණාකර තොප්පිය දාගන්න." },
  { id: "n_megane", wordJp: "めがね", kanji: "眼鏡", romaji: "megane", meaningSi: "ඇස් කණ්ණාඩි", category: "clothes_ppe", pageInPdf: 17, exampleSentenceJp: "めがねを かけて ください。", exampleSentenceSi: "කණ්ණාඩි පළඳින්න." },
  { id: "n_masuku", wordJp: "マスク", romaji: "masuku", meaningSi: "මුහුණු ආවරණය (මාස්ක්)", category: "clothes_ppe", pageInPdf: 17, exampleSentenceJp: "マスクを とらないで ください。", exampleSentenceSi: "කරුණාකර මාස්ක් එක ගලවන්න එපා." },
  { id: "n_tebukuro", wordJp: "てぶくろ", kanji: "手袋", romaji: "tebukuro", meaningSi: "අත්වැසුම්", category: "clothes_ppe", pageInPdf: 17, exampleSentenceJp: "あたらしい てぶくろを つかいましょう。", exampleSentenceSi: "අපි අලුත් අත්වැසුම් භාවිතා කරමු." },
  { id: "n_nagagutsu", wordJp: "ながぐつ", kanji: "長靴", romaji: "nagagutsu", meaningSi: "දිග බූට් සපත්තු", category: "clothes_ppe", pageInPdf: 17, exampleSentenceJp: "ここで ながぐつを ぬがないで ください。", exampleSentenceSi: "මෙතනදී බූට් සපත්තු ගලවන්න එපා." },
  { id: "n_herumetto", wordJp: "ヘルメット", romaji: "herumetto", meaningSi: "ආරක්ෂිත හිස්වැසුම (හෙල්මට්)", category: "clothes_ppe", pageInPdf: 39, exampleSentenceJp: "ヘルメットを かぶって ください。", exampleSentenceSi: "හෙල්මට් එක දාගන්න." },
  { id: "n_googuru", wordJp: "ゴーグル", romaji: "googuru", meaningSi: "ආරක්ෂක ඇස් ආවරණය (Goggles)", category: "clothes_ppe", pageInPdf: 39, exampleSentenceJp: "農薬の とき ゴーグルを かけます。", exampleSentenceSi: "පළිබෝධනාශක ඉසින විට ගොගල්ස් පළඳින්න." },

  // Food & Plants (ආහාර සහ බෝග)
  { id: "n_yasai", wordJp: "やさい", kanji: "野菜", romaji: "yasai", meaningSi: "එළවළු", category: "food", pageInPdf: 14, exampleSentenceJp: "おいしい やさいを つくりたいです。", exampleSentenceSi: "රසවත් එළවළු වගා කිරීමට අවශ්‍යයි." },
  { id: "n_kudamono", wordJp: "くだもの", kanji: "果物", romaji: "kudamono", meaningSi: "පළතුරු", category: "food", pageInPdf: 14, exampleSentenceJp: "あきの くだものが すきです。", exampleSentenceSi: "සරත් සෘතුවේ පළතුරු වලට මම කැමතියි." },
  { id: "n_tomato", wordJp: "トマト", romaji: "tomato", meaningSi: "තක්කාලි", category: "food", pageInPdf: 14, exampleSentenceJp: "あかい トマトを とりましょう。", exampleSentenceSi: "අපි රතු තක්කාලි කඩමු." },
  { id: "n_tamago", wordJp: "たまご", kanji: "卵", romaji: "tamago", meaningSi: "බිත්තර", category: "food", pageInPdf: 14, exampleSentenceJp: "たまごを ２こ だして ください。", exampleSentenceSi: "බිත්තර 2 ක් එළියට ගන්න." },
  { id: "n_ine", wordJp: "イネ", romaji: "ine", meaningSi: "ගොයම් ගස / වී පැලය", category: "food", pageInPdf: 5, exampleSentenceJp: "イネの そだちが いいです。", exampleSentenceSi: "ගොයම් පැල හොඳින් වැවී ඇත." },
  { id: "n_budou", wordJp: "ブドウ", romaji: "budou", meaningSi: "මිදි", category: "food", pageInPdf: 5, exampleSentenceJp: "ブドウの たねなしを つくります。", exampleSentenceSi: "බීජ රහිත මිදි සාදයි." },
  { id: "n_toumorokoshi", wordJp: "トウモロコシ", romaji: "toumorokoshi", meaningSi: "බඩ ඉරිඟු", category: "food", pageInPdf: 5, exampleSentenceJp: "トウモロコシを しゅうかくします。", exampleSentenceSi: "බඩ ඉරිඟු අස්වනු නෙළයි." },
  { id: "n_mizu", wordJp: "みず", kanji: "水", romaji: "mizu", meaningSi: "ජලය / වතුර", category: "food", pageInPdf: 15, exampleSentenceJp: "みずを たっぷり あげてください。", exampleSentenceSi: "ප්‍රමාණවත් තරම් වතුර දමන්න." },

  // Health & Accidents (සෞඛ්‍යය සහ අසනීප)
  { id: "n_byouki", wordJp: "びょうき", kanji: "病気", romaji: "byouki", meaningSi: "අසනීපය / රෝගය", category: "health", pageInPdf: 19, exampleSentenceJp: "もりさんは びょうきです。", exampleSentenceSi: "මෝරි මහතා අසනීපයෙන්." },
  { id: "n_netsu", wordJp: "ねつ", kanji: "熱", romaji: "netsu", meaningSi: "උණ", category: "health", pageInPdf: 19, exampleSentenceJp: "ねつが ３８ど あります。", exampleSentenceSi: "සෙන්ටිග්‍රේඩ් 38 ක උණක් ඇත." },
  { id: "n_kaze", wordJp: "かぜ", kanji: "風邪", romaji: "kaze", meaningSi: "හෙම්බිරිස්සාව / සෙම්ප්‍රතිශ්‍යාව", category: "health", pageInPdf: 19, exampleSentenceJp: "かぜで しごとを やすみました。", exampleSentenceSi: "සෙම්ප්‍රතිශ්‍යාව නිසා වැඩට නිවාඩු ගත්තා." },
  { id: "n_kusuri", wordJp: "くすり", kanji: "薬", romaji: "kusuri", meaningSi: "බෙහෙත් / ඖෂධ", category: "health", pageInPdf: 19, exampleSentenceJp: "この くすりを のんで ください。", exampleSentenceSi: "මේ බෙහෙත බොන්න." },

  // Spatial Positions (ස්ථාන පිහිටීම)
  { id: "n_ue", wordJp: "うえ", kanji: "上", romaji: "ue", meaningSi: "උඩ / මත", category: "positions", pageInPdf: 28, exampleSentenceJp: "つくえの うえに おいて ください。", exampleSentenceSi: "මේසය උඩින් තබන්න." },
  { id: "n_shita", wordJp: "した", kanji: "下", romaji: "shita", meaningSi: "යට / පහළ", category: "positions", pageInPdf: 28, exampleSentenceJp: "かいだんの したに あります。", exampleSentenceSi: "පඩිපෙළ යට තිබෙනවා." },
  { id: "n_mae", wordJp: "まえ", kanji: "前", romaji: "mae", meaningSi: "ඉදිරියෙන් / පෙර", category: "positions", pageInPdf: 28, exampleSentenceJp: "すーぱーの まえです。", exampleSentenceSi: "සුපිරි වෙළඳසැල ඉදිරිපිටයි." },
  { id: "n_ushiro", wordJp: "うしろ", kanji: "後ろ", romaji: "ushiro", meaningSi: "පිටුපස", category: "positions", pageInPdf: 28, exampleSentenceJp: "いすの うしろに あります。", exampleSentenceSi: "පුටුව පිටුපස ඇත." },
  { id: "n_naka", wordJp: "なか", kanji: "中", romaji: "naka", meaningSi: "ඇතුළත", category: "positions", pageInPdf: 28, exampleSentenceJp: "はこの なかを みて ください。", exampleSentenceSi: "පෙට්ටිය ඇතුළත බලන්න." },
  { id: "n_soto", wordJp: "そと", kanji: "外", romaji: "soto", meaningSi: "පිටත", category: "positions", pageInPdf: 28, exampleSentenceJp: "そとで しごとを します。", exampleSentenceSi: "පිටත වැඩ කරනවා." },
  { id: "n_hidari", wordJp: "ひだり", kanji: "左", romaji: "hidari", meaningSi: "වම", category: "positions", pageInPdf: 28, exampleSentenceJp: "ひだりを みて ください。", exampleSentenceSi: "වම් පැත්ත බලන්න." },
  { id: "n_migi", wordJp: "みぎ", kanji: "右", romaji: "migi", meaningSi: "දකුණ", category: "positions", pageInPdf: 28, exampleSentenceJp: "まどの みぎに あります。", exampleSentenceSi: "ජනේලයේ දකුණු පැත්තේ ඇත." }
];

// 2. Agricultural Workplace Verbs (ක්‍රියාපද 33)
export const agriJapaneseVerbs: JapaneseVerbItem[] = [
  {
    id: "v_ikimasu",
    masuForm: "いきます",
    dictForm: "いく",
    kanji: "行く",
    romaji: "ikimasu",
    group: "G1",
    meaningSi: "යනවා",
    teForm: "いって（ください）",
    teKudasaiSi: "යන්න",
    naideForm: "いかないで（ください）",
    naideKudasaiSi: "යන්න එපා",
    exampleJp: "あした はたけへ いきます。",
    exampleSi: "හෙට මම හේනට යනවා.",
    pageInPdf: 30
  },
  {
    id: "v_kimasu",
    masuForm: "きます",
    dictForm: "くる",
    kanji: "来る",
    romaji: "kimasu",
    group: "G3",
    meaningSi: "එනවා",
    teForm: "きて（ください）",
    teKudasaiSi: "එන්න",
    naideForm: "こないで（ください）",
    naideKudasaiSi: "එන්න එපා",
    exampleJp: "８じに ここへ きて ください。",
    exampleSi: "8 ට මෙතනට එන්න.",
    pageInPdf: 30
  },
  {
    id: "v_motteikimasu",
    masuForm: "もっていきます",
    dictForm: "もっていく",
    kanji: "持って行く",
    romaji: "motteikimasu",
    group: "G1",
    meaningSi: "රැගෙන යනවා",
    teForm: "もっていって（ください）",
    teKudasaiSi: "රැගෙන යන්න",
    naideForm: "もっていかないで（ください）",
    naideKudasaiSi: "රැගෙන යන්න එපා",
    exampleJp: "これ、外へ 持っていって。",
    exampleSi: "මෙය පිටතට රැගෙන යන්න.",
    pageInPdf: 30
  },
  {
    id: "v_mottekimasu",
    masuForm: "もってきます",
    dictForm: "もってくる",
    kanji: "持ってくる",
    romaji: "mottekimasu",
    group: "G3",
    meaningSi: "රැගෙන එනවා",
    teForm: "もってきて（ください）",
    teKudasaiSi: "රැගෙන එන්න",
    naideForm: "もってこないで（ください）",
    naideKudasaiSi: "රැගෙන එන්න එපා",
    exampleJp: "大きい バケツを 持ってきて。",
    exampleSi: "විශාල බාල්දියක් රැගෙන එන්න.",
    pageInPdf: 30
  },
  {
    id: "v_kaerimasu",
    masuForm: "かえります",
    dictForm: "かえる",
    kanji: "帰る",
    romaji: "kaerimasu",
    group: "G1",
    meaningSi: "ආපසු යනවා / නිවසට යනවා",
    teForm: "かえって（ください）",
    teKudasaiSi: "ආපසු යන්න",
    naideForm: "かえらないで（ください）",
    naideKudasaiSi: "ආපසු යන්න එපා",
    exampleJp: "森さんは うちへ 帰りました。",
    exampleSi: "මෝරි මහතා ගෙදර ගියා.",
    pageInPdf: 30
  },
  {
    id: "v_tsukaimasu",
    masuForm: "つかいます",
    dictForm: "つかう",
    kanji: "使う",
    romaji: "tsukaimasu",
    group: "G1",
    meaningSi: "භාවිතා කරනවා",
    teForm: "つかって（ください）",
    teKudasaiSi: "භාවිතා කරන්න",
    naideForm: "つかわないで（ください）",
    naideKudasaiSi: "භාවිතා කරන්න එපා",
    exampleJp: "この バケツは 使わないで。",
    exampleSi: "මේ බාල්දිය භාවිතා කරන්න එපා.",
    pageInPdf: 34
  },
  {
    id: "v_sawarimasu",
    masuForm: "さわります",
    dictForm: "さわる",
    kanji: "触る",
    romaji: "sawarimasu",
    group: "G1",
    meaningSi: "අල්ලනවා / ස්පර්ශ කරනවා",
    teForm: "さわって（ください）",
    teKudasaiSi: "අල්ලන්න",
    naideForm: "さわらないで（ください）",
    naideKudasaiSi: "අල්ලන්න එපා (අනතුරුදායකයි)",
    exampleJp: "あぶない。さわらないで。",
    exampleSi: "අනතුරුදායකයි. අල්ලන්න එපා.",
    pageInPdf: 34
  },
  {
    id: "v_arawimasu",
    masuForm: "あらいます",
    dictForm: "あらう",
    kanji: "洗う",
    romaji: "arawimasu",
    group: "G1",
    meaningSi: "සෝදනවා",
    teForm: "あらって（ください）",
    teKudasaiSi: "සෝදන්න",
    naideForm: "あらわないで（ください）",
    naideKudasaiSi: "සෝදන්න එපා",
    exampleJp: "ここで 手を 洗って ください。",
    exampleSi: "කරුණාකර මෙතනින් අත් සෝදන්න.",
    pageInPdf: 34
  },
  {
    id: "v_sutemasu",
    masuForm: "すてます",
    dictForm: "すてる",
    kanji: "捨てる",
    romaji: "sutemasu",
    group: "G2",
    meaningSi: "විසි කරනවා / අහක දමනවා",
    teForm: "すてて（ください）",
    teKudasaiSi: "විසි කරන්න",
    naideForm: "すてないで（ください）",
    naideKudasaiSi: "විසි කරන්න එපා",
    exampleJp: "ここに ゴミを すてないで。",
    exampleSi: "මෙතන කුණු දමන්න එපා.",
    pageInPdf: 34
  },
  {
    id: "v_katadukemasu",
    masuForm: "かたづけます",
    dictForm: "かたづける",
    kanji: "片付ける",
    romaji: "katadukemasu",
    group: "G2",
    meaningSi: "අස්පස් කරනවා / පිළිවෙලට තබනවා",
    teForm: "かたづけて（ください）",
    teKudasaiSi: "අස්පස් කරන්න",
    naideForm: "かたづけないで（ください）",
    naideKudasaiSi: "අස්පස් නොකර තබන්න",
    exampleJp: "かまを かたづけましたか。",
    exampleSi: "දෑකැත්ත අස්පස් කර තැබුවාද?",
    pageInPdf: 34
  },
  {
    id: "v_torimasu",
    masuForm: "とります",
    dictForm: "とる",
    kanji: "取る",
    romaji: "torimasu",
    group: "G1",
    meaningSi: "කඩනවා / ලබාගන්නවා",
    teForm: "とって（ください）",
    teKudasaiSi: "කඩන්න / ගන්න",
    naideForm: "とらないで（ください）",
    naideKudasaiSi: "කඩන්න එපා",
    exampleJp: "トマトは 手で とりますか。",
    exampleSi: "තක්කාලි කඩන්නේ අතින්ද?",
    pageInPdf: 35
  },
  {
    id: "v_kirimasu",
    masuForm: "きります",
    dictForm: "きる",
    kanji: "切る",
    romaji: "kirimasu",
    group: "G1",
    meaningSi: "කපනවා",
    teForm: "きって（ください）",
    teKudasaiSi: "කපන්න",
    naideForm: "きらないで（ください）",
    naideKudasaiSi: "කපන්න එපා",
    exampleJp: "この はさみで 切って。",
    exampleSi: "මේ කතුරෙන් කපන්න.",
    pageInPdf: 35
  },
  {
    id: "v_okimasu",
    masuForm: "おきます",
    dictForm: "おく",
    kanji: "置く",
    romaji: "okimasu",
    group: "G1",
    meaningSi: "තබනවා",
    teForm: "おいて（ください）",
    teKudasaiSi: "තබන්න",
    naideForm: "おかないで（ください）",
    naideKudasaiSi: "තබන්න එපා",
    exampleJp: "机の 上に 置いて ください。",
    exampleSi: "මේසය උඩින් තබන්න.",
    pageInPdf: 35
  },
  {
    id: "v_hakobimasu",
    masuForm: "はこびます",
    dictForm: "はこぶ",
    kanji: "運ぶ",
    romaji: "hakobimasu",
    group: "G1",
    meaningSi: "උස්සාගෙන යනවා / ප්‍රවාහනය කරනවා",
    teForm: "はこんで（ください）",
    teKudasaiSi: "ප්‍රවාහනය කරන්න",
    naideForm: "はこばないで（ください）",
    naideKudasaiSi: "ප්‍රවාහනය කරන්න එපා",
    exampleJp: "これを なかへ 運んで ください。",
    exampleSi: "මෙය ඇතුළට රැගෙන යන්න.",
    pageInPdf: 35
  },
  {
    id: "v_iremasu",
    masuForm: "いれます",
    dictForm: "いれる",
    kanji: "入れる",
    romaji: "iremasu",
    group: "G2",
    meaningSi: "ඇතුළට දමනවා",
    teForm: "いれて（ください）",
    teKudasaiSi: "ඇතුළට දමන්න",
    naideForm: "いれないで（ください）",
    naideKudasaiSi: "ඇතුළට දමන්න එපා",
    exampleJp: "はこの なかに 入れて ください。",
    exampleSi: "පෙට්ටිය ඇතුළට දමන්න.",
    pageInPdf: 36
  },
  {
    id: "v_dashimasu",
    masuForm: "だします",
    dictForm: "だす",
    kanji: "出す",
    romaji: "dashimasu",
    group: "G1",
    meaningSi: "එළියට ගන්නවා / ඉවතට ගන්නවා",
    teForm: "だして（ください）",
    teKudasaiSi: "එළියට ගන්න",
    naideForm: "ださないで（ください）",
    naideKudasaiSi: "එළියට ගන්න එපා",
    exampleJp: "はこの なかから 出して ください。",
    exampleSi: "පෙට්ටිය ඇතුළෙන් එළියට ගන්න.",
    pageInPdf: 36
  },
  {
    id: "v_nosemasu",
    masuForm: "のせます",
    dictForm: "のせる",
    kanji: "載せる",
    romaji: "nosemasu",
    group: "G2",
    meaningSi: "(වාහනයකට/තට්ටුවකට) පටවනවා / තබනවා",
    teForm: "のせて（ください）",
    teKudasaiSi: "පටවන්න",
    naideForm: "のせないで（ください）",
    naideKudasaiSi: "පටවන්න එපා",
    exampleJp: "トラックに 箱を のせて ください。",
    exampleSi: "ට්‍රක් රථයට පෙට්ටි පටවන්න.",
    pageInPdf: 36
  },
  {
    id: "v_oroshimasu",
    masuForm: "おろします",
    dictForm: "おろす",
    kanji: "降ろす",
    romaji: "oroshimasu",
    group: "G1",
    meaningSi: "(වාහනයෙන්/ඉහළින්) බිමට බානවා",
    teForm: "おろして（ください）",
    teKudasaiSi: "බිමට බාන්න",
    naideForm: "おろさないで（ください）",
    naideKudasaiSi: "බාන්න එපා",
    exampleJp: "２かいから 箱を おろしましょう。",
    exampleSi: "අපි දෙවන මහලෙන් පෙට්ටි බාමු.",
    pageInPdf: 36
  },
  {
    id: "v_kimasu_wear",
    masuForm: "きます",
    dictForm: "きる",
    kanji: "着る",
    romaji: "kimasu",
    group: "G2",
    meaningSi: "(කමිස/ඇඳුම්) අඳිනවා",
    teForm: "きて（ください）",
    teKudasaiSi: "අඳින්න",
    naideForm: "きないで（ください）",
    naideKudasaiSi: "අඳින්න එපා",
    exampleJp: "さぎょうふくを 着て 仕事を します。",
    exampleSi: "වැඩ ඇඳුම ඇඳලා වැඩ කරනවා.",
    pageInPdf: 38
  },
  {
    id: "v_kaburimasu",
    masuForm: "かぶります",
    dictForm: "かぶる",
    kanji: "被る",
    romaji: "kaburimasu",
    group: "G1",
    meaningSi: "(තොප්පි/හෙල්මට්) දාගන්නවා",
    teForm: "かぶって（ください）",
    teKudasaiSi: "දාගන්න",
    naideForm: "かぶらないで（ください）",
    naideKudasaiSi: "දාගන්න එපා",
    exampleJp: "帽子を かぶって ください。",
    exampleSi: "කරුණාකර තොප්පිය දාගන්න.",
    pageInPdf: 38
  },
  {
    id: "v_kakemasu",
    masuForm: "かけます",
    dictForm: "かける",
    kanji: "掛ける",
    romaji: "kakemasu",
    group: "G2",
    meaningSi: "(කණ්ණාඩි) පළඳිනවා",
    teForm: "かけて（ください）",
    teKudasaiSi: "පළඳින්න",
    naideForm: "かけないで（ください）",
    naideKudasaiSi: "පළඳින්න එපා",
    exampleJp: "めがねを かけましたか。",
    exampleSi: "කණ්ණාඩි දැම්මාද?",
    pageInPdf: 38
  },
  {
    id: "v_hakimasu",
    masuForm: "はきます",
    dictForm: "はく",
    kanji: "履く",
    romaji: "hakimasu",
    group: "G1",
    meaningSi: "(කලිසම්/සපත්තු) අඳිනවා/පළඳිනවා",
    teForm: "はいて（ください）",
    teKudasaiSi: "පළඳින්න",
    naideForm: "はかないで（ください）",
    naideKudasaiSi: "පළඳින්න එපා",
    exampleJp: "ここで 長靴を はかないで。",
    exampleSi: "මෙතනදී බූට් සපත්තු දාන්න එපා.",
    pageInPdf: 38
  },
  {
    id: "v_nugimasu",
    masuForm: "ぬぎます",
    dictForm: "ぬぐ",
    kanji: "脱ぐ",
    romaji: "nugimasu",
    group: "G1",
    meaningSi: "(ඇඳුම්/සපත්තු) ගලවනවා",
    teForm: "ぬいで（ください）",
    teKudasaiSi: "ගලවන්න",
    naideForm: "ぬがないで（ください）",
    naideKudasaiSi: "ගලවන්න එපා",
    exampleJp: "靴下を 脱いで ください。",
    exampleSi: "මේස් ගලවන්න.",
    pageInPdf: 38
  },
  {
    id: "v_hazushimasu",
    masuForm: "はずします",
    dictForm: "はずす",
    kanji: "外す",
    romaji: "hazushimasu",
    group: "G1",
    meaningSi: "(මාස්ක්/බෙල්ට්/කණ්ණාඩි) ගලවනවා/මුදාහරිනවා",
    teForm: "はずして（ください）",
    teKudasaiSi: "ගලවන්න",
    naideForm: "はずさないで（ください）",
    naideKudasaiSi: "ගලවන්න එපා",
    exampleJp: "マスクを はずさないで ください。",
    exampleSi: "මාස්ක් එක ගලවන්න එපා.",
    pageInPdf: 38
  },
  {
    id: "v_tsukemasu_light",
    masuForm: "つけます",
    dictForm: "つける",
    kanji: "付ける",
    romaji: "tsukemasu",
    group: "G2",
    meaningSi: "(විදුලි පහන්/ස්විචය) දමනවා (On)",
    teForm: "つけて（ください）",
    teKudasaiSi: "දමන්න (On කරන්න)",
    naideForm: "つけないで（ください）",
    naideKudasaiSi: "දමන්න එපා",
    exampleJp: "でんきを つけて ください。",
    exampleSi: "ලයිට් එක දමන්න.",
    pageInPdf: 35
  },
  {
    id: "v_keshimasu_light",
    masuForm: "けします",
    dictForm: "けす",
    kanji: "消す",
    romaji: "keshimasu",
    group: "G1",
    meaningSi: "(විදුලි පහන්/ගින්න) නිවනවා (Off)",
    teForm: "けして（ください）",
    teKudasaiSi: "නිවන්න (Off කරන්න)",
    naideForm: "けさないで（ください）",
    naideKudasaiSi: "නිවන්න එපා",
    exampleJp: "電気を 消しましょう。",
    exampleSi: "අපි ලයිට් නිවමු.",
    pageInPdf: 35
  },
  {
    id: "v_akemasu",
    masuForm: "あけます",
    dictForm: "あける",
    kanji: "開ける",
    romaji: "akemasu",
    group: "G2",
    meaningSi: "(දොර/ජනේල) අරිනවා (Open)",
    teForm: "あけて（ください）",
    teKudasaiSi: "අරින්න",
    naideForm: "あけないで（ください）",
    naideKudasaiSi: "අරින්න එපා",
    exampleJp: "窓を 開けて ください。",
    exampleSi: "ජනේලය අරින්න.",
    pageInPdf: 36
  },
  {
    id: "v_shimemasu",
    masuForm: "しめます",
    dictForm: "しめる",
    kanji: "閉める",
    romaji: "shimemasu",
    group: "G2",
    meaningSi: "(දොර/ජනේල) වහනවා (Close)",
    teForm: "しめて（ください）",
    teKudasaiSi: "වහන්න",
    naideForm: "しめないで（ください）",
    naideKudasaiSi: "වහන්න එපා",
    exampleJp: "ドアを 閉めましたか。",
    exampleSi: "දොර වැසුවාද?",
    pageInPdf: 36
  }
];

// 3. Adjectives & Modifiers (විශේෂණ සහ ප්‍රතිවිරුද්ධ පද)
export const agriJapaneseAdjectives: JapaneseAdjItem[] = [
  { id: "a_ookii", wordJp: "おおきい", kanji: "大きい", romaji: "ookii", type: "i-adj", meaningSi: "විශාලයි / ලොකුයි", oppositeJp: "ちいさい", oppositeSi: "කුඩායි", exampleJp: "この トマトは 大きいです。", exampleSi: "මේ තක්කාලි ලොකුයි.", pageInPdf: 42 },
  { id: "a_chiisai", wordJp: "ちいさい", kanji: "小さい", romaji: "chiisai", type: "i-adj", meaningSi: "කුඩායි / පොඩියි", oppositeJp: "おおきい", oppositeSi: "ලොකුයි", exampleJp: "小さい なすは 取らないで。", exampleSi: "පොඩි වම්බටු කඩන්න එපා.", pageInPdf: 42 },
  { id: "a_nagai", wordJp: "ながい", kanji: "長い", romaji: "nagai", type: "i-adj", meaningSi: "දිගයි", oppositeJp: "みじかい", oppositeSi: "කෙටියි", exampleJp: "この ベルトは 長いです。", exampleSi: "මේ පටිය දිගයි.", pageInPdf: 42 },
  { id: "a_mijikai", wordJp: "みじかい", kanji: "短い", romaji: "mijikai", type: "i-adj", meaningSi: "කෙටියි", oppositeJp: "ながい", oppositeSi: "දිගයි", exampleJp: "もっと 短く 切って ください。", exampleSi: "තවත් කොටට කපන්න.", pageInPdf: 42 },
  { id: "a_omoi", wordJp: "おもい", kanji: "重い", romaji: "omoi", type: "i-adj", meaningSi: "බරයි", oppositeJp: "かるい", oppositeSi: "සැහැල්ලුයි", exampleJp: "重い 箱は 二人で 運びましょう。", exampleSi: "බර පෙට්ටි දෙදෙනෙක් එක්ව ගෙනයමු.", pageInPdf: 42 },
  { id: "a_karui", wordJp: "かるい", kanji: "軽い", romaji: "karui", type: "i-adj", meaningSi: "සැහැල්ලුයි (බර අඩුයි)", oppositeJp: "おもい", oppositeSi: "බරයි", exampleJp: "この 箱は 軽いです。", exampleSi: "මේ පෙට්ටිය සැහැල්ලුයි.", pageInPdf: 42 },
  { id: "a_atarashii", wordJp: "あたらしい", kanji: "新しい", romaji: "atarashii", type: "i-adj", meaningSi: "අලුත්", oppositeJp: "ふるい", oppositeSi: "පරණ", exampleJp: "新しい 長靴を 買いました。", exampleSi: "අලුත් බූට් සපත්තු යුගලක් ගත්තා.", pageInPdf: 42 },
  { id: "a_furui", wordJp: "ふるい", kanji: "古い", romaji: "furui", type: "i-adj", meaningSi: "පරණයි", oppositeJp: "あたらしい", oppositeSi: "අලුත්", exampleJp: "古い 長靴を 捨てましょう。", exampleSi: "පරණ බූට් සපත්තු විසි කරමු.", pageInPdf: 42 },
  { id: "a_atsui", wordJp: "あつい", kanji: "暑い", romaji: "atsui", type: "i-adj", meaningSi: "රස්නෙයි / උණුසුම්", oppositeJp: "さむい", oppositeSi: "සීතලයි", exampleJp: "ハウスの 中は 暑いです。", exampleSi: "හරිතාගාරය ඇතුළ රස්නෙයි.", pageInPdf: 43 },
  { id: "a_samui", wordJp: "さむい", kanji: "寒い", romaji: "samui", type: "i-adj", meaningSi: "සීතලයි", oppositeJp: "あつい", oppositeSi: "රස්නෙයි", exampleJp: "外は とても 寒いです。", exampleSi: "එළිය ගොඩක් සීතලයි.", pageInPdf: 43 },
  { id: "a_abunai", wordJp: "あぶない", kanji: "危ない", romaji: "abunai", type: "i-adj", meaningSi: "අනතුරුදායකයි / පරිස්සමින්", exampleJp: "危ないから 触らないで。", exampleSi: "අනතුරුදායක නිසා අල්ලන්න එපා.", pageInPdf: 44 },
  { id: "a_oishii", wordJp: "おいしい", romaji: "oishii", type: "i-adj", meaningSi: "රසවත්", exampleJp: "とても おいしかったです。", exampleSi: "ඉතාමත් රසවත් වුණා.", pageInPdf: 44 },
  { id: "a_genki", wordJp: "げんき（な）", kanji: "元気", romaji: "genki", type: "na-adj", meaningSi: "සුවෙන් / නිරෝගී (නිරෝගී බීජ පැල)", exampleJp: "この 苗は 元気です。", exampleSi: "මේ බීජ පැලය නිරෝගීයි.", pageInPdf: 45 },
  { id: "a_kirei", wordJp: "きれい（な）", romaji: "kirei", type: "na-adj", meaningSi: "පිරිසිදු / ලස්සන", exampleJp: "きれいな トマトですね。", exampleSi: "ලස්සන පිරිසිදු තක්කාලි.", pageInPdf: 45 }
];

// 4. Question Words & Farm Workplace Instructions (ප්‍රශ්න කිරීම් සහ ආචාර සමාචාර)
export const agriJapaneseQuestionsAndManners = [
  { jp: "だれ (dare)", si: "කවුද?", exampleJp: "これは だれが つくりましたか。", exampleSi: "මේක කවුද හැදුවේ?" },
  { jp: "なに / なん (nani / nan)", si: "මොනවාද? / කුමක්ද?", exampleJp: "きのう なにを たべましたか。 / これは なんですか。", exampleSi: "ඊයේ මොනවද කෑවේ? / මේක මොකක්ද?" },
  { jp: "なんじ (nanji)", si: "කීයටද? / වේලාව කීයද?", exampleJp: "なんじに ここへ きましたか。", exampleSi: "ඔයා කීයටද මෙතනට ආවේ?" },
  { jp: "いつ (itsu)", si: "කවදාද?", exampleJp: "いつ ここへ きましたか。", exampleSi: "ඔබ මෙහි පැමිණියේ කවදාද?" },
  { jp: "いくら (ikura)", si: "මිල කීයද?", exampleJp: "これは いくらですか。", exampleSi: "මේක කීයද?" },
  { jp: "どこ (doko)", si: "කොහේද?", exampleJp: "この 箱は どこに 置きますか。", exampleSi: "මේ පෙට්ටිය කොහේද තියන්නේ?" },
  { jp: "どれ (dore)", si: "කොයි එකද? (3+ අතරින්)", exampleJp: "カイさんの かさは どれですか。", exampleSi: "කයි-සාන්, ඔයාගේ කුඩේ කොයි එකද?" },
  { jp: "どっち (docchi)", si: "කොයි එකද? / කොයි පැත්තද? (2ක් අතරින්)", exampleJp: "どっちの 足が 痛いですか。", exampleSi: "මොන කකුලද රිදෙන්නේ?" },
  { jp: "どんな (donna)", si: "කෙබඳුද? / මොන වගේද?", exampleJp: "どんな 野菜が 好きですか。", exampleSi: "මොන වගේ එළවළු වලටද කැමති?" },
  { jp: "どう (dou)", si: "කොහොමද?", exampleJp: "日本の 夏は どうですか。", exampleSi: "ජපානයේ ගිම්හානය කොහොමද?" },
  { jp: "どうして / なぜ (doushite / naze)", si: "ඇයි? / කුමන හේතුවක් නිසාද?", exampleJp: "どうして とうきょうへ いきたいですか。", exampleSi: "ඇයි ටෝකියෝ යන්න අවශ්‍ය?" }
];

export const agriJapaneseGreetings = [
  { jp: "おはよう（ございます）", romaji: "Ohayou gozaimasu", si: "සුබ උදෑසනක් (වැඩ ආරම්භයේදී)" },
  { jp: "こんにちは", romaji: "Konnichiwa", si: "සුබ දවසක් (දවල් කාලයේ ආචාරය)" },
  { jp: "こんばんは", romaji: "Konbanwa", si: "සුබ සැන්දෑවක් (අඳුරු වැටුණු පසු)" },
  { jp: "おやすみ（なさい）", romaji: "Oyasuminasai", si: "සුබ රාත්‍රියක් (නින්දට යාමට පෙර)" },
  { jp: "おつかれさま（でした）", romaji: "Otsukaresama deshita", si: "වෙහෙස මහන්සි වී වැඩ කළාට ස්තූතියි (වැඩ අවසානයේ අනිවාර්යයෙන්ම පවසයි)" },
  { jp: "しつれいします", romaji: "Shitsurei shimasu", si: "සමාවෙන්න / අවසරයි (කාමරයකට ඇතුළු වන විට හෝ වැඩ නිමවී පිටවන විට)" },
  { jp: "ありがとう（ございます）", romaji: "Arigatou gozaimasu", si: "බොහොම ස්තූතියි" },
  { jp: "すみません", romaji: "Sumimasen", si: "සමාවෙන්න (වරදක් වූ විට හෝ අවධානය ලබා ගැනීමට)" },
  { jp: "いただきます", romaji: "Itadakimasu", si: "ආහාර ගැනීමට පෙර ගෞරවයෙන් පවසන වදන" },
  { jp: "ごちそうさま（でした）", romaji: "Gochisousama deshita", si: "ආහාර ගෙන අවසන් වූ විට පවසන වදන" }
];
