# Aprendizados dos robôs de WhatsApp (Central do Espeto, 20 a 23/10/2026)

O que deu errado no robô da Central do Espeto e como foi resolvido. Serve de checklist para o próximo robô (MedicMais ou outro cliente) já nascer com isso. Código de referência: `C:\dev\n8n-atendente\espeto\gen.mjs` (fluxo n8n) e `C:\dev\cardapio-saas\src\whatsapp.js` (prompt, regras, pedido).

## 1. Travas que precisam vir prontas

| Problema que aconteceu | Trava |
|---|---|
| Cliente escreve picado ("oi", "oi", "quero pedir") e o robô responde cada uma, repetindo "Oi" | Esperar ~9 s e só a mensagem mais nova responde, juntando as anteriores (`/wa/bot/vez`) |
| WhatsApp entrega a mesma mensagem 2 vezes | Ignorar `id` de mensagem repetido |
| Rajada de respostas para o mesmo cliente | Limite: 8 respostas em 3 min pausa a conversa |
| Robô conversando em loop com outro robô (99Food) | Regra: empresa, robô, fornecedor, cobrança ou recado da equipe → `[SEM_RESPOSTA]`; e nunca mandar o mesmo texto 2x em 30 min (filtro no código, não só no prompt) |
| "Oi! Tudo bem?" em toda resposta | Cortar saudação no código quando o robô já falou com o cliente nas últimas 12 h |
| Robô inventou "Pedido #12345" | Só deixa falar em número de pedido se a ferramenta de registro deu OK na mesma rodada (ou se o número já existe) |
| Botão de pausar o robô inteiro | Ligar/pausar geral no painel + pausa por conversa quando a equipe assume |

## 2. Custo (o que zerou o crédito da z.ai em um dia)

- A visão (descrever foto/vídeo) rodava **antes** de saber se o robô ia responder, inclusive com robô pausado, em foto de **status e grupo**. Ordem certa: descartar grupo/status/canal logo na entrada → perguntar ao app se o robô vai responder → só então processar mídia.
- Foto: Groq grátis (`qwen/qwen3.8-27b`, aceita imagem; 1000/dia, 8k tokens/min), z.ai `glm-4.6v` só de reserva. Vídeo: só a fala (Groq Whisper); visão de vídeo é cara. Figurinha: sem visão.
- Modelo de resposta: `glm-4.5-air` é bom e barato (o mesmo da MedicMais). `glm-4.6` conversa melhor e custa ~3x. Deixar escolhível no painel.
- Aviso de saldo baixo no Telegram (`zai-saldo\check.mjs`).

## 3. Inteligência (o que fez ele acertar mais)

- **Memória de conversa por cliente** (Postgres Chat Memory, ~24 trocas) + últimas mensagens do app no prompt (inclui o que a equipe escreveu). Sem memória ele se perde em pedido longo.
- **Passos por resposta: 8** (com 4 ele estourava quando o registro dava erro e o pedido sumia).
- **Preço sempre calculado pelo sistema**, nunca pela IA. A ferramenta devolve OK ou ERRO com o que falta; a regra é "corrija só o que faltou, nunca recomece".
- Cardápio vai no prompt como texto vivo do banco (não fica desatualizado). Imagem do cardápio só para mostrar ao cliente.
- **Exemplos de conversa reais** no prompt funcionam melhor do que regras para modelo pequeno. Ex.: "quero uma jantinha de arroz com espeto de alcatra" → arroz + espeto avulsos, R$ 17. Uma regra sozinha ele ignorava; o exemplo e uma nota no próprio texto do cardápio resolveram.
- "O de sempre": ficha do cliente com o último pedido completo + "pedido de sempre" que a equipe cadastra no painel.
- Sinônimos da casa nas Informações (ex.: medalhão = frango com bacon; marmita completa = jantinha completa).

## 4. Jeito de falar (o que o dono pediu)

- Uma mensagem por vez, 1 a 2 linhas. Nada de 2 ou 3 balões.
- Não repetir o que o cliente disse; não listar opções sem ele pedir.
- Perguntar só o que falta, junto: "É entrega ou retirada? E paga no Pix, cartão ou dinheiro?"
- **Confirmação uma vez só, no fim** ("Posso fechar?"). Resposta positiva qualquer ("sim", "pode", "beleza", "👍") já registra. Mudança depois do resumo: só a mudança + novo total.
- Não se apresentar como robô. Limite mantido: se o cliente perguntar sério se é uma pessoa, não afirma que é humano; diz que é o atendimento da casa e oferece alguém da equipe.

## 5. Operação no PC (o PC é o servidor)

- Cada cliente com **WAHA e n8n próprios** (container separado): publicar ou reiniciar um não derruba o outro.
- Executor de Code do n8n engasga no pico ("Task request timed out"): `N8N_RUNNERS_MAX_CONCURRENCY=30`, `N8N_RUNNERS_TASK_REQUEST_TIMEOUT=60` e `retryOnFail` nos Code nodes.
- Vigia (`vigia\vigia.mjs`, a cada 2 min e ao ligar o PC): internet, containers, sessão do WhatsApp (reconecta sem logout) e túnel do painel (troca e grava o endereço novo). Avisa no Telegram.
- Testar sempre numa **cópia que não envia nada** (`WF_ID=...002 WF_PATH=...-teste WAHA_URL=http://127.0.0.1:1`), apontando para o app local.
- Recriar o cardápio (seed) não pode apagar conversas e pedidos: guardar e restaurar antes.
- Parear número: `C:\dev\conectar-whatsapp\iniciar.bat` (QR ou código de 8 dígitos).

## 6. Pedido do restaurante

- Pedido confirmado pelo cliente entra **aprovado** direto na cozinha (imprime) e conta no relatório; a equipe só marca "saiu para entrega" / "pronto" / "entregue" e o cliente recebe o aviso.
- Celular da equipe toca a cada pedido (o WhatsApp da casa manda aviso para outro número).
- Reclamações agrupadas por assunto no painel, só como aviso ao dono.
