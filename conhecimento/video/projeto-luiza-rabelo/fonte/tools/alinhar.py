"""Alinha o roteiro à locução real (mp3 do ElevenLabs) sem modelo de transcrição: acha os silêncios com o ffmpeg,
casa cada silêncio com uma pontuação do roteiro (programação dinâmica) e distribui as palavras pelo número de letras
entre os pontos casados. Gera src/tempos.json no formato que as cenas usam (índice de palavra -> segundo do vídeo).
Uso: python3 tools/alinhar.py voz.mp3 roteiro.txt [inicio_da_fala_no_video=0.9]"""
import json, re, subprocess, sys

mp3, rot = sys.argv[1], sys.argv[2]
INICIO = float(sys.argv[3]) if len(sys.argv) > 3 else 0.9

dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3], capture_output=True, text=True).stdout)
r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', mp3, '-af', 'silencedetect=noise=-38dB:d=0.07', '-f', 'null', '-'], capture_output=True, text=True).stderr
ini_s = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', r)]
fim_s = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', r)]
gaps = list(zip(ini_s, fim_s + [dur] * (len(ini_s) - len(fim_s))))
# silêncio inicial e final não contam como pausa entre palavras
fala_ini = gaps[0][1] if gaps and gaps[0][0] < 0.05 else 0.0
fala_fim = gaps[-1][0] if gaps and gaps[-1][1] >= dur - 0.3 else dur
gaps = [(a, b) for a, b in gaps if a > fala_ini + 0.01 and b < fala_fim - 0.01]
# junta silêncios colados (um estalo no meio de uma pausa a divide em duas)
junt = []
for a, b in gaps:
    if junt and a - junt[-1][1] < 0.06: junt[-1] = (junt[-1][0], b)
    else: junt.append((a, b))
gaps = junt
# sílabas detectadas (picos de energia) em cada trecho de fala: medida de progresso mais fiel que o tempo
sys.path.insert(0, __file__.rsplit('/', 1)[0])
from silabas import silabas
trechos = list(zip([fala_ini] + [b for a, b in gaps], [a for a, b in gaps] + [fala_fim]))
sil_tr = [max(1, silabas(a, b)) for a, b in trechos]

texto = open(rot, encoding='utf-8').read().strip()
pars = [p.strip() for p in texto.split('\n\n') if p.strip()]
toks = []
for pi, p in enumerate(pars):
    ws = p.split()
    for wi, w in enumerate(ws):
        forca = 0
        if wi == len(ws) - 1: forca = 3
        elif w.endswith('...'): forca = 2.5
        elif w.endswith(('.', '!', '?')): forca = 2
        elif w.endswith((',', ';', ':')): forca = 1
        toks.append({'w': w, 'p': pi, 'peso': len(re.sub(r'[^\wÀ-ú]', '', w)) + 1.2, 'forca': forca,
                     'sil': max(1, len(re.findall(r'[aeiouáéíóúâêôãõày]+', w.lower())))})

# tempo de fala (sem silêncios) antes de cada silêncio
def fala_antes(t):
    s, prev = 0.0, fala_ini
    for a, b in gaps:
        if a >= t: break
        s += a - prev; prev = b
    return s + max(0.0, t - prev)
T = fala_antes(fala_fim)
Wt = sum(t['peso'] for t in toks)
cum, esp = 0.0, []
for t in toks:
    cum += t['peso']; esp.append(cum / Wt * T)  # fala esperada até o fim do token
gk = [fala_antes(a) for a, b in gaps]
St = sum(t['sil'] for t in toks); S = sum(sil_tr)
cs_, esp_s = 0, []
for t in toks:
    cs_ += t['sil']; esp_s.append(cs_ / St)
