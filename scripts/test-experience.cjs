// Exercise the actual hosted and double-clickable distributions without a CDN.
const {chromium,firefox,webkit}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {pathToFileURL}=require('node:url'),{execFileSync}=require('node:child_process');
const site=path.resolve('generated/site'),out=path.resolve('test-results/experience');
const axe=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const server=http.createServer((req,res)=>{
  const file=path.resolve(site,new URL(req.url,'http://localhost').pathname.slice(1)||'index.html');
  if(!file.startsWith(site+path.sep)){res.writeHead(404);res.end();return;}
  let fd;
  try {
    fd=fs.openSync(file,fs.constants.O_RDONLY|fs.constants.O_NOFOLLOW);
    if(!fs.fstatSync(fd).isFile()){res.writeHead(404);res.end();return;}
    res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.zip':'application/zip','.svg':'image/svg+xml'})[path.extname(file)]||'text/plain');res.end(fs.readFileSync(fd));
  } catch {res.writeHead(404);res.end();} finally {if(fd!==undefined)fs.closeSync(fd);}
});
async function main(){
  fs.mkdirSync(out,{recursive:true});
  execFileSync('python',['-c','import zipfile,sys;zipfile.ZipFile(sys.argv[1]).extractall(sys.argv[2])',path.join(site,'web-compliance-studio.zip'),path.join(out,'studio')]);
  execFileSync('python',['-c','import zipfile,sys;z=zipfile.ZipFile(sys.argv[1]);assert z.testzip() is None;z.extractall(sys.argv[2])',path.join(site,'web-compliance-mcp.zip'),path.join(out,'mcp')]);
  execFileSync(process.execPath,['--test','tests/mcp.test.cjs'],{env:{...process.env,WCT_MCP_SERVER:path.join(out,'mcp/mcp/server.mjs')},stdio:'inherit'});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
  try{for(const [name,engine] of Object.entries({chromium,firefox,webkit}).filter(([name])=>!process.env.WCT_BROWSERS||process.env.WCT_BROWSERS.split(",").includes(name))){
    const browser=await engine.launch();try{for(const offline of [false,true]){
      const context=await browser.newContext({viewport:{width:1280,height:900},acceptDownloads:true});
      const page=await context.newPage(),errors=[],remote=[];
      page.on('pageerror',e=>errors.push(e.message));
      page.on('request',r=>{if(/^https?:/.test(r.url())&&(offline||!r.url().startsWith(base)))remote.push(r.url());});
      if(offline)await context.route(/^https?:/,route=>route.abort());
      await page.goto(offline?pathToFileURL(path.join(out,'studio/START-HERE.html')).href:base+'/');
      await page.waitForFunction(()=>document.querySelectorAll('#catalog-items details').length===13);
      assert.equal(await page.locator('html').getAttribute('lang'),'en');
      assert.equal(await page.locator('html').getAttribute('dir'),'ltr');
      assert.equal(await page.locator('#preview-language').inputValue(),'en');
      assert.equal(await page.locator('#document-examples details').count(),3);
      assert.equal(await page.locator('input').count(),0,'Discovery must not require business details');
      assert.match(await page.locator('#intro-title').textContent(),/Cookie consent/);
      const frame=page.frameLocator('#explore-preview'),hero=page.frameLocator('#hero-preview');
      await frame.locator('.cc-banner').waitFor();await hero.locator('.cc-banner').waitFor();
      await hero.locator('#sample-surface').evaluate(img=>{if(!img.complete||!img.naturalWidth)return new Promise(resolve=>img.addEventListener('load',resolve,{once:true}));});
      assert.ok((await page.locator('#hero-preview').boundingBox()).y<300,'The real product must be visible in the opening view');
      const firstTheme=await page.locator('#hero-machine').getAttribute('data-theme');
      await page.waitForFunction(previous=>document.getElementById('hero-machine').dataset.theme!==previous,firstTheme,{timeout:11000});
      await page.locator('[data-hero-language=en]').click();
      await hero.getByRole('button',{name:'Reject all',exact:true}).waitFor();
      await page.locator('#hero-tour-toggle').click();
      assert.equal(await page.locator('#hero-tour-toggle').getAttribute('aria-pressed'),'false');
      await hero.getByRole('button',{name:'Reject all',exact:true}).click();
      await page.waitForFunction(()=>document.getElementById('hero-tour-toggle').getAttribute('aria-pressed')==='true');
      const still=await page.locator('#hero-machine').getAttribute('data-theme');
      await page.waitForTimeout(6100);assert.equal(await page.locator('#hero-machine').getAttribute('data-theme'),still,'A visitor choice must stop the tour from overwriting it');
      assert.match(await page.locator('#hero-choice-status').textContent(),/analytics off/);
      await page.locator('#hero-reopen').click();await hero.getByRole('button',{name:'Customize',exact:true}).waitFor();
      await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('#hero-tour-toggle').getAttribute('aria-pressed'),'true');
      await page.emulateMedia({reducedMotion:'no-preference'});
      await page.locator('[data-hero-world=commerce]').click();
      assert.equal(await page.locator('#quick-theme').inputValue(),'espresso');
      assert.match(await page.locator('#package-start-link').getAttribute('href'),/theme=espresso/);
      await page.locator('[data-ui-language=he]').click();
      assert.equal(await page.locator('html').getAttribute('dir'),'rtl');
      assert.match(await page.locator('#intro-title').textContent(),/באנר עוגיות/);
      assert.equal(await page.locator('#preview-language').inputValue(),'en','UI language and banner language are independent');
      await page.screenshot({path:path.join(out,`${name}-${offline?'offline':'online'}-hebrew.png`),fullPage:false});
      await page.locator('[data-ui-language=en]').click();
      assert.match(await page.locator('#hero-start-link').getAttribute('href'),/ui=en/);
      await page.screenshot({path:path.join(out,`${name}-${offline?'offline':'online'}-desktop.png`),fullPage:false});
      for(const width of [320,390,768]){
        await page.setViewportSize({width,height:844});
        const reflow=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,overflowing:Array.from(document.querySelectorAll('body *')).filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&(r.right>innerWidth+1||r.left< -1);}).slice(0,12).map(el=>({tag:el.tagName,id:el.id,class:el.className,rect:{left:Math.round(el.getBoundingClientRect().left),right:Math.round(el.getBoundingClientRect().right)}}))}));
        if(reflow.scrollWidth>reflow.width)await page.screenshot({path:path.join(out,`${name}-${offline?'offline':'online'}-reflow-${width}.png`),fullPage:false});
        assert.ok(reflow.scrollWidth<=reflow.width,JSON.stringify(reflow));
      }
      await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(out,`${name}-${offline?'offline':'online'}-phone.png`),fullPage:false});
      await page.locator('[data-story-chapter="1"]').click();assert.equal(await page.locator('#story-visual').getAttribute('data-chapter'),'1');
      assert.equal(await page.locator('[data-story-step="1"]').isVisible(),true);
      assert.match(await page.locator('[data-story-step="1"]').textContent(),/Hebrew.*Israel/);
      await page.locator('[data-story-chapter="2"]').click();assert.equal(await page.locator('[data-story-step="2"]').isVisible(),true);
      await page.locator('#product-story').screenshot({path:path.join(out,`${name}-${offline?'offline':'online'}-story-phone.png`)});
      await page.locator('[data-story-chapter="0"]').click();
      await page.setViewportSize({width:1280,height:900});
      await page.evaluate(axe);
      async function auditProduct(){const result=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));assert.deepEqual(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);}
      if(name==='chromium'&&!offline){await page.locator('[data-story-step="1"]').scrollIntoViewIfNeeded();await page.waitForTimeout(800);await page.screenshot({path:path.join(out,'chromium-online-scroll-story.png'),fullPage:false});}
      await page.locator('[data-product-tab=documents]').click();
      await auditProduct();
      await page.locator('[data-sample-document=terms]').click();
      assert.equal(await page.locator('#hero-document-title').textContent(),'תנאי שימוש');
      await page.locator('#read-sample-document').click();
      assert.equal(await page.locator('#document-modal').evaluate(el=>el.open),true);
      assert.match(await page.locator('#document-modal-content').textContent(),/טיוטה לבדיקה משפטית/);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#document-modal').evaluate(el=>el.open),false);
      await page.locator('[data-product-tab=package]').click();
      await page.locator('[data-package-platform=other]').click();
      assert.match(await page.locator('#package-filename').textContent(),/web-compliance-install/);
      assert.match(await page.locator('#package-files').textContent(),/embed\.html\.txt/);
      assert.match(await page.locator('#package-start-link').getAttribute('href'),/platform=other/);
      await auditProduct();
      await page.locator('[data-product-tab=banner]').click();
      await page.locator('#quick-theme').selectOption('lavender');
      assert.match(await page.locator('#change-description').textContent(),/Lavender/);
      assert.match(await page.locator('#hero-start-link').getAttribute('href'),/theme=lavender/);
      await page.locator('#product-preview').screenshot({path:path.join(out,`${name}-${offline?'offline':'online'}-studio.png`)});
      if(name==='chromium'&&!offline)await page.locator('#designs').screenshot({path:path.join(out,'chromium-online-designs.png')});
      await page.locator('[data-open-document=privacy]').click();
      assert.equal(await page.locator('#document-examples details').first().evaluate(el=>el.open),true,'Document shortcut must open the actual sample');
      await page.locator('#document-examples details').first().locator('summary').click();
      if(!await page.locator('#all-designs').evaluate(el=>el.open))await page.locator('#all-designs summary').click();await page.locator('[data-explore-theme=forest]').click();await page.locator('#preview-language').selectOption('en');
      assert.match(await page.locator('#change-description').textContent(),/English/);
      await frame.getByRole('button',{name:'Reject all',exact:true}).waitFor();
      await frame.getByRole('button',{name:'Reject all',exact:true}).click();await page.locator('#reopen').click();
      await frame.getByRole('button',{name:'Customize',exact:true}).waitFor();
      await page.locator('#narrow').click();assert.ok(await page.locator('#explore-preview').evaluate(el=>el.getBoundingClientRect().width)<=360);
      await page.locator('#catalog-items details').first().locator('summary').click();
      assert.ok((await page.locator('#catalog-items pre').first().textContent()).length>100);
      await page.evaluate(axe);
      const audit=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
      assert.deepEqual(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
      await page.setViewportSize({width:360,height:740});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      await page.screenshot({path:path.join(out,`${name}-${offline?'offline':'online'}.png`),fullPage:true});
      // DOM-injected inline code must actually be blocked, not just documented.
      const blocked=await page.evaluate(()=>{const s=document.createElement('script');s.textContent='window.__unexpectedScriptRan=true';document.body.append(s);return window.__unexpectedScriptRan!==true;});assert.equal(blocked,true);
      await page.locator('#other-link').click();await page.waitForURL(url=>url.pathname.endsWith('/start.html'));await page.waitForFunction(()=>document.getElementById('next')&&!document.getElementById('next').disabled);
      assert.equal(await page.locator('#platform').inputValue(),'other');assert.equal(await page.locator('#accent').inputValue(),'#216348');assert.equal(await page.locator('#output-language').inputValue(),'en');
      assert.equal(await page.locator('html').getAttribute('lang'),'en');
      assert.equal(await page.locator('#market').inputValue(),'unknown','International setup must ask for a market');
      await page.locator('#site-url').fill('https://example.com');await page.locator('#business-name').fill('Portable example');await page.locator('#contact-email').fill('private@example.com');
      await page.locator('[data-ui-language=he]').click();assert.equal(await page.locator('#business-name').inputValue(),'Portable example','Switching UI must preserve entered details');
      await page.locator('[data-ui-language=en]').click();assert.match(await page.locator('#load-status').textContent(),/Ready to start/,'Changing language must preserve the actual loaded state');await page.locator('#next').click();
      assert.match(await page.locator('#step-counter').textContent(),/Business needs/);
      await page.locator('#market').selectOption('us-ca');await page.locator('#privacy-url').fill('/privacy');await page.locator('#next').click();
      await page.locator('#guided-narrow').click();assert.equal(await page.locator('#guided-preview').getAttribute('class'),'mobile');
      await page.locator('[data-theme=night]').click();assert.match(await page.locator('#guided-change').textContent(),/Banner switched to/);
      await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.setViewportSize({width:1280,height:900});
      await page.locator('#next').click();
      await page.screenshot({path:path.join(out,`${name}-${offline?'offline':'online'}-export.png`),fullPage:false});
      const waiting=page.waitForEvent('download');await page.locator('#download-install').click();const download=await waiting;
      const dest=path.join(out,`${name}-${offline?'offline':'online'}.zip`);await download.saveAs(dest);
      const extracted=dest+'.files';
      execFileSync('python',['-c','import zipfile,sys;z=zipfile.ZipFile(sys.argv[1]);assert z.testzip() is None;assert "embed.html.txt" in z.namelist();assert "preview.html" in z.namelist();assert b\'lang="en"\' in z.read("START-HERE.html");assert b\'Website installation\' in z.read("START-HERE.html");assert b\'"region": "auto"\' in z.read("install.js");assert all(b"private@example.com" not in z.read(n) for n in z.namelist());z.extractall(sys.argv[2])',dest,extracted]);
      await page.goto(pathToFileURL(path.join(extracted,'preview.html')).href);
      await page.getByRole('button',{name:'Reject all',exact:true}).click();await page.locator('#wct-preferences').click();
      await page.getByRole('button',{name:'Reject all',exact:true}).waitFor();
      // The standalone skill is a real complete download, online and offline.
      await page.goto(offline?pathToFileURL(path.join(out,'studio/developer.html')).href:base+'/developer.html');
      assert.equal(await page.locator('html').getAttribute('lang'),'en');
      assert.equal(await page.locator('.skill-download').count(),3);
      await page.locator('[data-ui-language=he]').click();assert.equal(await page.locator('html').getAttribute('dir'),'rtl');
      await page.locator('[data-ui-language=en]').click();
      const skillWaiting=page.waitForEvent('download');await page.locator('[href="web-compliance-skill-claude.zip"]').click();
      const skillDownload=await skillWaiting,skillPath=path.join(out,`${name}-${offline?'offline':'online'}-skill.zip`);await skillDownload.saveAs(skillPath);
      execFileSync('python',['-c','import zipfile,sys;z=zipfile.ZipFile(sys.argv[1]);assert z.testzip() is None;p=".claude/skills/web-compliance/";assert p+"SKILL.md" in z.namelist();assert p+"references/intake.md" in z.namelist();assert len([n for n in z.namelist() if "/templates/" in n and n.endswith(".md")])==13',skillPath]);
      await page.evaluate(axe);const skillAudit=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));assert.deepEqual(skillAudit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
      await page.setViewportSize({width:320,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.setViewportSize({width:1280,height:900});
      // The optional editor connection is a complete no-shell configuration flow.
      await page.goto(offline?pathToFileURL(path.join(out,'studio/connect.html')).href:base+'/connect.html');
      await page.locator('#mcp-path').fill('C:\\Tools\\Project with spaces\\mcp\\server.mjs');
      await page.locator('#connection-form button').click();
      let config=JSON.parse(await page.locator('#config-output').textContent());
      assert.equal(config.mcpServers['web-compliance'].args[0],'C:\\Tools\\Project with spaces\\mcp\\server.mjs');
      await page.locator('#mcp-client').selectOption('vscode-legacy');
      assert.equal(await page.locator('#config-result').isVisible(),false,'Changed inputs invalidate stale configurations');
      await page.locator('#connection-form button').click();config=JSON.parse(await page.locator('#config-output').textContent());assert.equal(config.servers['web-compliance'].command,'node');
      const configWaiting=page.waitForEvent('download');await page.locator('#download-config').click();const configDownload=await configWaiting;
      const configPath=path.join(out,`${name}-${offline?'offline':'online'}-mcp.json`);await configDownload.saveAs(configPath);assert.deepEqual(JSON.parse(fs.readFileSync(configPath,'utf8')),config);
      await page.locator('#mcp-path').fill('relative/mcp/server.mjs');await page.locator('#connection-form button').click();assert.equal(await page.locator('#config-result').isVisible(),false);
      await page.locator('#mcp-path').fill('/Users/example/toolkit/mcp/server.mjs');await page.locator('#connection-form button').click();
      await page.evaluate(axe);const connectionAudit=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));assert.deepEqual(connectionAudit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
      await page.setViewportSize({width:320,height:740});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      assert.deepEqual(errors,[]);assert.deepEqual(remote,[]);await context.close();
      console.log(`${name} ${offline?'offline':'online'}: complete catalog, preview, design transfer, CSP, a11y, mobile and universal package passed`);
    }}finally{await browser.close();}
  }}finally{await new Promise(resolve=>server.close(resolve));}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
