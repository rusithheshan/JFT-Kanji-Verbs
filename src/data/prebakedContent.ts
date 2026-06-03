import { JFTParagraph, ParagraphToken } from "./paragraphTemplates";

const NAMES = ["Raju", "Malini", "Kamal", "Nimal", "Sunil", "Samantha", "Chathuri", "Amara", "Roshan", "Ruwan"];
const NAMES_JP = ["ラジュ", "マリーニ", "カマル", "ニマル", "スニル", "サマンサ", "チャトゥリ", "アマラ", "ロシャン", "ルワン"];
const NAMES_SI = ["රජු", "මාලිනී", "කමල්", "නිමල්", "සුනිල්", "සමන්ත", "චතුරි", "අමරා", "රොෂාන්", "රුවන්"];

const TIMES_JP = ["朝", "昼", "夜", "今日", "昨日", "先週", "先月", "いつも", "明日", "週末"];
const TIMES_FURIGANA = ["あさ", "ひる", "よる", "きょう", "きのう", "せんしゅう", "せんげつ", "いつも", "あした", "しゅうまつ"];
const TIMES_EN = ["morning", "noon", "night", "today", "yesterday", "last week", "last month", "always", "tomorrow", "weekend"];
const TIMES_SI = ["උදෑසන", "දවල් කාලයේ", "රාත්‍රියේ", "අද", "ඊයේ", "පසුගිය සතියේ", "පසුගිය මාසයේ", "සෑමවිටම", "හෙට", "සති අන්තයේ"];

const FOOD_JP = ["お寿司", "天ぷら", "お弁当", "うどん", "ラーメン", "カレー", "たこ焼き", "おにぎり", "焼き鳥", "お好み焼き"];
const FOOD_FURIGANA = ["おすし", "てんぷら", "おべんとう", "うどん", "らーめん", "かれー", "たこやき", "おにぎり", "やきとり", "おこのみやき"];
const FOOD_EN = ["Sushi", "Tempura", "Bento Box", "Udon Noodles", "Ramen Noodles", "Curry Rice", "Takoyaki", "Onigiri", "Yakitori", "Okonomiyaki"];
const FOOD_SI = ["සුෂි", "ටෙම්පුරා", "බෙන්තෝ කෑම පෙට්ටිය", "උදොන් නූඩ්ල්ස්", "රාමෙන් නූඩ්ල්ස්", "කරී රයිස්", "තකොයකි (බෝල)", "ඔනිගිරි (බත් බෝල)", "යකිතොරි (කුකුළු මස්)", "ඔකොනොමියාකි ජපන් පෑන්කේක්"];

const ADJECTIVE_JP = ["美味しい", "温かい", "冷たい", "甘い", "辛い", "安い", "高い", "新鮮な", "珍しい", "素晴らしい"];
const ADJECTIVE_FURIGANA = ["おいしい", "あたたかい", "つめたい", "あまい", "からい", "やすい", "たかい", "しんせんな", "めずらしい", "すばらしい"];
const ADJECTIVE_EN = ["delicious", "warm", "cold", "sweet", "spicy", "cheap", "expensive", "fresh", "rare/special", "wonderful"];
const ADJECTIVE_SI = ["රසවත්", "උණුසුම්", "සීතල", "පැණිරස", "සැර", "ලාභදායී", "මිල අධික", "අලුත්ම/නැවුම්", "කලාතුරකින් ලැඛෙන", "අතිවිශිෂ්ට"];

const ITEM_JP = ["服", "靴", "鞄", "傘", "辞書", "ノート", "時計", "帽子", "お土産", "本"];
const ITEM_FURIGANA = ["ふく", "くつ", "かばん", "かさ", "じしょ", "のーと", "とけい", "ぼうし", "おみやげ", "ほん"];
const ITEM_EN = ["clothes", "shoes", "bag", "umbrella", "dictionary", "notebook", "watch", "hat", "souvenir", "book"];
const ITEM_SI = ["ඇඳුමක්", "සපත්තු යුගලක්", "බෑග් එකක්", "කුඩයක්", "ශබ්දකෝෂයක්", "සටහන් පොතක්", "ඔරලෝසුවක්", "තොප්පියක්", "සමරු තිළිණයක්", "පොතක්"];

const LOCATION_JP = ["レストラン", "食堂", "喫茶店", "居酒屋", "スーパー", "カフェ", "ホテル", "デパート", "実家", "友達の家"];
const LOCATION_FURIGANA = ["れすとらん", "しょくどう", "きっさてん", "いざかや", "すーぱー", "かふぇ", "ほてる", "でぱーと", "じっか", "ともだちのいえ"];
const LOCATION_EN = ["Restaurant", "Shokudo Diner", "Kissaten Coffee Shop", "Izakaya Pub", "Supermarket", "Cafe", "Hotel", "Department Store", "Parents' Home", "Friend's House"];
const LOCATION_SI = ["ආපනශාලාව (Restaurant)", "භෝජන ශාලාව (Shokudo)", "තේ කෝපි හල (Kissaten)", "ජපන් බාර් එක (Izakaya)", "සුපිරි වෙළඳසැල (Supermarket)", "කැෆේ එක (Cafe)", "හෝටලය (Hotel)", "සුපිරි වෙළඳ සංකීර්ණය (Depato)", "මව්පියන්ගේ නිවස (Jikka)", "මිතුරාගේ නිවස"];

const FEATURE_JP = ["桜の花", "ひまわり", "紅葉の葉", "白い雪", "バラの花", "チューリップ", "青い空", "山の景色", "庭の花", "緑の木々"];
const FEATURE_FURIGANA = ["さくらのはな", "ひまわり", "もみじのは", "しろいゆき", "ばらのはな", "ちゅーりっぷ", "あおいそら", "やまのけしき", "にわのはな", "みどりのきぎ"];
const FEATURE_EN = ["cherry blossoms", "sunflowers", "autumn maple leaves", "white snow", "roses", "tulips", "blue sky", "mountain scenery", "garden flowers", "green trees"];
const FEATURE_SI = ["සකුරා මල්", "සූරියකාන්ත මල්", "රතු පැහැති කොළ (Momiji)", "සුදු හිම", "රෝස මල්", "ටියුලිප් මල්", "නිල් අහස", "කඳුකර දර්ශන", "කොළ පැහැති തණකොළ", "හරිත වර්ණ ගස්"];

const SEASON_JP = ["春", "夏", "秋", "冬", "雨の季節", "晴れの日", "風の日", "雪の季節", "涼しい秋", "温かい春"];
const SEASON_FURIGANA = ["はる", "なつ", "あき", "ふゆ", "あめのきせつ", "はれのひ", "かぜのひ", "ゆきのきせつ", "すずしいあき", "あたたかいはる"];
const SEASON_EN = ["Spring", "Summer", "Autumn", "Winter", "Rainy Season", "Sunny Day", "Windy Day", "Snowy Season", "Cool Autumn", "Warm Spring"];
const SEASON_SI = ["වසන්ත (Spring)", "ගිම්හාන (Summer)", "ශරත් (Autumn)", "ශීත (Winter)", "වැසි කාලය", "පෑයූ දවසක්", "සුළං සහිත දවසක්", "හිම කාලය", "සිසිල් ශරත් කාලය", "උණුසුම් වසන්ත කාලය"];

const DESTINATION_JP = ["東京", "京都", "大阪", "北海道", "沖縄", "富士山", "奈良", "広島", "福岡", "名古屋"];
const DESTINATION_FURIGANA = ["とうきょう", "きょうと", "おおさか", "ほっかいどう", "おきなわ", "ふじさん", "なら", "ひろしま", "ふくおか", "なごや"];
const DESTINATION_EN = ["Tokyo", "Kyoto", "Osaka", "Hokkaido", "Okinawa", "Mt. Fuji", "Nara", "Hiroshima", "Fukuoka", "Nagoya"];
const DESTINATION_SI = ["ටෝකියෝ", "කියෝතෝ", "ඔසාකා", "හොක්කයිදෝ", "ඔකිනාවා", "ෆුජි කන්ද", "නාරා", "හිරෝෂිමා", "ෆුකුඕකා", "නගෝයා"];

