// Test the real rendered offer and local downloads. Fixtures never make a payment.
const {chromium,firefox,webkit}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {pathToFileURL}=require('node:url'),{execFileSync}=require('node:child_process');
const site=path.resolve('generated/site'),out=path.resolve('test-results/purchase');
const axe=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const server=http.createServer((req,res)=>{
  const file=path.resolve(site,new URL(req.url,'http://localhost').pathname.slice(1)||'index.html');
  if(!file.startsWith(site+path.sep)){res.writeHead(404);res.end();return;}
  let fd;
  try{fd=fs.openSync(file,fs.constants.O_RDONLY|fs.constants.O_NOFOLLOW);if(!fs.fstatSync(fd).isFile())throw Error('not a file');res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.zip':'application/zip','.svg':'image/svg+xml'})[path.extname(file)]||'text/plain');res.end(fs.readFileSync(fd));}
  catch{res.writeHead(404);res.end();}finally{if(fd!==undefined)fs.closeSync(fd);}
});
async function main(){
  fs.mkdirSync(out,{recursive:true});
  execFileSync('python',['-c','import zipfile,sys;zipfile.ZipFile(sys.argv[1]).extractall(sys.argv[2])',path.join(site,'web-compliance-studio.zip'),path.join(out,'studio')]);
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base='http://127.0.0.1:'+server.address().port;
  try{for(const [name,engine] of Object.entries({chromium,firefox,webkit})){
    const browser=await engine.launch();try{for(const offline of [false,true]){
      const context=await browser.newContext({viewport:{width:1280,height:900},acceptDownloads:true});
      const page=await context.newPage(),errors=[],remote=[];
      page.on('pageerror',e=>errors.push(e.message));
      page.on('request',r=>{if(/^https?:/.test(r.url())&&(offline||!r.url().startsWith(base)))remote.push(r.url());});
      if(offline)await context.route(/^https?:/,r=>r.abort());
      const target=offline?pathToFileURL(path.join(out,'studio/pricing.html')).href:base+'/pricing.html';
      await page.goto(target);
      assert.equal(await page.locator('html').getAttribute('lang'),'en');
      assert.equal(await page.locator('button[data-purchase-pending]').isDisabled(),true);
      assert.equal(await page.locator('a[data-purchase-link]').isVisible(),false);
      assert.equal(await page.locator('a[data-purchase-link]').getAttribute('href'),null);
      assert.match(await page.locator('.disclosure').textContent(),/available free/);
      assert.match(await page.locator('.price-number').last().textContent(),/\$19/);
      const motion=page.locator('.price-object').first();
      await page.locator('#pricing-motion-toggle').click();
      assert.equal(await motion.evaluate(el=>getComputedStyle(el).animationPlayState),'paused');
      await page.locator('[data-ui-language=he]').click();
      assert.equal(await page.locator('html').getAttribute('dir'),'rtl');
      assert.match(await page.locator('button[data-purchase-pending]').textContent(),/המכירה עדיין לא נפתחה/);
      assert.match(await page.locator('#pricing-motion-toggle').textContent(),/הפעלת תנועה/);
      for(const language of ['he','en']){
        await page.locator('[data-ui-language='+language+']').click();
        for(const width of [320,390,768,1280]){
          await page.setViewportSize({width,height:900});
          const size=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
          assert.ok(size.scroll<=size.width,JSON.stringify({name,offline,language,...size}));
        }
        await page.evaluate(axe);
        const audit=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
        assert.deepEqual(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
      }
      if(name==='chromium'&&!offline){
        await page.screenshot({path:path.join(out,'pricing-desktop.png'),fullPage:true});
        await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(out,'pricing-phone.png'),fullPage:true});
        const download=page.waitForEvent('download');await page.getByRole('link',{name:'Or download the public package ↓',exact:true}).click();
        const item=await download;await item.saveAs(path.join(out,'customer-kit.zip'));
        assert.equal(item.suggestedFilename(),'web-compliance-developer-kit.zip');
        assert.deepEqual(fs.readFileSync(path.join(out,'customer-kit.zip')),fs.readFileSync(path.join(site,'web-compliance-developer-kit.zip')));
      }
      if(offline)assert.match(await page.getByRole('link',{name:'Download public package (internet required) ↓',exact:true}).getAttribute('href'),/^https:\/\/ward3107\.github\.io\//);
      await page.getByRole('link',{name:'Purchase terms, help & refunds ↗',exact:true}).click();
      await page.locator('#refunds').waitFor();
      await page.evaluate(axe);const termsAudit=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
      assert.deepEqual(termsAudit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
      assert.deepEqual(errors,[]);assert.deepEqual(remote,[]);await context.close();
    }
    // Verify the enabled UI with a local config fixture; do not visit its URL.
    const fixture=await browser.newContext();
    const live={status:'live',billing:'one_time_download',currency:'USD',price_usd:19,support_email:'support@example.com',checkout_url:'https://example.lemonsqueezy.com/buy/550e8400-e29b-41d4-a716-446655440000',readiness:{store_approved:true,seller_terms_confirmed:true,checkout_tested:true,live_delivery_verified:true}};
    await fixture.route('**/checkout-config.js*',r=>r.fulfill({contentType:'text/javascript',body:'window.WebComplianceCheckout='+JSON.stringify(live)+';'}));
    const page=await fixture.newPage();await page.goto(base+'/pricing.html');
    assert.equal(await page.locator('a[data-purchase-link]').isVisible(),true);
    assert.equal(await page.locator('a[data-purchase-link]').getAttribute('href'),live.checkout_url);
    assert.equal(await page.locator('button[data-purchase-pending]').isVisible(),false);
    await fixture.close();
    }finally{await browser.close();}
  }}finally{server.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;server.close();});
