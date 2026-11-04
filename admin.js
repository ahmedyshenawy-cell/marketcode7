(function(){
var $app=document.getElementById('app'),C=null,cur=0,tl='ar',dirty=false,msgEl=null,PEND={},DONE={},CFG=null,SHA=null;
var LB={menu:'القائمة العلوية',cta:'زرار القائمة',hero:'الواجهة الرئيسية',about:'من نحن',mission:'الرسالة',vision:'الرؤية',goals:'الأهداف',why:'ليه إحنا',srv:'الخدمات',cl:'العملاء',pf:'المعرض',ct:'التواصل',foot:'نص الفوتر',eb:'عنوان صغير',t:'العنوان',p:'الوصف',c1:'زرار 1',c2:'زرار 2',k:'العنوان',v:'النص',wa:'زرار واتساب',more:'زرار المزيد',tabs:'أسماء التبويبات',video:'فيديو',photo:'تصوير',graphic:'جرافيك'};
function h(t,a){a=a||{};var e=document.createElement(t);for(var k in a){if(k==='on'){for(var ev in a.on)e.addEventListener(ev,a.on[ev])}else if(k==='class')e.className=a[k];else e.setAttribute(k,a[k])}for(var i=2;i<arguments.length;i++){var c=arguments[i];if(c==null)continue;(Array.isArray(c)?c:[c]).forEach(function(x){e.append(x)})}return e}
function store(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){}}
function say(t,ok){if(msgEl){msgEl.textContent=t;msgEl.className='msg '+(ok?'ok':'er')}}
function touch(){dirty=true;say('فيه تعديلات لسه ماتحفظتش',false)}
window.addEventListener('beforeunload',function(e){if(dirty){e.preventDefault();e.returnValue=''}});

/* ---------- GitHub API ---------- */
function gh(method,path,body){
 var o={method:method,headers:{Authorization:'Bearer '+CFG.token,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'}};
 if(body){o.headers['Content-Type']='application/json';o.body=JSON.stringify(body)}
 return fetch('https://api.github.com/repos/'+CFG.owner+'/'+CFG.repo+path,o).then(function(r){return r.json().catch(function(){return{}}).then(function(j){
  if(!r.ok){var m=j.message||('خطأ '+r.status);if(r.status===401)m='التوكن غلط أو منتهي';else if(r.status===403||r.status===404)m='مش قادر أوصل للريبو أو الملف ('+m+'). اتأكد من اسم الريبو وإن التوكن عنده صلاحية Contents: Read and write.';throw new Error(m)}
  return j})})}
function dec(b){var s=atob(String(b).replace(/\s/g,'')),u=new Uint8Array(s.length);for(var i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return new TextDecoder().decode(u)}
function loadContent(){return gh('GET','/contents/content.json?ref='+encodeURIComponent(CFG.branch)).then(function(j){C=JSON.parse(dec(j.content));SHA=j.sha})}

function guess(){var o='',r='',host=location.hostname,seg=location.pathname.split('/').filter(Boolean);
 if(/\.github\.io$/.test(host)){o=host.split('.')[0];r=(seg.length&&!/\.html?$/.test(seg[0]))?seg[0]:o+'.github.io'}return{owner:o,repo:r}}
function showSetup(err){document.title='دخول | لوحة التحكم';var g=guess(),sv={};try{sv=JSON.parse(store('mcgh')||'{}')}catch(e){}
 var o=h('input',{type:'text',value:sv.owner||g.owner}),r=h('input',{type:'text',value:sv.repo||g.repo}),b=h('input',{type:'text',value:sv.branch||'main'}),t=h('input',{type:'password',value:sv.token||'',autocomplete:'off'}),rem=h('input',{type:'checkbox',style:'width:auto'}),er=h('div',{'class':'msg er'},err||'');rem.checked=!!sv.token;
 function go(){er.textContent='جاري التحقق...';CFG={owner:o.value.trim(),repo:r.value.trim(),branch:b.value.trim()||'main',token:t.value.trim()};
  loadContent().then(function(){store('mcgh',rem.checked?JSON.stringify(CFG):null);draw()}).catch(function(e){CFG=null;er.textContent=e.message})}
 $app.innerHTML='';$app.append(h('div',{'class':'login setup'},h('h1',{},'لوحة تحكم Market Code'),
  h('label',{'class':'f'},h('span',{},'اسم حساب جيت هب (Owner)'),o),h('label',{'class':'f'},h('span',{},'اسم الريبو'),r),h('label',{'class':'f'},h('span',{},'البرانش'),b),
  h('label',{'class':'f'},h('span',{},'التوكن (Personal Access Token)'),t),
  h('label',{'class':'note'},rem,' افتكرني على الجهاز ده (متعملهاش على كمبيوتر مش بتاعك)'),h('div',{},h('button',{'class':'b p',on:{click:go}},'دخول')),er,
  h('p',{'class':'note'},'التوكن بيتعمل مرة واحدة من جيت هب: Settings ثم Developer settings ثم Fine-grained tokens. اختار الريبو ده بس، وفي Permissions خلّي Contents = Read and write. التوكن بيفضل في متصفحك أنت ومش بيترفع في الموقع.')))}

/* ---------- form helpers ---------- */
function fld(l,v,set,area,type,ltr){var i=area?h('textarea',{rows:3},v):h('input',{type:type||'text',value:v});if(ltr)i.style.direction='ltr';i.addEventListener('input',function(){set(i.value);touch()});return h('label',{'class':'f'},h('span',{},l),i)}
function path(l,p){return p.reduce(function(o,k){return o[k]},C.site[l])}
function items(v,p,redraw){var box=h('div');v.forEach(function(it,i){box.append(h('div',{'class':'it'},fld('العنوان',it[0],function(x){it[0]=x}),fld('الوصف',it[1],function(x){it[1]=x},true),h('button',{'class':'b d',on:{click:function(){if(!confirm('حذف العنصر من اللغتين؟'))return;['ar','en'].forEach(function(l){path(l,p).splice(i,1)});touch();redraw()}}},'حذف (من اللغتين)')))});
 box.append(h('button',{'class':'b p',on:{click:function(){['ar','en'].forEach(function(l){path(l,p).push(['',''])});touch();redraw()}}},'+ إضافة عنصر'));return box}
function build(obj,p,host,redraw){Object.keys(obj).forEach(function(k){var v=obj[k],q=p.concat(k),lb=LB[k]||k;
 if(typeof v==='string')host.append(fld(lb,v,function(x){obj[k]=x},k==='p'||k==='v'||v.length>70));
 else if(Array.isArray(v)&&Array.isArray(v[0]))host.append(h('details',{open:''},h('summary',{},lb),items(v,q,redraw)));
 else if(Array.isArray(v)){var d=h('div');v.forEach(function(s,i){d.append(fld(lb+' '+(i+1),s,function(x){v[i]=x}))});host.append(h('details',{},h('summary',{},lb),d))}
 else{var d2=h('div');build(v,q,d2,redraw);host.append(h('details',{},h('summary',{},lb),d2))}})}

/* ---------- images (kept in memory until Save) ---------- */
function srcOf(p){return PEND[p]||p}
function shrink(file,max,png){return new Promise(function(res,rej){var fr=new FileReader();fr.onerror=rej;fr.onload=function(){var im=new Image();im.onerror=function(){rej(new Error('الملف مش صورة'))};im.onload=function(){var k=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c.toDataURL(png?'image/png':'image/jpeg',.86))};im.src=fr.result};fr.readAsDataURL(file)})}
function stage(file,max,png){return shrink(file,max,png).then(function(d){var n='assets/uploads/'+Date.now().toString(36)+Math.random().toString(36).slice(2,7)+(png?'.png':'.jpg');PEND[n]=d;return n})}
function picker(multi,max,png,done){var i=h('input',{type:'file',accept:'image/*',style:'display:none'});if(multi)i.multiple=true;
 i.addEventListener('change',function(){Promise.all([].map.call(i.files,function(f){return stage(f,max,png)})).then(function(u){done(u);touch();say('الصور اتضافت. اضغط حفظ عشان تترفع على الموقع',true)}).catch(function(e){say(e.message,false)})});return i}
function gallery(arr,max,png,lbl,redraw){var box=h('div'),g=h('div',{'class':'gal'});
 arr.forEach(function(o,i){var li=h('input',{type:'url',placeholder:'لينك عند الضغط على الصورة (اختياري) https://...',value:o.link||''});li.addEventListener('input',function(){o.link=li.value.trim();touch()});
  g.append(h('div',{'class':'th'},h('img',{src:srcOf(o.src)}),li,h('div',{'class':'ops'},
   h('button',{title:'قبل',on:{click:function(){if(i>0){var t=arr[i-1];arr[i-1]=arr[i];arr[i]=t;touch();redraw()}}}},'→'),
   h('button',{title:'حذف',on:{click:function(){if(confirm('حذف الصورة؟')){arr.splice(i,1);touch();redraw()}}}},'✕'),
   h('button',{title:'بعد',on:{click:function(){if(i<arr.length-1){var t=arr[i+1];arr[i+1]=arr[i];arr[i]=t;touch();redraw()}}}},'←'))))});
 var inp=picker(true,max,png,function(urls){urls.forEach(function(u){arr.push({src:u,link:''})});redraw()});
 box.append(g,h('button',{'class':'b',on:{click:function(){inp.click()}}},lbl),inp);return box}

/* ---------- tabs ---------- */
function tabGeneral(){var d=h('div'),S=C.site;
 d.append(h('h4',{},'بيانات الشركة'),fld('اسم الشركة',S.brand,function(x){S.brand=x}),fld('رقم التليفون',S.phone,function(x){S.phone=x},false,'text',true),fld('رقم واتساب (أرقام فقط بكود الدولة)',S.whatsapp,function(x){S.whatsapp=x},false,'text',true),fld('الإيميل',S.email,function(x){S.email=x},false,'email',true),
 h('h4',{},'روابط السوشيال (سيبها فاضية لو مش عاوزها)'),fld('Behance',S.links.behance,function(x){S.links.behance=x},false,'url',true),fld('Facebook',S.links.facebook,function(x){S.links.facebook=x},false,'url',true),fld('Instagram',S.links.instagram,function(x){S.links.instagram=x},false,'url',true),
 h('h4',{},'الألوان'),fld('اللون الأساسي',S.theme.ac,function(x){S.theme.ac=x},false,'color'),fld('اللون الثانوي',S.theme.ac2,function(x){S.theme.ac2=x},false,'color'),fld('لون الخلفية',S.theme.bg,function(x){S.theme.bg=x},false,'color'),
 h('h4',{},'لوجو الشركة'),h('div',{'class':'gal'},h('div',{'class':'th'},h('img',{src:srcOf(C.assets.logo)}))));
 var inp=picker(false,600,true,function(u){C.assets.logo=u[0];draw()});d.append(h('button',{'class':'b',on:{click:function(){inp.click()}}},'استبدال اللوجو (PNG شفاف أبيض يفضل)'),inp);return d}
function tabText(){var d=h('div'),sel=h('select',{},h('option',{value:'ar'},'العربي'),h('option',{value:'en'},'English'));sel.value=tl;sel.addEventListener('change',function(){tl=sel.value;draw()});
 d.append(h('label',{'class':'f'},h('span',{},'اللغة اللي بتعدلها'),sel),h('p',{'class':'h'},'في العنوان الرئيسي ممكن تلوّن كلمات بالشكل: <span>الكلمات دي</span>'));build(C.site[tl],[tl],d,draw);return d}
function tabImages(){var d=h('div');d.append(h('p',{'class':'h'},'ارفع الصور، واكتب لينك تحت أي صورة عشان لما الزائر يدوس عليها يروح للصفحة دي. الأسهم لتغيير الترتيب.'));
 [['clients','لوجوهات العملاء',400,true,'+ إضافة لوجو'],['video','أعمال الفيديو',900,false,'+ إضافة صور'],['photo','جلسات التصوير',900,false,'+ إضافة صور'],['graphic','الجرافيك',900,false,'+ إضافة صور']].forEach(function(c){d.append(h('h4',{},c[1]),gallery(C.assets[c[0]],c[2],c[3],c[4],draw))});return d}

/* ---------- save: one commit with content.json + new images ---------- */
function badLink(){var all=['clients','video','photo','graphic'];for(var i=0;i<all.length;i++)for(var j=0;j<C.assets[all[i]].length;j++){var l=(C.assets[all[i]][j].link||'').trim();if(l&&!/^(https?:\/\/|mailto:|tel:)\S+$/i.test(l))return l}return null}
function save(){var bl=badLink();if(bl){say('لينك غلط (لازم يبدأ بـ https://): '+bl.slice(0,40),false);return}
 say('جاري الحفظ...',true);var used={};used[C.assets.logo]=1;['clients','video','photo','graphic'].forEach(function(k){C.assets[k].forEach(function(o){used[o.src]=1})});
 var files=[];Object.keys(PEND).forEach(function(p){if(used[p]&&!DONE[p])files.push({path:p,content:PEND[p].split(',')[1],enc:'base64'})});
 files.push({path:'content.json',content:JSON.stringify(C,null,2)+'\n',enc:'utf-8'});
 var br=encodeURIComponent(CFG.branch),base,tree;
 gh('GET','/contents/content.json?ref='+br).then(function(j){if(j.sha!==SHA)throw new Error('حد تاني عدّل الموقع قبلك. حدّث الصفحة (F5) وأعد تعديلك.');return gh('GET','/git/ref/heads/'+br)})
 .then(function(r){base=r.object.sha;return gh('GET','/git/commits/'+base)})
 .then(function(c){tree=c.tree.sha;return Promise.all(files.map(function(f){return gh('POST','/git/blobs',{content:f.content,encoding:f.enc}).then(function(b){return{path:f.path,mode:'100644',type:'blob',sha:b.sha}})}))})
 .then(function(it){return gh('POST','/git/trees',{base_tree:tree,tree:it})})
 .then(function(t){return gh('POST','/git/commits',{message:'تحديث الموقع من لوحة التحكم',tree:t.sha,parents:[base]})})
 .then(function(c){return gh('PATCH','/git/refs/heads/'+br,{sha:c.sha})})
 .then(function(){files.forEach(function(f){DONE[f.path]=1});return gh('GET','/contents/content.json?ref='+br)})
 .then(function(j){SHA=j.sha;dirty=false;say('تم الحفظ ✓ الموقع هيتحدّث خلال دقيقة أو اتنين',true)})
 .catch(function(e){say(e.message,false)})}

function draw(){document.title='لوحة التحكم | Market Code';var TABS=[['الإعدادات العامة',tabGeneral],['النصوص',tabText],['الصور واللينكات',tabImages]];if(cur>=TABS.length)cur=0;var y=window.scrollY;
 msgEl=h('div',{'class':'msg'});if(dirty)say('فيه تعديلات لسه ماتحفظتش',false);
 $app.innerHTML='';
 $app.append(h('div',{'class':'top'},h('b',{},'لوحة تحكم Market Code'),h('div',{'class':'who'},CFG.owner+'/'+CFG.repo+'  ',h('a',{href:'index.html',target:'_blank',style:'color:#f0abfc;margin:0 8px'},'عرض الموقع'),h('button',{'class':'b',on:{click:function(){if(dirty&&!confirm('فيه تعديلات ماتحفظتش، تخرج؟'))return;dirty=false;store('mcgh',null);CFG=null;showSetup()}}},'خروج'))),
  h('div',{'class':'wrap'},h('nav',{},TABS.map(function(t,i){return h('button',{'class':i===cur?'on':'',on:{click:function(){cur=i;draw()}}},t[0])})),TABS[cur][1]()),
  h('div',{'class':'save'},msgEl,h('button',{'class':'b p',on:{click:save}},'حفظ ورفع على الموقع')));
 window.scrollTo(0,y)}

(function init(){var sv=null;try{sv=JSON.parse(store('mcgh')||'null')}catch(e){}
 if(sv&&sv.token){CFG=sv;loadContent().then(draw).catch(function(e){CFG=null;showSetup(e.message)})}else showSetup()})();
})();
