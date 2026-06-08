
const SITE_VERSION = '2.8';
const DATA = window.DOTA_WIKI_DATA || {heroes:[],items:[],mechanics:[],guides:[],roles:[],glossary:[],patches:[]};
const buildData = {
  carry: {
    title: 'Керри',
    subtitle: 'Предметы для фарма, выживаемости и урона в поздней стадии.',
    cols: [
      ['Линия', 'Tango', 'Magic Wand', 'Power Treads / Phase Boots'],
      ['Темп', 'Battle Fury / Maelstrom', 'Manta Style', 'Black King Bar'],
      ['Поздняя игра', 'Butterfly', 'Satanic', 'Eye of Skadi', 'Daedalus']
    ]
  },
  mid: {
    title: 'Мид',
    subtitle: 'Предметы для контроля рун, темпа и быстрого влияния на карту.',
    cols: [
      ['Старт', 'Bottle', 'Magic Wand', 'Power Treads / Phase Boots'],
      ['Активная игра', 'Blink Dagger', 'Orchid Malevolence', 'Kaya', 'Black King Bar'],
      ['Скейл', 'Scythe of Vyse', 'Aghanim’s Scepter', 'Refresher Orb', 'Octarine Core']
    ]
  },
  offlane: {
    title: 'Оффлейн',
    subtitle: 'Предметы для инициации, плотности и командных аур.',
    cols: [
      ['Линия', 'Vanguard', 'Bracer', 'Phase Boots'],
      ['Инициация', 'Blink Dagger', 'Blade Mail', 'Black King Bar'],
      ['Команда', 'Pipe of Insight', 'Crimson Guard', 'Shiva’s Guard', 'Assault Cuirass']
    ]
  },
  support: {
    title: 'Саппорт',
    subtitle: 'Предметы для обзора, сейва и командной игры.',
    cols: [
      ['Карта', 'Observer Ward', 'Sentry Ward', 'Smoke of Deceit', 'Dust of Appearance'],
      ['Сейв', 'Force Staff', 'Glimmer Cape', 'Aeon Disk'],
      ['Командные предметы', 'Arcane Boots', 'Guardian Greaves', 'Pipe of Insight', 'Lotus Orb']
    ]
  }
};
const TERM_ITEM_MAP = {
  'бкб': ['black_king_bar'],
  'вард': ['observer_ward', 'sentry_ward'],
  'смок': ['smoke_of_deceit'],
  'хекс': ['sheepstick'],
  'диспел': ['lotus_orb', 'manta'],
  'сейв': ['force_staff', 'glimmer_cape'],
  'инициация': ['blink'],
  'стан': ['basher', 'abyssal_blade'],
  'фарм': ['bfury', 'maelstrom', 'radiance'],
  'пуш': ['desolator', 'assault'],
  'аегис': [],
  'байбек': []
};

