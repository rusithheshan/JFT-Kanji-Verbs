import React, { useState } from "react";
import { Maximize2, X } from "lucide-react";

export type JFTIllustrationType =
  | "smile_woman"
  | "cry_person"
  | "angry_person"
  | "reading_book"
  | "running_person"
  | "eating_meal"
  | "drinking_water"
  | "sleeping_bed"
  | "waking_up"
  | "writing_letter"
  | "listening_music"
  | "buying_shop"
  | "meeting_friend"
  | "walking_dog"
  | "washing_hands"
  | "cooking_kitchen"
  | "riding_bus"
  | "cleaning_room"
  | "calling_phone"
  | "cutting_food"
  | "dialogue_coworkers"
  | "police_fire_officer"
  | "listening_walk_street"
  | "listening_shrine"
  | "listening_room"
  | "emergency_shout"
  | "emergency_run"
  | "emergency_extinguish"
  | "notice_flyer"
  | "bus_timetable"
  | "medicine_guide"
  | "weather_sun"
  | "weather_rain"
  | "playing_children"
  | "asobimasu"
  | "swimming_river"
  | "supermarket_veggies"
  | "ramen_eating"
  | "air_conditioner"
  | "quiet_library"
  | "train_station"
  | "camera_photo"
  | "recycling_cans"
  | "scissors_paper"
  | "carrying_boxes"
  | "sweet_dessert"
  | "boiling_kettle"
  | "stairs_climb"
  | "convenience_pay";

