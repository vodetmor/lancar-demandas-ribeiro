// Capa (quadro 0 = a loja online no celular), o desenho da loja antiga (36 anos) e a foto real da Engrenagem.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {arrive, clamp, E, lerp, prog, spring} from '../kit';
import {W} from '../tempos';
import {C, Recorte, Rotulo, Titulo} from '../ui';
import {cam2d} from '../cam2d';
import {Palco, Celular, ChaoSombra, useTex} from '../tres';

export const Capa: React.FC<{f: number}> = ({f}) => {
  const tela = useTex('shots/home-full.jpg', true);
  const giro = Math.sin(f * 0.045) * 0.16;
  return (
    <AbsoluteFill style={{background: C.creme}}>
      <Palco>
        <Celular tela={tela} razao={4500 / 780} rolagem={0.004 * Math.max(0, f - 10) / 30} pos={[0, -0.62, 0]} rot={[-0.06, -0.32 + giro, 0.04]} escala={1.12} />
        <ChaoSombra y={-1.22} />
        <CamCapa f={f} />
      </Palco>
      <div style={{position: 'absolute', top: 170, width: '100%', textAlign: 'center'}}>
        <Rotulo f={f} ini={-30}>Luiza Rabelo · Sobradinho-DF</Rotulo>
        <Titulo f={f} ini={-40} tam={128} texto={'36 anos.\n*Agora,* online.'} style={{marginTop: 34}} />
      </div>
    </AbsoluteFill>
  );
};
import {Camera} from '../tres';
const CamCapa: React.FC<{f: number}> = ({f}) => <Camera pos={[0.0, 0.1, 5.4 - f * 0.006]} look={[0, -0.32, 0]} />;

// desenho: 36-anos-ilustracao-fachada-antiga.webp (1600 x 2002)
const DESENHO = 'img/36-anos-ilustracao-fachada-antiga.webp';
// colagem: 36-anos-colagem-historia-loja.webp (941 x 1672)
const COLAGEM = 'img/36-anos-colagem-historia-loja.webp';

const Polaroid: React.FC<{f: number; ini: number; x: number; y: number; w: number; h: number; largura: number; ox: number; oy: number; rot: number; sai?: number; deX?: number}> = ({f, ini, x, y, w, h, largura, ox, oy, rot, sai, deX = 0}) => {
  const a = spring(f, ini, 0.32, 0.72);
  const s = sai !== undefined ? E.exit(prog(f, sai, 16)) : 0;
  if (f < ini - 1) return null;
  return (
    <div style={{position: 'absolute', left: ox, top: oy, padding: 16, paddingBottom: 54, background: '#FFFDFB', boxShadow: '0 30px 60px rgba(60,40,30,.22), 0 4px 12px rgba(60,40,30,.12)',
      transform: `perspective(1600px) translate(${(1 - a) * deX + s * 0}px, ${(1 - clamp(a)) * 420 + s * 1400}px) rotateX(${(1 - a) * 35}deg) rotate(${rot + (1 - a) * 8 + s * 14}deg) scale(${0.94 + 0.06 * clamp(a)})`,
      opacity: clamp(a * 3)}}>
      <Recorte src={COLAGEM} iw={941} x={x} y={y} w={w} h={h} largura={largura} />
    </div>
  );
};

