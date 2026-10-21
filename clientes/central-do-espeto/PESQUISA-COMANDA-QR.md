# Comanda online por QR Code (mesa) — pesquisa

Data: 16/10/2026 · Pedido: Ribeiro · Prioridade: baixa · Só pesquisa, sem código.
Cliente provável: Central do Espetinho (1 plaquinha já deixada em 15/10). Vale para qualquer bar/restaurante.

Aviso de confiança: preços de concorrentes vêm de comparativos de terceiros e variam entre fontes; confirmar nos sites oficiais antes de cotar ao cliente. Itens marcados *(inferência)* são minha conclusão, não algo confirmado em fonte.

## 0. Cliente: Central do Espeto (Sobradinho-DF)
Instagram @centraldoespetof (731 seguidores), Qd. 08, Banca da Serra, Sobradinho I. Almoço, jantinha e espetinhos. Hoje o pedido é por WhatsApp (61 99611-5754). Ribeiro confirmou: é o cliente que precisa de QR com comanda e organização dos pedidos.
Impacto na recomendação *(inferência)*: negócio pequeno, mesas provavelmente ao ar livre (internet e luz instáveis, celular com sol forte), poucos funcionários. Por isso: começar sem impressora (tela/tablet com som), tela e botões grandes, o mesmo painel recebe pedidos de mesa e do WhatsApp (digitados pelo caixa), e identidade visual do cardápio em vermelho, preto e chama, conforme o material do cliente.

## 1. Fluxo desejado

1. QR na mesa aponta para `https://dominio/m/<token-da-mesa>` (token, não o número cru).
2. Cliente abre no navegador (sem instalar app), vê o cardápio, monta o carrinho, informa o nome (e opcionalmente observações).
3. Envia. O pedido chega no caixa/cozinha com "Mesa 7 · Nome" e imprime, com aviso sonoro.
4. Cliente vê o status do pedido (recebido / preparando / pronto).
5. Pagamento Pix online é opcional (fase 2); no começo, paga no caixa.

## 2. Construir ou comprar

| Opção | Custo mensal (aprox.) | Prós | Contras |
|---|---|---|---|
| Goomer | Básico R$ 99,90 (R$ 59,94 no anual); QR Code listado à parte por ~R$ 70/mês na página oficial | Nasceu como cardápio de mesa por QR; pronto | Mensalidade do cliente para sempre; pouca margem para a agência; pouca customização |
| Anota AI (do iFood) | Start a partir de ~R$ 299,99 (uma fonte; outra cita R$ 89, parece desatualizada); QR de mesa incluído | Pronto, integra com iFood | Mais caro; preço instável entre fontes |
| Cardápio Web | ~R$ 170–270 | Pronto | Foco em delivery |
| Saipos | ~R$ 160–240 | PDV e gestão completos | Pesado para espetinho; foco em PDV |
| Menudino (Consumer) | R$ 59,90–269,90 (anual) | Barato na entrada | Preço pouco claro |
| **Construir (stack abaixo)** | **R$ 0–150/mês de infra** | Produto próprio da agência, mensalidade recorrente, marca do cliente, controle total da impressão | Precisa de manutenção e suporte |

