# Plano de migração para uma VPS única

Autor: Claude (pedido do Ribeiro, 21/10/2026). **Só plano: nada foi alterado no projeto, no PC ou na Vercel.**
Meta: tirar tudo do PC do Ribeiro e da Vercel/Neon e rodar em **uma VPS**, banco incluído, com custo máximo = a mensalidade da VPS.

## 1. Resumo

- **Recomendação:** 1 VPS de 2 vCPU / 8 GB / 100 GB NVMe (classe Hostinger KVM 2, cerca de R$ 35 a 70 por mês), com Docker Compose rodando tudo: app do cardápio, Postgres, n8n, WAHA e proxy HTTPS (Caddy).
- **Banco:** Postgres na própria VPS. O app já fala Postgres (`DATABASE_URL`), então a migração do Neon é um `pg_dump` / `pg_restore`. O SQLite do PC fica só como backup.
- **WhatsApp:** manter **WAHA** (já está rodando, é mais simples que a Evolution). Evolution API fica como plano B.
- **Pontos de maior risco:** a sessão do WhatsApp do número real do dono ((61) 99611-5754) e a janela de troca. Tudo o resto é reversível.
- **Custo extra além da VPS:** R$ 0 (domínio já existente, backup externo em camada gratuita, monitoramento open source).
- **Tempo estimado:** 1 a 2 dias de trabalho, mais 1 a 2 semanas de convivência com o plano antigo ligado como reserva.

## 2. Como está hoje (inventário)

| Peça | Onde roda hoje | Observação |
|---|---|---|
| App cardápio `brasa-nobre` (Central do Espeto + demos) | Vercel (repo `vodetmor/brasa-nobre`) | Tempo real por polling de 2 s (tabela `events`), upload de foto desligado |
| Banco do app | Neon (Postgres, `brasa-nobre-db`) | Plano gratuito, com limites |
| n8n (atendente Espeto) | PC do Ribeiro, `C:\dev\n8n-atendente` | PC é servidor temporário |
| WAHA (número real do dono) | PC do Ribeiro | Sessão ativa; nunca desconectar sem ele pedir |
| n8n + WAHA da MedicMais | Separados dos do Espeto | Hoje em estado de demo/proposta |
| Impressora Elgin i8 80 mm | Balcão do cliente, Chrome `--kiosk-printing` | **Não migra**: continua no computador do balcão, abrindo a URL nova |
| Painéis internos (Clientes do Ribeiro etc.) | Artefato claude.ai | Não muda |

Dado que a VPS passa a ser o servidor, o PC deixa de precisar ficar ligado 24 h.

## 3. Arquitetura alvo

```
Internet ──► Caddy (HTTPS automático, portas 80/443)
               ├─ app.<dominio>   → app cardápio (Node, SSE real)
               ├─ n8n.<dominio>   → n8n (protegido por login + restrição)
               └─ (WAHA e Postgres NÃO ficam públicos)
Rede interna do Docker:
  app ──► postgres      n8n ──► postgres (banco próprio)
  n8n ──► waha          waha ──► WhatsApp (volume de sessão persistente)
Backup: pg_dump diário + cópia dos volumes (waha, n8n) para fora da VPS
```

Pontos de projeto:
- **Um `docker-compose.yml` por cliente de WhatsApp** (Espeto separado de MedicMais, como hoje), ou um stack só com WAHA e n8n com sessões distintas. Recomendo stacks separados para um problema de um cliente não derrubar o outro.
- **Tempo real:** na VPS o app volta a usar SSE de verdade (processo contínuo); o polling da Vercel deixa de ser necessário. Confirmar no código se a troca é só variável de ambiente.
- **Fotos e 3D:** passam a ficar em volume da VPS (upload volta a funcionar), entram no backup.
- **Postgres:** um único servidor com bancos separados (`cardapio`, `n8n_espeto`, `n8n_medic`); usuário e senha por banco.

## 4. VPS: opções e custo