interface JFTIllustrationProps {
  type: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

// Authentic High-Resolution Real Photos matching the exact question vocabulary and answers
export const JFT_PHOTO_MAP: Record<
  string,
  { src: string; alt: string; titleSi: string; titleJp: string }
> = {
  // 1. Smiling/Laughing Woman (わらいます / 笑う)
  smile_woman: {
    src: "/assets/jft_photos/jft_smile_woman.jpg",
    alt: "わらいます (Smiling / Laughing Woman)",
    titleSi: "සිනහවෙන කාන්තාව (Laughing / Smiling)",
    titleJp: "わらいます（笑う）"
  },
  laugh_woman: {
    src: "/assets/jft_photos/jft_smile_woman.jpg",
    alt: "わらいます (Smiling Woman)",
    titleSi: "සිනහවෙන කාන්තාව",
    titleJp: "わらいます"
  },
  わらいます: {
    src: "/assets/jft_photos/jft_smile_woman.jpg",
    alt: "わらいます (Smiling Woman)",
    titleSi: "සිනහවෙන කාන්තාව",
    titleJp: "わらいます"
  },

  // 2. Crying Person (なきます / 泣く)
  cry_person: {
    src: "/assets/jft_photos/jft_cry_person.jpg",
    alt: "なきます (Crying Person)",
    titleSi: "අඬන පුද්ගලයා (Crying Person)",
    titleJp: "なきます（泣く）"
  },
  なきます: {
    src: "/assets/jft_photos/jft_cry_person.jpg",
    alt: "なきます (Crying Person)",
    titleSi: "අඬන පුද්ගලයා",
    titleJp: "なきます"
  },

  // 3. Angry Person (おこります / 怒る)
  angry_person: {
    src: "/assets/jft_photos/jft_angry_person.jpg",
    alt: "おこります (Angry Person)",
    titleSi: "කේන්ති ගිය පුද්ගලයා (Angry Person)",
    titleJp: "おこります（怒る）"
  },
  おこります: {
    src: "/assets/jft_photos/jft_angry_person.jpg",
    alt: "おこります (Angry Person)",
    titleSi: "කේන්ති ගිය පුද්ගලයා",
    titleJp: "おこります"
  },

  // 4. Reading Book (よみます / 読む)
  reading_book: {
    src: "/assets/jft_photos/jft_reading_book.jpg",
    alt: "よみます (Reading Book)",
    titleSi: "පොතක් කියවනවා (Reading Book)",
    titleJp: "よみます（読む）"
  },
  よみます: {
    src: "/assets/jft_photos/jft_reading_book.jpg",
    alt: "よみます (Reading Book)",
    titleSi: "පොතක් කියවනවා",
    titleJp: "よみます"
  },

  // 5. Running Person (はしります / 走る)
  running_person: {
    src: "/assets/jft_photos/jft_running_person.jpg",
    alt: "はしります (Running Person)",
    titleSi: "දුවනවා (Running)",
    titleJp: "はしります（走る）"
  },
  はしります: {
    src: "/assets/jft_photos/jft_running_person.jpg",
    alt: "はしります (Running Person)",
    titleSi: "දුවනවා",
    titleJp: "はしります"
  },

  // 6. Eating Meal (たべます / 食べる)
  eating_meal: {
    src: "/assets/jft_photos/jft_eating_meal.jpg",
    alt: "たべます (Eating Meal)",
    titleSi: "ආහාර ගන්නවා (Eating Meal)",
    titleJp: "たべます（食べる）"
  },
  たべます: {
    src: "/assets/jft_photos/jft_eating_meal.jpg",
    alt: "たべます (Eating Meal)",
    titleSi: "ආහාර ගන්නවා",
    titleJp: "たべます"
  },

  // 7. Drinking Water (のみます / 飲む)
  drinking_water: {
    src: "/assets/jft_photos/jft_drinking_water.jpg",
    alt: "のみます (Drinking Water)",
    titleSi: "වතුර බොනවා (Drinking Water)",
    titleJp: "のみます（飲む）"
  },
  のみます: {
    src: "/assets/jft_photos/jft_drinking_water.jpg",
    alt: "のみます (Drinking Water)",
    titleSi: "වතුර බොනවා",
    titleJp: "のみます"
  },

  // 8. Sleeping in Bed (ねます / 寝る)
  sleeping_bed: {
    src: "/assets/jft_photos/jft_sleeping_bed.jpg",
    alt: "ねます (Sleeping in Bed)",
    titleSi: "නිදාගන්නවා (Sleeping in Bed)",
    titleJp: "ねます（寝る）"
  },
  ねます: {
    src: "/assets/jft_photos/jft_sleeping_bed.jpg",
    alt: "ねます (Sleeping in Bed)",
    titleSi: "නිදාගන්නවා",
    titleJp: "ねます"
  },

  // 9. Waking Up (おきます / 起きる)
  waking_up: {
    src: "/assets/jft_photos/jft_waking_up.jpg",
    alt: "おきます (Waking Up)",
    titleSi: "අවදි වෙනවා (Waking Up in Morning)",
    titleJp: "おきます（起きる）"
  },
  おきます: {
    src: "/assets/jft_photos/jft_waking_up.jpg",
    alt: "おきます (Waking Up)",
    titleSi: "අවදි වෙනවා",
    titleJp: "おきます"
  },
  起きました: {
    src: "/assets/jft_photos/jft_waking_up.jpg",
    alt: "起きました (Waking Up)",
    titleSi: "අවදි වුණා",
    titleJp: "起きました"
  },

  // 10. Writing Letter (かきます / 書く)
  writing_letter: {
    src: "/assets/jft_photos/jft_writing_letter.jpg",
    alt: "かきます (Writing Notes/Letter)",
    titleSi: "අකුරු ලියනවා (Writing Notes)",
    titleJp: "かきます（書く）"
  },
  かきます: {
    src: "/assets/jft_photos/jft_writing_letter.jpg",
    alt: "かきます (Writing)",
    titleSi: "අකුරු ලියනවා",
    titleJp: "かきます"
  },

  // 11. Playing / Games (あそびます / 遊ぶ) - Real authentic photo matching exact answer
  playing_children: {
    src: "/assets/jft_photos/jft_playing_children.jpg",
    alt: "あそびます (Children Playing / Games)",
    titleSi: "සෙල්ලම් කරනවා (Children Playing Games)",
    titleJp: "あそびます（遊ぶ）"
  },
  asobimasu: {
    src: "/assets/jft_photos/jft_playing_children.jpg",
    alt: "あそびます (Playing)",
    titleSi: "සෙල්ලම් කරනවා",
    titleJp: "あそびます"
  },
  あそびます: {
    src: "/assets/jft_photos/jft_playing_children.jpg",
    alt: "あそびます (Playing)",
    titleSi: "සෙල්ලම් කරනවා",
    titleJp: "あそびます"
  },
  あそんで: {
    src: "/assets/jft_photos/jft_playing_children.jpg",
    alt: "あそんで (Playing)",
    titleSi: "සෙල්ලම් කරමින්",
    titleJp: "あそんで"
  },

  // 12. River / Swimming (川 / およぎます)
  swimming_river: {
    src: "/assets/jft_photos/jft_swimming_river.jpg",
    alt: "川 / およぎます (River / Swimming)",
    titleSi: "ගඟේ පිහිනනවා (Swimming in River)",
    titleJp: "川（かわ）・泳ぎます"
  },
  およぎます: {
    src: "/assets/jft_photos/jft_swimming_river.jpg",
    alt: "およぎます (Swimming)",
    titleSi: "පිහිනනවා",
    titleJp: "およぎます"
  },

  // 13. Supermarket Fresh Vegetables (スーパー / たくさん買いました)
  supermarket_veggies: {
    src: "/assets/jft_photos/jft_supermarket_veggies.jpg",
    alt: "スーパーで野菜を買いました (Supermarket Vegetables)",
    titleSi: "සුපර්මාකට් එළවළු (Supermarket Fresh Vegetables)",
    titleJp: "スーパー・野菜をたくさん買う"
  },
  たくさん: {
    src: "/assets/jft_photos/jft_supermarket_veggies.jpg",
    alt: "たくさん (Many Vegetables)",
    titleSi: "බොහෝ එළවළු ප්‍රමාණයක්",
    titleJp: "たくさん"
  },

  // 14. Eating Ramen (ラーメン / お腹がすいた)
  ramen_eating: {
    src: "/assets/jft_photos/jft_ramen_eating.jpg",
    alt: "ラーメンを食べる (Eating Ramen)",
    titleSi: "රාමෙන් ආහාර ගැනීම (Eating Ramen)",
    titleJp: "ラーメン（食べる）"
  },

  // 15. Air Conditioner (エアコン)
  air_conditioner: {
    src: "/assets/jft_photos/jft_air_conditioner.jpg",
    alt: "エアコンをつける (Air Conditioner)",
    titleSi: "වායු සමීකරණය (Air Conditioner)",
    titleJp: "エアコン"
  },
  エアコン: {
    src: "/assets/jft_photos/jft_air_conditioner.jpg",
    alt: "エアコン (Air Conditioner)",
    titleSi: "වායු සමීකරණය",
    titleJp: "エアコン"
  },

  // 16. Quiet Library (図書館)
  quiet_library: {
    src: "/assets/jft_photos/jft_quiet_library.jpg",
    alt: "図書館 (Quiet Library)",
    titleSi: "පුස්තකාලය (Quiet Library)",
    titleJp: "図書館（としょかん）"
  },
  図書館: {
    src: "/assets/jft_photos/jft_quiet_library.jpg",
    alt: "図書館 (Library)",
    titleSi: "පුස්තකාලය",
    titleJp: "図書館"
  },

  // 17. Train Station Platform (駅 / 電車)
  train_station: {
    src: "/assets/jft_photos/jft_train_station.jpg",
    alt: "駅・電車 (Train Station Platform)",
    titleSi: "දුම්රිය ස්ථානය (Train Station)",
    titleJp: "駅（えき）・電車"
  },
  駅: {
    src: "/assets/jft_photos/jft_train_station.jpg",
    alt: "駅 (Station)",
    titleSi: "දුම්රිය ස්ථානය",
    titleJp: "駅"
  },

  // 18. Taking Photos / Camera (写真を撮る)
  camera_photo: {
    src: "/assets/jft_photos/jft_camera_photo.jpg",
    alt: "写真を撮る (Taking Photos / Camera)",
    titleSi: "ඡායාරූප ගැනීම (Taking Photos)",
    titleJp: "写真（しゃしん）を撮る"
  },
  写真: {
    src: "/assets/jft_photos/jft_camera_photo.jpg",
    alt: "写真 (Photo)",
    titleSi: "ඡායාරූප ගැනීම",
    titleJp: "写真"
  },

  // 19. Post Office / Mail (郵便局)
  post_office: {
    src: "/assets/jft_photos/jft_post_office.jpg",
    alt: "郵便局 (Post Office / Mail)",
    titleSi: "තැපැල් කාර්යාලය (Post Office)",
    titleJp: "郵便局（ゆうびんきょく）"
  },
  郵便局: {
    src: "/assets/jft_photos/jft_post_office.jpg",
    alt: "郵便局 (Post Office)",
    titleSi: "තැපැල් කාර්යාලය",
    titleJp: "郵便局"
  },

  // 20. Recycling Bottles & Cans (ペットボトル・空き缶)
  recycling_cans: {
    src: "/assets/jft_photos/jft_recycling_cans.jpg",
    alt: "ペットボトル・空き缶の分別 (Recycling Bottles & Cans)",
    titleSi: "ප්ලාස්ටික් බෝතල් හා කෑන් (Recycling Cans & Bottles)",
    titleJp: "ペットボトル・空き缶"
  },
  ペットボトル: {
    src: "/assets/jft_photos/jft_recycling_cans.jpg",
    alt: "ペットボトル (Plastic Bottles)",
    titleSi: "ප්ලාස්ටික් බෝතල්",
    titleJp: "ペットボトル"
  },

  // 21. Scissors cutting paper (はさみで切る)
  scissors_paper: {
    src: "/assets/jft_photos/jft_scissors_paper.jpg",
    alt: "はさみで紙を切る (Scissors Cutting Paper)",
    titleSi: "කතුරෙන් කඩදාසි කැපීම (Scissors Cutting Paper)",
    titleJp: "はさみ（ハサミで切る）"
  },
  はさみ: {
    src: "/assets/jft_photos/jft_scissors_paper.jpg",
    alt: "はさみ (Scissors)",
    titleSi: "කතුර (Scissors)",
    titleJp: "はさみ"
  },

  // 22. Carrying Boxes & Luggage (荷物を運ぶ)
  carrying_boxes: {
    src: "/assets/jft_photos/jft_carrying_boxes.jpg",
    alt: "荷物を運ぶ (Carrying Boxes / Moving Luggage)",
    titleSi: "බඩු/පෙට්ටි එහා මෙහා ගෙනයාම (Carrying Luggage/Boxes)",
    titleJp: "荷物を運ぶ（はこぶ）"
  },
  はこんで: {
    src: "/assets/jft_photos/jft_carrying_boxes.jpg",
    alt: "はこんで (Carrying Luggage)",
    titleSi: "ගෙනියන්න",
    titleJp: "はこんで"
  },
  はこびます: {
    src: "/assets/jft_photos/jft_carrying_boxes.jpg",
    alt: "はこびます (Carrying)",
    titleSi: "ගෙනියනවා",
    titleJp: "はこびます"
  },

  // 23. Sweet Dessert Dish (あまい料理 / ケーキ)
  sweet_dessert: {
    src: "/assets/jft_photos/jft_sweet_dessert.jpg",
    alt: "甘い料理・デザート (Sweet Dish / Dessert)",
    titleSi: "පැණිරස ආහාර (Sweet Food/Dessert)",
    titleJp: "あまい（甘いデザート）"
  },
  あまい: {
    src: "/assets/jft_photos/jft_sweet_dessert.jpg",
    alt: "あまい (Sweet)",
    titleSi: "පැණිරස",
    titleJp: "あまい"
  },

  // 24. Boiling Water / Kettle (お湯を沸かす)
  boiling_kettle: {
    src: "/assets/jft_photos/jft_boiling_kettle.jpg",
    alt: "お湯を沸かす (Boiling Water Kettle)",
    titleSi: "වතුර රත් කිරීම/ඉදවීම (Boiling Water in Kettle)",
    titleJp: "お湯を沸かす（わかす）"
  },
  わかして: {
    src: "/assets/jft_photos/jft_boiling_kettle.jpg",
    alt: "お湯をわかす (Boiling Water)",
    titleSi: "වතුර රත් කරන්න",
    titleJp: "わかして"
  },

  // 25. Climbing Stairs (階段をあがる)
  stairs_climb: {
    src: "/assets/jft_photos/jft_stairs_climb.jpg",
    alt: "階段をあがる (Climbing Stairs to 2nd Floor)",
    titleSi: "පඩිපෙළ නැගීම (Climbing Stairs)",
    titleJp: "階段（かいだん）をあがる"
  },
  階段: {
    src: "/assets/jft_photos/jft_stairs_climb.jpg",
    alt: "階段 (Stairs)",
    titleSi: "පඩිපෙළ",
    titleJp: "階段"
  },
  あがって: {
    src: "/assets/jft_photos/jft_stairs_climb.jpg",
    alt: "階段をあがる (Going up stairs)",
    titleSi: "නගින්න",
    titleJp: "あがって"
  },

  // 26. Paying at Convenience Store Cashier (コンビニで払う)
  convenience_pay: {
    src: "/assets/jft_photos/jft_convenience_pay.jpg",
    alt: "コンビニで電気代を払う (Paying Bill at Counter)",
    titleSi: "බිල්පත් ගෙවීම (Paying Bills at Counter)",
    titleJp: "コンビニで払う（はらう）"
  },
  はらいました: {
    src: "/assets/jft_photos/jft_convenience_pay.jpg",
    alt: "はらいました (Paid)",
    titleSi: "ගෙව්වා",
    titleJp: "はらいました"
  },

  // 21. Dialogue Conversation (会話)
  dialogue_coworkers: {
    src: "/assets/jft_photos/jft_dialogue_coworkers.jpg",
    alt: "会話 (Workplace Conversation / Dialogue)",
    titleSi: "සංවාදය / කතාබහ (Coworkers Dialogue)",
    titleJp: "会話（かいわ）"
  },

  // 22. Police / Fire Officer (警察・消防)
  police_fire_officer: {
    src: "/assets/jft_photos/jft_police_fire_officer.jpg",
    alt: "警察・消防 (Police & Public Officer)",
    titleSi: "පොලිස් / ආරක්ෂක නිලධාරී (Police Officer)",
    titleJp: "警察・消防"
  },

  // 23. Reading Notices & Signs
  notice_flyer: {
    src: "/assets/jft_photos/jft_notice_flyer.jpg",
    alt: "JFT Reading Notice/Flyer",
    titleSi: "දැන්වීම් පත්‍රිකාව (Notice Flyer)",
    titleJp: "お知らせ"
  },
  bus_timetable: {
    src: "/assets/jft_photos/jft_bus_timetable.jpg",
    alt: "JFT Reading Bus Timetable",
    titleSi: "බස් කාලසටහන (Bus Timetable)",
    titleJp: "バス時刻表"
  },
  medicine_guide: {
    src: "/assets/jft_photos/jft_medicine_guide.jpg",
    alt: "JFT Reading Medicine Guide",
    titleSi: "ඖෂධ භාවිත මාර්ගෝපදේශය (Medicine Guide)",
    titleJp: "薬の飲み方"
  },

  // 24. Listening Picture Choices
  listening_walk_street: {
    src: "/assets/jft_photos/jft_listen_p1_1.jpg",
    alt: "Choice (1): Walking on street",
    titleSi: "පාරේ ඇවිදීම",
    titleJp: "道を歩く"
  },
  listening_shrine: {
    src: "/assets/jft_photos/jft_listen_p1_2.jpg",
    alt: "Choice (2): Shrine / Temple",
    titleSi: "කෝවිල / දේවාලය",
    titleJp: "神社"
  },
  listening_room: {
    src: "/assets/jft_photos/jft_listen_p1_3.jpg",
    alt: "Choice (3): Room / Office",
    titleSi: "කාමරය",
    titleJp: "部屋"
  },
  emergency_shout: {
    src: "/assets/jft_photos/jft_listen_p3_1.jpg",
    alt: "Choice (1): Fire alarm",
    titleSi: "ගිනි අනතුරු ඇඟවීම",
    titleJp: "火事の合図"
  },
  emergency_run: {
    src: "/assets/jft_photos/jft_listen_p3_2.jpg",
    alt: "Choice (2): Evacuate / run",
    titleSi: "ඉවත් වීම / දිවීම",
    titleJp: "避難する"
  },
  emergency_extinguish: {
    src: "/assets/jft_photos/jft_listen_p3_3.jpg",
    alt: "Choice (3): Fire extinguisher",
    titleSi: "ගිනි නිවන උපකරණය",
    titleJp: "消火器"
  }
};

export function JFTCBTIllustration({ type, className = "", size = "md" }: JFTIllustrationProps) {
  const [imgError, setImgError] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const photoInfo = JFT_PHOTO_MAP[type];

  const sizeClasses = {
    sm: "w-20 h-16 sm:w-24 sm:h-20",
    md: "w-44 h-32 sm:w-56 sm:h-40 landscape:w-40 landscape:h-28",
    lg: "w-64 h-48 sm:w-80 sm:h-56 landscape:w-60 landscape:h-40"
  }[size];

  // If photo is available and hasn't errored, display the REAL authentic photo matching the answer
  if (photoInfo && !imgError) {
    return (
      <>
        <div className="relative group inline-block">
          <div className="overflow-hidden rounded-lg border-2 border-slate-300 bg-white shadow-xs hover:border-[#608038] transition-all">
            <img
              src={photoInfo.src}
              alt={photoInfo.alt}
              className={`${sizeClasses} ${className} object-cover hover:scale-105 transition-transform duration-200 cursor-pointer`}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              onClick={() => setIsZoomOpen(true)}
              title="Click to view full photo"
            />
          </div>

          {/* Quick Zoom Button */}
          <button
            type="button"
            onClick={() => setIsZoomOpen(true)}
            className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black/90 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
            title="View Full Photo"
          >
            <Maximize2 className="w-3 h-3 text-amber-300" />
          </button>
        </div>

        {/* Modal for viewing the Full High-Resolution Photo */}
        {isZoomOpen && (
          <div
            className="fixed inset-0 z-[100000] bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
            onClick={() => setIsZoomOpen(false)}
          >
            <div
              className="bg-white rounded-2xl max-w-xl w-full p-4 space-y-3 shadow-2xl border-2 border-slate-300 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b pb-2">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <span className="p-1 rounded bg-emerald-100 text-[#2d6a4f] font-bold text-[10px]">
                    සැබෑ ඡායාරූපය (Real Concept Photo)
                  </span>
                  <span>{photoInfo.titleJp || photoInfo.alt}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="w-full flex items-center justify-center bg-slate-900 rounded-lg overflow-hidden p-1">
                <img
                  src={photoInfo.src}
                  alt={photoInfo.alt}
                  className="max-h-[60vh] w-auto object-contain rounded"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <span className="font-semibold text-slate-700">
                  {photoInfo.titleSi || photoInfo.alt}
                </span>
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(false)}
                  className="px-3 py-1 bg-[#608038] text-white rounded text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback if photo fails to load
  return (
    <div
      className={`${sizeClasses} ${className} flex items-center justify-center bg-slate-50 border border-slate-300 rounded p-2 text-center text-xs text-slate-500`}
    >
      <div className="space-y-1">
        <div className="text-xl">🖼️</div>
        <div className="text-[10px] font-bold text-slate-700">{type}</div>
      </div>
    </div>
  );
}
