const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const platforms=require('../docs/site/platforms.js');
const installer=require('../docs/site/install-kit.js');

test('platform routing rejects unknown and prototype names instead of assuming an installer',()=>{
  for(const id of ['__proto__','constructor','../../','javascript:alert(1)',null,{},'made-up-platform']){
    assert.equal(platforms.get(id),null);
    assert.throws(()=>platforms.manifest(id),/Unknown platform/);
    assert.throws(()=>platforms.guide(id,'en'),/Unknown platform/);
  }
  assert.equal(platforms.get('unknown').mode,'identify');
});

test('platform guides are bilingual and keep unverified integration states explicit',()=>{
  const ids=platforms.list().map(route=>route.id);
  assert.equal(new Set(ids).size,ids.length);
  for(const id of ['wordpress','html','react','nextjs','vue','nuxt','svelte','angular','astro','wix','shopify','webflow','squarespace','other'])assert.ok(ids.includes(id));
  for(const route of platforms.list()){
    const manifest=platforms.manifest(route.id);
    assert.equal(manifest.customer_installation,'not_tested');
    assert.equal(manifest.tracker_integration,'not_tested');
    assert.equal(manifest.framework_build,'not_tested');
    assert.equal(manifest.legal_review,'pending');
    for(const language of ['en','he']){
      const copy=platforms.text(route.id,language),html=platforms.guide(route.id,language);
      assert.ok(copy.steps.length>=2);
      assert.match(html,new RegExp('lang="'+language+'"'));
      assert.doesNotMatch(html,/<script\b/i,'the downloaded guide is inert');
      assert.match(html,/Content-Security-Policy/);
      assert.match(html,/form-action &#39;none&#39;|form-action 'none'/);
      if(language==='he')assert.match(html,/dir="rtl"/);
    }
    for(const url of manifest.documentation)assert.equal(new URL(url).protocol,'https:');
  }
});

test('hosted platform planning routes do not provide a misleading install snippet',()=>{
  for(const id of ['wix','shopify','webflow','squarespace']){
    assert.equal(platforms.get(id).mode,'conditional');
    assert.equal(platforms.manifest(id).native_connector,false);
    assert.equal(platforms.snippet(id),'');
    assert.match(platforms.text(id,'en').note,/Planning guide only/);
  }
  assert.match(platforms.guide('shopify','en'),/Customer Privacy API/);
  assert.match(platforms.guide('wix','en'),/consent categories/);
});

test('framework entry is external, browser-only and uses sequential local loading',()=>{
  const source=installer.bootstrap();
  new vm.Script(source);
  assert.doesNotThrow(()=>vm.runInNewContext(source,{}),'importing the generator output does not require an SSR DOM');
  assert.match(source,/document\.currentScript/);
  assert.match(source,/__wctMountPromise/);
  assert.match(source,/compliance:installation-error/);
  assert.doesNotMatch(source,/https?:\/\//);
  assert.match(platforms.snippet('nextjs'),/next\/script/);
  assert.match(platforms.snippet('nextjs'),/mount-banner\.js/);
  assert.match(platforms.snippet('svelte'),/%sveltekit\.assets%/);
});
