// Minimal test runner: runs every tests/*.test.js in a child process.
const { readdirSync } = require('node:fs');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
let failed = 0;
for (const f of readdirSync(__dirname).filter(n => n.endsWith('.test.js')).sort()) {
  const r = spawnSync(process.execPath, [path.join(__dirname, f)], { stdio: 'inherit' });
  if (r.status !== 0) { failed++; console.error(`FAIL ${f}`); }
}
if (failed) { console.error(`${failed} test file(s) failed`); process.exit(1); }
console.log('all test files passed');
