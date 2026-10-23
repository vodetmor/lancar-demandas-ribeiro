# Tabela de preços da agência e quanto custa entregar (21/10/2026)

Uso interno. Não vai para cliente. Base única para todas as propostas, para MedicMais e Luiza Rabelo ficarem alinhadas.
Fonte das propostas: `clientes/medicmais/proposta-v3/` e `clientes/luiza-rabelo/proposta-v3/`.

## Regras iguais para todos
- Implantação paga uma vez, em até 3x. Pacote fechado (tudo junto) = 20% de desconto, arredondado para baixo em R$ x90.
- Mensal com contrato mínimo de 6 meses. Validade da proposta: 15 dias.
- Domínio .com.br (~R$ 40/ano) e verba de anúncio são pagos pelo cliente, no nome dele.
- Opcional nos dois: vídeos editados (roteiro + até 8/mês) = +R$ 400/mês. Não gravamos.

## Implantação
| Serviço | Preço | Horas estimadas | Custo direto |
|---|---|---|---|
| Site institucional | R$ 997 | 6 a 10 h | ~0 |
| Loja online com catálogo e sacola no WhatsApp | R$ 1.497 | 10 a 16 h | ~0 |
| Google Meu Negócio + cadastros | R$ 497 | 4 a 6 h | 0 |
| Placa de avaliação NFC/QR | R$ 247 | 1 h | ~R$ 60 a 90 (acrílico + tag) |
| Atendente WhatsApp com IA + painel da recepção | R$ 2.497 | 25 a 35 h (base já pronta) | ~0 |
| Vídeo institucional animado 3D (30 a 45 s, 2 formatos, 2 cortes de 15 s) | R$ 1.797 | 12 a 20 h | ~R$ 50 a 120 (voz/trilha) |

## Mensal
| Plano | Preço | Custo de infraestrutura por cliente | Sobra |
|---|---|---|---|
| Presença (site/loja + Google + avaliações + relatório) | R$ 497 | ~R$ 15 a 25 (parte da Vercel Pro) | ~R$ 475 |
| Presença + Atendente | R$ 897 | ~R$ 110 a 150 | ~R$ 750 |
| Presença + Anúncios Google | R$ 797 | ~R$ 15 a 25 | ~R$ 775 |

### De onde vem o custo do atendente (por clínica, estimativa)
- Servidor (VPS tipo Hostinger KVM 2, ~R$ 45/mês, cabe 5 a 8 atendentes; hoje roda no PC do Ribeiro, não serve para produção).
- IA (z.ai GLM hoje; ~R$ 20 a 40/mês para ~800 conversas; Claude Haiku daria ~R$ 30 a 40).
- WhatsApp oficial: respostas grátis; lembretes ~R$ 0,04 a 0,05 cada, ~R$ 25 para 500.
- Banco Neon: grátis até crescer. Painel na Vercel.

### Infraestrutura compartilhada (a agência paga uma vez para todos)
- Vercel: o plano grátis (Hobby) não permite uso comercial. Com clientes pagando, migrar para Pro (US$ 20/mês, ~R$ 110), rateado entre os clientes.
- VPS do atendente e da Central do Espeto: tirar do PC do Ribeiro antes de fechar o primeiro contrato de atendente.

## Resultado nos dois clientes
- **MedicMais:** implantação R$ 3.190 (soma R$ 3.991) + R$ 897/mês. 6 meses = R$ 8.572.
  - Histórico: v1 enviada ~15/10 com R$ 1.790 + R$ 497/859; v2 (não enviada) R$ 2.490 + R$ 797. A v3 sobe porque agora tem painel da recepção, funil, regras editáveis e demo funcionando.
- **Luiza Rabelo:** implantação R$ 3.190 com vídeo (soma R$ 4.038) ou R$ 1.790 sem vídeo + R$ 797/mês + verba sugerida R$ 30/dia (~R$ 900, paga ao Google). 6 meses = R$ 7.972 (com vídeo).
  - Histórico: sugerido 17/10 (fora do PDF) R$ 1.490 + R$ 697.

