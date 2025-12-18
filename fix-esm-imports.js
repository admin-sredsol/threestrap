const fs = require('fs');
const path = require('path');

const esmFile = path.join(__dirname, 'build', 'threestrap.module.js');
const threeCdn = 'https://unpkg.com/three@0.182.0/build/three.module.js';

try {
  let code = fs.readFileSync(esmFile, 'utf8');
  const replaced = code.replace(/from "three"/g, `from "${threeCdn}"`);
  fs.writeFileSync(esmFile, replaced);
  console.log('Rewrote all `from "three"` imports in threestrap.module.js to CDN URL.');
} catch (err) {
  console.error('Error rewriting imports in threestrap.module.js:', err);
  process.exit(1);
}
