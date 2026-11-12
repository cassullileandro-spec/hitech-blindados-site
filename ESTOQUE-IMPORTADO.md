# Cadastro completo do estoque — 11/11/2026

Fonte: https://www.hitechblindados.com.br/estoque/

Os 55 anúncios publicados na listagem foram cadastrados, com preços, anos, combustíveis, quilometragens informadas, condição, status de blindagem, descrições, opcionais e 645 fotos das galerias. Cada cadastro mantém sua URL de origem em `fonte`. Anúncios com o mesmo modelo permanecem separados por anúncio; não foram fundidos por nome.

## Categorias

| Categoria | Anúncios |
|---|---:|
| SUV | 45 |
| Sedã | 4 |
| Picape | 4 |
| Hatch | 1 |
| Van | 1 |

SUVs com carroceria comercialmente chamada coupé ou sportback continuam em SUV, sem criar uma categoria de cupês convencionais sem veículos. A home ganhou atalhos de Hatch e Van com ilustrações prata no mesmo padrão anterior.

## Fidelidade aos anúncios

- 32 novos e 23 seminovos, conforme o filtro público de condição.
- 51 blindados, 3 não blindados e 1 com blindagem sob consulta.
- Não blindados: Porsche Cayenne E-Hybrid 2023, Volkswagen Tiguan R-Line 2026 e Volkswagen Kombi 1973.
- A fonte não confirma o status de blindagem do Range Rover Evoque; a ficha mostra “Blindagem sob consulta”. Não foi inferido pela marca ou por um cadastro antigo.
- Campos ausentes não foram inventados. Em particular, veículo novo sem quilometragem informada permanece com “Km sob consulta”, sem assumir 0 km. Nível III-A só aparece quando confirmado pela descrição.
- As fotos são as URLs reais das galerias atuais, hospedadas no site original. Elas não foram substituídas por imagens geradas; as ilustrações são somente para os atalhos de categoria.
- Cadastros antigos ausentes da listagem atual não são anunciados como disponíveis. Os arquivos anteriores estão preservados em `output/estoque-2026-11-11/antes/`. IDs anteriores foram mantidos quando o anúncio corresponde ao mesmo veículo. Links de anúncios retirados mostram indisponibilidade.

## Validação

- `node tests/estoque.cjs`: total, unicidade, galerias, categorias, preços e quilometragem corrigidos, dados ausentes, limites, filtro de hatch e ordenação.
- Todas as 55 páginas de veículo abertas no navegador, com 645 entradas de fotos e sem `undefined`, `null` ou `NaN` no conteúdo.
- Os 55 cards carregaram suas fotos de capa; sem imagens quebradas ou transbordamento horizontal no desktop.
- Estoque e home conferidos em desktop e celular; busca, limpeza de filtros, categorias e navegação/expansão de galeria verificadas.
- Faixas dos filtros derivadas do estoque: preços até R$ 800.000, anos desde 1973 e quilometragem até 140.000 km. O estado inicial mostra todos os anúncios.
- Não publicado. Formulários não enviados; disponibilidade comercial depende da atualização do estoque original. Não foi feita uma checagem HTTP individual de todas as 645 fotos.