export const Desenho: React.FC<{f: number}> = ({f}) => {
  const t0 = W(0) - 4;
  const cam = cam2d(f, [
    {f: t0, cx: 880, cy: 1000, vw: 1110},
    {f: W(5) - 4, cx: 800, cy: 1370, vw: 730, dur: 30},
    {f: W(12) - 6, cx: 580, cy: 1190, vw: 900, dur: 30},
    {f: W(19) - 6, cx: 560, cy: 1030, vw: 600, dur: 40},
    {f: W(26) - 8, cx: 690, cy: 690, vw: 760, dur: 22},
  ]);
  const sai = E.exit(prog(f, W(29) - 6, 14));
  return (
    <AbsoluteFill style={{background: '#F5F2EE', overflow: 'hidden'}}>
      <div style={{position: 'absolute', ...cam, opacity: 1 - sai}}>
        <Img src={staticFile(DESENHO)} style={{width: 1600, height: 2002, display: 'block'}} />
      </div>
      {/* "uma cliente de cada vez": fotos reais das clientes de 36 anos */}
      <Polaroid f={f} ini={W(21)} x={0} y={572} w={262} h={258} largura={470} ox={70} oy={330} rot={-6} sai={W(26) - 6} deX={-200} />
      <Polaroid f={f} ini={W(23)} x={706} y={566} w={234} h={244} largura={430} ox={560} oy={1010} rot={5} sai={W(26) - 4} deX={200} />
      {/* "Era a Engrenagem": a foto real da fachada antiga */}
      <Polaroid f={f} ini={W(26) - 2} x={622} y={34} w={312} h={274} largura={820} ox={110} oy={560} rot={-3} sai={W(29) - 4} />
      {f >= W(26) - 2 && f < W(29) + 10 && (
        <div style={{position: 'absolute', top: 1420, width: '100%', textAlign: 'center', opacity: 1 - sai}}>
          <Rotulo f={f} ini={W(27)}>Engrenagem · Oficina da Moda</Rotulo>
        </div>
      )}
      <AbsoluteFill style={{background: C.creme, opacity: sai}} />
    </AbsoluteFill>
  );
};

/** Volta ao desenho (fecha o círculo) e vira o desenho da loja nova, num cartão como uma gravura. */
export const Volta: React.FC<{f: number}> = ({f}) => {
  const t0 = W(218) - 4;
  // cartão 900 x 1130: câmera 2D em coordenadas do cartão (centro 450, 565)
  const k = (c: ReturnType<typeof cam2d>) => ({...c, transform: c.transform.replace(/translate\(([-\d.]+)px, ([-\d.]+)px\)/, (_m, x, y) => `translate(${+x - 90}px, ${+y - 395}px)`)});
  const cam = k(cam2d(f, [{f: t0, cx: 540, cy: 1080, vw: 980}, {f: W(222), cx: 560, cy: 1120, vw: 820, dur: 60}]));
  const troca = E.expr(prog(f, W(225) - 6, 22));
  const camNova = k(cam2d(f, [{f: W(225) - 6, cx: 475, cy: 1235, vw: 700}, {f: W(229), cx: 475, cy: 1230, vw: 640, dur: 70}]));
  const ent = arrive(f, t0, 0.18);
  return (
    <AbsoluteFill style={{background: C.creme}}>
      <div style={{position: 'absolute', left: 90, top: 560, width: 900, height: 1130, overflow: 'hidden', borderRadius: 8, background: '#F5F2EE',
        boxShadow: '0 30px 70px rgba(70,45,30,.16)', transform: `translateY(${(1 - ent) * 60}px)`, opacity: clamp(ent * 2)}}>
        <div style={{position: 'absolute', ...cam}}>
          <Img src={staticFile(DESENHO)} style={{width: 1600, height: 2002, display: 'block'}} />
        </div>
        <AbsoluteFill style={{clipPath: `inset(${(1 - troca) * 100}% 0 0 0)`}}>
          <div style={{position: 'absolute', ...camNova}}>
            <Img src={staticFile(COLAGEM)} style={{width: 941, height: 1672, display: 'block'}} />
          </div>
        </AbsoluteFill>
      </div>
      <div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center'}}>
        <Titulo f={f} ini={W(218)} tam={104} texto={'36 anos construindo\numa *história.*'} sai={W(225) - 8} />
      </div>
      <div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center'}}>
        {f >= W(225) - 4 && <Titulo f={f} ini={W(227)} tam={104} texto={'Hora de contar\npara o *Brasil.*'} />}
      </div>
    </AbsoluteFill>
  );
};
void arrive; void lerp;
