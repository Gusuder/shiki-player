import './popup.css';

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

// UI Elements
const els = {
  playerSource: document.getElementById('playerSource') as HTMLSelectElement,
  autoplay: document.getElementById('autoplay') as HTMLInputElement,
  kodikVoice: document.getElementById('kodikVoice') as HTMLSelectElement,
  status: document.getElementById('status') as HTMLDivElement,
  statusText: document.getElementById('statusText') as HTMLSpanElement
};

// Загрузка
document.addEventListener('DOMContentLoaded', () => {
  // @ts-ignore
  chrome.storage.sync.get(defaultSettings, (items: Settings) => {
    els.playerSource.value = items.playerSource;
    els.autoplay.checked = items.autoplay;
    els.kodikVoice.value = items.kodikVoice;
  });
});

// Авто-сохранение при любом изменении
const inputs = [els.playerSource, els.autoplay, els.kodikVoice];

inputs.forEach(input => {
  input.addEventListener('change', () => {
    const settings: Settings = {
      playerSource: els.playerSource.value,
      autoplay: els.autoplay.checked,
      kodikVoice: els.kodikVoice.value
    };
    save(settings);
  });
});

function save(settings: Settings) {
  // @ts-ignore
  chrome.storage.sync.set(settings, () => {
    showStatus('Настройки сохранены');
  });
}

function showStatus(msg: string) {
  els.statusText.textContent = msg;
  els.status.classList.add('saved');
  
  setTimeout(() => {
    els.statusText.textContent = 'Готов к работе';
    els.status.classList.remove('saved');
  }, 1500);
}
