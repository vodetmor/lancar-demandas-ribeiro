// Peças 3D (three.js via @remotion/three). Render com --gl=angle.
import React, {useLayoutEffect, useMemo, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js';
import {C} from './ui';

export type V3 = [number, number, number];
export const mix3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

// Textura carregada depois do primeiro desenho do canvas: o Renovador (dentro de cada Palco) redesenha a cena
// e só então libera o quadro. Sem isso a textura sai preta no render.
const renovadores = new Set<() => void>();
const avisaCarregou = (h: number | null) => {
  renovadores.forEach((r) => r());
  // setTimeout e não requestAnimationFrame: abas em segundo plano (render em paralelo) não rodam rAF
  setTimeout(() => {
    renovadores.forEach((r) => r());
    setTimeout(() => {
      if (h !== null) continueRender(h);
    }, 60);
  }, 30);
};
const Renovador: React.FC = () => {
  const {invalidate} = useThree();
  useLayoutEffect(() => {
    const r = () => invalidate();
    renovadores.add(r);
    return () => void renovadores.delete(r);
  }, [invalidate]);
  return null;
};

// Todas as texturas são carregadas uma vez, antes de qualquer cena montar (Precarga no Video).
// Assim nenhum canvas desenha sem textura e não há delayRender por cena.
export const TEXTURAS = [
  'shots/home-full.jpg', 'shots/loja-full.jpg', 'shots/produto.jpg', 'shots/produto-tam.jpg', 'shots/sacola.jpg',
  'tex/etiqueta.png', 'tex/placa.png', 'tex/sacola.png', 'tex/tela-travada.png',
  ...[0, 1, 2, 3, 4, 5].map((n) => `tex/tela-avaliacao-${n}.png`),
  ...['look-vestido-off-white-flores-terracota', 'look-alfaiataria-colete-calca-bege', 'look-calca-jeans-wide-leg', 'look-vestido-rose-um-ombro',
    'look-jaqueta-jeans-bordada', 'look-vestido-tule-verde-agua', 'look-alfaiataria-calca-off-white-sala', 'look-conjunto-camel-camurca'].map((l) => `img/${l}.webp`),
];
const cacheTex = new Map<string, THREE.Texture>();
let precarga: Promise<void> | null = null;
export const precarregaTexturas = (extras: string[] = []) => {
  if (!precarga) {
    const loader = new THREE.TextureLoader();
    precarga = Promise.all([...TEXTURAS, ...extras].map((src) => new Promise<void>((ok) => {
      loader.load(staticFile(src), (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 8;
        cacheTex.set(src, t);
        ok();
      }, undefined, () => ok());
    }))).then(() => undefined);
  }
  return precarga;
};
/** Textura de public/ (já pré-carregada). `copia` = instância própria (para mexer em repeat/offset). */
export const useTex = (src: string, copia = false) => useMemo(() => {
  let t = cacheTex.get(src);
  if (!t) {
    // fora da lista: carrega na hora (evitar; só para testes)
    t = new THREE.TextureLoader().load(staticFile(src), () => avisaCarregou(null));
    t.colorSpace = THREE.SRGBColorSpace;
    cacheTex.set(src, t);
  }
  if (!copia) return t;
  const c = t.clone();
  c.needsUpdate = true;
  return c;
}, [src, copia]);

const cacheJson = new Map<string, unknown>();
export const useJson = <T,>(src: string): T | null => {
  const [dado, setDado] = useState<T | null>(() => (cacheJson.get(src) as T) ?? null);
  const [h] = useState(() => (cacheJson.has(src) ? null : delayRender('json ' + src)));
  useLayoutEffect(() => {
    if (dado) return;
    fetch(staticFile(src)).then((r) => r.json()).then((j) => {
      cacheJson.set(src, j);
      setDado(j);
      if (h !== null) continueRender(h);
    });
  }, [src, dado, h]);
  return dado;
};

export const Ambiente: React.FC<{intensidade?: number}> = ({intensidade = 0.6}) => {
  const {gl, scene} = useThree();
  useLayoutEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const env = pm.fromScene(new RoomEnvironment(), 0.03).texture;
    scene.environment = env;
    scene.environmentIntensity = intensidade;
    return () => {
      env.dispose();
      pm.dispose();
    };
  }, [gl, scene, intensidade]);
  return null;
};

export const Camera: React.FC<{pos: V3; look: V3; fov?: number}> = ({pos, look, fov}) => {
  const {camera} = useThree();
  camera.position.set(...pos);
  camera.lookAt(...look);
  if (fov && (camera as THREE.PerspectiveCamera).fov !== fov) {
    (camera as THREE.PerspectiveCamera).fov = fov;
    camera.updateProjectionMatrix();
  }
  return null;
};

/** Palco padrão: fundo creme, luz suave de estúdio, sombra macia. */
export const Palco: React.FC<{children: React.ReactNode; fundo?: string | null; fov?: number; sombra?: boolean}> = ({children, fundo = C.creme, fov = 30, sombra = true}) => (
  <ThreeCanvas width={1080} height={1920} shadows={sombra} style={{position: 'absolute', inset: 0}} camera={{fov, near: 0.05, far: 80}} gl={{antialias: true, alpha: fundo === null}}>
    <Ambiente />
    <Renovador />
    {fundo && <color attach="background" args={[fundo]} />}
    <hemisphereLight args={['#fffaf4', '#e9dccf', 0.85]} />
    <directionalLight position={[-2.4, 4.4, 3.2]} intensity={2.0} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
      shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-radius={8} shadow-bias={-0.0004} />
    <directionalLight position={[3, 1.4, 2.4]} intensity={0.55} color="#ffe9dc" />
    {children}
  </ThreeCanvas>
);

