# Tipografia da Hi-Tech — 11/11/2026

Aplicada ao institucional de nove páginas deste repositório: início, empresa, blindagem, homologações, assistência, estoque, contato, documentos e detalhe do veículo. A versão antiga de três páginas na raiz da pasta do cliente não faz parte desta alteração.

## Escala aplicada

Fonte: Geist. Valores em pixels, no formato tamanho/entrelinha.

| Papel | Até 600 px | 601–1080 px | Acima de 1080 px |
|---|---|---|---|
| Título principal ou de seção | 32/40 | 40/48 | 48/56 |
| Título editorial secundário | 24/32 | 28/36 | 32/40 |
| Título compacto (veículo, informação, proposta) | 24/32 | 24/32 | 24/32 |
| Título pequeno (etapa, fato, acordeão, simulador) | 20/28 | 20/28 | 20/28 |
| Texto corrido | 16/24 | 16/24 | 16/24 |
| Texto auxiliar, navegação e ação | 14/24 | 14/24 | 14/24 |
| Legenda e metadado curto | 12/16 | 12/16 | 12/16 |

Títulos principais preservam o contraste entre peso 700 e trechos 300. Títulos editoriais e compactos usam 400; pequenos e controles usam 500. Tracking de títulos: −0,025 em; texto-base: −0,006 em. Rótulos em caixa-alta mantêm seu espaçamento próprio.

Os números de destaque da fábrica, datas, preços e resultados do simulador são papéis próprios, não títulos editoriais. Especificações curtas de cards usam 12/24 para acomodar ícones. Campos de formulário permanecem em 16/24. Não reduzir o texto corrido para fazê-lo caber no celular.

## Relações de espaçamento

- Título → descrição e parágrafo → próximo parágrafo: 16 px.
- Texto → ação: 24 px.
- Cabeçalho → coleção de cards: 48 px; controles intermediários, quando presentes, têm seu próprio agrupamento.
- Rótulo → campo: 8 px. Ações do formulário: 24 px após o item anterior.
- Listas, legendas, ícones, metadados e controles internos têm espaçamento próprio; não aplicar 48 px indiscriminadamente a cada item.
- O padding externo das seções foi preservado, incluindo os 96 px por lado no desktop. Não confundir esse valor com a soma dos dois lados.

Na home, o `text-box` existente e o ajuste de fechamento das caixas em múltiplos de 8 px continuam ativos. Não recriar margens para compensar visualmente a métrica da fonte.

## Onde alterar nas próximas revisões

As variáveis compartilhadas ficam em `assets/styles.css`. Regras específicas permanecem em `institucional.css`, `empresa.css`, `materiais.css` e `home-rhythm.css`. Cards de veículo e rodapé recebem a mesma tipografia em todas as páginas; foram removidas as exceções tipográficas exclusivas da home.

Ao adicionar um componente, escolher seu papel na tabela e reutilizar as variáveis correspondentes. Corrigir a regra que origina a diferença; não acrescentar um bloco de overrides por página nem mudar a tag semântica apenas para obter outro tamanho.

## Verificação executada

- Nove páginas em 320, 390, 600, 601, 900, 1080, 1081 e 1440 px: **72 combinações**, sem falhas nas verificações executadas.
- 5.662 amostras de tipografia, com conferência de tamanho/entrelinha, fonte carregada, espaços de texto, alguns agrupamentos e overflow horizontal.
- Capturas completas das nove páginas em 390 e 1440 px; revisão visual de hierarquia, cards, conteúdo e formulários.
- Busca por Porsche retornou dois veículos; busca sem correspondência apresentou o estado vazio; limpeza restaurou o estoque.
- Menu móvel, filtros expandidos e acordeão conferidos. O simulador respondeu à alteração por teclado.
- Sintaxe de JavaScript e `git diff --check` sem erros.

O teste de leitura do DOM está em `tests/typography.js`. Para reutilizá-lo, atribua a função do arquivo a `const auditar = …` no console da página, aguarde `document.fonts.ready` e execute `auditar()`. `failures` deve ficar vazio. A verificação de geometria usa as caixas renderizadas e não substitui a inspeção visual.

Evidências ficam na pasta irmã `../tipografia-2026-11-11/`: `antes.json`, `verificacao-final.json`, `interacoes.json`, capturas `depois-*` e `previa-padronizacao.png`. Os JSONs numerados anteriores são etapas intermediárias; a referência final é `verificacao-final.json`.

Validação realizada no navegador integrado. Safari, Firefox, aparelhos físicos e zoom de 200% não foram conferidos. O suporte a `text-box` pode produzir diferenças ópticas entre navegadores. Nenhum formulário foi enviado e nenhuma alteração foi publicada.
