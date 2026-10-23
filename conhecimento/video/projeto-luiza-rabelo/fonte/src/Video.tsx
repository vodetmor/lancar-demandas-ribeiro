// Vídeo institucional Luiza Rabelo (proposta): 1080x1920, 30 fps. Cada cena começa numa palavra da voz.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, useCurrentFrame} from 'remotion';
import {precarregaTexturas} from './tres';
import {W} from './tempos';
import {C, Fontes} from './ui';
import {Capa, Desenho} from './cenas/Abertura';
import {Nome} from './cenas/Nome';
import {CaraNova, NovaFase} from './cenas/Fase';
import {Anuncio, FichaNova, Problema} from './cenas/Google';
import {LojaOnline, Zap} from './cenas/Loja3D';
import {Envio, Perto} from './cenas/Brasil';
import {Estrelas, Placa} from './cenas/Placa';
import {Final} from './cenas/Final';
import {Volta} from './cenas/Abertura';
import {DUR} from './tempos';

type Cena = {id: string; de: number; ate: number; C: React.FC<{f: number}>};
export const cenas = (): Cena[] => [
  {id: 'capa', de: 0, ate: W(0) - 4, C: Capa},
  {id: 'desenho', de: W(0) - 4, ate: W(31) - 4, C: Desenho},
  {id: 'nome', de: W(31) - 4, ate: W(33) - 3, C: Nome},
  {id: 'fase', de: W(33) - 3, ate: W(42) - 3, C: NovaFase},
  {id: 'caranova', de: W(42) - 3, ate: W(52) - 4, C: CaraNova},
  {id: 'problema', de: W(52) - 4, ate: W(83) - 4, C: Problema},
  {id: 'loja', de: W(83) - 4, ate: W(117) - 3, C: LojaOnline},
  {id: 'zap', de: W(117) - 3, ate: W(126) - 4, C: Zap},
  {id: 'envio', de: W(126) - 4, ate: W(154) - 4, C: Envio},
  {id: 'ficha', de: W(154) - 4, ate: W(174) - 4, C: FichaNova},
  {id: 'placa', de: W(174) - 4, ate: W(190) - 4, C: Placa},
  {id: 'estrelas', de: W(190) - 4, ate: W(195) - 4, C: Estrelas},
  {id: 'anuncio', de: W(195) - 4, ate: W(211) - 4, C: Anuncio},
  {id: 'perto', de: W(211) - 4, ate: W(218) - 4, C: Perto},
  {id: 'volta', de: W(218) - 4, ate: W(235) - 4, C: Volta},
  {id: 'final', de: W(235) - 4, ate: DUR, C: Final},
];

export const Video: React.FC = () => {
  const f = useCurrentFrame();
  const [h] = useState(() => delayRender('texturas'));
  const [pronto, setPronto] = useState(false);
  useEffect(() => {
    precarregaTexturas().then(() => {
      setPronto(true);
      continueRender(h);
    });
  }, [h]);
  if (!pronto) return <AbsoluteFill style={{background: C.creme}}><Fontes /></AbsoluteFill>;
  return (
    <AbsoluteFill style={{background: C.creme}}>
      <Fontes />
      {cenas().filter((c) => f >= c.de && f < c.ate).map((c) => <c.C key={c.id} f={f} />)}
    </AbsoluteFill>
  );
};