Preços abaixo vêm de blogs e agregadores, não das páginas oficiais; **confirmar no checkout** (promoção de 1º ano costuma subir na renovação).

| Opção | Specs | Custo aprox. | Prós | Contras |
|---|---|---|---|---|
| **Hostinger KVM 2** (recomendada) | 2 vCPU, 8 GB, 100 GB NVMe | R$ 35 a 70/mês (promo vs. renovação) | Pagamento em reais/Pix, painel simples, snapshot, suporte em português | Preço sobe na renovação; contratar prazo longo para travar o valor |
| Hostinger KVM 1 | 1 vCPU, 4 GB | menor | Mais barato | Apertado para app + Postgres + 2 n8n + 2 WAHA (WAHA com navegador consome ~500 MB a 1 GB por sessão) |
| Hetzner (CX/CPX) | 2 vCPU, 4 a 8 GB | cerca de €4 a €8/mês após reajuste de abril/2026 (fontes divergem) | Muito bom custo-benefício | Sem datacenter no Brasil (latência ~200 ms), pagamento em euro/cartão internacional |
| Contabo | 4 vCPU, 8 GB | baixo | Muita máquina por pouco | Desempenho irregular, regiões a confirmar |

**Recomendação:** Hostinger KVM 2. A latência no Brasil é boa o bastante para cardápio e bot, e o pagamento é simples. O KVM 1 só serve se rodar apenas o Espeto; a MedicMais ainda não fechou, então dá para começar no KVM 2 e não pensar em upgrade.

Custo mensal total esperado: **só a VPS**. Itens opcionais gratuitos: Backblaze B2 ou Google Drive (cópia dos backups), Uptime Kuma (monitoramento), Let's Encrypt (HTTPS).

Atenção ao comparar custos: hoje a Vercel (plano Hobby) e o Neon (gratuito) custam R$ 0, então a VPS **adiciona** uma mensalidade. O que se ganha: o PC deixa de ser ponto único de falha (luz, internet, Windows atualizando), não há limite do plano gratuito do Neon, e o plano Hobby da Vercel é para uso não comercial, o que um cliente pagante já extrapola (verificar os termos atuais).

## 5. WAHA x Evolution API

| Critério | WAHA | Evolution API |
|---|---|---|
| Custo | Núcleo gratuito; versão Plus paga libera engines e recursos extras (confirmar na documentação do que o gratuito inclui, principalmente envio de mídia e várias sessões) | Gratuita (licença baseada em Apache-2.0) |
| Instalação | 1 container, painel/dashboard bom | Mais peças: Postgres e Redis, gerenciador web |
| Engines | Baseados em WhatsApp Web (WEBJS; NOWEB/GOWS no Plus) | Baileys (não oficial) e Cloud API oficial |
| Várias instâncias | Mais limitado no gratuito | Multi-instância nativo |
| Risco de bloqueio | Não oficial, risco existe (menor com bom comportamento: sem spam, sem rajada) | Baileys não oficial, risco semelhante ou maior em volume |
| Já em uso | **Sim** (sessão do número real) | Não |

**Decisão sugerida:** ficar com **WAHA**. Trocar de ferramenta no número real do dono, ao mesmo tempo em que se troca de servidor, soma dois riscos. Se o gratuito do WAHA ficar limitado (mídia, várias sessões), avaliar: (a) WAHA Plus, ou (b) Evolution API para um número novo de teste, nunca no número do Espeto primeiro.
Longo prazo: o caminho **oficial** (WhatsApp Cloud API) elimina risco de bloqueio, mas cobra por conversa e exige conta Meta Business; vale propor quando o volume justificar.

## 6. Plano de migração (por fases, sem desligar nada)

