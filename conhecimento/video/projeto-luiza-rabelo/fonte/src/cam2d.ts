// Câmera 2D sobre uma imagem grande: cada chave diz o ponto da imagem no centro do quadro e quantos pixels da imagem cabem na largura.
import {E, prog} from './kit';

export type Chave = {f: number; cx: number; cy: number; vw: number; dur?: number};
export const cam2d = (f: number, chaves: Chave[], pushPorQuadro = 0.0022) => {
  let cx = chaves[0].cx, cy = chaves[0].cy, vw = chaves[0].vw;
  for (let i = 1; i < chaves.length; i++) {
    const k = chaves[i];
    const t = E.cam(prog(f, k.f, k.dur ?? 24));
    cx += (k.cx - cx) * t; cy += (k.cy - cy) * t; vw += (k.vw - vw) * t;
  }
  // nunca parado: empurrão lento contínuo
  vw *= 1 - pushPorQuadro * Math.max(0, f - chaves[0].f) * 0.5;
  const s = 1080 / vw;
  return {transform: `translate(${540 - cx * s}px, ${960 - cy * s}px) scale(${s})`, transformOrigin: '0 0'};
};
