// Configured, prelaunch, live and incomplete offers. All payments are local fixtures.
const {chromium,firefox,webkit}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {pathToFileURL}=require('node:url'),{execFileSync}=require('node:child_process');
const fixtures=require('../tests/fixtures/purchase-offers.json');
const configured=require('../products/developer-kit/offer.json');
const scenarios={configured, ...fixtures, blocked:{...fixtures.live,readiness:{...fixtures.live.readiness,live_delivery_verified:false}}};
const site=path.resolve('generated/site'),out=path.resolve('test-results/purchase'),results=[];
const axe=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const server=http.createServer((req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  const match=pathname.match(/^\/__fixtures\/(prelaunch|live|blocked)\//);
  const file=path.resolve(site,(match?pathname.slice(match[0].length):pathname.slice(1))||'index.html');
  if(!file.startsWith(site+path.sep)){res.writeHead(404);res.end();return;}
  if(match&&path.basename(file)==='checkout-config.js'){
    res.setHeader('Content-Type','text/javascript');
    res.end('window.WebComplianceCheckout='+JSON.stringify(scenarios[match[1]])+';');return;
  }
  let fd;
  try{fd=fs.openSync(file,fs.constants.O_RDONLY|fs.constants.O_NOFOLLOW);if(!fs.fstatSync(fd).isFile())throw Error('not a file');res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.zip':'application/zip','.svg':'image/svg+xml'})[path.extname(file)]||'text/plain');res.end(fs.readFileSync(fd));}
  catch{res.writeHead(404);res.end();}finally{if(fd!==undefined)fs.closeSync(fd);}
});
async function lifecycle(page,ready,offer,language){
  for(const selector of ['[data-purchase-link]','[data-purchase-live]','[data-order-support]']){
    for(const el of await page.locator(selector).all())assert.equal(await el.isVisible(),ready,selector);
  }
  for(const el of await page.locator('[data-purchase-pending]').all())assert.equal(await el.isVisible(),!ready,'pending copy');
  for(const link of await page.locator('a[data-purchase-link]').all())assert.equal(await link.getAttribute('href'),ready?offer.checkout_url:null);
  for(const link of await page.locator('[data-order-support]').all())assert.equal(await link.getAttribute('href'),ready?'mailto:'+offer.support_email:null);
  if(ready){
    for(const el of await page.locator('[data-seller-name]').all())assert.equal(await el.textContent(),offer.seller_name);
    for(const el of await page.locator('[data-refund-terms]').all())assert.equal(await el.textContent(),offer.refund_terms[language]);
    assert.doesNotMatch(await page.locator('body').innerText(),/Planned price|Proposed launch|proposed launch|connection is not active|Seller approval|When sales open|PLANNED LAUNCH|מחיר מתוכנן|המוצעת|תנאי השקה מוצעים|החיבור עדיין אינו פעיל|התנאים דורשים אישור/);
  }
}
async function audit(page,info){
  await page.locator('details').evaluateAll(elements=>elements.forEach(el=>el.open=true));
  for(const language of ['he','en']){
    await page.locator('[data-ui-language='+language+']').click();
    assert.equal(await page.locator('html').getAttribute('lang'),language);
    assert.equal(await page.locator('html').getAttribute('dir'),language==='he'?'rtl':'ltr');
    await lifecycle(page,info.ready,info.offer,language);
    for(const width of [320,390,768,1280]){
      await page.setViewportSize({width,height:900});
      const size=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
      assert.ok(size.scroll<=size.width,JSON.stringify({...info,language,...size}));
    }
    await page.evaluate(axe);
    const audit=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
    assert.deepEqual(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
    if(info.name==='chromium'&&!info.offline&&['configured','live'].includes(info.scenario)){
      const prefix=path.join(out,info.scenario+'-'+info.page+'-'+language);
      await page.screenshot({path:prefix+'-desktop.png',fullPage:true});
      await page.setViewportSize({width:390,height:844});await page.screenshot({path:prefix+'-phone.png',fullPage:true});
    }
  }
}
async function main(){
  fs.mkdirSync(out,{recursive:true});
  const studio=path.join(out,'studio');
  execFileSync('python',['-c','import zipfile,sys;zipfile.ZipFile(sys.argv[1]).extractall(sys.argv[2])',path.join(site,'web-compliance-studio.zip'),studio]);
  for(const [scenario,offer] of Object.entries(scenarios)){
    if(scenario==='configured')continue;
    const directory=path.join(out,'studio-'+scenario);fs.cpSync(studio,directory,{recursive:true});
    fs.writeFileSync(path.join(directory,'checkout-config.js'),'window.WebComplianceCheckout='+JSON.stringify(offer)+';');
  }
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base='http://127.0.0.1:'+server.address().port;
  try{for(const [name,engine] of Object.entries({chromium,firefox,webkit})){
    const browser=await engine.launch();try{for(const [scenario,offer] of Object.entries(scenarios)){for(const offline of [false,true]){
      // These expectations are independent of the checkoutState implementation.
      const ready=scenario==='configured'?configured.status==='live':scenario==='live';
      const context=await browser.newContext({viewport:{width:1280,height:900},acceptDownloads:true});
      try{
        const page=await context.newPage(),errors=[],remote=[];
        page.on('pageerror',e=>errors.push(e.message));
        await context.route(/^https?:/,route=>{
          if(offline||!route.request().url().startsWith(base+'/')){remote.push(route.request().url());return route.abort();}
          return route.continue();
        });
        const directory=scenario==='configured'?studio:path.join(out,'studio-'+scenario);
        const online=(scenario==='configured'?base:base+'/__fixtures/'+scenario)+'/pricing.html';
        await page.goto(offline?pathToFileURL(path.join(directory,'pricing.html')).href:online);
        assert.equal(await page.locator('button[data-purchase-pending]').isDisabled(),true);
        assert.match(await page.locator('.disclosure').textContent(),/available free/);
        assert.match(await page.locator('.price-number').last().textContent(),/\$19/);
        assert.ok(await page.locator('.price-number').last().evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=48),'Price must remain prominent');
        const motion=page.locator('.price-object').first();
        await page.locator('#pricing-motion-toggle').click();
        assert.equal(await motion.evaluate(el=>getComputedStyle(el).animationPlayState),'paused');
        await page.locator('[data-ui-language=he]').click();
        assert.match(await page.locator('#pricing-motion-toggle').textContent(),/הפעלת תנועה/);
        await audit(page,{name,scenario,offline,ready,offer,page:'pricing'});
        if(name==='chromium'&&!offline){
          await page.setViewportSize({width:390,height:844});
          const download=page.waitForEvent('download');await page.getByRole('link',{name:'Or download the public package ↓',exact:true}).click();
          const item=await download;const saved=path.join(out,scenario+'-customer-kit.zip');await item.saveAs(saved);
          assert.equal(item.suggestedFilename(),'web-compliance-developer-kit.zip');
          assert.deepEqual(fs.readFileSync(saved),fs.readFileSync(path.join(site,'web-compliance-developer-kit.zip')));
        }
        if(offline)assert.match(await page.getByRole('link',{name:'Download public package (internet required) ↓',exact:true}).getAttribute('href'),/^https:\/\/ward3107\.github\.io\//);
        await page.getByRole('link',{name:'Purchase terms, help & refunds ↗',exact:true}).click();
        await page.locator('#refunds').waitFor();
        await audit(page,{name,scenario,offline,ready,offer,page:'terms'});
        // Direct Hebrew entry and subsequent language changes must preserve the approved terms.
        await page.goto(page.url().split('?')[0]+'?ui=he');
        await lifecycle(page,ready,offer,'he');
        assert.deepEqual(errors,[]);assert.deepEqual(remote,[],'No real checkout or third-party requests');
        results.push({engine:name,scenario,offline,ready,passed:true,languages:['he','en'],widths:[320,390,768,1280]});
        console.log('PASS purchase '+name+' '+scenario+' '+(offline?'offline':'online'));
      }finally{await context.close();}
    }}}finally{await browser.close();}
  }}finally{server.close();fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({real_checkout_tested:false,scenarios:results},null,2)+'\n');}
}
main().catch(error=>{console.error(error);process.exitCode=1;server.close();});
