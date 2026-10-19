/* Visual reactions call the existing product; no simulated AI or remote runtime. */
(function(){
  'use strict';
  var body=document.body,ui=window.ToolkitUI;
  var kit=document.getElementById('kit-flow'),hero=document.getElementById('motion-scene');
  var stage=kit||hero,motionButton=document.getElementById(kit?'kit-motion-toggle':'hero-tour-toggle');
  var reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
  var replayTimer=0,pointerFrame=0,scrollFrame=0,visible=true;
  if(!stage||!motionButton||!ui)return;

  function skin(theme){
    body.dataset.vividSkin=['espresso','coral','plum','sunset'].includes(theme)?'warm':['forest','olive','mint'].includes(theme)?'mint':'electric';
    body.dataset.vividTheme=theme;
  }
  function currentTheme(){
    if(kit){var button=kit.querySelector('[data-kit-theme][aria-pressed=true]');return button?button.dataset.kitTheme:'cobalt';}
    return ToolkitPreview.state().theme;
  }
  function motion(){
    var stopped=motionButton.getAttribute('aria-pressed')==='true'||reduced.matches;
    body.classList.toggle('vivid-motion-paused',stopped);
    body.classList.toggle('vivid-page-hidden',document.hidden);
    if(stopped||document.hidden||!visible){
      if(pointerFrame)cancelAnimationFrame(pointerFrame);
      pointerFrame=0;stage.style.setProperty('--v-tilt-x','0deg');stage.style.setProperty('--v-tilt-y','0deg');
    }
  }
  new MutationObserver(motion).observe(motionButton,{attributes:true,attributeFilter:['aria-pressed']});
  reduced.addEventListener('change',motion);document.addEventListener('visibilitychange',motion);

  function replay(){
    if(reduced.matches)return;
    var surface=kit?kit.querySelector('.kit-browser'):document.getElementById('hero-machine');
    clearTimeout(replayTimer);surface.classList.remove('vivid-replay');void surface.offsetWidth;
    surface.classList.add('vivid-replay');
    replayTimer=setTimeout(function(){surface.classList.remove('vivid-replay');},550);
  }
  document.querySelectorAll('[data-vivid-remix]').forEach(function(button){
    button.addEventListener('click',function(){
      if(kit){
        var choices=Array.from(kit.querySelectorAll('[data-kit-theme]'));
        var index=choices.findIndex(function(item){return item.getAttribute('aria-pressed')==='true';});
        choices[(index+1)%choices.length].click();
      }else{
        var choices=['cobalt','coral','lavender','forest','espresso'];
        var index=choices.indexOf(ToolkitPreview.state().theme);
        ToolkitPreview.choose({theme:choices[(index+1)%choices.length]},'user');
      }
    });
  });
  if(kit){
    kit.querySelectorAll('[data-kit-theme]').forEach(function(button){button.addEventListener('click',function(){skin(currentTheme());replay();});});
    new MutationObserver(function(){body.dataset.vividStep=kit.dataset.step;}).observe(kit,{attributes:true,attributeFilter:['data-step']});
    stage.addEventListener('pointermove',function(event){
      if(!fine.matches||reduced.matches||body.classList.contains('vivid-motion-paused')||innerWidth<1101||!visible)return;
      var box=stage.getBoundingClientRect(),x=(event.clientX-box.left)/box.width-.5,y=(event.clientY-box.top)/box.height-.5;
      if(pointerFrame)cancelAnimationFrame(pointerFrame);
      pointerFrame=requestAnimationFrame(function(){
        stage.style.setProperty('--v-tilt-x',(-y*3.5).toFixed(2)+'deg');
        stage.style.setProperty('--v-tilt-y',(x*4.5).toFixed(2)+'deg');pointerFrame=0;
      });
    },{passive:true});
    stage.addEventListener('pointerleave',function(){
      if(pointerFrame)cancelAnimationFrame(pointerFrame);pointerFrame=0;
      stage.style.setProperty('--v-tilt-x','0deg');stage.style.setProperty('--v-tilt-y','0deg');
    });
  }else window.addEventListener('toolkit:preview',function(event){skin(event.detail.theme);if(event.detail.source==='user'||event.detail.source==='tour')replay();});

  // Offscreen decorations stop independently; content never starts transparent.
  if('IntersectionObserver' in window){
    var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){
      entry.target.classList.toggle('vivid-out-of-view',!entry.isIntersecting);
      if(entry.target===stage){visible=entry.isIntersecting;motion();}
    });},{rootMargin:'40px'});
    [stage].concat(Array.from(document.querySelectorAll('.vivid-ribbon,.closing-asterisk'))).forEach(function(el){observer.observe(el);});
  }
  function progress(){scrollFrame=0;var length=document.documentElement.scrollHeight-innerHeight;body.style.setProperty('--v-progress',String(length>0?Math.min(1,Math.max(0,scrollY/length)):0));}
  function scheduleProgress(){if(!scrollFrame)scrollFrame=requestAnimationFrame(progress);}
  addEventListener('scroll',scheduleProgress,{passive:true});addEventListener('resize',scheduleProgress);
  addEventListener('pagehide',function(){clearTimeout(replayTimer);if(pointerFrame)cancelAnimationFrame(pointerFrame);if(scrollFrame)cancelAnimationFrame(scrollFrame);});
  skin(currentTheme());motion();progress();body.dataset.vividStep=kit?kit.dataset.step:'banner';
})();
