const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {matchesBlogQuery} = require('../assets/blog.js');
const {validate,escape} = require('../scripts/build-blog.cjs');
const root = path.join(__dirname,'..');
const data = JSON.parse(fs.readFileSync(path.join(root,'content/blog.json'),'utf8'));
validate(data);
assert(matchesBlogQuery('Revisão da blindagem', 'revisao BLINDAGEM'));
assert(matchesBlogQuery('Showroom Aeroporto', '  '));
assert(!matchesBlogQuery('Manutenção do veículo', 'showroom'));
assert.equal(escape('<script>"&'), '&lt;script&gt;&quot;&amp;');
const invalid = structuredClone(data); invalid.posts[0].category='ausente'; assert.throws(()=>validate(invalid));
const duplicated=structuredClone(data); duplicated.posts.push(duplicated.posts[0]); assert.throws(()=>validate(duplicated));
for(const file of JSON.parse(fs.readFileSync(path.join(root,'content/blog-pages.json'),'utf8'))) {
 const html=fs.readFileSync(path.join(root,file),'utf8');
 assert(html.includes('rel="canonical"') && html.includes('name="robots"'));
 if(html.includes('Prévia editorial')) assert(html.includes('noindex, follow') && !html.includes('BlogPosting'));
 for(const match of html.matchAll(/(?:href|src)="([^"?#]+)(?:[?#][^"]*)?"/g)) {
  if(!/^(https?:|tel:|#)/.test(match[1])) assert(fs.existsSync(path.join(root,match[1])), file+': missing '+match[1]);
 }
}
const temp = fs.mkdtempSync(path.join(os.tmpdir(),'hitech-blog-test-'));
try {
 fs.mkdirSync(path.join(temp,'scripts')); fs.mkdirSync(path.join(temp,'content'));
 fs.copyFileSync(path.join(root,'scripts/build-blog.cjs'),path.join(temp,'scripts/build-blog.cjs'));
 fs.symlinkSync(path.join(root,'assets'),path.join(temp,'assets'));
 for(const p of data.posts) fs.writeFileSync(path.join(temp,p.cta.href), 'page');
 fs.writeFileSync(path.join(temp,'sitemap.xml'),'<urlset></urlset>');
 const fixture=structuredClone(data); fixture.posts.forEach(p=>p.status='draft'); fixture.posts[0].status='published'; fixture.posts[0].title='Blindagem <segura> & cuidados';
 fs.writeFileSync(path.join(temp,'content/blog.json'),JSON.stringify(fixture));
 execFileSync(process.execPath,['scripts/build-blog.cjs','--preview'],{cwd:temp});
 const draftFile=path.join(temp,`artigo-${fixture.posts[1].slug}.html`);
 assert(fs.existsSync(draftFile));
 execFileSync(process.execPath,['scripts/build-blog.cjs'],{cwd:temp});
 assert(!fs.existsSync(draftFile), 'Production must remove preview-only draft pages');
 const published=fs.readFileSync(path.join(temp,`artigo-${fixture.posts[0].slug}.html`),'utf8');
 assert(published.includes('Blindagem &lt;segura&gt; &amp; cuidados'));
 assert(published.includes('BlogPosting') && !published.includes('noindex'));
 const sitemap=fs.readFileSync(path.join(temp,'sitemap.xml'),'utf8');
 assert(sitemap.includes(fixture.posts[0].slug) && !sitemap.includes(fixture.posts[1].slug));
 execFileSync(process.execPath,['scripts/build-blog.cjs'],{cwd:temp});
 assert.equal(fs.readFileSync(path.join(temp,'sitemap.xml'),'utf8'),sitemap,'Build must be idempotent');
} finally { fs.rmSync(temp,{recursive:true,force:true}); }
console.log('Blog: search, validation, escaping, links, preview/production, draft cleanup and SEO passed.');