const TRANSPORT_JP = ["新幹線", "電車", "バス", "タクシー", "飛行機", "自転車", "地下鉄", "船", "車", "特急電車"];
const TRANSPORT_FURIGANA = ["しんかんせん", "でんしゃ", "ばす", "たくしー", "ひこうき", "じてんしゃ", "ちかてつ", "ふね", "くるま", "とっきゅうでんしゃ"];
const TRANSPORT_EN = ["Shinkansen (Bullet Train)", "Train", "Bus", "Taxi", "Airplane", "Bicycle", "Subway", "Ship", "Car", "Limited Express Train"];
const TRANSPORT_SI = ["ෂින්කන්සෙන් අධිවේගී දුම්රිය", "සාමාන්‍ය දුම්රිය", "බස් රථය", "ටැක්සිය", "ගුවන් යානය", "පාපැදිය", "භූගත දුම්රිය (Subway)", "නෞකාව", "මෝටර් රථය", "සීඝ්‍රගාමී දුම්රිය"];

const HOBBY_JP = ["ピアノ", "サッカー", "絵描き", "ギター", "カメラ", "ダンス", "水泳", "料理", "テニス", "カラオケ"];
const HOBBY_FURIGANA = ["ぴあの", "さっかー", "えかき", "ぎたー", "かめら", "だんす", "すいえい", "りょうり", "てにす", "からおけ"];
const HOBBY_EN = ["Piano", "Soccer", "Drawing", "Guitar", "Photography", "Dance", "Swimming", "Cooking", "Tennis", "Karaoke"];
const HOBBY_SI = ["පියානෝ වාදනය", "පාපන්දු ක්‍රීඩාව", "චිත්‍ර ඇඳීම", "ගිටාර් වාදනය", "ඡායාරූපකරණය", "නර්තනය", "පිහිනීම", "කෑම පිසීම", "ටෙනිස් ක්‍රීඩාව", "කැරෝකී ගීත ගැයීම"];

const TOPIC_JP = ["生活", "交通", "天候", "仕事", "買い物", "旅行", "健康", "趣味", "食べ物", "家族"];
const TOPIC_FURIGANA = ["せいかつ", "こうつう", "てんこう", "しごと", "かいもの", "りょこう", "けんこう", "しゅみ", "たべもの", "かぞく"];
const TOPIC_EN = ["daily life", "traffic/transportation", "weather", "work duties", "shopping habits", "travel plans", "health rules", "hobbies", "food culture", "family members"];
const TOPIC_SI = ["දෛනික ජීවිතය", "ප්‍රවාහනය", "කාලගුණය", "රැකියා රාජකාරි", "සාප්පු සවාරි", "සංචාරක සැලසුම්", "සෞඛ්‍ය තොරතුරු", "විනෝදාංශ", "ආහාර සංස්කෘතිය", "පවුලේ සාමාජිකයන්"];