/** Chão que só recebe sombra (some no fundo creme). */
export const ChaoSombra: React.FC<{y?: number; opacidade?: number}> = ({y = 0, opacidade = 0.16}) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow>
    <planeGeometry args={[40, 40]} />
    <shadowMaterial transparent opacity={opacidade} />
  </mesh>
);

// ---------------------------------------------------------------- celular
export const CEL = {w: 0.64, h: 1.32, d: 0.075, tw: 0.592, th: 1.272, raio: 0.085};
const telaGeo = (w: number, h: number, r: number) => {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  const g = new THREE.ShapeGeometry(s, 16);
  const uv = g.attributes.uv as THREE.BufferAttribute, pos = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (pos.getX(i) - x) / w, (pos.getY(i) - y) / h);
  return g;
};

/**
 * Celular com a tela mostrando `tela`. Se a imagem for mais alta que a tela, `rolagem` (0..1) desce a página.
 * `razao` = altura/largura da imagem.
 */
export const Celular: React.FC<{tela: THREE.Texture; razao: number; rolagem?: number; pos?: V3; rot?: V3; escala?: number; brilho?: number}> = ({tela, razao, rolagem = 0, pos = [0, 0, 0], rot = [0, 0, 0], escala = 1, brilho = 1}) => {
  const corpo = useMemo(() => new RoundedBoxGeometry(CEL.w, CEL.h, CEL.d, 8, CEL.raio), []);
  const geoTela = useMemo(() => telaGeo(CEL.tw, CEL.th, CEL.raio * 0.78), []);
  const vis = (CEL.th / CEL.tw) / razao; // fração visível da imagem
  tela.wrapS = tela.wrapT = THREE.ClampToEdgeWrapping;
  tela.repeat.set(1, Math.min(1, vis));
  tela.offset.set(0, Math.max(0, 1 - Math.min(1, vis) - rolagem * Math.max(0, 1 - vis)));
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <mesh geometry={corpo} castShadow>
        <meshPhysicalMaterial color="#2a2522" metalness={0.6} roughness={0.3} clearcoat={1} clearcoatRoughness={0.12} />
      </mesh>
      <mesh geometry={geoTela} position={[0, 0, CEL.d / 2 + 0.0012]}>
        <meshBasicMaterial map={tela} toneMapped={false} color={new THREE.Color(brilho, brilho, brilho)} />
      </mesh>
    </group>
  );
};

// ---------------------------------------------------------------- nome em metal rosé (Cinzel extrudada)
export const useFonte3D = () => {
  const j = useJson<Record<string, unknown>>('cinzel.typeface.json');
  return useMemo(() => (j ? new FontLoader().parse(j as never) : null), [j]);
};

export type Letra = {ch: string; geo: THREE.BufferGeometry; x: number; w: number};
/** Geometria de cada letra de `texto`, centrada no conjunto. */
export const useLetras = (texto: string, tam = 0.3, prof = 0.06) => {
  const fonte = useFonte3D();
  return useMemo(() => {
    if (!fonte) return [] as Letra[];
    const ls: Letra[] = [];
    let x = 0;
    const esp = tam * 0.16; // tracking largo, como no site
    for (const ch of texto) {
      if (ch === ' ') { x += tam * 0.42; continue; }
      const geo = new TextGeometry(ch, {font: fonte, size: tam, depth: prof, curveSegments: 10, bevelEnabled: true, bevelThickness: prof * 0.25, bevelSize: tam * 0.012, bevelSegments: 4});
      geo.computeBoundingBox();
      const bb = geo.boundingBox!;
      const w = bb.max.x - bb.min.x;
      geo.translate(-bb.min.x - w / 2, -tam * 0.36, -prof / 2);
      ls.push({ch, geo, x: x + w / 2, w});
      x += w + esp;
    }
    const total = x - esp;
    ls.forEach((l) => (l.x -= total / 2));
    return ls;
  }, [fonte, texto, tam, prof]);
};

export const materialRose = () => new THREE.MeshPhysicalMaterial({color: '#C99A7E', metalness: 1, roughness: 0.26, clearcoat: 0.6, clearcoatRoughness: 0.2});

// ---------------------------------------------------------------- estrela
export const geoEstrela = (r = 0.3, prof = 0.08) => {
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const a = Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * 0.45;
    const p = [Math.cos(a) * rr, Math.sin(a) * rr] as const;
    if (i === 0) s.moveTo(...p); else s.lineTo(...p);
  }
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, {depth: prof, bevelEnabled: true, bevelThickness: prof * 0.35, bevelSize: r * 0.06, bevelSegments: 4, curveSegments: 4});
  g.center();
  return g;
};

// ---------------------------------------------------------------- pino do mapa (formato do Google Maps)
export const Pino: React.FC<{pos?: V3; escala?: number; cor?: string}> = ({pos = [0, 0, 0], escala = 1, cor = '#EA4335'}) => (
  <group position={pos} scale={escala}>
    <mesh position={[0, 0.95, 0]} castShadow>
      <sphereGeometry args={[0.3, 48, 32]} />
      <meshPhysicalMaterial color={cor} roughness={0.35} clearcoat={0.8} />
    </mesh>
    <mesh position={[0, 0.43, 0]} rotation={[Math.PI, 0, 0]} castShadow>
      <coneGeometry args={[0.255, 0.86, 48, 1, true]} />
      <meshPhysicalMaterial color={cor} roughness={0.35} clearcoat={0.8} side={THREE.DoubleSide} />
    </mesh>
    <mesh position={[0, 0.97, 0.285]}>
      <circleGeometry args={[0.1, 32]} />
      <meshBasicMaterial color="#8C1C13" />
    </mesh>
  </group>
);

export {RoundedBoxGeometry, THREE};
