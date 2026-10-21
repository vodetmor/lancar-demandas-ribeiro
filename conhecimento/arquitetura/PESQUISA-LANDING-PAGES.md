# Landing pages: o que a pesquisa diz e como vamos trabalhar

Primeira versão da base de conhecimento de landing pages (16/10/2026). Vira `conhecimento/landing-pages/` quando a arquitetura for aprovada. Números de terceiros estão marcados com a fonte; quase todos vêm de empresas que vendem serviço de conversão, então servem como ordem de grandeza, não como promessa ao cliente.

## 1. Números que mudam decisão

| Tema | Número | Fonte |
|---|---|---|
| Conversão mediana de landing page | ~4,0% a 4,6% | LanderLab 2026; Visionary 2026 |
| Saúde | 3,6% (LanderLab); "saúde e bem-estar" 7,2% (Visionary) | idem |
| Tráfego no celular | ~83% das visitas | LanderLab |
| Celular converte menos | 3,8% contra 6,4% no computador (gap de 40%) | Visionary |
| Velocidade | LCP < 1,5 s converte 6,9%; > 4,5 s converte 2,7%; cada 1 s a menos ≈ +8% | Visionary |
| Metas do Google (Core Web Vitals) | LCP < 2,5 s (mirar 1,5 s no celular), INP < 200 ms, CLS < 0,1 | LanderLab / Google |
| Formulário | 3 campos ≈ 10% de conversão; 9 campos ≈ 3,6% | LanderLab |
| Prova social | nota e número de avaliações perto do título, acima da dobra | LanderLab; Visionary |
| Vídeo na página | associado a mais conversão (+86% citado) | LanderLab |
| Texto | título com menos de 8 palavras; frases até 15 a 20 palavras; linguagem simples converte ~2x mais | LanderLab |
| CTA | página curta: um CTA acima da dobra; página longa: CTA repetido; botão ≥ 48 × 48 px | LanderLab |
| Página por campanha | página própria por anúncio, com a mesma promessa do anúncio (message match) | Visionary; LanderLab |

## 2. O que isso significa para nossos clientes (negócio local, público 50+)

O caso MedicMais é o modelo: quem procura "dentista perto de mim" chega pelo celular, decide pela nota do Google e quer falar no WhatsApp. Então a página padrão de negócio local é:

1. **Primeira dobra no celular:** título com o que a pessoa procura e onde ("Dentista em Sobradinho"), nota do Google com número de avaliações, foto real da fachada ou da equipe, botão de WhatsApp com mensagem pronta.
2. **Serviços como atalhos** (implante, exames, clínico, avaliação gratuita), cada um levando ao WhatsApp com a mensagem daquele serviço.
3. **Prova:** depoimentos reais (vídeo curto com legenda grande), fotos reais, Saúde Day.
4. **Como chegar:** mapa, horário com "aberto agora", endereço IGUAL ao do Google e do Instagram.
5. **CTA repetido** e barra fixa de WhatsApp no celular.
6. **Acessibilidade para 50, 60, 70 anos:** letra grande, contraste alto, botões grandes (a MedicMais já foi assim).

Formulário quase nunca: para negócio local, o WhatsApp é o formulário. Medir os cliques nele (evento no Google Analytics/Tag Manager) é o que prova resultado no relatório do mês 3.

## 3. Presença local (Google Meu Negócio) anda junto com a página

- A **categoria principal** do perfil é o fator individual mais forte; categorias secundárias cobrem os outros serviços (StoreRocket, estimativa da indústria).
- **Nome, endereço e telefone idênticos** no Google, site, Instagram e Facebook. O CEP diferente da MedicMais é exatamente esse problema.
- Avaliações em fluxo constante e todas respondidas em 24 a 48 h. **Proibido "filtrar" avaliações** (só pedir para quem gostou) ou dar brinde em troca: o Google está punindo. A plaquinha NFC pede para todos, então está certa.
- Fotos novas todo mês e uma publicação por semana (posts expiram em 7 dias).

## 4. Regras legais que pesam em clínica (conferir com o cliente antes de publicar)

- **Médico (CFM 2.336/2023):** pode divulgar preço de consulta, campanhas e depoimento sóbrio. Antes e depois só com finalidade educativa, ligado à especialidade, com texto sobre indicações e resultados insatisfatórios. Paciente nunca identificado; nome, CRM e RQE obrigatórios. Nada de promessa de resultado.
- **Dentista (CFO 196/2019):** pode selfie e foto de diagnóstico e resultado final, com termo de consentimento (TCLE) assinado e postado pelo dentista responsável; proibido mostrar o procedimento acontecendo, sensacionalismo e promessa de resultado; nome e número de inscrição do profissional em toda imagem.
- **LGPD:** se houver formulário, aviso de privacidade e consentimento. Pixel e cookies com aviso.

## 5. O método (o mesmo que deu o 10/10 no vídeo)

1. **Referências por conta própria:** 3 a 5 páginas que convertem (concorrentes anunciando há 60+ dias, achados pela biblioteca de anúncios via Apify), galerias (Land-book, Godly, Lapa Ninja), Pinterest e X. Quadro de referências com uma linha "o que pegamos daqui".
2. **SPEC medida:** ordem das seções, altura da primeira dobra, tamanhos de fonte, paleta em hex, CTAs, animações, Lighthouse da referência.
3. **Plano com tokens de design** e o texto de cada seção.
4. **Quadros-chave:** print de cada seção no celular e no computador, documento curto de aprovação.
5. **Construir → crítica independente ≥ 8/10 → Lighthouse ≥ 90 no celular** → entrega com um extra (ex.: variação B do título).
6. **Ajuste sem refazer; lição no arquivo de lições na hora.**

Stack padrão: HTML/CSS ou Astro (página estática é a mais rápida), Tailwind se ajudar, hospedagem grátis (Vercel, Cloudflare Pages, Netlify), domínio no nome do cliente. Skills que já temos no repositório do Vítor: `design-taste-frontend` (feita para landing page), `apple-design`, `extract-ds`, `animation-vocabulary`.

## Fontes
- [LanderLab, Landing Page Best Practices 2026](https://landerlab.io/blog/landing-page-best-practices)
- [Visionary, CRO Benchmark Report 2026](https://visionary-marketing.co.uk/blog/conversion-benchmark-report-2026)
- [StoreRocket, Local SEO Ranking Factors 2026](https://storerocket.io/learn/local-seo-ranking-factors)
- [Estratégia MED, regras da CFM 2.336/2023](https://med.estrategia.com/portal/noticias/publicidade-medica/)
- [CFO, Resolução 196/2019](https://website.cfo.org.br/wp-content/uploads/2019/01/Resolu%c3%a7%c3%a3o-CFO-196-2019.pdf)
