# -*- coding: utf-8 -*-
import json

header = """import { VocabularyItem } from "../types";

export const PRELOADED_VOCABULARY: VocabularyItem[] = [
"""

footer = """];
"""

# We will write the file incrementally in chunks
out_path = "/src/data/preloadedVocabulary.ts"

with open(out_path, "w", encoding="utf-8") as out:
    out.write(header)

print("Header written to", out_path)
