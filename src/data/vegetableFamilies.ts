// Vegetable Families & Field Crops Data from JFT/SSW Agriculture Textbook (Pages 45-46)
// "ක්ෂේත්‍ර බෝග සහ එළවළු වැඩ - ස්වභාවික වර්ගීකරණය"

export interface VegetableCrop {
  id: string;
  nameSi: string;
  nameJpKana: string;
  nameJpKanji?: string;
  nameRomaji: string;
  nameEn: string;
  familyId: string;
  familyNameSi: string;
  familyBotanical: string;
  familyNameJp: string;
  iconColor: string;
  badgeBg: string;
  descriptionSi: string;
  photoUrl: string;
}

export interface VegetableFamily {
  id: string;
  nameSi: string;
  botanicalName: string;
  nameJp: string;
  descriptionSi: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  cropIds: string[];
}

export const VEGETABLE_FAMILIES: VegetableFamily[] = [
  {
    id: "cucurbitaceae",
    nameSi: "කැකිරි පවුල",
    botanicalName: "Cucurbitaceae",
    nameJp: "ウリ科 (Uri-ka)",
    descriptionSi: "වැල් ආකාරයෙන් වැඩෙන, ඝන පොත්තක් සහ බීජ රාශියක් ඇති එළවළු",
    badgeBg: "bg-emerald-50",
    badgeBorder: "border-emerald-200",
    badgeText: "text-emerald-800",
    cropIds: ["cucumber", "melon", "watermelon", "pumpkin"]
  },
  {
    id: "solanaceae",
    nameSi: "බටු පවුල",
    botanicalName: "Solanaceae",
    nameJp: "ナス科 (Nasu-ka)",
    descriptionSi: "පත්‍ර සහ ඵල වල විශේෂ සුවඳක් සහ විටමින් බහුල එළවළු",
    badgeBg: "bg-purple-50",
    badgeBorder: "border-purple-200",
    badgeText: "text-purple-800",
    cropIds: ["eggplant", "tomato", "bell_pepper", "potato"]
  },
  {
    id: "liliaceae",
    nameSi: "ලිලී පවුල",
    botanicalName: "Liliaceae",
    nameJp: "ユリ科 (Yuri-ka)",
    descriptionSi: "බල්බ ආකාරයෙන් වැඩෙන හෝ දිගටි පත්‍ර සහිත සුවඳැති එළවළු",
    badgeBg: "bg-amber-50",
    badgeBorder: "border-amber-200",
    badgeText: "text-amber-800",
    cropIds: ["onion", "leek"]
  },
  {
    id: "asteraceae",
    nameSi: "සපුෂ්ප ශාක පවුල",
    botanicalName: "Asteraceae",
    nameJp: "キク科 (Kiku-ka)",
    descriptionSi: "පත්‍ර හෝ මුල් ආකාරයෙන් ආහාරයට ගන්නා සංයුක්ත මල් සහිත පවුල",
    badgeBg: "bg-lime-50",
    badgeBorder: "border-lime-200",
    badgeText: "text-lime-800",
    cropIds: ["lettuce", "gobo", "shungiku"]
  },
  {
    id: "chenopodiaceae",
    nameSi: "Chenopodiaceae පවුල",
    botanicalName: "Chenopodiaceae",
    nameJp: "アカザ科 (Akaza-ka)",
    descriptionSi: "යකඩ සහ පෝෂ්‍ය පදාර්ථ පිරි තද කොළ පැහැති පලා වර්ග",
    badgeBg: "bg-emerald-50",
    badgeBorder: "border-emerald-200",
    badgeText: "text-emerald-800",
    cropIds: ["spinach"]
  },
  {
    id: "brassicaceae",
    nameSi: "Brassicaceae පවුල",
    botanicalName: "Brassicaceae",
    nameJp: "アブラナ科 (Aburana-ka)",
    descriptionSi: "කුරුස හැඩැති මල් හටගන්නා, හිස් හෝ අල ලෙස වගා කෙරෙන එළවළු",
    badgeBg: "bg-teal-50",
    badgeBorder: "border-teal-200",
    badgeText: "text-teal-800",
    cropIds: ["cabbage", "chinese_cabbage", "daikon"]
  },
  {
    id: "umbelliferae",
    nameSi: "Umbelliferae පවුල",
    botanicalName: "Umbelliferae",
    nameJp: "セリ科 (Seri-ka)",
    descriptionSi: "කුඩ හැඩැති පුෂ්ප මංජරි සහ කේතුකාකාර මුල් සහිත එළවළු",
    badgeBg: "bg-orange-50",
    badgeBorder: "border-orange-200",
    badgeText: "text-orange-800",
    cropIds: ["carrot"]
  },
  {
    id: "araceae",
    nameSi: "Araceae පවුල",
    botanicalName: "Araceae",
    nameJp: "サトイモ科 (Satoimo-ka)",
    descriptionSi: "ලොකු පත්‍ර සහ පිෂ්ඨය බහුල භූගත අල හටගන්නා ශාක",
    badgeBg: "bg-amber-50",
    badgeBorder: "border-amber-200",
    badgeText: "text-amber-800",
    cropIds: ["satoimo"]
  },
  {
    id: "gramineae",
    nameSi: "Gramineae පවුල",
    botanicalName: "Gramineae",
    nameJp: "イネ科 (Ine-ka)",
    descriptionSi: "තෘණ කුලයට අයත්, කරල් සහිත ධාන්‍ය හා බඩඉරිඟු බෝග",
    badgeBg: "bg-yellow-50",
    badgeBorder: "border-yellow-200",
    badgeText: "text-yellow-800",
    cropIds: ["corn"]
  },
  {
    id: "convolvulaceae",
    nameSi: "Convolvulaceae පවුල",
    botanicalName: "Convolvulaceae",
    nameJp: "ヒルガオ科 (Hirugao-ka)",
    descriptionSi: "වැල් ආකාරයෙන් පැතිරෙන, පැණි රසැති භූගත අල හටගන්නා ශාක",
    badgeBg: "bg-rose-50",
    badgeBorder: "border-rose-200",
    badgeText: "text-rose-800",
    cropIds: ["sweet_potato"]
  },
  {
    id: "rosaceae",
    nameSi: "රෝස (Rosaceae) පවුල",
    botanicalName: "Rosaceae",
    nameJp: "バラ科 (Bara-ka)",
    descriptionSi: "රෝස කුලයේ, ආකර්ෂණීය සුවඳැති සහ රසවත් රතු පැහැති පලතුරු/බෝග",
    badgeBg: "bg-pink-50",
    badgeBorder: "border-pink-200",
    badgeText: "text-pink-800",
    cropIds: ["strawberry"]
  },
  {
    id: "fabaceae",
    nameSi: "කරල් / බෝංචි (Fabaceae) පවුල",
    botanicalName: "Fabaceae",
    nameJp: "マメ科 (Mame-ka)",
    descriptionSi: "නයිට්‍රජන් තිර කරන, කරල් තුළ බීජ හටගන්නා පෝෂ්‍යදායී බෝංචි හා සෝයා බෝග",
    badgeBg: "bg-emerald-50",
    badgeBorder: "border-emerald-200",
    badgeText: "text-emerald-800",
    cropIds: ["edamame"]
  }
];

