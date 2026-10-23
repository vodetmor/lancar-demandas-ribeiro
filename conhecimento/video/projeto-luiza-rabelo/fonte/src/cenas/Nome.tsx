// "Hoje, é Luiza Rabelo": o nome em metal rosé (Cinzel extrudada) montando letra a letra.
import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp, lerp, spring} from '../kit';
import {W} from '../tempos';
import {C, Rotulo} from '../ui';
import {Camera, ChaoSombra, materialRose, Palco, THREE, useLetras} from '../tres';

const Linha: React.FC<{f: number; ini: number; texto: string; tam: number; y: number; mat: THREE.Material; desloc: number}> = ({f, ini, texto, tam, y, mat, desloc}) => {
  const letras = useLetras(texto, tam, tam * 0.24);
  return (
    <group position={[0, y, 0]}>
      {letras.map((l, i) => {
        const a = spring(f, ini + (i + desloc) * 2, 0.26, 0.7);
        return (
          <mesh key={i} geometry={l.geo} material={mat} castShadow
            position={[l.x * lerp(1.5, 1, clamp(a)), lerp(0.6 - i * 0.05, 0, a), lerp(-3.5, 0, a)]}
            rotation={[lerp(-1.2, 0, a), lerp(i % 2 ? 0.9 : -0.9, 0, a), 0]}
            scale={clamp(a * 1.4, 0.0001, 1)} />
        );
      })}
    </group>
  );
};

/** LUIZA / RABELO em duas linhas (como na colagem da marca). Largura ~1,5 com tam 0,3. */
export const NomeMetal: React.FC<{f: number; ini: number; y?: number; tam?: number; varredura?: number}> = ({f, ini, y = 0, tam = 0.3, varredura}) => {
  const mat = useMemo(() => materialRose(), []);
  const luzX = lerp(-3, 3, clamp((f - (varredura ?? ini + 18)) / 50));
  return (
    <group position={[0, y, 0]}>
      <pointLight position={[luzX, 0.4, 1.4]} intensity={3.5} distance={5} color="#fff3ea" />
      <Linha f={f} ini={ini} texto="LUIZA" tam={tam} y={tam * 0.62} mat={mat} desloc={0} />
      <Linha f={f} ini={ini} texto="RABELO" tam={tam} y={-tam * 0.62} mat={mat} desloc={3} />
    </group>
  );
};

export const Nome: React.FC<{f: number}> = ({f}) => {
  const ini = W(31) - 4;
  return (
    <AbsoluteFill style={{background: C.creme}}>
      <Palco>
        <Camera pos={[Math.sin(f * 0.012) * 0.3, 0.15, 5.4 - (f - ini) * 0.004]} look={[0, 0.05, 0]} />
        <NomeMetal f={f} ini={ini} tam={0.235} />
        <ChaoSombra y={-0.42} opacidade={0.05} />
      </Palco>
      <div style={{position: 'absolute', top: 1250, width: '100%', textAlign: 'center'}}>
        <Rotulo f={f} ini={ini + 26}>Multimarcas · Semijoias</Rotulo>
      </div>
    </AbsoluteFill>
  );
};
