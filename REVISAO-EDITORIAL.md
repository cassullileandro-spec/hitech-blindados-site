# Revisão editorial — 11/11/2026

A referência aprovada é a home: fotografias grandes, texto integrado às imagens, fundo escuro e uma hierarquia curta. A revisão substitui a fragmentação da página de Blindagem; não adiciona outro conjunto de estilos sobre o anterior.

## Blindagem

- Nova sequência: abertura → três fundamentos em cards fotográficos → processo em quatro etapas → assistência → perguntas técnicas → orçamento.
- Fotografias já presentes no projeto substituem a mistura de ilustrações e renders na apresentação principal.
- A copy foi encurtada, com materiais, sobreposições, compatibilidade, inspeções, prazo e garantia reunidos em seis perguntas expansíveis nativas.
- Mantidos os destinos de orçamento, assistência, homologações e documentação e as âncoras tecnologia, materiais, processo, cuidados e integracao.
- `assets/materiais.css` foi reescrito para a composição atual. Não há novas dependências ou lógica JavaScript.

## Demais páginas

Empresa, Assistência, Homologações, Documentação e Contato receberam textos de introdução mais diretos. Painéis decorativos de serviços, políticas, documentos, revisões e marcas deram lugar a composição aberta com divisórias discretas. Formulários, contatos e catálogo mantêm agrupamentos funcionais. A home permanece como referência visual e seu conteúdo não foi reescrito nesta revisão.

## Contrato

Fontes, tamanhos e entrelinhas usam os tokens existentes. Texto/texto: 16 px; texto/ação: 24 px; cabeçalho/coleção: 48 px. Seções preservam 96 px por lado no desktop e o contrato responsivo existente. Cards principais: três colunas acima de 1080 px, uma coluna abaixo; 24 px de padding; altura mínima de 560/400 px. A faixa fotográfica de assistência tem altura mínima própria para compor imagem e leitura. Informações técnicas usam altura natural.

## Validação realizada

- Blindagem: 320, 390, 600, 601, 860, 861, 1080, 1081 e 1440 px, com as perguntas fechadas e abertas. Sem falhas na auditoria tipográfica, de distâncias de texto e de overflow.
- Outras cinco páginas institucionais: as mesmas larguras, incluindo 760 e 761 px; 55 verificações sem falhas.
- Home, estoque e veículo: regressão em 390 e 1440 px sem falhas.
- Revisão visual em desktop e celular; abertura das seis respostas e interação por teclado conferidas.
- Nove arquivos HTML: IDs únicos e destinos de arquivos locais existentes. `git diff --check` e `node tests/estoque.cjs` aprovados; estoque permanece com 55 anúncios e 645 fotos.
- Evidências e cópias recuperáveis em `../blindagem-editorial-2026-11-11/`.

Alterações locais, sem publicação. Não foram testados aparelhos físicos, Safari, Firefox ou zoom de 200%. As condições comerciais e técnicas foram reorganizadas a partir do conteúdo existente, sem nova validação comercial externa.

## Continuação — identidade unificada e modo claro (11/11/2026)

Esta etapa substitui as composições intermediárias descritas acima. Home e Blindagem passam a compartilhar componentes com Empresa, Assistência, Homologações, Documentação e Contato: títulos com texto de apoio, cards fotográficos, seções de imagem e texto, listas numeradas e perguntas expansíveis. As fotografias são do acervo existente. Políticas da empresa, condições de atendimento, revisões e contatos foram preservados.

- Assistência: três serviços em cards, plano de revisões, perguntas e faixa de atendimento na Moóca.
- Empresa: três pilares, galeria da estrutura, compromissos e políticas expansíveis, convite para contato.
- Cards fotográficos compartilhados: altura mínima 520 px no desktop e 400 px no responsivo; documentos/unidades usam 600 px para acomodar conteúdo.
- Home, estoque e veículos semelhantes usam `carCard()` e as mesmas regras CSS, sem dimensões ou tipografia alternativas da home. Comparação de estilos computados confirmou igualdade de fundo, bordas, padding, proporção da imagem, fontes e espaçamentos.
- Modo claro padrão nas nove páginas; botão no cabeçalho alterna e salva a preferência. Inicialização antes do CSS evita troca de tema na navegação. Armazenamento indisponível não impede o funcionamento.
- Superfícies, menus, filtros, formulários, cards e rodapé possuem cores compartilhadas para os dois temas. Textos sobre fotografias e galeria ampliada conservam contraste independente.

Validação: 90 cenários (9 páginas × 390/768/1080/1081/1440 px × claro/escuro), sem falhas na auditoria de tipografia, espaçamentos de texto e overflow. Testes do estoque e do tema aprovados. Menu móvel, busca por Corolla, perguntas, carrossel da empresa, galeria ampliada e persistência após recarregar conferidos no navegador. Links locais verificados, `git diff --check` aprovado. Evidências em `../identidade-unificada-2026-11-11/depois/`; cópias anteriores em `antes/`.

