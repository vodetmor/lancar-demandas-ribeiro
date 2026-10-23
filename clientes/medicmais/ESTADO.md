# MedicMais Sobradinho · estado (16/10/2026)

- Proposta v1 enviada ~15/10 (vence ~30/10). PDF original não está aqui (veio anexado no chat).
- **Proposta v2** pronta para revisão: `proposta-v2/Proposta-MedicMais-Sobradinho-v2.pdf` (fonte: `proposta-v2/proposta.html`, render com Chromium/Playwright 960×540).
  - Novo: atendente de WhatsApp com IA; CRM separado saiu (vem dentro do atendente).
  - Valores sugeridos pela agência, aguardando aprovação do Ribeiro: implantação R$ 2.490 (site 997 + atendente 1.497 + organização 497), mensal Presença R$ 497 / Presença+Atendente R$ 797 (recomendado) / Completo R$ 1.097.
- **Atendente**: estudo de custos em `ESTUDO-ATENDENTE-WHATSAPP.md` (≈ R$ 90–100/mês para rodar). Protótipo em simulação: https://claude.ai/artifact/8CsqVF9aL1C69JYSqvwn3m (cópia em `prototipo-atendente/index.html`).
- Bloqueio: CNPJ inapto impede a verificação da empresa na Meta. Pré-requisito para o WhatsApp oficial.
- Próximo: Ribeiro aprovar valores → enviar v2. Depois: servidor Node real (webhook Cloud API + Haiku 5.5 + SQLite + Google Agenda).
- 18/10: desempenho otimizado (PR #4, mergeado). PageSpeed no ar: celular 98, PC 100, sem mudança visual.
- 20/10: demo funcional do atendente iniciada (thread própria). Plano: n8n self-host + túnel Cloudflare + número de teste grátis da Meta (até 5 celulares). Aguardando Ribeiro: onde roda (PC/Oracle) e IA (Gemini/Claude).
- Médicos fictícios na demo: Dr. Paulo Mendes (clínico), Dra. Camila Rocha (dentista), Enf. Juliana Alves (exames), Dra. Beatriz Nunes (pediatra), Dra. Renata Castro (gineco). Painel continua com login + "manter conectado".
- 20/10 (noite): demo do atendente. Stack no PC do Ribeiro (C:\dev\n8n-atendente): n8n + WAHA (número descartável 55 87 9981-0189 pareado) + z.ai (GLM) + túnel Cloudflare (URL muda ao reiniciar). Painel da recepção: https://medicmais-painel-demo.vercel.app (projeto separado, conta Vercel do PC; ?demo=1 = dados fictícios). Meta Cloud API travou: conta Meta do Ribeiro restrita. **Reunião presencial com o médico em 21/10.** Roteiro: DEMO-ROTEIRO.md. Depois da demo: trocar a chave da z.ai (passou pelo chat).
- 20/10 03h: memória (14 msgs reais), fim do loop de ok, mídia guardada no PC (C:\dev\n8n-atendente\midias) e mostrada no painel, vídeo, 'Contexto da IA' editável no Funil, sons. Site: PR #5 mergeado (agendar → número de demo + link Área da clínica). REVERTER o site depois da demo.

## 21/10: proposta v3 (atendente + site + Google)
- proposta-v3/Proposta-MedicMais-Sobradinho-v3.pdf (11 slides, fonte proposta.html). Implantação R$ 3.190 (atendente 2.497 + site 997 + Google 497) + Presença+Atendente R$ 897/mês. Tabela única: interno/PRECOS-E-CUSTOS.md. Aguarda aprovação do Ribeiro.

## 21/10 11h50: proposta v4 (pacote completo)
- proposta-v4/Proposta-MedicMais-Sobradinho-v4.pdf (13 slides): + Google Ads e Instagram/vídeos. Implantação R$ 3.190; Plano Completo R$ 1.797/mês (12 meses) ou R$ 1.997 (6 meses); verba Google à parte; campanhas WhatsApp 1.000 msgs por R$ 400. Feita na hora para a reunião.

## 21/10 11h55: proposta v5 (preços do Ribeiro)
- proposta-v5/Proposta-MedicMais-Sobradinho.pdf: valor único total R$ 5.788 (Site 997 + GMN 497 + Automação WhatsApp 2.497 + Roteiro/edição/suporte 1.797), pedido do Ribeiro na reunião. + plano mensal de manutenção R$ 2.604,50 (11h59).

## 21/10 12h40: agenda real da clínica = Sigma (medicmais.sigmacloud.com.br, painel recepção/agenda)
- Ribeiro quer o robô marcando direto nessa agenda. Sem doc pública de API achada. Próximo: clínica pergunta ao suporte Sigma por API/webhook + cria usuário só do robô. Plano B: automação de navegador no Sigma. Plano C: painel nosso + recepção lança.

## 22/10: contrato do atendente WhatsApp (minuta)
- contrato/ : .md e .docx editáveis + PDF. Escopo só do robô (implantação R$ 2.497 sugerida, mensalidade em branco, início ~60 dias). Faltam dados das partes e valores do Ribeiro. Revisão por advogado recomendada.
