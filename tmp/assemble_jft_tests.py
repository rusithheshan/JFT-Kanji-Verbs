# -*- coding: utf-8 -*-
import sys, json

sys.path.insert(0, 'tmp')
import build_jft_mock_data
import data_conversation
import data_listening
import data_reading

vocab_qs = build_jft_mock_data.VOCAB_QUESTIONS
conv_qs = data_conversation.CONVERSATION_QUESTIONS
list_qs = data_listening.LISTENING_QUESTIONS
read_qs = data_reading.READING_QUESTIONS

print(f"Loaded: Vocab={len(vocab_qs)}, Conv={len(conv_qs)}, List={len(list_qs)}, Read={len(read_qs)}")

# Build 10 Sets for each category
# 1. Script & Vocab (10 sets)
script_vocab_papers = []
for set_i in range(10):
    start = set_i * 10
    subset = vocab_qs[start:start+10]
    questions = []
    for q_idx, q in enumerate(subset):
        questions.append({
            "id": 1000 + set_i * 100 + q_idx + 1,
            "section": "script_vocab",
            "sectionTitleJp": "文字・語彙（もじ・ごい）",
            "sectionTitleSi": "අක්ෂර සහ වචන මාලාව",
            "category": q.get("cat", "Script & Vocabulary"),
            "questionNumber": q_idx + 1,
            "questionJp": q["qJp"],
            "questionSi": q["qSi"],
            "options": [{"id": o_i + 1, "textJp": opt, "textSi": opt} for o_i, opt in enumerate(q["opts"])],
            "correctOption": q["ans"],
            "explanationSi": q["exp"],
            "explanationJp": "正解を確認しましょう。"
        })
    script_vocab_papers.append({
        "id": f"jft_sv_set_{set_i+1}",
        "setNumber": set_i + 1,
        "type": "script_vocab",
        "titleJp": f"JFT文字・語彙 模擬テスト 第{set_i+1}回",
        "titleSi": f"JFT Script & Vocabulary ආදර්ශ විභාගය - Set {set_i+1}",
        "descriptionSi": f"ජපන් භාෂා කන්ජි, හිරගනා සහ වචන මාලා දැනුම පරීක්ෂා කෙරෙන Set {set_i+1} ප්‍රශ්නාවලිය.",
        "durationMinutes": 20,
        "totalQuestions": len(questions),
        "passingScore": 7,
        "questions": questions
    })

# 2. Conversation & Expression (10 sets)
conversation_papers = []
for set_i in range(10):
    start = set_i * 10
    subset = conv_qs[start:start+10]
    questions = []
    for q_idx, q in enumerate(subset):
        questions.append({
            "id": 2000 + set_i * 100 + q_idx + 1,
            "section": "conversation",
            "sectionTitleJp": "会話・表現（かいわ・ひょうげん）",
            "sectionTitleSi": "සංවාද සහ ප්‍රකාශන / ව්‍යාකරණ",
            "category": q.get("cat", "Conversation & Expression"),
            "questionNumber": q_idx + 1,
            "questionJp": q["qJp"],
            "questionSi": q["qSi"],
            "options": [{"id": o_i + 1, "textJp": opt, "textSi": opt} for o_i, opt in enumerate(q["opts"])],
            "correctOption": q["ans"],
            "explanationSi": q["exp"],
            "explanationJp": "会話の文脈に最も適した表現を選びましょう。"
        })
    conversation_papers.append({
        "id": f"jft_ce_set_{set_i+1}",
        "setNumber": set_i + 1,
        "type": "conversation",
        "titleJp": f"JFT会話・表現 模擬テスト 第{set_i+1}回",
        "titleSi": f"JFT Conversation & Expression ආදර්ශ විභාගය - Set {set_i+1}",
        "descriptionSi": f"දෛනික සහ සේවාස්ථාන සංවාද, ආචාරශීලී වචන හා ව්‍යාකරණ Set {set_i+1} ප්‍රශ්නාවලිය.",
        "durationMinutes": 20,
        "totalQuestions": len(questions),
        "passingScore": 7,
        "questions": questions
    })

