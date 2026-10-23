---
name: transcricao-audios
description: Como transcrever áudios .ogg do Ribeiro (nuvem não baixa modelo Whisper)
metadata:
  type: reference
  modified: 2026-10-23T17:02:15.284Z
---

A nuvem bloqueia huggingface.co e openaipublic (modelo Whisper não baixa); instalar pacote npm com modelo foi barrado pelo classificador. A VM de pastas do PC não tem rede.
Caminho que funciona (23/10/2026): copiar o áudio para /mnt/project-files/interno/audios/, device_commit_files para C:\dev\cardapio-saas\_audios\, e pedir a transcrição numa sessão Remote Control no PC (faster-whisper num venv em C:\dev\_whisper). Ver [[pc-do-ribeiro]].
