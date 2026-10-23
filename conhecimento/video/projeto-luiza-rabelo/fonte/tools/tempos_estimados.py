"""Tempos provisórios (sem áudio): estima o início de cada palavra pelo número de letras.
Saída src/tempos.json no mesmo formato que alinhar.py gera a partir do mp3 real."""
import json, re, sys
roteiro = open(sys.argv[1], encoding='utf-8').read().strip()
pars = [p.strip() for p in roteiro.split('\n\n') if p.strip()]
CPS = 15.0  # letras por segundo (Ana Dias costuma falar ~14-16)
t = 0.9
words = []
for pi, p in enumerate(pars):
    for tok in p.split():
        d = len(re.sub(r'[^\wÀ-ú]', '', tok)) / CPS + 0.06
        words.append({'w': tok, 'p': pi, 'ini': round(t, 3), 'fim': round(t + d, 3)})
        t += d
        if tok.endswith('...'): t += 0.45
        elif tok.endswith(('.', '!', '?')): t += 0.32
        elif tok.endswith(','): t += 0.14
    t += 0.35
json.dump({'fonte': 'estimado', 'dur': round(t + 1.6, 2), 'paragrafos': pars, 'palavras': words}, open(sys.argv[2], 'w'), ensure_ascii=False, indent=0)
print('duração', round(t + 1.6, 1), 's,', len(words), 'palavras')
