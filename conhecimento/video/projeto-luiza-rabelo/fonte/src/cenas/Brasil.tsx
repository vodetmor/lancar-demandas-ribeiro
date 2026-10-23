// Envio: a peça vai para a caixa, a caixa fecha com o selo da loja e sai de Brasília para o Brasil inteiro.
// Mapa: contorno real do Brasil (world-atlas 50m, public/brasil.json).
import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp, E, lerp, prog, spring} from '../kit';
import {W} from '../tempos';
import {C, Rotulo, Titulo} from '../ui';
import {Camera, ChaoSombra, mix3, Palco, Pino, RoundedBoxGeometry, THREE, useJson, useTex, V3} from '../tres';

type Mapa = {polys: [number, number][][]; cidades: Record<string, [number, number]>};
const ALT = 0.12; // espessura do mapa
const p3 = (xy: [number, number], y = ALT): V3 => [xy[0], y, -xy[1]];

const BrasilMapa: React.FC<{dados: Mapa; op?: number}> = ({dados, op = 1}) => {
  const geo = useMemo(() => {
    const shapes = dados.polys.map((pl) => new THREE.Shape(pl.map(([x, y]) => new THREE.Vector2(x, y))));
    const g = new THREE.ExtrudeGeometry(shapes, {depth: ALT, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 3, curveSegments: 4});
    g.rotateX(-Math.PI / 2);
    return g;
  }, [dados]);
  const mats = useMemo(() => [new THREE.MeshStandardMaterial({color: '#F3E6DC', roughness: 0.75, transparent: true}), new THREE.MeshStandardMaterial({color: '#D7B8A3', roughness: 0.7, transparent: true})], []);
  mats.forEach((m) => (m.opacity = op));
  return <mesh geometry={geo} material={mats} castShadow receiveShadow />;
};

const Arco: React.FC<{de: V3; para: V3; p: number; cor?: string}> = ({de, para, p, cor = C.roseEsc}) => {
  const {geo, n} = useMemo(() => {
    const meio = new THREE.Vector3((de[0] + para[0]) / 2, Math.max(de[1], para[1]) + 0.25 + 0.18 * Math.hypot(para[0] - de[0], para[2] - de[2]), (de[2] + para[2]) / 2);
    const curva = new THREE.QuadraticBezierCurve3(new THREE.Vector3(...de), meio, new THREE.Vector3(...para));
    const g = new THREE.TubeGeometry(curva, 64, 0.008, 8, false);
    return {geo: g, n: g.index!.count};
  }, [de, para]);
  geo.setDrawRange(0, Math.floor(n * clamp(p) / 6) * 6);
  if (p <= 0) return null;
  return (
    <mesh geometry={geo}>
      <meshBasicMaterial color={cor} toneMapped={false} />
    </mesh>
  );
};

const Ponto: React.FC<{pos: V3; a: number; cor?: string}> = ({pos, a, cor = C.roseEsc}) => (a <= 0 ? null : (
  <mesh position={pos} scale={clamp(a, 0.001, 1.3)}>
    <sphereGeometry args={[0.035, 20, 14]} />
    <meshStandardMaterial color={cor} roughness={0.4} />
  </mesh>
));

// ---------------------------------------------------------------- caixa de envio
const K = {w: 0.9, h: 0.5, d: 0.66, e: 0.012};
const Caixa: React.FC<{f: number; fecha: number; selo: number}> = ({f, fecha, selo}) => {
  const etiqueta = useTex('tex/etiqueta.png');
  const kraft = useMemo(() => new THREE.MeshStandardMaterial({color: '#C9A27C', roughness: 0.88}), []);
  const dentro = useMemo(() => new THREE.MeshStandardMaterial({color: '#B88E66', roughness: 0.95, side: THREE.DoubleSide}), []);
  // abas: 0 frente, 1 trás, 2 esq, 3 dir. Laterais fecham primeiro.
  const ab = (i: number) => E.expr(prog(f, fecha + [8, 12, 0, 3][i], 12));
  const ang = (i: number) => lerp(-2.2, 0, ab(i)) * 1;
  void f;
  return (
    <group>
      {/* fundo e paredes */}
      <mesh position={[0, K.e / 2, 0]} material={dentro} receiveShadow><boxGeometry args={[K.w, K.e, K.d]} /></mesh>
      <mesh position={[0, K.h / 2, K.d / 2]} material={kraft} castShadow><boxGeometry args={[K.w, K.h, K.e]} /></mesh>
      <mesh position={[0, K.h / 2, -K.d / 2]} material={kraft} castShadow><boxGeometry args={[K.w, K.h, K.e]} /></mesh>
      <mesh position={[K.w / 2, K.h / 2, 0]} material={kraft} castShadow><boxGeometry args={[K.e, K.h, K.d]} /></mesh>
      <mesh position={[-K.w / 2, K.h / 2, 0]} material={kraft} castShadow><boxGeometry args={[K.e, K.h, K.d]} /></mesh>
      {/* abas (dobradiça na borda) */}
      <group position={[0, K.h, K.d / 2]} rotation={[-ang(0), 0, 0]}>
        <mesh position={[0, 0, -K.d / 4]} material={kraft} castShadow><boxGeometry args={[K.w, K.e, K.d / 2]} /></mesh>
      </group>
      <group position={[0, K.h, -K.d / 2]} rotation={[ang(1), 0, 0]}>
        <mesh position={[0, 0, K.d / 4]} material={kraft} castShadow><boxGeometry args={[K.w, K.e, K.d / 2]} /></mesh>
      </group>
      <group position={[-K.w / 2, K.h - 0.004, 0]} rotation={[0, 0, -ang(2)]}>
        <mesh position={[K.w / 4, 0, 0]} material={dentro} castShadow><boxGeometry args={[K.w / 2, K.e * 0.6, K.d * 0.96]} /></mesh>
      </group>
      <group position={[K.w / 2, K.h - 0.004, 0]} rotation={[0, 0, ang(3)]}>
        <mesh position={[-K.w / 4, 0, 0]} material={dentro} castShadow><boxGeometry args={[K.w / 2, K.e * 0.6, K.d * 0.96]} /></mesh>
      </group>
      {/* selo da loja */}
      {selo > 0 && (
        <mesh position={[0, K.h + K.e + 0.002 + (1 - clamp(selo)) * 0.5, 0]} rotation={[-Math.PI / 2, 0, (1 - clamp(selo)) * 0.8]} scale={clamp(selo, 0.001, 1.15)}>
          <circleGeometry args={[0.17, 64]} />
          <meshStandardMaterial map={etiqueta} transparent roughness={0.6} />
        </mesh>
      )}
    </group>
  );
};

