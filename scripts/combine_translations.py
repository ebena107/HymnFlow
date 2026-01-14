import json
import os

i18n_dir = r"c:\dev\HymnFlow\public\i18n"
output_file = os.path.join(i18n_dir, "translations.js")

translations = {}

for filename in os.listdir(i18n_dir):
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
