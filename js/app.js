const DATA = window.DOTA_WIKI_DATA || { heroes: [], items: [], mechanics: [], guides: [], glossary: [], patches: [] };

function qs(selector) { return document.querySelector(selector); }
function qsa(selector) { return Array.from(document.querySelectorAll(selector)); }
function normalize(value) { return String(value || '').toLowerCase().trim(); }
function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}
function slugify(value) { return normalize(value).replace(/[^a-zа-яё0-9]+/gi, '-').replace(/^-|-$/g, ''); }
function pills(items) { return (items || []).map((x) => `<span class="pill">${escapeHtml(x)}</span>`).join(''); }
function getStore(key) { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } }
function setStore(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function isFav(type, id) { return getStore(`dotawiki:fav:${type}`).includes(id); }
function toggleFav(type, id) {
  const key = `dotawiki:fav:${type}`;
  const list = getStore(key);
  const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  setStore(key, next);
}

function setupMenu() {
  const button = qs('[data-menu-button]');
  const menu = qs('[data-menu]');
  if (!button || !menu) return;
  button.addEventListener('click', () => menu.classList.toggle('open'));
}

function setupTheme() {
  const button = qs('[data-theme-toggle]');
  const saved = localStorage.getItem('dotawiki:theme');
  if (saved === 'light') document.body.classList.add('light-theme');
  if (button) button.textContent = document.body.classList.contains('light-theme') ? '☀' : '☾';
  button?.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('dotawiki:theme', theme);
    button.textContent = theme === 'light' ? '☀' : '☾';
  });
}

function uniqueValues(list, getter) {
  return [...new Set(list.flatMap(getter))].filter(Boolean).sort((a, b) => a.localeCompare(b, 'ru'));
}
function fillSelect(select, values) {
  if (!select) return;
  select.innerHTML += values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('');
}

function heroCard(hero) {
  const fav = isFav('heroes', hero.slug);
  return `
    <article class="wiki-card hero-card">
      <button class="fav-button ${fav ? 'active' : ''}" data-fav-type="heroes" data-fav-id="${escapeHtml(hero.slug)}" type="button" aria-label="Добавить в избранное">★</button>
      <div class="avatar-small">${escapeHtml(hero.name.slice(0, 1))}</div>
      <div class="card-meta"><span>${escapeHtml(hero.attribute)}</span><span>${escapeHtml(hero.complexity)}</span></div>
      <h2>${escapeHtml(hero.name)}</h2>
      <p>${escapeHtml(hero.tagline)}</p>
      <div class="pill-row">${pills(hero.roles)}</div>
      <a class="card-link" href="hero.html?hero=${encodeURIComponent(hero.slug)}">Открыть героя →</a>
    </article>`;
}

function setupFavButtons(redraw) {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-fav-id]');
    if (!button) return;
    event.preventDefault();
    toggleFav(button.dataset.favType, button.dataset.favId);
    redraw?.();
  });
}

function renderHome() {
  const stats = qs('#siteStats');
  if (stats) {
    const statData = [
      ['Героев в базе', DATA.heroes.length],
      ['Предметов', DATA.items.length],
      ['Механик', DATA.mechanics.length],
      ['Терминов', DATA.glossary.length],
    ];
    stats.innerHTML = statData.map(([label, value]) => `<article class="stat-card"><strong>${value}</strong><span>${label}</span></article>`).join('');
  }
  const featured = qs('#featuredHeroes');
  if (featured) featured.innerHTML = DATA.heroes.slice(0, 6).map(heroCard).join('');
}