const Embrulho: React.FC<{pos: V3; rot: V3}> = ({pos, rot}) => {
  const geo = useMemo(() => new RoundedBoxGeometry(0.66, 0.12, 0.46, 5, 0.05), []);
  return (
    <group position={pos} rotation={rot}>
      <mesh geometry={geo} castShadow>
        <meshStandardMaterial color={C.nude} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.062, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.05, 0.47]} />
        <meshStandardMaterial color={C.rose} roughness={0.5} />
      </mesh>
    </group>
  );
};

export const Envio: React.FC<{f: number}> = ({f}) => {
  const dados = useJson<Mapa>('brasil.json');
  const ini = W(126) - 4;
  const caixaIn = spring(f, ini, 0.2, 0.8);
  const pecaIn = spring(f, W(137) - 2, 0.18, 0.7);
  const fecha = W(141) - 6;
  const selo = spring(f, W(144) - 4, 0.3, 0.55);
  const brasil = E.cam(prog(f, W(149) - 6, 36));
  const mapaIn = E.expr(prog(f, W(149) - 10, 24));
  const bsb = dados ? p3(dados.cidades['Brasília']) : ([0, ALT, 0] as V3);
  // caixa vai para Brasília encolhendo
  const caixaPos = mix3([0, lerp(-2, 0, clamp(caixaIn, 0, 1.2)) + lerp(0, 0, 0), 0], [bsb[0], bsb[1], bsb[2]], brasil);
  const caixaEsc = lerp(1, 0.16, brasil);
  const camPos = mix3([1.3 + Math.sin(f * 0.01) * 0.2, 3.0, 4.6 - (f - ini) * 0.002], [bsb[0] + 0.2, 5.8, bsb[2] + 4.0], brasil);
  const look = mix3([0, 0.25, 0], [bsb[0] - 0.3, 0, bsb[2] - 0.3], brasil);
  const cidades = dados ? Object.entries(dados.cidades).filter(([n]) => n !== 'Brasília') : [];
  return (
    <AbsoluteFill style={{background: C.creme}}>
      <Palco>
        <Camera pos={camPos} look={look} />
        {dados && mapaIn > 0 && (
          <group position={[0, (1 - mapaIn) * -0.6, 0]}>
            <BrasilMapa dados={dados} op={mapaIn} />
          </group>
        )}
        <group position={caixaPos} scale={caixaEsc} rotation={[0, lerp(-0.5, -0.2, caixaIn) + brasil * 0.2, 0]}>
          <Caixa f={f} fecha={fecha} selo={selo} />
          {f >= W(137) - 4 && <Embrulho pos={[0, lerp(1.6, 0.09, clamp(pecaIn, 0, 1.15)), 0]} rot={[0, (1 - pecaIn) * 0.6, (1 - pecaIn) * 0.3]} />}
        </group>
        {dados && cidades.map(([n, xy], i) => {
          const t0 = W(150) + i * 2;
          const p = E.expr(prog(f, t0, 16));
          return (
            <group key={n}>
              <Arco de={bsb} para={p3(xy)} p={p} />
              <Ponto pos={p3(xy, ALT + 0.02)} a={spring(f, t0 + 14, 0.35, 0.6)} />
            </group>
          );
        })}
        <ChaoSombra y={-0.001} opacidade={0.12 * (1 - mapaIn * 0.5)} />
      </Palco>
      <div style={{position: 'absolute', top: 120, width: '100%', textAlign: 'center'}}>
        {f < W(136) && <Titulo f={f} ini={W(131) - 2} tam={104} texto={'Ao lado dos\n*Correios.*'} sai={W(136) - 6} />}
      </div>
      <div style={{position: 'absolute', top: 120, width: '100%', textAlign: 'center'}}>
        {f >= W(136) - 2 && f < W(149) && <Titulo f={f} ini={W(144) - 2} tam={104} texto={'Postada no\n*mesmo dia.*'} sai={W(149) - 6} />}
      </div>
      <div style={{position: 'absolute', top: 120, width: '100%', textAlign: 'center'}}>
        {f >= W(149) - 2 && <Titulo f={f} ini={W(150)} tam={104} texto={'Para qualquer lugar\ndo *Brasil.*'} />}
      </div>
      {f >= W(149) && (
        <div style={{position: 'absolute', bottom: 120, width: '100%', textAlign: 'center'}}>
          <Rotulo f={f} ini={W(153)}>Sobradinho · DF para todo o país</Rotulo>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- "Perto da loja... e no Brasil inteiro" (anúncios)
const Ruas: React.FC<{op: number}> = ({op}) => {
  const linhas = useMemo(() => {
    const ls: {p: V3; s: V3}[] = [];
    for (let i = -6; i <= 6; i++) {
      ls.push({p: [i * 0.42 + Math.sin(i) * 0.05, 0.002, 0], s: [i % 3 === 0 ? 0.07 : 0.035, 0.004, 6]});
      ls.push({p: [0, 0.002, i * 0.42 + Math.cos(i) * 0.05], s: [6, 0.004, i % 3 === 0 ? 0.07 : 0.035]});
    }
    return ls;
  }, []);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#EFE6DC" roughness={1} transparent opacity={op} />
      </mesh>
      {linhas.map((l, i) => (
        <mesh key={i} position={l.p}>
          <boxGeometry args={l.s} />
          <meshStandardMaterial color="#FFFDFB" roughness={1} transparent opacity={op} />
        </mesh>
      ))}
    </group>
  );
};

export const Perto: React.FC<{f: number}> = ({f}) => {
  const dados = useJson<Mapa>('brasil.json');
  const ini = W(211) - 4;
  const pino = spring(f, ini + 2, 0.22, 0.55);
  const brasil = E.cam(prog(f, W(214) - 6, 34));
  const bsb = dados ? p3(dados.cidades['Brasília']) : ([0, ALT, 0] as V3);
  const anel = (f - ini - 10) / 40;
  const camPos = mix3([0.5, 1.15, 3.3 - (f - ini) * 0.004], [bsb[0] + 0.3, 5.8, bsb[2] + 4.0], brasil);
  const look = mix3([0, 0.45, 0], [bsb[0] - 0.3, 0, bsb[2] - 0.3], brasil);
  const local = 1 - E.expr(prog(f, W(214) - 6, 16));
  const cidades = dados ? Object.entries(dados.cidades).filter(([n]) => n !== 'Brasília') : [];
  return (
    <AbsoluteFill style={{background: C.creme}}>
      <Palco>
        <Camera pos={camPos} look={look} />
        {local > 0.01 && (
          <group position={[0, -0.01, 0]}>
            <Ruas op={local} />
            {anel > 0 && [0, 0.33, 0.66].map((d) => {
              const p = (anel + d) % 1;
              return (
                <mesh key={d} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                  <ringGeometry args={[0.2 + p * 1.1, 0.215 + p * 1.1, 72]} />
                  <meshBasicMaterial color="#EA4335" transparent opacity={0.45 * (1 - p) * local} />
                </mesh>
              );
            })}
            <Pino pos={[0, lerp(2.5, 0, clamp(pino, 0, 1.2)), 0]} escala={0.55} />
          </group>
        )}
        {dados && brasil > 0 && (
          <group position={[0, (1 - brasil) * -0.8, 0]}>
            <BrasilMapa dados={dados} op={clamp(brasil * 1.5)} />
            <Pino pos={bsb} escala={0.22} />
            {cidades.map(([n, xy], i) => {
              const a = spring(f, W(215) + i * 2, 0.3, 0.6);
              return a > 0 ? <Pino key={n} pos={p3(xy)} escala={0.15 * clamp(a, 0.001, 1.2)} /> : null;
            })}
          </group>
        )}
        <ChaoSombra y={-0.02} opacidade={0.12} />
      </Palco>
      <div style={{position: 'absolute', top: 120, width: '100%', textAlign: 'center'}}>
        {f < W(214) && <Titulo f={f} ini={ini + 2} tam={104} texto={'Perto da *loja...*'} sai={W(214) - 6} />}
      </div>
      <div style={{position: 'absolute', top: 120, width: '100%', textAlign: 'center'}}>
        {f >= W(214) - 2 && <Titulo f={f} ini={W(215) - 2} tam={104} texto={'...e no Brasil\n*inteiro.*'} />}
      </div>
      {f < W(214) && (
        <div style={{position: 'absolute', bottom: 160, width: '100%', textAlign: 'center'}}>
          <Rotulo f={f} ini={ini + 14}>Sobradinho · DF</Rotulo>
        </div>
      )}
    </AbsoluteFill>
  );
};
