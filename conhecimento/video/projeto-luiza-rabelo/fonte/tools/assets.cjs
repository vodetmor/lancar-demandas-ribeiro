// Gera public/cinzel.typeface.json (texto 3D) e public/brasil.json (contorno do Brasil projetado).
const fs = require('fs');
const opentype = require('opentype.js');
const font = opentype.loadSync(__dirname + '/cinzel.ttf');
const scale = 100000 / ((font.unitsPerEm || 2048) * 72);
const glyphs = {};
for (const ch of 'LUIZARBELO36 ') {
  const g = font.charToGlyph(ch);
  const token = { ha: Math.round(g.advanceWidth * scale), x_min: Math.round((g.xMin || 0) * scale), x_max: Math.round((g.xMax || 0) * scale), o: '' };
  g.path.commands.forEach(c => {
    const t = c.type.toLowerCase();
    if (t === 'c') token.o += 'b ' + [c.x, c.y, c.x1, c.y1, c.x2, c.y2].map(v => Math.round(v * scale)).join(' ') + ' ';
    else if (t === 'q') token.o += 'q ' + [c.x, c.y, c.x1, c.y1].map(v => Math.round(v * scale)).join(' ') + ' ';
    else if (t === 'z') token.o += 'z ';
    else token.o += t + ' ' + Math.round(c.x * scale) + ' ' + Math.round(c.y * scale) + ' ';
  });
  glyphs[ch] = token;
}
fs.writeFileSync('public/cinzel.typeface.json', JSON.stringify({
  glyphs, familyName: 'Cinzel', ascender: Math.round(font.ascender * scale), descender: Math.round(font.descender * scale),
  underlinePosition: 0, underlineThickness: 0, boundingBox: { yMin: Math.round(font.tables.head.yMin * scale), xMin: 0, yMax: Math.round(font.tables.head.yMax * scale), xMax: 0 },
  resolution: 1000, original_font_information: font.tables.name,
}));
// Brasil
const topo = require('world-atlas/countries-50m.json');
const { feature } = require('topojson-client');
const br = feature(topo, topo.objects.countries).features.find(f => f.id === '076');
const lon0 = -52, lat0 = -14, k = Math.cos(lat0 * Math.PI / 180);
const proj = ([lon, lat]) => [+((lon - lon0) * k / 10).toFixed(4), +((lat - lat0) / 10).toFixed(4)];
const polys = (br.geometry.type === 'Polygon' ? [br.geometry.coordinates] : br.geometry.coordinates)
  .map(p => p[0]).filter(r => r.length > 40).map(r => r.filter((_, i) => i % 2 === 0).map(proj));
const cidades = { 'Brasília': [-47.93, -15.78], 'São Paulo': [-46.63, -23.55], 'Rio de Janeiro': [-43.2, -22.9], 'Belo Horizonte': [-43.94, -19.92], 'Salvador': [-38.5, -12.97], 'Recife': [-34.88, -8.05], 'Fortaleza': [-38.52, -3.73], 'Manaus': [-60.02, -3.1], 'Belém': [-48.5, -1.45], 'Porto Alegre': [-51.23, -30.03], 'Curitiba': [-49.27, -25.43], 'Goiânia': [-49.25, -16.68], 'Cuiabá': [-56.1, -15.6], 'Florianópolis': [-48.55, -27.6], 'Natal': [-35.2, -5.79], 'Campo Grande': [-54.62, -20.47], 'Palmas': [-48.33, -10.18], 'São Luís': [-44.3, -2.53] };
const c = {}; for (const [n, ll] of Object.entries(cidades)) c[n] = proj(ll);
fs.writeFileSync('public/brasil.json', JSON.stringify({ polys, cidades: c }));
console.log('ok', polys.length, polys.map(p => p.length));
