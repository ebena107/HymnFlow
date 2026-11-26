// Documentation guard: every relative link in the Markdown files resolves, and the
// install instructions match the layout of the release zip.
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.join(__dirname, '..');
let files;
try {
  files = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);
} catch (e) {
  console.log('docs tests skipped (not a git checkout)');
  process.exit(0);
}

const GITHUB_RELATIVE = ['../issues', '../pulls', '../discussions'];
const broken = [];
for (const f of files.filter(n => n.endsWith('.md'))) {
  const dir = path.dirname(path.join(root, f));
  const text = fs.readFileSync(path.join(root, f), 'utf8');
  for (const m of text.matchAll(/!?\[[^\]]*\]\(([^)\s]+)\)/g)) {
    const target = m[1];
    if (/^(https?:|mailto:|#)/.test(target) || GITHUB_RELATIVE.some(g => target.startsWith(g))) continue;
    const p = target.split('#')[0];
    if (p && !fs.existsSync(path.resolve(dir, p))) broken.push(`${f} -> ${target}`);
  }
}
assert.deepEqual(broken, [], `broken relative links:\n  ${broken.join('\n  ')}`);

// Install instructions must use the zip layout (no public/ in the URLs people type into OBS)
for (const f of ['README.md', 'doc/SETUP.md', 'doc/OBS_DOCK_README.md', 'public/obs-setup.html']) {
  const t = fs.readFileSync(path.join(root, f), 'utf8');
  assert.ok(!/file:\/\/\/C:\/HymnFlow\/public\//.test(t), `${f} tells users to use a public/ folder that release zips do not have`);
}

// The project is GPL-2.0: no document may claim another licence for the code
for (const f of files.filter(n => /^(README\.md|doc\/[^/]+\.md|\.github\/[^/]+\.md)$/.test(n) && !/RELEASE_NOTES|CHANGELOG/.test(n))) {
  const t = fs.readFileSync(path.join(root, f), 'utf8');
  assert.ok(!/\bMIT (L|l)icense\b/.test(t), `${f} mentions an MIT licence`);
}
assert.equal(JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).license, 'GPL-2.0-only');

console.log('docs tests passed');
