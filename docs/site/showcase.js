(function () {
  'use strict';
  var $=function(id){return document.getElementById(id);},pick=ToolkitUI.pick;
  var productTabs=Array.from(document.querySelectorAll('[data-product-tab]'));
  var activeDocument='privacy',platform='wordpress';
  function reduced(){return window.matchMedia('(prefers-reduced-motion: reduce)').matches;}
  function showProduct(key,focus,scroll){
    if(!['banner','documents','package'].includes(key))return;
    productTabs.forEach(function(tab){var active=tab.dataset.productTab===key;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;$('product-panel-'+tab.dataset.productTab).hidden=!active;if(active&&focus)tab.focus({preventScroll:true});});
    if(scroll)$('product-preview').scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'});
  }
  productTabs.forEach(function(tab){tab.addEventListener('click',function(){showProduct(tab.dataset.productTab,false,false);});tab.addEventListener('keydown',function(event){
    var index=productTabs.indexOf(tab),next;
    if(event.key==='Home')next=0;else if(event.key==='End')next=productTabs.length-1;
    else if(event.key==='ArrowLeft'||event.key==='ArrowRight'){var forward=(event.key==='ArrowRight')===(document.documentElement.dir!=='rtl');next=(index+(forward?1:productTabs.length-1))%productTabs.length;}else return;
    event.preventDefault();showProduct(productTabs[next].dataset.productTab,true,false);
  });});
  document.querySelectorAll('[data-open-product]').forEach(function(button){button.addEventListener('click',function(){showProduct(button.dataset.openProduct,true,true);});});
  function sampleDetails(key){
    if(!['privacy','terms','refunds'].includes(key)||!window.ToolkitDocuments)return null;
    return $('document-examples').querySelector('[data-document-key="'+key+'"]');
  }
  function documentText(key){var details=sampleDetails(key);return details?details.querySelector('pre').textContent:'';}
  function renderDocument(key){
    var text=documentText(key);if(!text)return;activeDocument=key;
    $('hero-document-title').textContent=ToolkitDocuments.titles[key];
    document.querySelectorAll('[data-sample-document]').forEach(function(button){button.setAttribute('aria-pressed',String(button.dataset.sampleDocument===key));});
    var fragment=document.createDocumentFragment();
    text.split(/\n\n+/).slice(2,5).forEach(function(section,index){
      var lines=section.split('\n');if(index>0){var heading=document.createElement('h4');heading.textContent=lines.shift();fragment.append(heading);}
      var p=document.createElement('p');p.textContent=lines.join('\n');fragment.append(p);
    });
    $('hero-document-excerpt').replaceChildren(fragment);
  }
  document.querySelectorAll('[data-sample-document]').forEach(function(button){button.addEventListener('click',function(){renderDocument(button.dataset.sampleDocument);});});
  $('read-sample-document').addEventListener('click',function(){
    $('document-modal-title').textContent=ToolkitDocuments.titles[activeDocument];$('document-modal-content').textContent=documentText(activeDocument);
    $('document-modal').showModal();
  });
  $('close-document-modal').addEventListener('click',function(){$('document-modal').close();});
  $('document-modal').addEventListener('click',function(event){if(event.target!==this)return;var box=this.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)this.close();});
  document.addEventListener('click',function(event){
    var link=event.target.closest('[data-open-document]');if(!link)return;
    var target=sampleDetails(link.dataset.openDocument);if(!target)return;
    event.preventDefault();target.open=true;target.querySelector('summary').focus({preventScroll:true});target.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'});
  });
  function packageLink(){
    var params=new URL($('start-link').href,location.href).searchParams;params.set('platform',platform);$('package-start-link').href='start.html?'+params;
  }
  function renderPackage(value){
    if(!['wordpress','other'].includes(value))return;platform=value;
    var wp=value==='wordpress',files=['cookie-consent.js','cookie-consent.css','theme.css','install.js','START-HERE.html','preview.html','LICENSE'];
    if(wp)files.unshift('web-compliance.php');else files.push('embed.html.txt');
    $('package-filename').textContent=wp?'web-compliance-wordpress.zip':'web-compliance-install.zip';
    $('package-description').textContent=wp?pick('A plugin you upload in your WordPress dashboard.','תוסף להעלאה דרך לוח הבקרה של WordPress.'):pick('Banner files and an embed snippet for your developer.','קובצי באנר וקטע הטמעה למי שמטפל באתר.');
    $('package-next-step').textContent=wp?pick('Plugins → Add New → Upload Plugin','תוספים ← תוסף חדש ← העלאת תוסף'):pick('Upload the four runtime files and add the embed snippet.','מעלים את ארבעת קובצי הבאנר ומוסיפים את קטע ההטמעה.');
    document.querySelectorAll('[data-package-platform]').forEach(function(button){button.setAttribute('aria-pressed',String(button.dataset.packagePlatform===value));});
    var fragment=document.createDocumentFragment();files.forEach(function(name){var li=document.createElement('li'),code=document.createElement('code'),type=document.createElement('span');code.textContent=(wp?'web-compliance/':'')+name;type.className='file-type';type.textContent=name.includes('.')?name.split('.').pop().toUpperCase():'FILE';li.append(code,type);fragment.append(li);});$('package-files').replaceChildren(fragment);packageLink();
  }
  document.querySelectorAll('[data-package-platform]').forEach(function(button){button.addEventListener('click',function(){renderPackage(button.dataset.packagePlatform);});});
  ['quick-theme','preview-language'].forEach(function(id){$(id).addEventListener('change',packageLink);});
  $('explore-themes').addEventListener('click',function(event){if(event.target.closest('[data-explore-theme]')){showProduct('banner',true,true);packageLink();}});
  var primary=$('hero-start-link'),bar=$('next-bar');
  if('IntersectionObserver' in window){new IntersectionObserver(function(entries){bar.hidden=entries[0].isIntersecting;},{threshold:0}).observe(primary);}else bar.hidden=false;
  window.addEventListener('toolkit:language',function(){renderDocument(activeDocument);renderPackage(platform);});
  renderDocument('privacy');renderPackage('wordpress');
})();
/* Decorative motion never changes the visitor's live studio choices. */
(function(){
  'use strict';
  var scene=document.getElementById('motion-scene'),card=document.getElementById('motion-consent'),toggle=document.getElementById('motion-toggle'),reduced=matchMedia('(prefers-reduced-motion: reduce)'),paused=reduced.matches,visible=true,index=0,timer;
  var frames=[
    {label:'ENGLISH / 01',lang:'en',dir:'ltr',brand:'#204acb',bg:'#fff',ink:'#202d42',radius:'12px',title:'Your privacy, your choice.',body:'Choose what you share. You can change your preferences anytime.',buttons:['Accept all','Reject all','Customize']},
    {label:'עברית / 02',lang:'he',dir:'rtl',brand:'#216348',bg:'#f5fff8',ink:'#183d2e',radius:'22px',title:'הפרטיות שלכם. הבחירה שלכם.',body:'בחרו מה לשתף. תמיד אפשר לחזור ולשנות את ההעדפות.',buttons:['אישור הכול','דחיית הכול','התאמה אישית']},
    {label:'العربية / 03',lang:'ar',dir:'rtl',brand:'#702f63',bg:'#fff7fd',ink:'#382031',radius:'24px',title:'خصوصيتك، اختيارك.',body:'اختر ما تريد مشاركته. يمكنك تغيير تفضيلاتك في أي وقت.',buttons:['قبول الكل','رفض الكل','تخصيص']},
    {label:'РУССКИЙ / 04',lang:'ru',dir:'ltr',brand:'#784827',bg:'#fffaf4',ink:'#3f2b20',radius:'4px',title:'Ваши данные. Ваш выбор.',body:'Выберите, чем делиться. Настройки можно изменить в любое время.',buttons:['Принять все','Отклонить','Настроить']}
  ];
  function draw(){var frame=frames[index];card.style.setProperty('--motion-brand',frame.brand);card.style.setProperty('--motion-bg',frame.bg);card.style.setProperty('--motion-ink',frame.ink);card.style.borderRadius=frame.radius;card.style.direction=frame.dir;card.lang=frame.lang;document.getElementById('motion-language').textContent=frame.label;document.getElementById('motion-title').textContent=frame.title;document.getElementById('motion-body').textContent=frame.body;['accept','reject','customize'].forEach(function(key,i){document.getElementById('motion-'+key).textContent=frame.buttons[i];});card.classList.remove('is-changing');void card.offsetWidth;card.classList.add('is-changing');}
  function schedule(){clearInterval(timer);scene.classList.toggle('motion-paused',paused||!visible||document.hidden);if(!paused&&visible&&!document.hidden)timer=setInterval(function(){index=(index+1)%frames.length;draw();},4600);}
  function controls(){toggle.setAttribute('aria-pressed',String(paused));var label=document.getElementById('motion-toggle-text');label.removeAttribute('data-he');label.removeAttribute('data-en');label.textContent=ToolkitUI.pick(paused?'Play motion':'Pause motion',paused?'הפעלת התנועה':'עצירת התנועה');document.getElementById('motion-toggle-icon').textContent=paused?'▷':'Ⅱ';}
  toggle.addEventListener('click',function(){paused=!paused;controls();schedule();});
  reduced.addEventListener('change',function(){paused=reduced.matches;controls();schedule();});document.addEventListener('visibilitychange',schedule);window.addEventListener('toolkit:language',controls);
  if('IntersectionObserver' in window)new IntersectionObserver(function(entries){visible=entries[0].isIntersecting;schedule();},{threshold:0}).observe(scene);
  controls();schedule();
})();
