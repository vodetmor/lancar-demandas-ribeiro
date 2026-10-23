// Google: a busca, a ficha da loja hoje (sem dono, sem site, 7 avaliações), a ficha arrumada e o anúncio.
// Dados da ficha lidos no Google Maps em 16/10/2026: 4,7 com 7 avaliações, sem site, não reivindicada.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {arrive, clamp, E, lerp, prog, spring} from '../kit';
import {W} from '../tempos';
import {C, Foto, FONTES, Rotulo, Titulo} from '../ui';

const G = {azul: '#1a73e8', texto: '#202124', cinza: '#5f6368', linha: '#dadce0', amarelo: '#FBBC04', verde: '#188038'};
const fonteG = FONTES.texto;

const Estrelas: React.FC<{n?: number; tam?: number}> = ({n = 5, tam = 30}) => (
  <span style={{display: 'inline-flex', gap: 2, verticalAlign: 'middle'}}>
    {[0, 1, 2, 3, 4].map((i) => (
      <svg key={i} viewBox="0 0 24 24" width={tam} height={tam}><path d="M12 2.6l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.4l-5.9 3.3 1.3-6.6L2.5 9.5l6.6-.8z" fill={i < n ? G.amarelo : '#dadce0'} /></svg>
    ))}
  </span>
);

/** Barra de busca com o texto sendo digitado entre `ini` e `fim`. */
export const Busca: React.FC<{f: number; ini: number; fim: number; texto: string; largura?: number}> = ({f, ini, fim, texto, largura = 860}) => {
  const n = Math.round(clamp((f - ini) / Math.max(1, fim - ini)) * texto.length);
  return (
    <div style={{width: largura, height: 96, borderRadius: 48, background: '#fff', border: `2px solid ${G.linha}`, boxShadow: '0 2px 8px rgba(32,33,36,.14)',
      display: 'flex', alignItems: 'center', padding: '0 34px', gap: 22, fontFamily: fonteG, fontSize: 36, color: G.texto}}>
      <svg viewBox="0 0 24 24" width="34" height="34"><path d="M15.5 14h-.8l-.3-.3A6.5 6.5 0 1 0 9.5 16a6.5 6.5 0 0 0 4.2-1.6l.3.3v.8l5 5 1.5-1.5-5-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z" fill="#9aa0a6" /></svg>
      <span style={{whiteSpace: 'nowrap', overflow: 'hidden'}}>{texto.slice(0, n)}</span>
      <span style={{width: 3, height: 40, marginLeft: -18, background: G.azul, opacity: n < texto.length || Math.floor(f / 15) % 2 ? 1 : 0}} />
    </div>
  );
};

const Botao: React.FC<{rotulo: string; icone: string; ativo?: boolean; style?: React.CSSProperties}> = ({rotulo, icone, ativo, style}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, fontFamily: fonteG, fontSize: 26, color: ativo ? G.azul : G.azul, ...style}}>
    <div style={{width: 84, height: 84, borderRadius: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', background: ativo ? G.azul : '#fff', border: ativo ? 'none' : `2px solid ${G.linha}`}}>
      <svg viewBox="0 0 24 24" width="38" height="38"><path d={icone} fill={ativo ? '#fff' : G.azul} /></svg>
    </div>
    {rotulo}
  </div>
);
const IC = {
  rotas: 'M21.7 11.3l-9-9a1 1 0 0 0-1.4 0l-9 9a1 1 0 0 0 0 1.4l9 9a1 1 0 0 0 1.4 0l9-9a1 1 0 0 0 0-1.4zM14 14.5V12h-4v3H8v-4a1 1 0 0 1 1-1h5V7.5l3.5 3.5-3.5 3.5z',
  ligar: 'M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.6 3.6a1 1 0 0 1-.25 1z',
  salvar: 'M17 3H7a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2z',
  site: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm6.9 6h-3a15.6 15.6 0 0 0-1.4-3.6A8 8 0 0 1 18.9 8zM12 4a14 14 0 0 1 1.9 4h-3.8A14 14 0 0 1 12 4zM4.3 14a8.2 8.2 0 0 1 0-4h3.4a16.5 16.5 0 0 0 0 4zm.8 2h3a15.6 15.6 0 0 0 1.4 3.6A8 8 0 0 1 5.1 16zm3-8h-3a8 8 0 0 1 4.3-3.6A15.6 15.6 0 0 0 8.1 8zM12 20a14 14 0 0 1-1.9-4h3.8A14 14 0 0 1 12 20zm2.3-6H9.7a14.7 14.7 0 0 1 0-4h4.6a14.7 14.7 0 0 1 0 4zm.3 5.6a15.6 15.6 0 0 0 1.4-3.6h3a8 8 0 0 1-4.4 3.6zm1.7-5.6a16.5 16.5 0 0 0 0-4h3.4a8.2 8.2 0 0 1 0 4z',
};
const Linha: React.FC<{icone: string; children: React.ReactNode; vis?: number; ok?: boolean}> = ({icone, children, vis = 1, ok}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 26, padding: '22px 0', borderTop: `1px solid ${G.linha}`, fontFamily: fonteG, fontSize: 30, color: G.texto,
    opacity: clamp(vis * 1.6), transform: `translateX(${(1 - vis) * 40}px)`}}>
    <svg viewBox="0 0 24 24" width="34" height="34"><path d={icone} fill={G.azul} /></svg>
    <span style={{flex: 1}}>{children}</span>
    {ok && <svg viewBox="0 0 24 24" width="36" height="36" style={{opacity: clamp(vis * 2)}}><circle cx="12" cy="12" r="11" fill={G.verde} /><path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" /></svg>}
  </div>
);
const IC_LINHA = {
  local: 'M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5z',
  hora: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7z',
  tel: IC.ligar,
  site: IC.site,
};

