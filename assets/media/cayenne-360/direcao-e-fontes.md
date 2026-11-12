# Cayenne 360 — estudo visual, 11/11/2026

A imagem-base foi gerada com image_gen nativo, sem referência visual da TurboSquid. Não é foto de veículo do estoque nem modelo 3D. A identificação exata do ano/versão não foi validada. Não há vídeo nem sequência 360 gerados.

Prompt: Original photorealistic automotive studio photograph of a metallic silver 2024 Porsche Cayenne Turbo GT Coupe, accurate factory proportions, Porsche crest, black factory multispoke wheels and carbon roof. Front-left three-quarter, front facing left, 70mm lens, full car centered with generous margins. Pale cool gray seamless cyclorama, matte floor, soft natural shadow, smooth strip-light reflections, no faceted or dented surfaces, no warm tint, text, watermark or dealership logos. Highest detail, wide 16:9 composition, intended as first-frame reference for a turntable.

## Fontes examinadas
- https://www.hitechblindados.com.br/tecnologia/ — conteúdo técnico para os seis painéis.
- https://www.turbosquid.com/pt_br/3d-models/porsche-cayenne-turbo-gt-2024-3d-2114782 — SQUIR, US$159, 1.063.000 polígonos; ficha marca Apenas usos editoriais. Nenhum arquivo comprado ou usado.
- https://sketchfab.com/3d-models/2022-porsche-cayenne-turbo-gt-74fbea5a4dfc4197839fdd2bf654369a — licença atual CC BY-NC-SA na API primária, divergente do catálogo carros. Arquivo removido da pasta pública e não usado.
- https://sketchfab.com/3d-models/porsche-cayenne-d1fd357faf314607afc39a67d5b4f4f1 — Mona x Supercars; CC BY 4.0 na API primária, 985.468 triângulos. Download requer conta; não baixado.
- https://virtualcar360.com/en/spin360/ — referência de experiência, sem reutilização dos arquivos.

Higgsfield: consulta retornou 0 créditos, plano free, sem geração ilimitada; 1 tentativa Genjutsu limitada a 720p e 30s, inadequada para este objetivo de giro com zoom. Nenhuma geração ou compra feita nesse serviço.

## Implementação local
blindagem-v2.html preserva a original. Estrutura de painéis e visualizador construída; modelo definitivo aguarda seleção. O Compass foi rejeitado por qualidade. A V2 exibe imagem estática e painéis funcionais, sem fingir giro ativo.

Próxima etapa: obter um modelo com qualidade e permissão compatíveis, calibrar hotspots e câmera para ele, testar desktop/mobile e eventualmente renderizar 36–72 quadros da mesma cena. Se usar vídeo, validar geometria e continuidade da volta antes de extrair quadros; mais quadros não corrigem deformações de IA. Abrir porta requer peças separadas/animação; giro por imagens não equivale a geometria 3D.
