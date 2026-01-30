(function() {
    function getAnimeId() {
        const matches = window.location.pathname.match(/\/animes\/[a-z]*\/?(\d+)/);
        return matches ? matches[1] : null;
    }

    function createInterface() {
        const id = getAnimeId();
        if (!id) return;

        const target = document.querySelector('.l-content .block') || 
                       document.querySelector('.c-info-right') || 
                       document.body;
        
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'margin: 20px 0; background: #1a1a1a; border-radius: 4px; padding: 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.3);';
        
        const button = document.createElement('div');
        button.className = 'b-link_button dark';
        button.textContent = '▶ Смотреть онлайн';
        button.style.cssText = 'width: 100%; text-align: center; cursor: pointer; padding: 12px; font-weight: 600; font-size: 15px; border-radius: 3px; box-sizing: border-box;';
        
        const playerContainer = document.createElement('div');
        playerContainer.style.display = 'none';
        playerContainer.style.marginTop = '5px';
        playerContainer.style.background = '#000';
        playerContainer.style.borderRadius = '0 0 4px 4px';
        playerContainer.style.overflow = 'hidden';

        wrapper.appendChild(button);
        wrapper.appendChild(playerContainer);

        if (target.firstChild) {
            target.insertBefore(wrapper, target.firstChild);
        } else {
            target.appendChild(wrapper);
        }

        button.addEventListener('click', function() {
            button.style.display = 'none';
            playerContainer.style.display = 'block';
            
            const iframe = document.createElement('iframe');
            iframe.src = `https://kodik.info/find-player?shikimoriID=${id}`;
            iframe.style.cssText = 'width: 100%; height: 500px; border: 0; display: block;';
            iframe.allow = 'autoplay; fullscreen';
            
            playerContainer.appendChild(iframe);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createInterface);
    } else {
        createInterface();
    }
})();
