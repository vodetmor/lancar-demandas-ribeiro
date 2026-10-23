// A loja online no celular (3D): pronta, categorias com as peças em volta, foto/tamanho, sacola. Depois o pedido no WhatsApp.
import React, {useMemo} from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {arrive, clamp, E, lerp, prog, spring} from '../kit';
import {W} from '../tempos';
import {C, FONTES, Rotulo, Titulo} from '../ui';
import {Camera, CEL, Celular, ChaoSombra, mix3, Palco, RoundedBoxGeometry, THREE, useTex, V3} from '../tres';

const RZ = 2532 / 1170; // prints do celular 390x844
const LOOKS = ['look-vestido-off-white-flores-terracota', 'look-alfaiataria-colete-calca-bege', 'look-calca-jeans-wide-leg', 'look-vestido-rose-um-ombro',
  'look-jaqueta-jeans-bordada', 'look-vestido-tule-verde-agua', 'look-alfaiataria-calca-off-white-sala', 'look-conjunto-camel-camurca'];

const Cartao: React.FC<{src: string; pos: V3; rot: V3; escala: number; op: number}> = ({src, pos, rot, escala, op}) => {
  const t = useTex(src);
  const geo = useMemo(() => new RoundedBoxGeometry(0.42, 0.56, 0.02, 4, 0.008), []);
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <mesh geometry={geo} castShadow>
        <meshStandardMaterial color="#fffdfb" roughness={0.6} transparent opacity={op} />
      </mesh>
      <mesh position={[0, 0, 0.0112]}>
        <planeGeometry args={[0.4, 0.54]} />
        <meshBasicMaterial map={t} toneMapped={false} transparent opacity={op} />
      </mesh>
    </group>
  );
};

