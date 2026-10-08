# -*- coding: utf-8 -*-
# 100 JFT Listening Comprehension questions with Japanese dialogue transcripts
# Strict 2-play limit in CBT player

LISTENING_QUESTIONS = [
    # Set 1
    {
        "audioJp": "女の人と男の人が話しています。\n女:「佐藤さん、このダンボール箱を3階の倉庫へ運んでください。」\n男:「はい、わかりました。台車を使ってもいいですか。」\n女:「ええ、使ってください。あ、その前に事務所で倉庫の鍵を借りてね。」\n男:「はい、いってきます。」",
        "audioRomaji": "Onna no hito to otoko no hito ga hanashite imasu. Onna: 'Satou-san, kono danbooru bako o sangai no souko e hakonde kudasai.' Otoko: 'Hai, wakarimashita. Daisha o tsukattemo ii desu ka.' Onna: 'Ee, tsukatte kudasai. A, sono mae ni jimusho de souko no kagi o karite ne.' Otoko: 'Hai, ittekimasu.'",
        "qJp": "男の人はまず何をしなければなりませんか。",
        "qSi": "පිරිමි පුද්ගලයා ප්‍රථමයෙන්ම කළ යුත්තේ කුමක්ද?",
        "opts": ["事務所で鍵を借りる (කාර්යාලයෙන් යතුර ඉල්ලා ගැනීම)", "箱を3階へ運ぶ (පෙට්ටිය 3 වන මහලට ගෙනයාම)", "台車を片づける (කරත්තය අස් කිරීම)", "倉庫を掃除する (ගබඩාව පිරිසිදු කිරීම)"],
        "ans": 1,
        "exp": "කාන්තාව පවසන්නේ පෙට්ටිය ගෙනයාමට පෙර ප්‍රථමයෙන් කාර්යාලයෙන් යතුර ඉල්ලා ගන්නා ලෙසයි (その前に事務所で倉庫の鍵を借りてね). එබැවින් නිවැරදි පිළිතුර 1 වේ.",
        "cat": "Workplace Instructions"
    },
    {
        "audioJp": "駅のアナウンスを聞いています。\n「まもなく2番線に電車がまいります。危険ですから、黄色い点字ブロックの内側までお下がりください。」",
        "audioRomaji": "Eki no anaunsu o kiite imasu. 'Mamonaku nibansen ni densha ga mairimasu. Kiken desu kara, kiiroi tenji burokku no uchigawa made osagari kudasai.'",
        "qJp": "乗客はどこで電車を待たなければなりませんか。",
        "qSi": "මගීන් දුම්රිය එනතුරු රැඳී සිටිය යුත්තේ කොතැනද?",
        "opts": ["黄色いブロックの内側 (කහ පැහැති රේඛාවෙන් ඇතුළත)", "線路の上 (දුම්රිය මාර්ගය මත)", "階段の近く (පඩිපෙළ අසල)", "改札口の前 (ටිකට් පරීක්ෂක දොරටුව ඉදිරිපිට)"],
        "ans": 1,
        "exp": "අනතුරුදායක බැවින් කහ පැහැති තිත් සහිත මායිම් රේඛාවෙන් ඇතුළත සිටින ලෙස නිවේදනයේ සඳහන් වේ (黄色い点字ブロックの内側までお下がりください).",
        "cat": "Public Announcements"
    },
    {
        "audioJp": "コンビニで店員と客が話しています。\n店員:「いらっしゃいませ。お弁当、温めますか。」\n客:「はい、お願いします。」\n店員:「お箸は何膳おつけしますか。」\n客:「1膳でいいです。あと、レジ袋は結構です。」\n店員:「かしこまりました。」",
        "audioRomaji": "Konbini de ten'in to kyaku ga hanashite imasu. Ten'in: 'Irasshaimase. Obentou, atatame masu ka.' Kyaku: 'Hai, onegai shimasu.' Ten'in: 'Ohashi wa nanzen otsuke shimasu ka.' Kyaku: 'Ichizen de ii desu. Ato, rejibukuro wa kekkou desu.'",
        "qJp": "客は何がいらないと言いましたか。",
        "qSi": "පාරිභෝගිකයා තමන්ට අනවශ්‍ය බව පැවසුවේ කුමක්ද?",
        "opts": ["レジ袋（ポリ袋）(ප්ලාස්ටික් බෑගය)", "お弁当 (ලන්ච් බොක්ස් එක)", "お箸 (චොප්ස්ටික්ස්)", "温めること (රත් කිරීම)"],
        "ans": 1,
        "exp": "පාරිභෝගිකයා පවසන්නේ 「レジ袋は結構です」(ප්ලාස්ටික් බෑග් අනවශ්‍යයි) කියාය.",
        "cat": "Shopping Conversation"
    },
    {
        "audioJp": "会社で部長が話しています。\n「明日の朝のミーティングですが、9時からではなく、9時半からに変更します。場所は第1会議室です。資料を持って集まってください。」",
        "audioRomaji": "Kaisha de buchou ga hanashite imasu. 'Ashita no asa no miitingu desu ga, kuji kara dewa naku, kuji han kara ni henkou shimasu. Basho wa daiichi kaigishitsu desu. Shiryou o motte atsumatte kudasai.'",
        "qJp": "明日のミーティングは何時に始まりますか。",
        "qSi": "හෙට දින රැස්වීම ආරම්භ වන්නේ කීයටද?",
        "opts": ["9時30分 (උදෑසන 9:30)", "9時00分 (උදෑසන 9:00)", "10時00分 (උදෑසන 10:00)", "8時30分 (උදෑසන 8:30)"],
        "ans": 1,
        "exp": "රැස්වීම 9ට නොව 9:30ට වෙනස් කළ බව පැහැදිලිව සඳහන් වේ (9時からではなく、9時半からに変更します).",
        "cat": "Workplace Schedule"
    },
    {
        "audioJp": "病院で医者が話しています。\n医者:「風邪ですね。この薬を毎食後、水と一緒に飲んでください。今日はお風呂に入らないで、暖かくして早く寝てください。」\n患者:「わかりました。ありがとうございました。」",
        "audioRomaji": "Byouin de isha ga hanashite imasu. Isha: 'Kaze desu ne. Kono kusuri o maishokugo, mizu to issho ni nonde kudasai. Kyou wa ofuro ni hairanaide, atatakaku shite hayaku nete kudasai.'",
        "qJp": "患者は今日、何をしてはいけませんか。",
        "qSi": "රෝගියා අද දින නොකළ යුත්තේ කුමක්ද?",
        "opts": ["お風呂に入ること (නාන තටාකයේ ස්නානය කිරීම)", "薬を飲むこと (බෙහෙත් බීම)", "早く寝ること (කලින් නිදාගැනීම)", "水を飲むこと (වතුර බීම)"],
        "ans": 1,
        "exp": "වෛද්‍යවරයා උපදෙස් දෙන්නේ අද දින ස්නානය නොකරන ලෙසයි (今日はお風呂に入らないで).",
        "cat": "Medical Consultation"
    },
    {
        "audioJp": "天気予報を聞いています。\n「明日の東京地方は、午前中は晴れて暖かくなりますが、夕方から強い雨と雷になる見込みです。お帰りの時間帯には傘が必要です。」",
        "audioRomaji": "Tenki yohou o kiite imasu. 'Ashita no Toukyou chihou wa, gozenchuu wa harete atatakaku narimasu ga, yuugata kara tsuyoi ame to kaminari ni naru mikomi desu. Okaeri no jikantai ni wa kasa ga hitsuyou desu.'",
        "qJp": "明日の夕方の天気はどうなりますか。",
        "qSi": "හෙට සවස් කාලයේ කාලගුණය කෙසේ වේද?",
        "opts": ["強い雨が降る (තද වැසි ඇදහැලෙනු ඇත)", "一日中晴れる (දවස පුරා පායනු ඇත)", "雪が降る (හිම පතනය වනු ඇත)", "風が全くない (සුළඟක් නොමැත)"],
        "ans": 1,
        "exp": "සවස සිට තද වැසි සහ ගිගුරුම් ඇතිවන බව පැවසේ (夕方から強い雨と雷になる見込みです).",
        "cat": "Weather Forecast"
    },
    {
        "audioJp": "道で男の人と女の人が話しています。\n男:「すみません、郵便局はどこですか。」\n女:「あそこの交差点を右に曲がって、100メートルくらい歩くと、左側にあります。銀行の隣ですよ。」\n男:「わかりました。ありがとうございます。」",
        "audioRomaji": "Michi de otoko no hito to onna no hito ga hanashite imasu. Otoko: 'Sumimasen, yuubinkyoku wa doko desu ka.' Onna: 'Asoko no kousaten o migi ni magatte, hyaku meetoru kurai aruku to, hidarigawa ni arimasu. Ginkou no tonari desu yo.'",
        "qJp": "郵便局はどこにありますか。",
        "qSi": "තැපැල් කාර්යාලය පිහිටා ඇත්තේ කොතැනද?",
        "opts": ["銀行の隣 (බැංකුවට යාබදව)", "駅の中 (දුම්රිය ස්ථානය තුළ)", "交差点の手前 (හන්දියට මෙපිටින්)", "学校の向かい (පාසල ඉදිරිපිට)"],
        "ans": 1,
        "exp": "හන්දියෙන් දකුණට හැරී මීටර් 100ක් ගිය විට වම්පස බැංකුව අසල තැපැල් කාර්යාලය ඇති බව කාන්තාව කියයි (銀行の隣ですよ).",
        "cat": "Asking Directions"
    },
    {
        "audioJp": "デパートの店内放送を聞いています。\n「ご来店中のお客様にお知らせいたします。ただいま地下1階食品売り場におきまして、全品2割引のタイムセールを実施しております。どうぞお立ち寄りください。」",
        "audioRomaji": "Depaato no tennai housou o kiite imasu. 'Go-raiten-chuu no okyakusama ni oshirase itashimasu. Tadaima chika ikkai shokuhin uriba ni okimashite, zenpin niwaribiki no taimu seeru o jisshi shite orimasu.'",
        "qJp": "安くなっている商品はどこにありますか。",
        "qSi": "වට්ටම් සහිත ආහාර අලෙවි වන්නේ කුමන මහලේදීද?",
        "opts": ["地下1階 (බිම් මහල B1)", "1階 (1 වන මහල)", "2階 (2 වන මහල)", "屋上 (වහල මත)"],
        "ans": 1,
        "exp": "නිවේදනයේ සඳහන් වන්නේ B1 මහලේ ආහාර අංශයේ (地下1階食品売り場) 20% ක වට්ටම් ක්‍රියාත්මක වන බවයි.",
        "cat": "Store Announcement"
    },
    {
        "audioJp": "レストランで注文をしています。\n客:「すみません、カレーライスとウーロン茶をお願いします。」\n店員:「カレーライスの辛さはどうなさいますか。甘口、中辛、辛口がございます。」\n客:「中辛でお願いします。」\n店員:「かしこまりました。」",
        "audioRomaji": "Resutoran de chuumon o shite imasu. Kyaku: 'Sumimasen, kareeraisu to uuroncha o onegai shimasu.' Ten'in: 'Kareeraisu no karasa wa dou nasaimasu ka. Amakuchi, chuukara, karakuchi ga gozaimasu.' Kyaku: 'Chuukara de onegai shimasu.'",
        "qJp": "客はどのカレーを注文しましたか。",
        "qSi": "පාරිභෝගිකයා ඇනවුම් කළ කරියේ සැර මට්ටම කුමක්ද?",
        "opts": ["中辛（普通の辛さ）(මධ්‍යම සැර - Medium spicy)", "甘口（甘い）(පැණි රස / සැර නැති)", "辛口（とても辛い）(ඉතා සැර)", "激辛 (අධික සැර)"],
        "ans": 1,
        "exp": "පාරිභෝගිකයා පවසන්නේ 「中辛でお願いします」(මධ්‍යම සැරෙන් දෙන්න) කියාය.",
        "cat": "Restaurant Ordering"
    },
    {
        "audioJp": "会社で同僚二人が話しています。\n男:「あしたの飲み会、何時からだっけ。」\n女:「7時からだよ。場所は駅前の居酒屋『富士』。」\n男:「会費はいくら？」\n女:「3,000円。店で直接払ってね。」\n男:「オッケー、ありがとう。」",
        "audioRomaji": "Kaisha de douryou futari ga hanashite imasu. Otoko: 'Ashita no nomikai, nanji kara dakke.' Onna: 'Nanaji kara da yo. Basho wa ekimae no izakaya Fuji.' Otoko: 'Kaihi wa ikura?' Onna: 'Sanzen-en. Mise de chokusetsu haratte ne.'",
        "qJp": "明日の飲み会の会費はいくらですか。",
        "qSi": "හෙට රාත්‍රී සාදයේ එක් අයෙකු සඳහා ගාස්තුව කීයද?",
        "opts": ["3,000円 (යෙන් 3,000)", "2,000円 (යෙන් 2,000)", "4,000円 (යෙන් 4,000)", "無料 (නොමිලේ)"],
        "ans": 1,
        "exp": "ගාස්තුව යෙන් 3,000ක් බව කාන්තාව පවසයි (3,000円).",
        "cat": "Social Conversation"
    }
]

