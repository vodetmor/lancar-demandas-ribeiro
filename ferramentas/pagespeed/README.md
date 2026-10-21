# Medir desempenho (PageSpeed / Lighthouse)

Regra da agência: todo site publicado passa por aqui, celular e PC, e só fica pronto com **90+ no celular**. Melhorar desempenho **não pode custar design**: se 90 exigir mudar o visual, manter o design e anotar o motivo.

## Uso
```
node medir.mjs https://site.vercel.app/            # celular + PC
node medir.mjs pasta/do/site --modo celular        # mede a pasta local (servidor com gzip, parecido com a Vercel)
node medir.mjs --lista sites.txt                   # todos os sites publicados
```
Saída: 2 linhas de notas por modo + os problemas que mais pesam. JSON completo e `historico.csv` ficam em `resultados/`.

- Lighthouse 12 é instalado sozinho na 1ª vez em `~/.cache/pagespeed` (Node 22+).
- Com `PSI_KEY` no ambiente, URLs são medidas pela API do PageSpeed do Google (mesmo número do site pagespeed.web.dev). Sem chave, roda o Lighthouse local (Chromium da nuvem ou Chrome do PC).
- Na nuvem, `*.vercel.app` é bloqueado pela rede: medir pasta local, usar `PSI_KEY` ou rodar no PC.

## Ciclo por lançamento
1. Medir. 2. Corrigir o que aparece no topo (sem mudar o visual). 3. Medir de novo até 90+. 4. Publicar e medir a URL real.

## Correções que mais resolvem (sem mexer no design)
- Fontes do Google bloqueando render: `preconnect` + carregar CSS com `media="print" onload="this.media='all'"` (ou hospedar woff2 local com `font-display: swap`), e cortar pesos não usados.
- Imagem do topo (LCP): `<link rel="preload" as="image" fetchpriority="high">`, sem `loading="lazy"`, com `width/height`.
- Imagens: WebP/AVIF no tamanho exibido (`srcset`), `loading="lazy"` abaixo da dobra.
- JS: `defer` em todo script; nada bloqueando o `<head>`.
- Vercel: `vercel.json` com `Cache-Control` longo para `/img`, `/css`, `/js`.
