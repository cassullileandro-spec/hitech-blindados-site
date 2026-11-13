const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const base = 'https://cassullileandro-spec.github.io/hitech-blindados-site/';
const marker = '<!-- Gerado por scripts/build-blog.cjs. Edite content/blog.json. -->';
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const categoryURL = c => `categoria-${c.slug}.html`;
const articleURL = p => `artigo-${p.slug}.html`;
const date = value => new Intl.DateTimeFormat('pt-BR', {day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(value+'T12:00:00Z'));
const minutes = p => Math.max(1, Math.ceil([p.intro,...p.sections.flatMap(s=>[s.title,...s.paragraphs,...(s.bullets||[])])].join(' ').split(/\s+/).length/200));
function validate(data) {
  const categories = new Set(), slugs = new Set();
  for (const c of data.categories) {
    assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.slug) && !categories.has(c.slug), 'Categoria inválida ou duplicada');
    assert(c.name && c.description); categories.add(c.slug);
    if (c.hero) {
      assert(/^assets\/media\/[\w/-]+\.webp$/.test(c.hero.image) && fs.existsSync(path.join(root,c.hero.image)), 'Hero WebP da categoria não encontrada');
      if (c.hero.position) assert(/^(?:100|[0-9]{1,2})% (?:100|[0-9]{1,2})%$/.test(c.hero.position), 'Posição da hero inválida');
      assert(Number.isInteger(c.hero.width) && c.hero.width > 0 && Number.isInteger(c.hero.height) && c.hero.height > 0, 'Dimensões da hero inválidas');
    }
  }
  for (const p of data.posts) {
    assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) && !slugs.has(p.slug), 'Artigo inválido ou duplicado'); slugs.add(p.slug);
    assert(categories.has(p.category), 'Categoria do artigo não existe');
    assert(['draft','published'].includes(p.status), 'Use draft ou published');
    assert(/^\d{4}-\d{2}-\d{2}$/.test(p.date) && !Number.isNaN(Date.parse(p.date)), 'Data inválida');
    assert(p.title && p.description && p.author && p.intro && p.imageAlt);
    assert(/^assets\/media\/[\w/-]+\.webp$/.test(p.image) && fs.existsSync(path.join(root,p.image)), 'Capa WebP não encontrada');
    if (p.thumbnail) assert(/^assets\/media\/[\w/-]+\.webp$/.test(p.thumbnail) && fs.existsSync(path.join(root,p.thumbnail)), 'Miniatura WebP não encontrada');
    assert(p.sections.length && p.sections.every(s=>s.title && Array.isArray(s.paragraphs) && s.paragraphs.length), 'Artigo sem conteúdo');
    assert(/^[a-z0-9-]+\.html(?:#[a-z0-9-]+)?$/.test(p.cta.href) && fs.existsSync(path.join(root,p.cta.href.split('#')[0])), 'Destino do botão inválido');
  }
}
function build({preview = false} = {}) {
  const data = JSON.parse(fs.readFileSync(path.join(root,'content/blog.json'),'utf8'));
  validate(data);
  const posts = data.posts.filter(p=>preview || p.status==='published').sort((a,b)=>b.date.localeCompare(a.date));
  const categories = data.categories;
  const cat = p => categories.find(c=>c.slug===p.category);
  const pages = new Map();
  const review = preview ? '<p class="blog-review">Prévia editorial · conteúdos em revisão, ainda não publicados.</p>' : '';
  function shell(file,title,description,content,{image='assets/media/empresa-showroom-1600.webp',schema,type='website'}={}) {
    const noindex = preview || !posts.length;
    return `${marker}
<!DOCTYPE html><html lang="pt-BR"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escape(title)} — Hi-Tech Blindados</title><meta name="description" content="${escape(description)}">
<meta name="robots" content="${noindex?'noindex, follow':'index, follow, max-image-preview:large'}">
<script src="assets/theme.js?v=cards-frios-20261111-r10"></script>
<link rel="canonical" href="${base+file}"><link rel="icon" type="image/webp" href="assets/media/logo-hitech.webp">
<meta property="og:type" content="${type}"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="Hi-Tech Blindados">
<meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${base+file}"><meta property="og:image" content="${base+image}"><meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap">
<link rel="stylesheet" href="assets/styles.css?v=blog-20261113"><link rel="stylesheet" href="assets/institucional.css?v=unidades-20261113"><link rel="stylesheet" href="assets/blog.css?v=lateral-20261113">
${schema && !preview ? '<script type="application/ld+json">'+JSON.stringify(schema).replace(/</g,'\\u003c')+'</script>':''}
</head><body class="inner blog-page" data-page="blog"><a href="#conteudo" class="skip-link">Ir para o conteúdo</a><div id="site-header"></div>
<main id="conteudo">${content}</main><div id="site-footer"></div>
<script src="assets/app.js?v=blog-20261113"></script><script>renderChrome('blog');</script><script src="assets/blog.js?v=lateral-20261113"></script>
</body></html>\n`;
  }
  const crumbs = (name, parent) => `<nav class="breadcrumb" aria-label="Você está aqui"><a href="index.html">Início</a><span aria-hidden="true">/</span>${name==='Blog' ? '<span aria-current="page">Blog</span>' : '<a href="blog.html">Blog</a><span aria-hidden="true">/</span>'+(parent?`<a href="${categoryURL(parent)}">${escape(parent.name)}</a><span aria-hidden="true">/</span>`:'')+`<span aria-current="page">${escape(name)}</span>`}</nav>`;
  const card = p => `<article class="blog-card" data-blog-card data-category="${p.category}" data-search="${escape(p.title+' '+p.description+' '+cat(p).name)}">
<a class="blog-card-cover" href="${articleURL(p)}" tabindex="-1" aria-hidden="true"><img src="${p.thumbnail || p.image}" alt="" width="800" height="500" loading="lazy" decoding="async"></a>
<div class="blog-card-copy"><a class="blog-category" href="${categoryURL(cat(p))}">${escape(cat(p).name)}</a><h2><a href="${articleURL(p)}">${escape(p.title)}</a></h2><p>${escape(p.description)}</p><div class="blog-meta"><time datetime="${p.date}">${date(p.date)}</time><span>${minutes(p)} min de leitura</span></div><a class="blog-read" href="${articleURL(p)}" aria-label="Ler: ${escape(p.title)}">Ler artigo <span aria-hidden="true">↗</span></a></div></article>`;
  function listing(category) {
    const file=category?categoryURL(category):'blog.html';
    const entries=category?posts.filter(p=>p.category===category.slug):posts;
    const title=category?category.name:data.title;
    const description=category?category.description:data.description;
    const featured=!category && posts.find(p=>p.featured);
    const feature=featured?`<section class="wrap blog-feature" aria-label="Artigo em destaque"><a href="${articleURL(featured)}" class="blog-feature-image" tabindex="-1" aria-hidden="true"><img src="${featured.image}" alt="" width="1200" height="750" loading="lazy" decoding="async"></a><div class="blog-feature-copy"><span class="blog-eyebrow">Em destaque · ${escape(cat(featured).name)}</span><h2><a href="${articleURL(featured)}">${escape(featured.title)}</a></h2><p>${escape(featured.description)}</p><a href="${articleURL(featured)}" class="btn btn-primary">Ler artigo <span aria-hidden="true">↗</span></a></div></section>`:'';
    const hero=category?.hero || {image:'assets/media/hitech/linha-montagem.webp',width:3761,height:2115};
    const heroSources=[800,1600].filter(w=>w<hero.width && fs.existsSync(path.join(root,hero.image.replace('.webp',`-${w}.webp`)))).map(w=>`${hero.image.replace('.webp',`-${w}.webp`)} ${w}w`).concat(`${hero.image} ${hero.width}w`).join(', ');
    const opening=`<header class="institutional-hero photo-hero blog-hero"><img class="photo-hero-photo" src="${hero.image}"${hero.position?` style="object-position:${hero.position}"`: ''} srcset="${heroSources}" sizes="(max-width: 760px) 860px, 100vw" alt="" width="${hero.width}" height="${hero.height}" fetchpriority="high" decoding="async"><div class="wrap">${crumbs(category?category.name:'Blog')}<h1>${category?escape(category.name):'Conhecimento para seguir <span class="light">com confiança.</span>'}</h1><p class="page-intro">${escape(description)}</p>${review}<a class="btn btn-primary" href="#artigos">Explorar artigos <span aria-hidden="true">↓</span></a></div></header>`;
    const content=`${opening}${feature}
<section class="section" id="artigos" aria-labelledby="blog-list-title"><div class="wrap blog-list-layout">
<aside class="filters blog-filters" aria-label="Filtros do blog"><div class="filters-head"><b>Filtros</b><a href="blog.html#artigos">Limpar tudo</a></div>
<form class="blog-search fgroup" role="search" action="${file}#artigos" method="get"><label for="blog-query">Buscar ${category?'nesta categoria':'no blog'}</label><div><input id="blog-query" name="q" type="search" placeholder="Buscar artigo…" maxlength="120"><button class="btn" type="submit" aria-label="Buscar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg></button></div></form>
<details class="blog-refinements" open><summary>Categorias${category?' · '+escape(category.name):''}</summary><nav class="blog-categories" aria-label="Categorias do blog"><a href="blog.html#artigos" ${!category?'aria-current="page"':''}>Todos <span>${posts.length}</span></a>${categories.map(c=>`<a href="${categoryURL(c)}#artigos" ${category?.slug===c.slug?'aria-current="page"':''}>${escape(c.name)} <span>${posts.filter(p=>p.category===c.slug).length}</span></a>`).join('')}</nav></details></aside>
<div class="blog-results"><div class="blog-list-head"><h2 id="blog-list-title">${category?'Artigos desta categoria':'Todos os artigos'}</h2><p class="blog-count" id="blog-count" role="status" aria-live="polite">${entries.length} ${entries.length===1?'artigo':'artigos'}</p></div><div class="blog-grid">${entries.map(card).join('')}</div>
<div class="blog-empty" id="blog-empty" ${entries.length?'hidden':''}><h3>${entries.length?'Nenhum artigo encontrado.':'Em breve, novos conteúdos.'}</h3><p>${entries.length?'Tente outra palavra ou explore as categorias.':'Estamos preparando artigos para esta categoria.'}</p><a class="btn" href="${file}">Limpar busca</a><a class="blog-read" href="blog.html">Ver todos os artigos ↗</a></div><noscript><p>A busca precisa de JavaScript. Os artigos e as categorias continuam disponíveis acima.</p></noscript></div></div></section>`;
    pages.set(file,shell(file,title,description,content,{...(category?{image:hero.image}:{}),schema:{'@context':'https://schema.org','@type':category?'CollectionPage':'Blog',name:title,description,url:base+file,inLanguage:'pt-BR'}}));
  }
  listing(); categories.forEach(listing);
  for (const p of posts) {
    const file=articleURL(p), category=cat(p);
    const related=posts.filter(x=>x.slug!==p.slug).sort((a,b)=>Number(b.category===p.category)-Number(a.category===p.category)).slice(0,3);
    const content=`<header class="wrap blog-heading article-heading">${crumbs(p.title,category)}<a class="blog-category" href="${categoryURL(category)}">${escape(category.name)}</a><h1>${escape(p.title)}</h1><p>${escape(p.description)}</p><div class="blog-meta"><span>${escape(p.author)}</span><time datetime="${p.date}">${date(p.date)}</time><span>${minutes(p)} min de leitura</span></div>${review}</header>
<figure class="wrap article-cover"><img src="${p.image}" alt="${escape(p.imageAlt)}" width="1600" height="900" fetchpriority="high"></figure>
<div class="wrap article-layout"><aside class="article-index"><nav aria-label="Neste artigo"><h2>Neste artigo</h2><ol>${p.sections.map((s,i)=>`<li><a href="#secao-${i+1}">${escape(s.title)}</a></li>`).join('')}</ol></nav></aside><article class="article-body" aria-label="Texto do artigo"><p class="article-intro">${escape(p.intro)}</p>${p.sections.map((s,i)=>`<section id="secao-${i+1}"><h2>${escape(s.title)}</h2>${s.paragraphs.map(t=>'<p>'+escape(t)+'</p>').join('')}${s.bullets?'<ul>'+s.bullets.map(t=>'<li>'+escape(t)+'</li>').join('')+'</ul>':''}</section>`).join('')}
<div class="article-next"><h2>Continue com a Hi-Tech.</h2><a class="btn btn-primary" href="${p.cta.href}">${escape(p.cta.label)} <span aria-hidden="true">↗</span></a></div><div class="article-share"><a href="blog.html" class="blog-read">← Voltar ao blog</a><button class="btn" type="button" id="copy-article">Copiar link</button><span id="copy-status" role="status" aria-live="polite"></span></div></article></div>
${related.length?'<section class="section blog-related"><div class="wrap"><h2>Continue a leitura.</h2><div class="blog-grid">'+related.map(card).join('')+'</div></div></section>':''}`;
    pages.set(file,shell(file,p.title,p.description,content,{image:p.image,type:'article',schema:{'@context':'https://schema.org','@type':'BlogPosting',headline:p.title,description:p.description,image:base+p.image,datePublished:p.date,author:{'@type':'Organization',name:p.author},publisher:{'@type':'Organization',name:'Hi-Tech Blindados',logo:{'@type':'ImageObject',url:base+'assets/media/logo-hitech.webp'}},mainEntityOfPage:base+file,articleSection:category.name,inLanguage:'pt-BR'}}));
  }
  const manifest=path.join(root,'content/blog-pages.json');
  const previous=fs.existsSync(manifest)?JSON.parse(fs.readFileSync(manifest,'utf8')):[];
  for (const file of previous) {
    assert(/^(blog|categoria-[a-z0-9-]+|artigo-[a-z0-9-]+)\.html$/.test(file));
    if (!pages.has(file) && fs.existsSync(path.join(root,file))) {
      assert(fs.readFileSync(path.join(root,file),'utf8').startsWith(marker), 'Página alterada manualmente: '+file);
      fs.unlinkSync(path.join(root,file));
    }
  }
  for (const [file,html] of pages) fs.writeFileSync(path.join(root,file),html);
  fs.writeFileSync(manifest,JSON.stringify([...pages.keys()],null,2)+'\n');
  const sitemapFile=path.join(root,'sitemap.xml');
  let sitemap=fs.readFileSync(sitemapFile,'utf8').replace(/\s*<!-- BLOG START -->[\s\S]*?<!-- BLOG END -->/,'');
  const urls=!preview && posts.length?[...pages.keys()].map(file=>`  <url><loc>${base+file}</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>`).join('\n'):'';
  sitemap=sitemap.replace('</urlset>',`  <!-- BLOG START -->\n${urls}\n  <!-- BLOG END -->\n</urlset>`);
  fs.writeFileSync(sitemapFile,sitemap);
  console.log(`Blog: ${posts.length} artigos, ${categories.length} categorias, ${pages.size} páginas (${preview?'prévia sem indexação':'publicação'}).`);
  return [...pages.keys()];
}
module.exports={validate,build,escape};
if(require.main===module) build({preview:process.argv.includes('--preview')});
