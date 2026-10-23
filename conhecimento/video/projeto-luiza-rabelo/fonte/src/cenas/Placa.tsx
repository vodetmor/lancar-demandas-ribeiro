// "E no balcão, uma placa de avaliação. A cliente aproxima o celular... e avalia na hora." + "Cada venda vira uma estrela."
// Base: Plaquinha3D da MedicMais (repo do Vítor). A placa é o modelo padrão azul do Google.
import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp, E, lerp, prog, spring} from '../kit';
import {W} from '../tempos';
import {C, Rotulo, Titulo} from '../ui';
import {Camera, CEL, Celular, geoEstrela, mix3, Palco, RoundedBoxGeometry, THREE, useTex, V3} from '../tres';

const PW = 1.0, PH = 1.25, PD = 0.05;
const PLACA_Z = -0.12, PLACA_Y = 0.1 + PH / 2, YAW = -0.22, TILT = -0.09;
const NFC_LOCAL_Y = PH / 2 - 0.73 * PH; // ícone de aproximação na face (73% da altura)
const NFC_LOCAL_X = -0.27 * PW;

export const Placa: React.FC<{f: number}> = ({f}) => {
  const face = useTex('tex/placa.png');
  const travada = useTex('tex/tela-travada.png', true);
  const aval = [0, 1, 2, 3, 4, 5].map((n) => useTex(`tex/tela-avaliacao-${n}.png`, true)); // eslint-disable-line react-hooks/rules-of-hooks
  const geoPlaca = useMemo(() => new RoundedBoxGeometry(PW, PH, PD, 6, 0.07), []);
  const geoBase = useMemo(() => new RoundedBoxGeometry(PW * 1.08, 0.1, 0.34, 4, 0.03), []);
  const m = {balcao: W(175), plaquinha: W(178), aproxima: W(182), toca: W(185) + 2, tela: W(186) + 4, estrelas: W(187) + 2, ini: W(174) - 4};

  const pe = spring(f, m.plaquinha - 26, 0.14, 0.8);
  const placaY = lerp(-1.9, PLACA_Y, clamp(pe, 0, 1.2));
  const placaYaw = lerp(-Math.PI * 2 - 0.9, YAW, pe);
  const baseOn = E.expr(prog(f, m.plaquinha - 6, 14));

  const fora: V3 = [2.3, 0.2, -0.1];
  const encosta: V3 = [0.05 + NFC_LOCAL_X * 0.9, 0.36, PLACA_Z + 0.3];
  const frente: V3 = [0.02, 0.98, 1.25];
  const a1 = E.expr(prog(f, m.aproxima - 10, m.toca - (m.aproxima - 10)));
  const a2 = E.cam(prog(f, m.tela - 4, 36));
  let fone = mix3(fora, encosta, a1);
  fone = mix3(fone, frente, a2);
  const bump = f >= m.toca ? Math.sin(clamp((f - m.toca) / 8) * Math.PI) * 0.03 : 0;
  fone = [fone[0], fone[1], fone[2] + bump];
  const boia = a2 * Math.sin((f - m.tela) * 0.05);
  const foneRot: V3 = [lerp(lerp(-0.35, -0.1, a1), 0.04 * boia, a2), lerp(lerp(-1.0, YAW + 0.05, a1), 0.12 * Math.sin((f - m.tela) * 0.035), a2), lerp(lerp(0.5, -0.2, a1), 0, a2)];
  const nEstrelas = clamp(Math.floor((f - m.estrelas) / 4) + 1, 0, 5);
  const tela = f < m.toca + 4 ? travada : aval[f < m.estrelas ? 0 : nEstrelas];

  const c0: V3 = [-0.3, 1.0, 4.6], l0: V3 = [0, 0.66, PLACA_Z];
  const c1: V3 = [1.9, 2.05, 5.0], l1: V3 = [0.1, 0.5, 0];
  const c2: V3 = [1.35, 1.35, 4.7], l2: V3 = [0.0, 0.6, 0.1];
  const c3: V3 = [frente[0], frente[1] + 0.12, frente[2] + 4.0], l3: V3 = [frente[0], frente[1] + 0.14, frente[2]];
  const drift = prog(f, m.ini, 200);
  let cam = mix3(c0, c1, E.cam(prog(f, m.balcao - 6, 40)));
  let look = mix3(l0, l1, E.cam(prog(f, m.balcao - 6, 40)));
  cam = mix3(cam, c2, E.cam(prog(f, m.aproxima - 10, 40)));
  look = mix3(look, l2, E.cam(prog(f, m.aproxima - 10, 40)));
  cam = mix3(cam, c3, E.cam(prog(f, m.tela - 4, 40)));
  look = mix3(look, l3, E.cam(prog(f, m.tela - 4, 40)));
  cam = [cam[0] + 0.45 * Math.sin(drift * Math.PI * 1.5), cam[1] + 0.1 * Math.sin(drift * Math.PI), cam[2] - 0.35 * drift];

  const nfcWorld = new THREE.Vector3(NFC_LOCAL_X, NFC_LOCAL_Y, PD / 2 + 0.01).applyEuler(new THREE.Euler(TILT, YAW, 0)).add(new THREE.Vector3(0, PLACA_Y, PLACA_Z));
  return (
    <AbsoluteFill style={{background: C.creme}}>
      <Palco fov={30}>
        <Camera pos={cam} look={look} />
        <mesh position={[0, -0.45, -1.2 + 0.06]} receiveShadow>
          <boxGeometry args={[9, 0.9, 2.5]} />
          <meshStandardMaterial color="#E6D3BF" roughness={0.6} />
        </mesh>
        <mesh geometry={geoBase} position={[0, 0.05 - (1 - baseOn) * 0.3, PLACA_Z]} rotation={[0, YAW, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#ffffff" roughness={0.08} transmission={0.85} thickness={0.1} ior={1.5} clearcoat={1} transparent opacity={baseOn} />
        </mesh>
        <group position={[0, placaY, PLACA_Z]} rotation={[TILT, placaYaw, 0]}>
          <mesh geometry={geoPlaca} castShadow>
            <meshPhysicalMaterial color="#ffffff" roughness={0.06} transmission={0.8} thickness={0.05} ior={1.5} clearcoat={1} clearcoatRoughness={0.04} />
          </mesh>
          <mesh position={[0, 0, PD / 2 + 0.0015]}>
            <planeGeometry args={[PW - 0.03, PH - 0.03]} />
            <meshBasicMaterial map={face} transparent color="#f3f3f3" toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, -PD / 2 - 0.0015]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[PW - 0.03, PH - 0.03]} />
            <meshStandardMaterial color="#f1f1f3" roughness={0.5} />
          </mesh>
        </group>
        {[0, 7, 14].map((d) => {
          const p = prog(f, m.toca - 3 + d, 22);
          if (p <= 0 || p >= 1) return null;
          return (
            <mesh key={d} position={nfcWorld} rotation={[TILT, YAW, 0]}>
              <ringGeometry args={[0.1 + 0.5 * p, 0.115 + 0.5 * p, 96]} />
              <meshBasicMaterial color="#1a73e8" transparent opacity={0.9 * (1 - p)} toneMapped={false} side={THREE.DoubleSide} />
            </mesh>
          );
        })}
        {f >= m.aproxima - 12 && <Celular tela={tela} razao={CEL.th / CEL.tw} pos={fone} rot={foneRot} escala={0.97} />}
      </Palco>
      <div style={{position: 'absolute', top: 120, width: '100%', textAlign: 'center'}}>
        {f < m.aproxima && <Titulo f={f} ini={W(176)} tam={100} texto={'Uma placa de avaliação\nno *balcão.*'} sai={m.aproxima - 6} />}
      </div>
      <div style={{position: 'absolute', top: 120, width: '100%', textAlign: 'center'}}>
        {f >= m.aproxima - 4 && <Titulo f={f} ini={W(183)} tam={100} texto={'Aproximou,\n*avaliou.*'} />}
      </div>
    </AbsoluteFill>
  );
};

