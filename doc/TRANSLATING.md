# Translating HymnFlow

The dock is available in English, Spanish, French, Portuguese, Swahili, Tagalog,
Yoruba, Chinese and Korean. Every visible label, placeholder, tooltip and message
comes from a translation key, so improving or adding a language never needs code
changes.

## Where the text lives

- `public/i18n/<lang>.json` — one file per language (edit these).
- `public/i18n/translations.js` — what the dock actually loads (works from
  `file://`). Regenerate it with:

```bash
python scripts/combine_translations.py
```

`npm test` runs `tests/i18n.test.js`, which fails if:

- a language is missing any English key,
- a `{placeholder}` such as `{count}` or `{error}` differs from English,
- the `.json` files and `translations.js` disagree, or
- the dock HTML/JS uses a key that does not exist.

## Adding text to the dock

- HTML: add `data-i18n="area.key"` (text), `data-i18n-placeholder`,
  `data-i18n-title` or `data-i18n-aria`.
- JavaScript: `t('area.key', 'English fallback', { param })`.

Then add the key to `en.json` and every other language file.

## Quality note

The Spanish, French, Portuguese, Chinese and Korean text was written carefully but
has not been reviewed by native speakers. The Swahili, Tagalog and Yoruba text in
particular benefits from a native review before wide release. Corrections are very
welcome — edit the `.json` file and open a pull request.
