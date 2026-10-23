# Vídeo institucional Luiza Rabelo · estado

Pedido do Ribeiro (21/10/2026): vídeo bem animado, com 3D, no padrão do repo do Vítor, para a proposta da Luiza Rabelo. Voz Ana Dias (ElevenLabs), gerada pelo Ribeiro.

## Pronto
- Roteiro para colar no ElevenLabs: `ROTEIRO-ELEVENLABS.txt` (≈1.400 caracteres, ~1min45s). Doc com tutorial: https://claude.ai/artifact/TSNf9xNuam39MSPJssLGdj
- Projeto Remotion em `fonte/` (node_modules fora do /mnt). 1080x1920, 30 fps, 16 cenas presas ao ÍNDICE da palavra (src/tempos.json), então trocar a voz não quebra nada.
  - Cenas: capa (site no celular 3D) · desenho da loja antiga 36 anos + polaroids reais (clientes, fachada Engrenagem) · nome LUIZA RABELO em metal rosé 3D · nova fase (3 fotos) · "a internet precisa acompanhar" · Google hoje (sem dono, sem site, 7 avaliações x 36 anos) · loja online no celular 3D (anel de peças, foto/tamanho, sacola 3D) · pedido no WhatsApp (mensagem real do site) · caixa 3D fecha com selo e vai para o mapa 3D do Brasil · ficha do Google arrumada · placa NFC 3D (modelo azul padrão) + "tim" · 5 estrelas 3D · anúncio Google · pino no mapa local e no Brasil · volta ao desenho (antigo -> loja nova) · fachada 3D com portas que abrem para a loja online.
  - Material: fotos e prints do repo vodetmor/luiza-rabelo-site (site no ar), colagem/desenho dos posts de 36 anos, logos reais (motion-base/logos do Vítor).
- Som: `fonte/tools/audio/audio.py` (trilha original sintetizada em Fá maior 90 BPM + efeitos nas palavras; -14 LUFS; música ~20 dB sob a voz).
- Alinhador: `fonte/tools/alinhar.py voz.mp3 ROTEIRO-ELEVENLABS.txt` -> src/tempos.json (silêncios do ffmpeg casados com a pontuação; testado com erro médio 0,01 s). A nuvem não tem Whisper (HuggingFace bloqueado).

## Como montar quando o mp3 chegar
```
S=<scratch>; cp -r fonte $S/video && cd $S/video && npm i   (versões em package.json; remotion 4.0.370)
python3 tools/alinhar.py voz.mp3 ../ROTEIRO-ELEVENLABS.txt     # regrava src/tempos.json
python3 tools/audio/audio.py voz.mp3                              # out/audio.wav
npx remotion render src/index.ts LuizaRabelo out/mudo.mp4 --gl=angle --concurrency=4 --crf=18
ffmpeg -i out/mudo.mp4 -i out/audio.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart video-luiza-rabelo.mp4
node tools/stills.mjs out/s <quadros...>                          # quadros-chave
```
Prints do celular: `tools/shots.cjs` (precisa do site servido em localhost:8088). Texturas 3D: `tools/tex/gera.py` + `render.cjs`.

## Pendente
- mp3 da Ana Dias (Ribeiro).
- Aprovação dos quadros-chave antes do render final; crítica independente ≥ 8/10.
- Endereço exato ainda a confirmar (o vídeo diz só "Quadra 8, Sobradinho").


## 21/10 07:58
- Prévia completa sem voz (meia resolução, trilha original): previa-sem-voz.mp4. Tempos estimados; com o mp3 real tudo se reajusta pelo alinhar.py.
- Texturas agora são pré-carregadas uma vez no Video (precarregaTexturas em src/tres.tsx); textura nova precisa entrar na lista TEXTURAS.
- Próximo: receber o mp3, rodar tools/alinhar.py, tools/audio/audio.py com a voz, render em resolução cheia e crítica final.

## 21/10 22:40 — versão final entregue
- luiza-rabelo-institucional.mp4 (1080x1920, 103,5 s, voz Ana Dias + trilha, -14 LUFS). Voz original: voz-ana-dias.mp3.
- Alinhamento: tools/alinhar.py + pausas conferidas à mão (pausas-manual.txt, copiar para a pasta do mp3). O casamento automático errava o começo; a lista manual foi conferida por sílabas detectadas (tools/silabas.py).
