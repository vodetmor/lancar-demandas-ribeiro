# Como trabalhamos

Tudo o que o Ribeiro já pediu, corrigiu ou aprovou, escrito como regra. Quando uma regra nova aparecer, entra aqui com a data.

## 1. A agência
- Faz tudo menos gravar: sites e landing pages, apps e SaaS, robô e automação de WhatsApp, CRM, marketing, roteiro e edição de vídeo, flyer e design. O cliente grava no celular; a gente roteiriza, edita e publica.
- Claude não é só programador: ajuda em organização, comercial, pesquisa, cobrança e planejamento.
- Não gastar esforço em ajuste de cliente que ainda não fechou.
- Pessoas: Ribeiro (dono do projeto, quem mais usa), Vítor (criador do repositório de edição de vídeo e da conta vodetmor). Outras pessoas podem escrever: atribuir sempre pelo nome de quem escreveu.

## 2. Comunicação com o Ribeiro
- Mensagens vêm muitas vezes de áudio transcrito e podem sair confusas. Na dúvida, perguntar antes de agir, com perguntas curtas.
- Respostas curtas e diretas. Modo enxuto: poucos tokens, sem pesquisa ou thread desnecessária.
- Só o coordenador notifica o Ribeiro (no chat do projeto). Threads não notificam. Urgência vai pelo coordenador; o que não é urgente fica quieto.
- Rotinas: resumo semanal na segunda às 8h27; aviso diário às 7h47 só se houver algo urgente (entrega ou cobrança vencendo).

## 3. Mensagens para clientes (WhatsApp)
- Quem assina é "Ruan" ("Aqui é o Ruan").
- Tom humano e casual, 2 a 3 blocos curtos no máximo. Sem emoji.
- Proposta para prospect pode ir sem a página de preços.
- Placa de avaliação é o modelo padrão (Google azul), nunca "nas cores da marca".

## 4. Design (crítica → regra)
| Crítica do Ribeiro | Regra |
|---|---|
| "Horrível", "AI slop", "sem degradê" (16/10) | Sem degradê, sem emoji como ícone, sem fonte padrão (Inter/Roboto/Arial), sem grade de cards iguais. |
| "Não está fácil de entender" (16/10) | Interface simples: o cliente abre, vê o prato com foto, toca e pede. Nada além disso na tela principal. |
| "Ainda pede PIN, sem necessidade" (16/10) | Sem PIN ou fricção por padrão. Liga só quando o cliente pedir. |
| "Não me entregou um aplicativo" (16/10) | Entregar coisa que funciona, não estrutura. Testar em 390 px do começo ao fim e mandar print. |
| Sites v1 e v2 da Luiza "poluídos" (16/10) | Luxo é menos informação. Referência: Vivara, Toteme, Sézane. |
| Restaurante real com preço inventado | Demonstração usa negócio fictício. Cliente real só com dados reais dele. |
| Fotos de IA/Google nos pratos (21/10) | Prato só com foto real. Sem foto real, mostra só a inicial. Capa pode ser outra coisa. |
| Painel complicado | Simplificar o visual sem tirar funções. |

Antes de entregar qualquer tela: abrir no celular (390 px), fazer o fluxo inteiro, comparar com as referências do cliente, conferir as regras acima e mandar print.

## 5. Desempenho
- Todo site publicado passa pelo PageSpeed (celular e PC) e só fica pronto com **90+ no celular**. Ferramenta: `ferramentas/pagespeed/`.
- **Desempenho nunca pode custar design.** Se 90 exigir piorar o visual, manter o design e avisar o Ribeiro.
- Não perseguir 100, nem mexer no visual por nota de acessibilidade.
- Foco só nas demandas atuais; sites antigos ficam fora.

## 6. Organização e código
- Planejamento e coordenação ficam no projeto do Claude; o que importa fica em arquivo (ESTADO.md por cliente, este repositório), não só no chat.
- Pensar em manutenção: separar HTML, CSS e JS; propor estrutura de aplicação quando fizer sentido.
- Pesquisa usa modelo mais leve (Sonnet); código e propostas usam o mais forte (Opus).
- Antes de mexer em visual de um produto, ler as lições dele (ex.: `conhecimento/cardapio-saas/LICOES.md`).

## 7. Contas e onde cada coisa roda
- **GitHub:** `rruandev` = repositórios da agência publicados pela nuvem. `vodetmor` = conta logada no PC (repos brasa-nobre, luiza-rabelo-site). Confirmar nome e visibilidade antes de criar repositório.
- **Vercel:** os apps no ar estão na conta do PC (time do Vítor). A nuvem não abre `*.vercel.app`: conferir pelo PC.
- **PC do Ribeiro (VITOR-SAMSUNG):** usado pelo Remote Control para o que a nuvem bloqueia (Instagram, Google Maps, registro.br, Pexels, Higgsfield CDN, vídeo pesado/Blender). Só fica conectado com o app do Claude aberto. Pastas: `C:\dev\cardapio-saas`, `C:\dev\landing-pages`, `C:\dev\n8n-atendente` e outras.
- **Produção hoje no PC:** n8n + WAHA da Central do Espeto. Nunca desconectar o número nem derrubar WAHA/n8n sem o Ribeiro pedir.
- Push na main de produção exige mensagem escrita do Ribeiro (reação não vale).
- Segredos: nunca no chat, nunca em repositório. Chave que passou pelo chat deve ser trocada.

