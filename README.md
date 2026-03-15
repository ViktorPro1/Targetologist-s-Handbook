# Таргетолог Pro — PWA довідник

Статичний PWA-довідник для таргетолога. Працює офлайн, встановлюється як додаток на телефон або десктоп. Без фреймворків, без білд-тулів — чистий HTML + CSS + JS.

---

## Стек

- HTML5
- CSS3 (зовнішній файл `style.css`)
- Vanilla JS (зовнішній файл `app.js`)
- Service Worker (`sw.js`) — офлайн-режим і кешування
- Web App Manifest (`manifest.json`) — PWA встановлення

---

## Структура проекту

```
targetolog-pwa/
├── index.html        # Весь контент і розмітка
├── style.css         # Всі стилі
├── app.js            # Логіка: навігація, пошук, закладки, чеклісти, SW реєстрація
├── sw.js             # Service Worker
├── manifest.json     # PWA маніфест
├── icon-192.png      # Іконка 192×192
├── icon-512.png      # Іконка 512×512
└── README.md
```

---

## Розділи довідника

| Розділ | Що всередині |
|---|---|
| **Meta Ads** | Структура кампаній, CBO/ABO, аудиторії, Lookalike, Custom Audiences, Піксель, CAPI, формати оголошень, A/B тест, Learning Phase, плейсменти |
| **Google Ads** | Search / Display / Shopping / PMax / YouTube, типи відповідності КС, мінус-слова, Quality Score, стратегії ставок, розширення (assets) |
| **TikTok Ads** | Структура кампаній, таргетинг, Hook Rate, Spark Ads, технічні вимоги до відео, TikTok Pixel |
| **Метрики** | Формули CTR / CPM / CPC / CPA / ROAS / ROI / CVR, бенчмарки по нішах, Frequency, атрибуція, розбивки |
| **Чеклісти** | Запуск Meta кампанії, запуск Google кампанії, щотижневий аудит, онбординг нового клієнта |
| **Лайфхаки** | Ads Library, Post ID trick, перетин аудиторій, iOS 14+ / CAPI, naming convention, Auction Insights, Google Scripts, Broad+Smart Bidding, UTM-мітки, масштабування, лендинг, creative fatigue |

---

## Функціональність

**Навігація**
- Табова навігація між розділами
- Плавна анімація переходу між секціями

**Пошук**
- Пошук по всьому контенту в реальному часі
- Клік на результат — перехід до картки і підсвітка

**Закладки**
- Збереження карток в закладки через кнопку ☆
- Зберігаються в `localStorage` між сесіями
- Окремий модальний список з переходом до картки

**Чеклісти**
- Стан чекбоксів зберігається в `localStorage`
- Відновлюється при перезавантаженні

**PWA**
- Service Worker кешує всі файли при першому завантаженні
- Повний офлайн-режим після першого відкриття
- Банер встановлення (`beforeinstallprompt`)
- Маніфест з іконками для Home Screen

**Клавіатурні скорочення**
- `Ctrl+F` / `Cmd+F` — відкрити пошук
- `Escape` — закрити пошук або модал

---

## Запуск локально

Просто відкрий `index.html` через будь-який локальний сервер. Service Worker не працює без HTTP(S), тому `file://` не підійде.

```bash
# Варіант 1 — VS Code Live Server
# Встанови розширення Live Server, клік правою → "Open with Live Server"

# Варіант 2 — Python
python3 -m http.server 5500

# Варіант 3 — Node.js
npx serve .
```

Відкрий `http://localhost:5500` в браузері.

---

## Деплой

Проект статичний — деплоїться на будь-який статичний хостинг:

**Netlify** — перетягни папку проекту на [netlify.com/drop](https://app.netlify.com/drop)

**GitHub Pages:**
```bash
git init
git add .
git commit -m "init"
git branch -M main
git remote add origin https://github.com/username/targetolog-pwa.git
git push -u origin main
# Потім: Settings → Pages → Source: main / root
```

**Vercel:**
```bash
npx vercel .
```

---

## Встановлення як додаток

**Android (Chrome):**
Відкрий сайт → меню "⋮" → "Додати на головний екран"

**iOS (Safari):**
Відкрий сайт → кнопка "Поділитись" → "На початковий екран"

**Десктоп (Chrome/Edge):**
Відкрий сайт → іконка встановлення в адресному рядку

---

## Розширення контенту

Весь контент знаходиться в `index.html` у вигляді карток з класом `.card`. Щоб додати нову картку — скопіюй структуру існуючої:

```html
<div class="card" data-tags="теги для пошуку">
  <div class="card-head">
    <span class="card-icon">🎯</span>
    <h3>Заголовок картки</h3>
    <button class="bookmark-btn" aria-label="Додати в закладки">☆</button>
  </div>
  <ul>
    <li><strong>Пункт</strong> — опис.</li>
  </ul>
  <div class="tip">💡 Порада або нюанс.</div>
</div>
```

Атрибут `data-tags` — ключові слова через пробіл, по яких працює пошук.

---

## Автор

Самостійна розробка. Проект відкритий для доповнень і покращень.