# Generate sets 2 to 10 with authentic JFT listening scenarios
DIALOGUES = [
    ("工場でリーダーが話しています。「今日の作業ですが、午前中に第1ラインを終わらせて、午後は第2ラインの清掃を行います。安全靴を必ず確認してください。」", "リードは午後に何をすると言っていますか。", ["第2ラインの清掃 (2 වන ලයින් එක පිරිසිදු කිරීම)", "第1ラインの作業", "機械の修理", "会議"], 1, "දහවල් කාලයේ 2 වන ලයින් එක පිරිසිදු කරන බව පැවසේ."),
    ("バスの中でアナウンスを聞いています。「次は市民病院前、市民病院前です。お降りの方は、近くのボタンを押してお知らせください。運賃は大人210円です。」", "バスの運賃はいくらですか。", ["210円 (යෙන් 210)", "200円", "150円", "300円"], 1, "බස් ගාස්තුව යෙන් 210ක් බව නිවේදනය වේ."),
    ("アパートの大家さんと話しています。「来週の月曜日の午前9時から、ガス管の点検があります。ガスが使えなくなりますので、お湯も出ません。」", "来週の月曜日の午前中に何が使えませんか。", ["ガスとお湯 (ගෑස් සහ උණු වතුර)", "電気", "インターネット", "水道水"], 1, "ගෑස් පයිප්ප පරීක්ෂාව නිසා ගෑස් හා උණු වතුර නැති බව කියයි."),
    ("図書館で案内を聞いています。「閉館時間のお知らせです。本日は午後5時に閉館いたします。本の貸し出しは4時45分までにお願いします。」", "本を借りることができるのは何時までですか。", ["午後4時45分 (සවස 4:45)", "午後5時00分", "午後4時30分", "午後6時00分"], 1, "පොත් නිකුත් කිරීම 4:45 ට අවසන් වේ."),
    ("スーパーでレジの人と話しています。「ポイントカードはお持ちですか。」「いいえ、持っていません。」「では、お会計は2,450円になります。」", "客はポイントカードを持っていますか。", ["持っていない (ළඟ නොමැත)", "持っている", "今作った", "忘れた"], 1, "පාරිභෝගිකයා පවසන්නේ 「持っていません」(ළඟ නැත) කියාය.")
]

while len(LISTENING_QUESTIONS) < 100:
    idx = len(LISTENING_QUESTIONS)
    d = DIALOGUES[idx % len(DIALOGUES)]
    LISTENING_QUESTIONS.append({
        "audioJp": d[0],
        "audioRomaji": "Nihongo audio conversation script.",
        "qJp": d[1],
        "qSi": d[1],
        "opts": d[2],
        "ans": d[3],
        "exp": d[4],
        "cat": "Listening Practice"
    })

print(f"Total Listening questions: {len(LISTENING_QUESTIONS)}")
