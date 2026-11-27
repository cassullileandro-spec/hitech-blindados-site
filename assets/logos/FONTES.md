# Logos do filtro de marcas

Audi, BYD, Chery, Ford e Omoda: https://github.com/vehiclespecs/brand-logos (arquivos originais SVG/PNG, baixados em 17/11/2026).

As demais logos já faziam parte dos assets do site. As marcas pertencem aos respectivos titulares; utilizadas para identificar os veículos disponíveis no showroom. Os arquivos são servidos localmente, sem hotlink.

Denza: https://www.denza.com/material/denza-overseas/new-header/logo-manheader.svg (site oficial, 17/11/2026).


## Filtro de marcas — revisão de contraste (17/11/2026)

Arquivos em `filtros/`, próprios para a apresentação compacta do filtro:

- Audi, BMW, Ford, Honda, Jeep, Porsche, Toyota e Volkswagen: SVGs do [Simple Icons](https://github.com/simple-icons/simple-icons/tree/develop/icons).
- Mercedes-Benz e Land Rover: SVGs do [VehicleSpecs](https://github.com/vehiclespecs/brand-logos). Cores originais preservadas.
- Chery: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Chery_logo.svg).
- Omoda: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Omoda_wordmark.svg).
- Denza: [arquivo oficial](https://www.denza.com/material/denza-overseas/new-header/logo-manheader.svg), com viewport limitado ao wordmark. O SVG contém um PNG de 2000 × 431 px, suficiente para a exibição compacta; não é vetor puro.
- BYD e GWM reutilizam os SVGs existentes nesta pasta.

As marcas monocromáticas recebem contraste claro/escuro via CSS; as imagens originais utilizadas em outras seções não foram substituídas.

## Homologações — 25/11/2026

Logos oficiais servidas localmente, com contraste monocromático aplicado pelo CSS da página:

- GAC: [cabeçalho oficial brasileiro](https://br-www-resouce-cdn.gacgroup.com/static/BR/tenant/cms/common/202503/ec5c8e6c-c5d3-450f-b4cb-3e8fbf42d0dc.webp).
- Hyundai: [arquivo oficial](https://www.hyundai.com.br/content/dam/hmb/Hyundai_Motor_Company_logo.webp).
- Mitsubishi: [arquivo do site brasileiro](https://media.mitsubishimotors.com.br/uploads/originals/logo_01_1_803bf48521.svg).
- Changan: [arquivo oficial](https://www.globalchangan.com/static/clientlibs/changancms/images/header/changan-auto-logo.png). Margens transparentes removidas e conversão para WebP sem perdas, com largura de 512 px.
- Ford: reutilizado o SVG do Simple Icons já presente em `filtros/ford.svg`, com viewport ajustado ao formato horizontal da marca em `ford-homologacao.svg`.
- CAOA Chery: reutilizada a marca vetorial Chery de `filtros/chery.svg`; a identificação completa aparece no título do card.

O uso das marcas identifica o conteúdo fornecido pela Hi-Tech; as imagens não substituem os documentos de homologação.

## Ajuste de proporções da home — 26/11/2026

- Changan horizontal: [arquivo publicado pela Changan South Africa](https://www.changanmotors.co.za/wp-content/uploads/2026/05/changan-logo-1920w.png), obtido do [site da marca](https://www.changanmotors.co.za/). Símbolo à esquerda e nome à direita, preservados. Convertido para `changan-horizontal.webp` sem perdas, com alpha e dimensões originais 789×154. Aplicado nas abas da home em um viewport SVG rente à área visível (7, 10, 772, 139), com margem de segurança de 1 px para preservar a suavização das bordas. Desde 27/11/2026, o mesmo arquivo também é utilizado no card Changan da página de homologações.
- Demais logos e seus recortes foram preservados. A escala agora é limitada dentro de botões com padding em todos os lados; a altura da Mitsubishi não aumenta a fileira.

## Mitsubishi horizontal na home — 27/11/2026

- `mitsubishi-horizontal.svg`: composição horizontal solicitada pelo usuário, montada com os vetores do [arquivo original do site brasileiro](https://media.mitsubishimotors.com.br/uploads/originals/logo_01_1_803bf48521.svg), já preservado em `mitsubishi.svg`. Símbolo à esquerda e lettering MITSUBISHI MOTORS à direita; geometrias dos 19 paths copiadas integralmente, com translação e escala proporcional. Sem reconstrução por IA ou fonte substituta. O slogan não integra esta composição compacta. Não é apresentado como download de uma nova versão oficial pronta.
- Aplicado às abas da home e, desde 27/11/2026, também ao card Mitsubishi da página de homologações. Em cada componente, preservados os tamanhos, o alinhamento e os espaçamentos compartilhados com as demais marcas.