# 3. Listening Comprehension (10 sets)
listening_papers = []
for set_i in range(10):
    start = set_i * 10
    subset = list_qs[start:start+10]
    questions = []
    for q_idx, q in enumerate(subset):
        questions.append({
            "id": 3000 + set_i * 100 + q_idx + 1,
            "section": "listening",
            "sectionTitleJp": "聴解（ちょうかい）",
            "sectionTitleSi": "සවන්දීමේ හැකියාව (Listening Comprehension)",
            "category": q.get("cat", "Listening Comprehension"),
            "questionNumber": q_idx + 1,
            "audioScriptJp": q["audioJp"],
            "audioScriptRomaji": q.get("audioRomaji", ""),
            "questionJp": q["qJp"],
            "questionSi": q["qSi"],
            "options": [{"id": o_i + 1, "textJp": opt, "textSi": opt} for o_i, opt in enumerate(q["opts"])],
            "correctOption": q["ans"],
            "explanationSi": q["exp"],
            "explanationJp": "音声の内容を正確に聞き取って解答しましょう。"
        })
    listening_papers.append({
        "id": f"jft_lc_set_{set_i+1}",
        "setNumber": set_i + 1,
        "type": "listening",
        "titleJp": f"JFT聴解 模擬テスト 第{set_i+1}回（2回再生制限）",
        "titleSi": f"JFT Listening Comprehension ආදර්ශ විභාගය - Set {set_i+1}",
        "descriptionSi": f"සැබෑ JFT විභාගයේ මෙන්ම හඬ පටය 2 වතාවක් පමණක් වාදනය කළ හැකි සවන්දීමේ Set {set_i+1} ප්‍රශ්නාවලිය.",
        "durationMinutes": 25,
        "totalQuestions": len(questions),
        "passingScore": 7,
        "questions": questions
    })

# 4. Reading Comprehension (10 sets)
reading_papers = []
for set_i in range(10):
    start = set_i * 10
    subset = read_qs[start:start+10]
    questions = []
    for q_idx, q in enumerate(subset):
        questions.append({
            "id": 4000 + set_i * 100 + q_idx + 1,
            "section": "reading",
            "sectionTitleJp": "読解（どっかい）",
            "sectionTitleSi": "කියවා තේරුම් ගැනීම (Reading Comprehension)",
            "category": q.get("cat", "Reading Comprehension"),
            "questionNumber": q_idx + 1,
            "contextJp": q["contextJp"],
            "contextSi": q.get("contextSi", ""),
            "questionJp": q["qJp"],
            "questionSi": q["qSi"],
            "options": [{"id": o_i + 1, "textJp": opt, "textSi": opt} for o_i, opt in enumerate(q["opts"])],
            "correctOption": q["ans"],
            "explanationSi": q["exp"],
            "explanationJp": "文章や掲示の内容を正しく読み取りましょう。"
        })
    reading_papers.append({
        "id": f"jft_rc_set_{set_i+1}",
        "setNumber": set_i + 1,
        "type": "reading",
        "titleJp": f"JFT読解 模擬テスト 第{set_i+1}回",
        "titleSi": f"JFT Reading Comprehension ආදර්ශ විභාගය - Set {set_i+1}",
        "descriptionSi": f"දැන්වීම් පුවරු, සටහන් සහ ඊමේල් පණිවිඩ කියවා තේරුම් ගැනීමේ Set {set_i+1} ප්‍රශ්නාවලිය.",
        "durationMinutes": 25,
        "totalQuestions": len(questions),
        "passingScore": 7,
        "questions": questions
    })

