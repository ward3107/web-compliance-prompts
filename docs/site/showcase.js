(function () {
  'use strict';
  // Shortcuts operate the same shipped studio controls; no separate demo data.
  var themeSelect=document.getElementById('quick-theme');
  var shortcuts=Array.from(document.querySelectorAll('[data-show-theme]'));
  function syncTheme(){shortcuts.forEach(function(button){button.setAttribute('aria-pressed',String(button.dataset.showTheme===themeSelect.value));});}
  function revealStudio(){
    var heading=document.getElementById('banner-title');
    if(!heading)return;
    heading.tabIndex=-1;heading.focus({preventScroll:true});
    heading.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  }
  shortcuts.forEach(function(button){button.addEventListener('click',function(){
    if(!themeSelect||!window.ToolkitThemes||!ToolkitThemes.presets[button.dataset.showTheme])return;
    themeSelect.value=button.dataset.showTheme;
    themeSelect.dispatchEvent(new Event('change',{bubbles:true}));
    syncTheme();revealStudio();
  });});
  if(themeSelect){themeSelect.addEventListener('change',syncTheme);syncTheme();}
  var gallery=document.getElementById('explore-themes');
  if(gallery)gallery.addEventListener('click',syncTheme);
  document.addEventListener('click',function(event){
    var link=event.target.closest('[data-open-document]');if(!link)return;
    var key=link.dataset.openDocument,container=document.getElementById('document-examples');
    if(!container||!window.ToolkitDocuments)return;
    var title=ToolkitDocuments.titles[key];
    var target=Array.from(container.querySelectorAll('details')).find(function(item){return item.querySelector('summary').textContent.startsWith(title);});
    if(!target)return;event.preventDefault();target.open=true;
    target.querySelector('summary').focus({preventScroll:true});
    target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  });
})();
