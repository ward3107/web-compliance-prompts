(function () {
  'use strict';
  var $=function(id){return document.getElementById(id);},ui=ToolkitUI,pick=ui.pick;
  var params=new URLSearchParams(location.search),theme=Object.hasOwn(ToolkitThemes.presets,params.get('theme'))?params.get('theme'):'cobalt';
  if(['he','ar','en','ru'].includes(params.get('language')))$('preview-language').value=params.get('language');
  else $('preview-language').value=ui.language==='he'?'he':'en';
  var scene='commerce',lastChoice=null;
  function sceneFor(key){return ['forest','olive'].includes(key)?'architecture':['espresso','coral','plum'].includes(key)?'commerce':'studio';}
  scene=sceneFor(theme);
  var names={ 'cookie-banner':['Cookie banner','באנר עוגיות'],'privacy-policy':['Privacy policy','מדיניות פרטיות'],'terms-of-use':['Terms of use','תנאי שימוש'],'refund-policy':['Refunds policy','ביטולים והחזרים'],'accessibility-baseline':['Accessibility baseline','בסיס נגישות לאתר'],'accessibility-widget':['Accessibility settings','הגדרות נגישות'],'accessibility-statement':['Accessibility statement','הצהרת נגישות'],'client-onboarding':['Client onboarding','שאלון קליטת לקוח'],'data-subject-rights':['Data subject rights','זכויות בנושא מידע אישי'],'disclaimer':['Disclaimer','הבהרות ואחריות'],'ecommerce-checkout':['Ecommerce checkout','תהליך רכישה'],'email-marketing':['Email marketing','דיוור שיווקי'],'freelancer-contract':['Freelancer contract','חוזה פרילנס']};
  var languages={en:['English','אנגלית'],he:['Hebrew','עברית'],ar:['Arabic','ערבית'],ru:['Russian','רוסית']},catalog;
  function preview(source,targetFrame){
    source=typeof source==='string'?source:'user';
    var preset=ToolkitThemes.presets[theme],language=$('preview-language').value,colors=preset.colors,light=['night','midnight'].includes(theme);
    var css='.cc-root{--cc-brand:'+colors[0]+';--cc-bg:'+colors[1]+';--cc-fg:'+colors[2]+';--cc-muted:'+colors[2]+';--cc-border:'+colors[2]+';--cc-radius:'+preset.radius+'px;font-family:'+ToolkitThemes.fonts[preset.font]+'}.cc-root .cc-btn-primary{color:'+(light?'#000':'#fff')+'}.cc-root a{color:'+colors[2]+'}';
    (targetFrame?[targetFrame]:[$('explore-preview'),$('hero-preview')].filter(Boolean)).forEach(function(frame){frame.contentWindow.postMessage({type:'compliance-preview',config:{region:'auto',language:language,brandColor:colors[0]},css:css,name:language==='he'?'האתר שלכם. הסגנון שלכם.':language==='ar'?'موقعك. أسلوبك.':language==='ru'?'Ваш сайт. Ваш стиль.':'Your website, your style.',scene:scene,presentation:frame.id==='hero-preview'?'stage':'studio'},location.protocol==='file:'?'*':location.origin);});
    var query=new URLSearchParams({theme:theme,language:language,ui:ui.language});
    $('start-link').href='start.html?'+query;document.querySelectorAll('[data-start-link]').forEach(function(link){link.href='start.html?'+query;});
    query.set('platform','wordpress');$('wordpress-link').href='start.html?'+query;query.set('platform','other');$('other-link').href='start.html?'+query;
    window.dispatchEvent(new CustomEvent('toolkit:preview',{detail:{theme:theme,language:language,scene:scene,source:source}}));
  }
  function themeName(key){return ui.t(ToolkitThemes.presets[key].name);}
  function controls(){var selected=theme;$('quick-theme').replaceChildren();Object.keys(ToolkitThemes.presets).forEach(function(key){var option=document.createElement('option');option.value=key;option.textContent=themeName(key);$('quick-theme').append(option);});$('quick-theme').value=selected;}
  function describeTheme(){ $('change-description').textContent=pick('Now showing '+themeName(theme)+'. Colors, corners and font updated.','הבאנר עבר לעיצוב '+themeName(theme)+'. הצבעים, הפינות והגופן עודכנו.');}
  controls();ToolkitThemes.gallery($('explore-themes'),'data-explore-theme',function(key){theme=key;scene=sceneFor(key);$('quick-theme').value=key;describeTheme();preview('user');});
  document.querySelectorAll('[data-explore-theme]').forEach(function(el){el.setAttribute('aria-pressed',String(el.dataset.exploreTheme===theme));});
  $('quick-theme').addEventListener('change',function(){theme=this.value;scene=sceneFor(theme);document.querySelectorAll('[data-explore-theme]').forEach(function(el){el.setAttribute('aria-pressed',String(el.dataset.exploreTheme===theme));});describeTheme();preview();});
  $('preview-language').addEventListener('change',function(){$('change-description').textContent=pick('The banner is now in '+pick.apply(null,languages[this.value])+'.','נוסח הבאנר השתנה ל'+pick.apply(null,languages[this.value])+'.');preview();});$('reopen').addEventListener('click',preview);
  ['wide','narrow'].forEach(function(id){$(id).addEventListener('click',function(){$('explore-preview').classList.toggle('mobile',id==='narrow');['wide','narrow'].forEach(function(key){$(key).setAttribute('aria-pressed',String(id===key));});});});
  function feedback(){if(!lastChoice)return;$('try-status').removeAttribute('data-he');$('try-status').removeAttribute('data-en');$('try-status').textContent=pick('Saved choice: analytics '+(lastChoice.analytics?'on':'off')+' · marketing '+(lastChoice.marketing?'on':'off')+'. No trackers load here.','הבחירה נשמרה: מדידה '+(lastChoice.analytics?'פעילה':'כבויה')+' · פרסום '+(lastChoice.marketing?'פעיל':'כבוי')+'. כאן לא נטענים כלי מעקב.');}
  window.addEventListener('message',function(event){
    var frame=[$('explore-preview'),$('hero-preview')].filter(Boolean).find(function(el){return event.source===el.contentWindow;});
    if(!(location.protocol==='file:'?event.origin==='null'||event.origin==='file://':event.origin===location.origin)||!frame||!event.data)return;
    if(event.data.type==='compliance-preview-ready')preview('ready',frame);
    if(event.data.type==='compliance-preview-interaction')window.dispatchEvent(new CustomEvent('toolkit:preview-interaction',{detail:{frame:frame.id}}));
    if(event.data.type==='compliance-preview-choice'&&typeof event.data.analytics==='boolean'&&typeof event.data.marketing==='boolean'){lastChoice={analytics:event.data.analytics,marketing:event.data.marketing};feedback();window.dispatchEvent(new CustomEvent('toolkit:choice',{detail:lastChoice}));}
  });
  window.ToolkitPreview={state:function(){return {theme:theme,language:$('preview-language').value,scene:scene};},choose:function(value,source){
    if(value.theme&&Object.hasOwn(ToolkitThemes.presets,value.theme)){theme=value.theme;scene=sceneFor(theme);}
    if(['en','he','ar','ru'].includes(value.language))$('preview-language').value=value.language;
    if(['commerce','architecture','studio'].includes(value.scene))scene=value.scene;
    $('quick-theme').value=theme;document.querySelectorAll('[data-explore-theme]').forEach(function(el){el.setAttribute('aria-pressed',String(el.dataset.exploreTheme===theme));});describeTheme();preview(source||'user');
  },reopen:function(){preview('user');}};
  function detail(container,title,note,source,rtl,key){var details=document.createElement('details'),summary=document.createElement('summary'),small=document.createElement('small'),pre=document.createElement('pre');if(key)details.dataset.documentKey=key;summary.append(document.createTextNode(title));small.textContent=note;summary.append(small);pre.textContent=source;pre.dir=rtl?'rtl':'ltr';pre.lang=rtl?'he':'en';pre.tabIndex=0;pre.setAttribute('role','region');pre.setAttribute('aria-label',title);pre.dataset.noTranslate='';details.append(summary,pre);container.append(details);}
  var sample=ToolkitDocuments.build({values:{market:'il','business-name':'עסק לדוגמה — נתונים בדיוניים','site-url':'https://example.com','contact-email':'example@example.com','privacy-url':'/privacy'},answers:{sales:'unknown',accounts:'unknown',forms:'unknown',tracking:'unknown',sensitive:'unknown'}},{});
  function documents(){var opened=Array.from($('document-examples').querySelectorAll('details[open]')).map(function(el){return el.dataset.documentKey;});$('document-examples').replaceChildren();Object.keys(sample.documents).forEach(function(key){detail($('document-examples'),ui.t(ToolkitDocuments.titles[key]),pick('Hebrew draft · Israel only · Complete and review with a lawyer','טיוטה בעברית · ישראל בלבד · נדרשת השלמה וביקורת'),sample.documents[key],true,key);});opened.forEach(function(key){$('document-examples').querySelector('[data-document-key="'+key+'"]').open=true;});}
  function renderCatalog(){if(!catalog)return;var opened=Array.from($('catalog-items').querySelectorAll('details')).map(function(el){return el.open;});$('catalog-items').replaceChildren();catalog.catalog.forEach(function(item,index){var kind=item.id==='cookie-banner'?pick('Working component + prompt','רכיב מוכן + פרומפט'):(['privacy-policy','terms-of-use','refund-policy'].includes(item.id)?pick('Draft generator + prompt','מחולל טיוטה + פרומפט'):pick('Implementation prompt','פרומפט ליישום'));var scope=item.scope==='il'?pick('Israel only','ישראל בלבד'):item.scope==='il+eu'?pick('Israel + EU overlay','שילוב ישראל והאיחוד האירופי'):pick('Context from all jurisdiction packs','הקשר מכל חבילות המדינה');detail($('catalog-items'),pick.apply(null,names[item.id]||[item.id,item.id]),kind+' · '+scope,catalog.files['skills/web-compliance/templates/'+item.id+'.md'],false);$('catalog-items').lastElementChild.open=!!opened[index];});$('catalog-status').textContent='';}
  documents();ToolkitSource.load().then(function(data){catalog=data;renderCatalog();}).catch(function(){$('catalog-status').textContent=pick('Templates could not load. Refresh or open the repository on GitHub.','התבניות לא נטענו. רעננו או פתחו את המאגר ב־GitHub.');});
  function offline(){if(location.protocol==='file:'){$('offline-download').hidden=true;$('offline-status').textContent=pick('You’re using the local studio. Build packages offline. External source links need internet.','אתם בסטודיו המקומי. הכינו חבילות בלי אינטרנט; קישורי מקורות חיצוניים דורשים חיבור.');}}
  window.addEventListener('toolkit:language',function(){controls();describeTheme();documents();renderCatalog();offline();feedback();preview('interface');});offline();preview('init');
})();
