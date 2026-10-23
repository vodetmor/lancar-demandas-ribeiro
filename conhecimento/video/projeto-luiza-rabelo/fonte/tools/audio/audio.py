"""Trilha original + efeitos + mix do vídeo Luiza Rabelo. Tudo sintetizado (synth.py do repo do Vítor), sem licença a pagar.
Trilha em Fá maior, 90 BPM (20 quadros por tempo): piano elétrico e pad na história, fica mais seca no problema,
ganha baixo e pulso leve na solução, volta ao piano no "36 anos" e fecha com sino nas portas.
Efeitos presos às mesmas palavras das animações (src/tempos.json). Música ~20 dB abaixo da voz. Master -14 LUFS / -1 dBTP.
Uso: python3 tools/audio/audio.py [voz.mp3]   ->  out/audio.wav  (sem voz: out/audio-sem-voz.wav, para conferir a trilha)"""
import json, os, re, subprocess, sys
import numpy as np
from scipy.io import wavfile
from scipy.signal import fftconvolve, resample_poly
from scipy.ndimage import maximum_filter1d, uniform_filter1d

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from synth import *  # noqa

TEMPOS = json.load(open(os.path.join(HERE, '..', '..', 'src', 'tempos.json')))
PAL = TEMPOS['palavras']
ATRASO = float(TEMPOS.get('atraso', 0.0))  # onde o mp3 começa no vídeo (as palavras já estão no tempo do vídeo)
ALVO = 14.0
FPS = 30
NFR = int(np.ceil(TEMPOS['dur'] * FPS))
N = int(NFR / FPS * SR) + SR // 2
OUT = os.path.join(HERE, '..', '..', 'out')
os.makedirs(OUT, exist_ok=True)
VOZ = sys.argv[1] if len(sys.argv) > 1 else None


def W(i):
    return int(round(PAL[min(i, len(PAL) - 1)]['ini'] * FPS))


def ts(f):
    return f / FPS


mus = np.zeros((N, 2))
drm = np.zeros((N, 2))
sfx = np.zeros((N, 2))
rev = np.zeros((N, 2))
hero = np.zeros((N, 2))


def place(dst, sig, f, gain=1.0, pan=0.0, send=0.0):
    i = int(round(ts(f) * SR))
    if i >= N or i + len(sig) <= 0:
        return
    s = sig
    if i < 0:
        s, i = s[-i:], 0
    s = s[: N - i]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    dst[i: i + len(s), 0] += s * gain * l * 1.4142
    dst[i: i + len(s), 1] += s * gain * r * 1.4142
    if send:
        rev[i: i + len(s), 0] += s * gain * send
        rev[i: i + len(s), 1] += s * gain * send


# ---------------------------------------------------------------- harmonia: Fá maior, I - V - vi - IV (F C Dm Bb)
BEAT = 20  # quadros por tempo (90 BPM)
BAR = 4 * BEAT
CH = {'F': [53, 57, 60, 64], 'C': [52, 55, 60, 62], 'Dm': [50, 53, 57, 60], 'Bb': [50, 53, 58, 62], 'Gm': [50, 55, 58, 62]}
ROOT = {'F': 29, 'C': 36, 'Dm': 38, 'Bb': 34, 'Gm': 31}
CYC = ['F', 'C', 'Dm', 'Bb']
CYC_PROB = ['Dm', 'Bb', 'Gm', 'C']


def grade(f):
    return int(round(f / BAR) * BAR)


