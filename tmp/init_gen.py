# -*- coding: utf-8 -*-
import sys

# Script that generates complete src/data/preloadedVocabulary.ts
# Contains:
# 1. N5 Vocabulary (Nouns, expressions, basic daily words)
# 2. N4 Vocabulary (Intermediate expressions, work, society)
# 3. JFT Vocabulary (Daily conversation, Japanese workplace essentials)
# 4. N3 Vocabulary (Comprehensive collection from Oyama Japanese Academy N3 Words Book, 51 pages)

with open("/tmp/vocab_builder.py", "w", encoding="utf-8") as f:
    f.write('''# -*- coding: utf-8 -*-
import json

print("Starting generation...")
''')

print("Builder initialized")