const Chip: React.FC<{f: number; ini: number; children: React.ReactNode; style?: React.CSSProperties}> = ({f, ini, children, style}) => {
  const a = spring(f, ini, 0.34, 0.6);
  if (f < ini) return null;
  return (
    <div style={{position: 'absolute', padding: '14px 28px', borderRadius: 40, background: C.escuro, color: C.branco, fontFamily: FONTES.texto, fontSize: 30, letterSpacing: '0.04em',
      boxShadow: '0 14px 30px rgba(30,26,23,.25)', transform: `scale(${0.85 + 0.15 * a}) rotate(${(1 - a) * -6}deg)`, opacity: clamp(a * 2), whiteSpace: 'nowrap', ...style}}>{children}</div>
  );
};

/** A ficha de hoje: sem dono, sem site, 7 avaliações. */
export const Problema: React.FC<{f: number}> = ({f}) => {
  const ini = W(52) - 4;
  const fichaIn = spring(f, W(59) - 2, 0.22, 0.85);
  const numeros = E.expr(prog(f, W(73) - 4, 18));
  const sete = spring(f, W(74) - 2, 0.25, 0.7);
  const trinta = spring(f, W(77) - 2, 0.25, 0.7);
  const entrada = arrive(f, ini, 0.2);
  return (
    <AbsoluteFill style={{background: C.creme}}>
      <div style={{position: 'absolute', left: 50, top: 70, width: 980, height: 1780, borderRadius: 48, background: '#fff', boxShadow: '0 30px 80px rgba(60,40,30,.12)',
        transform: `scale(${lerp(1.08, 1, entrada)})`, opacity: clamp(entrada * 2), overflow: 'hidden'}}>
        <div style={{position: 'absolute', top: 120 - fichaIn * 60, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50, opacity: 1 - numeros * 0.97}}>
          <Img src={staticFile('logos/wikimedia-google-2015.svg')} style={{width: 300}} />
          <Busca f={f} ini={ini + 4} fim={W(58)} texto="loja de roupa feminina sobradinho" />
        </div>
        {/* ficha */}
        <div style={{position: 'absolute', left: 60, right: 60, top: 470, padding: '46px 50px', borderRadius: 32, border: `2px solid ${G.linha}`, background: '#fff',
          transform: `translateY(${(1 - fichaIn) * 900}px)`, opacity: (1 - numeros * 0.97) * clamp(fichaIn * 2), fontFamily: fonteG}}>
          <div style={{fontSize: 56, color: G.texto, fontWeight: 500}}>Luiza Rabelo</div>
          <div style={{marginTop: 14, fontSize: 32, color: G.cinza, display: 'flex', alignItems: 'center', gap: 12}}>
            <span style={{color: G.texto}}>4,7</span><Estrelas tam={32} />
            <span style={{padding: '0 8px', borderRadius: 8, outline: f >= W(74) ? `4px solid ${C.rose}` : 'none'}}>(7)</span>
          </div>
          <div style={{marginTop: 10, fontSize: 30, color: G.cinza}}>Loja de moda feminina</div>
          <div style={{display: 'flex', justifyContent: 'space-around', margin: '44px 0 30px'}}>
            <Botao rotulo="Rotas" icone={IC.rotas} />
            <Botao rotulo="Ligar" icone={IC.ligar} />
            <Botao rotulo="Salvar" icone={IC.salvar} />
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, fontFamily: fonteG, fontSize: 26, color: '#bdc1c6'}}>
              <div style={{width: 84, height: 84, borderRadius: 42, border: '3px dashed #c4c7cc'}} />Site
            </div>
          </div>
          <Linha icone={IC_LINHA.local}>Q 8, Sobradinho, Brasília-DF</Linha>
          <Linha icone={IC_LINHA.tel}>(61) 3591-9495</Linha>
          <Chip f={f} ini={W(68) - 3} style={{right: 30, top: -34}}>Sem dono</Chip>
          <Chip f={f} ini={W(70) - 3} style={{right: 20, top: 250}}>Sem site</Chip>
        </div>
        {/* 7 x 36 */}
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 70, pointerEvents: 'none'}}>
          <div style={{textAlign: 'center', opacity: clamp(sete * 2), transform: `translateY(${(1 - sete) * 80}px)`}}>
            <div style={{fontFamily: FONTES.titulo, fontWeight: 300, fontSize: 330, lineHeight: 0.9, color: C.escuro}}>7</div>
            <div style={{fontFamily: FONTES.texto, fontSize: 34, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.roseEsc, marginTop: 56}}>avaliações no Google</div>
          </div>
          <div style={{width: 120, height: 2, background: C.linha, opacity: clamp(trinta * 2)}} />
          <div style={{textAlign: 'center', opacity: clamp(trinta * 2), transform: `translateY(${(1 - trinta) * 80}px)`}}>
            <div style={{fontFamily: FONTES.titulo, fontWeight: 300, fontStyle: 'italic', fontSize: 330, lineHeight: 0.9, color: C.roseEsc}}>36</div>
            <div style={{fontFamily: FONTES.texto, fontSize: 34, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.roseEsc, marginTop: 56}}>anos de clientes</div>
          </div>
        </div>
        <div style={{position: 'absolute', bottom: 40, width: '100%', textAlign: 'center', fontFamily: FONTES.texto, fontSize: 22, color: '#9aa0a6', opacity: numeros}}>Google Maps, outubro de 2026</div>
      </div>
    </AbsoluteFill>
  );
};