const Sacola: React.FC<{pos: V3; rot: V3; escala?: number}> = ({pos, rot, escala = 1}) => {
  const frente = useTex('tex/sacola.png');
  const mats = useMemo(() => {
    const papel = new THREE.MeshStandardMaterial({color: '#F8F1E9', roughness: 0.82});
    const face = new THREE.MeshStandardMaterial({map: frente, roughness: 0.8});
    return [papel, papel, papel, papel, face, face];
  }, [frente]);
  const alca = useMemo(() => new THREE.TorusGeometry(0.12, 0.009, 10, 40, Math.PI), []);
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <mesh castShadow receiveShadow material={mats}>
        <boxGeometry args={[0.62, 0.72, 0.24]} />
      </mesh>
      {/* boca da sacola: sombra interna */}
      <mesh position={[0, 0.3605, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.6, 0.22]} />
        <meshStandardMaterial color="#d8cabd" roughness={1} />
      </mesh>
      {[0.1, -0.1].map((z) => (
        <mesh key={z} geometry={alca} position={[0, 0.36, z]} castShadow>
          <meshStandardMaterial color="#E7D3C3" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
};

const Toque: React.FC<{f: number; ini: number; x: number; y: number}> = ({f, ini, x, y}) => {
  const p = prog(f, ini, 20);
  if (p <= 0 || p >= 1) return null;
  return (
    <mesh position={[(x - 0.5) * CEL.tw, (0.5 - y) * CEL.th, CEL.d / 2 + 0.004]}>
      <ringGeometry args={[0.02 + 0.07 * p, 0.03 + 0.07 * p, 48]} />
      <meshBasicMaterial color={C.rose} transparent opacity={0.9 * (1 - p)} toneMapped={false} />
    </mesh>
  );
};

export const LojaOnline: React.FC<{f: number}> = ({f}) => {
  const tHome = useTex('shots/home-full.jpg', true);
  const tLoja = useTex('shots/loja-full.jpg', true);
  const tProd = useTex('shots/produto.jpg', true);
  const tTam = useTex('shots/produto-tam.jpg', true);
  const tSac = useTex('shots/sacola.jpg', true);
  const ini = W(83) - 4;
  const cat = W(98) - 2, foto = W(103) - 2, tam = W(110) - 2, sac = W(111) - 2;
  // celular: sobe girando e pousa
  const a = spring(f, ini, 0.16, 0.78);
  const lado = E.expr(prog(f, sac, 24));
  const fonePos = mix3([0, lerp(-3.2, -0.1, clamp(a, 0, 1.2)), 0], [-0.42, -0.08, 0], lado);
  const foneRot: V3 = [lerp(-0.5, -0.04, a), lerp(-Math.PI * 2 + 0.2, -0.22, a) + Math.sin(f * 0.03) * 0.05 + lado * 0.35, lerp(0.3, 0.02, a)];
  let tela = tHome, razao = 4500 / 780, rol = 0.0085 * Math.max(0, f - ini - 20) / 10;
  if (f >= cat) { tela = tLoja; razao = 6000 / 780; rol = 0.6 * E.prod(prog(f, cat + 8, foto - cat - 8)); }
  if (f >= foto) { tela = tProd; razao = RZ; rol = 0; }
  if (f >= tam) tela = tTam;
  if (f >= W(116) - 4) tela = tSac;
  // anel de peças em volta do celular
  const anelIn = spring(f, cat, 0.2, 0.85);
  const anelOut = E.exit(prog(f, foto, 18));
  // câmera
  const zoomFoto = E.cam(prog(f, foto, 30)) * (1 - lado);
  const camPos: V3 = [Math.sin(f * 0.01) * 0.25, 0.12 + anelIn * 0.25 * (1 - anelOut), lerp(4.3, 3.75, zoomFoto) + anelIn * 0.9 * (1 - anelOut) - (f - ini) * 0.0015];
  const look: V3 = [lado * 0.05, lerp(-0.05, 0.08, zoomFoto), 0];
  // sacola cai no "sacola"
  const sq = spring(f, W(114) - 4, 0.22, 0.6);
  const peca = prog(f, W(115) - 2, 16);
  return (
    <AbsoluteFill style={{background: C.creme}}>
      <Palco>
        <Camera pos={camPos} look={look} />
        <group position={fonePos} rotation={foneRot}>
          <Celular tela={tela} razao={razao} rolagem={rol} />
          <Toque f={f} ini={tam + 2} x={0.277} y={0.953} />
        </group>
        {f >= cat - 2 && f < foto + 20 && LOOKS.map((l, i) => {
          const ang = (i / LOOKS.length) * Math.PI * 2 + f * 0.012;
          const r = lerp(0.6, 1.2, clamp(anelIn)) + anelOut * 1.4;
          const y = Math.sin(i * 1.7) * 0.35 - 0.05;
          return (
            <Cartao key={l} src={`img/${l}.webp`} pos={[Math.sin(ang) * r, y, Math.cos(ang) * r - 0.2]} rot={[0, ang * 0.15, Math.sin(i) * 0.06]}
              escala={clamp(spring(f, cat + i * 2, 0.3, 0.75), 0.001, 1.1)} op={1 - anelOut} />
          );
        })}
        {f >= W(114) - 6 && <Sacola pos={[0.48, lerp(2.4, -0.42, clamp(sq, 0, 1.3)), 0.1]} rot={[0, lerp(1.2, -0.35, sq), lerp(0.4, 0, sq)]} escala={0.95} />}
        {peca > 0 && peca < 1 && (
          <Cartao src="img/look-vestido-off-white-flores-terracota.webp" pos={mix3([-0.42, 0.1, 0.15], [0.48, 0.05, 0.1], E.expr(peca)) .map((v, i) => (i === 1 ? v + Math.sin(peca * Math.PI) * 0.45 : v)) as V3}
            rot={[0, 0, peca * 1.2]} escala={lerp(0.5, 0.25, peca)} op={1} />
        )}
        <ChaoSombra y={-0.8} opacidade={0.13} />
      </Palco>
      {f < cat && (
        <div style={{position: 'absolute', top: 120, width: '100%', textAlign: 'center'}}>
          <Rotulo f={f} ini={W(85)}>Feita para a Luiza Rabelo</Rotulo>
          <Titulo f={f} ini={W(93) - 2} tam={108} texto={'A loja online\n*já está pronta.*'} style={{marginTop: 26}} sai={cat - 6} />
        </div>
      )}
      {f >= cat - 2 && f < foto + 8 && (
        <div style={{position: 'absolute', top: 1540, width: '100%', textAlign: 'center', fontFamily: FONTES.titulo, fontWeight: 300, fontSize: 110, lineHeight: 1.05, color: C.escuro,
          opacity: 1 - E.exit(prog(f, foto - 4, 10))}}>
          {[[['Vestidos,', W(98)], ['alfaiataria,', W(99)]], [['jeans', W(100)], ['e', W(101)], ['semijoias.', W(102)]]].map((ln, li) => (
            <div key={li}>
              {ln.map(([t, i0]) => {
                const a = arrive(f, (i0 as number) - 2, 0.2);
                return <span key={t as string} style={{display: 'inline-block', margin: '0 0.12em', fontStyle: t === 'e' ? 'normal' : 'italic', color: t === 'e' ? C.escuro : C.roseEsc,
                  opacity: clamp(a * 1.6), transform: `translateY(${(1 - a) * 50}px)`}}>{t}</span>;
              })}
            </div>
          ))}
        </div>
      )}
      {f >= foto && f < sac + 4 && (
        <div style={{position: 'absolute', top: 130, width: '100%', textAlign: 'center'}}>
          <Titulo f={f} ini={foto + 4} tam={92} texto={'Foto grande, descrição\ne *tamanho.*'} sai={sac - 2} />
        </div>
      )}
      {f >= sac && (
        <div style={{position: 'absolute', top: 130, width: '100%', textAlign: 'center'}}>
          <Titulo f={f} ini={sac + 4} tam={100} texto={'Escolhe, coloca\nna *sacola.*'} />
        </div>
      )}
    </AbsoluteFill>
  );
};

/** O pedido chega no WhatsApp da loja (mensagem real gerada pelo botão "Finalizar pelo WhatsApp" do site). */
export const Zap: React.FC<{f: number}> = ({f}) => {
  const ini = W(117) - 3;
  const ent = arrive(f, ini, 0.18);
  const bolha = spring(f, W(120) - 2, 0.3, 0.7);
  const lido = f >= W(124);
  return (
    <AbsoluteFill style={{background: C.creme}}>
      <div style={{position: 'absolute', top: 120, width: '100%', textAlign: 'center'}}>
        <Titulo f={f} ini={ini + 2} tam={100} texto={'Direto no *WhatsApp*\nda loja.'} />
      </div>
      <div style={{position: 'absolute', left: 90, top: 470, width: 900, height: 1180, borderRadius: 48, overflow: 'hidden', background: '#EFEAE2', boxShadow: '0 30px 80px rgba(60,40,30,.16)',
        transform: `translateY(${(1 - ent) * 120}px) scale(${0.96 + 0.04 * ent})`, opacity: clamp(ent * 2), fontFamily: FONTES.texto}}>
        <div style={{height: 140, background: '#fff', display: 'flex', alignItems: 'center', gap: 24, padding: '0 40px', borderBottom: '1px solid #e2ddd6'}}>
          <div style={{width: 80, height: 80, borderRadius: 40, background: C.escuro, color: C.nude, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTES.logo, fontSize: 30}}>LR</div>
          <div style={{flex: 1}}><div style={{fontSize: 38, color: '#111b21'}}>Luiza Rabelo</div><div style={{fontSize: 26, color: '#667781'}}>(61) 98280-9293</div></div>
          <Img src={staticFile('logos/wikimedia-whatsapp.svg')} style={{width: 76}} />
        </div>
        <div style={{position: 'absolute', right: 36, top: 230, maxWidth: 720, background: '#D9FDD3', borderRadius: '28px 6px 28px 28px', padding: '28px 32px 50px', fontSize: 33, lineHeight: 1.42, color: '#111b21',
          boxShadow: '0 2px 2px rgba(0,0,0,.08)', transform: `translateY(${(1 - bolha) * 160}px) scale(${0.9 + 0.1 * clamp(bolha)})`, transformOrigin: '100% 0', opacity: clamp(bolha * 2)}}>
          Olá, Luiza Rabelo! Montei minha sacola pelo site:<br /><br />
          • 1x Vestido Flores Terracota (tam. P): Sob consulta<br />
          • 1x Vestido Bordado Branco (tam. PP): Sob consulta<br /><br />
          Podem confirmar disponibilidade, valores e frete?
          <div style={{position: 'absolute', right: 26, bottom: 14, fontSize: 22, color: '#667781', display: 'flex', gap: 6, alignItems: 'center'}}>
            10:24
            <svg viewBox="0 0 18 12" width="28" height="18"><path d="M1 6.5l3.2 3.2L11 2.5M7 9.7l7-7.2" stroke={lido ? '#53bdeb' : '#8696a0'} strokeWidth="1.8" fill="none" strokeLinecap="round" /></svg>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
