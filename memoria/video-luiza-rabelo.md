---
name: video-luiza-rabelo
description: Institutional 3D video for Luiza Rabelo proposal (Oct 2026): where the Remotion project, script, aligner and audio pipeline live and how to finish it
metadata:
  type: project
  modified: 2026-10-21T06:49:11.636Z
---
Started 2026-10-21 (thread "Vídeo institucional Luiza Rabelo"). Ribeiro generates the voice (ElevenLabs, Ana Dias, Multilingual v2) from `/mnt/project-files/clientes/luiza-rabelo/video-institucional/ROTEIRO-ELEVENLABS.txt` and sends the mp3; Claude builds the rest. Status/how-to: `video-institucional/ESTADO.md` (read first).
- Remotion project source in `video-institucional/fonte/` (16 scenes keyed to WORD INDEX in src/tempos.json; 3D via @remotion/three, --gl=angle). Build node_modules in scratch, never on /mnt.
- Cloud blocks *.vercel.app, HuggingFace (no Whisper), edge-tts, scottbuckley.com.au; npm registry works. Site assets come from repo vodetmor/luiza-rabelo-site (add_repo works). Music is synthesized (tools/audio, synth.py from Vítor's repo).
- Gotcha: three textures loaded after the canvas first draws render black unless the canvas is invalidated after load (Renovador in src/tres.tsx). Textures > 8192 px get downscaled: crop tall screenshots.
- 2026-10-21 22:40: FINAL delivered: video-institucional/luiza-rabelo-institucional.mp4 (103.5 s, Ana Dias voice). Silence-only auto alignment misplaced early pauses; fixed with hand-checked pausas-manual.txt (verified via syllable peaks, tools/silabas.py). Any re-render: copy pausas-manual.txt next to the mp3 before alinhar.py. No rsync in the container: copy with tar. GOTCHA: Remotion mp4 already has a SILENT aac track; when muxing the mix always use -map 0:v -map 1:a (the first delivery went out mute because of this).
- Related: [[cliente-luiza-rabelo]], [[agencia-contexto]].
