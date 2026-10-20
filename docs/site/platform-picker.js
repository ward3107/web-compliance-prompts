(function () {
  'use strict';
  var catalog = window.ToolkitPlatforms, ui = window.ToolkitUI;
  var $ = function (id) { return document.getElementById(id); };
  var value = new URLSearchParams(location.search).get('platform');
  var selected = catalog.get(value) ? value : 'unknown';
  function render() {
    var route = catalog.get(selected), copy = catalog.text(selected, ui.language);
    $('platform-grid').replaceChildren();
    catalog.list().forEach(function (item) {
      var button = document.createElement('button'), icon = document.createElement('span');
      var title = document.createElement('strong'), description = document.createElement('small'), words = document.createElement('span');
      var detail = catalog.text(item.id, ui.language);
      button.type = 'button'; button.className = 'platform-choice'; button.dataset.platform = item.id;
      button.setAttribute('aria-pressed', String(item.id === selected));
      icon.className = 'platform-icon'; icon.setAttribute('aria-hidden','true'); icon.textContent = item.icon;
      title.textContent = detail.name; description.textContent = detail.availability;
      words.append(title, description); button.append(icon, words); $('platform-grid').append(button);
    });
    $('platform-detail').dataset.mode = route.mode;
    $('platform-status').textContent = copy.availability; $('platform-title').textContent = copy.name; $('platform-note').textContent = copy.note;
    $('platform-steps').replaceChildren();
    copy.steps.forEach(function (step) { var item = document.createElement('li'); item.textContent = step; $('platform-steps').append(item); });
    var code = catalog.snippet(selected); $('platform-code-block').hidden = !code; $('platform-code').textContent = code;
    $('platform-prepare').href = 'start.html?ui='+ui.language+'&platform='+selected;
    $('platform-sources').replaceChildren();
    route.docs.forEach(function (doc) { var item = document.createElement('li'), link = document.createElement('a'); link.href = doc[1]; link.rel='noreferrer'; link.textContent = doc[0]; item.append(link); $('platform-sources').append(item); });
    if (!route.docs.length) { var item = document.createElement('li'); item.textContent = ui.pick('Follow your developer’s deployment and consent requirements.','פעלו לפי דרישות הפריסה וההסכמה של המערכת שלכם.'); $('platform-sources').append(item); }
  }
  $('platform-grid').addEventListener('click', function (event) {
    var button = event.target.closest('[data-platform]'); if (!button || !catalog.get(button.dataset.platform)) return;
    selected = button.dataset.platform; render();
    var url = new URL(location.href); url.searchParams.set('platform', selected);
    try { history.replaceState(null, '', url.href); } catch (ignore) {}
    document.querySelector('[data-platform="'+selected+'"]').focus({preventScroll:true});
    $('platform-feedback').textContent = ui.pick('Selected: ','נבחרה מערכת: ')+catalog.text(selected, ui.language).name;
    if (innerWidth <= 900) { $('platform-title').focus({preventScroll:true}); $('platform-detail').scrollIntoView({block:'start'}); }
  });
  $('platform-change').addEventListener('click', function () {
    document.querySelector('[data-platform="'+selected+'"]').focus({preventScroll:true});
    $('platform-grid').scrollIntoView({block:'start'});
  });
  $('platform-guide').addEventListener('click', function () {
    var url = URL.createObjectURL(new Blob([catalog.guide(selected, ui.language)],{type:'text/html;charset=utf-8'}));
    var link = document.createElement('a'); link.href=url; link.download='web-compliance-'+selected+'-guide.html'; document.body.append(link); link.click(); link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 30000);
    $('platform-feedback').textContent = ui.pick('Guide prepared. Installation on your site still needs verification.','המדריך הוכן. ההתקנה באתר שלכם עדיין דורשת אימות.');
  });
  window.addEventListener('toolkit:language', function () { render(); $('platform-feedback').textContent=''; });
  render();
})();
