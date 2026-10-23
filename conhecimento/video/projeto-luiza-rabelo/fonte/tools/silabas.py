# conta núcleos silábicos por trecho de fala (picos de energia), para conferir o alinhamento
import subprocess, sys, numpy as np, re
from scipy.signal import butter, sosfiltfilt, find_peaks
mp3 = sys.argv[1]
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', mp3, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True).stdout
x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
sos = butter(4, [300, 2500], 'bandpass', fs=16000, output='sos')
y = sosfiltfilt(sos, x) ** 2
hop = 160  # 10 ms
env = np.sqrt(np.convolve(y, np.ones(400) / 400, 'same')[::hop])
db = 20 * np.log10(env + 1e-9)
def silabas(a, b):
    s = db[int(a * 100):int(b * 100)]
    if len(s) < 5: return 0
    pk, _ = find_peaks(s, prominence=4, distance=9, height=s.max() - 25)
    return len(pk)
np.save('voz/db.npy', db)
if __name__ == '__main__':
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', mp3, '-af', 'silencedetect=noise=-38dB:d=0.08', '-f', 'null', '-'], capture_output=True, text=True).stderr
    ini = [float(v) for v in re.findall(r'silence_start: ([\d.]+)', r)]; fim = [float(v) for v in re.findall(r'silence_end: ([\d.]+)', r)]
    seg, prev = [], 0
    for a, b in zip(ini, fim):
        if a - prev > 0.05: seg.append((prev, a))
        prev = b
    for a, b in seg[:14]: print(f'{a:6.2f}-{b:6.2f} {silabas(a, b)}')