gs = [sum(sil_tr[:k + 1]) / S for k in range(len(gaps))]
B = [i for i, t in enumerate(toks[:-1]) if t['forca'] > 0]
K = len(gaps)
INF = 1e18
# dp[k][j]: melhor custo usando os k primeiros silêncios e as j primeiras pontuações
dp = [[INF] * (len(B) + 1) for _ in range(K + 1)]
bt = [[None] * (len(B) + 1) for _ in range(K + 1)]
dp[0][0] = 0
custo_sem_pausa = lambda j: {1: 0.15, 2: 1.2, 2.5: 1.6, 3: 2.5}[toks[B[j]]['forca']]
for k in range(K + 1):
    for j in range(len(B) + 1):
        c = dp[k][j]
        if c >= INF: continue
        if j < len(B) and c + custo_sem_pausa(j) < dp[k][j + 1]:
            dp[k][j + 1] = c + custo_sem_pausa(j); bt[k][j + 1] = ('b', k, j)
        if k < K:
            g = gaps[k][1] - gaps[k][0]
            cs = 1.0 + 12 * g  # silêncio sem pontuação (respiro): ok se curto
            if c + cs < dp[k + 1][j]:
                dp[k + 1][j] = c + cs; bt[k + 1][j] = ('g', k, j)
            if j < len(B):
                d = (gk[k] - esp[B[j]]) / max(0.6, 0.06 * T)
                ds = (gs[k] - esp_s[B[j]]) * St / max(2.0, 0.035 * St)
                cm = 0.3 * d * d + ds * ds - 0.4 * toks[B[j]]['forca']
                if c + cm < dp[k + 1][j + 1]:
                    dp[k + 1][j + 1] = c + cm; bt[k + 1][j + 1] = ('m', k, j)
k, j, pares = K, len(B), []
while (k, j) != (0, 0):
    tipo, k2, j2 = bt[k][j]
    if tipo == 'm': pares.append((B[j2], k2))
    k, j = k2, j2
pares.sort()
# pausas conferidas à mão (voz/pausas-manual.txt), quando existir: substituem o casamento automático
import os
man = os.path.join(os.path.dirname(mp3), 'pausas-manual.txt')
if os.path.exists(man):
    vals = ' '.join(l for l in open(man) if not l.startswith('#')).split()
    assert len(vals) == len(B), f'{len(vals)} pausas manuais para {len(B)} pontuações'
    pares = []
    for j, v in enumerate(vals):
        if v == '-': continue
        k = min(range(K), key=lambda kk: abs(gaps[kk][0] - float(v)))
        assert abs(gaps[k][0] - float(v)) < 0.05, f'pausa {v} não encontrada'
        pares.append((B[j], k))
# âncoras em tempo de fala: (índice do primeiro token depois, tempo de fala)
anc = [(0, 0.0)] + [(b + 1, gk[kk]) for b, kk in pares] + [(len(toks), T)]
fala = [0.0] * (len(toks) + 1)
for (i0, s0), (i1, s1) in zip(anc, anc[1:]):
    tot = sum(t['peso'] for t in toks[i0:i1]) or 1
    acc = 0.0
    for i in range(i0, i1):
        fala[i] = s0 + (s1 - s0) * acc / tot
        acc += toks[i]['peso']
fala[len(toks)] = T
casados = {b + 1 for b, _ in pares}
def real(s, inicio_de_token=False):
    # converte tempo de fala em tempo real do mp3 (pulando os silêncios)
    prev, acc = fala_ini, 0.0
    for a, b in gaps:
        seg = a - prev
        if s < acc + seg - 1e-6 or (not inicio_de_token and s <= acc + seg + 1e-6):
            return prev + (s - acc)
        acc += seg; prev = b
    return prev + (s - acc)
atraso = INICIO - fala_ini
pal = []
for i, t in enumerate(toks):
    ini = real(fala[i], inicio_de_token=True)
    fim = real(fala[i + 1])
    pal.append({'w': t['w'], 'p': t['p'], 'ini': round(ini + atraso, 3), 'fim': round(max(fim, ini + 0.05) + atraso, 3)})
saida = {'fonte': 'mp3', 'mp3': mp3, 'atraso': round(atraso, 3), 'dur': round(fala_fim + atraso + 2.4, 2), 'paragrafos': pars, 'palavras': pal}
json.dump(saida, open(sys.argv[4] if len(sys.argv) > 4 else 'src/tempos.json', 'w'), ensure_ascii=False, indent=0)
print(f'mp3 {dur:.1f} s, fala {fala_ini:.2f}-{fala_fim:.2f}, {K} silêncios, {len(pares)} casados com pontuação de {len(B)}; atraso {atraso:.2f} s; vídeo {saida["dur"]:.1f} s')
for b, kk in pares:
    print(f'  {gaps[kk][0]:6.2f}-{gaps[kk][1]:6.2f}  depois de "{toks[b]["w"]}"')
