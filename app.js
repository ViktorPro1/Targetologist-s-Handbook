'use strict';

// ===================== PWA SERVICE WORKER =====================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(() => { });
    });
}

// ===================== SECTION NAVIGATION =====================
const tabs = document.querySelectorAll('.tab');
const sections = document.querySelectorAll('.section');

function activateSection(id) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.section === id));
    sections.forEach(s => s.classList.toggle('active', s.id === `section-${id}`));
    window.scrollTo({ top: 0, behavior: 'instant' });
}

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        activateSection(tab.dataset.section);
        closeSearch();
    });
});

// ===================== SEARCH =====================
const searchToggle = document.getElementById('searchToggle');
const searchBar = document.getElementById('searchBar');
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');
const searchResults = document.getElementById('searchResults');

searchToggle.addEventListener('click', () => {
    const isOpen = searchBar.classList.toggle('open');
    if (isOpen) {
        searchInput.focus();
    } else {
        closeSearch();
    }
});

searchClear.addEventListener('click', closeSearch);

function closeSearch() {
    searchBar.classList.remove('open');
    searchInput.value = '';
    searchResults.style.display = 'none';
    searchResults.innerHTML = '';
}

searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) {
        searchResults.style.display = 'none';
        searchResults.innerHTML = '';
        return;
    }
    runSearch(q);
});

function runSearch(q) {
    const cards = document.querySelectorAll('.card[data-tags]');
    const results = [];

    cards.forEach(card => {
        const tags = card.dataset.tags || '';
        const headEl = card.querySelector('h3');
        const title = headEl ? headEl.textContent : '';
        const text = card.textContent;
        const sectionEl = card.closest('.section');
        const sectionId = sectionEl ? sectionEl.id.replace('section-', '') : '';

        if (
            tags.includes(q) ||
            title.toLowerCase().includes(q) ||
            text.toLowerCase().includes(q)
        ) {
            results.push({ card, title, sectionId });
        }
    });

    const sectionLabels = {
        meta: 'Meta Ads',
        google: 'Google Ads',
        tiktok: 'TikTok Ads',
        metrics: 'Метрики',
        checklists: 'Чеклісти',
        lifehacks: 'Лайфхаки'
    };

    if (!results.length) {
        searchResults.innerHTML = '<p class="no-results">Нічого не знайдено</p>';
    } else {
        searchResults.innerHTML = results.map((r, i) => `
      <div class="search-result-item" data-index="${i}">
        <h4>${r.title}</h4>
        <span class="result-section">${sectionLabels[r.sectionId] || r.sectionId}</span>
      </div>
    `).join('');

        searchResults.querySelectorAll('.search-result-item').forEach((el, i) => {
            el.addEventListener('click', () => {
                const { card, sectionId } = results[i];
                closeSearch();
                activateSection(sectionId);
                setTimeout(() => {
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    card.style.borderColor = 'var(--accent)';
                    setTimeout(() => { card.style.borderColor = ''; }, 1500);
                }, 50);
            });
        });
    }

    searchResults.style.display = 'block';
}

// ===================== BOOKMARKS =====================
const bookmarksToggle = document.getElementById('bookmarksToggle');
const bookmarksModal = document.getElementById('bookmarksModal');
const bookmarksClose = document.getElementById('bookmarksClose');
const bookmarksList = document.getElementById('bookmarksList');
const bookmarkBadge = document.getElementById('bookmarkBadge');

let bookmarks = JSON.parse(localStorage.getItem('tpro_bookmarks') || '[]');

function saveBookmarks() {
    localStorage.setItem('tpro_bookmarks', JSON.stringify(bookmarks));
}

function updateBadge() {
    if (bookmarks.length > 0) {
        bookmarkBadge.textContent = bookmarks.length;
        bookmarkBadge.style.display = 'flex';
    } else {
        bookmarkBadge.style.display = 'none';
    }
}

function getCardId(card) {
    const h3 = card.querySelector('h3');
    return h3 ? h3.textContent.trim() : card.dataset.tags;
}

