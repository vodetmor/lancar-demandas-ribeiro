# Roteiro da demo · Atendente MedicMais (reunião 21/10/2026)

## Antes de sair (30 min antes)
1. PC/notebook ligado, internet ok, Docker Desktop aberto (n8n e WAHA sobem sozinhos).
2. Janela do túnel (cloudflared) aberta. Se a URL mudou, atualizar no n8n antes.
3. WAHA conectado (dashboard em http://localhost:3001/dashboard mostra WORKING).
4. Liberar o número do médico no modo teste do robô (pedir o número antes, ou usar o celular do Ribeiro).
5. Ensaio: mandar "oi" de outro celular, marcar uma consulta e ver cair no painel. Depois apagar o registro do ensaio.
6. Hoje: entrar no painel no notebook da reunião marcando "Manter conectado" (token da linha PAINEL_TOKEN do .env). Painel: https://medicmais-painel-demo.vercel.app/app (funciona com o PC desligado; só o robô depende do PC). Se o cloudflared reiniciar, a URL muda: atualizar N8N_URL na Vercel e o .env

## Na reunião (5 minutos)
1. "Doutor, manda um oi para este número como se fosse um paciente." (celular dele)
2. Deixar ele conversar livre: perguntar especialidade, convênio, horário. O robô responde com "digitando…", mensagens curtas, e oferece horários reais da agenda.
3. Enquanto isso, virar o notebook: o paciente aparece no funil (novo contato → qualificado → horário oferecido → agendado).
4. Consulta marcada: mostrar na agenda do painel e o resumo que chegou no WhatsApp dele.
5. Pedir para ele escrever "quero falar com uma pessoa": aparece o alerta vermelho "Pediu humano" no painel.
6. Abrir Funil > "Contexto da IA", mudar uma regra de triagem na frente dele e mandar nova mensagem: a resposta já muda.
7. Mostrar no site da clínica (botão Agendar) que o paciente cai direto no robô.
8. Fechar: "Isso roda 24h, sem atendente; a recepção só cuida do que o robô passar."

## Se algo falhar
- Painel não envia mensagem nem mostra foto: túnel caiu. Rodar `cloudflared tunnel --url http://localhost:5678` (o painel pega o endereço novo sozinho pelo banco).
- Robô não responde: conferir janela do túnel e WAHA; reiniciar o container n8n.
- Painel sem dados: abrir ?demo=1 e seguir com os dados fictícios.

## Respostas prontas
- "É o WhatsApp oficial?" Na versão final, sim: API oficial da Meta no número da clínica (exige CNPJ regularizado). A demo usa um número de teste.
- "Quanto custa rodar?" ~R$ 90 a 100/mês de infraestrutura (ver proposta v2).
- "E os dados dos pacientes?" Ficam no banco da clínica, com login no painel; na versão final o provedor de IA entra no contrato e no aviso de privacidade (LGPD).
