/* The hero runs the shipped widget. Human interaction always wins over the tour. */
(function(){
  'use strict';
  var $=function(id){return document.getElementById(id);},ui=ToolkitUI,pick=ui.pick,api=ToolkitPreview;
  var root=$('motion-scene'),machine=$('hero-machine'),toggle=$('hero-tour-toggle'),reduced=matchMedia('(prefers-reduced-motion: reduce)'),params=new URLSearchParams(location.search);
  var reducedOverride=false;
  var manuallyPaused=reduced.matches||params.has('theme')||params.has('language'),visible=true,timer=null,index=0,choice=null;
  var worlds={commerce:{theme:'espresso',scene:'commerce'},architecture:{theme:'forest',scene:'architecture'},studio:{theme:'cobalt',scene:'studio'}};
  var tour=[{theme:'espresso',language:'en',scene:'commerce'},{theme:'forest',language:'he',scene:'architecture'},{theme:'cobalt',language:'ar',scene:'studio'},{theme:'midnight',language:'ru',scene:'commerce'}];
  function isPaused(){return manuallyPaused||(reduced.matches&&!reducedOverride);}
  function controls(){var paused=isPaused();toggle.setAttribute('aria-pressed',String(paused));$('hero-tour-text').textContent=pick(paused?'Play tour':'Pause tour',paused?'הפעלת הסיור':'עצירת הסיור');$('hero-tour-icon').textContent=paused?'▷':'Ⅱ';root.classList.toggle('tour-paused',paused||!visible||document.hidden);}
  function schedule(){clearInterval(timer);controls();if(!isPaused()&&visible&&!document.hidden)timer=setInterval(function(){index=(index+1)%tour.length;api.choose(tour[index],'tour');},5800);}
  function pause(){manuallyPaused=true;schedule();}
  function status(){var el=$('hero-choice-status');el.removeAttribute('data-he');el.removeAttribute('data-en');el.textContent=choice?pick('Your choice: analytics '+(choice.analytics?'on':'off')+' · marketing '+(choice.marketing?'on':'off')+'. No trackers load here.','הבחירה שלכם: מדידה '+(choice.analytics?'פעילה':'כבויה')+' · פרסום '+(choice.marketing?'פעיל':'כבוי')+'. כאן לא נטענים כלי מעקב.'):pick('Try the banner buttons. Your interaction pauses the tour.','נסו את כפתורי הבאנר. כל בחירה שלכם עוצרת את הסיור.');}
  function paint(state){machine.dataset.theme=state.theme;root.dataset.world=state.scene;document.querySelectorAll('[data-hero-world]').forEach(function(button){button.setAttribute('aria-pressed',String(button.dataset.heroWorld===state.scene));});document.querySelectorAll('[data-hero-language]').forEach(function(button){button.setAttribute('aria-pressed',String(button.dataset.heroLanguage===state.language));});$('hero-scene-address').textContent=({commerce:'your-brand.example',architecture:'your-portfolio.example',studio:'your-studio.example'})[state.scene]||'your-website.example';}
  document.querySelectorAll('[data-hero-world]').forEach(function(button){button.addEventListener('click',function(){api.choose(worlds[button.dataset.heroWorld],'user');});});
  document.querySelectorAll('[data-hero-language]').forEach(function(button){button.addEventListener('click',function(){api.choose({language:button.dataset.heroLanguage},'user');});});
  toggle.addEventListener('click',function(){if(isPaused()){manuallyPaused=false;reducedOverride=true;}else manuallyPaused=true;schedule();});$('hero-reopen').addEventListener('click',function(){pause();api.reopen();});
  window.addEventListener('toolkit:preview',function(event){paint(event.detail);if(event.detail.source==='user')pause();});
  window.addEventListener('toolkit:preview-interaction',function(event){if(event.detail.frame==='hero-preview')pause();});
  window.addEventListener('toolkit:choice',function(event){choice=event.detail;status();});
  window.addEventListener('toolkit:language',function(){controls();status();});document.addEventListener('visibilitychange',schedule);reduced.addEventListener('change',function(){reducedOverride=false;schedule();});
  if('IntersectionObserver' in window)new IntersectionObserver(function(entries){visible=entries[0].isIntersecting;schedule();},{threshold:0}).observe(root);
  // Pointer depth only uses the outer stage; banner buttons stay native and stable.
  var pointerFine=matchMedia('(hover: hover) and (pointer: fine)'),pending=0;
  root.addEventListener('pointermove',function(event){if(reduced.matches||!pointerFine.matches||innerWidth<1100)return;var rect=root.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width-.5,y=(event.clientY-rect.top)/rect.height-.5;if(pending)cancelAnimationFrame(pending);pending=requestAnimationFrame(function(){root.style.setProperty('--tilt-x',(-y*2.5).toFixed(2)+'deg');root.style.setProperty('--tilt-y',(x*3).toFixed(2)+'deg');pending=0;});},{passive:true});
  root.addEventListener('pointerleave',function(){root.style.setProperty('--tilt-x','0deg');root.style.setProperty('--tilt-y','0deg');});
  paint(api.state());status();schedule();
})();
/* Scroll chapters follow native scrolling. On phones they become direct controls. */
(function(){
  'use strict';
  var section=document.getElementById('product-story'),visual=document.getElementById('story-visual'),steps=Array.from(document.querySelectorAll('[data-story-step]')),buttons=Array.from(document.querySelectorAll('[data-story-chapter]')),layers=Array.from(visual.querySelectorAll('.story-layer')),small=matchMedia('(max-width: 600px)'),reduced=matchMedia('(prefers-reduced-motion: reduce)'),active=0,pending=0;
  function select(index){active=index;visual.dataset.chapter=String(index);buttons.forEach(function(button,i){button.setAttribute('aria-pressed',String(i===index));});steps.forEach(function(step,i){step.classList.toggle('is-active',i===index);});}
  function clearLayers(){layers.forEach(function(layer){layer.style.removeProperty('opacity');layer.style.removeProperty('transform');layer.style.removeProperty('visibility');});}
  function update(){pending=0;if(small.matches){clearLayers();return;}var rect=section.getBoundingClientRect();if(rect.top>innerHeight||rect.bottom<0)return;var first=steps[0].getBoundingClientRect(),last=steps[2].getBoundingClientRect(),length=last.top-first.top,pos=Math.max(0,Math.min(2,((innerHeight*.47-first.top-first.height*.32)/Math.max(length,1))*2));select(Math.round(pos));if(reduced.matches){clearLayers();return;}layers.forEach(function(layer,i){var difference=pos-i,distance=Math.abs(difference);layer.style.visibility=distance<1.02?'visible':'hidden';layer.style.opacity=String(Math.max(0,1-distance));layer.style.transform='translate3d(0,'+(difference*-46).toFixed(2)+'px,'+(-distance*90).toFixed(2)+'px) rotateY('+(difference*11).toFixed(2)+'deg)';});}
  function requestUpdate(){if(!pending)pending=requestAnimationFrame(update);}
  buttons.forEach(function(button,index){button.addEventListener('click',function(){select(index);if(small.matches){clearLayers();return;}steps[index].scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'center'});requestUpdate();});});
  window.addEventListener('scroll',requestUpdate,{passive:true});window.addEventListener('resize',requestUpdate);small.addEventListener('change',function(){clearLayers();select(active);requestUpdate();});reduced.addEventListener('change',requestUpdate);
  var text=document.querySelector('#document-examples [data-document-key="privacy"] pre');if(text)document.getElementById('story-document-excerpt').textContent=text.textContent.split(/\n\n+/).slice(2,5).join('\n\n').slice(0,600);
  select(0);requestUpdate();
})();
