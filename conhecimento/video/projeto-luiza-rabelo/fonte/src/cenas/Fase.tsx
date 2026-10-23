// "Um novo espaço. Um novo capítulo. A mesma essência." e "A loja ganhou cara nova. Agora, a internet precisa acompanhar."
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {arrive, clamp, E, lerp, prog, spring} from '../kit';
import {W} from '../tempos';
import {C, Foto, FONTES, Recorte, Rotulo, Titulo} from '../ui';

const CARTOES = [
  {src: 'img/loja-fachada-nova-clientes.webp', pos: 'center 30%', ini: () => W(33) - 3, texto: 'Um novo *espaço.*'},
  {src: 'img/loja-interior-salao-sofa-curvo.webp', pos: 'center 40%', ini: () => W(36) - 3, texto: 'Um novo *capítulo.*'},
  {src: 'img/luiza-retrato-escada-loja.webp', pos: 'center 45%', ini: () => W(39) - 3, texto: 'A mesma *essência.*'},
];

export const NovaFase: React.FC<{f: number}> = ({f}) => {
  return (
    <AbsoluteFill style={{background: C.creme, perspective: 2200}}>
      <div style={{position: 'absolute', top: 120, width: '100%', textAlign: 'center'}}>
        <Rotulo f={f} ini={W(33)}>Uma nova fase</Rotulo>
      </div>
      {CARTOES.map((c, i) => {
        const ini = c.ini();
        const prox = i < CARTOES.length - 1 ? CARTOES[i + 1].ini() : 1e9;
        if (f < ini - 2) return null;
        const a = spring(f, ini, 0.28, 0.78);
        const vai = E.expr(prog(f, prox, 18)); // vai para trás quando o próximo chega
        const x = lerp(900, 0, clamp(a)) - vai * 260;
        const rotY = lerp(-38, 0, a) + vai * 24;
        const z = -vai * 520;
        const op = clamp(a * 3) * (1 - vai * 0.55);
        return (
          <div key={i} style={{position: 'absolute', left: 150, top: 420, width: 780, height: 1060, borderRadius: 30, overflow: 'hidden',
            boxShadow: '0 40px 80px rgba(70,45,30,.20), 0 6px 16px rgba(70,45,30,.10)', opacity: op, zIndex: i,
            transform: `translate3d(${x}px, 0, ${z}px) rotateY(${rotY}deg) scale(${1.0 + (f - ini) * 0.0006})`}}>
            <Foto src={c.src} pos={c.pos} style={{width: '100%', height: '100%', transform: `scale(${1.06 - clamp((f - ini) / 120) * 0.06})`}} />
          </div>
        );
      })}
      {CARTOES.map((c, i) => {
        const ini = c.ini();
        const prox = i < CARTOES.length - 1 ? CARTOES[i + 1].ini() : undefined;
        if (f < ini - 2 || (prox && f > prox + 14)) return null;
        return (
          <div key={'t' + i} style={{position: 'absolute', top: 1560, width: '100%', textAlign: 'center'}}>
            <Titulo f={f} ini={ini + 2} tam={108} texto={c.texto} sai={prox ? prox - 4 : undefined} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** A recepção nova vira a tela de um celular, que fica em branco à espera do Google. */
export const CaraNova: React.FC<{f: number}> = ({f}) => {
  const ini = W(42) - 3;
  const vira = E.expr(prog(f, W(47) - 4, 26)); // foto -> celular
  const zoom = E.exit(prog(f, W(52) - 10, 12)); // mergulho na tela (passa para a cena do Google)
  const w = lerp(1080, 560, vira), h = lerp(1240, 1200, vira);
  const top = lerp(0, 440, vira);
  const r = lerp(0, 64, vira);
  const branco = E.expr(prog(f, W(49) - 2, 14));
  return (
    <AbsoluteFill style={{background: C.creme}}>
      <div style={{position: 'absolute', left: 540 - w / 2, top, width: w, height: h, borderRadius: r, overflow: 'hidden',
        border: `${vira * 16}px solid #2a2522`, boxShadow: vira > 0 ? `0 ${40 * vira}px ${90 * vira}px rgba(60,40,30,.25)` : 'none',
        transform: `scale(${1 + zoom * 2.6}) translateY(${zoom * 40}px)`, transformOrigin: '50% 30%'}}>
        <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: '50%', top: 0, transform: `translateX(-50%) scale(${lerp(1.08, 1.0, clamp((f - ini) / 90))})`, transformOrigin: '50% 20%'}}>
            <Foto src="img/loja-sacolas-embalagens-marca.webp" pos="center 40%" style={{width: lerp(1080, 560, vira), height: h}} />
          </div>
        </div>
        <AbsoluteFill style={{background: '#fff', opacity: branco, alignItems: 'center', paddingTop: 300}}>
          <Img src={staticFile('logos/wikimedia-google-2015.svg')} style={{width: 260}} />
          <div style={{marginTop: 50, width: 440, height: 74, borderRadius: 40, border: '2px solid #dfe1e5', boxShadow: '0 2px 6px rgba(32,33,36,.12)', display: 'flex', alignItems: 'center', paddingLeft: 30}}>
            <div style={{width: 3, height: 34, background: '#1a73e8', opacity: Math.floor(f / 15) % 2 ? 1 : 0}} />
          </div>
        </AbsoluteFill>
      </div>
      <div style={{position: 'absolute', top: lerp(1340, 1620, vira), width: '100%', textAlign: 'center'}}>
        <Titulo f={f} ini={ini + 2} tam={104} texto={'A loja ganhou\n*cara nova.*'} sai={W(47) - 6} />
      </div>
      {f >= W(47) - 4 && (
        <div style={{position: 'absolute', top: 120, width: '100%', textAlign: 'center', opacity: 1 - zoom}}>
          <Titulo f={f} ini={W(47)} tam={100} texto={'Agora, a *internet*\nprecisa acompanhar.'} />
        </div>
      )}
    </AbsoluteFill>
  );
};
void arrive; void FONTES;
