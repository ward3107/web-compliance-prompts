/* Explicit English/Hebrew UI copy. No translation service, storage or network. */
(function(){
  'use strict';
  var language=new URLSearchParams(location.search).get('ui')==='he'?'he':'en';
  var known=window.ToolkitEnglish||{},reverse={};
  Object.keys(known).forEach(function(he){reverse[known[he]]=he;});
  function t(value){var text=String(value),source=Object.hasOwn(known,text)?text:reverse[text];return source===undefined?text:language==='he'?source:known[source];}
  function translateText(value){var core=value.trim(),before=value.slice(0,value.indexOf(core)),after=value.slice(value.indexOf(core)+core.length);if(!core)return value;var source=Object.hasOwn(known,core)?core:reverse[core];return source===undefined?value:before+(language==='he'?source:known[source])+after;}
  function escape(value){return String(value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function html(value){return value.replace(/(^|>)([^<>]+)(?=<|$)/g,function(match,start,text){var out=translateText(text);return start+(out===text?text:escape(out));});}
  function links(){document.querySelectorAll('[data-ui-link],a[href="./"],a[href="explore.html"],a[href="connect.html"],a[href="legal-review.html"],a[href="start.html"]').forEach(function(a){a.dataset.uiLink='';var url=new URL(a.getAttribute('href'),location.href);url.searchParams.set('ui',language);a.href=url.pathname.split('/').pop()+(url.search?'?'+url.searchParams:'')+url.hash;if(!url.pathname.split('/').pop())a.href=(location.protocol==='file:'?'START-HERE.html':'./')+'?ui='+language;});}
  function apply(root){
    root=root||document;
    root.querySelectorAll('[data-he]').forEach(function(el){if(!el.hasAttribute('data-en'))el.dataset.en=el.textContent;el.textContent=language==='he'?el.dataset.he:el.dataset.en;});
    ['label','title','alt','placeholder'].forEach(function(key){root.querySelectorAll('[data-he-'+key+']').forEach(function(el){var attr=key==='label'?'aria-label':key;if(!el.hasAttribute('data-en-'+key))el.setAttribute('data-en-'+key,el.getAttribute(attr)||'');el.setAttribute(attr,el.getAttribute('data-'+language+'-'+key));});});
    root.querySelectorAll('[data-ui-language]').forEach(function(button){button.setAttribute('aria-pressed',String(button.dataset.uiLanguage===language));});
    // Only exact, reviewed UI phrases change. User input and legal draft content do not.
    var walker=document.createTreeWalker(root.nodeType===9?root.body:root,NodeFilter.SHOW_TEXT),node;
    if(walker.currentNode)while((node=walker.nextNode())){var parent=node.parentElement;if(!parent||parent.closest('script,style,pre,code,textarea,input,[data-no-translate],[data-he]'))continue;node.nodeValue=translateText(node.nodeValue);}
    links();
  }
  function set(value){if(!['en','he'].includes(value))return;language=value;window.ToolkitUI.language=value;document.documentElement.lang=value;document.documentElement.dir=value==='he'?'rtl':'ltr';var url=new URL(location.href);url.searchParams.set('ui',value);try{history.replaceState(null,'',url.href);}catch(ignore){}apply();window.dispatchEvent(new Event('toolkit:language'));}
  window.ToolkitUI={language:language,t:t,html:html,apply:apply,set:set,pick:function(en,he){return language==='he'?he:en;}};
  document.documentElement.lang=language;document.documentElement.dir=language==='he'?'rtl':'ltr';
  document.addEventListener('DOMContentLoaded',function(){apply();});
  document.addEventListener('click',function(event){var button=event.target.closest('[data-ui-language]');if(button)set(button.dataset.uiLanguage);});
})();