# 5. Full Mock Test (10 sets: 40 questions each = 10 from each section, 60 minutes)
full_mock_papers = []
for set_i in range(10):
    full_qs = []
    q_num = 1
    # 10 Vocab
    for q in script_vocab_papers[set_i]["questions"]:
        q_copy = dict(q)
        q_copy["questionNumber"] = q_num
        full_qs.append(q_copy)
        q_num += 1
    # 10 Conv
    for q in conversation_papers[set_i]["questions"]:
        q_copy = dict(q)
        q_copy["questionNumber"] = q_num
        full_qs.append(q_copy)
        q_num += 1
    # 10 Listening
    for q in listening_papers[set_i]["questions"]:
        q_copy = dict(q)
        q_copy["questionNumber"] = q_num
        full_qs.append(q_copy)
        q_num += 1
    # 10 Reading
    for q in reading_papers[set_i]["questions"]:
        q_copy = dict(q)
        q_copy["questionNumber"] = q_num
        full_qs.append(q_copy)
        q_num += 1

    full_mock_papers.append({
        "id": f"jft_full_set_{set_i+1}",
        "setNumber": set_i + 1,
        "type": "full",
        "titleJp": f"JFT-Basic フル模擬試験 第{set_i+1}回（60分・総合試験）",
        "titleSi": f"JFT-Basic Full CBT Mock Test - Set {set_i+1}",
        "descriptionSi": f"සම්පූර්ණ JFT-Basic CBT විභාග අනුකරණය: අක්ෂර/වචන, සංවාද, සවන්දීම (2 Plays) සහ කියවීම ඇතුළත් විනාඩි 60ක පරිපූර්ණ විභාගය.",
        "durationMinutes": 60,
        "totalQuestions": len(full_qs),
        "passingScore": 28, # ~70%
        "questions": full_qs
    })

print(f"All sets built: Full={len(full_mock_papers)}, SV={len(script_vocab_papers)}, CE={len(conversation_papers)}, LC={len(listening_papers)}, RC={len(reading_papers)}")

