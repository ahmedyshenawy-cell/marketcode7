fetch('content.json?v='+Date.now(),{cache:'no-store'}).then(function(r){return r.json()}).then(function(c){window.SITE=c.site;window.ASSETS=c.assets;
(function(){
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function safe(u){u=String(u||'').trim();return /^(https?:\/\/|mailto:|tel:|\/)/i.test(u)?u:''}
function heroHtml(s){return esc(s).replace(/&lt;span&gt;/g,'<span>').replace(/&lt;\/span&gt;/g,'</span>')}
let L=localStorageSafe('mc-lang')||'ar',cat='video';
function localStorageSafe(k,v){try{if(v){localStorage.setItem(k,v)}else{return localStorage.getItem(k)}}catch(e){}}
const $=id=>document.getElementById(id), T=()=>SITE[L];
function render(){
  const t=T(),h=document.documentElement;h.lang=L;h.dir=L==='ar'?'rtl':'ltr';$('lang').textContent=L==='ar'?'EN':'عربي';
  h.style.setProperty('--ac',SITE.theme.ac);h.style.setProperty('--ac2',SITE.theme.ac2);h.style.setProperty('--bg',SITE.theme.bg);document.title=SITE.brand+(L==='ar'?' | ماركت كود':' | Marketing Agency');$('logo').src=ASSETS.logo;$('mark').src=ASSETS.logo;
  $('menu').innerHTML=['about','why','services','clients','work','contact'].map((s,i)=>`<li><a href="#${s}">${esc(t.menu[i])}</a></li>`).join('');
  $('navcta').textContent=t.cta;
  $('h-eb').textContent=t.hero.eb;$('h-t').innerHTML=heroHtml(t.hero.t);$('h-p').textContent=t.hero.p;$('h-c1').textContent=t.hero.c1;$('h-c2').textContent=t.hero.c2;
  $('a-eb').textContent=t.about.eb;$('a-t').textContent=t.about.t;$('a-p').textContent=t.about.p;
  $('mv').innerHTML=['mission','vision','goals'].map(k=>`<div class="card"><b>${esc(t[k].k)}</b><p style="margin-top:6px">${esc(t[k].v)}</p></div>`).join('');
  $('w-eb').textContent=t.why.eb;$('w-t').textContent=t.why.t;
  $('why-g').innerHTML=t.why.items.map((x,i)=>`<div class="card"><span class="num">0${i+1}</span><h3>${esc(x[0])}</h3><p>${esc(x[1])}</p></div>`).join('');
  $('s-eb').textContent=t.srv.eb;$('s-t').textContent=t.srv.t;$('s-p').textContent=t.srv.p;
  $('srv').innerHTML=t.srv.items.map((x,i)=>`<div class="card"><span class="num">${String(i+1).padStart(2,'0')}</span><h3>${esc(x[0])}</h3><p>${esc(x[1])}</p></div>`).join('');
  $('c-eb').textContent=t.cl.eb;$('c-t').textContent=t.cl.t;
  $('cl').innerHTML=ASSETS.clients.map(function(o){var im='<img src="'+esc(o.src)+'" alt="" loading="lazy">',u=safe(o.link);return '<div>'+(u?'<a href="'+esc(u)+'" target="_blank" rel="noopener">'+im+'</a>':im)+'</div>'}).join('');
  $('p-eb').textContent=t.pf.eb;$('p-t').textContent=t.pf.t;
  $('tabs').innerHTML=Object.keys(t.pf.tabs).map(k=>`<button class="tab${k===cat?' on':''}" data-k="${esc(k)}">${esc(t.pf.tabs[k])}</button>`).join('');
  $('work-g').innerHTML=(ASSETS[cat]||[]).map(function(o){var im='<img src="'+esc(o.src)+'" alt="" loading="lazy">',u=safe(o.link);return u?'<a class="wk" href="'+esc(u)+'" target="_blank" rel="noopener">'+im+'<i>↗</i></a>':'<button>'+im+'</button>'}).join('');
  const m=$('more'),lk=safe(SITE.links.behance||SITE.links.facebook||SITE.links.instagram);m.textContent=t.pf.more;m.style.display=lk?'':'none';if(lk)m.href=lk;
  $('k-eb').textContent=t.ct.eb;$('k-t').textContent=t.ct.t;$('k-p').textContent=t.ct.p;
  const wa=$('wa');wa.textContent=t.ct.wa;wa.href='https://wa.me/'+encodeURIComponent(String(SITE.whatsapp).replace(/\D/g,''));
  const soc=[['Behance',SITE.links.behance],['Facebook',SITE.links.facebook],['Instagram',SITE.links.instagram]].filter(x=>safe(x[1])).map(x=>`<a href="${esc(safe(x[1]))}" target="_blank" rel="noopener">${x[0]}</a>`).join('');
  $('ci').innerHTML=`<a href="tel:${esc(SITE.phone.replace(/\s/g,''))}">${esc(SITE.phone)}</a><a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>${soc}`;
  $('foot').textContent='© '+new Date().getFullYear()+' '+SITE.brand+' · '+t.foot;
  document.querySelectorAll('.rv').forEach(e=>io.observe(e));
}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$('lang').onclick=()=>{L=L==='ar'?'en':'ar';localStorageSafe('mc-lang',L);render()};
document.addEventListener('click',e=>{
  const tb=e.target.closest('.tab');if(tb){cat=tb.dataset.k;render();return}
  const w=e.target.closest('.work button');if(w){const img=w.querySelector('img');$('lb').querySelector('img').src=img.src;$('lb').classList.add('on');return}
  if(e.target.closest('#lb'))$('lb').classList.remove('on');
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('lb').classList.remove('on')});
window.MC={render:render,setLang:function(l){L=l;render()}};
render();
})();
}).catch(function(e){console.error(e)});
