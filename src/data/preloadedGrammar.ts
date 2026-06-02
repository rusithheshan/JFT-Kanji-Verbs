import { JFTGrammar } from "../types";

export const PRELOADED_GRAMMAR: JFTGrammar[] = [
  {
    id: "g-01",
    index: "01",
    title: "Desu / Masu Forms vs. Plain Forms",
    romaji: "Polite Form vs Plain Form",
    pattern: "Verbs, i-Adjectives, na-Adjectives, and Nouns (Polite / Plain Conjugations)",
    sinhalaExplanation: "ජපන් භාෂාවේ විධිමත් (Polite/Desu/Masu) සහ සාමාන්‍ය (Plain) වර්තමාන/අතීත, සාධනීය/නිෂේධනීය ආකාර එකමුතුව. මෙය අනෙකුත් සියලුම උසස් ව්‍යාකරණ භාවිතයන් සඳහා මූලික වේ.",
    englishExplanation: "The structural matrix of Polite (desu/masu) vs. Plain forms in present/past and positive/negative. Crucial as the building block for all next-level JLPT N4 grammar patterns.",
    conjugationRules: "• Verb (のむ) -> のみます (Polite Pres+) | のまない (Plain Pres-) | のみました (Polite Past+) | のんだ (Plain Past+) | のみませんでした (Polite Past-) | のまなかった (Plain Past-)\n• i-Adj (たかい) -> たかいです | たかくない | たかかったです | たかくなかった\n• na-Adj (しずか) -> しずかです | しずかではない | しずかでした | しずかではなかった",
    examples: [
      {
        japanese: "あした、ビールを飲みます。",
        hiragana: "あした、ビールを のみます (හෙට බියර් බොනවා - Polite)",
        sinhala: "හෙට මම බියර් බොනවා. (Polite: Nomimasu)"
      },
      {
        japanese: "昨日、コーヒーを飲んだ。",
        hiragana: "きのう、コーヒーを のんだ (ඊයේ කෝපි බීවා - Plain)",
        sinhala: "ඊයේ මම කෝපි බීවා. (Plain: Nonda)"
      }
    ]
  },
  {
    id: "g-02",
    index: "02",
    title: "たことがあります",
    romaji: "Ta koto ga arimasu",
    pattern: "V (た Form) + ことがあります",
    sinhalaExplanation: "කිසියම් ක්‍රියාවක් අතීතයේදී අත්දැකීමක් ලෙස සිදුකර තිබෙන බව දැක්වීමට භාවිතා වේ. (අතීත අත්දැකීම් ප්‍රකාශ කරයි)",
    englishExplanation: "Used to express past personal experiences. Indicates that someone has done something at least once in the past.",
    oftenUsed: "• いちど (එක් වරක්), • いちども (කවදාවත්ම), • なんどか (කවදාහරි), • なんども (කී පාරක්වත්ම)",
    notUsed: "• いつも (හැමවිටම), • たいじです (ඕනෑ), • まいにち (හැමදාම)",
    examples: [
      {
        japanese: "ふじ山にのぼったことがありますか。はい、私はふじ山にのぼったことがあります。",
        hiragana: "ふじさんに のぼったことが ありますか。はい、わたしは ふじさんに のぼったことが あります。",
        sinhala: "ඔබ ෆුජි කන්ද නැගලා තියෙනවාද? ඔව්, මම ෆුජι කන්ද නැගලා තියෙනවා."
      },
      {
        japanese: "私はまだ日本りょうりをたべたことがありません。",
        hiragana: "わたしは まだ にほんりょうりを たべたことが ありません。",
        sinhala: "මම තවම ජපන් කෑම වර්ග ආහාරයට ගෙන නැත."
      },
      {
        japanese: "あなたははしでラーメンをたべたことがありますか。",
        hiragana: "あなたは はしで ラーメンを たべたことが ありますか。",
        sinhala: "ඔබ චොප්ස්ටික්ස් (කූරු) වලින් රාමන් කා තිබේද?"
      }
    ]
  },
  {
    id: "g-03",
    index: "03",
    title: "~てみます",
    romaji: "~Te mimasu",
    pattern: "V (て Form) + みます / みてください / みたいです ...",
    sinhalaExplanation: "කිසියම් ක්‍රියාවක් කර බලනවා (try doing something) ලෙස පැවසීමේ ශෛලියයි. වාක්‍ය අවසානය みます, みたいです, てください, みませんか, ましょう වැනි ඕනෑම ආකාරයකට වෙනස් විය හැක.",
    englishExplanation: "Expresses trying out an action to see its result or how it feels. The ending can conjugate to support views like 'want to try', 'please try', etc.",
    examples: [
      {
        japanese: "日本へ行って、ふじ山にのぼってみたいです。",
        hiragana: "にほんへ いって、ふじさんに のぼって みたいです。",
        sinhala: "ජපානයට ගිහින්, ෆුජි කන්ද නැගලා බලන්න ආසයි."
      },
      {
        japanese: "この料理ははしで食べて見てください。",
        hiragana: "この りょうりは はしで たべて みてください。",
        sinhala: "මෙම කෑම වේල හැඳි කූරු (Chopsticks) වලින් කා බලන්න."
      },
      {
        japanese: "すしを食べたことがないから、食べて見たいです。",
        hiragana: "すしを たべたことが ないから、たべて みたいです。",
        sinhala: "සුෂි කා නොමැති නිසා, කා බැලීමට අවශ්‍යයි."
      }
    ]
  },
  {
    id: "g-04",
    index: "04",
    title: "V1 て, V2 (Sequential Actions)",
    romaji: "V1 te, V2",
    pattern: "V1 (て Form) + V2 (ます / ました / てください...)",
    sinhalaExplanation: "ක්‍රියාවන් දෙකක් හෝ කිහිපයක් අනුපිළිවෙලින් සිදුවන බව පැවසීමට භාවිතා වේ. 'පළමු ක්‍රියාව කර, දෙවන ක්‍රියාව කරනවා' යන්න මෙයින් අදහස් කෙරේ.",
    englishExplanation: "Connects two or more actions in sequential chronological order. Indicates 'Doing action 1 and then doing action 2'.",
    examples: [
      {
        japanese: "スープを飲んで、テレビを見てねました。",
        hiragana: "スープを のんで、テレビを みて ねました。",
        sinhala: "සුප් බීලා, ටීවී බලලා නිදාගත්තා."
      },
      {
        japanese: "朝ご飯を食べて、仕事へ行きます。",
        hiragana: "あさごはんを たべて、しごとへ いきます。",
        sinhala: "උදේ කෑම කාලා, රැකියාවට යනවා."
      },
      {
        japanese: "朝おきて、顔をあらって、ご飯を食べてください。",
        hiragana: "あさ おきて、かおを あらって、ごはんを たべて ください。",
        sinhala: "උදේ අවදි වී, මුහුණ සෝදා, කෑම කන්න."
      }
    ]
  },
  {
    id: "g-05",
    index: "05",
    title: "~ないで",
    romaji: "~Naide",
    pattern: "V1 (ない Form) + で + V2",
    sinhalaExplanation: "V1 ක්‍රියාව සිදු නොකර V2 ක්‍රියාව සිදුකරනවා (Doing V2 without doing V1) යන්න පැවසීමට භාවිතා වේ. 'පළමු ක්‍රියාව නොකර දෙවන ක්‍රියාව කරනවා'.",
    englishExplanation: "Indicates doing action 2 without doing action 1. It acts as 'without doing V1, does V2'.",
    examples: [
      {
        japanese: "私はあさごはんを食べないで学校へ行きます。",
        hiragana: "わたしは あさごはんを たべないで がっこうへ いきます。",
        sinhala: "මම උදේ ආහාරය අනුභව නොකර පාසල් යන්නෙමි."
      },
      {
        japanese: "私は日本語をべんきょうしないでねました。",
        hiragana: "わたしは にほんごを べんきょうしないで ねました。",
        sinhala: "මම ජපන් භාෂාව පාඩම් නොකර නිදාගත්තෙමි."
      },
      {
        japanese: "私は手でご飯を食べないではしで食べました。",
        hiragana: "わたしは てで ごはんを たべないで はしで たべました。",
        sinhala: "මම අතින් කෑම නොකා හෂි (Chopsticks) වලින් කෑවෙමි."
      }
    ]
  },
  {
    id: "g-06",
    index: "06",
    title: "~なければなりません",
    romaji: "~Nakereba narimasen",
    pattern: "V (ない Form, drop ない) + なければなりません / なければならない",
    sinhalaExplanation: "යම් ක්‍රියාවක් අනිවාර්යයෙන්ම කල යුතුයි (Must do / Obligation) යනුවෙන් පැවසීමේදී මෙම ව්‍යාකරණ රටාව භාවිතා වේ.",
    englishExplanation: "Expresses duty, necessity, or an absolute obligation to do something. Equivalent to 'must do' or 'have to do'.",
    examples: [
      {
        japanese: "らいねん日本へ行かなければなりません。",
        hiragana: "らいねん にほんへ いかなければ なりません。",
        sinhala: "ලබන වසරේ මම ජපානයට යා යුතුමයි."
      },
      {
        japanese: "明日はかならずしごとへ行かなければなりません。",
        hiragana: "あしたは かならず しごとへ いかなければ なりません。",
        sinhala: "හෙට අනිවාර්යයෙන්ම රැකියාවට යා යුතුය."
      },
      {
        japanese: "このくすりはかならずのまなければならない。",
        hiragana: "この くすりは かならず のまなければ ならない。",
        sinhala: "මෙම ඖෂධය අනිවාර්යයෙන්ම පානය කළ යුතුය."
      }
    ]
  },
  {
    id: "g-07",
    index: "07",
    title: "~てはいけません",
    romaji: "~Te wa ikemasen",
    pattern: "V (て Form) + はいけません\nい-Adj: (くて) + はいけません | な-Adj/Noun: (で) + はいけません",
    sinhalaExplanation: "යම් ක්‍රියාවක් කිරීම තහනම් බව හෝ නොකළ යුතු බව (Prohibition / Must not do) ප්‍රකාශ කිරීමට භාවිතා කරයි.",
    englishExplanation: "Specifies prohibition or a strong directive not to perform an action. Translates as 'must not do' or 'not allowed to do'.",
    examples: [
      {
        japanese: "試験のときじしょを使ってはいけません。",
        hiragana: "しけんのとき じしょを つかっては いけません。",
        sinhala: "විභාගය අවස්ථාවේ ශබ්දකෝෂ භාවිතා නොකළ යුතුය."
      },
      {
        japanese: "図書館の中に話してはいけません。",
        hiragana: "としょかんのなかに はなしては いけません。",
        sinhala: "පුස්තකාලය ඇතුළත කථා නොකළ යුතුය."
      },
      {
        japanese: "びじゅつかんにはいってはいけません。",
        hiragana: "びじゅつかんに はいっては いけません。",
        sinhala: "කලාගාරයට ඇතුල්වීම තහනම් වේ."
      }
    ]
  },
  {
    id: "g-08",
    index: "08",
    title: "~てもいいです",
    romaji: "~Te mo ii desu",
    pattern: "V (て Form) / い-Adj (くて) / な-Adj-Noun (で) + もいいです / もよろしいです",
    sinhalaExplanation: "යම් ක්‍රියාවක් කිරීමට අවසර දීම හෝ අවසර ඉල්ලීම (May do / Asking permission) සඳහා භාවිතා වේ.",
    englishExplanation: "Used to ask for or grant permission to do something. Matches 'may do' or 'it is alright to'.",
    examples: [
      {
        japanese: "ここにすわってもいいですか。はい、すわってもいいです。",
        hiragana: "ここに すわっても いいですか。はい、すわっても いいです。",
        sinhala: "මෙහි වාඩිවුණාට කමක් නැද්ද? ඔව්, වාඩිවුණාට කමක් නැත."
      },
      {
        japanese: "この本をよんでもよろしいですか。",
        hiragana: "この ほんを よんでも よろしいですか。",
        sinhala: "මෙම පොත කියෙව්වට කමක් නැද්ද? (More polite)"
      },
      {
        japanese: "日本語のクラスでシンハラごではなしてもいいですか。",
        hiragana: "にほんごの クラスで シンハラごで はなしても いいですか。",
        sinhala: "ජපන් භාෂා පන්තියේදී සිංහලෙන් කතා කළාට කමක් නැද්ද?"
      }
    ]
  },
  {
    id: "g-09",
    index: "09",
    title: "~なくてもいいです",
    romaji: "~Nakute mo ii desu",
    pattern: "V (ない, drop ない) / い-Adj (く) / な-Adj-Noun (で) + なくてもいいです / なくてもかまいません",
    sinhalaExplanation: "යම් ක්‍රියාවක් සිදු නොකළද ගැටළුවක් නොමැති බව (Don't have to do) පැවසීම සඳහා භාවිතා වේ. 'නොකළාට කමක් නැහැ'.",
    englishExplanation: "Indicates that an action is not necessary. Translates directly as 'don't have to do' or 'it is okay even if you don't'.",
    examples: [
      {
        japanese: "このへやにはいらなくてもいいですか。",
        hiragana: "この へやに はいらなくても いいですか。",
        sinhala: "මෙම කාමරයට ඇතුළු නොවුණාට කමක් නැද්ද?"
      },
      {
        japanese: "そのジュースはおいしくなくてもかまいません。",
        hiragana: "その ジュースは おいしくなくても かまいません。",
        sinhala: "එම බීම වීදුරුව රසවත් නොවුණත් ගැටළුවක් නැත."
      },
      {
        japanese: "このかんじをべんきょうしなくてもかまいません。",
        hiragana: "この かんじを べんきょう しなくても かまいません。",
        sinhala: "මෙම කන්ජි අකුර පාඩම් නොකළාට කිසිදු ගැටළුවක් නැත."
      }
    ]
  },
  {
    id: "g-10",
    index: "10 & 11",
    title: "~ほうがいいです / ~ないほうがいいです",
    romaji: "~Hou ga ii desu / ~Nai hou ga ii desu",
    pattern: "Positive Advice: V (た Form) + ほうがいいです\nNegative Advice: V (ない Form) + ほうがいいです",
    sinhalaExplanation: "යමෙකුට උපදෙසක් හෝ යෝජනාවක් ලබාදීමේදී භාවිතා කරයි. 'මෙම ක්‍රියාව කරන එක හෝ නොකරන එක වඩා හොඳයි' (Had better do / Had better not do) යන්න මෙයින් පැවසේ.",
    englishExplanation: "Used for giving strong and direct advice or recommendation. Suggests that it is better to do or not to do an action.",
    examples: [
      {
        japanese: "このくすりをちゃんとのんだほうがいいです。",
        hiragana: "この くすりを ちゃんとのんだほうが いいです。",
        sinhala: "මෙම බෙහෙත් නිවැරදිව බොන එක වඩා හොඳයි."
      },
      {
        japanese: "さむいですから、コートをきたほうがいいです。",
        hiragana: "さむいですから、コートを きたほうが いいです。",
        sinhala: "සීතල නිසා, කෝට් එක ඇඳගන්න එක වඩාත් සුදුසුයි."
      },
      {
        japanese: "たばこをすわないほうがいいです。",
        hiragana: "たばこを すわないほうが いいです。",
        sinhala: "දුම්පානය නොකර සිටීම වඩාත් යහපත්ය."
      }
    ]
  },
  {
    id: "g-64",
    index: "64",
    title: "~といいです",
    romaji: "~To ii desu",
    pattern: "V (Plain) / い-Adj (い) / な-Adj (だ) / N (だ) + といいです / といいけど",
    sinhalaExplanation: "'මෙහෙම වුණොත් හොඳයි' හෝ 'මෙහෙම කළොත් හොඳයි' (I hope / It would be good if...) යනුවෙන් ප්‍රාර්ථනාවක් දැක්වීමට භාවිතා වේ. වර්තමාන කාල ස්වරූප සමඟ පමණක් භාවිත වේ.",
    englishExplanation: "Expresses a wish, hope, or polite suggestion. Commonly translated as 'I hope that...' or 'It would be nice if...'. Only used with present tense.",
    examples: [
      {
        japanese: "うんどうかいの日、雨がふらないといいですけど。",
        hiragana: "うんどうかいのひ、あめが ふらないと いいですけど。",
        sinhala: "ක්‍රීඩා උත්සවය දිනට වැස්ස නොවැටුණොත් හොඳයි."
      },
      {
        japanese: "へやがもっとひろいといいけどなあ。",
        hiragana: "へやが もっと ひろいと いいけどなあ。",
        sinhala: "කාමරය තව ටිකක් ලොකු වුණානම් කොච්චර හොඳද..."
      }
    ]
  },
  {
    id: "g-65",
    index: "65",
    title: "命令形 (Imperative Form)",
    romaji: "Meireikei - Imperative Form",
    pattern: "• Group I: ます row -> え column (e.g. かきます → かけ)\n• Group II: Drop ます -> add ろ (e.g. たべます → たべろ)\n• Group III: します → しろ | きます → こい",
    sinhalaExplanation: "අනිවාර්යයෙන්ම කරන්න යැයි විධානයක් හෝ දැඩි නියෝගයක් (Imperative/Command) ලබාදීමේදී භාවිතා වේ. සාමාන්‍යයෙන් පිරිමි පාර්ශවය, දෙමාපියන් හෝ පොදු සංඥා පුවරුවල පමණක් යොදාගනී. උසස් පුද්ගලයින්ට කිසිවිටක භාවිත නොකෙරේ.",
    englishExplanation: "Conveys a strong imperative command. Utilized primarily by adult males, parents, or in sports and emergencies. Extremely informal or harsh.",
    conjugationRules: "• Group I: Change the 'i' syllable preceding 'masu' to 'e' syllable. (e.g., kaimasu -> kae)\n• Group II: Substitute 'masu' with 'ro'. (e.g., misemasu -> misero)\n• Group III: Shimasu -> Shiro | Kimasu -> Koi.",
    examples: [
      {
        japanese: "もうおそいですから、はやくねろ！",
        hiragana: "もう おそいですから、はやく ねろ！",
        sinhala: "දැන් ප්‍රමාද වැඩි නිසා ඉක්මනට නිදාගනින්! / නිදාගන්න!"
      },
      {
        japanese: "しあいですから、はやくはしれ！",
        hiragana: "しあいですから、はやく はしれ！",
        sinhala: "තරඟයක් බැවින් ඉක්මනින් දුවපන්! / දුවන්න!"
      }
    ]
  },
  {
    id: "g-67",
    index: "67",
    title: "~そうです (Conjecture)",
    romaji: "~Sou desu (Conjecture: Looks like)",
    pattern: "V (ます drop ます) + そうです\nい-Adj (drop い) + そうです (Neg: ~なさそうです)\nな-Adj / N + そうです",
    sinhalaExplanation: "බාහිර පෙනුම දෙස බලා 'වගේ' හෝ 'එසේ පෙනෙනවා' (Looks like / Appears to be) යන අනුමානය ප්‍රකාශ කිරීමට භාවිතා වේ.",
    englishExplanation: "Expresses conjecture based on current visual evidence. Means 'looks like', 'seems like', or 'about to'.",
    examples: [
      {
        japanese: "たなかさんは日本へいきそうです。",
        hiragana: "たなかさんは にほんへ いきそうです。",
        sinhala: "තනකා මහතා ජපානයට යන පාටයි / යනවා වගේ පෙනෙනවා."
      },
      {
        japanese: "このくるまはあたらしそうです。",
        hiragana: "この くるまは あたらしそうです。",
        sinhala: "මෙම මෝටර් රථය අලුත් එකක් වගේ පෙනෙනවා."
      },
      {
        japanese: "このラーメンはおいしくなさそうです。",
        hiragana: "この ラーメンは おいしくなさそうです。",
        sinhala: "මෙම රාමන් එක රසවත් නැති පාටයි."
      }
    ]
  },
  {
    id: "g-68",
    index: "68",
    title: "~そうです (Hearsay)",
    romaji: "~Sou desu (Hearsay: I heard)",
    pattern: "ふつうけい (Plain Form) + そうです / だそうです",
    sinhalaExplanation: "වෙනත් අයෙකුගෙන් හෝ මාධ්‍යයකින් දැනගත් තොරතුරක් නැවත තවෙකුට පැවසීමේදී භාවිතා කරයි. '...ලු' හෝ 'අහන්න ලැබුණ විදිහට' (I heard that / Reportedly) යන අර්ථය ලබාදේ.",
    englishExplanation: "Used to pass on rumors, news, or reports heard from other sources. Translates as 'I heard that...' or 'They say that...'.",
    examples: [
      {
        japanese: "てんきよほうによると明日はゆきがふるそうです。",
        hiragana: "てんきよほうによると あしたは ゆきが ふるそうです。",
        sinhala: "කාලගුණ වාර්තාවට අනුව හෙට හිම වැටෙනවාලු."
      },
      {
        japanese: "田中さんは今日いそがしいそうです。",
        hiragana: "たなかさんは きょう いそがしいそうです。",
        sinhala: "තනකා මහතා අද කාර්යබහුලයිලු."
      }
    ]
  },
  {
    id: "g-69",
    index: "69 & 70",
    title: "~ようです / ~みたいです",
    romaji: "~You desu / ~Mitai desu",
    pattern: "• Plain Form + ようです (Noun の / な-Adj な + ようです)\n• Plain Form + みたいです (Noun / な-Adj direct + みたいです)",
    sinhalaExplanation: "යම්කිසි සාක්ෂියක් හෝ සංවේදනයක් මුල් කරගෙන 'වගේ' (Seems like / Looks like) යන නිගමනයට එළඹීමේදී යොදාගනී. '~みたいです' යනු මෙහි වඩාත් අවිධිමත්/වාචික (Casual) ලීලාවයි.",
    englishExplanation: "Expresses a subjective estimation, opinion, or judgement based on sensory evidence or circumstances. Mitai desu is the casual style.",
    examples: [
      {
        japanese: "かれは先生のようです。",
        hiragana: "かれは せんせいのようです。",
        sinhala: "ඔහු ගුරුවරයෙක් වගෙයි."
      },
      {
        japanese: "クラスにだれかいるようです。",
        hiragana: "クラスに だれか いるようです。",
        sinhala: "පන්ති කාමරයේ කවුරුහරි ඉන්නවා වගෙයි (ශබ්දය අනුව හෝ)."
      },
      {
        japanese: "あのおもしろい映画に、あのふたりはきょうだいみたいです。",
        hiragana: "あのおもしろい えいがに、あのふたりは きょうだいみたいです。",
        sinhala: "අර දෙදෙනා සහෝදරයන් වගේ."
      }
    ]
  },
  {
    id: "g-71",
    index: "71",
    title: "~らしいです",
    romaji: "~Rashii desu",
    pattern: "ふつうけい (Plain Form) + らしいです",
    sinhalaExplanation: "තමන් ඇසූ හෝ දුටු සාක්ෂි මත වක්‍රව අනුමාන කිරීම්දී භාවිතා කරයි (70% ක පමණ සත්‍යතාවයක් සහිතව අනුමාන කිරීම් - Hearing rumors). '...ලු' හෝ 'වගේ පෙනෙනවා'.",
    englishExplanation: "Represents objective conjectures based on reliable hearsay, information, or typical representations. Often translated as 'apparently' or 'typical of'.",
    examples: [
      {
        japanese: "やまださんはけっこんしているらしいです。",
        hiragana: "やまださんは けっこん しているらしいです。",
        sinhala: "යමදා මහතා විවාහ වෙලාලු / විවාහ වී ඇති බවක් ආරංචියි."
      },
      {
        japanese: "日本のりょうりはあまいらしいです。",
        hiragana: "にほんの りょうりは あまいらしいです。",
        sinhala: "ජපන් කෑම වර්ග පැණිරසයිලු."
      }
    ]
  },
  {
    id: "g-72",
    index: "72",
    title: "~とき",
    romaji: "~Toki (When)",
    pattern: "V (DF) / い-Adj + とき | な-Adj + なとき | N + のとき",
    sinhalaExplanation: "'යම් අවස්ථාවක' හෝ 'යම් කාල වකවානුවක/විට' (When...) යන අර්ථයෙන් ක්‍රියාපද, විශේෂණ පද හෝ නාමපද සමඟ යෙදේ.",
    englishExplanation: "Conveys the timing of an action or event. Corresponds to 'when' or 'at the time of'.",
    examples: [
      {
        japanese: "べんきょうするとき、あたまがいたいです。",
        hiragana: "べんきょう するとき、あたまが いたいです。",
        sinhala: "පාඩම් කරන විට, ඔලුව රිදෙනවා."
      },
      {
        japanese: "はるのとき、さくらがさきます。",
        hiragana: "はるのとき、さくらが さきます。",
        sinhala: "වසන්ත කාලයේදී, සකුරා මල් පිපෙනවා."
      },
      {
        japanese: "私は毎日学校へ行くとき朝ご飯をもっていきます。",
        hiragana: "わたしは まいにち がっこうへ いくとき あさごはんを もっていきます。",
        sinhala: "මම දිනපතා පාසල් යන විට උදේ ආහාරය රැගෙන යන්නෙමි."
      }
    ]
  },
  {
    id: "g-73",
    index: "73",
    title: "~と (Natural Condition)",
    romaji: "~To (If, Then)",
    pattern: "V (DF / ない) + と | い-Adj + と | な-Adj / N + だと",
    sinhalaExplanation: "'වුණාම / කරාම / නොකළාම' යන අදහසින් ස්වභාවික ප්‍රතිඵල, පුරුදු හෝ ස්ථිර නීති (Natural consequence / Fixed rule/ If, Then) ප්‍රකාශ කිරීමට යෙදේ.",
    englishExplanation: "Exhibits natural or guaranteed outcomes. Translates as 'If X, then Y inevitably occurs'. Often used for directions, nature, and mechanical operations.",
    examples: [
      {
        japanese: "このボタンをおすと、おかねがでます。",
        hiragana: "この ボタンを おすと、おかねが でます。",
        sinhala: "මෙම බොත්තම එබූ විට, මුදල් පිටතට පැමිණේ."
      },
      {
        japanese: "朝ご飯を食べないとあたまがいたくなります。",
        hiragana: "あさごはんを たべないと あたまが いたくなります。",
        sinhala: "උදේ ආහාරය නොකෑවොත් ඔලුව රිදෙන්න ගනියි."
      },
      {
        japanese: "まっすぐ行くとえきがあります。",
        hiragana: "まっすぐ いくと えきが あります。",
        sinhala: "කෙලින්ම ගිය විට දුම්රිය ස්ථානය හමුවේ."
      }
    ]
  },
  {
    id: "g-74",
    index: "74",
    title: "Prohibition: ~な",
    romaji: "Prohibition Form (~Na)",
    pattern: "V (Dictionary Form) + な",
    sinhalaExplanation: "'කරන්න එපා!' යනුවෙන් දැඩි තහනමක්, දැඩි විධානයක් හෝ පොදු නිවේදනයක් ප්‍රකාශ කිරීමට භාවිතා කරයි. උසස් අයට භාවිතා නොකරයි.",
    englishExplanation: "Strong negative prohibition command telling someone absolutely not to do something. Equivalent to 'don't do!'. Commonly found in road signs or military/informal context.",
    examples: [
      {
        japanese: "おさけをのむな！",
        hiragana: "おさけを のむな！",
        sinhala: "මධ්‍යසාර පානය කරන්න එපා!"
      },
      {
        japanese: "ここでおよぐなとかいてあります。",
        hiragana: "ここで およぐなと かいて あります。",
        sinhala: "මෙහි පිහිනන්න එපා කියා ලියා ඇත."
      },
      {
        japanese: "たばこをすうな！",
        hiragana: "たばこを すうな！",
        sinhala: "දුම්පානය කරන්න එපා!"
      }
    ]
  },
  {
    id: "g-75",
    index: "75",
    title: "~たら (Conditional If / When)",
    romaji: "~Tara (Conditional)",
    pattern: "• Positive Conditional: V (たら) / い-Adj (かったら) / な-Adj-N (だったら)\n• Negative Conditional: V (なかったら) / い-Adj (くなかったら) / な-Adj-N (~じゃなかったら)",
    sinhalaExplanation: "යම් කොන්දේසියක් සහිත වාක්‍යයක් සෑදීමේදී භාවිතා වේ. 'වුණොත් / කළොත් / යම් හෙයකින් සිදුවුවහොත්' (Conditional explanation) යන්න මෙයින් පැහැදිලි කරයි.",
    englishExplanation: "The most versatile and common Japanese conditional form ('If/When X, then Y'). Triggered once the action of the first verb completes.",
    examples: [
      {
        japanese: "日本へ行ったら、カメラをかいたいです。",
        hiragana: "にほんへ いったら、カメラを かいたいです。",
        sinhala: "ජපානයට ගියොත්, කැමරාවක් මිලදී ගන්න කැමතියි."
      },
      {
        japanese: "たべなかったら、おなかがすきます。",
        hiragana: "たべなかったら、おなかが すきます。",
        sinhala: "නොකෑවොත්, බඩගිනි වේවි."
      },
      {
        japanese: "おいしかったら、もっとたべます。",
        hiragana: "おいしかったら、もっと たべます。",
        sinhala: "රසවත් වුණොත්, තව කන්නම්."
      }
    ]
  }
];