Não publicado. Não foram testados aparelhos físicos, outros motores de navegador ou envio real dos formulários.

## Acabamento dos temas e tratamento fotográfico — 11/11/2026

Direção refinada pelo usuário: modo claro neutro, sem branco puro nas superfícies nem logo preta. Fundo `#F9F9F9`, superfícies `#F7F7F7`/`#F6F6F6`, gradientes de painéis `#F9F9F9 → #F6F6F6`, texto principal `#414141`, secundário `#626262`, auxiliar `#707070`. Botões primários usam cinza `#555555`; hover e bordas agora respondem aos tokens do tema. A logo usa filtro SVG no modo claro: partes neutras em `#666666`, preservando o azul original. No escuro permanece o arquivo original.

Fotos editoriais recebem uma camada CSS `#3E9BE0`, opacidade `0.5`, `mix-blend-mode: color`, isolada da página e atrás dos textos/degradês de leitura. Cobertura: aberturas institucionais, cards, faixas, fábrica, processo e carrossel da empresa. Imagens dos anúncios, galerias de veículos, categorias e abertura do estoque não recebem a camada. Nenhum arquivo de fotografia foi alterado.

Nove páginas conferidas por estilos computados: fundo claro correto, fotos editoriais cobertas, imagens do catálogo sem camada, sem overflow desktop. Conferência visual da assistência e estoque no claro, empresa no escuro móvel (390 px). Teste do tema, sintaxe do JavaScript e diff check aprovados. Evidências e cópias em `../acabamento-temas-2026-11-11/`. Alterações locais; sem publicação ou teste em outros motores de navegador.

Refinamento posterior: opacidade da camada azul reduzida de 50% para 20%, a pedido do usuário. Mantidos azul #3E9BE0, blend color, fotografias reais e exclusões do catálogo.

Ajuste de preferência: fundo principal e cabeçalho retornam ao branco quente anterior (#FAF9F6). Cores atuais das fontes e logo preservadas; filtro azul permanece em 20%.


## Revisão final de cards e acabamento móvel — 11/11/2026

Preferência atual substitui os fundos anteriores: fundo claro frio `#F4F6F8`, faixas secundárias `#EEF1F4`, sem tom creme. Cards de veículos, categorias, dados, etapas, compra, simulação e contato usam superfície sólida `#F9F9F9`, com borda discreta. Fotos continuam com a camada azul de 20%. Cores das fontes e logo aprovadas foram mantidas; placeholders dos formulários agora seguem o token auxiliar em ambos os temas. Botões de preenchimento claro usam branco neutro/frio.

Auditoria de 108 cenários: nove páginas, seis larguras (320, 360, 390, 430, 768 e 1440 px), dois temas. Sem falhas de tipografia, espaçamento entre textos, overflow, cor dos cards, camadas fotográficas ou posicionamento dos controles do cabeçalho. Revisão visual móvel de documentação, ficha de veículo e contato nos temas correspondentes. Teste de inicialização do tema aprovado. Arquivos e evidências: `../revisao-cards-2026-11-11/`.

Sem publicação. Validação no navegador de prévia; aparelhos físicos, Safari e Firefox não testados.


## Empresa — bento de compromissos (11/11/2026)

Seção `#compromissos` reorganizada em um único grid de cinco blocos. Desktop: fotos em 7/5 colunas e 384 px mínimos, três cards de conteúdo em 4/4/4 colunas abaixo. Tablet intermediário: duas colunas e transparência em largura total. Até 860 px: uma coluna, imagens com 360 px mínimos e conteúdo com altura natural. Os oito itens das políticas e o destino do PDF foram preservados; informações agora visíveis sem acordeões. Mantidos tokens de fontes, paleta, cards F9 e tratamento fotográfico aprovado.

Validação em light/dark nas larguras 320, 390, 600, 860, 861, 1080, 1081 e 1440 px: 16 cenários sem sobreposição, conteúdo fora do grid, overflow ou falhas tipográficas. Revisão visual desktop claro e celular nos dois temas. Evidências e backup: `../empresa-bento-2026-11-11/`. Não publicado; sem teste em aparelhos físicos ou outros motores de navegador.


### Segunda composição do bento

A grade 2+3 foi substituída por mosaico assimétrico: foto vertical ocupa as duas linhas à esquerda; paisagem panorâmica à direita, acima dos dois cards de políticas; transparência em faixa horizontal no fechamento. Ícones discretos em azul identificam qualidade e ambiente. Em tablet, duas colunas; no celular, uma coluna com foto principal de 440 px mínimos e panorâmica de 304 px. Conteúdo e link PDF preservados. Mais 16 verificações de tema/largura passaram sem falhas, sobreposições ou overflow. Evidência: `empresa-bento-mosaico-claro.png` e `auditoria-mosaico.json`, no diretório de revisão já indicado.
