import json
import os

# Paths relative to repo root
script_dir = os.path.dirname(os.path.abspath(__file__))
repo_root = os.path.dirname(script_dir)
i18n_dir = os.path.join(repo_root, "public", "i18n")
output_file = os.path.join(i18n_dir, "translations.js")

translations = {}

for filename in sorted(os.listdir(i18n_dir)):
    if filename.endswith(".json"):
        lang = filename.split(".")[0]
        with open(os.path.join(i18n_dir, filename), "r", encoding="utf-8") as f:
            translations[lang] = json.load(f)

with open(output_file, "w", encoding="utf-8") as f:
    f.write("// HymnFlow Consolidated Translations\n")
    f.write("// Generated automatically to support file:// protocol compatibility\n\n")
    f.write("window.HymnFlowTranslations = ")
    json.dump(translations, f, indent=2, ensure_ascii=False)
    f.write(";\n")

print(f"Successfully generated {output_file}")
print("Edit the per-language .json files, then run this script to regenerate translations.js.")
print("tests/i18n.test.js fails if the .json files and translations.js disagree.")
