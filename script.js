// Проверяем, открыто ли в Telegram WebApp
function initTelegramWebApp() {
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.expand();
        Telegram.WebApp.enableClosingConfirmation();
        
        // Устанавливаем цвет заголовка в соответствии с линией
        const lineColor = getComputedStyle(document.documentElement).getPropertyValue('--line-1');
        Telegram.WebApp.setHeaderColor(lineColor || '#e61e37');
        
        // Настраиваем кнопку "Назад"
        Telegram.WebApp.BackButton.show();
        Telegram.WebApp.BackButton.onClick(() => {
            if (window.location.pathname.endsWith('line1.html')) {
                window.location.href = 'index.html';
            } else {
                window.history.back();
            }
        });
    }
}

// Показываем контент после загрузки
function showContent() {
    document.body.style.opacity = '1';
    
    // Добавляем анимации для карточек станций
    const stationCards = document.querySelectorAll('.station-card');
    stationCards.forEach((card, index) => {
        card.style.animationDelay = `${0.1 * index}s`;
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initTelegramWebApp();
    setTimeout(showContent, 100);
});
