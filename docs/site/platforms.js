/* Shared platform routes. These describe delivery, never certify a customer's site. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ToolkitPlatforms = factory();
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  var checked = '2026-10-20';
  var routes = [
    {id:'unknown', name:'Not sure yet', he:'עדיין לא בטוחים', icon:'🧭', group:'other', mode:'identify',
      en:['Ask the site owner or developer which platform and hosting plan the site uses.', 'Identify who can edit site-wide code, publish changes and connect tracking tools.'],
      heSteps:['בררו עם בעל האתר או המפתח באיזו מערכת ובאיזו חבילת אחסון האתר משתמש.', 'בררו למי יש הרשאה לערוך קוד בכל האתר, לפרסם ולחבר כלי מעקב.'], docs:[]},
    {id:'wordpress', name:'WordPress / WooCommerce', icon:'🔌', group:'wordpress', mode:'plugin',
      en:['Back up the site and use a staging copy. Upload the plugin ZIP through Plugins → Add New → Upload Plugin.', 'Activate it and open Settings → Web Compliance. Check for an existing consent plugin before enabling a second banner.', 'Connect the actual analytics, advertising and embeds to consent, then complete the destination-site checks.'],
      heSteps:['גבו את האתר והשתמשו באתר בדיקה. העלו את ZIP התוסף דרך תוספים ← תוסף חדש ← העלאת תוסף.', 'הפעילו ופתחו הגדרות ← Web Compliance. בדקו אם כבר מותקן פתרון הסכמה לפני הפעלת באנר נוסף.', 'חברו את כלי המדידה, הפרסום והתוכן המוטמע להסכמה ובצעו את הבדיקות באתר.'],
      docs:[['WordPress: upload a plugin','https://wordpress.org/documentation/article/manage-plugins/']]},
    {id:'html', name:'HTML / PHP / custom website', he:'HTML / PHP / אתר מותאם', icon:'🌐', group:'code', mode:'files',
      en:['Upload only the four runtime files to /web-compliance/ on the website.', 'Add embed.html.txt once to the shared HTML layout. Adjust every asset path when deploying under a subdirectory.', 'Keep tracking disabled until its consent integration allows it. Test a full reload and every relevant page.'],
      heSteps:['העלו רק את ארבעת קובצי הריצה לתיקיית /web-compliance/ באתר.', 'הוסיפו את embed.html.txt פעם אחת למעטפת ה־HTML המשותפת. בהתאמה לתת־תיקייה עדכנו את כל הנתיבים.', 'השאירו מעקב כבוי עד שהחיבור להסכמה מאפשר אותו. בדקו טעינה מלאה ואת העמודים הרלוונטיים.'], docs:[]},
    {id:'react', name:'React / Vite', icon:'⚛', group:'code', mode:'framework', directory:'public/web-compliance/',
      en:['Copy the five runtime files into public/web-compliance/ in a Vite-style project. Check the static asset convention for other React build tools.', 'Load mount-banner.js once from the root HTML document, outside route components. It loads the styles and then the two scripts in order.', 'Keep the banner outside the route outlet. Test remounts, client navigation and the production build.'],
      heSteps:['העתיקו את חמשת קובצי הריצה אל public/web-compliance/ בפרויקט מבוסס Vite. בכלי בנייה אחרים בדקו את מוסכמת הקבצים הסטטיים.', 'טענו את mount-banner.js פעם אחת ממסמך ה־HTML הראשי, מחוץ לרכיבי הניווט. הוא טוען עיצוב ואז את שני הסקריפטים לפי הסדר.', 'השאירו את הבאנר מחוץ לאזור שמוחלף בניווט. בדקו התקנה חוזרת של רכיב, ניווט לקוח ובניית production.'],
      docs:[['Vite: public assets','https://vite.dev/guide/assets.html']]},
    {id:'nextjs', name:'Next.js', icon:'▲', group:'code', mode:'framework', directory:'public/web-compliance/',
      en:['Copy the five runtime files into public/web-compliance/. Keep the project JSON and review documents private.', 'In the App Router root layout, import Script from next/script and include the single loader shown below. Adapt the shared application wrapper for Pages Router.', 'The loader needs a browser and does not run during server rendering. Test hydration, client navigation, basePath and your Content Security Policy.'],
      heSteps:['העתיקו את חמשת קובצי הריצה אל public/web-compliance/. שמרו את JSON הפרויקט ומסמכי הבדיקה באופן פרטי.', 'ב־App Router, ייבאו Script מתוך next/script במעטפת הראשית והוסיפו את הטוען היחיד שמופיע בהמשך. ב־Pages Router התאימו את מעטפת היישום המשותפת.', 'הטוען פועל בדפדפן. בדקו hydration, ניווט לקוח, basePath ומדיניות אבטחת התוכן של האתר.'],
      docs:[['Next.js: scripts','https://nextjs.org/docs/app/guides/scripts'],['Next.js: public folder','https://nextjs.org/docs/app/api-reference/file-conventions/public-folder']]},
    {id:'vue', name:'Vue / Vite', icon:'💚', group:'code', mode:'framework', directory:'public/web-compliance/',
      en:['Copy the five runtime files into public/web-compliance/ for a Vite-based Vue project.', 'Add the loader once to the root index.html, outside the router view.', 'Check built asset URLs, route changes and any code that replaces the whole document body.'],
      heSteps:['העתיקו את חמשת קובצי הריצה אל public/web-compliance/ בפרויקט Vue מבוסס Vite.', 'הוסיפו את הטוען פעם אחת ל־index.html הראשי, מחוץ לתצוגת הנתב.', 'בדקו נתיבי קבצים אחרי בנייה, שינויי מסלול וקוד שמחליף את כל גוף המסמך.'],
      docs:[['Vite: public assets','https://vite.dev/guide/assets.html']]},
    {id:'nuxt', name:'Nuxt', icon:'⛰', group:'code', mode:'framework', directory:'public/web-compliance/',
      en:['Copy the five runtime files into the project public/web-compliance/ directory.', 'Register the single loader in the root app head with useHead, rather than on each page.', 'Check the public asset configuration for your Nuxt version, SSR hydration and client route changes.'],
      heSteps:['העתיקו את חמשת קובצי הריצה לתיקיית public/web-compliance/ של הפרויקט.', 'רשמו את הטוען היחיד ב־head של היישום הראשי באמצעות useHead, במקום בכל עמוד.', 'בדקו את הגדרת הקבצים הציבוריים לגרסת Nuxt שלכם, hydration וניווט לקוח.'],
      docs:[['Nuxt: public directory','https://nuxt.com/docs/4.x/directory-structure/public']]},
    {id:'svelte', name:'SvelteKit', icon:'🔥', group:'code', mode:'framework', directory:'static/web-compliance/',
      en:['Copy the five runtime files into static/web-compliance/.', 'Add the loader once to src/app.html. Use the configured assets/base path when the app is not hosted at the domain root.', 'Test server rendering, client navigation and persistent cookie preferences on the production build.'],
      heSteps:['העתיקו את חמשת קובצי הריצה אל static/web-compliance/.', 'הוסיפו את הטוען פעם אחת ל־src/app.html. התאימו את נתיב assets/base כשהיישום אינו בשורש הדומיין.', 'בדקו רינדור שרת, ניווט לקוח וכפתור העדפות זמין בבניית production.'],
      docs:[['SvelteKit: project structure','https://svelte.dev/docs/kit/project-structure']]},
    {id:'angular', name:'Angular', icon:'🅰', group:'code', mode:'framework', directory:'public/web-compliance/',
      en:['Copy the five runtime files into the public assets directory configured by angular.json; confirm their deployed URL.', 'Load mount-banner.js once from the application index.html, outside router-outlet.', 'Test production asset copying, SSR hydration if enabled, route changes and your Content Security Policy.'],
      heSteps:['העתיקו את חמשת קובצי הריצה לתיקיית הקבצים הציבוריים שמוגדרת ב־angular.json ובדקו את כתובתם לאחר פריסה.', 'טענו את mount-banner.js פעם אחת מ־index.html של היישום, מחוץ ל־router-outlet.', 'בדקו העתקת קבצים לבניית production, hydration אם מופעל SSR, שינויי מסלול ומדיניות אבטחת תוכן.'],
      docs:[['Angular: workspace assets','https://angular.dev/reference/configs/workspace-config']]},
    {id:'astro', name:'Astro', icon:'🚀', group:'code', mode:'framework', directory:'public/web-compliance/',
      en:['Copy the five runtime files into public/web-compliance/.', 'Add the unbundled loader to the shared layout using is:inline and defer.', 'With ClientRouter or view transitions, test whether body replacement removes the banner or preferences button. A transition-specific lifecycle adapter is not included.'],
      heSteps:['העתיקו את חמשת קובצי הריצה אל public/web-compliance/.', 'הוסיפו את הטוען ללא bundling למעטפת המשותפת באמצעות is:inline ו־defer.', 'עם ClientRouter או מעברי תצוגה בדקו אם החלפת גוף העמוד מסירה את הבאנר או כפתור ההעדפות. מתאם ייעודי למעברים אינו כלול.'],
      docs:[['Astro: project structure','https://docs.astro.build/en/basics/project-structure/']]},
    {id:'wix', name:'Wix / Wix Studio', icon:'✦', group:'builder', mode:'conditional',
      en:['Confirm that the site and plan allow site-wide custom code and that you can publish changes.', 'Review Wix Privacy Center and the existing consent banner. Connect Wix consent categories before expecting this banner to control Wix-managed code.', 'A developer must host the runtime assets and implement and test the consent bridge. No Wix connector or consent synchronization is included.'],
      heSteps:['ודאו שהאתר והמסלול מאפשרים קוד מותאם בכל האתר ושיש הרשאת פרסום.', 'בדקו את מרכז הפרטיות ואת הבאנר הקיים של Wix. יש לחבר את קטגוריות ההסכמה לפני שמצפים לשליטה בקוד שמנוהל ב־Wix.', 'מפתח צריך לאחסן את קובצי הריצה ולממש ולבדוק גשר הסכמה. חיבור Wix וסנכרון הסכמה אינם כלולים.'],
      docs:[['Wix: custom code','https://support.wix.com/en/article/adding-a-custom-tracking-code-to-your-site'],['Wix: consent categories','https://support.wix.com/en/article/categorizing-your-custom-code']]},
    {id:'shopify', name:'Shopify', icon:'🛍', group:'builder', mode:'conditional',
      en:['Review the store customer privacy settings, existing banner and app/custom pixels.', 'A storefront banner must synchronize choices with the Shopify Customer Privacy API. Theme scripts alone do not control all Shopify-managed surfaces or checkout.', 'Keep the existing consent solution until a developer implements and tests an adapter. This package includes a planning guide, not a Shopify app or a consent API bridge.'],
      heSteps:['בדקו את הגדרות פרטיות הלקוחות בחנות, הבאנר הקיים ופיקסלים מותקנים.', 'באנר בחנות צריך לסנכרן בחירות עם Shopify Customer Privacy API. סקריפט בתבנית אינו שולט לבדו בכל רכיבי Shopify או ב־Checkout.', 'השאירו את פתרון ההסכמה הקיים עד למימוש ובדיקת מתאם. החבילה כוללת מדריך תכנון, ללא אפליקציית Shopify או גשר ל־API ההסכמה.'],
      docs:[['Shopify: Customer Privacy API','https://shopify.dev/docs/api/customer-privacy'],['Shopify: privacy settings','https://help.shopify.com/en/manual/privacy-and-security/privacy/customer-privacy-settings/privacy-settings']]},
    {id:'webflow', name:'Webflow', icon:'〰', group:'builder', mode:'conditional',
      en:['Confirm that the workspace/site plan and your role permit site-wide custom code.', 'Arrange public hosting for the runtime assets and adapt their URLs. Add code to the shared head/footer, then publish to a staging domain.', 'Test the published site, existing integrations and tracking after rejection. The Designer preview does not establish production behavior. No native Webflow connector is included.'],
      heSteps:['ודאו שמסלול סביבת העבודה או האתר והתפקיד שלכם מאפשרים קוד מותאם בכל האתר.', 'דאגו לאחסון ציבורי לקובצי הריצה והתאימו כתובות. הוסיפו קוד ל־head/footer המשותף ופרסמו בדומיין בדיקה.', 'בדקו את האתר שפורסם, החיבורים הקיימים והמעקב אחרי דחייה. תצוגת המעצב אינה מוכיחה התנהגות production. חיבור Webflow ייעודי אינו כלול.'],
      docs:[['Webflow: site-wide custom code','https://help.webflow.com/hc/en-us/articles/33961357265299-Custom-code-in-head-and-body-tags']]},
    {id:'squarespace', name:'Squarespace', icon:'◈', group:'builder', mode:'conditional',
      en:['Confirm that the current plan permits JavaScript through site-wide Code Injection.', 'Review the built-in cookie controls and arrange hosting for the runtime assets. A developer must adapt asset URLs and prevent conflicting banners.', 'Test the published site and navigation, including any AJAX transitions. No native consent connector or checkout-wide control is included.'],
      heSteps:['ודאו שהמסלול הנוכחי מאפשר JavaScript באמצעות Code Injection בכל האתר.', 'בדקו את בקרות העוגיות המובנות ודאגו לאחסון קובצי הריצה. מפתח צריך להתאים כתובות ולמנוע התנגשות בין באנרים.', 'בדקו את האתר שפורסם ואת הניווט, כולל מעברי AJAX. חיבור הסכמה ייעודי או שליטה בכל ה־Checkout אינם כלולים.'],
      docs:[['Squarespace: Code Injection','https://support.squarespace.com/hc/en-us/articles/205815908-Customize-parts-of-your-site-with-code-injection']]},
    {id:'other', name:'Other / custom platform', he:'מערכת אחרת / מותאמת', icon:'🧩', group:'other', mode:'files',
      en:['Ask the developer to identify the shared layout and a public static asset directory.', 'Use the universal files only where the platform permits first-party JavaScript and CSS. Update the paths in embed.html.txt.', 'If custom code, hosting or platform consent APIs are restricted, stop and define a platform adapter before publishing.'],
      heSteps:['בקשו מהמפתח לזהות את המעטפת המשותפת ותיקיית הקבצים הסטטיים הציבוריים.', 'השתמשו בקבצים האוניברסליים במקום שבו המערכת מאפשרת JavaScript ו־CSS מקומיים. עדכנו נתיבים ב־embed.html.txt.', 'אם קיימות מגבלות קוד, אחסון או API הסכמה, הגדירו מתאם לפלטפורמה לפני פרסום.'], docs:[]}
  ];
  var byId = Object.create(null);
  routes.forEach(function (route) { byId[route.id] = route; });
  function get(id) { return typeof id === 'string' && Object.hasOwn(byId, id) ? byId[id] : null; }
  function pick(language, en, he) { return language === 'he' ? he : en; }
  function text(id, language) {
    var route = get(id);
    if (!route) throw new Error('Unknown platform');
    var labels = {
      plugin:['Plugin ZIP available','תוסף ZIP זמין'], files:['Universal files available','קבצים אוניברסליים זמינים'],
      framework:['Browser loader + integration guide','טוען לדפדפן + מדריך שילוב'],
      conditional:['Platform adapter required','נדרש מתאם לפלטפורמה'], identify:['Identify the platform first','מזהים קודם את המערכת']
    };
    return {name:language === 'he' && route.he ? route.he : route.name,
      availability:labels[route.mode][language === 'he' ? 1 : 0],
      steps:(language === 'he' ? route.heSteps : route.en).slice(),
      note:route.mode === 'conditional' ? pick(language,'Planning guide only. No native connector or verified customer installation.','מדריך תכנון בלבד. אין חיבור ייעודי או התקנה מאומתת באתר לקוח.') :
        route.mode === 'identify' ? pick(language,'You can save a project and prepare a review packet while you identify the platform.','אפשר לשמור פרויקט ולהכין תיק לבדיקה בזמן בירור המערכת.') :
        pick(language,'Files are available. Your framework version, site, trackers and consent behavior still need verification.','הקבצים זמינים. עדיין צריך לאמת את גרסת המסגרת, האתר, כלי המעקב והתנהגות ההסכמה.')};
  }
  function snippet(id) {
    var route = get(id);
    if (!route) throw new Error('Unknown platform');
    if (route.mode !== 'framework') return '';
    if (id === 'nextjs') return "import Script from 'next/script';\n\n// Include once inside the root layout's <body>:\n<Script src=\"/web-compliance/mount-banner.js\" strategy=\"afterInteractive\" />";
    if (id === 'nuxt') return "// Register once in the root app setup:\nuseHead({ script: [{ src: '/web-compliance/mount-banner.js', defer: true }] });";
    if (id === 'astro') return '<script is:inline defer src="/web-compliance/mount-banner.js"></script>';
    if (id === 'svelte') return '<!-- src/app.html; respects the configured assets path -->\n<script defer src="%sveltekit.assets%/web-compliance/mount-banner.js"></script>';
    return '<!-- Shared root HTML document, outside the route outlet -->\n<script defer src="/web-compliance/mount-banner.js"></script>';
  }
  function manifest(id) {
    var route = get(id);
    if (!route) throw new Error('Unknown platform');
    return {format:'web-compliance-platform-route', version:1, platform:route.id, delivery:route.mode,
      documentation_checked:checked, native_connector:route.mode === 'plugin',
      customer_installation:'not_tested', framework_build:'not_tested', tracker_integration:'not_tested',
      legal_review:'pending', documentation:route.docs.map(function (doc) { return doc[1]; })};
  }
  function escape(value) { return String(value).replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function guide(id, language) {
    var route = get(id), copy = text(id, language), he = language === 'he';
    var code = snippet(id);
    return '<!doctype html><html lang="'+(he?'he':'en')+'" dir="'+(he?'rtl':'ltr')+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; base-uri \'none\'; form-action \'none\'"><title>'+escape(copy.name)+'</title><style>body{font:17px/1.8 Arial,sans-serif;color:#252447;max-width:850px;margin:30px auto;padding:20px}li{margin:12px 0}pre{white-space:pre-wrap;overflow-wrap:anywhere;direction:ltr;text-align:left;background:#f1eff9;padding:20px}a{color:#4934a7;overflow-wrap:anywhere}h1{line-height:1.3}</style></head><body><h1>'+escape(copy.name)+'</h1><p><strong>'+escape(copy.availability)+'</strong></p><p>'+escape(copy.note)+'</p><ol>'+copy.steps.map(function (step) { return '<li>'+escape(step)+'</li>'; }).join('')+'</ol>'+(code?'<pre>'+escape(code)+'</pre>':'')+'<h2>'+pick(language,'Before client handoff','לפני מסירה ללקוח')+'</h2><ul><li>'+pick(language,'Verify first visit, rejection, granular choice, reload and withdrawal using network and storage evidence.','בדקו ביקור ראשון, דחייה, בחירה פרטנית, טעינה חוזרת וביטול הסכמה באמצעות תיעוד רשת ואחסון.')+'</li><li>'+pick(language,'Test keyboard, screen reader, mobile, RTL, policy links, update, rollback and removal.','בדקו מקלדת, קורא מסך, נייד, RTL, קישורי מדיניות, עדכון, שחזור והסרה.')+'</li><li>'+pick(language,'This is a delivery guide. No production scan, automatic tracker blocking or legal approval is provided.','זהו מדריך התקנה. אין סריקת production, חסימה אוטומטית של כלי מעקב או אישור משפטי.')+'</li></ul><h2>'+pick(language,'Official references','מקורות רשמיים')+'</h2><ul>'+route.docs.map(function (doc) { return '<li><a rel="noreferrer" href="'+escape(doc[1])+'">'+escape(doc[0])+'</a></li>'; }).join('')+'</ul><p>'+pick(language,'Documentation checked: ','התיעוד נבדק בתאריך: ')+checked+'. '+pick(language,'Published site: not tested.','האתר שפורסם: טרם נבדק.')+'</p></body></html>';
  }
  return {list:function () { return routes.slice(); }, get:get, text:text, snippet:snippet, manifest:manifest, guide:guide};
});
