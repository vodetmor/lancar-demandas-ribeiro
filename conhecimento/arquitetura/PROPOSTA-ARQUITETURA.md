# Proposta de arquitetura: colaboração agêntica da agência

Versão 0.1 para revisão · 16/10/2026 · nada foi implementado ainda.
Bases que acompanham este arquivo: `CONHECIMENTO-VIDEO.md` (tudo o que o repositório do Vítor ensina) e `PESQUISA-LANDING-PAGES.md` (primeira base de landing pages).

---

## 1. A ideia em uma frase

Você joga qualquer demanda no chat do projeto, do jeito que vier (áudio transcrito, print, link). O coordenador registra no painel, abre uma conversa (thread) só para ela com o especialista certo, e cada especialista trabalha com o método que deu o 10/10 no vídeo: referência, SPEC medida, quadros-chave aprovados, construção, crítica independente, entrega, lição guardada. O painel `ESTADO.md` e o `CALENDARIO.md` mostram a qualquer hora o que está ativo, em andamento, parado e entregue, por cliente.

O repositório do Vítor já resolveu o "como fazer bem" para vídeo. O que falta para virar agência é o "como organizar muitas demandas de muitos clientes ao mesmo tempo". É isso que esta proposta adiciona, sem jogar fora nada do que funciona.

## 1.1 O escopo que a arquitetura cobre

Pelo que você descreveu: a agência faz **tudo menos gravar**. SaaS e apps, automações e robôs conectados ao WhatsApp, CRM, sites e landing pages, design e flyers, roteiro e edição de vídeo, marketing. O cliente grava no celular; a gente roteiriza, edita e publica.

Demandas que já existem (entram no painel assim que você aprovar):

| Demanda | Área | O que preciso saber |
|---|---|---|
| Automação do WhatsApp para uma clínica (sem CRM) | Automação | Qual clínica (é a MedicMais?), qual número, o que o robô faz |
| CRM (para outro uso, "meio caminho andado") | Automação / SaaS | Para quem e onde está o que já foi feito |
| Proposta para Luiza Rabelo DF (@luizarabelodf), que já tem autoridade | Comercial | O Instagram bloqueia a nuvem; o diagnóstico da dor sai pelos reels públicos (yt-dlp) ou pelo navegador do PC |
| Comanda online: o pedido sai impresso no caixa do cliente | SaaS / App | Para qual cliente, que tipo de negócio, qual impressora |

## 1.2 Camadas de qualidade: especialista no cliente + especialista na área

Você pediu que cada agente seja especialista na dor de um cliente. Isso vira uma camada própria, separada do especialista de área:

1. **Especialista do cliente** (um por cliente): mantém `clientes/<cliente>/CLIENTE.md` com quem é, o público, a maior dor, o que já tentaram, o tom, a identidade, o que foi aprovado e rejeitado. Todo agente que trabalha para aquele cliente lê esse dossiê antes de começar e devolve para ele o que aprendeu.
2. **Especialista da área** (vídeo, site, automação, SaaS, design, comercial): sabe fazer bem, com a base de conhecimento da área.
3. **Crítico independente**: não construiu nada, julga contra a dor do cliente E contra a régua da área. Nota ≥ 8/10.
4. **Coordenador**: painel, prazos, nenhuma demanda esquecida.

Na prática, cada thread é "área × cliente": a thread de automação da MedicMais carrega o dossiê MedicMais e a base de automação. Assim o padrão de qualidade não depende de lembrar o contexto de cabeça.

## 2. Quem faz o quê

```
Você (chat do projeto)
   │  manda demandas, aprova quadros-chave, decide preço e prazo
   ▼
Coordenador ──── lê e atualiza ESTADO.md e CALENDARIO.md, faz a triagem,
   │             abre uma thread por demanda, cobra prazos, resume o dia
   │
   ├── Thread "Vídeo"          → método de edição (skills do repositório do Vítor)
   ├── Thread "Site / landing" → método adaptado para página
   ├── Thread "App / SaaS"     → branch + PR + preview, nunca direto na main (ex.: comanda online)
   ├── Thread "Automação"      → robôs de WhatsApp, CRM, integrações
   ├── Thread "Design"         → flyers, estáticos, identidade
   ├── Thread "Criativos/ads"  → regras de capa no quadro 0, série A/B
   ├── Thread "Presença local" → Google Meu Negócio, endereço igual em todo lugar
   ├── Thread "Conteúdo"       → roteiros semanais, calendário editorial
   └── Thread "Comercial"      → proposta, diagnóstico, preço
          │
          └── subagentes dentro da thread, quando ajuda:
                pesquisador de referências · crítico independente (nota ≥ 8)
                · renderizador em paralelo · revisor de texto e regras legais

Claude Code no seu PC  →  braço local (seção 6): X, Flow, imagens, contas logadas
```

