---
name: cardapio-central-do-espeto
description: Estado do cardápio da Central do Espeto no app brasa-nobre.vercel.app (20/10/2026): dados reais, prato feito com escolhas, links fixos das mesas
metadata:
  type: project
  modified: 2026-10-21T01:16:09.903Z
---
Em 20/10/2026 o app [[cardapio-saas]] passou a abrir na Central do Espeto (cliente real) em https://brasa-nobre.vercel.app/ (padrão `DEFAULT_SLUG` = central-do-espeto). Brasa Nobre e Bistrô Jardim continuam como exemplos.
- Dados vêm só do que o Ribeiro mandou (cardápios impressos): PF R$ 20 montado (parmegiana +R$ 5) e pratos da casa Central/Sertanejo/Fit R$ 20, ambos "seg a sex, almoço"; 13 espetos R$ 12; jantinha completa R$ 20 (escolhe espeto) e sem espeto R$ 13; 9 guarnições; 11 bebidas (SEED_VERSION 11, 20/10). Feijoada aos sábados: falta o preço. WhatsApp 61 99611-5754, QD 08 frente à Melancia, @centraldoespetof, slogan "Sabor de verdade, feito com amor!".
- Recurso novo: campo `options` no produto (uma linha por grupo, "+5" soma R$ 5); o servidor valida e calcula; cozinha/caixa/ticket mostram as escolhas.
- Fotos (21/10, SEED 12): regra do Ribeiro = só foto real nos pratos, nada de IA/Google (capa pode ficar). Reais: PF (Instagram), capa, contra-filé, arroz, arroz com brócolis (fotos dele + 3D Higgsfield sam_3_3d). Demais pratos mostram só a inicial. Guardados sem uso no repo: cupim (não há espeto de cupim; perguntado se vai no Central), vinagrete (não está no cardápio), feijoada (ce-feijoada-2 = prato montado; espera preço). Originais em github rruandev/cardapio- branch fotos-central-do-espeto.
- Painel refeito 21/10 no formato da MedicMais (menu lateral no PC, 5 abas no celular) com as cores da Central; aba "Robô do WhatsApp" (#robo-slot) é da thread do atendente. Isso já é produção, com o PC do Ribeiro de servidor: não parar processos nem desconectar o WhatsApp.
- Thread não consegue mandar mensagem para a sessão RC; usar start_rc_session com instructions no próprio thread (reacorda a sessão parada). Pendências: telas da equipe sem PIN (ligar STAFF_PIN=1 na Vercel quando o cliente fechar).
- Links das mesas (NFC) são fixos: o seed preserva o token de cada mesa. Mesa 1 = /m/fv8STBGg (lista completa no thread "Cardápio Central do Espeto").
- Deploy: push em vodetmor/brasa-nobre publica sozinho na Vercel; `vercel --prod` é bloqueado pelo modo automático do PC. Código de cliente fica em src/demo.js enquanto for demo (mudar SEED_VERSION recria e apaga pedidos).
- Impressora do balcão: Elgin/Bematech i8 USB 80 mm num PC Windows. Caminho: driver + impressora padrão + atalho Chrome `--kiosk-printing --user-data-dir=C:\cozinha-chrome --app=.../r/central-do-espeto/cozinha`, modo "Impressora do sistema" 80 mm (passo a passo enviado 20/10). docs/IMPRESSAO.md ainda fala de BLE 58 mm: atualizar.
- A nuvem e a VM de pastas não abrem *.vercel.app nem o CDN da Higgsfield; conferir no ar pela sessão Remote Control.
