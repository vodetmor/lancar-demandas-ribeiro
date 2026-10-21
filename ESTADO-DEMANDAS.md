# Estado das demandas

Atualizado em 21/10/2026. Detalhe de cada cliente em `clientes/<cliente>/`.

| Cliente / demanda | Estado | Próximo passo | Depende de |
|---|---|---|---|
| Central do Espeto: cardápio digital | **Em produção** desde 20/10 | Contagem de vendas no banco (urgente, 21/10); preço da feijoada de sábado; fotos reais de Central/Sertanejo/Fit | Ribeiro / dono |
| Central do Espeto: atendente WhatsApp | **Em produção**, rodando no PC do Ribeiro | Horário, entrega, taxa e Pix do robô; trava anti-loop | Dono |
| Infra: migração para VPS | Plano em elaboração (nada muda agora) | Plano com custo máximo = VPS; WAHA/Evolution + n8n + Postgres na mesma máquina | Ribeiro aprovar |
| MedicMais Sobradinho | Proposta v2 + demo do atendente; reunião presencial em 21/10 | Aprovar valores e enviar; depois da demo: reverter site (PR #5), trocar chave z.ai, fechar acesso do painel | Ribeiro / clínica |
| Luiza Rabelo DF | Site no ar; proposta v2 (site + Google Ads + GMN + placa) pronta, sem preço | Enviar proposta; vídeo institucional em produção | Ribeiro / cliente |
| Ótica Hora Certa | Frio, só pesquisa | Nada até o Ribeiro retomar | Ribeiro |
| Cardápio SaaS (produto) | Demo no ar com Brasa Nobre e Bistrô Jardim | Modo simples do admin para o dono; papéis de equipe | Agência |
| Painel "Clientes do Ribeiro" | No ar (clientes, cobranças, financeiro, tarefas) | Lançar entradas e saídas ditadas pelo Ribeiro | Ribeiro |

## Onde está cada coisa
| Coisa | Endereço | Repositório |
|---|---|---|
| Cardápio Central do Espeto | https://brasa-nobre.vercel.app (painel `/r/central-do-espeto/painel`) | vodetmor/brasa-nobre |
| Site MedicMais | https://medicmais-sobradinho-site.vercel.app | rruandev/medic-mais- |
| Painel demo MedicMais | https://medicmais-painel-demo.vercel.app | conta Vercel do PC |
| Site Luiza Rabelo | https://luiza-rabelo-df.vercel.app | vodetmor/luiza-rabelo-site |
| Painel Clientes do Ribeiro | https://claude.ai/artifact/5Linm5nE8UiFeRqNtfs8pt | (artefato) |
| Atendente WhatsApp (n8n + WAHA) | PC do Ribeiro, `C:\dev\n8n-atendente` | sem repo |

## Valores de referência
- MedicMais v1 enviada: implantação R$ 1.790; mensal Presença R$ 497 ou Presença + Vídeos R$ 859.
- MedicMais v2 (sugerida, não aprovada): implantação R$ 2.490; mensal R$ 497 / R$ 797 / R$ 1.097.
- Luiza Rabelo v2 (sugerido, fora do PDF): implantação R$ 1.490; mensal R$ 697; verba de anúncio R$ 30/dia.
- Custo de rodar um atendente: cerca de R$ 90 a 100 por mês (estudo em `clientes/medicmais/ESTUDO-ATENDENTE-WHATSAPP.md`).
