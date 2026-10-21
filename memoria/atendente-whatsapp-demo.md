---
name: atendente-whatsapp-demo
description: Como está montado o atendente WhatsApp com IA (demo MedicMais, 20/10/2026), reaproveitável para outros clientes
metadata:
  type: project
  modified: 2026-10-20T02:43:16.251Z
---
Demo do atendente MedicMais pronta em 20/10/2026 para reunião presencial em 21/10. Ribeiro aprovou ("tá lindo").
- Stack no PC do Ribeiro (C:\dev\n8n-atendente, Docker): n8n + WAHA (WhatsApp não oficial, número descartável 55 87 9981-0189) + IA z.ai (GLM) + túnel Cloudflare quick (URL muda ao reiniciar; atualizar N8N_URL na Vercel e .env).
- Banco: Postgres Neon pela Vercel. Painel https://medicmais-painel-demo.vercel.app/app (conta Vercel do PC, vitormachado743-8416; a nuvem/MCP Vercel daqui NÃO alcança essa conta). Painel funciona com PC desligado; só o robô depende do PC.
- Meta Cloud API travou: conta Meta do Ribeiro restrita. Produção deve ser API oficial no número/conta da clínica.
- Ribeiro autorizou painel sem login só para a demo. Pendências pós-reunião: fechar acesso, limpar dados, trocar chave z.ai (passou pelo chat), médicos fictícios no painel.
- Quem constrói no PC é a sessão Remote Control; ela só recebe mensagens do usuário (não dá para mandar mensagem para ela). Não duplicar trabalho dela na nuvem.
- Roteiro: /mnt/project-files/clientes/medicmais/DEMO-ROTEIRO.md. Ver [[agencia-contexto]].
