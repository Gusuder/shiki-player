function getAnimeData() {
    const locationPath = window.location.pathname;
    const matches = locationPath.match(/\/animes\/[a-z]*\/?(\d+)/);
    const id = matches ? matches[1] : null;

    let title = document.querySelector('h1')?.innerText?.split('/')[0]?.trim();
    if (title) {
        title = title.replace(/TV-\d+/, '').trim();
    }

    return { id, title };
}

function initPlayer() {
    const { id, title } = getAnimeData();
    if (!id) return;

    const targetBlock = document.querySelector('.l-content .block') || 
                        document.querySelector('.c-info-right') || 
                        document.body;
    
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'margin: 20px 0; background: #1a1a1a; border-radius: 4px; padding: 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.3);';
    
    const button = document.createElement('div');
    button.className = 'b-link_button dark';
    button.innerText = '▶ Смотреть онлайн';
    button.style.cssText = 'width: 100%; text-align: center; cursor: pointer; padding: 12px; font-weight: 600; font-size: 15px; border-radius: 3px; box-sizing: border-box;';
    
    wrapper.appendChild(button);

    const playerContainer = document.createElement('div');
    playerContainer.className = 'kodik_player'; 
    playerContainer.dataset.shikimoriId = id; 
    playerContainer.dataset.title = title;    
    playerContainer.dataset.width = "100%";
    playerContainer.dataset.height = "500";
    playerContainer.style.display = 'none';
    
    wrapper.appendChild(playerContainer);

    if (targetBlock.firstChild) {
        targetBlock.insertBefore(wrapper, targetBlock.firstChild);
    } else {
        targetBlock.appendChild(wrapper);
    }

    button.addEventListener('click', function() {
        button.innerText = 'Загрузка...';
        button.style.opacity = '0.8';
        button.style.cursor = 'default';
        
        playerContainer.style.display = 'block';

        const widgetSources = [
            '//kodik.info/add.js',
            '//kodik.biz/add.js', 
            '//kodik.cc/add.js'
        ];
        
        let isLoaded = false;
        
        widgetSources.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => {
                if (!isLoaded) {
                    isLoaded = true;
                    button.style.display = 'none';
                }
            };
            document.body.appendChild(script);
        });

        setTimeout(() => {
            if (playerContainer.innerHTML.trim() === '') {
                const iframe = document.createElement('iframe');
                iframe.src = `https://kodik.info/find-player?shikimoriID=${id}`;
                iframe.width = '100%';
                iframe.height = '500';
                iframe.frameBorder = '0';
                iframe.allow = 'autoplay; fullscreen';
                
                playerContainer.innerHTML = '';
                playerContainer.appendChild(iframe);
                button.style.display = 'none';
            }
        }, 4000);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlayer);
} else {
    initPlayer();
}