export const VEGETABLE_CROPS: VegetableCrop[] = [
  // 1. Cucurbitaceae (කැකිරි පවුල)
  {
    id: "cucumber",
    nameSi: "පිපිඤ්ඤා",
    nameJpKana: "きゅうり",
    nameJpKanji: "胡瓜",
    nameRomaji: "Kyuuri",
    nameEn: "Cucumber",
    familyId: "cucurbitaceae",
    familyNameSi: "කැකිරි පවුල",
    familyBotanical: "Cucurbitaceae",
    familyNameJp: "ウリ科",
    iconColor: "#2d6a4f",
    badgeBg: "bg-emerald-50",
    descriptionSi: "සිහින් දිගටි කොළ පැහැති ජලය බහුල ජපන් පිපිඤ්ඤා",
    photoUrl: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=600&q=85"
  },
  {
    id: "melon",
    nameSi: "පැණි පුහුල් (මෙලන්)",
    nameJpKana: "メロン",
    nameRomaji: "Meron",
    nameEn: "Melon",
    familyId: "cucurbitaceae",
    familyNameSi: "කැකිරි පවුල",
    familyBotanical: "Cucurbitaceae",
    familyNameJp: "ウリ科",
    iconColor: "#84a98c",
    badgeBg: "bg-emerald-50",
    descriptionSi: "රසවත් සුවඳැති ජපන් පැණි පුහුල්",
    photoUrl: "https://images.unsplash.com/photo-1571575173700-afb9492e6a50?auto=format&fit=crop&w=600&q=85"
  },
  {
    id: "watermelon",
    nameSi: "කොමඩු",
    nameJpKana: "すいか",
    nameJpKanji: "西瓜",
    nameRomaji: "Suika",
    nameEn: "Watermelon",
    familyId: "cucurbitaceae",
    familyNameSi: "කැකිරි පවුල",
    familyBotanical: "Cucurbitaceae",
    familyNameJp: "ウリ科",
    iconColor: "#e63946",
    badgeBg: "bg-rose-50",
    descriptionSi: "ගිම්හානයේ ජපානයේ වඩාත් ජනප්‍රිය ඉස්ම සහිත කොමඩු",
    photoUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=85"
  },
  {
    id: "pumpkin",
    nameSi: "වට්ටක්කා",
    nameJpKana: "かぼちゃ",
    nameJpKanji: "南瓜",
    nameRomaji: "Kabocha",
    nameEn: "Pumpkin",
    familyId: "cucurbitaceae",
    familyNameSi: "කැකිරි පවුල",
    familyBotanical: "Cucurbitaceae",
    familyNameJp: "ウリ科",
    iconColor: "#2a9d8f",
    badgeBg: "bg-amber-50",
    descriptionSi: "තද කොළ පැහැති පොත්තක් සහ රසවත් කහ පැහැති මදයක් ඇති ජපන් කබෝචා",
    photoUrl: "https://images.unsplash.com/photo-1506917728037-b6fb01c4e74b?auto=format&fit=crop&w=600&q=85"
  },

  // 2. Solanaceae (බටු පවුල)
  {
    id: "eggplant",
    nameSi: "වම්බටු",
    nameJpKana: "なす",
    nameJpKanji: "茄子",
    nameRomaji: "Nasu",
    nameEn: "Eggplant",
    familyId: "solanaceae",
    familyNameSi: "බටු පවුල",
    familyBotanical: "Solanaceae",
    familyNameJp: "ナス科",
    iconColor: "#582f7d",
    badgeBg: "bg-purple-50",
    descriptionSi: "තද දම් පැහැති සිනිඳු සමක් සහිත ජපන් වම්බටු",
    photoUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=85"
  },
  {
    id: "tomato",
    nameSi: "තක්කාලි",
    nameJpKana: "トマト",
    nameRomaji: "Tomato",
    nameEn: "Tomato",
    familyId: "solanaceae",
    familyNameSi: "බටු පවුල",
    familyBotanical: "Solanaceae",
    familyNameJp: "ナス科",
    iconColor: "#e63946",
    badgeBg: "bg-red-50",
    descriptionSi: "දීප්තිමත් රතු පැහැති රසවත් තක්කාලි",
    photoUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=85"
  },
  {
    id: "bell_pepper",
    nameSi: "මාළු මිරිස් / පීමන්",
    nameJpKana: "ピーマン",
    nameRomaji: "Piiman",
    nameEn: "Sweet Pepper / Green Pepper",
    familyId: "solanaceae",
    familyNameSi: "බටු පවුල",
    familyBotanical: "Solanaceae",
    familyNameJp: "ナス科",
    iconColor: "#38b000",
    badgeBg: "bg-green-50",
    descriptionSi: "කොළ පැහැති විටමින් සී පිරි මාළු මිරිස්",
    photoUrl: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=85"
  },
  {
    id: "potato",
    nameSi: "අර්තාපල් / අල",
    nameJpKana: "じゃがいも",
    nameRomaji: "Jagaimo",
    nameEn: "Potato",
    familyId: "solanaceae",
    familyNameSi: "බටු පවුල",
    familyBotanical: "Solanaceae",
    familyNameJp: "ナス科",
    iconColor: "#b08968",
    badgeBg: "bg-amber-50",
    descriptionSi: "පිෂ්ඨය බහුල පෝෂ්‍යදායී අර්තාපල් අල",
    photoUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=85"
  },

  // 3. Liliaceae (ලිලී පවුල)
  {
    id: "onion",
    nameSi: "ලූනු (රවුම් ලූනු)",
    nameJpKana: "たまねぎ",
    nameJpKanji: "玉ねぎ",
    nameRomaji: "Tamanegi",
    nameEn: "Onion",
    familyId: "liliaceae",
    familyNameSi: "ලිලී පවුල",
    familyBotanical: "Liliaceae",
    familyNameJp: "ユリ科",
    iconColor: "#d4a373",
    badgeBg: "bg-amber-50",
    descriptionSi: "රන් දුඹුරු පැහැති බල්බයක් සහිත පැණි රසැති ලූනු",
    photoUrl: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=85"
  },
  {
    id: "leek",
    nameSi: "ලීක්ස් / ලූනු කොළ",
    nameJpKana: "ねぎ",
    nameJpKanji: "葱",
    nameRomaji: "Negi",
    nameEn: "Welsh Onion / Leek",
    familyId: "liliaceae",
    familyNameSi: "ලිලී පවුල",
    familyBotanical: "Liliaceae",
    familyNameJp: "ユリ科",
    iconColor: "#52b788",
    badgeBg: "bg-emerald-50",
    descriptionSi: "දිගු සුදු හා කොළ පැහැති ජපන් නෙගි (ලීක්ස්)",
    photoUrl: "https://images.unsplash.com/photo-1584270359004-20a21074e508?auto=format&fit=crop&w=600&q=85"
  },

  // 4. Asteraceae (සපුෂ්ප ශාක පවුල)
  {
    id: "lettuce",
    nameSi: "ලෙටස්",
    nameJpKana: "レタス",
    nameRomaji: "Retasu",
    nameEn: "Lettuce",
    familyId: "asteraceae",
    familyNameSi: "සපුෂ්ප ශාක පවුල",
    familyBotanical: "Asteraceae",
    familyNameJp: "キク科",
    iconColor: "#70e000",
    badgeBg: "bg-lime-50",
    descriptionSi: "නැවුම් සලාද සඳහා ගන්නා හැපෙනසුළු ලෙටස් කොළ",
    photoUrl: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=600&q=85"
  },
  {
    id: "gobo",
    nameSi: "ගොබෝ (බර්ඩොක් මුල්)",
    nameJpKana: "ごぼう",
    nameJpKanji: "牛蒡",
    nameRomaji: "Gobou",
    nameEn: "Great Burdock",
    familyId: "asteraceae",
    familyNameSi: "සපුෂ්ප ශාක පවුල",
    familyBotanical: "Asteraceae",
    familyNameJp: "キク科",
    iconColor: "#6f4e37",
    badgeBg: "bg-stone-50",
    descriptionSi: "තන්තු බහුල, දිගු සිහින් දුඹුරු පැහැති ජපන් ගොබෝ මුල්",
    photoUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=85"
  },
  {
    id: "shungiku",
    nameSi: "ෂින්ගිකු (කැපුම් චන්ද්‍රමල්ලිකා කොළ)",
    nameJpKana: "しゅんぎく",
    nameJpKanji: "春菊",
    nameRomaji: "Shungiku",
    nameEn: "Garland Chrysanthemum",
    familyId: "asteraceae",
    familyNameSi: "සපුෂ්ප ශාක පවුල",
    familyBotanical: "Asteraceae",
    familyNameJp: "キク科",
    iconColor: "#38b000",
    badgeBg: "bg-green-50",
    descriptionSi: "සුකියකි සහ සුප් සඳහා යොදන සුවඳවත් ෂින්ගිකු පත්‍ර",
    photoUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=85"
  },

  // 5. Chenopodiaceae (Chenopodiaceae පවුල)
  {
    id: "spinach",
    nameSi: "නිවිති",
    nameJpKana: "ほうれんそう",
    nameJpKanji: "ほうれん草",
    nameRomaji: "Hourensou",
    nameEn: "Spinach",
    familyId: "chenopodiaceae",
    familyNameSi: "Chenopodiaceae පවුල",
    familyBotanical: "Chenopodiaceae",
    familyNameJp: "アカザ科",
    iconColor: "#1b4332",
    badgeBg: "bg-emerald-50",
    descriptionSi: "යකඩ සහ විටමින් පිරි තද කොළ පැහැති ජපන් හෝරෙන්සෝ (නිවිති)",
    photoUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=85"
  },

  // 6. Brassicaceae (Brassicaceae පවුල)
  {
    id: "cabbage",
    nameSi: "ගෝවා",
    nameJpKana: "キャベツ",
    nameRomaji: "Kyabetsu",
    nameEn: "Cabbage",
    familyId: "brassicaceae",
    familyNameSi: "Brassicaceae පවුල",
    familyBotanical: "Brassicaceae",
    familyNameJp: "アブラナ科",
    iconColor: "#52b788",
    badgeBg: "bg-teal-50",
    descriptionSi: "පත්‍ර තදින් එතුණු රවුම් හැඩැති ගෝවා ගෙඩිය",
    photoUrl: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=600&q=85"
  },
  {
    id: "chinese_cabbage",
    nameSi: "චීන ගෝවා (හකුසායි)",
    nameJpKana: "はくさい",
    nameJpKanji: "白菜",
    nameRomaji: "Hakusai",
    nameEn: "Chinese Cabbage",
    familyId: "brassicaceae",
    familyNameSi: "Brassicaceae පවුල",
    familyBotanical: "Brassicaceae",
    familyNameJp: "アブラナ科",
    iconColor: "#95d5b2",
    badgeBg: "bg-teal-50",
    descriptionSi: "දිගටි, මෘදු පැණි රසැති ජපන් ශීත සෘතු චීන ගෝවා",
    photoUrl: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=600&q=85"
  },
  {
    id: "daikon",
    nameSi: "රාබු (සුදු රාබු)",
    nameJpKana: "だいこん",
    nameJpKanji: "大根",
    nameRomaji: "Daikon",
    nameEn: "Daikon Radish",
    familyId: "brassicaceae",
    familyNameSi: "Brassicaceae පවුල",
    familyBotanical: "Brassicaceae",
    familyNameJp: "アブラナ科",
    iconColor: "#f8f9fa",
    badgeBg: "bg-slate-50",
    descriptionSi: "දිගු විශාල සුදු පැහැති ඉස්ම සහිත ජපන් දයිකොන් රාබු",
    photoUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=85"
  },

  // 7. Umbelliferae (Umbelliferae පවුල)
  {
    id: "carrot",
    nameSi: "කැරට්",
    nameJpKana: "にんじん",
    nameJpKanji: "人参",
    nameRomaji: "Ninjin",
    nameEn: "Carrot",
    familyId: "umbelliferae",
    familyNameSi: "Umbelliferae පවුල",
    familyBotanical: "Umbelliferae",
    familyNameJp: "セリ科",
    iconColor: "#f77f00",
    badgeBg: "bg-orange-50",
    descriptionSi: "දීප්තිමත් තැඹිලි පැහැති විටමින් ඒ පිරි රසවත් කැරට් අල",
    photoUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=85"
  },

  // 8. Araceae (Araceae පවුල)
  {
    id: "satoimo",
    nameSi: "සතෝඉමෝ (ජපන් කිරි අල)",
    nameJpKana: "さといも",
    nameJpKanji: "里芋",
    nameRomaji: "Satoimo",
    nameEn: "Taro (Colocasia esculenta)",
    familyId: "araceae",
    familyNameSi: "Araceae පවුල",
    familyBotanical: "Araceae",
    familyNameJp: "サトイモ科",
    iconColor: "#7f5539",
    badgeBg: "bg-stone-50",
    descriptionSi: "සුමුදු, මැලියම් ගතියක් සහිත රසවත් සාම්ප්‍රදායික ජපන් සතෝඉමෝ අල",
    photoUrl: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=600&q=85"
  },

  // 9. Gramineae (Gramineae පවුල)
  {
    id: "corn",
    nameSi: "බඩ ඉරිඟු",
    nameJpKana: "とうもろこし",
    nameJpKanji: "玉蜀黍",
    nameRomaji: "Toumorokoshi",
    nameEn: "Sweet Corn",
    familyId: "gramineae",
    familyNameSi: "Gramineae පවුල",
    familyBotanical: "Gramineae",
    familyNameJp: "イネ科",
    iconColor: "#fcbf49",
    badgeBg: "bg-amber-50",
    descriptionSi: "රන්වන් කහ පැහැති පැණි රස බීජ පිරි බඩ ඉරිඟු කරල්",
    photoUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=85"
  },

  // 10. Convolvulaceae (Convolvulaceae පවුල)
  {
    id: "sweet_potato",
    nameSi: "බතල (සත්සුමඉමෝ)",
    nameJpKana: "さつまいも",
    nameJpKanji: "薩摩芋",
    nameRomaji: "Satsumaimo",
    nameEn: "Sweet Potato",
    familyId: "convolvulaceae",
    familyNameSi: "Convolvulaceae පවුල",
    familyBotanical: "Convolvulaceae",
    familyNameJp: "ヒルガオ科",
    iconColor: "#9c27b0",
    badgeBg: "bg-purple-50",
    descriptionSi: "රතු දම් පැහැති පොත්තක් සහ මී පැණි බඳු රසයක් ඇති ජපන් බතල",
    photoUrl: "https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?auto=format&fit=crop&w=600&q=85"
  },

  // 11. Rosaceae (රෝස පවුල)
  {
    id: "strawberry",
    nameSi: "ස්ට්‍රෝබෙරි",
    nameJpKana: "いちご",
    nameJpKanji: "苺",
    nameRomaji: "Ichigo",
    nameEn: "Strawberry",
    familyId: "rosaceae",
    familyNameSi: "රෝස (Rosaceae) පවුල",
    familyBotanical: "Rosaceae",
    familyNameJp: "バラ科",
    iconColor: "#e63946",
    badgeBg: "bg-pink-50",
    descriptionSi: "දීප්තිමත් රතු පැහැති පැණිරස සුවඳවත් ජපන් ස්ට්‍රෝබෙරි",
    photoUrl: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=85"
  },

  // 12. Fabaceae (කරල් / බෝංචි පවුල)
  {
    id: "edamame",
    nameSi: "එදමාමේ (කොළ සෝයා කරල්)",
    nameJpKana: "えだまめ",
    nameJpKanji: "枝豆",
    nameRomaji: "Edamame",
    nameEn: "Green Soybeans / Edamame",
    familyId: "fabaceae",
    familyNameSi: "කරල් / බෝංචි (Fabaceae) පවුල",
    familyBotanical: "Fabaceae",
    familyNameJp: "マメ科",
    iconColor: "#40916c",
    badgeBg: "bg-emerald-50",
    descriptionSi: "නැවුම් කොළ පැහැති කරල් තුළ බීජ 2-3ක් අඩංගු ජපන් එදමාමේ",
    photoUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=85"
  }
];