# Write to TypeScript file src/data/jftMockTestsData.ts
output_path = "src/data/jftMockTestsData.ts"
with open(output_path, "w", encoding="utf-8") as f:
    f.write("""// JFT-Basic (Japan Foundation Test for Basic Japanese) CBT Exam Simulator
// Official Structure matching A2 Level SSW Requirement:
// 1. Script & Vocabulary (文字・語彙)
// 2. Conversation & Expression (会話・表現)
// 3. Listening Comprehension (聴解 - 2-Play Audio Limit)
// 4. Reading Comprehension (読解)
// 5. Full 60-Minute Comprehensive Mock Exam (50/40 Questions)

export interface JFTMockOption {
  id: number;
  textJp: string;
  textSi: string;
}

export interface JFTMockQuestion {
  id: number;
  section: "script_vocab" | "conversation" | "listening" | "reading";
  sectionTitleJp: string;
  sectionTitleSi: string;
  category: string;
  questionNumber: number;
  contextJp?: string;
  contextSi?: string;
  audioScriptJp?: string;
  audioScriptRomaji?: string;
  questionJp: string;
  questionSi: string;
  options: JFTMockOption[];
  correctOption: number;
  explanationSi: string;
  explanationJp?: string;
}

export interface JFTMockTestPaper {
  id: string;
  setNumber: number;
  type: "full" | "script_vocab" | "conversation" | "listening" | "reading";
  titleJp: string;
  titleSi: string;
  descriptionSi: string;
  durationMinutes: number;
  totalQuestions: number;
  passingScore: number;
  questions: JFTMockQuestion[];
}

export interface JFTCategoryMeta {
  id: "full" | "script_vocab" | "conversation" | "listening" | "reading";
  titleSi: string;
  titleJp: string;
  icon: string;
  badge: string;
  durationMinutes: number;
  descriptionSi: string;
  playlistUrl?: string;
}

export const JFT_MOCK_CATEGORIES: JFTCategoryMeta[] = [
  {
    id: "full",
    titleSi: "JFT Full Mock Test",
    titleJp: "JFT-Basic フル模擬試験 (60分)",
    icon: "Award",
    badge: "60 Min • 4 Sections",
    durationMinutes: 60,
    descriptionSi: "සම්පූර්ණ JFT-Basic CBT ආදර්ශ විභාගය (අක්ෂර, සංවාද, සවන්දීම, කියවීම)",
    playlistUrl: "https://youtube.com/playlist?list=PLfAtsPgle99C1csSi1SqizMhN-8h35KDk"
  },
  {
    id: "script_vocab",
    titleSi: "JFT Script & Vocabulary",
    titleJp: "文字・語彙（もじ・ごい）",
    icon: "BookOpen",
    badge: "20 Min • Kanji & Goi",
    durationMinutes: 20,
    descriptionSi: "කන්ජි කියවීම, වචන මාලාව සහ ප්‍රායෝගික භාවිතය",
    playlistUrl: "https://youtu.be/PxIEu2mL8yE"
  },
  {
    id: "conversation",
    titleSi: "JFT Conversation & Expression",
    titleJp: "会話・表現（かいわ・ひょうげん）",
    icon: "MessageSquare",
    badge: "20 Min • Grammar & Dialogues",
    durationMinutes: 20,
    descriptionSi: "දෛනික සහ සේවාස්ථාන සංවාද, ආචාරශීලී වචන හා ව්‍යාකරණ",
    playlistUrl: "https://youtube.com/playlist?list=PLTzrinYGJsj6xKP5EVDoyR6GdJLjZdkg2"
  },
  {
    id: "listening",
    titleSi: "JFT Listening Comprehension",
    titleJp: "聴解（ちょうかい・2回再生）",
    icon: "Headphones",
    badge: "25 Min • 2 Plays Limit",
    durationMinutes: 25,
    descriptionSi: "සවන්දීමේ හැකියාව (හඬ පටය වාදනය කළ හැක්කේ 2 වතාවක් පමණි)",
    playlistUrl: "https://youtube.com/playlist?list=PLfAtsPgle99BJVA-0WBhlBNzYMMNz-ur2"
  },
  {
    id: "reading",
    titleSi: "JFT Reading Comprehension",
    titleJp: "読解（どっかい）",
    icon: "FileText",
    badge: "25 Min • Notices & Signs",
    durationMinutes: 25,
    descriptionSi: "දැන්වීම් පුවරු, සටහන්, නීති සහ ඊමේල් කියවා තේරුම් ගැනීම",
    playlistUrl: "https://youtube.com/playlist?list=PLu6zNtvM7ddG3FqgJzClw49jMGLDbkA9Z"
  }
];
""")
    f.write(f"\nexport const JFT_FULL_MOCK_PAPERS: JFTMockTestPaper[] = {json.dumps(full_mock_papers, ensure_ascii=False, indent=2)};\n")
    f.write(f"\nexport const JFT_SCRIPT_VOCAB_PAPERS: JFTMockTestPaper[] = {json.dumps(script_vocab_papers, ensure_ascii=False, indent=2)};\n")
    f.write(f"\nexport const JFT_CONVERSATION_PAPERS: JFTMockTestPaper[] = {json.dumps(conversation_papers, ensure_ascii=False, indent=2)};\n")
    f.write(f"\nexport const JFT_LISTENING_PAPERS: JFTMockTestPaper[] = {json.dumps(listening_papers, ensure_ascii=False, indent=2)};\n")
    f.write(f"\nexport const JFT_READING_PAPERS: JFTMockTestPaper[] = {json.dumps(reading_papers, ensure_ascii=False, indent=2)};\n")
    f.write("""
export const JFT_ALL_PAPERS_BY_CATEGORY: Record<string, JFTMockTestPaper[]> = {
  full: JFT_FULL_MOCK_PAPERS,
  script_vocab: JFT_SCRIPT_VOCAB_PAPERS,
  conversation: JFT_CONVERSATION_PAPERS,
  listening: JFT_LISTENING_PAPERS,
  reading: JFT_READING_PAPERS
};
""")

print(f"Successfully generated {output_path}!")
