const {chromium,firefox,webkit}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {pathToFileURL}=require('node:url'),{execFileSync}=require('node:child_process');
const catalog=require('../docs/site/platforms.js');
const site=path.resolve('generated/site'),out=path.resolve('test-results/platforms');
const offline=path.join(out,'studio'),runtime=path.join(out,'runtime');
const axe=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const counts={};
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/host.html'){
  res.setHeader('Content-Type','text/html');
  res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'");
  res.end('<!doctype html><html lang="en"><meta charset="utf-8"><title>Runtime integration fixture</title><body><main id="route-content">First route</main><script src="/host-events.js"></script><script defer src="/runtime/mount-banner.js"></script></body></html>');return;
 }
 if(url.pathname==='/host-events.js'){
  res.setHeader('Content-Type','text/javascript');
  res.end('window.runtimeErrors=[];window.runtimeReady=0;window.choices=[];window.addEventListener("compliance:installation-error",e=>runtimeErrors.push(e.detail.message));window.addEventListener("compliance:installation-ready",()=>runtimeReady++);window.addEventListener("compliance:consent",e=>choices.push(e.detail));');return;
 }
 const isRuntime=url.pathname.startsWith('/runtime/'),directory=isRuntime?runtime:site;
 const file=path.resolve(directory,isRuntime?url.pathname.slice('/runtime/'.length):url.pathname.slice(1));
 if(!file.startsWith(directory+path.sep)){res.writeHead(404);res.end();return;}
 let fd;
 try{
  fd=fs.openSync(file,fs.constants.O_RDONLY|fs.constants.O_NOFOLLOW);
  if(!fs.fstatSync(fd).isFile())throw new Error('not a file');
  if(isRuntime)counts[url.pathname]=(counts[url.pathname]||0)+1;
  res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'})[path.extname(file)]||'application/octet-stream');
  res.end(fs.readFileSync(fd));
 }catch{res.writeHead(404);res.end();}finally{if(fd!==undefined)fs.closeSync(fd);}
});
async function download(page,id,destination){
 const waiting=page.waitForEvent('download');await page.locator('#'+id).click();const item=await waiting;await item.saveAs(destination);
}
async function prepare(page,url,id,language){
 await page.goto(url+'?ui='+language+'&platform='+id);
 await page.waitForFunction(()=>!document.getElementById('next').disabled);
 assert.equal(await page.locator('#platform').inputValue(),id);
 await page.locator('#site-url').fill('https://example.com');await page.locator('#business-name').fill('Route fixture');
 await page.locator('#contact-email').fill('private-platform@example.com');await page.locator('#next').click();
 await page.locator('#market').selectOption('il');await page.locator('#privacy-url').fill('/privacy');
 await page.locator('#next').click();await page.locator('#next').click();
}
async function checkZip(file,id){
 execFileSync('python',['-c',
  'import json,sys,zipfile;z=zipfile.ZipFile(sys.argv[1]);assert z.testzip() is None;p="web-compliance/" if sys.argv[2]=="wordpress" else "";m=json.loads(z.read(p+"PLATFORM.json"));assert m["platform"]==sys.argv[2];assert m["customer_installation"]=="not_tested";assert m["tracker_integration"]=="not_tested";assert all(b"private-platform@example.com" not in z.read(n) for n in z.namelist());assert not any(n.endswith("project.json") for n in z.namelist());planning=m["delivery"]=="conditional";assert not planning or set(z.namelist())=={"START-HERE.html","PLATFORM.json","STATUS.txt"};assert not planning or b"PLANNING ONLY" in z.read("STATUS.txt");assert m["delivery"]!="framework" or {"mount-banner.js","integration-example.txt","embed.html.txt","preview.html"}.issubset(z.namelist())',file,id]);
}
async function main(){
 fs.mkdirSync(out,{recursive:true});fs.mkdirSync(runtime,{recursive:true});
 execFileSync('python',['-c','import zipfile,sys;zipfile.ZipFile(sys.argv[1]).extractall(sys.argv[2])',path.join(site,'web-compliance-studio.zip'),offline]);
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
 const results=[];
 try{for(const [name,engine] of Object.entries({chromium,firefox,webkit}).filter(([name])=>!process.env.WCT_BROWSERS||process.env.WCT_BROWSERS.split(',').includes(name))){
  const browser=await engine.launch();
  try{
   for(const portable of [false,true])for(const language of ['en','he']){
    const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[],external=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('request',request=>{const u=request.url();if(!u.startsWith(base)&&!u.startsWith('file:')&&!u.startsWith('blob:'))external.push(u);});
    const hub=portable?pathToFileURL(path.join(offline,'platforms.html')).href:base+'/platforms.html';
    const start=portable?pathToFileURL(path.join(offline,'start.html')).href:base+'/start.html';
    await page.goto(hub+'?ui='+language+'&platform=constructor');
    assert.equal(await page.locator('[data-platform=unknown]').getAttribute('aria-pressed'),'true');
    assert.equal(await page.locator('[data-platform]').count(),catalog.list().length);
    for(const route of catalog.list()){
     await page.locator('[data-platform="'+route.id+'"]').click();
     assert.equal(await page.locator('#platform-detail').getAttribute('data-mode'),route.mode);
     assert.equal(await page.locator('#platform-title').textContent(),catalog.text(route.id,language).name);
     assert.match(await page.locator('#platform-prepare').getAttribute('href'),new RegExp('platform='+route.id+'$'));
     assert.equal(await page.locator('#platform-code-block').isVisible(),route.mode==='framework');
    }
    await page.locator('[data-platform=nextjs]').click();
    await page.evaluate(axe);const audit=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
    assert.deepEqual(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
    await page.screenshot({path:path.join(out,name+'-'+(portable?'offline':'online')+'-'+language+'-desktop.png'),fullPage:true});
    for(const width of [320,390]){await page.setViewportSize({width,height:820});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile horizontal overflow');}
    await page.screenshot({path:path.join(out,name+'-'+(portable?'offline':'online')+'-'+language+'-mobile.png'),fullPage:true});
    const guide=path.join(out,name+'-'+portable+'-'+language+'-shopify.html');
    await page.locator('[data-platform=shopify]').click();await download(page,'platform-guide',guide);
    const guideText=fs.readFileSync(guide,'utf8');assert.match(guideText,/Customer Privacy API/);assert.doesNotMatch(guideText,/<script\b/i);
    await page.setViewportSize({width:1280,height:900});
    // Exercise every route's actual package online; representative routes also work offline and in Hebrew.
    const ids=!portable&&language==='en'?catalog.list().map(r=>r.id):['unknown','nextjs','html','wix','shopify'];
    for(const id of ids){
     await prepare(page,start,id,language);
     if(id==='unknown'){
      assert.equal(await page.locator('#download-install').isEnabled(),false);
      await page.locator('#fix-details').click();assert.equal(await page.locator('[data-step="0"]').isVisible(),true);continue;
     }
     const file=path.join(out,name+'-'+portable+'-'+language+'-'+id+'.zip');
     await download(page,'download-install',file);await checkZip(file,id);
     if(!portable&&language==='en'&&id==='nextjs')execFileSync('python',['-c','import zipfile,sys;zipfile.ZipFile(sys.argv[1]).extractall(sys.argv[2])',file,runtime]);
     const saved=path.join(out,'resume-'+name+'.json');
     if(id==='nextjs'){
      await download(page,'save-project',saved);await page.goto(start+'?ui='+language+'&platform=html');await page.waitForFunction(()=>!document.getElementById('next').disabled);
      await page.locator('#resume-details summary').click();await page.locator('#resume-project').setInputFiles(saved);
      await page.waitForFunction(()=>document.getElementById('platform').value==='nextjs'&&document.getElementById('business-name').value==='Route fixture');
      assert.match(await page.locator('#platform-hint').textContent(),new RegExp(catalog.text('nextjs',language).availability.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
     }
    }
    assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
    results.push({browser:name,offline:portable,language,routes:catalog.list().length,customer_site_tested:false});
    await page.close();
   }
   const context=await browser.newContext(),page=await context.newPage();
   await page.goto(base+'/host.html');await page.waitForFunction(()=>window.runtimeReady===1);
   assert.deepEqual(await page.evaluate(()=>window.choices[0]),{analytics:false,marketing:false});
   await page.locator('[data-cc=accept]').click();
   const before=counts['/runtime/install.js'];
   await page.evaluate(()=>{history.pushState({},'','/host.html?route=two');document.getElementById('route-content').textContent='Second route';for(let i=0;i<2;i++){const s=document.createElement('script');s.src='/runtime/mount-banner.js';document.head.append(s);}});
   await page.waitForLoadState('networkidle');assert.equal(await page.locator('#wct-preferences').count(),1);assert.equal(counts['/runtime/install.js'],before);
   await page.locator('#wct-preferences').click();await page.locator('[data-cc=reject]').click();
   assert.deepEqual(await page.evaluate(()=>window.choices.at(-1)),{analytics:false,marketing:false});
   await page.reload();await page.waitForFunction(()=>window.runtimeReady===1);assert.equal(await page.locator('.cc-root').count(),0);
   await page.locator('#wct-preferences').click();assert.equal(await page.locator('.cc-root').count(),1);
   await context.close();
   const failureContext=await browser.newContext(),failure=await failureContext.newPage();
   await failure.route('**/runtime/cookie-consent.js',r=>r.abort());await failure.goto(base+'/host.html');
   await failure.waitForFunction(()=>window.runtimeErrors.length===1);
   assert.equal(await failure.evaluate(()=>window.runtimeReady),0);assert.equal(await failure.locator('#wct-preferences').count(),0);
   await failure.unroute('**/runtime/cookie-consent.js');
   await failure.evaluate(()=>{const s=document.createElement('script');s.src='/runtime/mount-banner.js';document.head.append(s);});
   await failure.waitForFunction(()=>window.runtimeReady===1);assert.equal(await failure.locator('#wct-preferences').count(),1);
   await failureContext.close();
   console.log(name+': all platform routes, downloaded packages, bilingual offline setup, responsive accessibility, ordered framework runtime, remounts, consent, load failure and retry passed');
  }finally{await browser.close();}
 }}finally{await new Promise(resolve=>server.close(resolve));}
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({results,framework_builds_tested:false,hosted_vendor_accounts_tested:false,real_checkout_tested:false},null,2));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
