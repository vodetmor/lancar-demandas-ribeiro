// Fechamento: a fachada com o nome em metal, as portas se abrem ("abrir as portas") e lá dentro está a loja online.
import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {arrive, clamp, E, lerp, prog} from '../kit';
import {W} from '../tempos';
import {C, FONTES, Rotulo, Titulo} from '../ui';
import {Camera, Celular, mix3, Palco, THREE, useTex, V3} from '../tres';
import {NomeMetal} from './Nome';

const PORTA = {w: 0.62, h: 1.62, e: 0.05};
const Porta: React.FC<{lado: 1 | -1; abre: number}> = ({lado, abre}) => {
  const madeira = useMemo(() => new THREE.MeshStandardMaterial({color: '#D8BC9C', roughness: 0.62}), []);
  const ripas = useMemo(() => Array.from({length: 9}, (_, i) => (i - 4) * (PORTA.w / 9.6)), []);
  // dobradiça na borda de fora
  return (
    <group position={[lado * PORTA.w, 0, 0]} rotation={[0, lado * abre * 1.75, 0]}>
      <group position={[-lado * PORTA.w / 2, PORTA.h / 2, 0]}>
        <mesh material={madeira} castShadow receiveShadow>
          <boxGeometry args={[PORTA.w - 0.008, PORTA.h, PORTA.e]} />
        </mesh>
        {ripas.map((x) => (
          <mesh key={x} position={[x, 0, PORTA.e / 2 + 0.008]} castShadow>
            <boxGeometry args={[0.03, PORTA.h - 0.08, 0.016]} />
            <meshStandardMaterial color="#CBAA86" roughness={0.6} />
          </mesh>
        ))}
        {/* puxador em metal rosé */}
        <mesh position={[-lado * (PORTA.w / 2 - 0.07), 0, PORTA.e / 2 + 0.04]}>
          <cylinderGeometry args={[0.012, 0.012, 0.5, 16]} />
          <meshPhysicalMaterial color="#C99A7E" metalness={1} roughness={0.25} />
        </mesh>
      </group>
    </group>
  );
};

export const Final: React.FC<{f: number}> = ({f}) => {
  const tela = useTex('shots/home-full.jpg', true);
  const ini = W(235) - 4;
  const abre = E.expr(prog(f, W(245) - 4, 26));
  const entra = E.cam(prog(f, W(245) + 4, 70));
  const camPos = mix3([Math.sin(f * 0.01) * 0.15, 1.15, 6.4 - (f - ini) * 0.004], [0, 1.2, 1.5], entra);
  const look = mix3([0, 1.15, 0], [0, 0.72, -1.6], entra);
  const luzDentro = lerp(0.2, 2.6, abre);
  const fimCard = arrive(f, W(247) + 30, 0.12);
  return (
    <AbsoluteFill style={{background: C.creme}}>
      <Palco fundo="#EFE5DA">
        <Camera pos={camPos} look={look} />
        {/* parede da fachada com o vão das portas */}
        {[[-1.85, 1.4, 2.5, 4], [1.85, 1.4, 2.5, 4]].map(([x, y, w, h], i) => (
          <mesh key={i} position={[x, y, -0.03]} receiveShadow>
            <boxGeometry args={[w, h, 0.06]} />
            <meshStandardMaterial color="#F6EEE6" roughness={0.9} />
          </mesh>
        ))}
        <mesh position={[0, 2.5, -0.03]} receiveShadow>
          <boxGeometry args={[1.2, 1.8, 0.06]} />
          <meshStandardMaterial color="#F6EEE6" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.6, 1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[12, 6]} />
          <meshStandardMaterial color="#E9DDCF" roughness={0.9} />
        </mesh>
        <NomeMetal f={f} ini={ini} y={2.22} tam={0.22} varredura={W(237)} />
        <Porta lado={-1} abre={abre} />
        <Porta lado={1} abre={abre} />
        {/* dentro da loja */}
        <pointLight position={[0, 1.3, -0.9]} intensity={luzDentro} distance={4} color="#fff1e4" />
        <mesh position={[0, 0.8, -2.4]}>
          <planeGeometry args={[3, 3]} />
          <meshStandardMaterial color="#FBF6F0" roughness={1} />
        </mesh>
        <Celular tela={tela} razao={4500 / 780} rolagem={0.25 * E.prod(prog(f, W(247), 90))} pos={[0, 1.0, -1.6]} rot={[0, Math.sin(f * 0.03) * 0.12, 0]} escala={0.6} />
      </Palco>
      <div style={{position: 'absolute', top: 1400, width: '100%', textAlign: 'center'}}>
        {f < W(243) && <Titulo f={f} ini={W(237)} tam={100} texto={'A loja online\n*já está pronta.*'} sai={W(243) - 6} />}
      </div>
      <div style={{position: 'absolute', top: 1400, width: '100%', textAlign: 'center', opacity: 1 - fimCard}}>
        {f >= W(243) - 4 && <Titulo f={f} ini={W(243)} tam={100} texto={'Falta só abrir\n*as portas.*'} />}
      </div>
      {fimCard > 0.01 && (
        <div style={{position: 'absolute', bottom: 330, width: '100%', textAlign: 'center', opacity: clamp(fimCard * 1.5)}}>
          <div style={{fontFamily: FONTES.logo, fontSize: 64, letterSpacing: '0.14em', color: C.escuro}}>LUIZA RABELO</div>
          <div style={{fontFamily: FONTES.texto, fontSize: 34, color: C.texto, marginTop: 24}}>luiza-rabelo-df.vercel.app</div>
          <Rotulo f={f} ini={W(247) + 36} style={{marginTop: 26}}>Sobradinho-DF · Envio para o Brasil</Rotulo>
        </div>
      )}
    </AbsoluteFill>
  );
};
