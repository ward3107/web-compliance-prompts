/* Shared browser/MCP installer. No dependencies, filesystem access or network. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ToolkitInstall=factory();})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  var labels={he:'הגדרות עוגיות',ar:'إعدادات ملفات الارتباط',en:'Cookie preferences',ru:'Настройки файлов cookie'};
  function policy(value){
    if(typeof value!=='string'||!value||value.length>500||/[\\\s<>\u0000-\u001f\u007f]/.test(value))return false;
    if(/^\/(?!\/)/.test(value))return true;
    try{var url=new URL(value);return ['https:','http:'].includes(url.protocol)&&!url.username&&!url.password;}catch(e){return false;}
  }
  function script(config){
    if(!config||!Object.hasOwn(labels,config.language)||!policy(config.privacyPolicyUrl)||!/^#[0-9a-f]{6}$/i.test(config.brandColor))throw new Error('Invalid banner configuration');
    var safe={region:'auto',language:config.language,privacyPolicyUrl:config.privacyPolicyUrl,brandColor:config.brandColor,ukFirstPartyAnalyticsExempt:false};
    if(config.textOverrides)safe.textOverrides=config.textOverrides;
    var serialized=JSON.stringify(safe,null,2).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
    return '(function(){"use strict";if(window.__wctInstalled)return;CookieConsent.init(Object.assign('+serialized+', {onChange:function(consent){window.dispatchEvent(new CustomEvent("compliance:consent",{detail:consent}));}}));var button=document.getElementById("wct-preferences");if(!button){button=document.createElement("button");button.id="wct-preferences";button.type="button";button.className="wct-preferences";document.body.appendChild(button);}button.textContent='+JSON.stringify(labels[config.language])+';button.setAttribute("aria-label",button.textContent);button.addEventListener("click",function(){CookieConsent.show();});window.__wctInstalled=true;})();\n';
  }
  function snippet(){return '<link rel="stylesheet" href="/web-compliance/cookie-consent.css">\n<link rel="stylesheet" href="/web-compliance/theme.css">\n<script defer src="/web-compliance/cookie-consent.js"></script>\n<script defer src="/web-compliance/install.js"></script>';}
  function preview(language){
    if(!Object.hasOwn(labels,language))throw new Error('Invalid language');
    return '<!doctype html><html lang="'+language+'" dir="'+(['he','ar'].includes(language)?'rtl':'ltr')+'"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>Cookie banner preview</title><link rel="stylesheet" href="cookie-consent.css"><link rel="stylesheet" href="theme.css"><body><h1>Cookie banner preview</h1><p>Local preview only. No trackers are loaded. The privacy link opens your configured policy.</p><script src="cookie-consent.js"></script><script src="install.js"></script></body></html>';
  }
  // An external, framework-independent entry point. It can be loaded by a root
  // layout after hydration without racing install.js against the widget script.
  function bootstrapRuntime() {
    'use strict';
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (window.__wctMountPromise) return;
    var current = document.currentScript;
    if (!current || !current.src) return;
    var base = new URL('.', current.src);
    function asset(name, style) {
      return new Promise(function (resolve, reject) {
        var id = 'wct-asset-' + name.replace(/\./g, '-'), url = new URL(name, base).href;
        var element = document.getElementById(id), fresh = !element;
        if (!fresh && (style ? element.href : element.src) !== url) {
          reject(new Error('Conflicting banner asset: ' + name)); return;
        }
        if (element && element.dataset.wctLoaded === 'true') { resolve(); return; }
        if (fresh) {
          element = document.createElement(style ? 'link' : 'script'); element.id = id;
          if (style) { element.rel = 'stylesheet'; element.href = url; }
          else { element.src = url; element.async = false; }
        }
        function cleanup() { clearTimeout(timer); element.removeEventListener('load', loaded); element.removeEventListener('error', failed); }
        function loaded() { element.dataset.wctLoaded = 'true'; cleanup(); resolve(); }
        function failed() { cleanup(); element.remove(); reject(new Error('Could not load banner asset: ' + name)); }
        var timer = setTimeout(failed, 15000);
        element.addEventListener('load', loaded, {once:true}); element.addEventListener('error', failed, {once:true});
        if (fresh) document.head.appendChild(element);
      });
    }
    var ready = document.readyState === 'loading' ? new Promise(function (resolve) {
      document.addEventListener('DOMContentLoaded', resolve, {once:true});
    }) : Promise.resolve();
    window.__wctMountPromise = ready.then(function () {
      if (window.__wctInstalled && document.getElementById('wct-preferences')) return true;
      return asset('cookie-consent.css', true).then(function () { return asset('theme.css', true); })
        .then(function () { return asset('cookie-consent.js', false); })
        .then(function () { return asset('install.js', false); })
        .then(function () {
          if (!window.__wctInstalled || !document.getElementById('wct-preferences')) throw new Error('Banner initialization was not verified');
          window.dispatchEvent(new CustomEvent('compliance:installation-ready'));
          return true;
        });
    }).catch(function (error) {
      // A successful HTTP response can still throw while evaluating. Reload
      // both scripts on the next explicit attempt, including partial init.
      if (window.CookieConsent && typeof window.CookieConsent._destroy === 'function') {
        try { window.CookieConsent._destroy(); } catch (ignore) {}
      }
      var preferences = document.getElementById('wct-preferences');
      if (preferences) preferences.remove();
      ['cookie-consent.js', 'install.js'].forEach(function (name) {
        var element = document.getElementById('wct-asset-' + name.replace(/\./g, '-'));
        if (element && element.src === new URL(name, base).href) element.remove();
      });
      delete window.CookieConsent;
      delete window.__wctInstalled;
      delete window.__wctMountPromise;
      window.dispatchEvent(new CustomEvent('compliance:installation-error', {detail:{message:error.message}}));
      return false;
    });
  }
  function bootstrap() { return '(' + bootstrapRuntime.toString() + ')();\n'; }
  return {script:script,snippet:snippet,preview:preview,validPolicy:policy,bootstrap:bootstrap};
});
