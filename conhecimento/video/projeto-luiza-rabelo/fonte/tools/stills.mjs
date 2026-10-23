// Renderiza quadros soltos: node tools/stills.mjs out/dir 0 120 300 ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'path';
const [out, ...fr] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const comp = await selectComposition({serveUrl, id: 'LuizaRabelo', chromiumOptions: {gl: 'angle'}, browserExecutable: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell'});
for (const f of fr.map(Number)) {
  const t = Date.now();
  await renderStill({serveUrl, composition: comp, frame: f, output: `${out}/q${String(f).padStart(4, '0')}.jpg`, imageFormat: 'jpeg', jpegQuality: 85,
    chromiumOptions: {gl: 'angle'}, browserExecutable: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell', timeoutInMilliseconds: 120000});
  console.log('quadro', f, (Date.now() - t) + 'ms');
}
