(function () {
  'use strict';
  var t=window.ToolkitUI?ToolkitUI.t:function(s){return s;},uiHtml=window.ToolkitUI?ToolkitUI.html:function(s){return s;};
  var $ = function (id) { return document.getElementById(id); };
  var step = 0, toolkit, studio, documentStudio, theme = 'ocean';
  var themes = ToolkitThemes.presets;
  var platforms = ToolkitPlatforms;
  function platformOptions() {
    var selected = $('platform').value || 'unknown';
    $('platform').replaceChildren();
    platforms.list().forEach(function (route) {
      var option = document.createElement('option'); option.value = route.id;
      option.textContent = platforms.text(route.id, ToolkitUI.language).name; $('platform').append(option);
    });
    $('platform').value = platforms.get(selected) ? selected : 'unknown'; platformHint();
  }
  function platformHint() {
    var route = platforms.get($('platform').value) || platforms.get('unknown');
    var copy = platforms.text(route.id, ToolkitUI.language);
    $('platform-hint').textContent = copy.availability + ' · ' + copy.note;
    var url = new URL('platforms.html', location.href);
    url.searchParams.set('ui', ToolkitUI.language === 'he' ? 'he' : 'en');
    url.searchParams.set('platform', route.id);
    $('platform-route-link').href = url.href;
  }
  var questions = {sales:t('אפשר לקנות מוצרים או שירותים באתר?'),accounts:t('לקוחות יכולים לפתוח חשבון?'),forms:t('יש טפסים לאיסוף פרטים?'),tracking:t('משתמשים בכלי מדידה או פרסום?'),sensitive:t('נאסף מידע רפואי, מידע על ילדים או מידע רגיש אחר?')};
  var answers = {yes:t('כן'),no:t('לא'),unknown:t('לא יודע/ת')};
  var marketNames = {il:t('ישראל'),eu:t('האיחוד האירופי'),'il+eu':t('ישראל והאיחוד האירופי'),uk:t('בריטניה'),'us-ca':t('קליפורניה'),us:t('ארה״ב — שכבה פדרלית בלבד'),ca:t('קנדה'),unknown:t('מדינות אחרות / לא ידוע')};
  var fields = ['site-url','business-name','contact-email','platform','market','output-language','privacy-url','accent','placement','background','foreground','radius','font'];
  var stepNames=[t('פרטי האתר'),t('צרכי העסק'),t('מראה הבאנר'),t('קבצים והתקנה')];
  var guidance=[
    [t('רק הפרטים של העסק'),t('כתובת האתר, שם העסק ואימייל לפניות פרטיות. לא צריך לתת לנו גישה לאתר או סיסמה.'),t('חבילת באנר והוראות התקנה שמתאימות למערכת שבחרתם.')],
    [t('לא חייבים לדעת הכול'),t('השאלות מתארות את הפעילות באתר. תשובה לא ידועה תיכנס לרשימת השאלות לבדיקה.'),t('רשימת נושאים לבדיקה שמתאימה לתשובות שלכם.')],
    [t('בחרו, ואז נסו'),t('העיצוב שבחרתם בהתנסות כבר כאן. אפשר להשאיר אותו או לשנות. לחצו גם על כפתורי הבאנר בתצוגה.'),t('באנר בעיצוב ובשפה שלכם, עם אפשרות לשינוי העדפות.')],
    [t('ההורדה היא רק ההתחלה'),t('שמרו את הקובץ ואז פעלו לפי הוראות ההתקנה. אם מישהו אחר מנהל את האתר, העבירו אליו את ההוראות.'),t('קבצים והנחיות. התקנה, בדיקת כלי מעקב וביקורת משפטית עדיין נדרשות.')]
  ];
  function escape(value) { return String(value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function json(value) { return JSON.stringify(value,null,2); }
  function httpUrl(value) { try { var url = new URL(value); return ['https:','http:'].includes(url.protocol) && !url.username && !url.password; } catch(e) { return false; } }
  function privacyUrl(value) {return !value || ToolkitInstall.validPolicy(value);}
  function project() {
    var values = {}; fields.forEach(function(id){values[id]=$(id).value.trim();});
    var response = {}; Object.keys(questions).forEach(function(key){response[key]=$('answer-'+key).value;});
    return {format:'web-compliance-project',version:1,theme:theme,values:values,answers:response,studio:studio.state(),documents:documentStudio?documentStudio.state():undefined};
  }
  function config() {
    // A client's markets are not a visitor's verified location. Start opt-in everywhere.
    return {textOverrides:studio?studio.copy():{},region:'auto',language:$('output-language').value,privacyPolicyUrl:$('privacy-url').value.trim(),brandColor:$('accent').value,ukFirstPartyAnalyticsExempt:false};
  }
  function luminance(hex) { var rgb=hex.slice(1).match(/../g).map(function(x){var v=parseInt(x,16)/255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4);});return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722; }
  function css() {
    var color=$('accent').value,bg=$('background').value,fg=$('foreground').value,r=Number($('radius').value),light=luminance(color),buttonText=(1.05/(light+.05))>=((light+.05)/.05)?'#fff':'#000';
    var result='.cc-root{--cc-brand:'+color+';--cc-bg:'+bg+';--cc-fg:'+fg+';--cc-muted:'+fg+';--cc-border:'+fg+';--cc-radius:'+r+'px;font-family:'+ToolkitThemes.fonts[$('font').value]+'}.cc-root .cc-btn-primary{color:'+buttonText+'}.cc-root a{color:'+fg+'}.cc-root button,.cc-root input{font-family:inherit}.cc-root :focus-visible{outline-color:'+fg+'}\n';
    if($('placement').value==='top') result+='.cc-root{top:0;bottom:auto}.cc-root .cc-banner{border-bottom:1px solid var(--cc-border);border-radius:0 0 '+r+'px '+r+'px}\n';
    if($('placement').value==='corner') result+='.cc-root{left:auto;right:16px;bottom:16px;width:min(440px,calc(100% - 32px));max-height:calc(100dvh - 32px)}.cc-root .cc-banner{border-bottom:1px solid var(--cc-border);border-radius:'+r+'px}\n';
    result+='.cc-root .cc-btn{border-radius:'+Math.min(r,16)+'px}\n';
    return result+(studio?studio.css():'')+'.wct-preferences{position:fixed;inset-inline-end:16px;bottom:16px;z-index:2147482000;min-height:44px;padding:10px 16px;background:'+bg+';color:'+fg+';border:2px solid '+fg+';border-radius:8px;cursor:pointer;font:inherit}.wct-preferences:focus-visible{outline:3px solid '+fg+';outline-offset:3px}\n';
  }
  function contrast() {var a=luminance($('background').value),b=luminance($('foreground').value);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);}
  function preview() {if(studio)studio.syncLanguage();$('radius-value').textContent=$('radius').value;$('contrast').textContent=(contrast()>=4.5?t('ניגודיות הטקסט תקינה: '):t('בחרו צבעים מנוגדים יותר: '))+contrast().toFixed(2)+' / 4.5'; $('guided-preview').contentWindow.postMessage({type:'compliance-preview',config:config(),css:css(),name:$('business-name').value},location.protocol==='file:'?'*':location.origin); }
  function valid(current) {
    var controls=document.querySelector('[data-step="'+current+'"]').querySelectorAll('input,select');
    for(var el of controls){ if(!el.checkValidity()){$('form-error').textContent=t('בדקו את השדה ״')+(document.querySelector('label[for="'+el.id+'"]')?.textContent||el.id)+t('״ לפני שממשיכים.');el.reportValidity();return false;} }
    if(current===0 && !httpUrl($('site-url').value.trim())) { $('form-error').textContent=t('הזינו כתובת אתר שמתחילה ב־https:// או http://, ללא פרטי כניסה.');$('site-url').focus();return false; }
    if(current===1 && !privacyUrl($('privacy-url').value.trim())) { $('form-error').textContent=t('הקישור למדיניות צריך להיות כתובת http/https או נתיב כמו /privacy.');$('privacy-url').focus();return false; }
    if(current===2 && contrast()<4.5){$('form-error').textContent=t('בחרו רקע וטקסט מנוגדים יותר לפני הכנת החבילה (לפחות 4.5).');return false;}
    return true;
  }
  function show(next) {
    step=next;document.body.classList.toggle('design-step',step===2);document.querySelectorAll('[data-step]').forEach(function(el){el.hidden=Number(el.dataset.step)!==step;});
    document.querySelectorAll('.progress li').forEach(function(el,i){if(i===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');el.classList.toggle('complete',i<step);});
    $('step-counter').textContent=t('שלב ')+(step+1)+t(' מתוך 4 · ')+t(stepNames[step]);
    $('help-title').textContent=t(guidance[step][0]);$('help-text').textContent=t(guidance[step][1]);$('help-result').textContent=t(guidance[step][2]);
    $('next-hint').textContent=[t('הבא: כמה שאלות על העסק'),t('הבא: בחירת עיצוב וניסיון של הבאנר'),t('הבא: סיכום, הורדה והוראות התקנה'),t('אפשר לחזור ולעדכן לפני ההורדה')][step];
    $('back').hidden=step===0;$('next').hidden=step===3;$('next').textContent=[t('המשך לצרכי העסק ←'),t('המשך לבחירת עיצוב ←'),t('לבדיקת החבילה ולהורדה ←'),''][step];$('form-error').textContent='';
    if(step===2)preview();if(step===3){summary();documentStudio.refresh();}$('step-'+step).focus({preventScroll:true});$('setup').scrollIntoView({block:'start'});
  }
  function openQuestions() {
    var list=[];Object.keys(questions).forEach(function(key){if($('answer-'+key).value==='unknown')list.push(t(questions[key]));});
    if(!$('privacy-url').value.trim())list.push(t('אין עדיין קישור למדיניות פרטיות. נדרשים הכנה ובדיקה לפני התקנה.'));
    if($('market').value==='unknown')list.push(t('צריך לברר לאילו מדינות העסק פונה ואילו דינים רלוונטיים.'));
    if($('platform').value==='unknown')list.push(t('צריך לזהות את מערכת האתר כדי לבחור דרך התקנה.'));
    return list;
  }
  function topics() {
    var items=[t('פרטיות, עוגיות ונגישות')];
    if($('answer-sales').value!=='no')items.push(t('תנאי רכישה, ביטולים והחזרים'));
    if($('answer-accounts').value!=='no')items.push(t('חשבונות משתמשים, הרשאות ושמירת מידע'));
    if($('answer-forms').value!=='no')items.push(t('איסוף פרטים בטפסים והודעות למשתמשים'));
    if($('answer-tracking').value!=='no')items.push(t('כלי מעקב, ספקים והסכמה'));
    if($('answer-sensitive').value!=='no')items.push(t('בדיקה פרטנית של מידע רגיש או מידע על ילדים'));
    return items;
  }
  function summary() {
    $('summary').replaceChildren();var name=document.createElement('p');name.textContent=$('business-name').value+' · '+t(marketNames[$('market').value]);$('summary').append(name);
    var open=openQuestions();var info=document.createElement('p');info.textContent=open.length?open.length+t(' שאלות פתוחות ייכללו בתיק לבדיקה.'):t('התשובות הוזנו. עדיין נדרשות בדיקות באתר ובדיקה משפטית.');$('summary').append(info);
    var route=platforms.get($('platform').value),copy=platforms.text(route.id,ToolkitUI.language),wp=route.mode==='plugin',planning=route.mode==='conditional';
    $('installation-text').textContent=copy.name+' · '+copy.availability;
    $('installation-route-status').textContent=copy.note;
    $('download-install').textContent=planning?ToolkitUI.pick('Download integration plan','הורדת תוכנית שילוב'):wp?t('הורדת תוסף WordPress'):t('הורדת חבילה למתקין');
    var unidentified=route.mode==='identify';
    var blocked=unidentified || (!planning && (!$('privacy-url').value.trim() || $('market').value==='unknown'));
    $('download-install').disabled=blocked || !toolkit;
    $('installation-blocker').textContent=unidentified?t('צריך לזהות את מערכת האתר כדי לבחור דרך התקנה.'):blocked?t('אפשר כבר להוריד תיק לעורך דין. להורדת ההתקנה, חזרו לשאלון והשלימו את מדינות היעד ואת הקישור למדיניות הפרטיות.'):'';
    $('fix-details').hidden=!blocked;
    $('install-steps').replaceChildren();
    copy.steps.forEach(function(text){var li=document.createElement('li');li.textContent=text;$('install-steps').append(li);});
  }
  function save(blob,name) { var url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(function(){URL.revokeObjectURL(url);},30000); }
  function page(title,body) { return '<!doctype html><html lang="'+ToolkitUI.language+'" dir="'+(ToolkitUI.language==='he'?'rtl':'ltr')+'"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escape(title)+'</title><style>body{font-family:Arial,sans-serif;max-width:850px;margin:40px auto;padding:20px;line-height:1.8;color:#183348}h1{line-height:1.3}li{margin:8px 0}table{border-collapse:collapse;width:100%}td,th{padding:12px;border:1px solid #9aaab5;text-align:start;overflow-wrap:anywhere}@media print{body{margin:0}}</style><body><h1>'+escape(title)+'</h1>'+body+'</body></html>'; }
  function reviewReport() {
    var p=project();return page(t('תיק הכנה לבדיקה משפטית'),
      uiHtml('<h2>נוסח הבאנר שהלקוח ערך</h2><p>שדות שלא נערכו משתמשים בנוסח המקורי של הטולקיט. יש לבדוק התאמה לפעילות האתר ומשמעות הכפתורים.</p><pre style="white-space:pre-wrap;overflow-wrap:anywhere">')+escape(json(studio.copy()))+uiHtml('</pre><p>הוכן בתאריך ')+new Date().toISOString().slice(0,10)+uiHtml('. זהו סיכום תשובות הלקוח, לא חוות דעת או אישור משפטי. ניתן להדפיס או לשמור כ־PDF מתפריט הדפדפן.</p><h2>העסק והאתר</h2><table><tr><th>עסק</th><td>')+escape(p.values['business-name'])+uiHtml('</td></tr><tr><th>אתר</th><td>')+escape(p.values['site-url'])+uiHtml('</td></tr><tr><th>אימייל לפניות</th><td>')+escape(p.values['contact-email'])+uiHtml('</td></tr><tr><th>קהלי יעד</th><td>')+escape(t(marketNames[p.values.market]))+uiHtml('</td></tr></table><h2>תשובות הלקוח</h2><table>')+Object.keys(questions).map(function(key){return '<tr><th>'+escape(t(questions[key]))+'</th><td>'+escape(t(answers[p.answers[key]]))+'</td></tr>';}).join('')+uiHtml('</table><h2>שאלות להשלמה</h2><ul>')+openQuestions().map(function(q){return '<li>'+escape(q)+'</li>';}).join('')+uiHtml('</ul><h2>נושאים מוצעים לבדיקה</h2><ul>')+topics().map(function(q){return '<li>'+escape(q)+'</li>';}).join('')+uiHtml('</ul><p>האתר לא נסרק ולא נבדק אוטומטית. התוסף אינו מנהל את כלי המעקב הקיימים. יש להשוות את התשובות להתנהגות האמיתית באתר.</p><h2>תיעוד הביקורת המקצועית</h2><p>למילוי על ידי עורך הדין: שם ומדינות רלוונטיות; תאריך; גרסאות שנבדקו; היקף, הנחות והחרגות; ליקויים ותיקונים; מסמכים או חוות דעת שנמסרו. כל חבילות המקורות בטולקיט ממתינות לביקורת משפטית ואין לראות בהן רשימה מלאה של הדין החל.</p><p>אין כיום עורך דין שותף או מחיר מוסכם. הלקוח בוחר למי להעביר את התיק. לא נשלח מידע על ידי הטולקיט.</p>'));
  }
  function instructions(wp) {
    var route=platforms.get($('platform').value),copy=platforms.text(route.id,ToolkitUI.language),code=platforms.snippet(route.id);
    var details='<h2>'+escape(copy.name)+'</h2><p>'+escape(copy.availability)+'</p><p>'+escape(copy.note)+'</p><ol>'+copy.steps.map(function(text){return '<li>'+escape(text)+'</li>';}).join('')+'</ol>';
    if(code)details+='<pre dir="ltr" style="white-space:pre-wrap;overflow-wrap:anywhere;text-align:left">'+escape(code)+'</pre>';
    if(route.mode==='files')details+='<p>'+escape(ToolkitUI.pick('Open preview.html for a local preview, and use embed.html.txt for embedding. Upload only the four runtime files. Keep project files and review documents private.','פתחו preview.html לתצוגה מקומית, והשתמשו ב־embed.html.txt להטמעה. העלו רק את ארבעת קובצי הריצה. שמרו את קובצי הפרויקט והבדיקה באופן פרטי.'))+'</p>';
    if(route.mode==='framework')details+='<p>'+escape(ToolkitUI.pick('Runtime files: cookie-consent.js, cookie-consent.css, theme.css, install.js and mount-banner.js. Load the single bootstrap once. Do not also add embed.html.txt and the two scripts separately.','קובצי הריצה: cookie-consent.js, cookie-consent.css, theme.css, install.js ו־mount-banner.js. טענו רק את הטוען פעם אחת. אל תוסיפו במקביל הטמעה נפרדת של שני הסקריפטים.'))+'</p>';
    details+='<ul>'+route.docs.map(function(doc){return '<li><a rel="noreferrer" href="'+escape(doc[1])+'">'+escape(doc[0])+'</a></li>';}).join('')+'</ul>';
    return page(t('התקנה ובדיקה באתר'),uiHtml('<p>עבור ')+escape($('business-name').value)+' — '+escape($('site-url').value)+'</p>'+details+uiHtml('<h2>רשימת בדיקות למתקין</h2><ul><li>בחלון פרטי, בדקו קבלה, דחייה, שינוי העדפות וטעינה חוזרת.</li><li>ודאו שקישור מדיניות הפרטיות קיים ומתאים לעסק.</li><li>בדקו מקלדת, נייד וכיוון הכתיבה.</li><li>חברו את כלי המעקב לאירוע compliance:consent ובדקו ברשת שהם חסומים לפני הסכמה ולאחר ביטולה. אין חסימה אוטומטית של קוד מתוספים אחרים.</li><li>הבאנר מתחיל ב־opt-in לכל המבקרים. בחירת מדינות בשאלון אינה זיהוי מיקום המבקר.</li></ul><h2>בדיקה משפטית</h2><p>פנו לעורך דין מתאים ובקשו בדיקת המסמכים וההתנהגות הרלוונטית באתר. אין כאן אישור משפטי.</p>'));
  }
  function installation() {
    var route=platforms.get($('platform').value);
    if(!toolkit || !route || route.mode==='identify')return;
    if(route.mode==='conditional'){
      var plan={'START-HERE.html':instructions(false),'PLATFORM.json':json(platforms.manifest(route.id)),'STATUS.txt':'PLANNING ONLY. No native connector, consent API bridge or verified installation is included. Keep the existing consent solution until integration is implemented and tested.'};
      save(ToolkitZip(plan),'web-compliance-'+route.id+'-plan.zip');$('download-status').textContent=ToolkitUI.pick('Integration plan prepared. No installation or consent synchronization has been performed.','תוכנית השילוב הוכנה. לא בוצעה התקנה או סנכרון הסכמה.');return;
    }
    if(contrast()<4.5 || !$('privacy-url').value.trim() || $('market').value==='unknown')return;
    var wp=route.mode==='plugin',prefix=wp?'web-compliance/':'',files={};
    ['cookie-consent.js','cookie-consent.css'].forEach(function(name){files[prefix+name]=toolkit.files['widgets/cookie-consent/'+name];});
    files[prefix+'theme.css']=css();files[prefix+'install.js']=ToolkitInstall.script(config());files[prefix+'LICENSE']=toolkit.files.LICENSE;
    if(wp)files[prefix+'web-compliance.php']=toolkit.files['integrations/wordpress/web-compliance.php'];
    files[prefix+'START-HERE.html']=instructions(wp);
    files[prefix+'PLATFORM.json']=json(platforms.manifest(route.id));
    files[prefix+'preview.html']=ToolkitInstall.preview($('output-language').value);
    if(route.mode==='framework'){
      files['mount-banner.js']=ToolkitInstall.bootstrap();files['integration-example.txt']=platforms.snippet(route.id);
      files['embed.html.txt']='<script defer src="/web-compliance/mount-banner.js"></script>\n';
    }else if(!wp)files['embed.html.txt']=ToolkitInstall.snippet();
    save(ToolkitZip(files),wp?'web-compliance-wordpress.zip':route.mode==='framework'?'web-compliance-'+route.id+'.zip':'web-compliance-install.zip');$('download-status').textContent=t('הקובץ הוכן להורדה. התקנה ובדיקה באתר עדיין נדרשות.');
  }
  function reviewDownload() {
    var reviewProject=project();if($('market').value!=='il')delete reviewProject.documents;
    var files={'review-summary.html':reviewReport(),'project.json':json(reviewProject),'STATUS.txt':'DRAFT FOR LEGAL REVIEW. No lawyer has reviewed or signed this project. No production scan or integration test has been performed.'};
    if(toolkit && $('market').value!=='unknown') {
      var codes=$('market').value.split('+');if(codes.includes('us-ca'))codes.unshift('us');
      codes.forEach(function(code){files['sources/'+code+'.json']=json(toolkit.packs[code]);});
    }
    Object.assign(files,documentStudio.files(true));
    save(ToolkitZip(files),'legal-review-package.zip');$('download-status').textContent=t('התיק הוכן להורדה. פתחו review-summary.html והעבירו לעורך דין לבחירתכם. דבר לא נשלח אוטומטית.');
  }
  async function resume(event) {
    var file=event.target.files[0];if(!file)return;
    try {
      if(file.size>600000)throw new Error();var value=JSON.parse(await file.text());
      if(value.format!=='web-compliance-project'||value.version!==1||!Object.hasOwn(themes,value.theme)||!value.values||!value.answers)throw new Error();
      if(value.documents!==undefined)documentStudio.validate(value.documents);
      if(value.studio!==undefined)studio.validate(value.studio);
      var defaults={background:themes[value.theme].colors[1],foreground:themes[value.theme].colors[2],radius:String(themes[value.theme].radius),font:themes[value.theme].font};
      Object.keys(defaults).forEach(function(key){if(value.values[key]===undefined)value.values[key]=defaults[key];});
      fields.forEach(function(id){var text=value.values[id];if(typeof text!=='string'||text.length>2000)throw new Error();var el=$(id);if(el.tagName==='SELECT'&&!Array.from(el.options).some(function(opt){return opt.value===text;}))throw new Error();});
      if(!/^#[0-9a-f]{6}$/i.test(value.values.accent)||!httpUrl(value.values['site-url'])||!privacyUrl(value.values['privacy-url']))throw new Error();
      if(!/^#[0-9a-f]{6}$/i.test(value.values.background)||!/^#[0-9a-f]{6}$/i.test(value.values.foreground)||!/^([0-9]|1[0-9]|2[0-8])$/.test(value.values.radius))throw new Error();
      Object.keys(questions).forEach(function(key){if(!Object.hasOwn(answers,value.answers[key]))throw new Error();});
      fields.forEach(function(id){$(id).value=value.values[id];});Object.keys(questions).forEach(function(key){$('answer-'+key).value=value.answers[key];});theme=value.theme;studio.restore(value.studio);documentStudio.restore(value.documents);markTheme();platformHint();show(0);$('load-status').textContent=t('הפרויקט נטען. אפשר לבדוק ולעדכן את הפרטים.');
    } catch(error) {$('load-status').textContent=t('הקובץ אינו פרויקט תקין מהמערכת. בחרו קובץ JSON ששמרתם כאן (עד 600KB).');}
    event.target.value='';
  }
  function markTheme(){document.querySelectorAll('[data-theme]').forEach(function(button){button.setAttribute('aria-pressed',String(button.dataset.theme===theme));});}
  Object.keys(questions).forEach(function(key){var label=document.createElement('label'),select=document.createElement('select');select.id='answer-'+key;label.htmlFor=select.id;label.textContent=t(questions[key]);Object.keys(answers).forEach(function(answer){var option=document.createElement('option');option.value=answer;option.textContent=answers[answer];select.append(option);});select.value='unknown';$('business-questions').append(label,select);});
  studio=ToolkitStudio($('copy-studio'),function(){return $('output-language').value;},preview);
  documentStudio=ToolkitDocumentStudio($('document-studio'),project,save);
  $('output-language').addEventListener('change',function(){studio.syncLanguage();});
  $('setup').addEventListener('submit',function(event){event.preventDefault();if(step<3 && toolkit && valid(step))show(step+1);});
  $('next').addEventListener('click',function(){if(valid(step))show(step+1);});$('back').addEventListener('click',function(){show(step-1);});
  $('setup').addEventListener('input',function(){if(step===2)preview();$('download-status').textContent='';});
  $('setup').addEventListener('change',function(event){if(step===2){preview();var labels={accent:t('צבע הכפתורים'),background:t('רקע הבאנר'),foreground:t('צבע הטקסט'),radius:t('עיגול הפינות'),font:t('הגופן'),placement:t('מיקום הבאנר'),'output-language':t('שפת הבאנר')};if(labels[event.target.id])$('guided-change').textContent=labels[event.target.id]+t(' עודכן בתצוגה החיה.');}});
  ToolkitThemes.gallery($('theme-gallery'),'data-theme',function(key,preset){theme=key;['accent','background','foreground'].forEach(function(id,i){$(id).value=preset.colors[i];});$('radius').value=preset.radius;$('font').value=preset.font;$('guided-change').textContent=t('הבאנר עבר לעיצוב ')+t(preset.name)+t('. הצבעים, הפינות והגופן עודכנו.');preview();});
  $('theme-gallery').addEventListener('click',function(event){if(step===2 && innerWidth<=700 && event.target.closest('[data-theme]'))$('design-preview').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});});
  ['guided-wide','guided-narrow'].forEach(function(id){$(id).addEventListener('click',function(){var mobile=id==='guided-narrow';$('guided-preview').classList.toggle('mobile',mobile);$('guided-wide').setAttribute('aria-pressed',String(!mobile));$('guided-narrow').setAttribute('aria-pressed',String(mobile));});});
  // Only known display preferences may cross from the public preview. Never
  // place business details or serialized project data in a shareable URL.
  var params=new URLSearchParams(location.search),selectedTheme=params.get('theme');
  if(selectedTheme && Object.hasOwn(themes,selectedTheme))document.querySelector('[data-theme="'+selectedTheme+'"]').click();
  if(['he','ar','en','ru'].includes(params.get('language')))$('output-language').value=params.get('language');
  if(ToolkitUI.language==='he'&&!params.has('language'))$('output-language').value='he';
  if(ToolkitUI.language==='he')$('market').value='il';
  platformOptions();
  if(platforms.get(params.get('platform'))){$('platform').value=params.get('platform');platformHint();}
  $('platform').addEventListener('change',platformHint);
  $('preview-again').addEventListener('click',preview);
  $('download-install').addEventListener('click',installation);$('download-review').addEventListener('click',reviewDownload);
  $('fix-details').addEventListener('click',function(){if($('platform').value==='unknown'){show(0);$('platform').focus();return;}show(1);if(!$('privacy-url').value.trim())$('privacy-url').focus();else $('market').focus();});
  $('download-handoff').addEventListener('click',function(){save(new Blob([instructions($('platform').value==='wordpress')],{type:'text/html;charset=utf-8'}),'installation-handoff.html');});
  $('save-project').addEventListener('click',function(){save(new Blob([json(project())],{type:'application/json'}),'web-compliance-project.json');});$('resume-project').addEventListener('change',resume);
  window.addEventListener('message',function(event){if((location.protocol==='file:'?event.origin==='null'||event.origin==='file://':event.origin===location.origin) && event.source===$('guided-preview').contentWindow && event.data && event.data.type==='compliance-preview-ready')preview();});
  window.addEventListener('toolkit:language',function(){ToolkitUI.apply();platformOptions();show(step);if(step===2)preview();});
  ToolkitSource.load().then(function(data){if(!data.files['integrations/wordpress/web-compliance.php'])throw new Error();toolkit=data;$('next').disabled=false;$('load-status').textContent=t('מוכנים להתחיל. הפרטים אינם נשלחים לשרת.');}).catch(function(){$('load-status').textContent=t('קובצי ההתקנה לא נטענו. בדקו את החיבור ורעננו את העמוד.');});
})();