Fontes: [Goomer planos](https://goomer.com.br/planos), [Goomer vs SisFood 2026](https://www.sisfood.com.br/saiba-mais/comparativos/goomer-vs-sisfood), [Anota AI](https://reidodelivery.com.br/blog/anota-ai-vale-a-pena), [comparativo de cardápios digitais](https://reidodelivery.com.br/blog/melhores-sistemas-de-cardapio-digital), [iFood Cardápio Digital 2021](https://mercadoeconsumo.com.br/2021/08/29/novo-cardapio-digital-do-ifood-promete-beneficios-para-donos-de-restaurantes/).

Leitura: o mercado cobra de R$ 60 a R$ 300 por mês só por isso. Um sistema próprio permite à agência cobrar uma mensalidade de ~R$ 99–199 com margem alta, ou vender como produto para vários bares.
Recomendação: **construir um MVP enxuto** (o pedido simples é pouco código) e, se o cliente tiver pressa, usar Goomer como ponte nos primeiros dias.

## 3. Arquitetura recomendada (MVP)

```
Cliente (celular) ──HTTPS──> Web app (PWA, Next.js ou Vite+React)
                                  │
                                  ▼
                       Supabase (Postgres + Realtime + Auth)
                                  │ WebSocket (tempo real)
              ┌───────────────────┴──────────────────┐
              ▼                                      ▼
   Tela da cozinha/caixa (tablet/PC,        Impressora térmica
   mesma web app, rota /painel,             (rede ou USB) via
   com som de alerta)                       ponte local de impressão
```

### Front (cliente)
- Web app responsivo / PWA, sem instalar nada. Rotas: `/m/<token>` cardápio; carrinho; confirmação; status do pedido.
- Mobile-first, fotos leves (WebP), funciona bem em 4G fraco.

### Backend e banco
- **Supabase** (Postgres + Realtime + Auth): num comparativo de 2026, plano Free tem 500 MB de banco e pausa o projeto após 7 dias de inatividade; Pro custa US$ 25/mês e inclui Realtime. Para cliente pagante, **usar Pro** (evita pausa). Confirmar limites de Realtime no site oficial. Fonte: [guia de preços Supabase 2026](https://www.jetadmin.io/blog/supabase-pricing-2026-guide-to-plans-limits-and-real-world-costs/).
- Tabelas mínimas: `estabelecimento`, `mesa` (id, numero, token), `categoria`, `produto` (preço, foto, ativo), `pedido` (mesa, nome, status, total, criado_em), `item_pedido`, `impressao` (fila/status).
- Alternativa: Firebase (mais simples, tempo real nativo) ou Node + Socket.IO em VPS. Supabase é a melhor relação custo/simplicidade; existem projetos abertos com a mesma ideia (Next.js + Supabase + cozinha em tempo real + impressão TCP) que servem de referência: [exemplo](https://tomevault.io/tome/resocorp/jollofexpress), [Smart Restaurant](https://github.com/datkrb/Smart-Restaurant).

### Hospedagem
- Front: Vercel ou Cloudflare Pages. A Vercel Hobby tem restrição de uso comercial, por isso, para cliente pagante, usar Pro (~US$ 20/mês) ou Cloudflare Pages (gratuito, aceita uso comercial) *(conferir os termos antes)*.
- Domínio: ~R$ 40/ano (.com.br) ou subdomínio do cliente.

### Tempo real e alerta sonoro
- Tela `/painel` aberta num tablet/PC do caixa assina o canal Realtime; pedido novo toca um som e aparece em destaque.
- Limitação conhecida: navegadores só tocam áudio depois de um clique do usuário, então o painel pede um "Ativar som" ao abrir. Manter a tela acesa (Wake Lock API) e o app instalado como PWA no tablet.

### Impressão térmica (ponto mais delicado)
O navegador não imprime direto em impressora ESC/POS de rede com confiança. Opções:

| Opção | Como | Custo | Comentário |
|---|---|---|---|
| **A. Ponte local** (recomendada) | Mini programa/Node num PC ou mini-PC do local assina o Realtime e envia ESC/POS por TCP (porta 9100) à impressora de rede | R$ 0 de licença | Mais controle; precisa de um PC ligado no balcão |
| B. PrintNode (nuvem) | Cliente instala agente; a API manda o job | Pago por impressora/mês (conferir) | Menos código; custo recorrente |
| C. QZ Tray / JSPrintManager | Agente local deixa a página imprimir | QZ grátis com popup a cada impressão; sem popup é pago | Pouco prático no balcão |
| D. Sem impressão (só tela) | Tela de cozinha/KDS no tablet | R$ 0 | Ótimo para começar e testar com o cliente |

Fontes: [QZ Tray no Odoo](https://apps.odoo.com/apps/modules/16.0/pos_qz_printer), [fórum Bubble sobre ESC/POS](https://forum.bubble.io/t/esc-pos-printing/116223).
- Hardware: impressora térmica 80 mm com Ethernet (Epson TM-T20 ou similares, ~R$ 800–1.500; genéricas chinesas ~R$ 400–700). Impressão de 80 mm tem ~48 caracteres por linha. Bluetooth é possível, mas instável para uso contínuo; prefira rede/USB.
- *(Inferência)* Para o espetinho, o ticket da cozinha deve ter fonte grande: **MESA 7 · João**, itens, observações, hora.

## 4. Pagamento Pix (opcional, fase 2)
- Pix dinâmico via PSP com API. Exemplo Asaas: taxa promocional para PJ de R$ 0,99 por cobrança nos 3 primeiros meses e R$ 1,99 depois; a taxa só é cobrada quando paga; a isenção de 100 Pix/mês não vale para QR dinâmico. Mercado Pago não foi confirmado (precisa de consulta direta). Fonte: [Asaas Pix](https://asaas.com/pix-asaas), [docs Asaas](https://docs.asaas.com/docs/cobrancas-via-pix).
- Webhook confirma o pagamento e libera o pedido para a cozinha.
- Para bar/espetinho, o comum é "pagar no fim" por mesa. O Pix online faz mais sentido em balcão e delivery. *(Inferência)* Deixar para depois.

## 5. Riscos e mitigações
1. **Internet do local cai.** Plano B: o painel mostra aviso "sem conexão", a ponte reenvia a fila ao voltar, e o garçom continua com comanda de papel. Chip 4G reserva no roteador.
2. **Pedidos falsos / trote por QR.** Token curto e rotativo por mesa; rate limit; exigir nome; limite de pedidos por mesa por minuto; caixa pode "recusar" pedido; modo "só confirmar com garçom" se houver abuso. Pedido só vale com a mesa "aberta" pelo caixa (opcional).
3. **Uma mesa por QR / QR copiado.** Cada mesa tem seu token; o caixa pode invalidar e regenerar o QR. Impressão em acrílico/adesivo laminado.
4. **Cliente fora do local fazendo pedido.** Opcional: abrir mesa pelo caixa, ou limitar por horário. Geolocalização aborrece o cliente; só se houver problema.
5. **Cardápio apenas digital.** Há projeto de lei municipal (Santa Bárbara d'Oeste-SP) para proibir cardápio exclusivamente digital; manter um cardápio impresso como alternativa. Fonte: [Correio da Manhã](https://www.correiodamanha.com.br/nacional/sao-paulo/campinas/regiao-de-campinas/2026/06/amp/296497-santa-barbara-projeto-proibe-menu-exclusivo-por-qr-code.html).
6. **LGPD:** coletar só o nome; não guardar telefone sem necessidade.
7. **Adoção:** nem todo cliente (e cliente de bar) quer pedir pelo celular; manter o garçom como opção que também lança no painel.

## 6. Custo mensal estimado (construir)
| Item | Valor |
|---|---|
| Supabase Pro | ~US$ 25 (~R$ 140) |
| Hospedagem do front | R$ 0 (Cloudflare) a ~US$ 20 (Vercel Pro) |
| Domínio | ~R$ 3 |
| Pix (opcional) | ~R$ 1–2 por cobrança |
| Impressora (uma vez) | R$ 400–1.500 |
| Total fixo | **~R$ 140–260/mês**; cabe em um projeto Supabase compartilhado entre vários clientes para dividir o custo *(inferência)* |

Preço sugerido ao cliente *(sugestão, a validar com o Ribeiro)*: implantação + mensalidade na faixa dos concorrentes (R$ 100–200), com margem maior se vários bares usarem a mesma base.

## 7. Plano de MVP
**Fase 1 (MVP, sem impressão) — mínimo para demonstrar:**
1. Cadastro de cardápio (categorias, produtos, preço, foto) — pode ser planilha/JSON no começo, com painel simples depois.
2. Página `/m/<token>` com carrinho e envio com nome.
3. Painel `/painel` em tempo real com som e botões Recebido / Preparando / Pronto.
4. Gerador de QRs por mesa (PDF para imprimir).

**Fase 2:** impressão térmica via ponte local; status em tempo real para o cliente; reimpressão.

**Fase 3:** Pix, relatórios (mais vendidos, ticket médio), cupom/observações, múltiplos estabelecimentos (SaaS), integração com WhatsApp (aviso "seu pedido está pronto").

Ordem de custo-benefício: Fase 1 testa a ideia com o espetinho sem comprar hardware.

## 8. Prioridade baixa: cardápio 3D com realidade aumentada
- **Tecnologia:** `<model-viewer>` (Google) exibe GLB na página e abre AR no Android (Scene Viewer/WebXR). No iPhone, o AR (Quick Look) exige USDZ; só GLB dá visualização 3D sem AR. Ideal: fornecer GLB + USDZ, em metros, origem na base. Fonte: [formatos 3D](https://docs.devdiggers.com/woocommerce-product-view-in-ar/getting-started/3d-model-file-formats/).
- **Como produzir os modelos:** fotogrametria (dezenas de fotos em volta do prato, ex.: Polycam/RealityScan/Kiri Engine), ou geração de 3D a partir de foto por IA (este projeto tem ferramenta de imagem → malha 3D GLB), ou modelagem no Blender. Comida brilhante, molhada e fumegante é difícil de escanear; resultados costumam precisar de limpeza. Um fornecedor indiano cita R$-equivalente de ~Rs 1.500–4.000 por prato (uma única referência regional): [guia AR menu](https://blog.petpooja.com/glossary/ar-menu/). Referência de empresa do setor: Kabaq usa fotogrametria.
- **Custo estimado:** produzir internamente ~1–3 h por prato; terceirizado, algo na casa de R$ 100–500 por prato *(inferência, sem fonte brasileira)*.
- **Recomendação:** adiar. Começar com **fotos boas** (ganho de venda muito maior por menos esforço); fazer AR só para 3–5 pratos de destaque como diferencial de marketing, depois do MVP rodando. Para espetinho, o retorno é duvidoso *(inferência)*.

## 9. Perguntas para o cliente (Central do Espetinho)
1. Quantas mesas, e há atendimento de balcão/delivery também?
2. Já tem impressora térmica (marca/modelo, rede ou USB) e um PC/tablet no caixa?
3. A internet do local é estável? Tem Wi‑Fi para o cliente?
4. O cardápio e os preços: quem mantém? Muda com frequência (ex.: acabou o item)?
5. Paga na mesa/no fim ou antes? Quer Pix online?