function renderHeroes() {
  const grid = qs('#heroesGrid');
  if (!grid) return;
  const searchInput = qs('#heroSearch');
  const attributeFilter = qs('#attributeFilter');
  const roleFilter = qs('#roleFilter');
  const complexityFilter = qs('#complexityFilter');
  const favoriteFilter = qs('#favoriteHeroFilter');
  const count = qs('#heroCount');
  let onlyFav = false;

  fillSelect(attributeFilter, uniqueValues(DATA.heroes, (hero) => [hero.attribute]));
  fillSelect(roleFilter, uniqueValues(DATA.heroes, (hero) => hero.roles));
  fillSelect(complexityFilter, uniqueValues(DATA.heroes, (hero) => [hero.complexity]));

  function draw() {
    const search = normalize(searchInput?.value);
    const attribute = attributeFilter?.value || 'all';
    const role = roleFilter?.value || 'all';
    const complexity = complexityFilter?.value || 'all';
    const filtered = DATA.heroes.filter((hero) => {
      const searchable = normalize([hero.name, hero.attribute, hero.complexity, hero.roles.join(' '), hero.tagline, hero.description, hero.abilities.join(' ')].join(' '));
      return (!search || searchable.includes(search)) &&
        (attribute === 'all' || hero.attribute === attribute) &&
        (role === 'all' || hero.roles.includes(role)) &&
        (complexity === 'all' || hero.complexity === complexity) &&
        (!onlyFav || isFav('heroes', hero.slug));
    });
    if (count) count.textContent = filtered.length;
    grid.innerHTML = filtered.length ? filtered.map(heroCard).join('') : `<div class="empty-state">Ничего не найдено. Попробуй изменить поиск или фильтр.</div>`;
  }
  [searchInput, attributeFilter, roleFilter, complexityFilter].forEach((el) => el?.addEventListener('input', draw));
  favoriteFilter?.addEventListener('click', () => { onlyFav = !onlyFav; favoriteFilter.classList.toggle('active', onlyFav); draw(); });
  setupFavButtons(draw);
  draw();
}

function renderHeroDetails() {
  const container = qs('#heroDetails');
  if (!container) return;
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('hero');
  const hero = DATA.heroes.find((item) => item.slug === slug) || DATA.heroes[0];
  document.title = `${hero.name} — DotaWiki`;
  const relatedItems = DATA.items.filter((item) => (hero.items || []).includes(item.name));
  container.innerHTML = `
    <a class="back-link" href="heroes.html">← Назад к героям</a>
    <section class="detail-hero">
      <div>
        <p class="eyebrow">${escapeHtml(hero.attribute)} · ${escapeHtml(hero.complexity)} сложность</p>
        <h1>${escapeHtml(hero.name)}</h1>
        <p>${escapeHtml(hero.description)}</p>
        <div class="pill-row">${pills(hero.roles)}</div>
      </div>
      <div class="avatar-placeholder" aria-hidden="true">${escapeHtml(hero.name.slice(0, 1))}</div>
    </section>
    <section class="detail-grid">
      <article class="article-card"><h2>Способности</h2><ul>${hero.abilities.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul></article>
      <article class="article-card"><h2>Рекомендуемые предметы</h2><div class="item-chips">${(hero.items || []).map((x) => `<span>${escapeHtml(x)}</span>`).join('')}</div></article>
      <article class="article-card"><h2>Сильные стороны</h2><ul>${hero.strengths.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul></article>
      <article class="article-card"><h2>Слабые стороны</h2><ul>${hero.weaknesses.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul></article>
      <article class="article-card wide-card"><h2>Советы по игре</h2><ul>${hero.tips.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul></article>
      <article class="article-card wide-card"><h2>Предметы из базы</h2>${relatedItems.length ? relatedItems.map((item) => `<p><strong>${escapeHtml(item.name)}</strong> — ${escapeHtml(item.description)}</p>`).join('') : '<p>Добавь предметы героя в js/data.js.</p>'}</article>
    </section>`;
}

function itemCard(item) {
  const id = slugify(item.name);
  const fav = isFav('items', id);
  return `
    <article class="wiki-card">
      <button class="fav-button ${fav ? 'active' : ''}" data-fav-type="items" data-fav-id="${escapeHtml(id)}" type="button" aria-label="Добавить в избранное">★</button>
      <div class="card-meta"><span>${escapeHtml(item.category)}</span><span>${Number(item.cost).toLocaleString('ru-RU')} золота</span></div>
      <h2>${escapeHtml(item.name)}</h2>
      <p>${escapeHtml(item.description)}</p>
      <div class="pill-row">${pills(item.tags)}</div>
    </article>`;
}

