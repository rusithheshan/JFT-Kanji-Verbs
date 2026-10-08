# -*- coding: utf-8 -*-
import json, sys

print("Building JFT mock data generator...")

# Helper to format TS object
def format_q(q):
    return {
        "id": q["id"],
        "section": q["section"],
        "sectionTitleJp": q["sectionTitleJp"],
        "sectionTitleSi": q["sectionTitleSi"],
        "category": q["category"],
        "questionNumber": q["questionNumber"],
        "contextJp": q.get("contextJp", ""),
        "contextSi": q.get("contextSi", ""),
        "audioScriptJp": q.get("audioScriptJp", ""),
        "audioScriptRomaji": q.get("audioScriptRomaji", ""),
        "questionJp": q["questionJp"],
        "questionSi": q["questionSi"],
        "options": [
            {"id": i + 1, "textJp": opt["jp"], "textSi": opt["si"]}
            for i, opt in enumerate(q["options"])
        ],
        "correctOption": q["correctOption"],
        "explanationSi": q["explanationSi"],
        "explanationJp": q.get("explanationJp", "")
    }

print("Helper ready")