const COUNTER_PROFILES = {
  phantom_assassin:{note:'PA опасна критами и быстрым убийством саппортов. Против неё работают контроль, броня, сейвы и True Strike.',counters:['axe','legion_commander','lion','bloodseeker','viper'],items:['Monkey King Bar','Ghost Scepter','Heaven’s Halberd','Blade Mail','Black King Bar'],build:['Линия: Magic Wand / Bracer','Мидгейм: Blade Mail / Blink Dagger / Ghost Scepter','Поздняя стадия: Monkey King Bar / Heaven’s Halberd / Shiva’s Guard']},
  bristleback:{note:'Bristleback силён в затяжных драках. Против него ценны break, снижение брони, антиреген и кайt.',counters:['viper','legion_commander','slardar','ancient_apparition','drow_ranger'],items:['Silver Edge','Eye of Skadi','Shiva’s Guard','Black King Bar','Force Staff'],build:['Линия: Magic Wand / Boots of Speed','Мидгейм: Silver Edge / Eye of Skadi','Поздняя стадия: Shiva’s Guard / Assault Cuirass']},
  pudge:{note:'Pudge наказывает плохую позицию. Ответ — вижен, сейв союзников и предметы против захвата цели.',counters:['life_stealer','ursa','vengefulspirit','slark','abaddon'],items:['Force Staff','Linken’s Sphere','Lotus Orb','Glimmer Cape','Black King Bar'],build:['Линия: Observer Ward / Sentry Ward','Мидгейм: Force Staff / Glimmer Cape','Поздняя стадия: Linken’s Sphere / Lotus Orb']},
  invoker:{note:'Invoker зависит от позиции, маны и темпа заклинаний. Против него важны быстрый фокус, silence и BKB.',counters:['nyx_assassin','silencer','puck','storm_spirit','queenofpain'],items:['Black King Bar','Orchid Malevolence','Blink Dagger','Linken’s Sphere','Lotus Orb'],build:['Линия: Magic Wand / Boots of Speed','Мидгейм: Black King Bar / Orchid Malevolence','Поздняя стадия: Scythe of Vyse / Linken’s Sphere']},
  anti_mage:{note:'Anti-Mage раскрывается через фарм и сплитпуш. Его замедляют раннее давление, lockdown и контроль карты.',counters:['legion_commander','axe','lion','slardar','bloodseeker'],items:['Scythe of Vyse','Abyssal Blade','Orchid Malevolence','Black King Bar','Blink Dagger'],build:['Линия: Sentry Ward / агрессивный вижен','Мидгейм: Orchid Malevolence / Blink Dagger','Поздняя стадия: Scythe of Vyse / Abyssal Blade']},
  huskar:{note:'Huskar силён на низком здоровье. Против него особенно важны антихил, сейвы и контроль темпа.',counters:['ancient_apparition','viper','necrolyte','shadow_demon','dazzle'],items:['Heaven’s Halberd','Ghost Scepter','Shiva’s Guard','Black King Bar','Force Staff'],build:['Линия: Magic Wand / Raindrops','Мидгейм: Heaven’s Halberd / Force Staff','Поздняя стадия: Shiva’s Guard / Scythe of Vyse']},
  templar_assassin:{note:'Templar Assassin зависит от Refraction и быстрого темпа. Против неё помогают DoT, минус броня и контроль Рошана.',counters:['viper','batrider','venomancer','jakiro','slardar'],items:['Dust of Appearance','Monkey King Bar','Desolator','Black King Bar','Force Staff'],build:['Линия: Sentry Ward / Dust of Appearance','Мидгейм: Black King Bar / Desolator','Поздняя стадия: Monkey King Bar / Butterfly']},
  medusa:{note:'Medusa сильна в затяжных драках и требует ответа по мане, позиционке и темпу.',counters:['anti_mage','nyx_assassin','slark','terrorblade','sniper'],items:['Diffusal Blade','Butterfly','Eye of Skadi','Black King Bar','Silver Edge'],build:['Линия: ранний урон / темповые ботинки','Мидгейм: Diffusal Blade / Manta Style','Поздняя стадия: Butterfly / Eye of Skadi']},
  tinker:{note:'Tinker опасен постоянным давлением по карте. Ответ — вижен, мобильность, silence и быстрый вход.',counters:['spectre','storm_spirit','nyx_assassin','rattletrap','zuus'],items:['Orchid Malevolence','Blink Dagger','Black King Bar','Scythe of Vyse','Dust of Appearance'],build:['Линия: Observer Ward / Sentry Ward','Мидгейм: Orchid Malevolence / Blink Dagger','Поздняя стадия: Scythe of Vyse / Black King Bar']}
};
const MAP_POINTS = {
  roshan:{title:'Рошан',tag:'объект',text:'Ключевая нейтральная цель. Контроль этой зоны часто решает середину и позднюю стадию.',links:[['Патчи','patches.html'],['Механики','mechanics.html']]},
  river:{title:'Река',tag:'темп',text:'Центральная зона для перемещений, рун и ранних драк между линиями.',links:[['Механики','mechanics.html']]},
  runes:{title:'Руны',tag:'экономика',text:'Руны помогают мидеру держать темп и создают поводы для перемещений саппортов.',links:[['Роли','roles.html']]},
  ancients:{title:'Древние крипы',tag:'фарм',text:'Сильные нейтральные лагеря, важные для керри, оффлейнеров и героев с быстрым фармом.',links:[['Предметы','items.html']]},
  safelane:{title:'Безопасная линия',tag:'линия',text:'Обычно зона керри и одного-двух саппортов. Главная задача — стабильный фарм и защита ключевого героя.',links:[['Герои','heroes.html'],['Сборки','builds.html']]},
  offlane:{title:'Сложная линия',tag:'давление',text:'Зона оффлейнера. Здесь часто играют плотные инициаторы и герои, создающие пространство.',links:[['Роли','roles.html']]},
  wards:{title:'Обзор и вардинг',tag:'вижен',text:'Грамотный обзор открывает смоки, защищает фарм и помогает начинать драки на удобной позиции.',links:[['Словарь','glossary.html'],['Механики','mechanics.html']]}
};
const COMBO_DATA = [
  {type:'Линия',heroes:['crystal_maiden','juggernaut'],title:'Crystal Maiden + Juggernaut',text:'Замедление и контроль помогают Juggernaut наносить стабильный урон на линии.',items:['Observer Ward','Magic Wand']},
  {type:'Драка',heroes:['magnataur','phantom_assassin'],title:'Magnus + Phantom Assassin',text:'Empower усиливает фарм и урон, а массовый контроль создаёт окно для входа керри.',items:['Black King Bar','Blink Dagger']},
  {type:'Инициация',heroes:['dark_seer','spirit_breaker'],title:'Dark Seer + Spirit Breaker',text:'Ускорение, вход с дальнего расстояния и давление по карте.',items:['Pipe of Insight','Crimson Guard']},
  {type:'Комбо',heroes:['faceless_void','invoker'],title:'Faceless Void + Invoker',text:'Chronosphere фиксирует цели, а Invoker добавляет большой магический урон.',items:['Black King Bar','Refresher Orb']},
  {type:'Контроль',heroes:['grimstroke','doom_bringer'],title:'Grimstroke + Doom',text:'Связка усиливает точечный контроль и давление по двум целям.',items:['Blink Dagger','Scythe of Vyse']},
  {type:'Сейв',heroes:['wisp','gyrocopter'],title:'Io + Gyrocopter',text:'Мобильность, лечение и сильный темп вокруг керри.',items:['Black King Bar','Satanic']},
  {type:'Пуш',heroes:['shadow_demon','luna'],title:'Shadow Demon + Luna',text:'Иллюзии и ауры помогают быстрее давить линии и строения.',items:['Manta Style','Butterfly']},
  {type:'Тимфайт',heroes:['enigma','earthshaker'],title:'Enigma + Earthshaker',text:'Массовый контроль и наказание за плотную позицию врага.',items:['Blink Dagger','Black King Bar']}
];

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const params = new URLSearchParams(location.search);
const norm = v => String(v ?? '').toLowerCase().trim();
const esc = v => String(v ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
function pageUrl(page, extra={}){const p=new URLSearchParams({v:SITE_VERSION});Object.entries(extra).forEach(([k,v])=>{if(v!==undefined&&v!==null&&String(v)!=='')p.set(k,v)});return `${page}?${p.toString()}`}
const heroUrl = slug => pageUrl('hero.html',{hero:slug});
const itemUrl = slug => pageUrl('item.html',{item:slug});
const pills = arr => (arr||[]).map(x=>`<span class="pill">${esc(x)}</span>`).join('');
const tags = arr => (arr||[]).map(x=>`<span>${esc(x)}</span>`).join('');
const storeKey = t => `dotawiki:v5:${t}`;
const oldKeys = t => [`dotawiki:v5:${t}`,`dotawiki:v4:fav:${t}`,`dotawiki:v3:fav:${t}`];
function readStore(key, fallback=[]){try{return JSON.parse(localStorage.getItem(key)||'null')||fallback}catch{return fallback}}
function writeStore(key, value){try{localStorage.setItem(key, JSON.stringify(value))}catch{}}
function getFav(t){const cur=readStore(storeKey(`fav:${t}`),null); if(cur) return cur; for(const k of oldKeys(t)){const old=readStore(k,null); if(old){writeStore(storeKey(`fav:${t}`),old); return old}} return []}
function setFav(t,v){writeStore(storeKey(`fav:${t}`),[...new Set(v)])}
function isFav(t,id){return getFav(t).includes(id)}
function toggleFav(t,id){const a=getFav(t);setFav(t,a.includes(id)?a.filter(x=>x!==id):[...a,id])}
function fallbackSvg(label){const safe=encodeURIComponent(String(label||'?').slice(0,2).toUpperCase());return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1'%3E%3Cstop stop-color='%23c8322b'/%3E%3Cstop offset='1' stop-color='%23f0b35f'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='240' fill='%23101116'/%3E%3Ccircle cx='325' cy='35' r='120' fill='url(%23g)' opacity='.35'/%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' font-size='72' fill='%23fff' font-family='Arial' font-weight='800'%3E${safe}%3C/text%3E%3C/svg%3E`}
function setupMenu(){const b=$('[data-menu-button]'),m=$('[data-menu]');b?.addEventListener('click',()=>m?.classList.toggle('open'));document.addEventListener('click',e=>{if(!m?.classList.contains('open'))return;if(e.target.closest('.site-header'))return;m.classList.remove('open')})}
function setupTheme(){const b=$('[data-theme-toggle]');if(localStorage.getItem('dotawiki:theme')==='light')document.body.classList.add('light-theme');if(b)b.textContent=document.body.classList.contains('light-theme')?'☀':'☾';b?.addEventListener('click',()=>{document.body.classList.toggle('light-theme');const light=document.body.classList.contains('light-theme');localStorage.setItem('dotawiki:theme',light?'light':'dark');b.textContent=light?'☀':'☾'})}
function markActiveNav(){const file=(location.pathname.split('/').pop()||'index.html').replace('guides.html','roles.html');$$('.main-nav a').forEach(a=>{const href=(a.getAttribute('href')||'').split('?')[0];a.classList.toggle('active',href===file||(file===''&&href==='index.html'))})}
function fillSelect(sel, values){const el=$(sel); if(!el)return; [...new Set(values.filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b),'ru')).forEach(v=>el.insertAdjacentHTML('beforeend',`<option value="${esc(v)}">${esc(v)}</option>`))}
function setupFavButtons(after){$$('[data-fav-type]').forEach(btn=>{btn.onclick=(e)=>{e.preventDefault();e.stopPropagation();const t=btn.dataset.favType,id=btn.dataset.favId;toggleFav(t,id);if(after)after();else{btn.classList.toggle('active',isFav(t,id));btn.textContent=btn.classList.contains('active')?'★':'★'}}})}
function heroBadges(h){const out=[h.attribute,h.complexity,...(h.roles||[]).slice(0,2)];if(h.complexity==='Низкая')out.push('Новичкам');if((h.roles||[]).some(r=>['Инициатор','Контроль','Дизейблер'].includes(r)))out.push('Контроль');return [...new Set(out)].slice(0,6)}
function heroCard(h, compact=false){return `<article class="wiki-card hero-card ${compact?'compact-card':''}"><button class="fav-button ${isFav('heroes',h.slug)?'active':''}" data-fav-type="heroes" data-fav-id="${esc(h.slug)}" aria-label="Избранное">★</button><a class="hero-img-wrap" href="${heroUrl(h.slug)}"><img src="${esc(h.image)}" alt="${esc(h.name)}" loading="lazy" onerror="this.onerror=null;this.src='${fallbackSvg(h.name)}'"></a><div class="card-body"><div class="card-meta"><span>${esc(h.attribute)}</span><span>${esc(h.complexity)}</span></div><h2><a href="${heroUrl(h.slug)}">${esc(h.name)}</a></h2><p>${esc(h.overview)}</p><div class="live-badges">${heroBadges(h).map(x=>`<span>${esc(x)}</span>`).join('')}</div><div class="pill-row">${pills(h.roles)}</div><a class="card-link" href="${heroUrl(h.slug)}">Открыть героя →</a></div></article>`}
function itemBadges(it){return [...new Set([it.category,...(it.tags||[]),...(it.useAgainst||[]).slice(0,1)])].filter(Boolean).slice(0,5)}
function itemCard(it){return `<article class="item-card"><button class="fav-button ${isFav('items',it.slug)?'active':''}" data-fav-type="items" data-fav-id="${esc(it.slug)}" aria-label="Избранное">★</button><a href="${itemUrl(it.slug)}"><img class="item-icon" src="${esc(it.image)}" alt="${esc(it.name)}" loading="lazy" onerror="this.onerror=null;this.src='${fallbackSvg(it.name)}'"></a><div><div class="card-meta"><span>${esc(it.category)}</span></div><h3><a href="${itemUrl(it.slug)}">${esc(it.name)}</a></h3><p>${esc(it.description)}</p><div class="item-badges">${itemBadges(it).map(x=>`<span>${esc(x)}</span>`).join('')}</div><a class="card-link mini-link" href="${itemUrl(it.slug)}">Подробнее →</a></div></article>`}
function setupGlobalSearch(){
  const form=$('[data-global-search]'), input=$('#globalSearch'), box=$('#globalResults');
  if(!form||!input||!box)return;
  const pool=[
    ...DATA.heroes.map(h=>({type:'Герой',title:h.name,text:[h.attribute,...(h.roles||[])].join(' · '),url:heroUrl(h.slug),search:[h.name,h.attribute,(h.roles||[]).join(' '),h.overview,h.description].join(' ')})),
    ...DATA.items.map(i=>({type:'Предмет',title:i.name,text:i.category,url:itemUrl(i.slug),search:[i.name,i.category,i.description,(i.tags||[]).join(' ')].join(' ')})),
    ...DATA.glossary.map(g=>({type:'Термин',title:g.term,text:g.definition,url:pageUrl('glossary.html',{q:g.term}),search:[g.term,g.definition,g.category].join(' ')})),
    ...DATA.mechanics.map(m=>({type:'Механика',title:m.title,text:m.category||'',url:pageUrl('mechanics.html',{mechanic:m.slug}),search:[m.title,m.text,m.category,m.keywords].join(' ')})),
    ...(DATA.roles||DATA.guides||[]).map(r=>({type:'Роль',title:r.title,text:r.level||'',url:pageUrl('roles.html',{q:r.title}),search:[r.title,r.text,r.level].join(' ')})),
    {type:'Раздел',title:'Контрпики',text:'Генератор ответов против героев',url:pageUrl('counters.html'),search:'контрпики контры против counter picks'},
    {type:'Раздел',title:'Карта',text:'Рошан, руны, линии и обзор',url:pageUrl('map.html'),search:'карта рошан руны линии лес вардинг обзор'},
    {type:'Раздел',title:'Связки',text:'Комбо героев для линии и драки',url:pageUrl('combos.html'),search:'связки комбо герои линия драка combo'}
  ];
  function draw(){const q=norm(input.value); if(q.length<2){box.hidden=true;box.innerHTML='';return} const res=pool.filter(x=>norm(x.search).includes(q)).slice(0,10); box.hidden=false; box.innerHTML=res.length?res.map(x=>`<a class="global-result" href="${esc(x.url)}"><span>${esc(x.type)}</span><strong>${esc(x.title)}</strong><small>${esc(x.text)}</small></a>`).join(''):'<div class="global-empty">Ничего не найдено</div>'}
  input.addEventListener('input',draw); input.addEventListener('focus',draw); form.addEventListener('submit',e=>{e.preventDefault();const first=box.querySelector('a'); if(first) location.href=first.href}); document.addEventListener('click',e=>{if(!form.contains(e.target)) box.hidden=true})
}
function getHero(slug){return DATA.heroes.find(h=>h.slug===slug)}
function getItem(slug){return DATA.items.find(i=>i.slug===slug)}
function simplifyName(v){return norm(v).replace(/[’']/g,'').replace(/[^a-zа-я0-9]+/gi,' ').replace(/\s+/g,' ').trim()}
function itemByName(name){const n=simplifyName(name);return DATA.items.find(i=>simplifyName(i.name)===n||i.slug===n.replaceAll(' ','_'))||DATA.items.find(i=>simplifyName(i.name).includes(n)||n.includes(simplifyName(i.name)))}
function itemAnchorBySlug(slug,label){const it=getItem(slug);return it?`<a class="chip-link" href="${itemUrl(it.slug)}">${esc(label||it.name)} →</a>`:''}
function mechanicAnchorBySlug(slug,label){const m=mechanicBySlug(slug);return m?`<a class="chip-link" href="${pageUrl('mechanics.html',{mechanic:m.slug})}">${esc(label||m.title)} →</a>`:''}
function rememberHero(slug){if(!slug)return;const key=storeKey('recent:heroes');const arr=readStore(key,[]).filter(x=>x!==slug);arr.unshift(slug);writeStore(key,arr.slice(0,6))}

function setCrumb(text){const el=$('#crumbCurrent'); if(el) el.textContent=text||'Карточка'}
function resetLink(page){return `<a class="button small ghost" href="${pageUrl(page)}">Показать всё</a>`}
function emptyBox(title,text,page){return `<div class="empty-state"><h3>${esc(title)}</h3><p>${esc(text)}</p><div class="hero-actions">${resetLink(page)}</div></div>`}
function mechanicBySlug(slug){return DATA.mechanics.find(m=>m.slug===slug)}
function fillButtons(containerSel, values, onClick){const box=$(containerSel); if(!box)return; box.innerHTML=['Все',...values].map(v=>`<button class="category-chip" type="button" data-value="${esc(v==='Все'?'':v)}">${esc(v)}</button>`).join(''); box.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>onClick(b.dataset.value)))}
function renderHome(){const stats=$('#siteStats');if(stats){stats.innerHTML=[['Героев в базе',DATA.heroes.length],['Карточки предметов',DATA.items.length],['Механики',DATA.mechanics.length],['Термины',DATA.glossary.length]].map(([a,b])=>`<article class="stat-card"><strong>${b}</strong><span>${a}</span></article>`).join('')} const stack=$('#heroStack');if(stack){const picks=['axe','invoker','phantom_assassin'].map(getHero).filter(Boolean);stack.innerHTML=picks.map(h=>`<div class="stack-card"><img src="${esc(h.image)}" alt="${esc(h.name)}" onerror="this.onerror=null;this.src='${fallbackSvg(h.name)}'"><span>${esc(h.name)}</span><small>${esc(h.roles.join(' · '))}</small></div>`).join('')} const popular=$('#popularHeroes');if(popular){const picks=['axe','juggernaut','invoker','phantom_assassin','pudge','crystal_maiden'].map(getHero).filter(Boolean);popular.innerHTML=picks.map(h=>heroCard(h,true)).join('')} const patchBox=$('#homePatches');if(patchBox){patchBox.innerHTML=DATA.patches.slice(0,2).map(p=>`<article class="article-card patch-mini"><span class="level-badge">${esc(p.version)}</span><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p><a class="card-link" href="${pageUrl('patches.html')}">К патчам →</a></article>`).join('')} const favs=getFav('heroes');const count=$('#favoriteHeroCount'); if(count)count.textContent=favs.length; const clear=$('#clearFavHeroes'); if(clear){clear.hidden=favs.length===0; clear.onclick=()=>{setFav('heroes',[]);renderHome()}} const home=$('#homeHeroes');if(home){const arr=favs.map(getHero).filter(Boolean);home.innerHTML=arr.length?arr.map(h=>heroCard(h,true)).join(''):`<div class="empty-state favorites-empty"><h3>Избранных героев пока нет</h3><p>Отметка звездой на карточке героя добавит его в этот блок.</p><a class="button primary" href="${pageUrl('heroes.html')}">Открыть героев</a></div>`} const recent=$('#recentHeroes');if(recent){const arr=readStore(storeKey('recent:heroes'),[]).map(getHero).filter(Boolean);recent.innerHTML=arr.length?arr.map(h=>heroCard(h,true)).join(''):`<div class="empty-state">Открытые герои появятся здесь.</div>`} setupFavButtons(()=>renderHome())}
function renderHeroes(){
  const list=$('#heroesList');if(!list)return;
  fillSelect('#attributeFilter',DATA.heroes.map(h=>h.attribute));fillSelect('#roleFilter',DATA.heroes.flatMap(h=>h.roles));fillSelect('#complexityFilter',DATA.heroes.map(h=>h.complexity));
  const search=$('#heroSearch'); if(params.get('q')&&search) search.value=params.get('q');let favOnly=false;
  const reset=()=>{if(search)search.value='';['#attributeFilter','#roleFilter','#complexityFilter'].forEach(s=>{const el=$(s); if(el)el.value=''});favOnly=false;$('#onlyFavHeroes')?.classList.remove('active');redraw()};
  const redraw=()=>{const q=norm(search?.value),attr=$('#attributeFilter')?.value,role=$('#roleFilter')?.value,cx=$('#complexityFilter')?.value;let arr=DATA.heroes.filter(h=>(!q||norm([h.name,h.attribute,h.complexity,h.roles.join(' '),h.overview,h.description].join(' ')).includes(q))&&(!attr||h.attribute===attr)&&(!role||h.roles.includes(role))&&(!cx||h.complexity===cx)&&(!favOnly||isFav('heroes',h.slug)));$('#heroesCount').textContent=`Показано героев: ${arr.length} из ${DATA.heroes.length}`;list.innerHTML=arr.length?arr.map(heroCard).join(''):emptyBox('Герои не найдены','Очистите поиск или измените фильтры.','heroes.html');setupFavButtons(redraw)};
  ['#heroSearch','#attributeFilter','#roleFilter','#complexityFilter'].forEach(s=>$(s)?.addEventListener('input',redraw));$('#onlyFavHeroes')?.addEventListener('click',e=>{favOnly=!favOnly;e.currentTarget.classList.toggle('active',favOnly);redraw()});$('#resetHeroes')?.addEventListener('click',reset);redraw()
}
function abilityGrid(abilities){return abilities?.length?`<div class="ability-grid">${abilities.map((a,i)=>{const name=typeof a==='string'?a:a.name;const text=typeof a==='string'?'':a.text;return `<article class="ability-card"><div class="ability-icon">${esc(String(i+1))}</div><div><h3>${esc(name)}</h3>${text?`<p>${esc(text)}</p>`:''}</div></article>`}).join('')}</div>`:'<p>Список способностей появится после обновления базы.</p>'}
function itemLinkList(names){const arr=(names||[]).map(n=>DATA.items.find(i=>i.name===n)).filter(Boolean);return arr.length?arr.map(i=>`<a class="chip-link" href="${itemUrl(i.slug)}">${esc(i.name)}</a>`).join(''):(names||[]).map(n=>`<span>${esc(n)}</span>`).join('')}
function glossaryLinks(names){return (names||[]).map(n=>`<a class="chip-link" href="${pageUrl('glossary.html',{q:n})}">${esc(n)}</a>`).join('')}
function renderHeroDetail(){const box=$('#heroDetail');if(!box)return;const slug=params.get('hero')||'';const h=getHero(slug)||DATA.heroes[0];rememberHero(h.slug);setCrumb(h.name);document.title=`${h.name} — DotaWiki`;const mainRole=h.roles?.[0]||'Герой';box.innerHTML=`<section class="detail-hero" style="--hero-accent:${esc(h.accent||'#c8322b')}"><div><p class="eyebrow">${esc(h.attribute)} · ${esc(h.complexity)}</p><h1>${esc(h.name)}</h1><p>${esc(h.overview)}</p><div class="mini-stats"><span>Основная роль: ${esc(mainRole)}</span><a href="${pageUrl('roles.html',{q:mainRole})}">${esc(h.laneName||'Гибкая позиция')}</a></div><div class="pill-row">${pills(h.roles)}</div><div class="hero-actions"><button class="button primary" data-fav-type="heroes" data-fav-id="${esc(h.slug)}">★ ${isFav('heroes',h.slug)?'В избранном':'В избранное'}</button><a class="button ghost" href="${pageUrl('compare.html',{a:h.slug})}">Сравнить</a><a class="button ghost" href="${pageUrl('heroes.html')}">Все герои</a></div></div><div class="detail-hero-art"><img src="${esc(h.portrait||h.image)}" alt="${esc(h.name)}" onerror="this.onerror=null;this.src='${fallbackSvg(h.name)}'"></div></section><section class="detail-grid"><article class="wiki-panel"><h2>Описание</h2><p>${esc(h.description)}</p></article><article class="wiki-panel"><h2>Сильные стороны</h2><ul>${(h.strengths||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></article><article class="wiki-panel"><h2>Слабые стороны</h2><ul>${(h.weaknesses||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></article><article class="wiki-panel"><h2>Типовые предметы</h2><div class="item-chips">${itemLinkList(h.bestItems)}</div></article><article class="wiki-panel wide-card"><h2>Способности</h2>${abilityGrid(h.abilities)}</article><article class="wiki-panel"><h2>Контрмеры</h2><div class="item-chips">${tags(h.counters)}</div></article><article class="wiki-panel"><h2>Связанные термины</h2><div class="item-chips">${glossaryLinks(h.relatedTerms)}</div></article></section>`;setupFavButtons(()=>renderHeroDetail())}
function renderItems(){
  const list=$('#itemsList');if(!list)return;fillSelect('#itemCategory',DATA.items.map(i=>i.category));const search=$('#itemSearch'); if(params.get('q')&&search) search.value=params.get('q'); if(params.get('category')&&$('#itemCategory')) $('#itemCategory').value=params.get('category');let favOnly=false;
  const reset=()=>{if(search)search.value='';const c=$('#itemCategory'); if(c)c.value='';favOnly=false;$('#onlyFavItems')?.classList.remove('active');redraw()};
  const redraw=()=>{const q=norm(search?.value),cat=$('#itemCategory')?.value;let arr=DATA.items.filter(i=>(!q||norm([i.name,i.category,i.description,(i.tags||[]).join(' ')].join(' ')).includes(q))&&(!cat||i.category===cat)&&(!favOnly||isFav('items',i.slug)));$('#itemsCount').textContent=`Показано предметов: ${arr.length} из ${DATA.items.length}`;list.innerHTML=arr.length?arr.map(itemCard).join(''):emptyBox('Предметы не найдены','Очистите поиск или измените категорию.','items.html');setupFavButtons(redraw)};
  ['#itemSearch','#itemCategory'].forEach(s=>$(s)?.addEventListener('input',redraw));$('#onlyFavItems')?.addEventListener('click',e=>{favOnly=!favOnly;e.currentTarget.classList.toggle('active',favOnly);redraw()});$('#resetItems')?.addEventListener('click',reset);redraw()
}
function renderItemDetail(){const box=$('#itemDetail');if(!box)return;const it=getItem(params.get('item'))||DATA.items[0];setCrumb(it.name);document.title=`${it.name} — DotaWiki`;box.innerHTML=`<section class="item-detail"><div class="item-detail-icon"><img src="${esc(it.image)}" alt="${esc(it.name)}" onerror="this.onerror=null;this.src='${fallbackSvg(it.name)}'"></div><div><p class="eyebrow">${esc(it.category)}</p><h1>${esc(it.name)}</h1><p>${esc(it.description)}</p><div class="taglist large-tags">${tags(it.tags)}</div><div class="hero-actions"><button class="button primary" data-fav-type="items" data-fav-id="${esc(it.slug)}">★ ${isFav('items',it.slug)?'В избранном':'В избранное'}</button><a class="button ghost" href="${pageUrl('items.html',{category:it.category})}">Категория</a></div></div></section><section class="detail-grid"><article class="wiki-panel"><h2>Назначение</h2><p>Предмет относится к категории «${esc(it.category)}» и закрывает задачи: ${esc((it.tags||[]).join(', ')||'универсальные игровые ситуации')}.</p></article><article class="wiki-panel"><h2>Полезен против</h2><div class="item-chips">${tags(it.useAgainst)}</div></article><article class="wiki-panel"><h2>Герои, которым подходит</h2><div class="item-chips">${(it.usedBy||[]).length?(it.usedBy||[]).map(h=>`<a class="chip-link" href="${heroUrl(h.slug)}">${esc(h.name)}</a>`).join(''):'<span>Зависит от роли и ситуации</span>'}</div></article><article class="wiki-panel"><h2>Похожие предметы</h2><div class="item-chips">${itemLinkList(it.relatedItems)}</div></article></section>`;setupFavButtons(()=>renderItemDetail())}
function renderMechanics(){
  const box=$('#mechanicsList');if(!box)return;const search=$('#mechanicsSearch'), catSel=$('#mechanicCategory');
  fillSelect('#mechanicCategory',DATA.mechanics.map(m=>m.category));
  const categories=[...new Set(DATA.mechanics.map(m=>m.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ru'));
  if(params.get('q')&&search) search.value=params.get('q'); if(params.get('category')&&catSel) catSel.value=params.get('category');
  const exact=params.get('mechanic'); if(exact&&search){const m=mechanicBySlug(exact); if(m) search.value=m.title}
  function redraw(){const q=norm(search?.value),cat=catSel?.value;let arr=DATA.mechanics.filter(m=>(!q||norm([m.title,m.text,m.category,m.keywords].join(' ')).includes(q))&&(!cat||m.category===cat));const count=$('#mechanicsCount'); if(count) count.textContent=`Показано механик: ${arr.length} из ${DATA.mechanics.length}`;$$('#mechanicCategoryStrip .category-chip').forEach(b=>b.classList.toggle('active',(b.dataset.value||'')===(cat||'')));
    if(arr.length){box.innerHTML=arr.map(m=>`<article class="article-card mechanic-card"><div class="mechanic-icon">${esc(m.icon)}</div><p class="eyebrow">${esc(m.category)}</p><h2>${esc(m.title)}</h2><p>${esc(m.text)}</p><a class="card-link" href="${pageUrl('glossary.html',{q:m.title})}">Связанные термины →</a></article>`).join('');return}
    box.innerHTML=`<div class="empty-state"><h3>По этому запросу ничего не найдено</h3><p>Показаны все механики ниже. Можно очистить поиск или выбрать другую категорию.</p><div class="hero-actions"><button class="button small primary" id="clearMechanicsInline">Очистить поиск</button><a class="button small ghost" href="${pageUrl('mechanics.html')}">Открыть все механики</a></div></div>` + DATA.mechanics.map(m=>`<article class="article-card mechanic-card"><div class="mechanic-icon">${esc(m.icon)}</div><p class="eyebrow">${esc(m.category)}</p><h2>${esc(m.title)}</h2><p>${esc(m.text)}</p><a class="card-link" href="${pageUrl('glossary.html',{q:m.title})}">Связанные термины →</a></article>`).join(''); $('#clearMechanicsInline')?.addEventListener('click',reset)
  }
  function reset(){if(search)search.value=''; if(catSel)catSel.value=''; history.replaceState(null,'',pageUrl('mechanics.html')); redraw()}
  fillButtons('#mechanicCategoryStrip',categories,v=>{if(catSel)catSel.value=v;redraw()}); search?.addEventListener('input',redraw); catSel?.addEventListener('input',redraw); $('#resetMechanics')?.addEventListener('click',reset); redraw()
}
function renderGuides(){
  const box=$('#guidesList');if(!box)return;const input=$('#rolesSearch'); if(params.get('q')&&input)input.value=params.get('q');
  const data=DATA.roles||DATA.guides||[];
  function redraw(){const q=norm(input?.value);const arr=data.filter(g=>!q||norm([g.title,g.text,g.level].join(' ')).includes(q));const count=$('#rolesCount'); if(count)count.textContent=`Показано разделов: ${arr.length} из ${data.length}`;box.innerHTML=arr.map(g=>`<article class="article-card guide-card"><span class="level-badge">${esc(g.level)}</span><h2>${esc(g.title)}</h2><p>${esc(g.text)}</p><a class="card-link" href="${pageUrl('heroes.html',{q:g.title})}">Герои роли →</a></article>`).join('')||emptyBox('Раздел не найден','Очистите поиск или откройте все роли.','roles.html')}
  function reset(){if(input)input.value=''; history.replaceState(null,'',pageUrl('roles.html')); redraw()}
  input?.addEventListener('input',redraw); $('#resetRoles')?.addEventListener('click',reset); redraw()
}
function buildItemLink(name){const clean=String(name||'').trim();const it=itemByName(clean);return it?`<a href="${itemUrl(it.slug)}">${esc(clean)}</a>`:`<a href="${pageUrl('items.html',{q:clean})}">${esc(clean)}</a>`}
function renderBuildEntry(entry){return String(entry||'').split('/').map(x=>x.trim()).filter(Boolean).map(buildItemLink).join('<span class="build-separator">/</span>')}
function renderBuilds(type='carry'){
  const box=$('#buildDetail');if(!box)return;
  const b=buildData[type]||buildData.carry;
  $$('[data-build]').forEach(x=>x.classList.toggle('active',x.dataset.build===type));
  box.innerHTML=`<div class="build-head"><div><p class="eyebrow">${esc(b.title)}</p><h2>${esc(b.title)}</h2><p>${esc(b.subtitle)}</p></div><a class="button small ghost" href="${pageUrl('items.html')}">Все предметы</a></div><div class="build-columns">${b.cols.map(col=>`<div class="build-col"><h3>${esc(col[0])}</h3><ul>${col.slice(1).map(x=>`<li>${renderBuildEntry(x)}</li>`).join('')}</ul></div>`).join('')}</div>`;
}
function setupBuilds(){const box=$('#buildDetail');if(!box)return;const tabs=$$('[data-build]');tabs.forEach(b=>{b.type='button';b.addEventListener('click',e=>{e.preventDefault();renderBuilds(b.dataset.build)})});const selected=params.get('role')||'carry';renderBuilds(buildData[selected]?selected:'carry');if(!box.innerHTML.trim())renderBuilds('carry')}
function glossaryTermTargets(g){
  const out=[];
  const itemSlugs=TERM_ITEM_MAP[norm(g.term)]||[];
  itemSlugs.forEach(slug=>{const it=getItem(slug); if(it)out.push({kind:'Предмет',title:it.name,url:itemUrl(it.slug)})});
  const m=mechanicBySlug(g.relatedMechanic); if(m)out.push({kind:'Механика',title:m.title,url:pageUrl('mechanics.html',{mechanic:m.slug})});
  if(!out.length)out.push({kind:'Механики',title:'Все механики',url:pageUrl('mechanics.html')});
  return out;
}
function termTitleLink(g){const first=glossaryTermTargets(g)[0];return `<a href="${esc(first.url)}">${esc(g.term)}</a>`}
function termLinks(g){return `<div class="glossary-links">${glossaryTermTargets(g).map(t=>`<a class="chip-link" href="${esc(t.url)}"><span>${esc(t.kind)}:</span> ${esc(t.title)} →</a>`).join('')}</div>`}
function renderGlossary(){
  const box=$('#glossaryList');if(!box)return;const input=$('#glossarySearch'),catSel=$('#glossaryCategory');
  fillSelect('#glossaryCategory',DATA.glossary.map(g=>g.category));
  const categories=[...new Set(DATA.glossary.map(g=>g.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ru'));
  if(params.get('q')&&input)input.value=params.get('q'); if(params.get('category')&&catSel)catSel.value=params.get('category');
  function redraw(){const q=norm(input?.value),cat=catSel?.value;const arr=DATA.glossary.filter(g=>(!q||norm([g.term,g.definition,g.category].join(' ')).includes(q))&&(!cat||g.category===cat));const count=$('#glossaryCount');if(count)count.textContent=`Показано терминов: ${arr.length} из ${DATA.glossary.length}`;$$('#glossaryCategoryStrip .category-chip').forEach(b=>b.classList.toggle('active',(b.dataset.value||'')===(cat||'')));box.innerHTML=arr.map(g=>`<article class="glossary-item"><div class="card-meta"><span>${esc(g.category||'Термин')}</span></div><h2>${termTitleLink(g)}</h2><p>${esc(g.definition)}</p>${termLinks(g)}</article>`).join('')||emptyBox('Термин не найден','Очистите поиск или выберите другую категорию.','glossary.html')}
  function reset(){if(input)input.value=''; if(catSel)catSel.value=''; history.replaceState(null,'',pageUrl('glossary.html')); redraw()}
  fillButtons('#glossaryCategoryStrip',categories,v=>{if(catSel)catSel.value=v;redraw()}); input?.addEventListener('input',redraw); catSel?.addEventListener('input',redraw); $('#resetGlossary')?.addEventListener('click',reset); redraw()
}
function renderPatches(){const summary=$('#patchSummary');if(summary){summary.innerHTML=DATA.patches.slice(0,2).map(p=>`<article class="article-card"><span class="level-badge">${esc(p.version)}</span><h2>${esc(p.title)}</h2><p>${esc(p.text)}</p><div class="item-chips">${tags(p.sections)}</div></article>`).join('')} const box=$('#patchTimeline');if(!box)return;box.innerHTML=DATA.patches.slice(0,2).map(p=>`<article class="timeline-item"><div class="timeline-version">${esc(p.version)}</div><div class="timeline-content"><p class="eyebrow">${esc(p.date)}</p><h2>${esc(p.title)}</h2><p>${esc(p.text)}</p>${p.highlights?.length?`<ul class="patch-highlights">${p.highlights.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}${p.url?`<a class="button small ghost patch-link" href="${esc(p.url)}" target="_blank" rel="noopener">Открыть официальный патчноут →</a>`:''}</div></article>`).join('')}
function setupCompare(){const a=$('#compareA'),b=$('#compareB'),box=$('#compareResult');if(!a||!b||!box)return;const options=DATA.heroes.map(h=>`<option value="${esc(h.slug)}">${esc(h.name)}</option>`).join('');a.innerHTML=options;b.innerHTML=options;a.value=params.get('a')||'axe';b.value=params.get('b')||'pudge';if(a.value===b.value)b.value=DATA.heroes.find(h=>h.slug!==a.value)?.slug||b.value;function cellList(arr){return `<ul>${(arr||[]).slice(0,5).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`}function redraw(){const h1=getHero(a.value)||DATA.heroes[0],h2=getHero(b.value)||DATA.heroes[1];const rows=[['Атрибут',h1.attribute,h2.attribute],['Сложность',h1.complexity,h2.complexity],['Роли',h1.roles.join(', '),h2.roles.join(', ')],['Линия',h1.laneName||'Гибкая',h2.laneName||'Гибкая'],['Сильные стороны',cellList(h1.strengths),cellList(h2.strengths)],['Слабые стороны',cellList(h1.weaknesses),cellList(h2.weaknesses)],['Типовые предметы',itemLinkList(h1.bestItems),itemLinkList(h2.bestItems)]];box.innerHTML=`<div class="compare-head"><article>${heroCard(h1,true)}</article><article>${heroCard(h2,true)}</article></div><div class="compare-table"><table><thead><tr><th>Параметр</th><th>${esc(h1.name)}</th><th>${esc(h2.name)}</th></tr></thead><tbody>${rows.map(r=>`<tr><th>${esc(r[0])}</th><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody></table></div>`;history.replaceState(null,'',pageUrl('compare.html',{a:h1.slug,b:h2.slug}));setupFavButtons(redraw)}a.addEventListener('change',redraw);b.addEventListener('change',redraw);redraw()}

function counterProfileFor(hero){
  if(COUNTER_PROFILES[hero.slug])return COUNTER_PROFILES[hero.slug];
  const roles=(hero.roles||[]).join(' ').toLowerCase();
  if(roles.includes('керри'))return {note:`${hero.name} зависит от фарма и предметов. Ответ — давление по карте, контроль и предметы против физического урона.`,counters:['axe','legion_commander','lion','shadow_shaman','viper'],items:['Ghost Scepter','Heaven’s Halberd','Scythe of Vyse','Black King Bar','Shiva’s Guard'],build:['Линия: вижен и давление по фарму','Мидгейм: контроль / сейв / броня','Поздняя стадия: Scythe of Vyse / Heaven’s Halberd']};
  if(roles.includes('саппорт'))return {note:`${hero.name} чаще всего влияет через позицию, сейв или контроль. Ответ — быстрый вход, вижен и фокус задней линии.`,counters:['storm_spirit','puck','rattletrap','bounty_hunter','nyx_assassin'],items:['Blink Dagger','Dust of Appearance','Black King Bar','Orchid Malevolence','Force Staff'],build:['Линия: Observer Ward / Sentry Ward','Мидгейм: Blink Dagger / Dust of Appearance','Поздняя стадия: Black King Bar / Scythe of Vyse']};
  return {note:`Против ${hero.name} лучше сочетать обзор, контроль и предметы под тип урона героя.`,counters:['axe','lion','viper','shadow_shaman','slardar'],items:['Black King Bar','Force Staff','Blink Dagger','Lotus Orb','Scythe of Vyse'],build:['Линия: Magic Wand / Observer Ward','Мидгейм: Force Staff / Blink Dagger','Поздняя стадия: Black King Bar / Scythe of Vyse']};
}
function renderCounters(){
  const select=$('#counterHero'),focus=$('#counterFocus'),box=$('#counterResult');if(!select||!box)return;
  select.innerHTML=DATA.heroes.map(h=>`<option value="${esc(h.slug)}">${esc(h.name)}</option>`).join('');
  select.value=params.get('hero')||'phantom_assassin';
  if(!getHero(select.value))select.value='phantom_assassin';
  function draw(){const h=getHero(select.value)||DATA.heroes[0];const prof=counterProfileFor(h);const heroLinks=(prof.counters||[]).map(getHero).filter(Boolean);const itemLinks=itemLinkList(prof.items);const focusText={balanced:'сбалансированный ответ',lane:'давление на линии',teamfight:'драки и позиция',late:'поздняя стадия'}[focus?.value||'balanced'];box.innerHTML=`<section class="counter-hero-panel"><div><p class="eyebrow">против ${esc(h.name)}</p><h2>${esc(h.name)}</h2><p>${esc(prof.note)}</p><div class="live-badges"><span>${esc(h.attribute)}</span><span>${esc(h.complexity)}</span><span>${esc(focusText)}</span></div></div><img src="${esc(h.image)}" alt="${esc(h.name)}" onerror="this.onerror=null;this.src='${fallbackSvg(h.name)}'"></section><section class="two-column counter-sections"><article class="wiki-panel"><h2>Контргерои</h2><div class="cards-grid compact-grid">${heroLinks.map(x=>heroCard(x,true)).join('')}</div></article><article class="wiki-panel"><h2>Предметы против героя</h2><div class="item-chips">${itemLinks}</div><h3>Сборка по стадиям</h3><ul class="build-plan">${(prof.build||[]).map(x=>`<li>${renderBuildEntry(x.replace(/^.*?:\s*/,''))}<span>${esc(x.split(':')[0])}</span></li>`).join('')}</ul></article></section>`;history.replaceState(null,'',pageUrl('counters.html',{hero:h.slug,focus:focus?.value||'balanced'}));setupFavButtons(draw)}
  select.addEventListener('change',draw);focus?.addEventListener('change',draw);$('#counterRandom')?.addEventListener('click',()=>{select.value=DATA.heroes[Math.floor(Math.random()*DATA.heroes.length)].slug;draw()});draw();
}
function setupMap(){const box=$('#mapInfo');if(!box)return;function draw(key){const p=MAP_POINTS[key]||MAP_POINTS.roshan;$$('[data-map]').forEach(b=>b.classList.toggle('active',b.dataset.map===key));box.innerHTML=`<p class="eyebrow">${esc(p.tag)}</p><h2>${esc(p.title)}</h2><p>${esc(p.text)}</p><div class="item-chips">${p.links.map(([label,page])=>`<a class="chip-link" href="${pageUrl(page)}">${esc(label)} →</a>`).join('')}</div>`}$$('[data-map]').forEach(b=>b.addEventListener('click',()=>draw(b.dataset.map)));draw('roshan')}
function renderCombos(){const box=$('#comboList'),filter=$('#comboFilter');if(!box)return;const cats=[...new Set(COMBO_DATA.map(c=>c.type))];let active='';function draw(){if(filter)filter.querySelectorAll('button').forEach(b=>b.classList.toggle('active',(b.dataset.value||'')===active));const arr=COMBO_DATA.filter(c=>!active||c.type===active);box.innerHTML=arr.map(c=>{const hs=c.heroes.map(getHero).filter(Boolean);return `<article class="combo-card"><div class="combo-heroes">${hs.map(h=>`<a href="${heroUrl(h.slug)}"><img src="${esc(h.image)}" alt="${esc(h.name)}"><span>${esc(h.name)}</span></a>`).join('')}</div><p class="eyebrow">${esc(c.type)}</p><h2>${esc(c.title)}</h2><p>${esc(c.text)}</p><div class="item-chips">${itemLinkList(c.items)}</div></article>`}).join('')}
  if(filter){filter.innerHTML=['Все',...cats].map(v=>`<button class="category-chip ${v==='Все'?'active':''}" type="button" data-value="${esc(v==='Все'?'':v)}">${esc(v)}</button>`).join('');filter.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{active=b.dataset.value||'';draw()}))}draw()}

document.addEventListener('DOMContentLoaded',()=>{document.body.classList.add('js-ready');[setupMenu,setupTheme,markActiveNav,setupGlobalSearch,renderHome,renderHeroes,renderHeroDetail,renderItems,renderItemDetail,renderMechanics,renderGuides,setupBuilds,renderGlossary,renderPatches,setupCompare,renderCounters,setupMap,renderCombos].forEach(fn=>{try{fn()}catch(e){console.error('DotaWiki:',fn.name,e)}})});