**Fase 0: preparação (sem tocar em produção)**
1. Contratar a VPS (Ribeiro paga/autoriza). Escolher Ubuntu LTS, chave SSH, firewall `ufw` liberando só 22 (ou porta alterada), 80 e 443.
2. Apontar um domínio/subdomínio para a VPS (confirmar qual domínio usar; hoje o app está em `brasa-nobre.vercel.app`).
3. Instalar Docker, Compose, Caddy, fail2ban, atualizações automáticas de segurança.
4. Levantar do PC tudo que existe: versão do WAHA e do n8n, arquivos `.env`, volumes, lista de workflows, credenciais, e **qual pasta guarda a sessão do WAHA**. Anotar a `N8N_ENCRYPTION_KEY` (sem ela as credenciais do n8n não abrem).

**Fase 1: banco e app (reversível a qualquer momento)**
5. Subir Postgres e restaurar uma cópia do Neon (`pg_dump` do Neon, `pg_restore` na VPS). Conferir contagens por tabela (pedidos, comandas, produtos) nas duas pontas.
6. Subir o app apontando para o Postgres da VPS em um subdomínio de teste. Rodar o `npm test` / smoke test e fazer um pedido completo de teste (mesa de teste, não a Mesa 1 real).
7. Conferir cozinha, atendimento, caixa, painel, QR e a impressão (Chrome kiosk) apontando para a URL de teste.

**Fase 2: n8n (ainda sem WhatsApp real)**
8. Exportar workflows e credenciais do n8n do PC (`n8n export:workflow --all` e `export:credentials`) e importar na VPS com a **mesma** `N8N_ENCRYPTION_KEY`.
9. Conferir que o webhook do n8n responde na URL nova. Manter **desativados** os workflows que respondem no número real até a Fase 4 (evita duas pontas respondendo; lembrar do loop de "Oi" de 20/10, por isso manter a trava anti-loop e testar com um número de teste).

**Fase 3: WAHA com número de teste**
10. Subir o WAHA na VPS com um número de teste (chip reserva) para validar o fluxo inteiro: mensagem entra, n8n responde, menu, link do cardápio.

**Fase 4: janela de troca do número real (única etapa sensível)**
11. Escolher horário de **menor movimento** (nunca em horário de pico de jantar/fim de semana) e combinar com o dono; ele precisa estar com o celular à mão, caso peça para ler o QR.
12. Copiar a pasta/volume de sessão do WAHA do PC para a VPS **com o WAHA do PC parado** (duas instâncias na mesma sessão ao mesmo tempo derrubam uma à outra e aumentam risco de bloqueio). Subir o WAHA na VPS.
13. Se a sessão copiada abrir normalmente: pronto, sem tocar no celular. Se pedir QR novo: o dono lê o QR (o WhatsApp do aparelho continua o mesmo número, só reconecta o aparelho vinculado). Isso é desconectar e reconectar o vínculo, então só com ele avisado.
14. Ativar os workflows na VPS, apontar o webhook do WAHA para o n8n da VPS, testar com 2 mensagens reais.
15. **Rollback:** se falhar, parar o WAHA da VPS, subir o do PC de novo (volume intocado) e reativar os workflows do PC.

**Fase 5: virada do cardápio**
16. Trocar a URL de produção (domínio) para a VPS. Os QR/NFC das mesas apontam para `brasa-nobre.vercel.app/m/<token>`: **não podem quebrar**. Opções: (a) manter o domínio da Vercel redirecionando para o novo; (b) idealmente, usar domínio próprio e regravar nada. Decisão do Ribeiro (ver seção 9).
17. Atualizar a URL no Chrome kiosk do balcão (impressão) e testar uma impressão real.
18. Congelar o app antigo (Vercel/Neon) como reserva por 1 a 2 semanas, sem escrita, e então desligar.

**Fase 6: encerramento**
19. Desligar o servidor temporário do PC só depois de 7 dias estáveis na VPS.
20. Atualizar o `ESTADO.md` do cliente e este documento com as URLs, portas, versões e onde estão os backups.

## 7. Backups e continuidade

