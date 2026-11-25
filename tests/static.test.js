// Guards the security posture: no inline handlers/scripts, strict CSP, valid JS syntax.
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const pub = path.join(__dirname, '..', 'public');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}
const files = walk(pub);

// 1. Every first-party JS file parses
for (const f of files.filter(f => f.endsWith('.js') && !f.includes('bible-yor'))) {
  const r = spawnSync(process.execPath, ['--check', f], { encoding: 'utf8' });
  assert.equal(r.status, 0, `syntax error in ${f}\n${r.stderr}`);
}

// 2. No inline event-handler attributes in the dock/overlay markup or generated templates
for (const f of ['obs-dock/index.html', 'obs-overlay/index.html', 'obs-dock/obs-dock.js', 'obs-overlay/overlay.js']) {
  const src = fs.readFileSync(path.join(pub, f), 'utf8');
  assert.ok(!/\son(click|change|input|keydown|keyup|submit|load|error)\s*=\s*["']/i.test(src), `inline handler in ${f}`);
  assert.ok(!/\beval\s*\(|new Function\s*\(/.test(src), `eval/new Function in ${f}`);
}

// 3. CSP is present, forbids inline script, and has no unsafe-eval
for (const f of ['obs-dock/index.html', 'obs-overlay/index.html']) {
  const html = fs.readFileSync(path.join(pub, f), 'utf8');
  const csp = (html.match(/http-equiv="Content-Security-Policy"\s+content="([^"]+)"/) || [])[1];
  assert.ok(csp, `no CSP in ${f}`);
  const script = (csp.match(/script-src([^;]*)/) || [])[1] || '';
  assert.ok(script && !/unsafe-inline|unsafe-eval|\*/.test(script), `weak script-src in ${f}: ${script}`);
  assert.ok(/object-src 'none'/.test(csp) && /base-uri 'none'/.test(csp), `CSP missing object-src/base-uri in ${f}`);
  assert.ok(!/<script>[\s\S]*?<\/script>/i.test(html), `inline <script> in ${f}`);
}
console.log('static checks passed');
