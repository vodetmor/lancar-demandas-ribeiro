const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), D = __dirname, out = process.argv[2];
const t = JSON.parse(fs.readFileSync(D + '/tamanhos.json'));
(async () => {
  const b = await chromium.launch();
  for (const [k, [w, h]] of Object.entries(t)) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto('file://' + D + '/' + k + '.html'); await p.waitForTimeout(500);
    await p.screenshot({ path: out + '/' + k + '.png', omitBackground: true }); await p.close();
  }
  await b.close();
})();