Regras de convivência:
- **Uma demanda = uma thread.** Ajuste de uma entrega volta para a mesma thread, nunca abre outra.
- **O crítico nunca é quem construiu.** É um subagente novo que começa tentando reprovar.
- **Ninguém fala com o cliente em seu nome.** Mensagem para cliente sai como rascunho para você enviar.
- Tarefa simples (rodar um comando, mover arquivo) roda num modelo mais barato; criação e motion ficam no padrão. Regra que o Vítor já usa.

## 3. Pastas (na pasta compartilhada do projeto, com cópia no GitHub)

```
/mnt/project-files/
├── ESTADO.md               painel geral (gerado, seção 4)
├── CALENDARIO.md           prazos, entregas e rotinas
├── AGENCIA.md              quem somos, serviços, tabela de preços, equipe, tom de voz
├── COMO-TRABALHAMOS.md     regras de colaboração (base: COMO-TRABALHAR-COM-O-VITOR)
├── conhecimento/
│   ├── video/              método, DESIGN-SYSTEM, LICOES-MOTION, skills, motor (vem do repo do Vítor)
│   ├── landing-pages/      LICOES-LANDING.md, checklist, referências medidas
│   ├── apps-saas/          fluxo de branch/PR, stack padrão, checklist de lançamento
│   ├── automacao/          WhatsApp (API oficial x não oficial, riscos de bloqueio), CRM, integrações
│   ├── design/             flyers e estáticos (código + gerador de imagem), régua de gosto
│   ├── marketing/          criativos, copy, biblioteca de anúncios escalados
│   ├── presenca-local/     Google Meu Negócio, avaliações, regras CFM/CFO
│   ├── conteudo/           roteiros, calendário editorial, regras de post
│   └── comercial/          modelo de proposta e de diagnóstico (base: proposta MedicMais)
├── clientes/
│   └── medicmais-sobradinho/
│       ├── CLIENTE.md      ficha: contato, plano contratado, identidade, acessos (sem senhas), regras
│       ├── identidade/     tema.json, logos oficiais, fontes
│       └── demandas/
│           └── 2026-10-site-no-dominio/
│               ├── ESTADO.md   status, próximo passo, comandos para refazer
│               └── trabalho/   fonte, brutos, renders
├── interno/                marca e portfólio da própria agência, prospecção
├── ferramentas/            busca.py, scripts reaproveitáveis
└── backup/                 sincronizar.py adaptado para o repositório da agência
```

Por que assim: o repositório do Vítor provou que `ESTADO.md` por obra salva o trabalho dos reinícios (a nuvem apaga tudo fora desta pasta) e que separar cliente de pessoal evita mistura. Aqui só subo um nível: cliente → demanda.

## 4. O painel `ESTADO.md` e o calendário

Cada demanda tem o próprio `ESTADO.md` com um cabeçalho fixo:

```yaml
cliente: medicmais-sobradinho
demanda: Site novo no domínio próprio
area: site
status: em-andamento      # entrada | em-andamento | aprovacao | ajustes | aguardando-cliente | entregue | parada
prazo: 2026-10-31
thread: <link da conversa>
proximo: Comprar o domínio no nome da clínica
```

Um script pequeno (`painel.py`) junta todos esses cabeçalhos e gera o `ESTADO.md` da raiz. Assim duas threads nunca brigam pelo mesmo arquivo: cada uma só escreve no estado da sua demanda, e o painel é refeito.

Exemplo de como o painel ficaria hoje:

