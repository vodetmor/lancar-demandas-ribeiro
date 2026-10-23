# Atendente de WhatsApp com IA · MedicMais Sobradinho

Estudo de 16/10/2026. Objetivo do Ribeiro: atendimento humanizado que conduz o paciente até a consulta marcada, com o menor custo mensal possível, construindo a estrutura em código próprio.

## Recomendação

| Peça | Escolha | Custo/mês (800 conversas) |
|---|---|---|
| WhatsApp | API oficial da Meta (Cloud API), direto, sem intermediário | R$ 0 fixo |
| Respostas ao paciente | Mensagens de atendimento dentro da janela de 24h | Grátis |
| Lembretes de véspera | Mensagem modelo "utilidade" (~R$ 0,04 a 0,05 cada) | ~R$ 25 (500 lembretes) |
| IA | Claude Haiku 5.5 com ferramentas (ver horários, marcar, chamar recepção) | ~R$ 32 |
| Servidor | VPS pequena (Hetzner/Contabo) com Node + SQLite | ~R$ 35 |
| Agenda | Banco próprio + Google Agenda (API grátis) para a recepção ver | R$ 0 |
| **Total para rodar** | | **≈ R$ 90 a 100** |

Conta da IA: Haiku 5.5 custa US$ 0,10 por milhão de tokens de entrada e US$ 0,50 de saída (abaixo de 100 mil tokens por chamada). Uma conversa de ~10 mensagens gasta ~60 mil tokens de entrada (regras + histórico, com cache) e ~2 mil de saída: ~US$ 0,007, cerca de R$ 0,04. Com folga para erros e conversas longas, R$ 30 a 40/mês.

## Por que não as alternativas

- **API não oficial (Baileys, Evolution API, WPPConnect):** grátis, mas o número pode ser banido. É o número principal da clínica; não vale o risco.
- **Plataformas prontas (Blip, Take, BotConversa, ManyChat, Kommo):** R$ 150 a 600/mês por clínica, mais IA à parte, e o fluxo fica preso à ferramenta. Código próprio sai mais barato a partir do 2º cliente e vira produto da agência.
- **Intermediário oficial (BSP como 360dialog, Twilio, Gupshup):** cobra mensalidade ou 10 a 35% sobre as mensagens. A Cloud API direta dispensa isso.

## Como funciona

1. Paciente manda mensagem → Meta chama nosso webhook (servidor Node).
2. Servidor busca o histórico da conversa no banco e chama a IA com as regras da clínica e 3 ferramentas: `ver_horarios`, `marcar_consulta`, `chamar_recepcao`.
3. A IA só oferece horário que a ferramenta devolveu; marca no banco e no Google Agenda; manda o resumo com endereço.
4. Véspera: rotina diária manda o lembrete (1 confirma, 2 remarca). Falta e remarcação ficam registradas no CRM.
5. Urgência, reclamação, convênio ou pedido de humano: o robô pausa e avisa a recepção.

## Pontos a confirmar na implantação

- **Mesmo número no celular e no robô:** a Meta tem o modo "coexistência", que liga o número do WhatsApp Business do celular à API sem perder o app. Confirmar se o número (61) 99825-5551 é elegível; se não for, usar um número novo só para o robô.
- **Verificação da empresa na Meta:** exige CNPJ ativo. O CNPJ está **Inapto** desde 27/05/2026 (ver proposta anterior). Sem regularizar, a conta fica limitada (envio de modelos restrito). Isso vira pré-requisito do projeto.
- Agenda real: quais profissionais, dias, horários e duração de cada serviço; convênios aceitos.
- Preços: o robô não informa valor; leva para a avaliação gratuita. Confirmar com a clínica.
- Cobrança BRL da Meta começa no 2º semestre de 2026; os valores por mensagem acima são estimativas de mercado, conferir na tabela oficial antes de fechar contrato.

## O que aproveitamos do vídeo de referência

Vídeo "Agente IA WhatsApp | Setup Completo com Claude Code" (Thalena Lima, 24 min), enviado pelo Ribeiro em 16/10.
- **Aproveitado:** VPS sempre ligada (ela usa Hostinger KVM 2, cerca de R$ 40 a 44/mês no plano anual), o agente rodando como serviço com PM2, ajustes futuros feitos com o Claude Code dentro do servidor, e o "modo teste", que no começo só responde a números liberados.
- **Configuração do webhook:** ignorar grupos e as mensagens do próprio número, para o robô não responder a si mesmo.
- **O que fazemos diferente:** usamos a API oficial em vez da não oficial, pelo risco de ban. A conversa fica salva no banco, porque na demo dela a memória some quando o servidor reinicia. Também temos a passagem para a recepção e o registro no CRM. Usamos HTTPS e validamos a assinatura da Meta no webhook, que na demo dela é IP com porta aberta. E o robô não ignora o paciente depois de marcar: ele retoma a conversa.
- **No protótipo:** entrou a etapa do paciente (novo contato, conversando, escolhendo horário, agendado, com a recepção).

## Protótipo

- Página de demonstração (simulação, não envia mensagem real): https://claude.ai/artifact/8CsqVF9aL1C69JYSqvwn3m
- Arquivo: `prototipo-atendente/index.html`. A conversa ao vivo usa a IA do claude.ai de quem abre; o botão "Ver conversa de exemplo" roda sem IA.
- As regras de atendimento e as 3 ferramentas do protótipo são as mesmas que vão para o servidor.

## Fontes

- Meta, preços da plataforma: https://developers.facebook.com/docs/whatsapp/pricing
- Estimativas de preço por mensagem no Brasil: https://www.messagecentral.com/blog/whatsapp-business-api-pricing-in-brazil
- Preço do Haiku 5.5: https://apidog.com/blog/claude-haiku-5-5-pricing/ (conferir na página oficial da Anthropic)
