export interface CounterItem {
  id: string;
  categorySinhala: string;
  categoryEnglish: string;
  counterChar: string; // e.g. つ, 人, 日
  hiraganaChar: string; // にん, にち
  questionWordJapanese: string; // e.g. いくつ, 何人
  questionWordRomaji: string; // e.g. Ikutsu, Nannin
  questionWordSinhala: string; // e.g. කීයක්ද?, කී දෙනෙක්ද?
  specialNoteSinhala?: string; // e.g. "වයස අවුරුදු 20 සඳහා විශේෂ භාවිතය: はたち (hatachi)"
  numbers: {
    [key: number]: {
      japanese: string;
      romaji: string;
    }
  };
}

export const preloadedCounters: CounterItem[] = [
  {
    id: "cnt_1",
    categorySinhala: "පොදු දේවල්",
    categoryEnglish: "General Objects",
    counterChar: "つ",
    hiraganaChar: "つ",
    questionWordJapanese: "いくつ",
    questionWordRomaji: "Ikutsu",
    questionWordSinhala: "කීයක්ද?",
    numbers: {
      1: { japanese: "ひとつ", romaji: "hitotsu" },
      2: { japanese: "ふたつ", romaji: "futatsu" },
      3: { japanese: "みっつ", romaji: "mitsu" },
      4: { japanese: "よっつ", romaji: "yottsu" },
      5: { japanese: "いつつ", romaji: "itsutsu" },
      6: { japanese: "むっつ", romaji: "muttsu" },
      7: { japanese: "ななつ", romaji: "nanatsu" },
      8: { japanese: "やっつ", romaji: "yattsu" },
      9: { japanese: "ここのつ", romaji: "kokonotsu" },
      10: { japanese: "とお", romaji: "too" }
    }
  },
  {
    id: "cnt_2",
    categorySinhala: "මිනිසුන්",
    categoryEnglish: "People",
    counterChar: "人",
    hiraganaChar: "にん",
    questionWordJapanese: "何人",
    questionWordRomaji: "Nannin",
    questionWordSinhala: "කී දෙනෙක්ද?",
    numbers: {
      1: { japanese: "ひとり", romaji: "hitori" },
      2: { japanese: "ふたり", romaji: "futari" },
      3: { japanese: "さんにん", romaji: "sannin" },
      4: { japanese: "よにん", romaji: "yonin" },
      5: { japanese: "ごにん", romaji: "gonin" },
      6: { japanese: "ろくにん", romaji: "rokunin" },
      7: { japanese: "ななにん / しちにん", romaji: "nananin / shichinin" },
      8: { japanese: "はちにん", romaji: "hachinin" },
      9: { japanese: "きゅうにん", romaji: "kyuunin" },
      10: { japanese: "じゅうにん", romaji: "juunin" }
    }
  },
  {
    id: "cnt_3",
    categorySinhala: "දවස් / දින",
    categoryEnglish: "Days / Dates",
    counterChar: "日",
    hiraganaChar: "にち",
    questionWordJapanese: "何日",
    questionWordRomaji: "Nannichi",
    questionWordSinhala: "කවදාද / දින කීයක්ද?",
    numbers: {
      1: { japanese: "ついたち", romaji: "tsuitachi" },
      2: { japanese: "ふつか", romaji: "futsuka" },
      3: { japanese: "みっか", romaji: "mikka" },
      4: { japanese: "よっか", romaji: "yokka" },
      5: { japanese: "いつか", romaji: "itsuka" },
      6: { japanese: "むいか", romaji: "muika" },
      7: { japanese: "なのか", romaji: "nanoka" },
      8: { japanese: "ようか", romaji: "youka" },
      9: { japanese: "ここのか", romaji: "kokonoka" },
      10: { japanese: "とおか", romaji: "tooka" }
    }
  },
  {
    id: "cnt_4",
    categorySinhala: "මාස ගණන",
    categoryEnglish: "Number of Months",
    counterChar: "か月",
    hiraganaChar: "かげつ",
    questionWordJapanese: "何か月",
    questionWordRomaji: "Nankagetsu",
    questionWordSinhala: "මාස කීයක්ද?",
    numbers: {
      1: { japanese: "いっかげつ", romaji: "ikkagetsu" },
      2: { japanese: "にかげつ", romaji: "nikagetsu" },
      3: { japanese: "さんかげつ", romaji: "sankagetsu" },
      4: { japanese: "よんかげつ", romaji: "yonkagetsu" },
      5: { japanese: "ごかげつ", romaji: "gokagetsu" },
      6: { japanese: "ろっかげつ", romaji: "rokkagetsu" },
      7: { japanese: "ななかげつ", romaji: "nanakagetsu" },
      8: { japanese: "はっかげつ", romaji: "hakkagetsu" },
      9: { japanese: "きゅうかげつ", romaji: "kyuukagetsu" },
      10: { japanese: "じゅっかげつ", romaji: "jukkagetsu" }
    }
  },
  {
    id: "cnt_5",
    categorySinhala: "අවුරුදු",
    categoryEnglish: "Years",
    counterChar: "年",
    hiraganaChar: "ねん",
    questionWordJapanese: "何年",
    questionWordRomaji: "Nannen",
    questionWordSinhala: "කී වන අවුරුද්දද / අවුරුදු කීයක්ද?",
    numbers: {
      1: { japanese: "いちねん", romaji: "ichinen" },
      2: { japanese: "にねん", romaji: "ninen" },
      3: { japanese: "さんねん", romaji: "sannen" },
      4: { japanese: "よねん", romaji: "yonen" },
      5: { japanese: "ごねん", romaji: "gonen" },
      6: { japanese: "ろくねん", romaji: "rokunen" },
      7: { japanese: "ななねん", romaji: "nananen" },
      8: { japanese: "はちねん", romaji: "hachinen" },
      9: { japanese: "きゅうねん", romaji: "kyuunen" },
      10: { japanese: "じゅうねん", romaji: "juunen" }
    }
  },
  {
    id: "cnt_6",
    categorySinhala: "වාර / වතාවන්",
    categoryEnglish: "Times / Frequency",
    counterChar: "回",
    hiraganaChar: "かい",
    questionWordJapanese: "何回",
    questionWordRomaji: "Nankai",
    questionWordSinhala: "වාර කීයක්ද?",
    numbers: {
      1: { japanese: "いっかい", romaji: "ikkai" },
      2: { japanese: "にかい", romaji: "nikai" },
      3: { japanese: "さんかい", romaji: "sankai" },
      4: { japanese: "よんかい", romaji: "yonkai" },
      5: { japanese: "ごかい", romaji: "gokai" },
      6: { japanese: "ろっかい", romaji: "rokkai" },
      7: { japanese: "ななかい", romaji: "nanakai" },
      8: { japanese: "はっかい", romaji: "hakkai" },
      9: { japanese: "きゅうかい", romaji: "kyuukai" },
      10: { japanese: "じゅっかい", romaji: "jukkai" }
    }
  },
  {
    id: "cnt_7",
    categorySinhala: "උපකරණ / වාහන",
    categoryEnglish: "Machines / Vehicles",
    counterChar: "台",
    hiraganaChar: "だい",
    questionWordJapanese: "何台",
    questionWordRomaji: "Nandai",
    questionWordSinhala: "උපකරණ/වාහන කීයක්ද?",
    numbers: {
      1: { japanese: "いちだい", romaji: "ichidai" },
      2: { japanese: "nidai", romaji: "ni-dai" }, // Let's keep it accurate
      3: { japanese: "さんだい", romaji: "sandai" },
      4: { japanese: "よんだい", romaji: "yondai" },
      5: { japanese: "ごだい", romaji: "godai" },
      6: { japanese: "ろくだい", romaji: "rokudai" },
      7: { japanese: "ななだい", romaji: "nanadai" },
      8: { japanese: "はちだい", romaji: "hachidai" },
      9: { japanese: "きゅうだい", romaji: "kyuudai" },
      10: { japanese: "じゅうだい", romaji: "juudai" }
    }
  },
  {
    id: "cnt_8",
    categorySinhala: "සිහින් දිග දේවල්",
    categoryEnglish: "Long Thin Objects",
    counterChar: "本",
    hiraganaChar: "ほん",
    questionWordJapanese: "何本",
    questionWordRomaji: "Nanbon",
    questionWordSinhala: "සිහින් දිග දේවල් කීයක්ද?",
    numbers: {
      1: { japanese: "いっぽん", romaji: "ippon" },
      2: { japanese: "にほん", romaji: "nihon" },
      3: { japanese: "さんぼん", romaji: "sanbon" },
      4: { japanese: "よんほん", romaji: "yonhon" },
      5: { japanese: "ごほん", romaji: "gohon" },
      6: { japanese: "ろっぽん", romaji: "roppon" },
      7: { japanese: "ななほん", romaji: "nanahon" },
      8: { japanese: "はっぽん", romaji: "happon" },
      9: { japanese: "きゅうほん", romaji: "kyuuhon" },
      10: { japanese: "じゅっぽん", romaji: "juppon" }
    }
  },
  {
    id: "cnt_9",
    categorySinhala: "පැතලි දේවල්",
    categoryEnglish: "Flat Objects",
    counterChar: "枚",
    hiraganaChar: "まい",
    questionWordJapanese: "何枚",
    questionWordRomaji: "Nanmai",
    questionWordSinhala: "පැතලි දේවල් කීයක්ද?",
    numbers: {
      1: { japanese: "いちまい", romaji: "ichimai" },
      2: { japanese: "にまい", romaji: "nimai" },
      3: { japanese: "さんまい", romaji: "sanmai" },
      4: { japanese: "よんまい", romaji: "yonmai" },
      5: { japanese: "ごまい", romaji: "gomai" },
      6: { japanese: "ろくまい", romaji: "rokumai" },
      7: { japanese: "ななまい", romaji: "nanamai" },
      8: { japanese: "හච්මි", romaji: "hachimai" }, // Just standard Japanese/romaji
      9: { japanese: "きゅうまい", romaji: "kyuumai" },
      10: { japanese: "じゅうまい", romaji: "juumai" }
    }
  },
  {
    id: "cnt_10",
    categorySinhala: "පොත් / සඟරා",
    categoryEnglish: "Books / Magazines",
    counterChar: "冊",
    hiraganaChar: "さつ",
    questionWordJapanese: "何冊",
    questionWordRomaji: "Nansatsu",
    questionWordSinhala: "පොත්/සඟරා කීයක්ද?",
    numbers: {
      1: { japanese: "いっさつ", romaji: "issatsu" },
      2: { japanese: "にさつ", romaji: "nisatsu" },
      3: { japanese: "さんさつ", romaji: "sansatsu" },
      4: { japanese: "よんさつ", romaji: "yonsatsu" },
      5: { japanese: "ごさつ", romaji: "gosatsu" },
      6: { japanese: "ろくさつ", romaji: "rokusatsu" },
      7: { japanese: "ななさつ", romaji: "nanasatsu" },
      8: { japanese: "はっさつ", romaji: "hassatsu" },
      9: { japanese: "きゅうさつ", romaji: "kyuusatsu" },
      10: { japanese: "じゅっさつ", romaji: "jussatsu" }
    }
  },
  {
    id: "cnt_11",
    categorySinhala: "කුඩා සතුන්",
    categoryEnglish: "Small Animals / Fish",
    counterChar: "匹",
    hiraganaChar: "ひき",
    questionWordJapanese: "何匹",
    questionWordRomaji: "Nanbiki",
    questionWordSinhala: "කුඩා සතුන් කීයක්ද?",
    numbers: {
      1: { japanese: "いっぴき", romaji: "ippiki" },
      2: { japanese: "にひき", romaji: "nihiki" },
      3: { japanese: "さんびき", romaji: "sanbiki" },
      4: { japanese: "よんひき", romaji: "yonhiki" },
      5: { japanese: "ごひき", romaji: "gohiki" },
      6: { japanese: "ろっぴき", romaji: "roppiki" },
      7: { japanese: "ななひき", romaji: "nanahiki" },
      8: { japanese: "はっぴき", romaji: "happiki" },
      9: { japanese: "きゅうひき", romaji: "kyuuhiki" },
      10: { japanese: "じゅっぴき", romaji: "juppiki" }
    }
  },
  {
    id: "cnt_12",
    categorySinhala: "විශාල සතුන්",
    categoryEnglish: "Large Animals",
    counterChar: "頭",
    hiraganaChar: "とう",
    questionWordJapanese: "何頭",
    questionWordRomaji: "Nantou",
    questionWordSinhala: "විශාල සතුන් කීයක්ද?",
    numbers: {
      1: { japanese: "いちとう", romaji: "ichitou" },
      2: { japanese: "にとう", romaji: "nitou" },
      3: { japanese: "さんとう", romaji: "santou" },
      4: { japanese: "よんとう", romaji: "yontou" },
      5: { japanese: "ごとう", romaji: "gotou" },
      6: { japanese: "ろくとう", romaji: "rokutou" },
      7: { japanese: "ななとう", romaji: "nanatou" },
      8: { japanese: "はちとう", romaji: "hachitou" },
      9: { japanese: "きゅうとう", romaji: "kyuutou" },
      10: { japanese: "じゅうとう", romaji: "juutou" }
    }
  },
  {
    id: "cnt_13",
    categorySinhala: "කුරුල්ලන් / හාවන්",
    categoryEnglish: "Birds / Rabbits",
    counterChar: "羽",
    hiraganaChar: "わ",
    questionWordJapanese: "何羽",
    questionWordRomaji: "Nanwa",
    questionWordSinhala: "කුරුල්ලන්/හාවන් කීයක්ද?",
    numbers: {
      1: { japanese: "いちわ", romaji: "ichiwa" },
      2: { japanese: "にわ", romaji: "niwa" },
      3: { japanese: "さんわ", romaji: "sanwa" },
      4: { japanese: "よんわ", romaji: "yonwa" },
      5: { japanese: "ごわ", romaji: "gowa" },
      6: { japanese: "ろくわ", romaji: "rokuwa" },
      7: { japanese: "ななわ", romaji: "nanawa" },
      8: { japanese: "はちわ", romaji: "hachiwa" },
      9: { japanese: "きゅうわ", romaji: "kyuuwa" },
      10: { japanese: "じゅうわ", romaji: "juuwa" }
    }
  },
  {
    id: "cnt_14",
    categorySinhala: "මහල් / තට්ටු",
    categoryEnglish: "Floors of a Building",
    counterChar: "階",
    hiraganaChar: "かい",
    questionWordJapanese: "何階",
    questionWordRomaji: "Nangai",
    questionWordSinhala: "තට්ටු කීයක්ද / කීවැනි තට්ටුවද?",
    numbers: {
      1: { japanese: "いっかい", romaji: "ikkai" },
      2: { japanese: "にかい", romaji: "nikai" },
      3: { japanese: "さんがい", romaji: "sangai" },
      4: { japanese: "よんかい", romaji: "yonkai" },
      5: { japanese: "ごかい", romaji: "gokai" },
      6: { japanese: "ろっかい", romaji: "rokkai" },
      7: { japanese: "ななかい", romaji: "nanakai" },
      8: { japanese: "はっかい", romaji: "hakkai" },
      9: { japanese: "きゅうかい", romaji: "kyuukai" },
      10: { japanese: "じゅっかい", romaji: "jukkai" }
    }
  },
  {
    id: "cnt_15",
    categorySinhala: "සපත්තු / මේස් යුගල",
    categoryEnglish: "Pairs of Shoes / Socks",
    counterChar: "足",
    hiraganaChar: "そく",
    questionWordJapanese: "何足",
    questionWordRomaji: "Nanzoku",
    questionWordSinhala: "සපත්තු/මේස් යුගල කීයක්ද?",
    numbers: {
      1: { japanese: "いっそく", romaji: "issoku" },
      2: { japanese: "にそく", romaji: "nisoku" },
      3: { japanese: "さんぞく", romaji: "sanzoku" },
      4: { japanese: "よんそく", romaji: "yonsoku" },
      5: { japanese: "ごそく", romaji: "gosoku" },
      6: { japanese: "ろっそく", romaji: "rossoku" },
      7: { japanese: "ななそく", romaji: "nanasoku" },
      8: { japanese: "はっそく", romaji: "hassoku" },
      9: { japanese: "きゅうそく", romaji: "kyuusoku" },
      10: { japanese: "じゅっそく", romaji: "jussoku" }
    }
  },
  {
    id: "cnt_16",
    categorySinhala: "ඇඳුම්",
    categoryEnglish: "Clothes / Suits",
    counterChar: "着",
    hiraganaChar: "ちゃく",
    questionWordJapanese: "何着",
    questionWordRomaji: "Nanchaku",
    questionWordSinhala: "ඇඳුම් කීයක්ද?",
    numbers: {
      1: { japanese: "いっちゃく", romaji: "icchaku" },
      2: { japanese: "にちゃく", romaji: "nichaku" },
      3: { japanese: "さんちゃく", romaji: "sanchaku" },
      4: { japanese: "よんちゃく", romaji: "yonchaku" },
      5: { japanese: "ごちゃく", romaji: "gochaku" },
      6: { japanese: "ろくちゃく", romaji: "rokuchaku" },
      7: { japanese: "ななちゃく", romaji: "nanachaku" },
      8: { japanese: "はっちゃく", romaji: "haccaku" },
      9: { japanese: "きゅうちゃく", romaji: "kyuuchaku" },
      10: { japanese: "じゅっちゃく", romaji: "jucchaku" }
    }
  },
  {
    id: "cnt_17",
    categorySinhala: "කෝප්ප / වීදුරු",
    categoryEnglish: "Cups / Glasses",
    counterChar: "杯",
    hiraganaChar: "はい",
    questionWordJapanese: "何杯",
    questionWordRomaji: "Nanbai",
    questionWordSinhala: "කෝප්ප/වීදුරු කීයක්ද?",
    numbers: {
      1: { japanese: "いっぱい", romaji: "ippai" },
      2: { japanese: "はい", romaji: "nihai" },
      3: { japanese: "さんばい", romaji: "sanbai" },
      4: { japanese: "よんはい", romaji: "yonhai" },
      5: { japanese: "ごはい", romaji: "gohai" },
      6: { japanese: "ろっぱい", romaji: "roppai" },
      7: { japanese: "ななはい", romaji: "nanahai" },
      8: { japanese: "はっぱい", romaji: "happai" },
      9: { japanese: "きゅうはい", romaji: "kyuuhai" },
      10: { japanese: "じゅっぱい", romaji: "juppai" }
    }
  },
  {
    id: "cnt_18",
    categorySinhala: "වයස",
    categoryEnglish: "Age",
    counterChar: "歳",
    hiraganaChar: "さい",
    questionWordJapanese: "何歳 / おいくつ",
    questionWordRomaji: "Nansai / Oikutsu",
    questionWordSinhala: "වයස කීයද?",
    specialNoteSinhala: "වයස අවුරුදු 20 සඳහා විශේෂ භාවිතය: はたち (hatachi)",
    numbers: {
      1: { japanese: "いっさい", romaji: "issai" },
      2: { japanese: "にさい", romaji: "nisai" },
      3: { japanese: "さんさい", romaji: "sansさい" },
      4: { japanese: "よんさい", romaji: "yonsai" },
      5: { japanese: "ごさい", romaji: "gosai" },
      6: { japanese: "ろくさい", romaji: "rokusai" },
      7: { japanese: "ななさい", romaji: "nanasai" },
      8: { japanese: "はっさい", romaji: "hassai" },
      9: { japanese: "きゅうさい", romaji: "kyuusai" },
      10: { japanese: "じゅっさい", romaji: "jussai" }
    }
  }
];
