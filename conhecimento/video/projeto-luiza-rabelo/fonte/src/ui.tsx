// Identidade da Luiza Rabelo (a mesma do site): creme, nude, rosé; Cinzel no nome, Cormorant nos títulos, Jost no apoio.
import React, {useState} from 'react';
import {continueRender, delayRender, Img as RImg, staticFile} from 'remotion';
import {arrive, clamp} from './kit';

export const C = {
  creme: '#F7F2EC', creme2: '#F1E9E0', nude: '#EED9D0', rose: '#B98B6E', roseEsc: '#85594A',
  escuro: '#1E1A17', texto: '#3A332E', suave: '#6F655D', linha: '#E4D9CE', branco: '#FFFDFB',
};
export const FONTES = {
  logo: 'Cinzel, serif',
  titulo: '"Cormorant Garamond", Georgia, serif',
  texto: 'Jost, Arial, sans-serif',
};

const carregadas: Promise<unknown>[] = [];
const carrega = (familia: string, arq: string, desc: FontFaceDescriptors = {}) => {
  const f = new FontFace(familia, `url(${staticFile('fonts/' + arq)})`, desc);
  carregadas.push(f.load().then((ff) => document.fonts.add(ff)));
};
let iniciado = false;
export const Fontes: React.FC = () => {
  const [h] = useState(() => delayRender('fontes'));
  if (!iniciado) {
    iniciado = true;
    carrega('Cinzel', 'cinzel.woff2', {weight: '400 500'});
    carrega('Cormorant Garamond', 'cormorant.woff2', {weight: '300 500'});
    carrega('Cormorant Garamond', 'cormorant-italic.woff2', {style: 'italic', weight: '300 400'});
    carrega('Jost', 'jost.woff2', {weight: '300 500'});
  }
  Promise.all(carregadas).then(() => continueRender(h));
  return null;
};

/** Rótulo em versalete com tracking largo (como no site). */
export const Rotulo: React.FC<{f: number; ini: number; children: React.ReactNode; cor?: string; style?: React.CSSProperties}> = ({f, ini, children, cor = C.roseEsc, style}) => {
  const a = arrive(f, ini, 0.16);
  return (
    <div style={{fontFamily: FONTES.texto, fontWeight: 400, fontSize: 30, letterSpacing: '0.34em', textTransform: 'uppercase', color: cor,
      opacity: clamp(a * 1.5), transform: `translateY(${(1 - a) * 24}px)`, ...style}}>{children}</div>
  );
};

/**
 * Título em Cormorant 300. Palavras entram uma a uma (stagger 3 quadros).
 * Use *palavra* para o itálico de ligação, como na marca.
 */
export const Titulo: React.FC<{f: number; ini: number; texto: string; tam?: number; cor?: string; alinhar?: 'center' | 'left'; stagger?: number; sai?: number; style?: React.CSSProperties}> = ({
  f, ini, texto, tam = 112, cor = C.escuro, alinhar = 'center', stagger = 3, sai, style,
}) => {
  const linhas = texto.split('\n');
  let k = 0;
  const saida = sai !== undefined ? arrive(f, sai, 0.2) : 0;
  return (
    <div style={{fontFamily: FONTES.titulo, fontWeight: 300, fontSize: tam, lineHeight: 1.02, letterSpacing: '-0.012em', color: cor, textAlign: alinhar,
      opacity: 1 - saida, transform: `translateY(${-saida * 30}px)`, ...style}}>
      {linhas.map((ln, li) => (
        <div key={li}>
          {ln.split(' ').map((w, wi) => {
            const it = w.startsWith('*');
            const limpo = w.replace(/\*/g, '');
            const a = arrive(f, ini + k++ * stagger, 0.15);
            return (
              <span key={wi} style={{display: 'inline-block', marginRight: '0.24em', fontStyle: it ? 'italic' : 'normal', color: it ? C.roseEsc : undefined,
                opacity: clamp(a * 1.6), transform: `translateY(${(1 - a) * 0.5 * tam}px)`}}>{limpo}</span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const Foto: React.FC<{src: string; style?: React.CSSProperties; pos?: string}> = ({src, style, pos = 'center'}) => (
  <RImg src={staticFile(src)} style={{objectFit: 'cover', objectPosition: pos, display: 'block', ...style}} />
);

/** Recorte de uma imagem (x, y, w, h em pixels da imagem original) mostrado com largura `largura`. */
export const Recorte: React.FC<{src: string; iw: number; x: number; y: number; w: number; h: number; largura: number; style?: React.CSSProperties}> = ({src, iw, x, y, w, h, largura, style}) => {
  const k = largura / w;
  return (
    <div style={{width: largura, height: h * k, overflow: 'hidden', position: 'relative', ...style}}>
      <RImg src={staticFile(src)} style={{position: 'absolute', left: -x * k, top: -y * k, width: iw * k}} />
    </div>
  );
};
