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
  window.addEventListener('toolkit:preview',packageLink);
  ['quick-theme','preview-language'].forEach(function(id){$(id).addEventListener('change',packageLink);});
  $('explore-themes').addEventListener('click',function(event){if(event.target.closest('[data-explore-theme]')){showProduct('banner',true,true);packageLink();}});
  var primary=$('hero-start-link'),bar=$('next-bar');
  if('IntersectionObserver' in window){var visibleSurfaces=new Set(),observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting)visibleSurfaces.add(entry.target);else visibleSurfaces.delete(entry.target);});bar.hidden=visibleSurfaces.size>0;},{threshold:0});observer.observe(document.querySelector('.cinematic-hero')||primary);observer.observe($('product-preview'));}else bar.hidden=false;
  window.addEventListener('toolkit:language',function(){renderDocument(activeDocument);renderPackage(platform);});
  renderDocument('privacy');renderPackage('wordpress');
})();
