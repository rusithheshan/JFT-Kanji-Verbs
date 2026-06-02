export interface ParagraphToken {
  id: string;
  text: string;
  kanji?: string;
  furigana?: string;
  type: "kanji" | "verb" | "adjective" | "particle" | "other";
  englishMeaning: string;
  sinhalaMeaning: string;
}

export interface JFTParagraph {
  id: string;
  titleSinhala: string;
  titleEnglish: string;
  tokens: ParagraphToken[];
  fullEnglishTranslation: string;
  fullSinhalaTranslation: string;
}

export const PRELOADED_PARAGRAPHS: JFTParagraph[] = [
  {
    id: "p-01",
    titleSinhala: "මාලිනීගේ දිනචරියාව (Daily Routine)",
    titleEnglish: "Malini's Daily Routine",
    fullEnglishTranslation: "I wake up early in the morning. After eating sushi, I go to work. Japan is very convenient.",
    fullSinhalaTranslation: "මම උදේම අවදි වෙමි. සුෂි අනුභව කිරීමෙන් පසු මම රැකියාවට යන්නෙමි. ජපානය ඉතා පහසුයි.",
    tokens: [
      { id: "t1-1", text: "朝", kanji: "朝", furigana: "あさ", type: "kanji", englishMeaning: "morning", sinhalaMeaning: "උදේ" },
      { id: "t1-2", text: "早く", furigana: "はやく", type: "other", englishMeaning: "early", sinhalaMeaning: "ඉක්මනින්" },
      { id: "t1-3", text: "起きて", kanji: "起きて", furigana: "おきて", type: "verb", englishMeaning: "wake up", sinhalaMeaning: "අවදි වී" },
      { id: "t1-4", text: "、", type: "other", englishMeaning: "", sinhalaMeaning: "" },
      { id: "t1-5", text: "すしを", type: "other", englishMeaning: "sushi", sinhalaMeaning: "සුෂි" },
      { id: "t1-6", text: "食べて", kanji: "食べて", furigana: "たべて", type: "verb", englishMeaning: "eat", sinhalaMeaning: "අනුභව කර" },
      { id: "t1-7", text: "から", type: "particle", englishMeaning: "after", sinhalaMeaning: "පසුව" },
      { id: "t1-8", text: "仕事へ", kanji: "仕事", furigana: "しごと", type: "kanji", englishMeaning: "job", sinhalaMeaning: "රැකියාවට" },
      { id: "t1-9", text: "行きます", kanji: "行きます", furigana: "いきます", type: "verb", englishMeaning: "go", sinhalaMeaning: "යනවා" },
      { id: "t1-10", text: "。", type: "other", englishMeaning: "", sinhalaMeaning: "" },
      { id: "t1-11", text: "日本", kanji: "日本", furigana: "にほん", type: "kanji", englishMeaning: "Japan", sinhalaMeaning: "ජපානය" },
      { id: "t1-12", text: "は", type: "particle", englishMeaning: "is/as for", sinhalaMeaning: "නම්" },
      { id: "t1-13", text: "とても", type: "other", englishMeaning: "very", sinhalaMeaning: "ඉතා" },
      { id: "t1-14", text: "便利です", kanji: "便利です", furigana: "べんりです", type: "adjective", englishMeaning: "convenient", sinhalaMeaning: "පහසුයි" },
      { id: "t1-15", text: "。", type: "other", englishMeaning: "", sinhalaMeaning: "" }
    ]
  },
  {
    id: "p-02",
    titleSinhala: "කෝපි හලක කතාබහක් (At the Coffee Shop)",
    titleEnglish: "A Chat at the Coffee Shop",
    fullEnglishTranslation: "Yesterday, I met my friend at a tea shop. We drank hot coffee and bought delicious bread.",
    fullSinhalaTranslation: "ඊයේ මම තේ පැන් හලකදී මගේ මිතුරා මුණගැසුණා. අපි උණුසුම් කෝපි පානය කර රසවත් පාන් මිලදී ගත්තෙමු.",
    tokens: [
      { id: "t2-1", text: "昨日", kanji: "昨日", furigana: "きのう", type: "kanji", englishMeaning: "yesterday", sinhalaMeaning: "ඊයේ" },
      { id: "t2-2", text: "、", type: "other", englishMeaning: "", sinhalaMeaning: "" },
      { id: "t2-3", text: "喫茶店で", kanji: "喫茶店", furigana: "きっさてん", type: "kanji", englishMeaning: "coffee shop", sinhalaMeaning: "තේ කෝපි හල" },
      { id: "t2-4", text: "友達に", kanji: "友達", furigana: "ともだち", type: "kanji", englishMeaning: "friend", sinhalaMeaning: "මිතුරා" },
      { id: "t2-5", text: "会いました", kanji: "会いました", furigana: "あいました", type: "verb", englishMeaning: "met", sinhalaMeaning: "මුණගැසුණා" },
      { id: "t2-6", text: "。", type: "other", englishMeaning: "", sinhalaMeaning: "" },
      { id: "t2-7", text: "温かい", kanji: "温かい", furigana: "あたたかい", type: "adjective", englishMeaning: "warm", sinhalaMeaning: "උණුසුම්" },
      { id: "t2-8", text: "コーヒーを", type: "other", englishMeaning: "coffee", sinhalaMeaning: "කෝපි" },
      { id: "t2-9", text: "飲んで", kanji: "飲んで", furigana: "のんで", type: "verb", englishMeaning: "drink", sinhalaMeaning: "පානය කර" },
      { id: "t2-10", text: "、", type: "other", englishMeaning: "", sinhalaMeaning: "" },
      { id: "t2-11", text: "美味しい", kanji: "美味しい", furigana: "おいしい", type: "adjective", englishMeaning: "delicious", sinhalaMeaning: "රසවත්" },
      { id: "t2-12", text: "パンを", type: "other", englishMeaning: "bread", sinhalaMeaning: "පාන්" },
      { id: "t2-13", text: "買いました", kanji: "買いました", furigana: "かいました", type: "verb", englishMeaning: "bought", sinhalaMeaning: "මිලදී ගත්තා" },
      { id: "t2-14", text: "。", type: "other", englishMeaning: "", sinhalaMeaning: "" }
    ]
  },
  {
    id: "p-03",
    titleSinhala: "ෆුජි කන්ද නැගීම (Climbing Mt. Fuji)",
    titleEnglish: "Climbing Mt. Fuji",
    fullEnglishTranslation: "Have you ever climbed Mt. Fuji? Yes, I have. Mt. Fuji is very high and cold, but truly beautiful.",
    fullSinhalaTranslation: "ඔබ කවදාහරි ෆුජි කන්ද නැග තිබේද? ඔව්, මම නැග තිබෙනවා. ෆුජි කන්ද ඉතා උස් හා සීතලයි, නමුත් සැබවින්ම ලස්සනයි.",
    tokens: [
      { id: "t3-1", text: "ふじ山に", kanji: "山", furigana: "やま", type: "kanji", englishMeaning: "mountain", sinhalaMeaning: "කන්ද" },
      { id: "t3-2", text: "登ったこと", kanji: "登ったこと", furigana: "のぼったこと", type: "verb", englishMeaning: "climbed", sinhalaMeaning: "නැගීම" },
      { id: "t3-3", text: "が", type: "particle", englishMeaning: "subject marker", sinhalaMeaning: "" },
      { id: "t3-4", text: "ありますか", type: "other", englishMeaning: "have you done?", sinhalaMeaning: "තිබේද?" },
      { id: "t3-5", text: "。はい、あります。", type: "other", englishMeaning: "yes", sinhalaMeaning: "ඔව්, තිබෙනවා." },
      { id: "t3-6", text: "ふじ山は", type: "other", englishMeaning: "Mt. Fuji", sinhalaMeaning: "ෆුජි කන්ද" },
      { id: "t3-7", text: "とても", type: "other", englishMeaning: "very", sinhalaMeaning: "ඉතා" },
      { id: "t3-8", text: "高いです", kanji: "高い", furigana: "たかい", type: "adjective", englishMeaning: "high / expensive", sinhalaMeaning: "උස්" },
      { id: "t3-9", text: "が", type: "particle", englishMeaning: "but", sinhalaMeaning: "නමුත්" },
      { id: "t3-10", text: "、そして", type: "other", englishMeaning: "and", sinhalaMeaning: "සහ" },
      { id: "t3-11", text: "綺麗です", kanji: "綺麗", furigana: "きれい", type: "adjective", englishMeaning: "beautiful / clean", sinhalaMeaning: "ලස්සනයි" },
      { id: "t3-12", text: "。", type: "other", englishMeaning: "", sinhalaMeaning: "" }
    ]
  },
  {
    id: "p-04",
    titleSinhala: "භාෂා පන්තියේදී (In the Language Class)",
    titleEnglish: "At the Language Class",
    fullEnglishTranslation: "In the Japanese class, you must not speak in Sinhalese. Let's write Kanji carefully with a pencil.",
    fullSinhalaTranslation: "ජපන් භාෂා පන්තියේදී සිංහලෙන් කතා නොකළ යුතුය. පැන්සලකින් ප්‍රවේශමෙන් කන්ජි ලියමු.",
    tokens: [
      { id: "t4-1", text: "日本語の", kanji: "日本語", furigana: "にほんご", type: "kanji", englishMeaning: "Japanese language", sinhalaMeaning: "ජපන් භාෂාව" },
      { id: "t4-2", text: "クラスで", type: "other", englishMeaning: "class", sinhalaMeaning: "පන්තියේදී" },
      { id: "t4-3", text: "シンハラ語で", type: "other", englishMeaning: "Sinhalese", sinhalaMeaning: "සිංහලෙන්" },
      { id: "t4-4", text: "話しては", kanji: "話しては", furigana: "はなしては", type: "verb", englishMeaning: "talk", sinhalaMeaning: "කතා කිරීම" },
      { id: "t4-5", text: "いけません", type: "other", englishMeaning: "must not do", sinhalaMeaning: "නොකළ යුතුය" },
      { id: "t4-6", text: "。", type: "other", englishMeaning: "", sinhalaMeaning: "" },
      { id: "t4-7", text: "鉛筆で", kanji: "鉛筆", furigana: "えんぴつ", type: "kanji", englishMeaning: "pencil", sinhalaMeaning: "පැන්සලෙන්" },
      { id: "t4-8", text: "漢字を", kanji: "漢字", furigana: "かんじ", type: "kanji", englishMeaning: "Kanji characters", sinhalaMeaning: "කන්ජි අකුරු" },
      { id: "t4-9", text: "丁寧に", type: "other", englishMeaning: "neatly", sinhalaMeaning: "ප්‍රවේශමෙන් / පිළිවෙලට" },
      { id: "t4-10", text: "書きます", kanji: "書きます", furigana: "かきます", type: "verb", englishMeaning: "write", sinhalaMeaning: "ලියන්නෙමු" },
      { id: "t4-11", text: "ましょう", type: "other", englishMeaning: "let's", sinhalaMeaning: "මු" },
      { id: "t4-12", text: "。", type: "other", englishMeaning: "", sinhalaMeaning: "" }
    ]
  },
  {
    id: "p-05",
    titleSinhala: "ක්ෂණික කාලගුණ වෙනස්වීම (Sudden Weather Change)",
    titleEnglish: "Sudden Weather Change",
    fullEnglishTranslation: "Yesterday, direct rain fell so I did not go to school. Today is very hot and the wind is strong.",
    fullSinhalaTranslation: "ඊයේ, වැස්ස වැටුණු නිසා මම පාසල් ගියේ නැත. අද ඉතා රස්නෙයි, ඒ වගේම හුළඟ සැරයි.",
    tokens: [
      { id: "t5-1", text: "昨日", kanji: "昨日", furigana: "きのう", type: "kanji", englishMeaning: "yesterday", sinhalaMeaning: "ඊයේ" },
      { id: "t5-2", text: "は", type: "particle", englishMeaning: "topic", sinhalaMeaning: "" },
      { id: "t5-3", text: "雨が", kanji: "雨", furigana: "あめ", type: "kanji", englishMeaning: "rain", sinhalaMeaning: "වැස්ස" },
      { id: "t5-4", text: "降りました", kanji: "降りました", furigana: "ふりました", type: "verb", englishMeaning: "fell (rain)", sinhalaMeaning: "වැටුණා" },
      { id: "t5-5", text: "から", type: "particle", englishMeaning: "because / so", sinhalaMeaning: "නිසා" },
      { id: "t5-6", text: "、学校へ", kanji: "学校", furigana: "がっこう", type: "kanji", englishMeaning: "school", sinhalaMeaning: "පාසලට" },
      { id: "t5-7", text: "行きませんでした", kanji: "行きませんでした", furigana: "いきませんでした", type: "verb", englishMeaning: "did not go", sinhalaMeaning: "ගියේ නැත" },
      { id: "t5-8", text: "。", type: "other", englishMeaning: "", sinhalaMeaning: "" },
      { id: "t5-9", text: "今日は", kanji: "今日", furigana: "きょう", type: "kanji", englishMeaning: "today", sinhalaMeaning: "අද" },
      { id: "t5-10", text: "とても", type: "other", englishMeaning: "very", sinhalaMeaning: "ඉතා" },
      { id: "t5-11", text: "暑い", kanji: "暑い", furigana: "あつい", type: "adjective", englishMeaning: "hot (weather)", sinhalaMeaning: "රස්නෙයි" },
      { id: "t5-12", text: "ですし、風も", kanji: "風", furigana: "かぜ", type: "kanji", englishMeaning: "wind", sinhalaMeaning: "හුළඟ" },
      { id: "t5-13", text: "荒いですね", kanji: "荒い", furigana: "あらい", type: "adjective", englishMeaning: "wild / rough", sinhalaMeaning: "සැරයි නේද" },
      { id: "t5-14", text: "。", type: "other", englishMeaning: "", sinhalaMeaning: "" }
    ]
  },
  {
    id: "p-06",
    titleSinhala: "නොමිලේ ලැබුණු පොතක් (Free Book)",
    titleEnglish: "A Book Borrowed",
    fullEnglishTranslation: "Because this book is not expensive, you do not have to pay money. Please read it neatly.",
    fullSinhalaTranslation: "මෙම පොත මිල අධික නොවන නිසා මුදල් ගෙවන්න අවශ්‍ය නැත. කරුණාකර එය පිළිවෙලට කියවන්න.",
    tokens: [
      { id: "t6-1", text: "この本は", kanji: "本", furigana: "ほん", type: "kanji", englishMeaning: "book", sinhalaMeaning: "පොත" },
      { id: "t6-2", text: "高くない", kanji: "高い", furigana: "たかくない", type: "adjective", englishMeaning: "not high/cheap", sinhalaMeaning: "මිල අධික නැත" },
      { id: "t6-3", text: "から、お金を", kanji: "お金", furigana: "おかね", type: "kanji", englishMeaning: "money", sinhalaMeaning: "මුදල්" },
      { id: "t6-4", text: "払わなくても", kanji: "払わなくても", furigana: "හරවනාකුතෙමො", type: "verb", englishMeaning: "don't have to pay", sinhalaMeaning: "ගෙවන්න අවශ්‍ය නැත" },
      { id: "t6-5", text: "いいです", type: "other", englishMeaning: "it is okay", sinhalaMeaning: "කමක් නැත" },
      { id: "t6-6", text: "。", type: "other", englishMeaning: "", sinhalaMeaning: "" },
      { id: "t6-7", text: "丁寧に", type: "other", englishMeaning: "neatly", sinhalaMeaning: "පිළිවෙලට/ප්‍රවේශමෙන්" },
      { id: "t6-8", text: "読んで", kanji: "読んで", furigana: "よんで", type: "verb", englishMeaning: "read", sinhalaMeaning: "කියවා" },
      { id: "t6-9", text: "ください", type: "other", englishMeaning: "please", sinhalaMeaning: "කරන්න" },
      { id: "t6-10", text: "。", type: "other", englishMeaning: "", sinhalaMeaning: "" }
    ]
  },
  {
    id: "p-07",
    titleSinhala: "නව මෝටර් රථයක් (A Brand New Car)",
    titleEnglish: "A Brand New Car",
    fullEnglishTranslation: "This white car looks very new. Because it was incredibly cheap, I bought it last week.",
    fullSinhalaTranslation: "මෙම සුදු පැහැති මෝටර් රථය ඉතා අලුත් වගේ පෙනෙනවා. එය අතිශයින්ම ලාභදායී වූ නිසා මම එය පසුගිය සතියේ මිලදී ගත්තෙමි.",
    tokens: [
      { id: "t7-1", text: "この", type: "other", englishMeaning: "this", sinhalaMeaning: "මෙම" },
      { id: "t7-2", text: "白い", kanji: "白い", furigana: "しろい", type: "adjective", englishMeaning: "white", sinhalaMeaning: "සුදු පැහැති" },
      { id: "t7-3", text: "車は", kanji: "車", furigana: "くるま", type: "kanji", englishMeaning: "car", sinhalaMeaning: "මෝටර් රථය" },
      { id: "t7-4", text: "とても", type: "other", englishMeaning: "very", sinhalaMeaning: "ඉතා" },
      { id: "t7-5", text: "新しそうです", kanji: "新しい", furigana: "あたらしそうです", type: "adjective", englishMeaning: "looks new", sinhalaMeaning: "අලුත් පාටයි / අලුත් වගේ පෙනෙනවා" },
      { id: "t7-6", text: "。", type: "other", englishMeaning: "", sinhalaMeaning: "" },
      { id: "t7-7", text: "安かった", kanji: "安い", furigana: "やすかった", type: "adjective", englishMeaning: "was cheap", sinhalaMeaning: "ලාභදායී වූ" },
      { id: "t7-8", text: "から、先週", kanji: "先週", furigana: "せんしゅう", type: "kanji", englishMeaning: "last week", sinhalaMeaning: "පසුගිය සතියේ" },
      { id: "t7-9", text: "買いました", kanji: "買いました", furigana: "かいました", type: "verb", englishMeaning: "bought", sinhalaMeaning: "මිලදී ගත්තා" },
      { id: "t7-10", text: "。", type: "other", englishMeaning: "", sinhalaMeaning: "" }
    ]
  }
];
