/* Hosted checkout only. No payment details, API keys, pixels or receipt verification here. */
(function(root){
  'use strict';
  var gates=['store_approved','seller_terms_confirmed','checkout_tested','live_delivery_verified'];
  function checkoutState(offer){
    if(!offer||offer.status!=='live'||offer.billing!=='one_time_download'||offer.currency!=='USD'||offer.price_usd!==19)return {ready:false};
    if(!gates.every(function(key){return offer.readiness&&offer.readiness[key]===true;}))return {ready:false};
    if(typeof offer.support_email!=='string'||!/^\S+@\S+\.\S+$/.test(offer.support_email))return {ready:false};
    try{
      var url=new URL(offer.checkout_url);
      if(url.protocol!=='https:'||url.username||url.password||url.port||url.search||url.hash)return {ready:false};
      if(!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.lemonsqueezy\.com$/.test(url.hostname)||!/^\/buy\/[a-zA-Z0-9-]+\/?$/.test(url.pathname))return {ready:false};
      return {ready:true,url:url.href,support_email:offer.support_email};
    }catch(ignore){return {ready:false};}
  }
  if(typeof module==='object'&&module.exports)module.exports={checkoutState:checkoutState};
  if(!root||!root.document)return;
  var doc=root.document;
  function mount(){
    var state=checkoutState(root.WebComplianceCheckout);
    if(state.ready){
      doc.querySelectorAll('[data-purchase-link]').forEach(function(link){link.href=state.url;link.hidden=false;});
      doc.querySelectorAll('[data-purchase-pending]').forEach(function(el){el.hidden=true;});
      doc.querySelectorAll('[data-order-support]').forEach(function(link){link.href='mailto:'+state.support_email;link.hidden=false;});
    }
    var toggle=doc.getElementById('pricing-motion-toggle');
    if(toggle){
      var reduced=root.matchMedia('(prefers-reduced-motion: reduce)'),paused=reduced.matches;
      function sync(){doc.body.classList.toggle('pricing-motion-paused',paused||doc.hidden);toggle.setAttribute('aria-pressed',String(paused));var text=toggle.querySelector('span');text.dataset.en=paused?'Play motion':'Pause motion';text.dataset.he=paused?'הפעלת תנועה':'עצירת תנועה';text.textContent=root.ToolkitUI?root.ToolkitUI.pick(text.dataset.en,text.dataset.he):text.dataset.en;}
      toggle.addEventListener('click',function(){paused=!paused;sync();});
      reduced.addEventListener('change',function(){paused=reduced.matches;sync();});
      doc.addEventListener('visibilitychange',sync);sync();
    }
  }
  if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',mount);else mount();
})(typeof window==='undefined'?null:window);
