(function () {
  'use strict';
  var copy={en:['Your website','Our story','The collection','Get in touch','YOUR BRAND. YOUR SPACE.','Your content lives here. Your visitors choose their cookie preferences in the banner below.','Explore the collection ↗','Example website only. The banner works; no analytics or advertising tools load.'],he:['האתר שלכם','הסיפור שלנו','הקולקציה','יצירת קשר','המותג שלכם. המקום שלכם.','כאן נמצא תוכן האתר. המבקרים בוחרים את העדפות העוגיות בבאנר למטה.','לקולקציה ↗','אתר לדוגמה בלבד. הבאנר פעיל; כלי מדידה ופרסום אינם נטענים.'],ar:['موقعك','قصتنا','المجموعة','تواصل معنا','علامتك. مساحتك.','هنا يظهر محتوى موقعك. يختار الزوار تفضيلات ملفات تعريف الارتباط في الشريط أدناه.','استكشف المجموعة ↗','موقع توضيحي فقط. الشريط يعمل ولا يتم تحميل أدوات التحليل أو الإعلانات.'],ru:['Ваш сайт','О нас','Коллекция','Контакты','ВАШ БРЕНД. ВАШЕ ПРОСТРАНСТВО.','Здесь находится ваш контент. Посетители выбирают настройки cookie в баннере ниже.','Смотреть коллекцию ↗','Только пример сайта. Баннер работает; инструменты аналитики и рекламы не загружаются.']};
  var scenes={commerce:{image:'world-fragrance.svg',label:'COMMERCE / EXAMPLE'},architecture:{image:'world-architecture.svg',label:'PORTFOLIO / EXAMPLE'},studio:{image:'studio-workspace.svg',label:'STUDIO / EXAMPLE'}};
  function sendInteraction(){parent.postMessage({type:'compliance-preview-interaction'},location.protocol==='file:'?'*':location.origin);}
  document.addEventListener('pointerdown',sendInteraction,{passive:true});document.addEventListener('keydown',sendInteraction);
  window.addEventListener('message', function (event) {
    if (!(location.protocol==='file:'?event.origin==='null'||event.origin==='file://':event.origin===location.origin) || event.source !== parent || !event.data || event.data.type !== 'compliance-preview') return;
    var config = event.data.config;
    if (!config || typeof config !== 'object' || Array.isArray(config) ||
        typeof event.data.css !== 'string' || event.data.css.length > 16000 ||
        /@import|url\s*\(|[<>]/i.test(event.data.css) ||
        (event.data.name !== undefined && (typeof event.data.name !== 'string' || event.data.name.length > 2000))) return;
    var scene=Object.hasOwn(scenes,event.data.scene)?event.data.scene:'studio',surface=document.getElementById('sample-surface');
    document.body.classList.toggle('presentation-stage',event.data.presentation==='stage');document.body.dataset.scene=scene;
    if(surface.getAttribute('src')!==scenes[scene].image){surface.src=scenes[scene].image;var main=document.getElementById('example-main');main.classList.remove('is-changing');void main.offsetWidth;main.classList.add('is-changing');}
    document.getElementById('scene-label').textContent=scenes[scene].label;
    var lang=Object.hasOwn(copy,config.language)?config.language:'en';document.documentElement.lang=lang;document.documentElement.dir=['he','ar'].includes(lang)?'rtl':'ltr';
    ['brand','nav-one','nav-two','nav-three','kicker','description','action','footer'].forEach(function(id,i){document.getElementById('sample-'+id).textContent=copy[lang][i];});
    document.getElementById('sample-name').textContent=event.data.name||copy[lang][0];
    document.getElementById('custom-style').textContent = event.data.css;
    // Preview storage never overwrites the site's real consent storage.
    CookieConsent.init(Object.assign({}, config, { storageKey: 'cc_customizer_preview', autoFocus: false, privacyPolicyUrl: 'privacy.html', onChange:function(consent){parent.postMessage({type:'compliance-preview-choice',analytics:!!consent.analytics,marketing:!!consent.marketing},location.protocol==='file:'?'*':location.origin);} }));
    CookieConsent.show();
  });
  parent.postMessage({ type: 'compliance-preview-ready' }, location.protocol==='file:'?'*':location.origin);
})();
