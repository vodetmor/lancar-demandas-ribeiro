# Memória do projeto Lançar - Demandas

## Como trabalhar (pedido do Ribeiro, 16/10/2026)
- Mensagens vêm muitas vezes de transcrição de áudio e podem sair confusas: na dúvida, perguntar antes de agir (perguntas curtas, de uma palavra).
- Prioridade: organização, interpretação, perguntas. Pensar em manutenção, debug e atualizações: separar index.html em css/js; propor estrutura de aplicação quando fizer sentido.
- Gastar poucos tokens: modo enxuto. Threads só para trabalho real; respostas curtas; evitar pesquisa ou thread desnecessária. Pesquisa usa modelo Sonnet; trabalho (código, propostas) usa Opus.
- Planejamento e coordenação ficam NESTE projeto; o que importa fica em arquivos/repositórios (ESTADO.md, CLIENTE.md), não só no chat.
- PC do Ribeiro (atualizado 16/10): ele quer que eu USE o PC dele de vez em quando em vez de só a nuvem, para o que a nuvem bloqueia (Instagram/Maps, registro.br, twitter-cli, abrir sites da Vercel, vídeo pesado/Blender), via Remote Control. Não há acesso a "Cowork"; só as pastas do Remote Control.
- GitHub: o terminal do PC está logado como vodetmor, NÃO como rruandev. Repos da agência/clientes ficam em rruandev e são publicados pela nuvem (PRs em rruandev/medic-mais- já funcionam). Só usar o PC para GitHub se for conta vodetmor, e confirmar nome/visibilidade antes de criar repo.
- Vídeo é feito aqui, usando o conhecimento do repo do Vítor (3D no Blender, GLSL, Remotion, Hyperframes etc.; resumo em CONHECIMENTO-VIDEO.md).
- O Ribeiro é quem mais usa o projeto, mas outras pessoas também vão escrever: atribuir pelo nome de quem escreveu. Tom profissional.
- Papel de Claude: auxiliar a agência além de criar código (organização, comercial, pesquisa, cobrança, planejamento). Não gastar esforço em ajustes de cliente que ainda não fechou.
- Resumo semanal toda segunda 8h27 (rotina criada) e aviso diário 7h47 só se urgente.
- Notificações: só o coordenador notifica o usuário (threads não notificam).
- Design (16/10, Ribeiro irritado com cardápio v1): nada de degradê nem "AI slop"; interface simples e direta (cliente abre, vê pratos com foto, toca e pede); sem PIN/fricção desnecessária. Entregar app funcional, não estrutura.
- Desempenho (17/10): todo site publicado na Vercel deve passar pelo PageSpeed/Lighthouse (celular e PC) e ser otimizado até 90+ no celular antes de dar como pronto. Script em /mnt/project-files/interno/ferramentas/pagespeed/ (medir.mjs + sites.txt + README). Desempenho nunca pode custar design. Nuvem não abre *.vercel.app: usar PSI_KEY (chave da API PageSpeed, ainda não salva no ambiente) ou medir pasta local. Sites antigos da Vercel ficam fora: foco só nas demandas atuais (Ribeiro, 18/10). Meta é 90+ (celular fraco rodando liso); não perseguir 100 nem mexer no visual por nota de acessibilidade.
- REGRA (17/10): aumentar desempenho NUNCA pode custar design. Se 90+ exigir piorar o visual, manter o design e avisar o Ribeiro.
- O PC só fica conectado com o app do Claude aberto nele (Chrome sozinho não basta).

## Agência
- Faz tudo menos gravar vídeo: sites, landing pages, apps/SaaS, automação e robô de WhatsApp, CRM, marketing, edição de vídeo, roteiro, flyer, design.
- Vítor = criador do repo de edição de vídeo (github.com/vodetmor/edicao-de-video-claude-vodetmor); Ribeiro = dono deste projeto.
- Clientes quentes: MedicMais Sobradinho (site medicmais-sobradinho-site.vercel.app, repo rruandev/medic-mais-; proposta v2 + atendente WhatsApp em /mnt/project-files/clientes/medicmais/, aguarda aprovação de valores; só ajustar o site quando a clínica fechar), Luiza Rabelo DF (proposta + site em /mnt/project-files/clientes/luiza-rabelo/, site em luiza-rabelo-df.vercel.app), Central do Espeto (ver abaixo). Frio: Ótica Hora Certa (pesquisa em clientes/otica-hora-certa/).
- Docs: /mnt/project-files/arquitetura/ (PROPOSTA-ARQUITETURA, CONHECIMENTO-VIDEO, PESQUISA-LANDING-PAGES).
- Painel "Clientes do Ribeiro" (artefato claude.ai/artifact/5Linm5nE8UiFeRqNtfs8pt): clientes, cobranças, financeiro (ROI/ROAS), tarefas kanban.
- Instagram/Maps bloqueiam a nuvem; usar prints, fontes públicas ou o PC.

## Central do Espeto (EM PRODUÇÃO desde 20/10/2026)
- Cardápio real no app https://brasa-nobre.vercel.app (repo vodetmor/brasa-nobre, C:\dev\cardapio-saas). Mesa 1: /m/fv8STBGg (links NFC fixos). Painel /r/central-do-espeto/painel, cozinha /cozinha, atendimento /atendimento, QR /qrcodes. Impressora Elgin i8 80 mm no balcão via Chrome --kiosk-printing.
- Atendente WhatsApp: n8n + WAHA separados da MedicMais, no número real do dono (61) 99611-5754. PC do Ribeiro é o servidor temporário. NUNCA desconectar o número nem derrubar WAHA/n8n sem ele pedir. Mudanças no bot precisam de trava anti-loop e teste (20/10 o robô entrou em loop repetindo "Oi" e foi pausado). Simplificar visual do painel sem tirar funções.
- Pendente: preço da feijoada de sábado; horário/entrega/taxa/Pix do robô; fotos reais de Central/Sertanejo/Fit.

## PC do usuário
- Device VITOR-SAMSUNG via Remote Control. Pastas: C:\dev\cardapio-saas (padrão), landing-pages, Maquina de Editar, image-automation, iptvix, VSLplay; n8n em C:\dev\n8n-atendente. twitter-cli com credenciais no PC.
