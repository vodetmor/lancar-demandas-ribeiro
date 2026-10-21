# Conhecimento de edição de vídeo (extraído do repositório do Vítor)

Fonte: `github.com/vodetmor/edicao-de-video-claude-vodetmor` (clonado em 16/10/2026, 3.549 arquivos, 3,4 GB). Este arquivo é o resumo operacional. A fonte da verdade continua no repositório: quando um detalhe importar, abrir o arquivo citado.

## 1. O que existe no repositório

| Pasta | O que é | Quando abrir |
|---|---|---|
| `CLAUDE.md` | Índice e "cérebro" do projeto de vídeo | Antes de qualquer trabalho de vídeo |
| `COMO-TRABALHAR-COM-O-VITOR.md` | Como o Vítor fala, aprova e quer as entregas | Primeira conversa com ele |
| `organizacao/MODELO-DE-PENSAMENTO.md` | Claude como pesquisador, intérprete, crítico e orientador | Toda demanda nova ou crítica vaga |
| `motion-base/DESIGN-SYSTEM.md` | Regras numéricas de gosto, legenda, tipografia, motion, áudio e portões G1 a G6 | Antes de editar |
| `motion-base/LICOES-MOTION.md` | 440 linhas de lições, uma por vídeo feito | Seções relevantes antes de cada peça |
| `motion-base/TEMPLATE-BRIEF.md` | Esqueleto de brief com números (em inglês, texto de tela em português) | Ao planejar |
| `estudio/motor/` | Motor próprio: Remotion + spec JSON com eventos presos à palavra falada + blocos + variações em lote | Criativos e variações |
| `.claude/skills/` | 12 skills (método, motor, pesquisa, Remotion, design, Manim, animate, extract-ds) | Carregam sozinhas no Claude Code |
| `ferramentas/busca/busca.py` | Busca material real grátis (Pexels, Wikimedia, Archive, SFX) com registro de licença | B-roll |
| `motion-base/fontes/` | X/Twitter (xler.py, prompts, artigos), Pinterest, HyperFrames, Chase AI | Referências |
| `motion-base/logos/`, `musica/` | Logos reais em SVG e banco de músicas com catálogo por clima | Toda peça |
| `memoria/` | 50 fatos e feedbacks com data | Lembrar uma decisão |
| `clientes/` | VSL Play, Rei da VSL, MedicMais Sobradinho | Retomar trabalho de cliente |
| `pc/COMO-USAR-flow.txt` | Automação do Google Flow no PC (`C:\flow-automation`) | Gerar clipes de IA |
| `backup/sincronizar.py` | Salva tudo no GitHub, procura segredos antes | Depois de cada entrega |

## 2. O método que deu o 10/10

O anúncio narrado VSL Play v6 recebeu 10/10 ("incrível"). O que deu a nota foi o processo, não um estilo:

1. **Referências primeiro, buscadas por conta própria** (X pelo PC, web, Pinterest, Apify na biblioteca de anúncios). As do cliente entram por cima. Subir a régua além do pedido.
2. **SPEC medida com código**: cortes por segundo, curvas, durações, cores, tamanhos de fonte, loudness. "A olho" não vale.
3. **Plano com todos os parâmetros** (brief do `TEMPLATE-BRIEF.md`).
4. **Portão de aprovação**: storytelling + quadros-chave (stills de cada momento) aprovados antes do vídeo completo. Documento de aprovação curto: capa, uma página por vídeo com quadros e uma linha de ideia, uma página de som, lista do que aprovar.
5. **Motion → som → crítica independente** (uma sessão nova que não construiu o vídeo, começando por reprovar; só sai com nota ≥ 8/10) → render.
6. **Toda lição vai na hora para a biblioteca** e para o `ESTADO.md` da obra. Nada fica só no chat.
7. **Ajuste nunca refaz do zero**: mexe na fonte, renderiza só o que mudou, não toca no que foi elogiado.

## 3. Régua de gosto (vale para vídeo, site e estático)

- Proibido ("AI slop"): degradê decorativo, brilho de fundo, vidro, azul+roxo genérico, glow em texto, tudo entrando com fade, mais de um foco por quadro, logo redesenhado, UI falsa, dado inventado, travessão e emoji na tela, legenda estilo TikTok, partículas e glitch, IA fingindo foto de arquivo.
- Direção Apple como disciplina: contenção, um foco, tipografia precisa (Inter), ícones Phosphor, squircles, movimento com física.
- **Marca citada = marca na tela** (logo real do Google, Instagram, WhatsApp). Interação física real ganha o som real (o "tim" do NFC).
- Precedência: palavra explícita do dono > identidade do cliente > DESIGN-SYSTEM > lições > skills.
- Identidade extraída do site do cliente passa por filtro: cor chapada fica, degradê vira a cor dominante, glow sai.

## 4. Números que viram regra

**Motion (30 fps):** chega rápido e pousa suave (cada quadro anda 12 a 19% da distância restante); nada congela mais de 8 quadros (push-in lento de ~0,25% por quadro, ou 1,00 → 1,04 por cena); movimento ≥ 9 quadros, grandes 15 a 23; stagger 2 a 4 quadros; texto parado ≥ 8 quadros antes de se mexer; cortes no tempo forte ou 2 quadros antes; nunca escala de 0 (começar em 0,92 a 0,97).

**Legenda:** Inter 500, ~50 px em 1080p, base a 87% da altura, até 2 linhas de 42 caracteres, ≤ 17 caracteres/s, sem caixa e sem karaokê. Nunca cobre rosto.

