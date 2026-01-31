// Импортируем стили, Vite сам вставит их в страницу!
import './style.css'; 

// Интерфейс для нашей кнопки (не обязательно, но полезно для понимания)
interface PlayerUI {
    wrapper: HTMLDivElement;
    button: HTMLDivElement;
    container: HTMLDivElement;
}

function getAnimeId(): string | null {
    const matches = window.location.pathname.match(/\/animes\/[a-z]*\/?(\d+)/);
    return matches ? matches[1] : null;
}

function findInjectionPoint(): Element | null {
    const selectors = [
        '.l-content .block',
        '.c-info-right',
        'body'
    ];

    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) return element;
    }
    return null;
}

function createPlayerUI(animeId: string): PlayerUI {
    const wrapper = document.createElement('div');
    wrapper.id = 'shiki-player-wrapper';
    wrapper.classList.add('shiki-player-wrapper');

    const button = document.createElement('div');
    button.className = 'b-link_button dark shiki-player-btn';
    button.textContent = '▶ Смотреть онлайн';

    const container = document.createElement('div');
    container.classList.add('shiki-player-container');

    // Логика клика
    button.addEventListener('click', () => {
        button.classList.add('is-active');
        container.classList.add('is-visible');

        if (!container.querySelector('iframe')) {
            const iframe = document.createElement('iframe');
            iframe.src = `https://kodik.info/find-player?shikimoriID=${animeId}`;
            iframe.classList.add('shiki-player-iframe');
            iframe.allow = 'autoplay; fullscreen';
            container.appendChild(iframe);
        }
    });

    wrapper.appendChild(button);
    wrapper.appendChild(container);

    return { wrapper, button, container };
}

function init() {
    const animeId = getAnimeId();
    if (!animeId) return;

    // TS знает, что getElementById может вернуть null
    if (document.getElementById('shiki-player-wrapper')) return;

    const target = findInjectionPoint();
    if (!target) return;

    const { wrapper } = createPlayerUI(animeId);

    if (target.firstChild) {
        target.insertBefore(wrapper, target.firstChild);
    } else {
        target.appendChild(wrapper);
    }
}

// Запуск
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
