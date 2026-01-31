(function() {
    'use strict'; // Включает строгий режим для избежания простых ошибок

    // 1. Функция получения ID аниме из URL
    function getAnimeId() {
        // Ищем число после /animes/XXXX-name
        const matches = window.location.pathname.match(/\/animes\/[a-z]*\/?(\d+)/);
        return matches ? matches[1] : null;
    }

    // 2. Функция поиска места для вставки (Улучшенная)
    function findInjectionPoint() {
        // Приоритетные селекторы, куда можно вставить плеер
        const selectors = [
            '.l-content .block', // Основной блок контента
            '.c-info-right',     // Правая колонка (резерв)
            'body'               // Самый крайний случай
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) return element;
        }
        return null;
    }

    function createInterface() {
        // Проверка: запускаем только если нашли ID
        const animeId = getAnimeId();
        if (!animeId) return;

        // Проверка: не создан ли уже плеер (чтобы не дублировать при SPA переходах)
        if (document.getElementById('shiki-player-wrapper')) return;

        const target = findInjectionPoint();
        if (!target) return;

        // Создаем элементы
        const wrapper = document.createElement('div');
        wrapper.id = 'shiki-player-wrapper'; // ID для проверки уникальности
        wrapper.classList.add('shiki-player-wrapper');
        
        const button = document.createElement('div');
        // Используем стандартные классы Shikimori + наш класс
        button.className = 'b-link_button dark shiki-player-btn';
        button.textContent = '▶ Смотреть онлайн';
        
        const playerContainer = document.createElement('div');
        playerContainer.classList.add('shiki-player-container');

        // Собираем структуру
        wrapper.appendChild(button);
        wrapper.appendChild(playerContainer);

        // Вставляем в начало целевого блока
        if (target.firstChild) {
            target.insertBefore(wrapper, target.firstChild);
        } else {
            target.appendChild(wrapper);
        }

        // Обработчик клика
        button.addEventListener('click', function() {
            // Переключаем классы видимости
            button.classList.add('is-active');
            playerContainer.classList.add('is-visible');
            
            // Ленивая загрузка iframe (только после клика)
            if (!playerContainer.querySelector('iframe')) {
                const iframe = document.createElement('iframe');
                iframe.src = `https://kodik.info/find-player?shikimoriID=${animeId}`;
                iframe.classList.add('shiki-player-iframe');
                iframe.allow = 'autoplay; fullscreen';
                playerContainer.appendChild(iframe);
            }
        });
    }

    // Запуск скрипта
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createInterface);
    } else {
        createInterface();
    }
})();
