# Blog Hi-Tech

O blog usa o projeto estático atual, sem dependências ou painel externo. A fonte única é `content/blog.json`. Os HTMLs são gerados: não os edite manualmente.

## Cadastrar uma publicação

1. Duplique um item de `posts` e defina um `slug` único, sem acentos ou espaços. A URL será `artigo-<slug>.html`; mantenha o slug depois de publicar para preservar links.
2. Preencha título, descrição (também usada no SEO), categoria, data no formato AAAA-MM-DD, autor, capa WebP local, descrição acessível da capa, introdução e seções. Cada seção tem título, parágrafos e, opcionalmente, bullets.
3. Escolha uma categoria pelo slug e um botão final apontando para uma página existente. `featured: true` destaca um artigo na abertura do blog.
4. Mantenha `status: "draft"` enquanto o conteúdo estiver em revisão.
5. Execute na raiz: `node scripts/build-blog.cjs --preview`. Esta prévia mostra rascunhos com aviso, bloqueia indexação e não inclui as páginas do blog no sitemap.
6. Após revisar o conteúdo, altere os artigos aprovados para `status: "published"` e execute `node scripts/build-blog.cjs`. Só os publicados entram na versão final. O comando remove páginas geradas que deixaram de fazer parte da seleção.
7. Confira localmente com `python3 -m http.server 8765`, abra `blog.html` e rode `node tests/blog.test.cjs`.
8. Versione o JSON, os HTMLs gerados, `content/blog-pages.json`, as capas e o sitemap. Publique pelo fluxo GitHub Pages existente.

Não publique no GitHub uma geração `--preview` como versão definitiva. Os quatro textos iniciais foram liberados para publicação em 13/11/2026 a pedido do responsável pelo projeto; não são publicações antigas importadas. Novos textos devem começar como rascunho.

## Categorias e páginas

Em `categories`, configure slug, nome e descrição. Cada categoria gera `categoria-<slug>.html`, com título e metadados próprios. A busca atua nos títulos, resumos e nomes de categoria; ignora acentos e mantém a consulta na URL. As páginas e links funcionam sem JavaScript; apenas busca e cópia do link dependem dele.

Artigos publicados recebem canonical, Open Graph e dados estruturados BlogPosting. Capas devem ser WebP com qualidade suficiente para o destaque; uma largura de 1600 px é adequada. O tempo de leitura é calculado pelo texto, e os relacionados priorizam a mesma categoria.

Para alterar o layout: `assets/blog.css` e `scripts/build-blog.cjs`. Para comportamento de busca e compartilhamento: `assets/blog.js`. O manifesto `blog-pages.json` controla apenas os arquivos criados pelo gerador.

O campo opcional `thumbnail` pode apontar para uma versão WebP menor da capa, usada apenas nos cards. `image` continua sendo a capa de maior resolução do artigo.
