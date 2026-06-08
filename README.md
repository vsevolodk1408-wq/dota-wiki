# DotaWiki

Готовый статический сайт-wiki по Dota 2 на HTML/CSS/JS.

## Что есть внутри

- `index.html` — главная страница.
- `heroes.html` — база героев с поиском, фильтрами и избранным.
- `hero.html?hero=axe` — отдельная страница героя.
- `items.html` — база предметов.
- `mechanics.html` — ключевые игровые механики.
- `guides.html` — обучающие мини-гайды.
- `glossary.html` — словарь терминов.
- `patches.html` — страница под заметки о патчах.
- `sources.html` — источники и инструкция по публикации.
- `js/data.js` — вся база данных сайта.
- `js/app.js` — логика поиска, фильтров, избранного и отрисовки карточек.
- `css/style.css` — дизайн сайта.

## Как запустить локально

Вариант 1: просто открой `index.html` в браузере.

Вариант 2: через локальный сервер:

```bash
cd dotawiki_full_site
python -m http.server 8000
```

Затем открой:

```text
http://localhost:8000
```

## Как добавить героя

Открой `js/data.js` и добавь новый объект в массив `heroes`:

```js
{
  slug: 'hero-name',
  name: 'Hero Name',
  attribute: 'Сила',
  complexity: 'Средняя',
  roles: ['Керри'],
  tagline: 'Короткое описание.',
  description: 'Полное описание.',
  abilities: ['Spell 1', 'Spell 2', 'Spell 3', 'Ultimate'],
  items: ['Black King Bar'],
  strengths: ['Сильная сторона'],
  weaknesses: ['Слабая сторона'],
  tips: ['Совет']
}
```

## Как залить сайт в интернет

Самый простой способ — GitHub Pages:

1. Создай репозиторий на GitHub.
2. Загрузи файлы из этой папки в корень репозитория.
3. Открой `Settings → Pages`.
4. Source: `Deploy from a branch`.
5. Branch: `main`, folder: `/root`.
6. GitHub выдаст публичную ссылку.

## Важно

Это учебный фан-проект. Он не является официальным сайтом Dota 2 и не связан с Valve. Точные значения способностей, цены предметов и патчи нужно проверять перед публикацией.