/** A ficha arrumada: endereço, fotos, horário e o link da loja online. */
export const FichaNova: React.FC<{f: number}> = ({f}) => {
  const ini = W(154) - 4;
  const ent = spring(f, ini, 0.22, 0.85);
  const fotos = spring(f, W(165) - 2, 0.26, 0.8);
  const vEnd = arrive(f, W(163) - 2, 0.16), vHora = arrive(f, W(167) - 2, 0.16), vSite = arrive(f, W(170) - 2, 0.16);
  const siteAtivo = f >= W(171);
  return (
    <AbsoluteFill style={{background: C.creme}}>
      <div style={{position: 'absolute', top: 110, width: '100%', textAlign: 'center'}}>
        <Titulo f={f} ini={ini + 2} tam={100} texto={'A ficha passa\na ser *de vocês.*'} />
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 470, borderRadius: 40, background: '#fff', boxShadow: '0 30px 80px rgba(60,40,30,.14)', overflow: 'hidden',
        transform: `translateY(${(1 - ent) * 1200}px)`, fontFamily: fonteG}}>
        <div style={{display: 'flex', gap: 6, height: fotos * 300, overflow: 'hidden'}}>
          {['img/loja-fachada-nova-clientes.webp', 'img/loja-interior-salao-sofa-curvo.webp', 'img/loja-sacolas-embalagens-marca.webp'].map((s, i) => (
            <Foto key={s} src={s} style={{flex: 1, height: 300, transform: `translateY(${(1 - clamp(spring(f, W(165) - 2 + i * 3, 0.3, 0.8))) * 300}px)`}} />
          ))}
        </div>
        <div style={{padding: '40px 50px 30px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <div style={{fontSize: 56, color: G.texto, fontWeight: 500}}>Luiza Rabelo</div>
            <svg viewBox="0 0 24 24" width="42" height="42" style={{opacity: arrive(f, ini + 14)}}><path d="M23 12l-2.4-2.8.3-3.7-3.6-.8-1.9-3.2L12 3 8.6 1.5 6.7 4.7l-3.6.8.3 3.7L1 12l2.4 2.8-.3 3.7 3.6.8 1.9 3.2L12 21l3.4 1.5 1.9-3.2 3.6-.8-.3-3.7z" fill={G.azul} /><path d="M7.5 12.3l3 3 6-6" stroke="#fff" strokeWidth="2.2" fill="none" /></svg>
          </div>
          <div style={{marginTop: 12, fontSize: 32, color: G.cinza, display: 'flex', alignItems: 'center', gap: 12}}>
            <span style={{color: G.texto}}>4,7</span><Estrelas tam={32} /><span>Loja de moda feminina</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-around', margin: '40px 0 26px'}}>
            <Botao rotulo="Rotas" icone={IC.rotas} />
            <Botao rotulo="Ligar" icone={IC.ligar} />
            <Botao rotulo="Salvar" icone={IC.salvar} />
            <Botao rotulo="Site" icone={IC.site} ativo={siteAtivo} style={{transform: `scale(${1 + 0.18 * spring(f, W(171), 0.4, 0.5) * (1 - clamp((f - W(171)) / 30))})`}} />
          </div>
          <Linha icone={IC_LINHA.local} vis={vEnd} ok>Quadra 8, Sobradinho, Brasília-DF</Linha>
          <Linha icone={IC_LINHA.hora} vis={vHora} ok>Seg a sex 9h às 18h · Sáb 9h às 14h</Linha>
          <Linha icone={IC_LINHA.site} vis={vSite} ok><span style={{color: G.azul}}>luiza-rabelo-df.vercel.app</span></Linha>
        </div>
      </div>
      <div style={{position: 'absolute', bottom: 70, width: '100%', textAlign: 'center'}}>
        <Rotulo f={f} ini={W(160)}>Perfil da empresa no Google</Rotulo>
      </div>
    </AbsoluteFill>
  );
};

