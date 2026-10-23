# Estado das demandas

Atualizado em 23/10/2026. Detalhe de cada cliente em `clientes/<cliente>/ESTADO.md`.

| Cliente / demanda | Estado | Próximo passo | Depende de |
|---|---|---|---|
| Central do Espeto: cardápio digital | **Em produção** desde 20/10. Fechado por R$ 2.500 à vista + 6 meses de manutenção | Trocar fotos temporárias (prefixo `tmp-`) por fotos da casa; ligar `STAFF_PIN=1` | Dono (fotos) |
| Central do Espeto: atendente WhatsApp | **Em produção** no PC do Ribeiro (n8n + WAHA no número real do dono). Travas anti-loop, memória e custo corrigidos (ver `conhecimento/whatsapp/`) | Preencher "Informações da casa": horário, entrega, taxa, Pix | Dono |
| Central do Espeto: contagem de vendas | Contagem certa; vendas do WhatsApp não chegavam ao Neon (ECONNRESET sem retry, n8n não registrava pedido). Corrigido na thread do atendente | Conferir relatório diário | Agência |
| Infra: migração para VPS | **Plano pronto**, nada mudou (`conhecimento/infra/PLANO-MIGRACAO-VPS.md`): 1 VPS 2 vCPU / 8 GB com Docker (app + Postgres + n8n + WAHA + Caddy), ~R$ 35 a 70/mês | Ribeiro decidir quando migrar | Ribeiro |
| MedicMais Sobradinho | Reunião presencial em 21/10. Proposta v5 com valores do Ribeiro: total R$ 5.788 + manutenção R$ 2.604,50/mês. Contrato do atendente em minuta (22/10). Agenda real da clínica = Sigma | Clínica pedir API/webhook ao suporte Sigma; Ribeiro completar dados e valores do contrato; reverter site da demo (PR #5); trocar chave z.ai | Clínica / Ribeiro |
| Luiza Rabelo DF | Site no ar; proposta v3 pronta (com e sem preços); **vídeo institucional 3D pronto** (21/10, 103 s) | Enviar proposta + vídeo | Ribeiro |
| Ótica Hora Certa | Frio, só pesquisa | Nada até o Ribeiro retomar | Ribeiro |
| Cardápio SaaS (produto) | Demo no ar com Brasa Nobre e Bistrô Jardim | Modo simples do admin para o dono; papéis de equipe | Agência |
| Componente iPhone 3D (vídeo) | Pronto, reaproveitável (`conhecimento/video/componentes/iphone-3d/`) | Usar nos próximos vídeos | – |
| Tabela única de preços | Rascunho em `conhecimento/comercial/PRECOS-E-CUSTOS.md` | Ribeiro aprovar | Ribeiro |
| Painel "Clientes do Ribeiro" | No ar (clientes, cobranças, financeiro, tarefas) | Lançar entradas e saídas ditadas pelo Ribeiro | Ribeiro |

## Onde está cada coisa
| Coisa | Endereço | Repositório |
|---|---|---|
| Cardápio Central do Espeto | https://brasa-nobre.vercel.app (painel `/r/central-do-espeto/painel`) | vodetmor/brasa-nobre |
| Site MedicMais | https://medicmais-sobradinho-site.vercel.app | rruandev/medic-mais- |
| Painel demo MedicMais | https://medicmais-painel-demo.vercel.app | conta Vercel do PC |
| Site Luiza Rabelo | https://luiza-rabelo-df.vercel.app | vodetmor/luiza-rabelo-site |
| Vídeo institucional Luiza (mp4) | pasta do projeto: `clientes/luiza-rabelo/video-institucional/` | fonte em `conhecimento/video/projeto-luiza-rabelo/` |
| Painel Clientes do Ribeiro | https://claude.ai/artifact/5Linm5nE8UiFeRqNtfs8pt | (artefato) |
| Atendentes WhatsApp (n8n + WAHA) | PC do Ribeiro, `C:\dev\n8n-atendente` | sem repo |
| Repositório de edição de vídeo | github.com/vodetmor/edicao-de-video-claude-vodetmor | – |

## Valores de referência
- Central do Espeto (fechado): R$ 2.500 à vista + 6 meses de manutenção inclusa. Ribeiro acha que saiu barato.
- MedicMais v5 (do Ribeiro): Site 997 + Google Meu Negócio 497 + Automação WhatsApp 2.497 + Roteiro/edição/suporte 1.797 = R$ 5.788; manutenção R$ 2.604,50/mês.
- Luiza Rabelo v3: R$ 3.190 com vídeo (R$ 1.790 sem) + R$ 797/mês + verba Google R$ 30/dia.
- Modelo de cobrança desejado: implantação à vista + mensalidade começando ~2 meses depois.
- Custo de rodar um atendente: ~R$ 90 a 100/mês; pacote completo ~R$ 160 a 230/mês de custo para a agência.
- Disparo WhatsApp: utilidade ~R$ 0,04 (oficial); marketing ~R$ 0,30 a 0,35 (oficial). Não oficial é mais barato, com risco de bloqueio.