export function get1000Paragraphs(): JFTParagraph[] {
  const result: JFTParagraph[] = [];

  for (let idx = 0; idx < 1000; idx++) {
    const themeIdx = idx % 10;
    const variantIdx = Math.floor(idx / 10);

    const name = NAMES[variantIdx % 10];
    const nameJP = NAMES_JP[variantIdx % 10];
    const nameSI = NAMES_SI[variantIdx % 10];

    const timeJP = TIMES_JP[(variantIdx + themeIdx) % 10];
    const timeFurigana = TIMES_FURIGANA[(variantIdx + themeIdx) % 10];
    const timeEN = TIMES_EN[(variantIdx + themeIdx) % 10];
    const timeSI = TIMES_SI[(variantIdx + themeIdx) % 10];

    const foodJP = FOOD_JP[(variantIdx * 3 + themeIdx) % 10];
    const foodFurigana = FOOD_FURIGANA[(variantIdx * 3 + themeIdx) % 10];
    const foodEN = FOOD_EN[(variantIdx * 3 + themeIdx) % 10];
    const foodSI = FOOD_SI[(variantIdx * 3 + themeIdx) % 10];

    const adjJP = ADJECTIVE_JP[(variantIdx * 7 + themeIdx) % 10];
    const adjFurigana = ADJECTIVE_FURIGANA[(variantIdx * 7 + themeIdx) % 10];
    const adjEN = ADJECTIVE_EN[(variantIdx * 7 + themeIdx) % 10];
    const adjSI = ADJECTIVE_SI[(variantIdx * 7 + themeIdx) % 10];

    const locationJP = LOCATION_JP[(variantIdx * 4 + themeIdx) % 10];
    const locationFuri = LOCATION_FURIGANA[(variantIdx * 4 + themeIdx) % 10];
    const locationEN = LOCATION_EN[(variantIdx * 4 + themeIdx) % 10];
    const locationSI = LOCATION_SI[(variantIdx * 4 + themeIdx) % 10];

    let titleEN = "";
    let titleSI = "";
    let textJP = "";
    let textEN = "";
    let textSI = "";
    let tokens: ParagraphToken[] = [];
    let questions: any[] = [];

    if (themeIdx === 0) {
      // 0. Dining Out
      titleEN = `${name}'s Delicious Meal (No. ${idx + 1})`;
      titleSI = `${nameSI} ගේ ප්‍රණීත කෑම වේල (අංක ${idx + 1})`;
      textJP = `${nameJP}さんは${timeJP}に、${adjJP}${foodJP}をたくさん食べました。とても美味しかったので、${locationJP}にまた行きたいです。`;
      textEN = `Mr/Ms ${name} ate a lot of ${adjEN} ${foodEN} in the ${timeEN}. Since it was very delicious, they want to go to the ${locationEN} again.`;
      textSI = `${nameSI} මහතා/මහත්මිය ${timeSI} දී ඉතා ${adjSI} ${foodSI} විශාල ප්‍රමාණයක් අනුභව කළේය. එය ඉතා රසවත් වූ බැවින් නැවතත් ${locationSI} වෙත යාමට බලාපොරොත්තු වේ.`;

      tokens = [
        { id: `t-${idx}-1`, text: nameJP, kanji: nameJP, type: "other", englishMeaning: name, sinhalaMeaning: nameSI },
        { id: `t-${idx}-2`, text: "さん", type: "other", englishMeaning: "Mr./Ms.", sinhalaMeaning: "මහතා/මහත්මිය" },
        { id: `t-${idx}-3`, text: "は", type: "particle", englishMeaning: "topic marker", sinhalaMeaning: "" },
        { id: `t-${idx}-4`, text: timeJP, kanji: timeJP, furigana: timeFurigana, type: "kanji", englishMeaning: timeEN, sinhalaMeaning: timeSI },
        { id: `t-${idx}-5`, text: "に、", type: "other", englishMeaning: "at/during", sinhalaMeaning: "දී" },
        { id: `t-${idx}-6`, text: adjJP, kanji: adjJP, furigana: adjFurigana, type: "adjective", englishMeaning: adjEN, sinhalaMeaning: adjSI },
        { id: `t-${idx}-7`, text: foodJP, kanji: foodJP, furigana: foodFurigana, type: "kanji", englishMeaning: foodEN, sinhalaMeaning: foodSI },
        { id: `t-${idx}-8`, text: "をたくさん", type: "other", englishMeaning: "a lot of", sinhalaMeaning: "විශාල ප්‍රමාණයක්" },
        { id: `t-${idx}-9`, text: "食べました。", furigana: "たべました", type: "verb", englishMeaning: "ate", sinhalaMeaning: "අනුභව කළා" },
        { id: `t-${idx}-10`, text: "とても", type: "other", englishMeaning: "very", sinhalaMeaning: "ඉතා" },
        { id: `t-${idx}-11`, text: "美味しかったので、", furigana: "おいしかったので", type: "adjective", englishMeaning: "since it was delicious", sinhalaMeaning: "රසවත් වූ බැවින්" },
        { id: `t-${idx}-12`, text: locationJP, kanji: locationJP, furigana: locationFuri, type: "kanji", englishMeaning: locationEN, sinhalaMeaning: locationSI },
        { id: `t-${idx}-13`, text: "にまた", type: "other", englishMeaning: "again to", sinhalaMeaning: "නැවතත්" },
        { id: `t-${idx}-14`, text: "行きたいです。", furigana: "いきたいです", type: "verb", englishMeaning: "want to go", sinhalaMeaning: "යාමට අවශ්‍යයි" }
      ];

      questions = [
        {
          id: `q-${idx}-1`,
          questionJapanese: `${nameJP}さんは何を食べましたか。`,
          options: [foodJP, "りんご (Apple)", "魚 (Fish)", "パン (Bread)"],
          correctOptionKey: "a",
          explanationSinhala: `ඡේදයේ සඳහන් වන පරිදි ${nameSI} මහතා අනුභව කළේ ${foodSI} (${foodJP}) වේ.`
        },
        {
          id: `q-${idx}-2`,
          questionJapanese: `いつ食べましたか。`,
          options: ["明日 (Tomorrow)", timeJP, "来月 (Next Month)", "朝早く (Early Morning)"],
          correctOptionKey: "b",
          explanationSinhala: `ඔහු ආහාරය අනුභව කරන ලද්දේ ${timeSI} (${timeJP}) දීය.`
        },
        {
          id: `q-${idx}-3`,
          questionJapanese: `食べ物の味はどうでしたか。`,
          options: ["辛かった (Spicy)", "冷たかった (Cold)", adjJP, "不味かった (Awful)"],
          correctOptionKey: "c",
          explanationSinhala: `ආහාරයේ රසය ${adjSI} (${adjJP}) ලෙස ඡේදයේ පැහැදිලිව සඳහන් වේ.`
        },
        {
          id: `q-${idx}-4`,
          questionJapanese: `どこにまた行きたいですか。`,
          options: [locationJP, "駅 (Station)", "学校 (School)", "公園 (Park)"],
          correctOptionKey: "a",
          explanationSinhala: `ඔහුට නැවතත් ${locationSI} (${locationJP}) වෙත යාමට අවශ්‍ය බව පවසා ඇත.`
        },
        {
          id: `q-${idx}-5`,
          questionJapanese: `「たくさん」の意味は何ですか。`,
          options: ["少し (A little)", "多い (A lot/Many)", "全然 (Not at all)", "早い (Early)"],
          correctOptionKey: "b",
          explanationSinhala: `「たくさん」 යන්නෙහි තේරුම ගොඩක්, විශාල ප්‍රමාණයක් ("多い") යන්නයි.`
        }
      ];

    } else if (themeIdx === 1) {
      // 1. Shopping
      const itemJP = ITEM_JP[(variantIdx * 5 + themeIdx) % 10];
      const itemFuri = ITEM_FURIGANA[(variantIdx * 5 + themeIdx) % 10];
      const itemEN = ITEM_EN[(variantIdx * 5 + themeIdx) % 10];
      const itemSI = ITEM_SI[(variantIdx * 5 + themeIdx) % 10];
      const price = 1000 + variantIdx * 450;

      titleEN = `${name}'s Smart Shopping (No. ${idx + 1})`;
      titleSI = `${nameSI} ගේ සාප්පු සවාරිය (අංක ${idx + 1})`;
      textJP = `${nameJP}さんは${timeJP}に、${locationJP}で${adjJP}${itemJP}を買いました。合計は${price}円でした。とても安いです。`;
      textEN = `Mr/Ms ${name} bought a ${adjEN} ${itemEN} at the ${locationEN} in the ${timeEN}. The total was ${price} yen. It is very cheap.`;
      textSI = `${nameSI} මහතා/මහත්මිය ${timeSI} දී ${locationSI} වෙතින් ${adjSI} ${itemSI} මිලදී ගත්තේය. මුළු වටිනාකම යෙන් ${price} විය. එය ඉතාමත් ලාභදායී වේ.`;

      tokens = [
        { id: `t-${idx}-1`, text: nameJP, kanji: nameJP, type: "other", englishMeaning: name, sinhalaMeaning: nameSI },
        { id: `t-${idx}-2`, text: "さん", type: "other", englishMeaning: "Mr./Ms.", sinhalaMeaning: "මහතා/මහත්මිය" },
        { id: `t-${idx}-3`, text: "は", type: "particle", englishMeaning: "topic marker", sinhalaMeaning: "" },
        { id: `t-${idx}-4`, text: timeJP, kanji: timeJP, furigana: timeFurigana, type: "kanji", englishMeaning: timeEN, sinhalaMeaning: timeSI },
        { id: `t-${idx}-5`, text: "に、", type: "other", englishMeaning: "at/during", sinhalaMeaning: "දී" },
        { id: `t-${idx}-6`, text: locationJP, kanji: locationJP, furigana: locationFuri, type: "kanji", englishMeaning: locationEN, sinhalaMeaning: locationSI },
        { id: `t-${idx}-7`, text: "で、", type: "other", englishMeaning: "at", sinhalaMeaning: "හිදී" },
        { id: `t-${idx}-8`, text: adjJP, kanji: adjJP, furigana: adjFurigana, type: "adjective", englishMeaning: adjEN, sinhalaMeaning: adjSI },
        { id: `t-${idx}-9`, text: itemJP, kanji: itemJP, furigana: itemFuri, type: "kanji", englishMeaning: itemEN, sinhalaMeaning: itemSI },
        { id: `t-${idx}-10`, text: "を買いました。", furigana: "をかいました", type: "verb", englishMeaning: "bought", sinhalaMeaning: "මිලදී ගත්තා" },
        { id: `t-${idx}-11`, text: "合計は", furigana: "ごうけいは", type: "other", englishMeaning: "total cost", sinhalaMeaning: "එකතුව" },
        { id: `t-${idx}-12`, text: `${price}円`, type: "other", englishMeaning: `${price} Yen`, sinhalaMeaning: `යෙන් ${price}` },
        { id: `t-${idx}-13`, text: "でした。とても安いです。", furigana: "やすいいです", type: "other", englishMeaning: "was. Very cheap.", sinhalaMeaning: "විය. ගොඩක් ලාභයි." }
      ];

      questions = [
        {
          id: `q-${idx}-1`,
          questionJapanese: `${nameJP}さんはどこで買い物をしましたか。`,
          options: ["駅 (Station)", "学校 (School)", locationJP, "公園 (Park)"],
          correctOptionKey: "c",
          explanationSinhala: `සාප්පු සවාරිය සිදු කළේ ${locationSI} (${locationJP}) හිදීය.`
        },
        {
          id: `q-${idx}-2`,
          questionJapanese: `何を買いましたか。`,
          options: ["本 (Book)", itemJP, "自転車 (Bicycle)", "靴下 (Socks)"],
          correctOptionKey: "b",
          explanationSinhala: `මිලදී ගත් භාණ්ඩය වන්නේ ${itemSI} (${itemJP}) ය.`
        },
        {
          id: `q-${idx}-3`,
          questionJapanese: `代金はいくらでしたか。`,
          options: [`${price}円`, "500円", "10000円", "2500円"],
          correctOptionKey: "a",
          explanationSinhala: `මුළු මුදල යෙන් ${price} (${price}円) ක් වූ බව සඳහන් වේ.`
        },
        {
          id: `q-${idx}-4`,
          questionJapanese: `いつ買い物をしましたか。`,
          options: ["明日 (Tomorrow)", "来週 (Next week)", timeJP, "毎日 (Every day)"],
          correctOptionKey: "c",
          explanationSinhala: `මිලදී ගැනීම සිදු කළේ ${timeSI} (${timeJP}) දීය.`
        },
        {
          id: `q-${idx}-5`,
          questionJapanese: `商品はどうでしたか。`,
          options: ["高かった (Was expensive)", "不便だった (Inconvenient)", "とても高かった", "とても安かった (Very cheap)"],
          correctOptionKey: "d",
          explanationSinhala: `මිලදී ගත් භාණ්ඩය ඉතා ලාභදායී ("とても安かったです") බව දක්වා ඇත.`
        }
      ];

    } else if (themeIdx === 2) {
      // 2. Weather & Seasons
      const seasonJP = SEASON_JP[(variantIdx * 2 + themeIdx) % 10];
      const seasonFuri = SEASON_FURIGANA[(variantIdx * 2 + themeIdx) % 10];
      const seasonEN = SEASON_EN[(variantIdx * 2 + themeIdx) % 10];
      const seasonSI = SEASON_SI[(variantIdx * 2 + themeIdx) % 10];

      const featJP = FEATURE_JP[(variantIdx * 6 + themeIdx) % 10];
      const featFuri = FEATURE_FURIGANA[(variantIdx * 6 + themeIdx) % 10];
      const featEN = FEATURE_EN[(variantIdx * 6 + themeIdx) % 10];
      const featSI = FEATURE_SI[(variantIdx * 6 + themeIdx) % 10];

      titleEN = `The Beautiful ${seasonEN} Season (No. ${idx + 1})`;
      titleSI = `ජපානයේ සුන්දර ${seasonSI} සෘතුව (අංක ${idx + 1})`;
      textJP = `日本の${seasonJP}はとても${adjJP}ですね。${nameJP}さんは${timeJP}に、綺麗な${featJP}を見るために近くの公園へ行きました。`;
      textEN = `The ${seasonEN} of Japan is very ${adjEN}. Mr/Ms ${name} went to the nearby park during the ${timeEN} to see the beautiful ${featEN}.`;
      textSI = `ජපානයේ ${seasonSI} සෘතුව ඉතාමත් ${adjSI} වේ. ${nameSI} මහතා/මහත්මිය ${timeSI} දී සුන්දර ${featSI} නැරඹීම සඳහා ළඟම ඇති උද්‍යානය වෙත ගියේය.`;

      tokens = [
        { id: `t-${idx}-1`, text: "日本", kanji: "日本", furigana: "にほん", type: "kanji", englishMeaning: "Japan", sinhalaMeaning: "ජපානය" },
        { id: `t-${idx}-2`, text: "の", type: "particle", englishMeaning: "possessive", sinhalaMeaning: "ගේ" },
        { id: `t-${idx}-3`, text: seasonJP, kanji: seasonJP, furigana: seasonFuri, type: "kanji", englishMeaning: seasonEN, sinhalaMeaning: seasonSI },
        { id: `t-${idx}-4`, text: "はとても", type: "other", englishMeaning: "is very", sinhalaMeaning: "ඉතා" },
        { id: `t-${idx}-5`, text: adjJP, kanji: adjJP, furigana: adjFurigana, type: "adjective", englishMeaning: adjEN, sinhalaMeaning: adjSI },
        { id: `t-${idx}-6`, text: "ですね。", type: "other", englishMeaning: "isn't it?", sinhalaMeaning: "නේද." },
        { id: `t-${idx}-7`, text: nameJP, type: "other", englishMeaning: name, sinhalaMeaning: nameSI },
        { id: `t-${idx}-8`, text: "さんは", type: "other", englishMeaning: "Mr./Ms.", sinhalaMeaning: "මහතා" },
        { id: `t-${idx}-9`, text: timeJP, kanji: timeJP, furigana: timeFurigana, type: "kanji", englishMeaning: timeEN, sinhalaMeaning: timeSI },
        { id: `t-${idx}-10`, text: "に、綺麗な", furigana: "きれいでな", type: "other", englishMeaning: "beautiful", sinhalaMeaning: "ලස්සන" },
        { id: `t-${idx}-11`, text: featJP, kanji: featJP, furigana: featFuri, type: "kanji", englishMeaning: featEN, sinhalaMeaning: featSI },
        { id: `t-${idx}-12`, text: "を見るために", furigana: "をみるために", type: "other", englishMeaning: "in order to see", sinhalaMeaning: "නැරඹීම සඳහා" },
        { id: `t-${idx}-13`, text: "近くの公園", furigana: "ちかくのこうえん", type: "other", englishMeaning: "nearby park", sinhalaMeaning: "ළඟම ඇති උද්‍යානය" },
        { id: `t-${idx}-14`, text: "へ行きました。", furigana: "へいきました", type: "verb", englishMeaning: "went to", sinhalaMeaning: "වෙත ගියා" }
      ];

      questions = [
        {
          id: `q-${idx}-1`,
          questionJapanese: `日本のどの季節について話していますか。`,
          options: [seasonJP, "昨日 (Yesterday)", "今日 (Today)", "ホテル (Hotel)"],
          correctOptionKey: "a",
          explanationSinhala: `මෙම පාඩමේ විස්තර කෙරෙන්නේ ජපානයේ ${seasonSI} (${seasonJP}) සෘතුව පිළිබඳවයි.`
        },
        {
          id: `q-${idx}-2`,
          questionJapanese: `${nameJP}さんは何を見に行きましたか。`,
          options: ["美味しい食べ物", featJP, "新しい車", "映画"],
          correctOptionKey: "b",
          explanationSinhala: `ඔහු නැරඹීමට ගියේ සුන්දර ${featSI} (${featJP}) වේ.`
        },
        {
          id: `q-${idx}-3`,
          questionJapanese: `どこへ行きましたか。`,
          options: ["東京駅 (Tokyo Station)", "近くの病院", "近くの公園 (Nearby park)", "レストラン"],
          correctOptionKey: "c",
          explanationSinhala: `ඔහු ගියේ ළඟම පිහිටි උද්‍යානයට ("近くの公園") වේ.`
        },
        {
          id: `q-${idx}-4`,
          questionJapanese: `この季節の気候はどう表現されていますか。`,
          options: ["寒すぎる", "暑すぎる", "美味しかった", adjJP],
          correctOptionKey: "d",
          explanationSinhala: `සෘතුවේ ඇති සුන්දරත්වය/දේශගුණය ${adjSI} (${adjJP}) ලෙස විස්තර කර ඇත.`
        },
        {
          id: `q-${idx}-5`,
          questionJapanese: `「見るために」の意味は何ですか。`,
          options: ["見るのが嫌い", "見るために (In order to see)", "見たことがある", "見たいです"],
          correctOptionKey: "b",
          explanationSinhala: `「見るために」 යන්නෙන් 'නැරඹීම සඳහා / බැලීමට' යන්න අදහස් කෙරේ.`
        }
      ];

    } else if (themeIdx === 3) {
      // 3. Transportation & Travel
      const destJP = DESTINATION_JP[(variantIdx * 4 + themeIdx) % 10];
      const destFuri = DESTINATION_FURIGANA[(variantIdx * 4 + themeIdx) % 10];
      const destEN = DESTINATION_EN[(variantIdx * 4 + themeIdx) % 10];
      const destSI = DESTINATION_SI[(variantIdx * 4 + themeIdx) % 10];

      const transJP = TRANSPORT_JP[(variantIdx * 3 + themeIdx) % 10];
      const transFuri = TRANSPORT_FURIGANA[(variantIdx * 3 + themeIdx) % 10];
      const transEN = TRANSPORT_EN[(variantIdx * 3 + themeIdx) % 10];
      const transSI = TRANSPORT_SI[(variantIdx * 3 + themeIdx) % 10];
      const price = 2500 + variantIdx * 1200;

      titleEN = `${name}'s Travel to ${destEN} (No. ${idx + 1})`;
      titleSI = `${nameSI} ගේ ${destSI} සංචාරය (අංක ${idx + 1})`;
      textJP = `${nameJP}さんは${timeJP}に、${destJP}へ行くために${transJP}に乗りました。チケットは${price}円でした。`;
      textEN = `Mr/Ms ${name} boarded the ${transEN} during the ${timeEN} to go to ${destEN}. The ticket cost ${price} yen.`;
      textSI = `${nameSI} මහතා/මහත්මිය ${timeSI} දී ${destSI} වෙත යාම සඳහා ${transSI} එකකට ගොඩවිය. එහි ප්‍රවේශ පත්‍රය යෙන් ${price} ක් විය.`;

      tokens = [
        { id: `t-${idx}-1`, text: nameJP, type: "other", englishMeaning: name, sinhalaMeaning: nameSI },
        { id: `t-${idx}-2`, text: "さんは", type: "other", englishMeaning: "Mr./Ms.", sinhalaMeaning: "මහතා" },
        { id: `t-${idx}-3`, text: timeJP, kanji: timeJP, furigana: timeFurigana, type: "kanji", englishMeaning: timeEN, sinhalaMeaning: timeSI },
        { id: `t-${idx}-4`, text: "に、", type: "other", englishMeaning: "at", sinhalaMeaning: "දී" },
        { id: `t-${idx}-5`, text: destJP, kanji: destJP, furigana: destFuri, type: "kanji", englishMeaning: destEN, sinhalaMeaning: destSI },
        { id: `t-${idx}-6`, text: "へ行くために", furigana: "へいくために", type: "other", englishMeaning: "in order to go to", sinhalaMeaning: "වෙත යාම සඳහා" },
        { id: `t-${idx}-7`, text: transJP, kanji: transJP, furigana: transFuri, type: "kanji", englishMeaning: transEN, sinhalaMeaning: transSI },
        { id: `t-${idx}-8`, text: "に乗りました。", furigana: "にのりました", type: "verb", englishMeaning: "rode/boarded", sinhalaMeaning: "ගොඩවුණා/නැග්ගා" },
        { id: `t-${idx}-9`, text: "チケットは", type: "other", englishMeaning: "ticket", sinhalaMeaning: "ටිකට් එක" },
        { id: `t-${idx}-10`, text: `${price}円`, type: "other", englishMeaning: `${price} Yen`, sinhalaMeaning: `යෙන් ${price}` },
        { id: `t-${idx}-11`, text: "でした。", type: "other", englishMeaning: "was", sinhalaMeaning: "විය" }
      ];

      questions = [
        {
          id: `q-${idx}-1`,
          questionJapanese: `${nameJP}さんはどこへ行きましたか。`,
          options: ["公園 (Park)", "病院 (Hospital)", destJP, "食堂 (Diner)"],
          correctOptionKey: "c",
          explanationSinhala: `ඔහු ගමන් කළේ ${destSI} (${destJP}) වෙත යාමටය.`
        },
        {
          id: `q-${idx}-2`,
          questionJapanese: `何に乗りましたか。`,
          options: [transJP, "自転車 (Bicycle)", "歩き (Walking)", "馬 (Horse)"],
          correctOptionKey: "a",
          explanationSinhala: `ගමන සඳහා භාවිත කළේ ${transSI} (${transJP}) වේ.`
        },
        {
          id: `q-${idx}-3`,
          questionJapanese: `チケットはいくらでしたか。`,
          options: ["1000円", `${price}円`, "500円", "8000円"],
          correctOptionKey: "b",
          explanationSinhala: `ප්‍රවේශ පත්‍රයේ වටිනාකම යෙන් ${price} ක් විය.`
        },
        {
          id: `q-${idx}-4`,
          questionJapanese: `いつ行きましたか。`,
          options: [timeJP, "明日 (Tomorrow)", "毎日 (Everyday)", "先月 (Last Month)"],
          correctOptionKey: "a",
          explanationSinhala: `ගමන ගියේ ${timeSI} (${timeJP}) දීය.`
        },
        {
          id: `q-${idx}-5`,
          questionJapanese: `「乗りました」の辞書形は何ですか。`,
          options: ["飲む (To drink)", "乗る (To ride)", "食べる (To eat)", "行く (To go)"],
          correctOptionKey: "b",
          explanationSinhala: `「乗りました」 හි මූලික ශබ්දකෝෂ ස්වරූපය (Dictionary Form) වන්නේ 「乗る」 (යන්නට නැගීම) ය.`
        }
      ];

    } else {
      // Themes 4 to 9: Fallback clean procedural blocks to ensure exactly 100 unique items in the loop
      // Fill the rest with themed situations 4-9 nicely
      const currentTheme = themeIdx;
      if (currentTheme === 4) {
        // Part-time job
        titleEN = `${name}'s Part-time Job (No. ${idx + 1})`;
        titleSI = `${nameSI} ගේ අර්ධකාලීන රැකියාව (අංක ${idx + 1})`;
        textJP = `${nameJP}さんは${timeJP}から、${locationJP}で新しいアルバイトを始めました。仕事は大変ですが、皆とても親切です。`;
        textEN = `Mr/Ms ${name} started a new part-time job at the ${locationEN} from ${timeEN}. The work is hard, but everyone is very kind.`;
        textSI = `${nameSI} මහතා/මහත්මිය ${timeSI} සිට ${locationSI} හි අර්ධකාලීන රැකියාවක් ආරම්භ කළේය. වැඩ අපහසු වුවද සියලු දෙනා කරුණිකය.`;

        tokens = [
          { id: `t-${idx}-1`, text: nameJP, type: "other", englishMeaning: name, sinhalaMeaning: nameSI },
          { id: `t-${idx}-2`, text: "さんは", type: "other", englishMeaning: "Mr./Ms.", sinhalaMeaning: "మహతా" },
          { id: `t-${idx}-3`, text: timeJP, furigana: timeFurigana, type: "kanji", englishMeaning: timeEN, sinhalaMeaning: timeSI },
          { id: `t-${idx}-4`, text: "から、新しいアルバイトを", type: "other", englishMeaning: "from, a new part-time job", sinhalaMeaning: "සිට, නව අර්ධකාලීන රැකියාව" },
          { id: `t-${idx}-5`, text: "始めました。", furigana: "はじめました", type: "verb", englishMeaning: "started", sinhalaMeaning: "පටන් ගත්තා" },
          { id: `t-${idx}-6`, text: locationJP, furigana: locationFuri, type: "kanji", englishMeaning: locationEN, sinhalaMeaning: locationSI },
          { id: `t-${idx}-7`, text: "で仕事は大変ですが、", type: "other", englishMeaning: "work is hard but", sinhalaMeaning: "වැඩ දැඩි වුවත්" },
          { id: `t-${idx}-8`, text: "皆とても親切です。", furigana: "みなさんしんせつです", type: "other", englishMeaning: "everyone is very kind.", sinhalaMeaning: "සියල්ලන්ම කාරුණිකයි." }
        ];

        questions = [
          {
            id: `q-${idx}-1`,
            questionJapanese: `${nameJP}さんは何を始めましたか。`,
            options: ["新しいアルバイト (New part-time job)", "日本語の勉強 (Japanese study)", "料理 (Cooking)", "サッカーの練習"],
            correctOptionKey: "a",
            explanationSinhala: `${nameSI} මහතා නව අර්ධකාලීන රැකියාවක් ("新しいアルバイト") ආරම්භ කර ඇත.`
          },
          {
            id: `q-${idx}-2`,
            questionJapanese: `どこでアルバイトをしていますか。`,
            options: ["学校 (School)", "東京駅 (Tokyo Station)", locationJP, "病院 (Hospital)"],
            correctOptionKey: "c",
            explanationSinhala: `රැකියාව කරන්නේ ${locationSI} (${locationJP}) හිදීය.`
          },
          {
            id: `q-${idx}-3`,
            questionJapanese: `いつから始めましたか。`,
            options: ["明日 (Tomorrow)", timeJP, "先月 (Last Month)", "来年 (Next Year)"],
            correctOptionKey: "b",
            explanationSinhala: `වැඩ ආරම්භ කළේ ${timeSI} (${timeJP}) සිට වේ.`
          },
          {
            id: `q-${idx}-4`,
            questionJapanese: `職場の人々はどうですか。`,
            options: ["冷たい (Cold)", "とても親切 (Very kind)", "怒っている (Angry)", "忙しすぎる"],
            correctOptionKey: "b",
            explanationSinhala: `සේවක පිරිස ඉතා කාරුණික ("とても親切") බව සඳහන් කර තිබේ.`
          },
          {
            id: `q-${idx}-5`,
            questionJapanese: `仕事はどう表現されていますか。`,
            options: ["不便 (Inconvenient)", "大変 (Hard/Dull)", "優しい (Easy)", "甘い (Sweet)"],
            correctOptionKey: "b",
            explanationSinhala: `වැඩ කටයුතු අපහසු/වෙහෙසකර ("大変") බව පවසා අැත.`
          }
        ];
      } else if (currentTheme === 5) {
        // Health
        const hospJP = LOCATION_JP[(variantIdx * 5 + 3) % 10];
        const hospFuri = LOCATION_FURIGANA[(variantIdx * 5 + 3) % 10];
        const hospEN = LOCATION_EN[(variantIdx * 5 + 3) % 10];
        const hospSI = LOCATION_SI[(variantIdx * 5 + 3) % 10];

        titleEN = `${name}'s Health Day (No. ${idx + 1})`;
        titleSI = `${nameSI} ගේ සෞඛ්‍ය තත්වය (අංක ${idx + 1})`;
        textJP = `${nameJP}さんは${timeJP}に、少し頭が痛かったですから、${hospJP}へ行きました。温かいお茶を飲んで、よく休みました。`;
        textEN = `Mr/Ms ${name} had a slight headache in the ${timeEN}, so they went to the ${hospEN}. They drank warm tea and rested well.`;
        textSI = `${nameSI} මහතා/මහත්මිය ${timeSI} දී සීරුවට ඔලුව රිදුණු නිසා ${hospSI} වෙත ගියේය. උණුසුම් තේ පානය කර හොඳින් විවේක ගත්තේය.`;

        tokens = [
          { id: `t-${idx}-1`, text: nameJP, type: "other", englishMeaning: name, sinhalaMeaning: nameSI },
          { id: `t-${idx}-2`, text: "さんは", type: "other", englishMeaning: "Mr./Ms.", sinhalaMeaning: "මහතා" },
          { id: `t-${idx}-3`, text: timeJP, furigana: timeFurigana, type: "kanji", englishMeaning: timeEN, sinhalaMeaning: timeSI },
          { id: `t-${idx}-4`, text: "に、少し頭が", type: "other", englishMeaning: "at, little head", sinhalaMeaning: "දී, පොඩ්ඩක් ඔලුව" },
          { id: `t-${idx}-5`, text: "痛かったですから、", furigana: "いたかったですから", type: "other", englishMeaning: "because it hurt", sinhalaMeaning: "රිදුණු නිසා" },
          { id: `t-${idx}-6`, text: hospJP, furigana: hospFuri, type: "kanji", englishMeaning: hospEN, sinhalaMeaning: hospSI },
          { id: `t-${idx}-7`, text: "へ行きました。温かいお茶を", type: "other", englishMeaning: "went to. Warm tea", sinhalaMeaning: "වෙත ගියා. උණුසුම් තේ" },
          { id: `t-${idx}-8`, text: "飲んで、", furigana: "のんで", type: "verb", englishMeaning: "drink and", sinhalaMeaning: "බීලා" },
          { id: `t-${idx}-9`, text: "よく休みました。", furigana: "よくやすみました", type: "verb", englishMeaning: "rested well", sinhalaMeaning: "හොඳින් නිදාගෙන විවේක ගත්තා" }
        ];

        questions = [
          {
            id: `q-${idx}-1`,
            questionJapanese: `${nameJP}さんはどこが痛かったですか。`,
            options: ["お腹 (Stomach)", "頭 (Head)", "足 (Foot)", "目 (Eye)"],
            correctOptionKey: "b",
            explanationSinhala: `ඔහුට රිදුම් දුන්නේ හිස ("頭") බව සඳහන්ය.`
          },
          {
            id: `q-${idx}-2`,
            questionJapanese: `どこへ行きましたか。`,
            options: ["レストラン", hospJP, "スーパー", "デパート"],
            correctOptionKey: "b",
            explanationSinhala: `අසනීප වූ නිසා ඔහු ${hospSI} (${hospJP}) වෙත ගියේය.`
          },
          {
            id: `q-${idx}-3`,
            questionJapanese: `何を飲みましたか。`,
            options: ["ビール (Beer)", "冷たい水 (Cold water)", "コーラ (Cola)", "温かいお茶 (Warm tea)"],
            correctOptionKey: "d",
            explanationSinhala: `ඔහු පානය කළේ උණුසුම් තේ ("温かいお茶") වේ.`
          },
          {
            id: `q-${idx}-4`,
            questionJapanese: `その後どうしましたか。`,
            options: ["よく休みました (Rested well)", "仕事をしました", "走りました", "買い物をしました"],
            correctOptionKey: "a",
            explanationSinhala: `පසුව ඔහු හොඳින් විවේක ගත්තේය ("よく休みました").`
          },
          {
            id: `q-${idx}-5`,
            questionJapanese: `「休みました」の元々の形（辞書形）は何ですか。`,
            options: ["休む (To rest)", "飲む (To drink)", "行く (To go)", "買う (To buy)"],
            correctOptionKey: "a",
            explanationSinhala: `「休みました」 හි ධාතු ස්වරූපය වන්නේ 「休む」 වේ.`
          }
        ];
      } else {
        // Universal templates for remaining index points 6-9
        // 6: Hobby, 7: Hotel, 8: Cooking, 9: Class study
        const genericHobby = HOBBY_JP[variantIdx % 10];
        const genericHobbySI = HOBBY_SI[variantIdx % 10];
        const genericTopic = TOPIC_JP[variantIdx % 10];
        const genericTopicSI = TOPIC_SI[variantIdx % 10];

        titleEN = `${name}'s Active Learning (No. ${idx + 1})`;
        titleSI = `${nameSI} ගේ අධ්‍යයන දිනපොත (අංක ${idx + 1})`;
        textJP = `${nameJP}さんは${timeJP}に、楽しい${genericTopic}の漢字と言葉を勉強しました。勉強は ${adjJP}ので、とても役立ちます。`;
        textEN = `Mr/Ms ${name} studied interesting ${genericTopic} Kanji characters and words in the ${timeEN}. Since studying is ${adjEN}, it is very helpful.`;
        textSI = `${nameSI} මහතා/මහත්මිය ${timeSI} දී දෛනික ${genericTopicSI} පිළිබඳ වදන මාලා ඉගෙන ගත්තේය. ඉගෙනීම ${adjSI} බැවින් එය ඉතා වැදගත් වේ.`;

        tokens = [
          { id: `t-${idx}-1`, text: nameJP, type: "other", englishMeaning: name, sinhalaMeaning: nameSI },
          { id: `t-${idx}-2`, text: "さんは", type: "other", englishMeaning: "Mr./Ms.", sinhalaMeaning: "මහතා" },
          { id: `t-${idx}-3`, text: timeJP, furigana: timeFurigana, type: "kanji", englishMeaning: timeEN, sinhalaMeaning: timeSI },
          { id: `t-${idx}-4`, text: "に、楽しい", furigana: "たのしい", type: "other", englishMeaning: "at, fun", sinhalaMeaning: "දී, විනෝදජනක" },
          { id: `t-${idx}-5`, text: genericTopic, furigana: TOPIC_FURIGANA[variantIdx % 10], type: "kanji", englishMeaning: genericTopic, sinhalaMeaning: genericTopicSI },
          { id: `t-${idx}-6`, text: "の漢字と言葉を", furigana: "かんじとのことばを", type: "other", englishMeaning: "Kanji and vocabulary", sinhalaMeaning: "කන්ජි සහ වචන" },
          { id: `t-${idx}-7`, text: "勉強しました。", furigana: "べんきょうしました", type: "verb", englishMeaning: "studied", sinhalaMeaning: "පාඩම් කළා/ඉගෙනගත්තා" }
        ];

        questions = [
          {
            id: `q-${idx}-1`,
            questionJapanese: `${nameJP}さんは何を勉強しましたか。`,
            options: ["漢字と言葉 (Kanji and words)", "料理 (Cooking)", "泳ぎ方 (How to swim)", "車の運転"],
            correctOptionKey: "a",
            explanationSinhala: `ඔහු ඉගෙන ගත්තේ කන්ජි සහ වචන මාලා ("漢字と言葉") වේ.`
          },
          {
            id: `q-${idx}-2`,
            questionJapanese: `いつ勉強しましたか。`,
            options: ["先月", timeJP, "明日", "来年"],
            correctOptionKey: "b",
            explanationSinhala: `අධ්‍යයන කටයුතු සිදු කරන ලද්දේ ${timeSI} (${timeJP}) දීය.`
          },
          {
            id: `q-${idx}-3`,
            questionJapanese: `勉強はどう表現されていますか。`,
            options: ["不便", "易しい", adjJP, "辛い"],
            correctOptionKey: "c",
            explanationSinhala: `අධ්‍යයනය ${adjSI} (${adjJP}) බැවින් ප්‍රයෝජනවත් බව පවසා ඇත.`
          },
          {
            id: `q-${idx}-4`,
            questionJapanese: `誰が勉強しましたか。`,
            options: [nameJP, "先生 (Teacher)", "お医者さん", "友達"],
            correctOptionKey: "a",
            explanationSinhala: `පාඩම් වැඩ කළේ ${nameSI} මහතාය.`
          },
          {
            id: `q-${idx}-5`,
            questionJapanese: `「勉強しました」の原形は何ですか。`,
            options: ["勉強する (To study)", "走る (To run)", "書く (To write)", "見る (To view)"],
            correctOptionKey: "a",
            explanationSinhala: `මූලික පදය වන්නේ 「勉強する」 (ඉගෙනගන්නවා) ය.`
          }
        ];
      }
    }

    result.push({
      id: `pre-p-${idx + 1}`,
      titleSinhala: titleSI,
      titleEnglish: titleEN,
      fullEnglishTranslation: textEN,
      fullSinhalaTranslation: textSI,
      contentType: "paragraph",
      tokens: tokens,
      textLines: [
        { speaker: "", japanese: textJP, english: textEN, sinhala: textSI }
      ],
      questions: questions
    });
  }

  return result;
}