**Áudio:** voz na frente; música 18 a 22 LU abaixo da voz em peça institucional (em vídeo pessoal com rosto ela precisa ser ouvida: ~8 LU); ducking guiado pela transcrição (começa 250 ms antes, solta 400 ms depois, adiantar ~100 ms); efeitos nos respiros e no quadro exato da ação, abaixados 9 dB sob a voz; música e efeitos no tempo original mesmo se a imagem desacelerar; master −14 LUFS, pico ≤ −1 dBTP.

**Ritmo:** troca visual a cada 3 a 8 s em vídeo falado; gancho nos primeiros 10 s; silêncio de 0,3 a 0,6 s antes do maior impacto; fechamento volta ao motivo da abertura.

## 5. Criativo de anúncio x vídeo institucional x pitch

| Tipo | Regras próprias |
|---|---|
| **Criativo de tráfego** | Quadro 0 = capa completa e legível (o Gerenciador usa como miniatura; cada criativo da série com capa distinta). Começa no meio da ação, logo só no CTA. Uma ideia por cena, texto na tela o tempo de ler duas vezes. Gancho de 3 s = um objeto forte. Fala direta: silêncios encurtados para ~0,18 s, pausa de 0,25 a 0,35 s só onde o lead precisa olhar. Cada frase vira uma metáfora literal e um tipo de cena diferente. Vertical 9:16 primeiro, conteúdo entre ~130 e ~1650 px de altura. |
| **Institucional / página de vendas** | Pode ser mais longo e cinematográfico (o v6 10/10 é desse tipo). |
| **Pitch 1 a 1 (vender ao dono)** | O gancho é a personalização: quadro 0 = o site DELE no celular. Material real do cliente (reels públicos via yt-dlp) vale mais que qualquer B-roll. Dado de mercado só com fonte na tela. |
| **Aula / conteúdo pessoal** | Loop (primeiro quadro = último), pílula "Seguir" no meio, roteiro com viradas faladas entre atos, descrição longa com no máximo 5 hashtags. |

## 6. Ferramentas e onde rodam

| Ferramenta | Roda onde | Observação |
|---|---|---|
| Remotion (motor) | Nuvem (CPU) | `--gl=angle` para 3D/GLSL; `@remotion/three` na mesma versão do Remotion; renderizar mudo e fazer o mux no ffmpeg |
| three.js / Blender (`pip install bpy`) / Manim / GLSL | Nuvem | Blender ~25 a 60 s por quadro em CPU: só trechos curtos |
| ElevenLabs (voz final "Ana Dias") | Site, pelo Vítor | Plano grátis bloqueia vozes BR pela API. Scribe transcreve por palavra |
| edge-tts | Nuvem | Só voz provisória (animática); rejeitada para entrega |
| Whisper / faster-whisper | Nuvem | Alucina em ruído: conferir palavra a palavra |
| Google Flow | PC (`C:\flow-automation`) | Várias contas grátis, 720p; Claude escreve os prompts |
| Automação de imagens GPT/Gemini | PC (`C:\image-automation`) | Estáticos com foto/material; logo e botão entram depois por código |
| twitter-cli | PC (cookies em `setx`) | Nuvem é bloqueada pelo X. Só leitura |
| Pinterest (`pinterest-mcp-server`) | Nuvem, sem token | Testado em 13/10; ~8 a 12 pins por busca |
| Apify (biblioteca de anúncios Meta/TikTok) | Nuvem | Token grátis, precisa ser reenviado num `.env` |
| busca.py (Pexels, Freesound, Jamendo) | Nuvem | Chaves em `.env` local, nunca no Git |
| Playwright + Chromium | Nuvem | Prints de site celular/desktop, quadros-chave em HTML, PDF de aprovação |

## 7. Caso MedicMais Sobradinho (o cliente que já temos)

- Clínica médica e odontológica em Sobradinho-DF. Identidade: vermelho `#EB2026`, tinta `#121216`, Poppins 800, "+" em squircle. Site novo pronto em `medicmais-sobradinho-site.vercel.app`.
- Já entregue: vídeo de venda do site (v1, 88 s), site + Google Meu Negócio com plaquinha NFC em 3D (v2, 148 s), e v3 = v2 + vídeo da proposta emendado (313 s, master + versão de celular). Tudo em `clientes/medicmais-sobradinho/`.
- Proposta de 14 páginas (`proposta/Proposta-MedicMais-Sobradinho.pdf`), outubro de 2026, válida por 15 dias:
  - Diagnóstico: sem site oficial; site antigo no ar com endereço e telefone velhos; GMN pela metade; CEP diferente em cada lugar; link de agendar da bio quebrado; vídeos sem padrão; **CNPJ "Inapto" na Receita** (omissão de declarações).
  - Implantação única R$ 1.790 (site R$ 997 + CRM R$ 697 + organização R$ 497, de R$ 2.191), em até 3x.
  - Planos mensais: Presença R$ 497 ou **Presença + Vídeos R$ 859 (recomendado)**, mínimo 6 meses, até 8 vídeos/mês, extra R$ 70. A clínica grava no celular, nós editamos.
  - Plano de 90 dias: mês 1 arrumar a casa, mês 2 ganhar ritmo, mês 3 medir e ajustar. Saúde Day no 2º sábado do mês, 9h às 13h.
- Cuidado: a cena com CNPJ e "INAPTA" pode ir ao dono, nunca ao público.
