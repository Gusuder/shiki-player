// Интерфейс настроек
interface Settings {
  playerSource: string;
  autoplay: boolean;
  kodikVoice: string;
}

// Значения по умолчанию
const defaultSettings: Settings = {
  playerSource: 'kodik',
  autoplay: false,
  kodikVoice: 'any'
};

function init() {
  const currentUrl = window.location.href;
  // Работаем только на страницах аниме
  if (!currentUrl.includes('/animes/')) return;

  // Если кнопка уже есть — не дублируем
  if (document.getElementById('shiki-player-btn')) return;

  // Ищем главный контейнер страницы, чтобы вставить кнопку в самый верх
  const pageContainer = document.querySelector('.l-page');
  
  if (pageContainer) {
    createWideButton(pageContainer);
  }
}

function createWideButton(target: Element) {
  const container = document.createElement('div');
  container.className = 'shiki-player-container';
  
  // Стили контейнера (широкая полоса)
  container.style.width = '100%';
  container.style.background = '#1a1a1a'; // Темный фон
  container.style.marginBottom = '20px'; // Отступ от контента снизу
  container.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
  container.style.borderRadius = '3px';
  container.style.overflow = 'hidden';

  const btn = document.createElement('div');
  btn.id = 'shiki-player-btn';
  
  // Стили кнопки
  btn.style.width = '100%';
  btn.style.padding = '16px 0';
  btn.style.textAlign = 'center';
  btn.style.cursor = 'pointer';
  btn.style.color = '#fff'; // Белый текст
  btn.style.fontWeight = '600';
  btn.style.fontSize = '18px';
  btn.style.display = 'flex';
  btn.style.alignItems = 'center';
  btn.style.justifyContent = 'center';
  btn.style.gap = '10px';
  btn.style.transition = 'background 0.2s ease';
  
  // Текст с иконкой
  btn.innerHTML = '<span>▶</span> Смотреть онлайн';
  
  // Ховер эффект (светлеет при наведении)
  btn.onmouseover = () => {
    btn.style.background = '#2a2a2a';
  };
  btn.onmouseout = () => {
    btn.style.background = 'transparent';
  };
  
  btn.onclick = () => loadPlayer(container);

  container.appendChild(btn);
  
  // Вставляем кнопку в самое начало страницы (prepend)
  target.prepend(container);
}

async function loadPlayer(container: HTMLElement) {
  // 1. Читаем настройки из Popup
  // @ts-ignore
  const settings = await chrome.storage.sync.get(defaultSettings) as Settings;
  
  // 2. Получаем ID и название аниме со страницы
  const animeId = window.location.pathname.split('/')[2].split('-')[0];
  const title = document.querySelector('h1')?.textContent?.split('/')[0].trim() || 'Anime';

  let playerUrl = '';

  // 3. Выбираем плеер на основе настроек
  if (settings.playerSource === 'kodik') {
    playerUrl = `https://kodik.cc/find-player?shikimoriID=${animeId}&title=${encodeURIComponent(title)}&types=anime,anime-serial`;
    
    // Добавляем параметры (озвучка, автоплей)
    if (settings.kodikVoice !== 'any') {
      playerUrl += `&translation=${settings.kodikVoice}`;
    }
    if (settings.autoplay) {
      playerUrl += `&autoplay=true`;
    }
  } else {
    // В будущем здесь будут Alloha/Turbo
    // Пока что фоллбэк на Kodik
    playerUrl = `https://kodik.cc/find-player?shikimoriID=${animeId}`;
  }

  // 4. Заменяем кнопку на iframe с видео
  // Используем aspect-ratio для адаптивности 16:9
  container.innerHTML = `
    <div style="position: relative; width: 100%; padding-bottom: 56.25%; background: #000;">
      <iframe 
        src="${playerUrl}" 
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
        allowfullscreen
        allow="autoplay; encrypted-media; fullscreen">
      </iframe>
    </div>
  `;
}

// 5. Запуск (учитываем Turbolinks навигацию Shikimori)
document.addEventListener('DOMContentLoaded', init);
document.addEventListener('page:load', init);
document.addEventListener('turbolinks:load', init);

// Страховка (если события не сработали)
setTimeout(init, 1000);
