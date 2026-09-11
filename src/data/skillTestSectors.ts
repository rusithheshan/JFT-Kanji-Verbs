export interface SSWSector {
  id: string;
  titleSi: string;
  titleJp: string;
  titleEn: string;
  descriptionSi: string;
  status: "available_in_sl" | "upcoming" | "info_only";
  testFormat: string;
  testLanguage: string;
  icon: string;
  subCategories?: string[];
  keyTopics: string[];
  officialUrl?: string;
  officialUrlLabel?: string;
  prometricUrl?: string;
}

export const sswSectors: SSWSector[] = [
  {
    id: "agriculture",
    titleSi: "කෘෂිකර්මාන්තය",
    titleJp: "農業 (耕種・畜産)",
    titleEn: "Agriculture (Crop & Livestock Farming)",
    descriptionSi: "ශ්‍රී ලංකාවේ Prometric මධ්‍යස්ථාන මගින් පවත්වනු ලබන ජපානයේ කෘෂිකාර්මික කුසලතා ඇගයීම් පරීක්ෂණය (General Crop Farming & Livestock Farming). මෙහි සාමාන්‍ය වගා කෘෂිකර්මය සහ කෘෂිකාර්මික ජපන් භාෂා පෙළපොත් දෙකම සම්පූර්ණයෙන්ම ඇතුළත් කර ඇත.",
    status: "available_in_sl",
    testFormat: "CBT (Computer Based Test) - බහුවරණ ප්‍රශ්න (MCQ) සහ ප්‍රායෝගික නිදර්ශන",
    testLanguage: "සිංහල භාෂාවෙන් (කෘෂිකාර්මික දැනුම) + ජපන් භාෂාව (කෘෂිකාර්මික ජපන් ප්‍රකාශන)",
    icon: "Wheat",
    subCategories: [
      "සාමාන්‍ය වගා කෘෂිකර්මය (General Crop Farming / 耕種農業全般)",
      "සාමාන්‍ය පශු සම්පත් කෘෂිකර්මය (Livestock Farming / 畜産農業全般)",
      "කෘෂිකාර්මික ජපන් භාෂාව (Agricultural Japanese / 農業日本語)"
    ],
    keyTopics: [
      "වී වගාව, එළවළු, පළතුරු වෘක්ෂ සහ හරිතාගාර",
      "පස සකස් කිරීම, pH අගය, පොහොර සහ ජල සම්පාදනය",
      "බීජ පැල, රුක් කප්පාදුව, බද්ධ කිරීම් සහ පරාගණය",
      "යන්ත්‍රෝපකරණ ක්‍රියාකරවීම, පළිබෝධනාශක සහ සෞඛ්‍ය ආරක්ෂාව",
      "කෘෂිකාර්මික වචන මාලාව සහ උපදෙස් වාක්‍ය"
    ],
    officialUrl: "http://asat-nca.jp/",
    officialUrlLabel: "ජාතික කෘෂිකර්ම මණ්ඩලය (NCA Japan)",
    prometricUrl: "https://www.prometric-jp.com/en/ssw/test_list/"
  },
  {
    id: "food_service",
    titleSi: "ආහාර සේවා සහ අවන්හල් කර්මාන්තය",
    titleJp: "外食業 (Food Service Industry)",
    titleEn: "Food Service Industry",
    descriptionSi: "ශ්‍රී ලංකාවේ පවත්වනු ලබන අවන්හල් සහ ආහාර සත්කාරක සේවා නිපුණතා පරීක්ෂණය. පාරිභෝගික සත්කාර (Customer Service), ආහාර පිසීම (Food Preparation) සහ සනීපාරක්ෂක කළමනාකරණය (Hygiene & Food Safety - HACCP) ආවරණය කරයි.",
    status: "available_in_sl",
    testFormat: "CBT පරීක්ෂණය - ප්‍රශ්න 45 ක් (විනාඩි 80)",
    testLanguage: "ජපන් භාෂාවෙන් (හිරගනා/කතකනා සහිත සරල ජපන් - N4 මට්ටම)",
    icon: "Utensils",
    subCategories: [
      "ආහාර පිසීම සහ මුළුතැන්ගෙයි කටයුතු (Cooking / 調理)",
      "පාරිභෝගික සත්කාර සහ පිළිගැනීම (Customer Service / 接客全般)",
      "සනීපාරක්ෂාව සහ ආහාර සුරක්ෂිතතාව (Hygiene Management / 衛生管理 - HACCP)"
    ],
    keyTopics: [
      "HACCP මූලධර්ම සහ ආහාර විෂවීම් වැළැක්වීම",
      "මුළුතැන්ගෙයි පිහි භාවිතය, ශීතකරණ උෂ්ණත්ව සහ මිනුම්",
      "ආගන්තුක සත්කාරය (Omotenashi) සහ ඇණවුම් ලබා ගැනීම",
      "මුදල් අයකැමි සහ පිරිසිදු කිරීමේ පියවර"
    ],
    officialUrl: "https://www.jfnet.or.jp/contents/gaiin/",
    officialUrlLabel: "OTAFF ජපන් අවන්හල් සංගමය (JFNet)",
    prometricUrl: "https://www.prometric-jp.com/en/ssw/test_list/"
  },
  {
    id: "nursing_care",
    titleSi: "සාත්තු සේවය",
    titleJp: "介護 (Nursing Care)",
    titleEn: "Nursing Caregiving",
    descriptionSi: "ශ්‍රී ලංකාවේ Prometric මගින් පැවැත්වෙන ජපන් වැඩිහිටි හා රෝගී සාත්තු සේවා නිපුණතා පරීක්ෂණය (Caregiving Skills & Japanese for Caregivers).",
    status: "available_in_sl",
    testFormat: "CBT පරීක්ෂණය - ප්‍රශ්න 45 (විනාඩි 60) + ජපන් භාෂාව ප්‍රශ්න 15 (විනාඩි 30)",
    testLanguage: "සිංහල / ඉංග්‍රීසි (සාත්තු දැනුම) + ජපන් භාෂාවෙන් (සාත්තු ජපන්)",
    icon: "HeartPulse",
    subCategories: [
      "සාත්තු සේවාවේ මූලධර්ම (Fundamentals of Care)",
      "ශරීර චලන සහ යාන්ත්‍ර විද්‍යාව (Body Mechanics)",
      "දෛනික ජීවන ආධාර (ආහාර, ඇඳුම්, ස්නානය, වැසිකිළි)",
      "සාත්තු ජපන් වචන සහ වාර්තාකරණය"
    ],
    keyTopics: [
      "මානව ගරුත්වය සහ ස්වාධීනත්වයට සහය වීම",
      "වීල්බැරෝ/රෝද පුටු සහ ඇඳන් මාරු කිරීමේ ක්‍රම",
      "ආහාර කැවීම, ඖෂධ ලබා දීම සහ සනීපාරක්ෂාව",
      "හදිසි අවස්ථා සහ ප්‍රථමාධාර"
    ],
    officialUrl: "https://www.mhlw.go.jp/stf/newpage_000117702.html",
    officialUrlLabel: "ජපන් සෞඛ්‍ය හා කම්කරු අමාත්‍යාංශය (MHLW)",
    prometricUrl: "https://www.prometric-jp.com/en/ssw/test_list/"
  },
  {
    id: "food_manufacturing",
    titleSi: "ආහාර හා පාන නිෂ්පාදනය",
    titleJp: "飲食料品製造業",
    titleEn: "Food & Beverage Manufacturing",
    descriptionSi: "ජපානයේ ආහාර සැකසුම් කර්මාන්තශාලා, බේකරි, කල්තබා ගැනීමේ නිෂ්පාදන ආයතන සඳහා වන නිපුණතා පරීක්ෂණය.",
    status: "available_in_sl",
    testFormat: "CBT පරීක්ෂණය - බහුවරණ ප්‍රශ්න",
    testLanguage: "ජපන් භාෂාවෙන්",
    icon: "Factory",
    subCategories: [
      "සාමාන්‍ය ආහාර නිෂ්පාදනය",
      "HACCP සහ තත්ත්ව පාලනය",
      "කර්මාන්තශාලා ආරක්ෂාව සහ යන්ත්‍ර භාවිතය"
    ],
    keyTopics: [
      "ආහාර සැකසුම් පියවර සහ බැක්ටීරියා වළක්වා ගැනීම",
      "ඇසුරුම්කරණය සහ කල් ඉකුත්වීමේ පාලනය",
      "5S සංකල්පය (Seiri, Seiton, Seiso, Seiketsu, Shitsuke)"
    ],
    officialUrl: "https://shokusan-kentei.jp/",
    officialUrlLabel: "ආහාර කර්මාන්ත නිපුණතා මණ්ඩලය (Shokusan)",
    prometricUrl: "https://www.prometric-jp.com/en/ssw/test_list/"
  },
  {
    id: "construction",
    titleSi: "ඉදිකිරීම් ක්ෂේත්‍රය",
    titleJp: "建設業",
    titleEn: "Construction Sector",
    descriptionSi: "ජපානයේ කොන්ක්‍රීට්, ආකෘති පලංචි, පලංචි ඉදිකිරීම, යකඩ රාමු සහ බර යන්ත්‍ර ක්‍රියාකරවීම ආශ්‍රිත නිපුණතා පරීක්ෂණය.",
    status: "available_in_sl",
    testFormat: "CBT ලිඛිත පරීක්ෂණය + ප්‍රායෝගික පරීක්ෂණය",
    testLanguage: "ජපන් / සිංහල",
    icon: "HardHat",
    subCategories: [
      "කොන්ක්‍රීට් වැඩ සහ ආකෘති ලෑලි",
      "යකඩ වැඩ සහ පලංචි සවිකිරීම",
      "ඉදිකිරීම් යන්ත්‍ර සහ ආරක්ෂාව"
    ],
    keyTopics: [
      "උසක වැඩ කිරීමේ ආරක්ෂක පටි සහ හිස්වැසුම්",
      "සැලසුම් කියවීම සහ මිනුම් ගැනීම",
      "ඉදිකිරීම් උපදෙස් සහ සන්නිවේදනය"
    ],
    officialUrl: "https://jac-skill.or.jp/",
    officialUrlLabel: "ජපන් ඉදිකිරීම් මානව සම්පත් සංවිධානය (JAC)",
    prometricUrl: "https://www.prometric-jp.com/en/ssw/test_list/"
  },
  {
    id: "accommodation",
    titleSi: "හෝටල් සහ නවාතැන් ක්ෂේත්‍රය",
    titleJp: "宿泊業",
    titleEn: "Accommodations & Hotel Industry",
    descriptionSi: "ජපන් සාම්ප්‍රදායික රියෝකන් (Ryokan) සහ නූතන හෝටල් සඳහා පෙරමුණු මේසය (Front Desk), කාමර නඩත්තුව සහ ආගන්තුක සත්කාරය.",
    status: "info_only",
    testFormat: "ලිඛිත සහ වාචික භූමිකා නිරූපණ පරීක්ෂණය (Role-play)",
    testLanguage: "ජපන් භාෂාව (N3/N4 මට්ටම)",
    icon: "Building",
    subCategories: ["Front Desk Management", "Customer Service", "Room Cleaning & Operations"],
    keyTopics: ["ජපන් ගෞරවාන්විත භාෂාව (Keigo)", "පිරික්සුම් සහ වෙන්කිරීම් පද්ධති", "ජපන් ආගන්තුක සත්කාරය (Omotenashi)"],
    officialUrl: "https://caipt.or.jp/",
    officialUrlLabel: "හෝටල් කර්මාන්ත පුහුණු මධ්‍යස්ථානය (CAIPT)",
    prometricUrl: "https://www.prometric-jp.com/en/ssw/test_list/"
  }
];
