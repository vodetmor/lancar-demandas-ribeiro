"""Gera as páginas HTML das texturas 3D (placa, telas do celular, sacola, etiqueta). render.cjs fotografa cada uma."""
import json, os
D = os.path.dirname(os.path.abspath(__file__))
F = 'file://' + os.path.abspath(D + '/../../public/fonts')
L = 'file://' + os.path.abspath(D + '/../../public/logos')
I = 'file://' + os.path.abspath(D + '/../../public/img')
base = f"""<style>
@font-face{{font-family:Cinzel;src:url({F}/cinzel.woff2)}}
@font-face{{font-family:Corm;src:url({F}/cormorant.woff2)}}
@font-face{{font-family:Corm;font-style:italic;src:url({F}/cormorant-italic.woff2)}}
@font-face{{font-family:Jost;src:url({F}/jost.woff2)}}
*{{margin:0;padding:0;box-sizing:border-box}} html,body{{width:100%;height:100%;overflow:hidden}}
body{{font-family:Jost, Arial, sans-serif}}
</style>"""
STAR = '<svg viewBox="0 0 24 24" width="{s}" height="{s}"><path d="M12 2.6l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.4l-5.9 3.3 1.3-6.6L2.5 9.5l6.6-.8z" fill="{c}" stroke="{st}" stroke-width="{sw}" stroke-linejoin="round"/></svg>'
paginas = {}
qr = open(D + '/qr-site.svg').read()
nfc = """<svg viewBox="0 0 220 150" width="300" height="205" fill="none" stroke="#1d1d1f" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
<rect x="118" y="14" width="66" height="122" rx="12"/><path d="M140 26h22"/>
<path d="M92 50c-10 16-10 34 0 50M68 36c-17 24-17 54 0 78M44 22c-24 32-24 74 0 106"/></svg>"""
stars5 = ''.join(STAR.format(s=74, c='#FBBC04', st='#FBBC04', sw=0) for _ in range(5))
paginas['placa'] = (1000, 1250, base + f"""<body style="background:#fff;position:relative">
<div style="position:absolute;inset:0 0 auto 0;height:640px;background:#1849B8"></div>
<svg style="position:absolute;left:0;top:560px" width="1000" height="160" viewBox="0 0 1000 160"><path d="M0 40 C 250 130, 600 -20, 1000 70 L1000 160 L0 160Z" fill="#fff"/><path d="M0 40 C 250 130, 600 -20, 1000 70" stroke="#4A86F0" stroke-width="10" fill="none"/></svg>
<div style="position:absolute;top:90px;width:100%;text-align:center">{stars5}</div>
<div style="position:absolute;top:200px;width:100%;text-align:center;color:#fff;font:700 70px/1.12 Jost;letter-spacing:.01em">NÓS AGRADECEMOS SUA<br>AVALIAÇÃO NO GOOGLE!</div>
<div style="position:absolute;top:470px;left:380px;width:240px;height:240px;border-radius:50%;background:#fff;box-shadow:0 6px 18px rgba(0,0,0,.18);display:flex;align-items:center;justify-content:center"><img src="{L}/wikimedia-google-g.svg" width="150"></div>
<div style="position:absolute;top:820px;left:60px;width:420px;text-align:center">{nfc}<div style="font:500 44px Jost;color:#1d1d1f;margin-top:18px">Aproxime seu celular</div></div>
<div style="position:absolute;top:800px;left:520px;height:380px;border-left:4px solid #d0d4dc"></div>
<div style="position:absolute;top:790px;left:580px;width:360px;text-align:center;font:500 34px Jost;color:#1d1d1f">ou escaneie o<br>QR Code<div style="margin:18px auto 0;width:260px;height:260px">{qr.replace('<svg', '<svg width="260" height="260"', 1)}</div></div>
</body>""")
# telas do celular (proporção 0,4615 = 620x1344)
W, H = 620, 1344
paginas['tela-travada'] = (W, H, base + f"""<body style="background:#1E1A17 url({I}/loja-interior-salao-sofa-curvo.webp) center/cover;position:relative">
<div style="position:absolute;inset:0;background:rgba(20,16,14,.35)"></div>
<div style="position:absolute;top:150px;width:100%;text-align:center;color:#fff;font:300 150px/1 Jost;letter-spacing:-.02em">10:24</div>
<div style="position:absolute;top:118px;width:100%;text-align:center;color:#fff;font:400 26px Jost">sábado, 25 de outubro</div>
<div style="position:absolute;bottom:60px;left:50%;margin-left:-70px;width:140px;height:8px;border-radius:4px;background:#fff"></div></body>""")
for n in range(6):
    st = ''.join(STAR.format(s=78, c=('#FBBC04' if i < n else 'none'), st=('#FBBC04' if i < n else '#80868b'), sw=(0 if i < n else 1.4)) for i in range(5))
    paginas[f'tela-avaliacao-{n}'] = (W, H, base + f"""<body style="background:#fff;position:relative;font-family:Jost">
<div style="padding:70px 34px 0;display:flex;align-items:center;gap:16px"><img src="{L}/wikimedia-google-g.svg" width="40"><span style="font:500 28px Jost;color:#202124">Avaliar no Google</span></div>
<div style="margin:60px 34px 0;display:flex;align-items:center;gap:20px">
<div style="width:86px;height:86px;border-radius:50%;background:#1E1A17;color:#EED9D0;display:flex;align-items:center;justify-content:center;font:400 30px Cinzel">LR</div>
<div><div style="font:500 36px Jost;color:#202124">Luiza Rabelo</div><div style="font:400 24px Jost;color:#5f6368;margin-top:4px">Loja de moda feminina · Sobradinho</div></div></div>
<div style="margin:56px 34px 0;font:400 24px Jost;color:#5f6368">Postando publicamente</div>
<div style="margin:26px 0 0;display:flex;justify-content:center;gap:8px">{st}</div>
<div style="margin:56px 34px 0;height:250px;border:2px solid #dadce0;border-radius:14px;padding:22px;font:400 26px/1.35 Jost;color:#80868b">Compartilhe detalhes da sua experiência neste local</div>
<div style="position:absolute;right:34px;bottom:90px;background:{'#1a73e8' if n == 5 else '#e8eaed'};color:{'#fff' if n == 5 else '#9aa0a6'};font:500 28px Jost;padding:20px 40px;border-radius:40px">Publicar</div>
</body>""")
paginas['sacola'] = (900, 1000, base + """<body style="background:#FFFDFB;position:relative">
<div style="position:absolute;top:640px;width:100%;text-align:center;font:400 64px Cinzel;letter-spacing:.14em;color:#3A332E">LUIZA RABELO</div>
<div style="position:absolute;top:740px;width:100%;text-align:center;font:400 22px Jost;letter-spacing:.42em;color:#85594A">SOBRADINHO · DF</div></body>""")
paginas['sacola-lado'] = (400, 1000, base + """<body style="background:#F7F0E8"></body>""")
paginas['etiqueta'] = (600, 600, base + """<body style="background:transparent"><div style="width:600px;height:600px;border-radius:50%;background:#EED9D0;display:flex;flex-direction:column;align-items:center;justify-content:center;border:10px solid #FFFDFB;outline:4px solid #B98B6E;outline-offset:-30px">
<div style="font:400 64px Cinzel;color:#1E1A17;letter-spacing:.08em;text-align:center;line-height:1.05">LUIZA<br>RABELO</div><div style="font:400 24px Jost;letter-spacing:.36em;color:#85594A;margin-top:22px">SOBRADINHO · DF</div></div></body>""")
paginas['papel-seda'] = (800, 800, base + """<body style="background:#EED9D0"></body>""")
for k, (w, h, html) in paginas.items():
    open(f'{D}/{k}.html', 'w').write(f'<!doctype html><meta charset="utf-8">{html}')
json.dump({k: [w, h] for k, (w, h, _) in paginas.items()}, open(D + '/tamanhos.json', 'w'))
print(len(paginas), 'páginas')
