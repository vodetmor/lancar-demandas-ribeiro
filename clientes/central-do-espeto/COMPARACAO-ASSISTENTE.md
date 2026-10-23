# Assistente WhatsApp: o que a MedicMais faz e a Central do Espeto não (22/10/2026)

Comparação só de leitura dos dois fluxos do n8n e da configuração do robô. Nada foi alterado. Quem aplica é a conversa "Atendente WhatsApp Central do Espeto".

**Atenção:** o robô da Central está DESLIGADO no painel (robot_on = false).

Ordem sugerida: 1, 2, 3, 4 e depois 5 e 6.

## 1. Limite de passos
É o suspeito nº 1 de as conversas não virarem pedido.

- A Central permite só 4 passos por resposta (maxIterations 4). A MedicMais usa 10.
- Se o registrar_pedido dá erro e a IA tenta de novo, estoura o limite.
- O cliente recebe "Só um instante, já te respondo" e o pedido não entra.
- Correção: subir para 8 a 10.

## 2. Informações da casa vazias
- O campo "Informações da casa" está em branco: não tem horário, se entrega, taxa, tempo de entrega nem a chave Pix.
- Faltam os dados do Ribeiro para preencher.

## 3. Memória
- A Central recebe só as últimas 12 mensagens, cortadas em 240 caracteres e coladas como texto nas instruções.
- A MedicMais guarda a conversa no Postgres e lembra das últimas 30 trocas inteiras, inclusive o que as ferramentas devolveram.
- Em pedido longo, o começo da conversa se perde.

## 4. Regra de dia e horário
- O "seg a sex, almoço" só existe no nome da categoria.
- Falta a regra: aos sábados oferecer a feijoada (R$ 25), e PF e pratos da casa só de segunda a sexta, no almoço.
- A feijoada ainda não está no cardápio no ar.

## 5. Consulta ao vivo
- A Central não tem ferramenta para consultar o cardápio ou um pedido.
- O enviar_cardapio manda imagens fixas, que podem estar desatualizadas (faltam as guarnições novas e a feijoada).
- A MedicMais usa consultar_horarios com a regra "use SEMPRE, nunca invente".

## 6. Funil
- A Central não tem algo como o atualizar_lead da MedicMais.
- Ela só registra no fechamento, então não dá para ver quem desistiu no meio.

## 7. Instruções
- A Central (Rafaela) tem cerca de 7.600 caracteres, montados em blocos, sem exemplos de conversa de restaurante ("tem marmita?", "quanto é?", "o de sempre").
- A MedicMais tem cerca de 9.400 caracteres, num texto único, com casos de pedido vago, objeção e emergência.

## 8. Alternativas para foto e vídeo
- A Central tem menos alternativas quando o processamento de foto ou vídeo falha.
- A MedicMais tenta o Groq e, se falhar, usa a z.ai.

## Os dois já fazem
- Passam a conversa para a equipe e pausam quando a equipe assume.
- Transcrevem áudio.
- Juntam mensagens seguidas (a Central espera 9 s).
- Simulam digitação e dividem a resposta em partes.

## Outro ponto
- O src/db.js precisa tentar de novo quando a conexão com o Neon cai (ECONNRESET).