| Cliente | Demanda | Área | Status | Prazo | Próximo passo |
|---|---|---|---|---|---|
| MedicMais | Aprovação da proposta | Comercial | aguardando-cliente | ~30/10 (validade de 15 dias) | Saber o plano escolhido |
| MedicMais | Site no domínio + GMN completo | Site / Presença | entrada | mês 1 | Depende da aprovação |
| MedicMais | CRM no WhatsApp | Organização | entrada | mês 1 | Depende da aprovação |
| MedicMais | Saúde Day de novembro | Conteúdo / Vídeo | entrada | 14/11 (2º sábado) | Página + vídeo convite |

Seções fixas do painel: **Ativas** (em andamento e aprovação), **Esperando alguém** (cliente ou você, com o quê), **Na fila** (entrada), **Entregues nos últimos 14 dias**, **Paradas**.

`CALENDARIO.md` guarda prazos, reuniões e datas fixas (Saúde Day, renovação de domínio, fim de contrato mínimo). Como o Google Agenda está conectado a este projeto, o coordenador pode espelhar os prazos numa agenda sua. Proposta de rotinas automáticas:
- **Todo dia de manhã:** resumo de 5 linhas no chat do projeto (o que vence hoje, o que espera você).
- **Segunda-feira:** revisão da semana e o que cada cliente recebe.
- **Dia 1 de cada mês:** relatório por cliente (para MedicMais, os números do Google e do Instagram do plano de 90 dias).

## 5. Como uma demanda anda

1. **Você manda** do jeito que vier. Eu corrijo erros de transcrição em silêncio ("Magic Mais" = MedicMais) e nunca devolvo suas ideias em lista.
2. **Triagem** (coordenador): cliente, área, prazo, prioridade. Se faltar algo, decido pelo padrão e digo qual escolhi; só pergunto o que muda o resultado.
3. **Thread aberta** com o especialista, que lê `CLIENTE.md`, a base da área e o `ESTADO.md` da demanda.
4. **Referências + SPEC + plano.**
5. **Portão de aprovação**: quadros-chave (vídeo) ou prints das seções no celular e no computador (site/app). Documento curto: imagem e uma linha de ideia.
6. **Construção → crítica independente ≥ 8/10 → entrega** (sempre versão de celular junto, pacotes em .zip).
7. **Fechamento:** lição na base da área, `ESTADO.md` atualizado, backup no GitHub, thread resolvida.

## 6. Onde o Claude Code no seu computador é necessário

Resposta curta: **sim, vale ter**, mas como braço local, não como lugar principal do trabalho. A nuvem renderiza vídeo, constrói site e faz pesquisa sem depender do PC ligado. O PC entra quando a tarefa precisa de algo que só existe nele.

| Tarefa | Onde roda | Por quê |
|---|---|---|
| Busca no X (twitter-cli) | **PC** | O X recusa login vindo da nuvem; os cookies estão no seu Windows em `setx`. Regra: só leitura. A ferramenta também posta, curte e segue, e isso fica proibido sem você pedir |
| Pinterest | **Nuvem** | `pinterest-mcp-server` funciona aqui sem token (testado em 13/10). Também dá para instalar no Claude Code do PC: `claude mcp add pinterest -- npx pinterest-mcp-server` |
| Google Flow (clipes de IA) e GPT/Gemini (imagens) | **PC** | Automação em `C:\flow-automation` e `C:\image-automation`, com as suas contas logadas |
| Edição de vídeo e render | **Nuvem** (padrão) | O motor Remotion roda em CPU aqui; o PC não tem placa NVIDIA, então não renderiza mais rápido |
| Vídeo bruto pesado do cliente | **PC → nuvem** | Arquivos grandes do celular do cliente ou do OneDrive sobem pela pasta do PC |
| Contas logadas (GMN do cliente, Instagram, Meta Ads) | **PC**, pelo navegador | Ver dados sem guardar senha. Só leitura até você liberar mais |
| Site, landing e app | **Nuvem + GitHub + Vercel** | Branch, PR e preview funcionam daqui |
| Teste de app no celular | **PC ou celular** | Depende da stack (pergunta 9) |

Dois modos de acesso ao PC: **pasta** (eu leio e gravo arquivos numa pasta que você liberar) e **Remote Control** (Claude Code rodando no PC, com seus programas e contas). A pasta resolve arquivos; o Remote Control resolve X, Flow e navegador logado.

## 7. Conectores e acessos

