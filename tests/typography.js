// Execute this read-only function in each page after document.fonts.ready.
() => {
  const failures = [], samples = [], width = innerWidth;
  const heading = width <= 600 ? [32,40] : width <= 1080 ? [40,48] : [48,56];
  const editorial = width <= 600 ? [24,32] : width <= 1080 ? [28,36] : [32,40];
  const visible = e => e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().height > 0 && !e.closest('.mobile-menu:not(.open)');
  const name = e => `${e.tagName.toLowerCase()}.${e.className} ${(e.textContent || '').trim().slice(0,65)}`;
  const check = (condition, message) => { if (!condition) failures.push(message); };
  function pair(e, expected, role) {
    const s = getComputedStyle(e), actual = [Number.parseFloat(s.fontSize), Number.parseFloat(s.lineHeight)];
    samples.push({element:name(e),role,pair:actual,weight:s.fontWeight,tracking:s.letterSpacing});
    check(actual.every((v,i)=>Math.abs(v-expected[i])<.05), `${name(e)}: ${actual} expected ${expected}`);
  }
  check(document.fonts.check('16px Geist'), 'Geist has not loaded');
  check(document.documentElement.scrollWidth <= width+1, `Document overflow: ${document.documentElement.scrollWidth}/${width}`);
  const editorialSelectors = '.photo-card h3,.home-destinations h3,.policy-grid h3,.revision-grid h3,.unit-grid h3,.material-item h3,.visual-item h3,.care-gallery h2,.company-policy-title h3,.company-transparency h3,.pdp-block-head h2,.brand-layout .prose h2,.inquiry-form h2';
  const compactSelectors = '.company-policy-card h3,.editorial-steps h3,.car-head h3,.info-card h3,.buy-card h3,.empty h3,.company-showroom-copy h3,.home-homologations-details h3';
  const smallSelectors = '.company-fact h3,.company-flow h3,.prose h3,.document-link h3,.process-grid h3,.sim h3';
  for (const e of document.querySelectorAll('main h1,main h2,main h3')) {
    if (!visible(e)) continue;
    const role = e.matches(editorialSelectors) ? 'editorial' : e.matches(compactSelectors) ? 'compact' : e.matches(smallSelectors) ? 'small' : e.matches('h1,h2,.material-feature h3') ? 'heading' : null;
    check(role!==null,`Unmapped heading: ${name(e)}`);
    if (role) pair(e, {heading,editorial,compact:[24,32],small:[20,28]}[role],role);
    for (const child of e.querySelectorAll('.serif,.light')) pair(child, [Number.parseFloat(getComputedStyle(e).fontSize),Number.parseFloat(getComputedStyle(e).lineHeight)],'emphasis');
  }
  for (const e of document.querySelectorAll('main p')) {
    if (!visible(e)) continue;
    const caption=e.matches('.fine-print,.hero-caption');
    const aux=e.matches('.car-body .ver,.consignment-note p,.document-link p,.revision-grid p,.process-grid p,.armor p');
    pair(e,caption?[12,16]:aux?[14,24]:[16,24],caption?'caption':aux?'aux':'body');
  }
  for (const [selector,expected] of [
    ['.footer p,.footer ul a,.footer-unit-link',[14,24]],['.footer h4,.footer-bot,.car-brand,.price small,.car-year',[12,16]],
    ['.car-specs',[12,24]],['.price b',[24,32]],['.btn,.tlink,.car-link,.contact-form label,.sort label,.nav a',[14,24]],
    ['.text-list li,.inspection-checks li',[14,24]],['.contact-number,.contact-direct b',[24,32]],['.editorial-answers summary,.integration-detail summary,.consignment-note b,.category-card > span',[20,28]]
  ]) for(const e of document.querySelectorAll(selector)) if(visible(e)) pair(e,expected,selector);
  const gaps=[];
  for(const e of document.querySelectorAll('main h1 + p,main h2 + p,main h3 + p,main p + p')) {
    const prev=e.previousElementSibling;
    if(!visible(e)||!visible(prev)||e.matches('.hero-caption,.company-photo-source,.fine-print')) continue;
    const a=prev.getBoundingClientRect(),b=e.getBoundingClientRect();
    if(b.top<a.bottom-1 || Math.min(a.right,b.right)<=Math.max(a.left,b.left)) continue;
    const gap=b.top-a.bottom; gaps.push({element:name(e),gap});
    check(Math.abs(gap-16)<1,`${name(e)}: text gap ${gap.toFixed(2)} expected 16`);
  }
  for (const [before,after,expected] of [
    ['.home-factory-intro h2','.home-factory-intro p',16],
    ['.home-intro > p','.home-destinations',48],
    ['.home-homologations-details article:last-of-type p','.home-homologations-actions a',24]
  ]) {
    const a=document.querySelector(before),b=document.querySelector(after);
    if(!a||!b||!visible(a)||!visible(b))continue;
    const ar=a.getBoundingClientRect(),br=b.getBoundingClientRect();
    if(br.top<ar.bottom-1)continue;
    check(Math.abs(br.top-ar.bottom-expected)<1,`${after}: group gap ${br.top-ar.bottom} expected ${expected}`);
  }
  for(const e of document.querySelectorAll('.pdp-block-head')) {
    const next=e.nextElementSibling;
    const expected=next.matches('.spec-grid,.opcionais')?48:16;
    check(Math.abs(next.getBoundingClientRect().top-e.getBoundingClientRect().bottom-expected)<1,'PDP heading-to-content gap');
  }
  // Text ranges catch overflow even if an ancestor hides it; horizontal galleries are intentional.
  const overflow=[];
  for(const e of document.querySelectorAll('main h1,main h2,main h3,main p,.btn,.tlink,.footer p')) {
    if(!visible(e)||e.closest('.story-track,.lb'))continue;
    const r=document.createRange();r.selectNodeContents(e);
    for(const box of r.getClientRects()) if(box.right>width+1||box.left< -1) {overflow.push(name(e));break;}
  }
  check(!overflow.length,`Text overflow: ${overflow.join('; ')}`);
  return {page:location.pathname,width,failures,samples,gaps,overflow};
}
