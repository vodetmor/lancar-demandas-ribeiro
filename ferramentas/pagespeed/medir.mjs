#!/usr/bin/env node
// Mede desempenho (Lighthouse) de sites publicados ou pastas locais e imprime um resumo curto.
// Uso: node medir.mjs <url|pasta> [...] [--lista sites.txt] [--modo celular|pc|ambos] [--top 6]
// Detalhes no README.md desta pasta.
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, appendFileSync, statSync, createReadStream } from 'node:fs';
import { createServer } from 'node:http';
import { join, resolve, extname, dirname } from 'node:path';
import { homedir } from 'node:os';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const CACHE = join(homedir(), '.cache', 'pagespeed');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
const lista = opt('--lista');
const modo = opt('--modo', 'ambos');
const TOP = Number(opt('--top', 6));
const saida = resolve(opt('--saida', join(AQUI, 'resultados')));
let alvos = [...args];
if (lista) alvos.push(...readFileSync(lista, 'utf8').split('\n').map(l => l.replace(/#.*/, '').trim()).filter(Boolean));
if (!alvos.length) { console.log('uso: node medir.mjs <url|pasta> [...] [--lista sites.txt] [--modo celular|pc|ambos]'); process.exit(1); }
const modos = modo === 'ambos' ? ['celular', 'pc'] : [modo];
mkdirSync(saida, { recursive: true });

// Lighthouse instalado uma vez fora da pasta compartilhada (node_modules em rede é lento).
function lighthouseBin() {
  const bin = join(CACHE, 'node_modules', '.bin', process.platform === 'win32' ? 'lighthouse.cmd' : 'lighthouse');
  if (!existsSync(bin)) {
    mkdirSync(CACHE, { recursive: true });
    execFileSync('npm', ['i', '--prefix', CACHE, 'lighthouse@12', '--no-audit', '--no-fund', '--silent'], { stdio: 'inherit', shell: process.platform === 'win32' });
  }
  return bin;
}
function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const pw = '/opt/pw-browsers';
  if (existsSync(pw)) for (const d of readdirSync(pw)) {
    const c = join(pw, d, 'chrome-linux', 'chrome');
    if (d.startsWith('chromium-') && existsSync(c)) return c;
  }
  return undefined; // chrome-launcher acha o Chrome instalado (Windows/Mac)
}

// Servidor estático com gzip e cache longo, parecido com a Vercel, para medir pastas locais.
const TIPOS = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain', '.xml': 'application/xml', '.mp4': 'video/mp4', '.webm': 'video/webm', '.glb': 'model/gltf-binary' };
const COMPRIME = new Set(['.html', '.css', '.js', '.mjs', '.json', '.svg', '.txt', '.xml']);
function servir(pasta) {
  return new Promise(ok => {
    const srv = createServer((req, res) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      let f = join(pasta, p);
      if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
      if (!existsSync(f) && existsSync(f + '.html')) f += '.html';
      if (!existsSync(f)) { res.writeHead(404); return res.end(); }
      const ext = extname(f).toLowerCase();
      const h = { 'content-type': TIPOS[ext] || 'application/octet-stream', 'cache-control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000' };
      if (COMPRIME.has(ext) && /gzip/.test(req.headers['accept-encoding'] || '')) {
        res.writeHead(200, { ...h, 'content-encoding': 'gzip' }); return res.end(gzipSync(readFileSync(f)));
      }
      res.writeHead(200, h); createReadStream(f).pipe(res);
    }).listen(0, '127.0.0.1', () => ok(srv));
  });
}

async function viaPSI(url, m) {
  const q = new URLSearchParams({ url, strategy: m === 'pc' ? 'desktop' : 'mobile', key: process.env.PSI_KEY });
  for (const c of ['performance', 'accessibility', 'best-practices', 'seo']) q.append('category', c);
  const r = await fetch('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?' + q);
  const j = await r.json();
  if (!r.ok) throw new Error(j.error?.message || r.status);
  return j.lighthouseResult;
}
async function viaLocal(url, m) {
  const flags = [url, '--output=json', '--quiet', '--output-path=stdout', '--max-wait-for-load=60000',
    '--chrome-flags=--headless=new --no-sandbox --disable-gpu' + (process.env.HTTPS_PROXY ? ' --proxy-server=' + process.env.HTTPS_PROXY : '')];
  if (m === 'pc') flags.push('--preset=desktop');
  const env = { ...process.env }; const cp = chromePath(); if (cp) env.CHROME_PATH = cp;
  // Assíncrono: o servidor local roda neste mesmo processo e precisa responder enquanto o Lighthouse mede.
  return new Promise((ok, falha) => {
    const p = spawn(lighthouseBin(), flags, { env, shell: process.platform === 'win32' });
    let out = '', err = '';
    p.stdout.on('data', d => out += d); p.stderr.on('data', d => err += d);
    p.on('close', () => { try { ok(JSON.parse(out)); } catch { falha(new Error(err.trim().split('\n').slice(-2).join(' '))); } });
  });
}

function resumo(lhr, nome, m) {
  const s = k => Math.round((lhr.categories[k]?.score ?? 0) * 100);
  const a = lhr.audits, v = k => a[k]?.displayValue ?? '-';
  const linhas = [`${nome} [${m}] desempenho ${s('performance')} · acess ${s('accessibility')} · práticas ${s('best-practices')} · SEO ${s('seo')}`,
    `  LCP ${v('largest-contentful-paint')} · FCP ${v('first-contentful-paint')} · TBT ${v('total-blocking-time')} · CLS ${v('cumulative-layout-shift')} · SI ${v('speed-index')}`];
  // Problemas que pesam no desempenho, maiores economias primeiro.
  const ids = (lhr.categories.performance?.auditRefs || []).map(r => r.id);
  const ruins = ids.map(id => a[id]).filter(x => x && x.score !== null && x.score < 0.9 && x.scoreDisplayMode !== 'informative' && x.scoreDisplayMode !== 'notApplicable' && !/^(largest-contentful-paint|first-contentful-paint|total-blocking-time|cumulative-layout-shift|speed-index|interactive|max-potential-fid)$/.test(x.id))
    .sort((x, y) => (y.metricSavings?.LCP || 0) + (y.metricSavings?.FCP || 0) + (y.metricSavings?.TBT || 0) - (x.metricSavings?.LCP || 0) - (x.metricSavings?.FCP || 0) - (x.metricSavings?.TBT || 0) || (y.details?.overallSavingsMs || 0) - (x.details?.overallSavingsMs || 0));
  // Lighthouse 12 traz cada problema em versão antiga e "insight"; fica só o insight.
  const ANTIGOS = /^(render-blocking-resources|modern-image-formats|uses-optimized-images|uses-responsive-images|efficient-animated-content|prioritize-lcp-image|largest-contentful-paint-element|layout-shifts|font-display|third-party-summary|uses-long-cache-ttl|uses-text-compression|redirects)$/;
  const vistos = new Set();
  for (const x of ruins) {
    if (ANTIGOS.test(x.id)) continue;
    const itens = (x.details?.items || []).slice(0, 2).map(i => String(i.url || i.node?.selector || i.source?.url || '').replace(/^https?:\/\/[^/]+/, '').slice(0, 50)).filter(Boolean);
    const chave = (x.displayValue || x.title) + itens.join(); // Lighthouse 12 repete itens como "insights"
    if (vistos.has(chave) || vistos.size >= TOP) continue; vistos.add(chave);
    linhas.push(`  - ${x.title}${x.displayValue ? ' (' + x.displayValue + ')' : ''}${itens.length ? ': ' + itens.join(', ') : ''}`);
  }
  return linhas.join('\n');
}

const hist = join(saida, 'historico.csv');
if (!existsSync(hist)) writeFileSync(hist, 'data,alvo,modo,fonte,desempenho,acess,praticas,seo,lcp_ms,tbt_ms,cls\n');
for (const alvo of alvos) {
  const local = !/^https?:\/\//.test(alvo);
  let srv, url = alvo;
  if (local) { srv = await servir(resolve(alvo)); url = `http://127.0.0.1:${srv.address().port}/`; }
  for (const m of modos) {
    try {
      const psi = !local && process.env.PSI_KEY;
      const lhr = psi ? await viaPSI(url, m) : await viaLocal(url, m);
      const slug = alvo.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(-60);
      writeFileSync(join(saida, `${slug}-${m}.json`), JSON.stringify(lhr));
      console.log(resumo(lhr, alvo, m) + (psi ? '' : local ? '  (pasta local)' : ''));
      const c = k => Math.round((lhr.categories[k]?.score ?? 0) * 100), n = k => Math.round(lhr.audits[k]?.numericValue ?? 0);
      appendFileSync(hist, [new Date().toISOString().slice(0, 16), alvo, m, psi ? 'psi' : 'local', c('performance'), c('accessibility'), c('best-practices'), c('seo'), n('largest-contentful-paint'), n('total-blocking-time'), (lhr.audits['cumulative-layout-shift']?.numericValue ?? 0).toFixed(3)].join(',') + '\n');
    } catch (e) { console.log(`${alvo} [${m}] ERRO: ${e.message}`); }
  }
  srv?.close();
}