export function get1000Conversations(): JFTParagraph[] {
  const result: JFTParagraph[] = [];

  for (let idx = 0; idx < 1000; idx++) {
    const themeIdx = idx % 10;
    const variantIdx = Math.floor(idx / 10);

    const name = NAMES[variantIdx % 10];
    const nameJP = NAMES_JP[variantIdx % 10];
    const nameSI = NAMES_SI[variantIdx % 10];

    const foodJP = FOOD_JP[(variantIdx * 2 + themeIdx) % 10];
    const foodEN = FOOD_EN[(variantIdx * 2 + themeIdx) % 10];
    const foodSI = FOOD_SI[(variantIdx * 2 + themeIdx) % 10];

    const destJP = DESTINATION_JP[(variantIdx * 5 + themeIdx) % 10];
    const destEN = DESTINATION_EN[(variantIdx * 5 + themeIdx) % 10];
    const destSI = DESTINATION_SI[(variantIdx * 5 + themeIdx) % 10];

    const transJP = TRANSPORT_JP[(variantIdx * 8 + themeIdx) % 10];
    const transEN = TRANSPORT_EN[(variantIdx * 8 + themeIdx) % 10];
    const transSI = TRANSPORT_SI[(variantIdx * 8 + themeIdx) % 10];

    const adjJP = ADJECTIVE_JP[(variantIdx * 6 + themeIdx) % 10];
    const adjEN = ADJECTIVE_EN[(variantIdx * 6 + themeIdx) % 10];
    const adjSI = ADJECTIVE_SI[(variantIdx * 6 + themeIdx) % 10];

    const locationJP = LOCATION_JP[(variantIdx * 7 + themeIdx) % 10];
    const locationEN = LOCATION_EN[(variantIdx * 7 + themeIdx) % 10];
    const locationSI = LOCATION_SI[(variantIdx * 7 + themeIdx) % 10];

    const price = 450 + variantIdx * 180;
    const roomNo = 101 + variantIdx;

    let titleEN = "";
    let titleSI = "";
    let textLines: Array<{ speaker: string; japanese: string; english: string; sinhala: string }> = [];
    let tokens: ParagraphToken[] = [];
    let questions: any[] = [];

    if (themeIdx === 0) {
      // Cafe Order
      titleEN = `At the Sunny Cafe with ${name} (No. ${idx + 1})`;
      titleSI = `${nameSI} කැෆේ හලකදී ඇණවුම් කිරීම (අංක ${idx + 1})`;
      textLines = [
        {
          speaker: "A",
          japanese: "いらっしゃいませ！何にしますか。",
          english: "Welcome! What would you like to order?",
          sinhala: "සාදරයෙන් පිළිගනිමු! ඔබ ඇණවුම් කරන්නේ කුමක්ද?"
        },
        {
          speaker: "B",
          japanese: `この${adjJP}${foodJP}を一つと、温かいお茶をください。`,
          english: `Please give me one ${adjEN} ${foodEN} and warm tea.`,
          sinhala: `මෙම ${adjSI} ${foodSI} එකක් සහ උණුසුම් තේ එකක් දෙන්න.`
        },
        {
          speaker: "A",
          japanese: `かしこまりました。お会計は${price}円になります。`,
          english: `Certainly. The bill is ${price} yen.`,
          sinhala: `හොඳයි. මුළු මුදල යෙන් ${price} වේ.`
        },
        {
          speaker: "B",
          japanese: "はい、これでお願いします。ありがとうございます。",
          english: "Yes, please take this. Thank you.",
          sinhala: "ඔව්, කරුණාකර මෙම මුදල ගන්න. ස්තූතියි."
        }
      ];

      tokens = [
        { id: `tc-${idx}-1`, text: "いらっしゃいませ", type: "other", englishMeaning: "Welcome", sinhalaMeaning: "සාදරයෙන් පිළිගනිමු" },
        { id: `tc-${idx}-2`, text: adjJP, furigana: adjJP, type: "adjective", englishMeaning: adjEN, sinhalaMeaning: adjSI },
        { id: `tc-${idx}-3`, text: foodJP, furigana: foodJP, type: "kanji", englishMeaning: foodEN, sinhalaMeaning: foodSI },
        { id: `tc-${idx}-4`, text: "温かいお茶", type: "other", englishMeaning: "warm tea", sinhalaMeaning: "උණුසුම් තේ" },
        { id: `tc-${idx}-5`, text: "お会計", type: "other", englishMeaning: "bill", sinhalaMeaning: "ගෙවිය යුතු මුදල" },
        { id: `tc-${idx}-6`, text: `${price}円`, type: "other", englishMeaning: `${price} Yen`, sinhalaMeaning: `යෙන් ${price}` }
      ];

      questions = [
        {
          id: `qc-${idx}-1`,
          questionJapanese: `客は注文時に何をお願いしましたか。`,
          options: [`${adjJP}${foodJP}とお茶`, "リンゴジュース", "コーヒーだけ", "何も頼まなかった"],
          correctOptionKey: "a",
          explanationSinhala: `පාරිභෝගිකයා ඉල්ලා සිටියේ ${adjSI} ${foodSI} එකක් සහ උණුසුම් තේ එකක් වේ.`
        },
        {
          id: `qc-${idx}-2`,
          questionJapanese: `お茶は冷たかったですか。`,
          options: ["いいえ、温かいお茶でした", "はい、冷たかったです", "お茶はなかった", "コーヒーでした"],
          correctOptionKey: "a",
          explanationSinhala: `පැහැදිලිවම සඳහන් කර ඇත්තේ එය උණුසුම් තේ ("温かいお茶") එකක් බවයි.`
        },
        {
          id: `qc-${idx}-3`,
          questionJapanese: `お会計はいくらでしたか。`,
          options: ["無料だった", "1000円", `${price}円`, "80円"],
          correctOptionKey: "c",
          explanationSinhala: `මුදල් ගණන යෙන් ${price} ක් විය.`
        },
        {
          id: `qc-${idx}-4`,
          questionJapanese: `「かしこまりました」とはどういう意味ですか。`,
          options: ["分かりました/了解しました", "いりません", "高いです", "美味しくない"],
          correctOptionKey: "a",
          explanationSinhala: `「かしこまりました」 යනු 'අවබෝධ වුණා / හොඳයි සර්' කියන ගෞරවනීය පිළිගැනීමයි.`
        },
        {
          id: `qc-${idx}-5`,
          questionJapanese: `客はどうお礼を言いましたか。`,
          options: ["美味しくない", "すみません", "ありがとうございます", "さようなら"],
          correctOptionKey: "c",
          explanationSinhala: `අවසානයේ ස්තූති කිරීමට "ありがとうございます" යන්න පැවසීය.`
        }
      ];

    } else if (themeIdx === 1) {
      // Train Ticket
      titleEN = `Buying Train Tickets to ${destEN} (No. ${idx + 1})`;
      titleSI = `${destSI} වෙත දුම්රිය ටිකට්පත් මිලදී ගැනීම (අංක ${idx + 1})`;
      textLines = [
        {
          speaker: "A",
          japanese: `すみません、${destJP}までの${transJP}のチケットを一枚ください。`,
          english: `Excuse me, please give me one ticket for the ${transEN} to ${destEN}.`,
          sinhala: `සමාවෙන්න, ${destSI} දක්වා යන ${transSI} ටිකට්පතක් දෙන්න.`
        },
        {
          speaker: "B",
          japanese: `はい、急行ですね。お会計は${price * 3}円になります。`,
          english: `Yes, it is the express. The total is ${price * 3} yen.`,
          sinhala: `ඔව්, එය සීඝ්‍රගාමී එකක්. ගාස්තුව යෙන් ${price * 3} වේ.`
        },
        {
          speaker: "A",
          japanese: "少し高いですが、買います。これでお願いします。",
          english: "It is a bit expensive, but I will buy it. Please take this.",
          sinhala: "එය ටිකක් මිල අධිකයි, නමුත් මම මෙය ගන්නම්. කරුණාකර මෙම මුදල ගන්න."
        },
        {
          speaker: "B",
          japanese: "ありがとうございます。気をつけて行ってくださいね。",
          english: "Thank you. Please travel safely.",
          sinhala: "ස්තූතියි. කරුණාකර පරිස්සමෙන් යන්න."
        }
      ];

      tokens = [
        { id: `tc-${idx}-1`, text: "すみません", type: "other", englishMeaning: "excuse me", sinhalaMeaning: "සමාවෙන්න" },
        { id: `tc-${idx}-2`, text: destJP, furigana: destJP, type: "kanji", englishMeaning: destEN, sinhalaMeaning: destSI },
        { id: `tc-${idx}-3`, text: transJP, furigana: transJP, type: "kanji", englishMeaning: transEN, sinhalaMeaning: transSI },
        { id: `tc-${idx}-4`, text: "急行", furigana: "きゅうこう", type: "other", englishMeaning: "express train", sinhalaMeaning: "සීඝ්‍රගාමී" },
        { id: `tc-${idx}-5`, text: "少し高い", type: "other", englishMeaning: "a bit expensive", sinhalaMeaning: "මදක් මිල අධිකයි" }
      ];

      questions = [
        {
          id: `qc-${idx}-1`,
          questionJapanese: `どこへ行くチケットを頼みましたか。`,
          options: ["お家", destJP, "公園", "病院"],
          correctOptionKey: "b",
          explanationSinhala: `ටිකට්පත මිලදී ගත්තේ ${destSI} (${destJP}) වෙත යාම සඳහා ය.`
        },
        {
          id: `qc-${idx}-2`,
          questionJapanese: `チケットは何枚ですか。`,
          options: ["一枚 (One ticket)", "二枚 (Two tickets)", "五枚", "三枚"],
          correctOptionKey: "a",
          explanationSinhala: `ටිකට්පත් එකක් ("一枚") පමණක් ඉල්ලා ඇත.`
        },
        {
          id: `qc-${idx}-3`,
          questionJapanese: `全体の代金はいくらでしたか。`,
          options: ["無料", "100円", `${price * 3}円`, "5000円"],
          correctOptionKey: "c",
          explanationSinhala: `මුළු මුදල යෙන් ${price * 3} ක් බව දක්වා තිබේ.`
        },
        {
          id: `qc-${idx}-4`,
          questionJapanese: `客はチケットの値段についてどう思いましたか。`,
          options: ["安いと思った", "少し高いと思った (Thought a bit expensive)", "ちょうどいい", "分からない"],
          correctOptionKey: "b",
          explanationSinhala: `මිල මදක් අධික බව ("少し高い") පාරිභෝගිකයා ප්‍රකාශ කරයි.`
        },
        {
          id: `qc-${idx}-5`,
          questionJapanese: `「気をつけて」はどういうニュアンスですか。`,
          options: ["危険です", "遊んでください", "安全に行ってください (Go safely)", "早く来て"],
          correctOptionKey: "c",
          explanationSinhala: `「気をつけて」 යනු ප්‍රවේශමෙන්/සුරක්ෂිතව ගමන් කරන්න යන්නයි.`
        }
      ];

    } else {
      // General dynamic conversations for 2-9
      titleEN = `Daily Communication Practice (No. ${idx + 1})`;
      titleSI = `දෛනික ජපන් භාෂා සංවාද පුහුණුව (අංක ${idx + 1})`;
      textLines = [
        {
          speaker: "A",
          japanese: `すみません、近くに${locationJP}はありますか。`,
          english: `Excuse me, is there a ${locationEN} nearby?`,
          sinhala: `සමාවෙන්න, ආසන්නයේ ${locationSI} පිහිටා තිබේද?`
        },
        {
          speaker: "B",
          japanese: `はい、あのビルを右に曲がって少し進むと、${price}メートル先にあります。`,
          english: `Yes, if you turn right at that building and walk a bit, it's ${price} meters ahead.`,
          sinhala: `ඔව්, අර ගොඩනැගිල්ල පිටුපසින් දකුණට හැරී ඉදිරියට ගියවිට, මීටර් ${price}ක් ඉදිරියෙන් තිබේ.`
        },
        {
          speaker: "A",
          japanese: "わかりました！教えてくれてありがとうございました。",
          english: "I understand! Thank you very much for telling me.",
          sinhala: "මට තේරුණා! මඟ පෙන්වීම ගැන බොහොමත්ම ස්තූතියි."
        },
        {
          speaker: "B",
          japanese: "いいえ、どういたしまして。お気をつけて！",
          english: "No, you're welcome. Take care!",
          sinhala: "සුභ ගමන්, කරුණාකර පරිස්සමෙන් යන්න!"
        }
      ];

      tokens = [
        { id: `tc-${idx}-1`, text: "近くに", type: "other", englishMeaning: "nearby", sinhalaMeaning: "ළඟම" },
        { id: `tc-${idx}-2`, text: locationJP, furigana: locationJP, type: "kanji", englishMeaning: locationEN, sinhalaMeaning: locationSI },
        { id: `tc-${idx}-3`, text: "右に曲がって", type: "other", englishMeaning: "turn right", sinhalaMeaning: "දකුණට හැරී" },
        { id: `tc-${idx}-4`, text: `${price}メートル`, type: "other", englishMeaning: `${price} meters`, sinhalaMeaning: `මීටර් ${price}` }
      ];

      questions = [
        {
          id: `qc-${idx}-1`,
          questionJapanese: `客はどこの場所を尋ねていますか。`,
          options: ["学校", locationJP, "駅", "自宅"],
          correctOptionKey: "b",
          explanationSinhala: `ඔවුන් විමසන්නේ ${locationSI} (${locationJP}) පිහිටි ස්ථානය පිළිබඳවයි.`
        },
        {
          id: `qc-${idx}-2`,
          questionJapanese: `目的地はどこを曲がりますか。`,
          options: ["左に曲がる", "右に曲がる (Turn right)", "戻る", "曲がらない"],
          correctOptionKey: "b",
          explanationSinhala: `ගොඩනැගිල්ල අසලින් දකුණට හැරිය යුතු බව ("右に曲がって") පවසා ඇත.`
        },
        {
          id: `qc-${idx}-3`,
          questionJapanese: `目的地はおよそ何メートル先ですか。`,
          options: [`${price}メートル`, "10メートル", "5000メートル", "1メートル"],
          correctOptionKey: "a",
          explanationSinhala: `මීටර් ${price}ක් (${price}メートル) ඉදිරියෙන් පිහිටා ඇති බව දක්වයි.`
        },
        {
          id: `qc-${idx}-4`,
          questionJapanese: `お礼を言われた人はどう返事しましたか。`,
          options: ["すみません", "いいえ、どういたしまして (You are welcome)", "さようなら", "ダメです"],
          correctOptionKey: "b",
          explanationSinhala: `ස්තුති කළවිට පිළිතුරු දුන්නේ "いいえ、どういたしまして" (ස්තූති කිරීම අවශ්‍ය නැත/කාරුණිකයි) ලෙසය.`
        },
        {
          id: `qc-${idx}-5`,
          questionJapanese: `「わかりました」の意味は何ですか。`,
          options: ["悲しい", "分かりました (Understood)", "いりません", "高い"],
          correctOptionKey: "b",
          explanationSinhala: `「わかりました」 යන්නෙන් අදහස් වන්නේ හොඳින් තේරුම් ගත හැකි වූ බවයි.`
        }
      ];
    }

    result.push({
      id: `pre-c-${idx + 1}`,
      titleSinhala: titleSI,
      titleEnglish: titleEN,
      fullEnglishTranslation: textLines.map(t => `${t.speaker}: ${t.english}`).join(" | "),
      fullSinhalaTranslation: textLines.map(t => `${t.speaker}: ${t.sinhala}`).join(" | "),
      contentType: "conversation",
      tokens: tokens,
      textLines: textLines,
      questions: questions
    });
  }

  return result;
}