Já conectados a este projeto: GitHub, Google Agenda, Gmail, Claude Docs, Adobe e Higgsfield (gera imagem, vídeo, site e anúncio, mas consome créditos pagos). O Canva está com o login vencido.

A herdar do projeto do Vítor (cada chave reenviada uma vez e guardada num `.env`, nunca no Git nem na memória): Apify (biblioteca de anúncios), Pexels, Freesound, Jamendo, ElevenLabs.

Nunca: senha principal, cartão, conta de anúncio com permissão de gastar, postar em nome de alguém.

## 8. O que muda em relação ao repositório do Vítor

- **Mantém igual:** método 10/10, régua de gosto, DESIGN-SYSTEM, LICOES-MOTION, motor, skills, regra de ajuste sem refazer, `ESTADO.md` por obra, backup contínuo.
- **Muda:** o repositório do Vítor continua dele (perfil pessoal, aulas). A agência ganha um repositório próprio, e a parte de vídeo entra como base (cópia sincronizada, ou submódulo se você preferir manter um só lugar).
- **Novo:** bases de landing page, app, marketing, presença local, conteúdo e comercial, que começam pequenas e crescem a cada entrega, do mesmo jeito que o LICOES-MOTION cresceu.

## 9. MedicMais: próximos passos que já dá para adiantar

1. Saber se a proposta foi aprovada e qual plano (a validade de 15 dias vence por volta de 30/10).
2. Se aprovado, o mês 1 vira 6 demandas no painel: site no domínio, GMN completo, endereço igual em todo lugar, orientação do CNPJ, CRM no WhatsApp, primeiro lote de roteiros.
3. Saúde Day de 14/11 (2º sábado): página no site com inscrição pelo WhatsApp e vídeo convite. Dá para começar o roteiro antes da aprovação, como amostra.
4. Material que eu preciso: quem tem acesso ao Google Meu Negócio, ao Instagram e à conta da Vercel/GitHub onde o site novo está.

## 10. Perguntas essenciais

Cada uma tem a minha recomendação; se você concordar com todas, basta responder "ok nas recomendações" e me dizer só as informações.

**Sobre a agência**
1. Qual é o nome da agência e quem está nela? Pelo que li, o Vítor criou o repositório e cuida da edição; preciso saber quem aprova o quê e quem fala com o cliente. *(Recomendo: um aprovador por área, e você como dono do painel.)*
2. Os preços da proposta MedicMais viram a tabela padrão da agência? *(Recomendo: sim, como ponto de partida em `AGENCIA.md`.)*
3. Vocês gerenciam tráfego pago (Meta/Google Ads) ou só entregam o criativo?

**Sobre os clientes e as demandas de agora**
4. A automação de WhatsApp é para qual clínica? E o CRM "meio caminho andado" é de quem e onde está o que já existe?
4b. A comanda online é para qual cliente e que tipo de negócio (restaurante, lanchonete)? Qual impressora fica no caixa?
4c. Luiza Rabelo DF: o que ela vende e como vocês chegaram nela? *(Recomendo: eu monto o diagnóstico da dor pelo Instagram e site dela antes de qualquer proposta, no mesmo formato da MedicMais.)*
4d. VSL Play e Rei da VSL (Deidson) são clientes da agência ou trabalho pessoal do Vítor? *(Recomendo: só entra no painel quem é da agência.)*
5. A MedicMais aprovou a proposta? Qual plano?
6. Quem tem os acessos da MedicMais (Google Meu Negócio, Instagram, domínio, Vercel/GitHub do site)?

**Sobre a operação**
7. Repositório: crio um repositório novo para a agência? *(Recomendo: sim, privado, e o do Vítor vira base de vídeo.)*
8. Agenda: espelho os prazos no Google Agenda conectado? Em qual agenda? *(Recomendo: uma agenda separada "Agência".)*
9. App: que tipo de app vocês querem fazer (web app, app de celular)? Já tem pedido concreto?
10. Qual computador roda o Claude Code (o do Vítor ou o seu)? É nele que estão os cookies do twitter-cli?
11. Ferramentas pagas: tem orçamento mensal? O Higgsfield conectado aqui tem créditos?
12. Quanto você quer ouvir de mim no chat do projeto: resumo diário, só marcos, ou só quando precisar de você? *(Recomendo: resumo diário curto + aviso quando algo depender de você.)*