## O que já foi investido e vira produto reutilizável
- Atendente (n8n + WAHA/Meta + IA + painel Vercel/Neon): base pronta; cada clínica nova custa só configuração. É o item de maior valor.
- Cardápio digital (brasa-nobre, Central do Espeto em produção): produto próprio para restaurantes.
- Sites e lojas em HTML puro na Vercel: nota 90+ no PageSpeed sem mensalidade de plataforma.
- Método de vídeo do repositório do Vítor (Remotion, Blender, quadros-chave aprovados): base do vídeo da Luiza.

## MedicMais: pacote completo (pedido do Ribeiro em 21/10, 10h48)
Inclui: site, Google Meu Negócio, Google Ads (gestão), atendente WhatsApp + painel, assessoria de Instagram (calendário, legendas, stories, publicação), roteiros e edição de até 8 vídeos/mês (a clínica grava), suporte e relatório mensal.

### Quanto custa para a agência por mês (estimativa)
| Item | Dinheiro | Horas |
|---|---|---|
| Infra do atendente (VPS, IA, lembretes, parte da Vercel) | R$ 110 a 150 | 3 h (ajustes) |
| Ferramentas (Canva/CapCut Pro, música licenciada) | R$ 50 a 80 | - |
| Roteiros (4 por mês, 2 vídeos cada) | - | 4 h |
| Edição de 8 vídeos | - | 10 a 12 h |
| Instagram (calendário, legendas, stories, publicação) | - | 6 a 8 h |
| Google Ads (montagem, ajuste semanal) | - | 3 a 4 h |
| Google Meu Negócio (posts, avaliações) | - | 2 a 3 h |
| Suporte à recepção + relatório + reunião | - | 3 h |
| **Total** | **~R$ 160 a 230** | **~31 a 37 h** |

### Preço justo
- Soma da tabela: Presença 497 + Atendente 400 + Anúncios 300 + Vídeos 400 + Instagram 400 = R$ 1.997/mês.
- Proposta: **R$ 1.797/mês** fechando o pacote por 12 meses (R$ 1.997 no contrato de 6 meses).
- Implantação: R$ 3.190 (atendente, site no domínio, Google). Montagem do Google Ads inclusa.
- Verba de anúncios à parte, paga ao Google: sugerido R$ 30/dia (~R$ 900/mês).
- Sobra para a agência: ~R$ 1.570 a 1.640/mês, ~R$ 45 a 50 por hora trabalhada. Para um editor externo, cada vídeo custa R$ 40 a 70 no mercado.
- Referência de mercado no DF (estimativa, não pesquisada a fundo): social media R$ 800 a 1.500, tráfego pago R$ 600 a 1.200, robô com IA R$ 400 a 800 por mês, cada um contratado separado.

## Disparo em massa no WhatsApp (R$ 0,04 por mensagem)
- API oficial da Meta cobra por mensagem, conforme a categoria do modelo:
  - **Utilidade** (lembrete, confirmação, aviso de exame): ~US$ 0,007, cerca de **R$ 0,04**. Isso já está incluso no atendente (até 1.000 por mês).
  - **Marketing** (promoção, Saúde Day, campanha de implante): ~US$ 0,06, cerca de **R$ 0,30 a 0,35** por mensagem no Brasil.
  - Resposta dentro de 24 h depois que o paciente escreve: grátis.
  - A Meta reclassifica como marketing o modelo de "utilidade" que tiver promoção. Conferir os valores no rate card oficial (cobrança em reais desde 01/07/2026).
- Quem oferece **marketing a R$ 0,04** normalmente usa API não oficial (WAHA, Evolution, Baileys) com chip próprio. A Meta não cobra, mas o número é bloqueado quando muita gente denuncia ou quando o envio é em massa para quem não salvou o contato. Também há risco de LGPD se a lista não autorizou receber.
- O que dá para fazer:
  1. Lembrete e confirmação no oficial, a ~R$ 0,04. Mesmo preço e sem risco.
  2. Campanha de marketing no oficial: repassar o custo da Meta + taxa (por exemplo R$ 0,45 por mensagem, ou pacote de 1.000 por R$ 400).
  3. Disparo barato pelo WAHA só em **chip separado**, nunca no número da clínica. Só para pacientes que já conversaram, em lotes pequenos e espaçados. Avisar o cliente que o chip pode cair.