/** Anúncio no Google para quem já procura. */
export const Anuncio: React.FC<{f: number}> = ({f}) => {
  const ini = W(195) - 4;
  const res = spring(f, W(200) - 2, 0.22, 0.85);
  const entrada = arrive(f, ini, 0.2);
  return (
    <AbsoluteFill style={{background: C.creme}}>
      <div style={{position: 'absolute', top: 110, width: '100%', textAlign: 'center'}}>
        <Titulo f={f} ini={ini + 2} tam={100} texto={'Anúncios para quem\n*já está procurando.*'} />
      </div>
      <div style={{position: 'absolute', left: 50, top: 450, width: 980, height: 1380, borderRadius: 48, background: '#fff', boxShadow: '0 30px 80px rgba(60,40,30,.12)',
        opacity: clamp(entrada * 2), transform: `translateY(${(1 - entrada) * 80}px)`, overflow: 'hidden', fontFamily: fonteG}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40, marginTop: 70}}>
          <Img src={staticFile('logos/wikimedia-google-2015.svg')} style={{width: 240}} />
          <Busca f={f} ini={ini + 6} fim={W(199)} texto="vestido de festa em Sobradinho" largura={860} />
        </div>
        <div style={{margin: '50px 60px 0', transform: `translateY(${(1 - res) * 500}px)`, opacity: clamp(res * 2)}}>
          <div style={{fontSize: 26, fontWeight: 600, color: G.texto}}>Patrocinado</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 20}}>
            <div style={{width: 56, height: 56, borderRadius: 28, background: C.escuro, color: C.nude, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTES.logo, fontSize: 22}}>LR</div>
            <div><div style={{fontSize: 28, color: G.texto}}>Luiza Rabelo</div><div style={{fontSize: 24, color: G.cinza}}>luiza-rabelo-df.vercel.app</div></div>
          </div>
          <div style={{fontSize: 42, color: '#1a0dab', marginTop: 18, lineHeight: 1.2}}>Luiza Rabelo · Moda feminina e semijoias em Sobradinho</div>
          <div style={{fontSize: 28, color: '#4d5156', marginTop: 12, lineHeight: 1.45}}>Vestidos, alfaiataria, jeans e semijoias. Escolha pelo site e receba pelo WhatsApp. Enviamos para todo o Brasil.</div>
          <div style={{display: 'flex', gap: 16, marginTop: 30}}>
            {['img/look-vestido-off-white-flores-terracota.webp', 'img/look-vestido-rose-um-ombro.webp', 'img/look-alfaiataria-colete-calca-bege.webp', 'img/look-vestido-tule-verde-agua.webp'].map((s, i) => (
              <Foto key={s} src={s} pos="center 25%" style={{width: 200, height: 260, borderRadius: 18, opacity: clamp(spring(f, W(203) + i * 3, 0.3, 0.8) * 2)}} />
            ))}
          </div>
        </div>
        <div style={{position: 'absolute', bottom: 30, width: '100%', textAlign: 'center', fontSize: 22, color: '#9aa0a6'}}>Exemplo de anúncio</div>
      </div>
    </AbsoluteFill>
  );
};
