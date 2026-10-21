---
name: cardapio-saas
description: Cardápio SaaS multi-restaurante (QR+NFC por mesa, cozinha, caixa/comanda, 3D/AR): onde está, stack, decisões e próximos passos
metadata:
  type: project
  modified: 2026-10-16T07:23:24.384Z
---
Produto genérico da agência para restaurantes; primeiro cliente: Central do Espeto (Sobradinho-DF, @centraldoespetof, impressora Bluetooth 58 mm portátil).
- Código: PC do Ribeiro em C:\dev\cardapio-saas (sem git ainda; não publicar fora do PC sem ele pedir). Cópia em /mnt/project-files/interno/cardapio-saas/app/. Pesquisa: interno/cardapio-saas/PESQUISA-3D-AR-GITHUB.md.
- Stack (16/10/2026): Node >=22.5 sem dependências (node:sqlite, http nativo, SSE), front HTML+ES modules, model-viewer e qrcode-generator vendorizados. `npm run seed`, `npm start`, `npm test` (20 checagens), `iniciar.bat`.
- Decisões: pagamento no caixa ao fechar a comanda (não no celular); QR e NFC juntos; token opaco por mesa; modo anti-trote require_open_table; impressão: navegador (--kiosk-printing), Web Bluetooth BLE ou RawBT.
- Produção sugerida: Node em Railway/Render/VPS + Postgres (Supabase/Neon); ou Vercel + Supabase Realtime. Próximos: Pix no fechamento, adicionais por produto, papéis de equipe.
- v2 (16/10 noite) após críticas duras do Ribeiro: abre direto no cardápio (/ → mesa 1; equipe em /painel), sem PIN (STAFF_PIN=1 liga), tema 'premium' (escuro, cards pretos, ref. favorita dele) e 'claro'; ingredientes por prato que o cliente tira + observação, cozinha mostra "SEM ...". Demo fictício Brasa Nobre (não usar cliente real com preço inventado). Regras em docs/LICOES.md: ler antes de mexer no visual; testar em 390 px e mandar print.
- Fotos reais: `npm run fotos` (scripts/fotos.js) busca no Pexels e salva em uploads/<slug>/; roda sozinho no iniciar.bat. Chave no .env do PC (PEXELS_API_KEY). Pexels é bloqueado na nuvem e na VM: só roda no PC de verdade.
- v3 (17/10): 3D por IA = Higgsfield sam_3_3d (1 crédito/prato, GLB texturizado; image_to_3d custa 20-30); 12 pratos do demo têm 3D, baixados para uploads/ pelo npm run fotos. Nome do cliente opcional (padrão só mesa, decisão do Ribeiro); senha = nº do pedido + fila; filtros Mais pedidos/Econômicos/Em 3D; layout desktop; foto do prato na cozinha.
- Repo GitHub próprio do projeto (guardar conhecimento): Ribeiro quer, mas "depois"; não criar sem ele pedir.
- Licenças: restro é AGPL (só ideias); DishAR/restofy/MesaZap sem licença (só ideias); qr-restaurant e QRMeal MIT.

## v4 deploy (17/10)
- App agora roda com SQLite (PC) ou Postgres (DATABASE_URL/POSTGRES_URL, Neon na Vercel). api/index.js + vercel.json; /plataforma = hub da demo; agência em /agencia.
- Na Vercel: tempo real por polling 2 s (tabela events), upload desligado, demos criados no primeiro acesso (src/demo.js, SEED_VERSION 4).
- Assets da demo em public/demo/ (Pexels bons + IA baixada no build por scripts/assets.js). iniciar.bat roda assets+seed (não roda mais fotos).
- Repo: vodetmor/brasa-nobre (privado), publicado via Remote Control no PC (Ribeiro pediu conta vodetmor).
- NO AR (17/10): https://brasa-nobre.vercel.app (time Vercel vitor-machado-neves-projects, banco Neon brasa-nobre-db). Cozinha /r/brasa-nobre/cozinha, hub /plataforma (public/plataforma-demo.html). Deploy automático pelo push no repo. No PC, git do repo usa autor Vítor (o global "MoltBot" bloqueia deploy na Vercel).
- v6 (17/10): /indice = mapa de tudo (restaurantes fictícios Brasa Nobre + Bistrô Jardim, cada tela explicada) para vender; /plataforma e /painel redirecionam para /indice. Painel por restaurante /r/<slug>/painel com dashboard hoje/7d/30d (API /dashboard). Maquininha: só simulada (src/lib/payments.js, PAYMENT_PROVIDER); Ribeiro disse que integração real não é para agora. Contato (WhatsApp + vCard) no cardápio. Conta por pessoa no caixa.
- Enviar código ao PC: device_commit_files de um .tgz em /mnt/project-files + tar --overwrite no device_bash; git/push via Remote Control (VM não apaga arquivos).
- v7 (17/10, no ar): voltar do Android fecha overlay; AR com ar-scale fixed e GLBs reduzidos a ~28 cm (assets.js reduz no build). /r/<slug>/painel = todas as telas em abas sem recarregar (NFC só em /admin direto). Push na main exige mensagem escrita do Ribeiro ao RC (reação não vale).
- v8 (17/10, no ar): botão Contato na barra de baixo abre página tipo linktree no visual do cardápio (WhatsApp, Instagram, TikTok, Facebook, iFood, Site, Como chegar, Salvar contato; campos em Cardápio e mesas > Contato). Demos com @ fictícios (@brasanobre.demo). Pendente para depois: modo simples do admin para o dono (Ribeiro achou Cardápio e mesas complexo; agência configura).
- AR (17/10 tarde, f085da7): Ribeiro achou 28 cm fixo pequeno e igual para tudo. Agora tamanho por tipo, só no arquivo .glb: jantinha/pf 32 cm, espetinhos 30, porções 20, avocado 12. Cozinha RC só recebe mensagens do Ribeiro no thread; para dar contexto, reiniciar RC com instructions.