function renderItems() {
  const grid = qs('#itemsGrid');
  if (!grid) return;
  const searchInput = qs('#itemSearch');
  const categoryFilter = qs('#itemCategoryFilter');
  const favoriteFilter = qs('#favoriteItemFilter');
  const count = qs('#itemCount');
  let onlyFav = false;
  fillSelect(categoryFilter, uniqueValues(DATA.items, (item) => [item.category]));
  function draw() {
    const search = normalize(searchInput?.value);
    const category = categoryFilter?.value || 'all';
    const filtered = DATA.items.filter((item) => {
      const searchable = normalize([item.name, item.category, item.description, item.tags.join(' ')].join(' '));
      return (!search || searchable.includes(search)) && (category === 'all' || item.category === category) && (!onlyFav || isFav('items', slugify(item.name)));
    });
    if (count) count.textContent = filtered.length;
    grid.innerHTML = filtered.length ? filtered.map(itemCard).join('') : `<div class="empty-state">Предметы не найдены. Попробуй другой запрос.</div>`;
  }
  [searchInput, categoryFilter].forEach((el) => el?.addEventListener('input', draw));
  favoriteFilter?.addEventListener('click', () => { onlyFav = !onlyFav; favoriteFilter.classList.toggle('active', onlyFav); draw(); });
  setupFavButtons(draw);
  draw();
}

function renderMechanics() {
  const grid = qs('#mechanicsGrid');
  if (!grid) return;
  grid.innerHTML = DATA.mechanics.map((item) => `
    <article class="article-card mechanic-card">
      <p class="eyebrow">${escapeHtml(item.tag)}</p>
      <h2>${escapeHtml(item.title)}</h2>
      <p>${escapeHtml(item.text)}</p>
      <ul>${item.points.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul>
    </article>`).join('');
}

function renderGuides() {
  const grid = qs('#guidesGrid');
  if (!grid) return;
  grid.innerHTML = DATA.guides.map((guide) => `
    <article class="article-card guide-card">
      <div class="card-meta"><span>${escapeHtml(guide.level)}</span><span>${escapeHtml(guide.readTime)}</span></div>
      <h2>${escapeHtml(guide.title)}</h2>
      <p>${escapeHtml(guide.summary)}</p>
      <ol>${guide.steps.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ol>
    </article>`).join('');
}

function renderGlossary() {
  const list = qs('#glossaryList');
  if (!list) return;
  const input = qs('#glossarySearch');
  function draw() {
    const search = normalize(input?.value);
    const filtered = DATA.glossary.filter((item) => normalize(`${item.term} ${item.definition}`).includes(search));
    list.innerHTML = filtered.length ? filtered.map((item) => `<article class="glossary-item"><h2>${escapeHtml(item.term)}</h2><p>${escapeHtml(item.definition)}</p></article>`).join('') : `<div class="empty-state">Термин не найден.</div>`;
  }
  input?.addEventListener('input', draw);
  draw();
}

function renderPatches() {
  const list = qs('#patchList');
  if (!list) return;
  list.innerHTML = DATA.patches.map((patch) => `
    <article class="timeline-item">
      <div class="timeline-version">${escapeHtml(patch.version)}</div>
      <div class="timeline-content">
        <p class="eyebrow">${escapeHtml(patch.date)}</p>
        <h2>${escapeHtml(patch.title)}</h2>
        <ul>${patch.points.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul>
      </div>
    </article>`).join('');
}

setupMenu();
setupTheme();
renderHome();
renderHeroes();
renderHeroDetails();
renderItems();
renderMechanics();
renderGuides();
renderGlossary();
renderPatches();