/** Cinco estrelas 3D caem uma a uma: "Cada venda vira uma estrela." */
export const Estrelas: React.FC<{f: number}> = ({f}) => {
  const geo = useMemo(() => geoEstrela(0.1, 0.04), []);
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({color: '#FBBC04', metalness: 0.15, roughness: 0.32, clearcoat: 0.8}), []);
  const ini = W(190) - 4;
  return (
    <AbsoluteFill style={{background: C.creme}}>
      <Palco>
        <Camera pos={[Math.sin(f * 0.02) * 0.2, 0.05, 4.6 - (f - ini) * 0.004]} look={[0, 0, 0]} />
        {[0, 1, 2, 3, 4].map((i) => {
          const a = spring(f, ini + 4 + i * 4, 0.24, 0.55);
          return (
            <mesh key={i} geometry={geo} material={mat} castShadow position={[(i - 2) * 0.205, lerp(2.4, 0, clamp(a, 0, 1.3)), 0]} rotation={[0, (1 - a) * Math.PI * 2, (1 - a) * 0.6]} scale={clamp(a, 0.001, 1)} />
          );
        })}
      </Palco>
      <div style={{position: 'absolute', top: 1240, width: '100%', textAlign: 'center'}}>
        <Titulo f={f} ini={W(191)} tam={108} texto={'Cada venda vira\n*uma estrela.*'} />
      </div>
      <div style={{position: 'absolute', top: 560, width: '100%', textAlign: 'center'}}>
        <Rotulo f={f} ini={ini + 26}>Mais avaliações, mais destaque</Rotulo>
      </div>
    </AbsoluteFill>
  );
};