function initBookmarkButtons() {
    document.querySelectorAll('.bookmark-btn').forEach(btn => {
        const card = btn.closest('.card');
        const id = getCardId(card);
        if (bookmarks.includes(id)) {
            btn.textContent = '★';
            btn.classList.add('active');
        }

        btn.addEventListener('click', () => {
            const idx = bookmarks.indexOf(id);
            if (idx === -1) {
                bookmarks.push(id);
                btn.textContent = '★';
                btn.classList.add('active');
            } else {
                bookmarks.splice(idx, 1);
                btn.textContent = '☆';
                btn.classList.remove('active');
            }
            saveBookmarks();
            updateBadge();
        });
    });
}

function renderBookmarks() {
    if (!bookmarks.length) {
        bookmarksList.innerHTML = '<p class="empty-state">Додай картку в закладки — натисни ☆</p>';
        return;
    }

    const allCards = document.querySelectorAll('.card');
    const cardMap = {};
    allCards.forEach(c => { cardMap[getCardId(c)] = c; });

    bookmarksList.innerHTML = bookmarks.map(id => `
    <div class="bookmark-card-item" data-id="${encodeURIComponent(id)}">
      <span>${id}</span>
      <button class="bookmark-remove" title="Видалити">✕</button>
    </div>
  `).join('');

    bookmarksList.querySelectorAll('.bookmark-card-item').forEach(el => {
        const id = decodeURIComponent(el.dataset.id);

        el.addEventListener('click', e => {
            if (e.target.classList.contains('bookmark-remove')) return;
            const card = cardMap[id];
            if (!card) return;
            const sectionEl = card.closest('.section');
            const sectionId = sectionEl ? sectionEl.id.replace('section-', '') : '';
            closeBookmarks();
            activateSection(sectionId);
            setTimeout(() => {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                card.style.borderColor = 'var(--accent)';
                setTimeout(() => { card.style.borderColor = ''; }, 1500);
            }, 100);
        });

        el.querySelector('.bookmark-remove').addEventListener('click', () => {
            const idx = bookmarks.indexOf(id);
            if (idx !== -1) bookmarks.splice(idx, 1);
            saveBookmarks();
            updateBadge();
            // sync button
            const card = cardMap[id];
            if (card) {
                const btn = card.querySelector('.bookmark-btn');
                if (btn) { btn.textContent = '☆'; btn.classList.remove('active'); }
            }
            renderBookmarks();
        });
    });
}

function openBookmarks() {
    renderBookmarks();
    bookmarksModal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeBookmarks() {
    bookmarksModal.classList.remove('open');
    document.body.style.overflow = '';
}

bookmarksToggle.addEventListener('click', openBookmarks);
bookmarksClose.addEventListener('click', closeBookmarks);
bookmarksModal.addEventListener('click', e => {
    if (e.target === bookmarksModal) closeBookmarks();
});

// ===================== CHECKLISTS PERSISTENCE =====================
function initChecklists() {
    document.querySelectorAll('.checklist').forEach(cl => {
        const id = cl.id;
        if (!id) return;
        const saved = JSON.parse(localStorage.getItem(`tpro_cl_${id}`) || '[]');

        const inputs = cl.querySelectorAll('input[type="checkbox"]');
        inputs.forEach((inp, i) => {
            if (saved[i]) inp.checked = true;
            inp.addEventListener('change', () => {
                const state = Array.from(inputs).map(x => x.checked);
                localStorage.setItem(`tpro_cl_${id}`, JSON.stringify(state));
            });
        });
    });
}

// ===================== PWA INSTALL PROMPT =====================
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallBanner();
});

function showInstallBanner() {
    if (localStorage.getItem('tpro_install_dismissed')) return;

    const banner = document.createElement('div');
    banner.className = 'install-banner';
    banner.innerHTML = `
    <p><strong>Встанови Target Pro</strong> — працює офлайн</p>
    <button class="install-btn">Встановити</button>
    <button class="install-dismiss">✕</button>
  `;

    banner.querySelector('.install-btn').addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            banner.remove();
        }
        deferredPrompt = null;
    });

    banner.querySelector('.install-dismiss').addEventListener('click', () => {
        localStorage.setItem('tpro_install_dismissed', '1');
        banner.remove();
    });

    document.body.appendChild(banner);
}

// ===================== KEYBOARD SHORTCUTS =====================
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeSearch();
        closeBookmarks();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchBar.classList.add('open');
        searchInput.focus();
    }
});

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
    initBookmarkButtons();
    updateBadge();
    initChecklists();
});