SECT = [(0, 'intro'), (grade(W(26)), 'light'), (grade(W(52)), 'break'), (grade(W(83)) - BAR // 2, 'groove'), (grade(W(154)), 'full'),
        (grade(W(190)), 'groove'), (grade(W(218)), 'light'), (grade(W(243)), 'build'), (W(245) - 2, 'outro'), (NFR + 1, 'end')]


def sect(f):
    s = 'intro'
    for a, n in SECT:
        if f >= a:
            s = n
    return s


nbars = NFR // BAR + 2
for b in range(nbars):
    f0 = b * BAR
    s = sect(f0)
    if s in ('end', 'outro'):
        continue
    ch = (CYC_PROB if s == 'break' else CYC)[b % 4]
    notas = CH[ch]
    # pad sempre (mais baixo no intro)
    for n in notas[:3]:
        place(mus, pad_voice(midi(n), 4 * BEAT / FPS, att=0.8, rel=1.2, bright=1800), f0, gain={'intro': 0.5, 'break': 0.7}.get(s, 0.6), pan=0.0, send=0.25)
    # piano elétrico: arpejo em colcheias, suave
    if s in ('intro', 'light', 'groove', 'full', 'build'):
        arp = [notas[0] + 12, notas[1] + 12, notas[2] + 12, notas[3] + 12, notas[2] + 12, notas[1] + 12, notas[3] + 12, notas[2] + 12]
        for k, n in enumerate(arp):
            if s == 'intro' and k % 2:
                continue
            g = 0.32 if k % 2 == 0 else 0.22
            place(mus, ep(midi(n), d=1.4), f0 + k * BEAT // 2, gain=g, pan=-0.35 + 0.1 * (k % 4), send=0.35)
    if s == 'break':  # só duas notas graves por compasso, espaço para a fala do problema
        place(mus, ep(midi(notas[0]), d=2.4), f0, gain=0.34, pan=-0.2, send=0.5)
        place(mus, ep(midi(notas[2]), d=2.0), f0 + 2 * BEAT, gain=0.24, pan=0.2, send=0.5)
    # sino agudo no começo de cada compasso do piano (brilho de joia)
    if s in ('light', 'full') and b % 2 == 0:
        place(mus, bell(midi(notas[-1] + 24), d=2.2, decay=0.9), f0, gain=0.07, pan=0.4, send=0.6)
    # baixo e pulso
    if s in ('groove', 'full', 'build'):
        r = ROOT[ch]
        for k, (off, dur) in enumerate(((0, 0.5), (BEAT * 1.5, 0.25), (BEAT * 2, 0.45), (BEAT * 3.5, 0.2))):
            place(mus, bass(midi(r + 12), d=dur, decay=dur * 0.6), f0 + int(off), gain=0.55)
        for k in range(4):
            place(drm, kick(d=0.35, punch=0.6, tone=50.0), f0 + k * BEAT, gain=0.42 if k in (0, 2) else 0.0)
            place(drm, shaker(), f0 + k * BEAT + BEAT // 2, gain=0.10, pan=0.3)
        if s == 'full':
            for k in (1, 3):
                place(drm, snap(), f0 + k * BEAT, gain=0.16, pan=-0.1, send=0.3)
            for k in range(8):
                place(drm, hat(), f0 + k * BEAT // 2, gain=0.06 if k % 2 else 0.09, pan=0.25)
    if s == 'build':
        place(mus, riser(BAR / FPS, 300, 4000, tone=True), f0, gain=0.18, send=0.4)

# final: acorde aberto com sino quando as portas abrem
fo = W(245) - 2
for n in (41, 53, 57, 60, 64, 69):
    place(mus, pad_voice(midi(n), 4.5, att=0.05, rel=2.5, bright=2600), fo, gain=0.55, send=0.5)
for k, n in enumerate((72, 76, 79, 84)):
    place(mus, bell(midi(n), d=4.0, decay=1.8), fo + k * 3, gain=0.16, pan=-0.3 + 0.2 * k, send=0.7)
place(mus, ep(midi(53), d=4.0), fo, gain=0.4, send=0.5)

# ---------------------------------------------------------------- efeitos (presos às palavras)
S = lambda sig, f, g=1.0, pan=0.0, send=0.15: place(sfx, sig, f, g, pan, send)  # noqa
S(swish(0.25, 600, 3500), W(0) - 6, 0.25)
for i0, pan in ((21, -0.3), (23, 0.3)):
    S(flap_land(392.0, weight=0.6), W(i0) + 8, 0.5, pan)
S(whoosh(0.45, 300, 3000, peak=0.8), W(26) - 10, 0.35)
S(flap_land(330.0, weight=0.9), W(26) + 6, 0.6)
S(whoosh(0.4, 3000, 400, peak=0.3), W(29) - 6, 0.3)
for i in range(11):  # letras do nome pousando
    S(tick(2600 + 90 * i, d=0.04, decay=0.008), W(31) - 4 + i * 2 + 10, 0.18, -0.5 + i * 0.1)
S(shimmer(midi(84), 1.2), W(31) + 14, 0.25, 0.0, 0.5)
for i0 in (33, 36, 39):
    S(swish(0.22, 700, 4200), W(i0) - 5, 0.35, 0.3)
S(whoosh(0.5, 400, 5000, peak=0.85), W(52) - 12, 0.4)
for i0, i1 in ((52, 58), (195, 199)):  # digitação
    a, b = W(i0) + 2, W(i1)
    n = max(1, (b - a) // 2)
    for k in range(n):
        S(keytick(), a + k * 2, 0.22, 0.1)
S(swish(0.25, 500, 3000), W(59) - 2, 0.35)
S(pop(700), W(68) - 3, 0.35, 0.2)
S(pop(620), W(70) - 3, 0.35, 0.2)
S(thud(0.5, 60.0), W(74) - 2, 0.45)
S(thud(0.5, 55.0), W(77) - 2, 0.45)
S(whoosh(0.7, 250, 3500, peak=0.75), W(83) - 4, 0.4)
S(thud(0.45, 62.0), W(83) + 18, 0.35)
for k in range(8):
    S(swish(0.16, 900, 5000), W(98) - 2 + k * 2, 0.12, -0.6 + 0.17 * k)
S(mouse_click(), W(110), 0.45, 0.1)
S(whoosh(0.4, 3000, 500, peak=0.3), W(114) - 6, 0.3, 0.3)
S(thud(0.4, 70.0), W(114) + 4, 0.45, 0.3)
S(pop(980), W(115) + 12, 0.3, 0.3)
S(plip(), W(120) - 2, 0.55, 0.2)
S(whoosh(0.5, 300, 2500, peak=0.8), W(126) - 6, 0.3)
S(flap_land(260.0, weight=0.8), W(137) + 4, 0.45)
for k, d in enumerate((0, 3, 8, 12)):
    S(flap_land(294.0 + 30 * k, weight=0.7), W(141) - 6 + d + 12, 0.42, -0.3 + 0.2 * k)
S(button_press(), W(144) + 2, 0.5)
S(whoosh(1.0, 200, 3000, peak=0.85), W(149) - 8, 0.35)
for k in range(17):
    S(blip(1200 + 40 * k, d=0.1, decay=0.04), W(150) + k * 2 + 14, 0.06, -0.6 + 0.07 * k)
S(swish(0.25, 500, 3500), W(154) - 4, 0.3)
for i0 in (163, 167, 170):
    S(pop(840), W(i0) + 4, 0.28, 0.2)
S(button_press(), W(171), 0.4)
S(whoosh(0.8, 200, 2800, peak=0.7), W(178) - 26, 0.3)
S(thud(0.4, 75.0), W(178) - 4, 0.3)
# o "tim" do NFC: momento-herói
tim = bell(1568.0, d=1.2, decay=0.35) + 0.6 * bell(2093.0, d=1.2, decay=0.25)
place(hero, tim, W(185) + 2, 0.5, 0.0, 0.3)
for k in range(5):
    S(tick(2000 + 200 * k, d=0.05, decay=0.01), W(187) + 2 + k * 4, 0.3, -0.3 + 0.15 * k)
for k in range(5):
    S(flap_land(523.0 * 2 ** (k * 2 / 12), weight=0.3), W(190) + 4 + k * 4 + 8, 0.35, -0.4 + 0.2 * k)
S(swish(0.25, 500, 3200), W(200) - 2, 0.3)
S(thud(0.45, 65.0), W(211) + 6, 0.4)
S(whoosh(0.9, 250, 3000, peak=0.8), W(214) - 8, 0.3)
for k in range(17):
    S(plip(), W(215) + k * 2 + 4, 0.08, -0.6 + 0.07 * k)
S(whoosh(0.6, 400, 4000, peak=0.6), W(225) - 6, 0.3)
S(whoosh(1.0, 180, 1800, peak=0.6, bw=1.0), W(245) - 4, 0.45)

def make_ir(rt=1.4, pre=0.012):
    n = int(SR * rt * 1.1)
    t = np.arange(n) / SR
    env = np.exp(-6.91 * t / rt)
    ir = np.zeros((n + int(pre * SR), 2))
    for ch in range(2):
        ir[int(pre * SR):, ch] = lp(rng.standard_normal(n) * env, 6000)
    return ir / np.sqrt(np.sum(ir ** 2, axis=0, keepdims=True))


IR = make_ir()
wet = np.stack([fftconvolve(rev[:, c], IR[:, c])[:N] for c in range(2)], 1)
mus += 0.5 * np.stack([hp(mus[:, c], 300) for c in range(2)], 1)  # presence for phone speakers

# sidechain: the bed breathes with the kick
side = np.ones(N)
for b in range(nbars * 4):
    fb = b * BEAT
    if sect(fb) in ('full',):
        i = int(ts(fb) * SR)
        L = min(int(0.22 * SR), N - i)
        if L > 0:
            side[i : i + L] = np.minimum(side[i : i + L], 1 - 0.35 * np.exp(-np.arange(L) / SR / 0.08))
mus *= side[:, None]

# ---------------------------------------------------------------- voice + ducking
voice = np.zeros(N)
if VOZ:
    tmp = os.path.join(OUT, '_voz.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', VOZ, '-ac', '1', '-ar', str(SR), tmp], check=True)
    _, v = wavfile.read(tmp)
    os.remove(tmp)
    v = v.astype(np.float64) / (32768.0 if v.dtype == np.int16 else (2147483648.0 if v.dtype == np.int32 else 1.0))
    v = hp(v, 90)
    i0 = int(round(ATRASO * SR))
    if i0 >= 0:
        voice[i0: min(N, i0 + len(v))] = v[: N - i0]
    else:
        v = v[-i0:]
        voice[: min(N, len(v))] = v[:N]
    rms = np.sqrt(uniform_filter1d(voice ** 2, int(0.03 * SR)) + 1e-12)
    act = maximum_filter1d((rms > 10 ** (-40 / 20)).astype(float), int(0.12 * SR))
else:  # sem voz: a atividade vem dos tempos estimados das palavras
    act = np.zeros(N)
    for w in PAL:
        act[int(w['ini'] * SR): int(w['fim'] * SR)] = 1
    act = maximum_filter1d(act, int(0.12 * SR))
act = np.concatenate([act[int(0.1 * SR):], np.zeros(int(0.1 * SR))]) + act  # adianta 100 ms
act = np.clip(act, 0, 1)
DS = SR // 1000
a_ = act[: len(act) // DS * DS].reshape(-1, DS).max(1)
ka, kr = np.exp(-1 / (0.08 * 1000)), np.exp(-1 / (0.3 * 1000))
e, cur = np.empty_like(a_), 0.0
for i, x in enumerate(a_):
    k_ = ka if x > cur else kr
    cur = k_ * cur + (1 - k_) * x
    e[i] = cur
act_s = np.interp(np.arange(N), np.arange(len(e)) * DS, e)
DUCK = 10 ** (-10.0 * act_s / 20)
DUCK_SFX = 10 ** (-9.0 * act_s / 20)  # efeitos >= 12 LU abaixo da voz quando ela fala (DESIGN-SYSTEM §7.3)
G = {'mus': 1.0, 'drm': 0.8, 'sfx': 1.6, 'wet': 0.55}
stems = {
    'music': mus * G['mus'] * DUCK[:, None],
    'drums': drm * G['drm'] * (DUCK * 10 ** (-3.0 * act_s / 20))[:, None],  # bateria 3 dB a mais sob a voz (crítica v2)
    'sfx': sfx * G['sfx'] * DUCK_SFX[:, None],
    'reverb': wet * G['wet'] * DUCK[:, None],
    'hero': hero * G['sfx'] * (10 ** (-3.0 * act_s / 20))[:, None],
}
speaking = act_s > 0.9
bed = (stems['music'] + stems['drums'] + stems['reverb'])[speaking]  # CLAUDE.md: music 18-22 LU under the voice
bed_rms = np.sqrt(np.mean(bed ** 2))
v_rms = np.sqrt(np.mean(voice[speaking & (np.abs(voice) > 1e-4)] ** 2)) if VOZ else 1.0
VOICE_OVER = 20.0  # institucional: música 18 a 22 LU abaixo da voz
vg = bed_rms * 10 ** (VOICE_OVER / 20) / (v_rms + 1e-12) if VOZ else 0.0
# gentle voice compression (2:1 above -24 dBFS short-term) so every syllable reads over the bed
env_v = np.sqrt(uniform_filter1d(voice ** 2, int(0.05 * SR)) + 1e-12)
thr = 10 ** (-24 / 20) * np.max(env_v) / 0.5
gr = np.where(env_v > thr, (thr / env_v) ** 0.5, 1.0)
voice_c = voice * uniform_filter1d(gr, int(0.01 * SR))
stems['voice'] = (np.stack([voice_c, voice_c], 1) * vg * 0.7071 * (v_rms / (np.sqrt(np.mean(voice_c[speaking & (np.abs(voice_c) > 1e-4)] ** 2)) + 1e-12))) if VOZ else np.zeros((N, 2))
print(f'voice gain {20 * np.log10(vg):.1f} dB, speaking {speaking.mean() * 100:.0f}%')
mix = sum(stems.values())
mix = np.stack([hp(mix[:, c], 32) for c in range(2)], 1)
t = np.arange(N) / SR
mix *= np.clip((ts(NFR) - t) / 0.25, 0, 1)[:, None]
mix = mix[: int(ts(NFR) * SR)]


def limiter(x, ceiling=0.80, look=0.004, rel=0.09):
    up = np.stack([resample_poly(x[:, c], 4, 1) for c in range(2)], 1)
    pk = np.max(np.abs(up), axis=1)[: 4 * len(x)].reshape(-1, 4).max(axis=1)
    w = int(look * SR)
    pk = maximum_filter1d(pk, size=2 * w + 1)
    g = np.minimum(1.0, ceiling / np.maximum(pk, 1e-9))
    a = np.exp(-16 / (rel * SR))
    gp = np.pad(g, (0, (16 - len(g) % 16) % 16), constant_values=1).reshape(-1, 16).min(axis=1)
    out = np.empty_like(gp)
    c = 1.0
    for i, vv in enumerate(gp):
        c = vv if vv < c else a * c + (1 - a) * vv
        out[i] = c
    gs = np.repeat(out, 16)[: len(g)]
    gs = np.minimum(uniform_filter1d(gs, size=int(0.002 * SR)), g)
    return x * gs[:, None]


def write(path, x):
    wavfile.write(path, SR, x.astype(np.float32))


def measure(path):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', path, '-af', 'ebur128=peak=true:framelog=quiet', '-f', 'null', '-'], capture_output=True, text=True)
    I = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', r.stderr)[-1])
    LRA = float(re.findall(r'LRA:\s+(-?[\d.]+) LU', r.stderr)[-1])
    tp = float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS', r.stderr)[-1])
    return I, LRA, tp


MIX = os.path.join(OUT, 'audio.wav' if VOZ else 'audio-sem-voz.wav')
gain = 0.5 / (np.max(np.abs(mix)) + 1e-9)
for it in range(7):
    y = limiter(mix * gain)
    write(MIX, y)
    I, LRA, tp = measure(MIX)
    print(f'pass {it}: I {I:.2f} LUFS, LRA {LRA:.1f} LU, TP {tp:.2f} dBTP')
    if abs(I + ALVO) < 0.15 and tp <= -1.0:
        break
    gain *= 10 ** ((-ALVO - I) / 20)
for name, st in (stems.items() if os.environ.get('STEMS') else []):
    write(os.path.join(OUT, f'stem-{name}.wav'), st[: len(mix)] * gain)
print('written', MIX)