## 8. Colaboração com os agentes (como o projeto funciona)
- **Coordenador:** conversa com o Ribeiro no chat do projeto, registra a demanda e abre uma thread por trabalho.
- **Thread:** um trabalho real, com checklist visível. Termina com entrega e resumo curto.
- **Remote Control:** sessão que roda no PC; só recebe mensagem do usuário. Para passar contexto, iniciar com instruções. Não duplicar na nuvem o que ela faz.
- **Memória do projeto:** fatos duradouros (uma pasta, um arquivo por assunto). Cópia em `memoria/`.
- **Pasta compartilhada:** `/mnt/project-files/` (clientes/, arquitetura/, interno/, rascunhos/).
- **Método de qualidade** (herdado do repositório de vídeo do Vítor): referência → SPEC medida → quadros-chave aprovados → construção → crítica independente (nota ≥ 8/10) → entrega → lição guardada. Detalhe em `conhecimento/arquitetura/PROPOSTA-ARQUITETURA.md`.

## 9. Robôs de WhatsApp
- Toda mudança no bot precisa de trava anti-loop e teste antes de ir ao ar (20/10 o robô da Central entrou em loop repetindo "Oi" e foi pausado).
- Produção de cliente deve ir para API oficial no número e conta do próprio cliente quando possível. A conta Meta do Ribeiro está restrita.
- Stack que já funciona: n8n + WAHA (ou Evolution API) + IA barata (z.ai/GLM) + painel na Vercel + banco Postgres. Detalhe em `memoria/atendente-whatsapp-demo.md`.
- Checklist completo do que o próximo robô já tem que nascer com: `conhecimento/whatsapp/APRENDIZADOS-ROBO-WHATSAPP.md` (esperar mensagens picadas, ignorar duplicadas, limite de rajada, nunca falar com outro robô, preço calculado pelo sistema, mídia só depois de decidir responder, 8 passos por resposta, uma mensagem curta por vez, confirmar uma vez só).
- Cada cliente com WAHA e n8n próprios. Testar numa cópia que não envia nada.

## 10. Produção (o que já quebrou)
- Nunca subir `SEED_VERSION` nem recriar a demo de um cliente em produção: o reseed de 20/10 apagou conversas e pedidos. Mudança de cardápio vai pelo painel ou pela API.
- Banco na nuvem cai às vezes (ECONNRESET): toda gravação precisa de nova tentativa.
- O modo automático do PC só aceita autorização para gravar em produção escrita pelo Ribeiro no próprio thread.

## 11. Vídeo
- Método do repositório do Vítor (`conhecimento/video/CONHECIMENTO-VIDEO.md`). Projeto modelo completo: `conhecimento/video/projeto-luiza-rabelo/` (Remotion + three, 16 cenas sincronizadas com a voz palavra por palavra).
- Voz: Ribeiro gera no ElevenLabs (voz Ana Dias, Multilingual v2) a partir do roteiro; Claude faz o resto.
- Pegadinhas: o mp4 do Remotion já vem com áudio mudo, então ao juntar a trilha usar `-map 0:v -map 1:a` (a primeira entrega saiu sem som); textura do three carregada depois do primeiro quadro fica preta se o canvas não for invalidado; imagem acima de 8192 px é reduzida, cortar prints longos; alinhamento só por silêncio erra pausas, conferir à mão (`pausas-manual.txt`).
- Celular nos vídeos: componente iPhone 3D próprio (sem logo da Apple), em `conhecimento/video/componentes/iphone-3d/`.

## 12. Limitações da nuvem e como contornar
- A nuvem não abre `*.vercel.app`, Instagram, Google Maps, Pexels, HuggingFace (Whisper), CDN da Higgsfield. Usar o PC pelo Remote Control.
- Transcrever áudio do Ribeiro: copiar para a pasta do projeto, enviar ao PC e rodar faster-whisper lá (`C:\dev\_whisper`).
- No PC, a pasta `Maquina de Editar\Backup-GitHub` é só espelho: nunca dar push dela.

## 13. Comercial
- Toda proposta nova parte da tabela única (`conhecimento/comercial/PRECOS-E-CUSTOS.md`). Pacote = 20% de desconto.
- Proposta é HTML renderizado em PDF 960×540 (Chromium). Modelos em `clientes/*/propostas/`.
- Contrato de atendente: modelo em `clientes/medicmais/contrato/` (revisão de advogado recomendada).
