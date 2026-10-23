// Tempos da voz: src/tempos.json (estimado agora; alinhar.py regrava com o mp3 da Ana Dias).
// As cenas usam o ÍNDICE da palavra, nunca o segundo: trocar a voz não quebra nada.
import t from './tempos.json';

export const FPS = 30;
export const PAL = t.palavras as {w: string; p: number; ini: number; fim: number}[];
export const DUR = Math.ceil(t.dur * FPS);
export const VOZ_ATRASO = 0; // segundos de silêncio antes da voz no mp3 final
/** quadro em que a palavra i começa */
export const W = (i: number) => Math.round((PAL[Math.min(i, PAL.length - 1)].ini + VOZ_ATRASO) * FPS);
/** quadro em que a palavra i termina */
export const WF = (i: number) => Math.round((PAL[Math.min(i, PAL.length - 1)].fim + VOZ_ATRASO) * FPS);