| O quê | Como | Frequência | Retenção |
|---|---|---|---|
| Postgres (app e n8n) | `pg_dump` comprimido via cron/container | Diária (e antes de qualquer atualização) | 14 dias + 1 por mês |
| Volume de sessão do WAHA | cópia do volume | Diária | 7 dias |
| Volume do n8n + `N8N_ENCRYPTION_KEY` | cópia do volume; chave guardada à parte (gerenciador de senhas) | Diária | 14 dias |
| Fotos/3D (uploads) | `rsync`/`rclone` | Diária | espelho |
| Snapshot da VPS | Painel da Hostinger | Semanal | 1 a 2 |

- **Cópia fora da VPS** (Backblaze B2 ou Google Drive): backup que mora na mesma máquina não é backup.
- **Teste de restauração** uma vez no começo e depois uma vez por mês. Backup que nunca foi restaurado não conta.
- **Monitoramento:** Uptime Kuma (ou verificação equivalente) avisando se o app, o n8n ou o WAHA caírem; alerta se a sessão do WAHA sair de `WORKING`.
- **Atualizações:** versões fixas (não `latest`) nas imagens, atualizar de forma planejada, nunca durante expediente do cliente.

## 8. Riscos e como reduzir

| Risco | Impacto | Mitigação |
|---|---|---|
| Sessão do WAHA não migra e pede QR | Bot fora até o dono ler o QR | Fazer em janela combinada, com o dono por perto; manter o PC como reserva |
| Bloqueio do número por comportamento (loop, rajada) | Perda do número do dono | Trava anti-loop obrigatória, limite de envio, nunca rodar duas instâncias com a mesma sessão |
| QR/NFC das mesas apontando para URL antiga | Cliente não consegue pedir | Manter redirecionamento do domínio antigo; teste com o QR físico |
| Perda do `N8N_ENCRYPTION_KEY` | Credenciais do n8n inutilizáveis | Guardar a chave em local seguro, fora da VPS |
| VPS invadida (portas expostas) | Vazamento de dados e do WhatsApp | WAHA/Postgres só na rede interna, SSH por chave, firewall, fail2ban, senhas fortes, autenticação no n8n e chave de API no WAHA |
| VPS fora do ar | Cardápio e bot param | Snapshot + backup externo; recriar a VPS a partir do compose em horas; manter o plano antigo por 2 semanas |
| Preço da VPS sobe na renovação | Custo acima do previsto | Contratar prazo longo (12 a 24 meses) no preço promocional |
| Pico de memória (WAHA com navegador) | Reinícios | KVM 2 (8 GB) com limite de memória por container; monitorar |
| Termos do WhatsApp (API não oficial) | Risco permanente | Informar o dono; plano de migrar para a API oficial se o volume crescer |

## 9. O que preciso que o Ribeiro decida (nada disso foi feito)

1. **Contratar a VPS** (KVM 2, prazo e forma de pagamento) e a conta de onde sai.
2. **Domínio** do app e dos serviços (hoje é `brasa-nobre.vercel.app`). Domínio próprio evita ficar preso à Vercel e protege os QR/NFC das mesas.
3. **Janela da troca do WhatsApp** (dia e hora de menor movimento) e se o dono pode estar disponível.
4. **Repositório de conhecimento** (aprendizados, forma de trabalhar, ESTADO.md etc.): ele disse "possivelmente". Preciso saber a conta (vodetmor pelo PC ou rruandev pela nuvem), o nome e se é privado. Não criei nada.
5. Se aceita o WAHA como definitivo ou prefere testar a Evolution API num número de teste.

## 10. Fontes consultadas (preços e comparações variam; confirmar antes de contratar)

- Hostinger KVM 2 e preços: horadecodar.com.br/valor-vps, vpsbenchmarks.com (blogs e agregadores, não a página oficial).
- Hetzner (reajuste de abril/2026, sem região no Brasil): findstack.com, agentdeals.dev.
- WAHA x Evolution: indiehackers.com (roundup) e páginas de deploy da Railway. Detalhes dos engines e do que o WAHA gratuito inclui **não foram confirmados na documentação oficial**.
