/**
 * Metro SPB Wiki - Main Script
 * Включает функционал для работы с Telegram WebApp, избранными станциями и анимациями
 */

// Основная функция инициализации приложения
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// Инициализация всех компонентов приложения
function initApp() {
    initLoadingScreen();
    initTelegramWebApp();
    setupServiceWorker();
    setupUI();
    loadUserPreferences();
    
    // Аналитика (если нужно)
    logPageView();
}

// ==================== Telegram WebApp Integration ====================
function initTelegramWebApp() {
    if (window.Telegram?.WebApp) {
        // Настройка WebApp
        Telegram.WebApp.expand(); // Развернуть на весь экран
        Telegram.WebApp.enableClosingConfirmation(); // Подтверждение при закрытии
        
        // Установка цвета заголовка в Telegram
        Telegram.WebApp.setHeaderColor('#e61e37');
        Telegram.WebApp.setBackgroundColor('#121212');
        
        // Настройка кнопки "Назад"
        setupBackButton();
        
        // Отправка данных в бота
        initDataSender();
        
        // Показываем кнопку меню, если нужно
        Telegram.WebApp.MainButton.setText('Открыть меню');
        Telegram.WebApp.MainButton.onClick(openMainMenu);
        Telegram.WebApp.MainButton.show();
    }
}

function setupBackButton() {
    if (!window.Telegram?.WebApp) return;
    
    Telegram.WebApp.BackButton.show();
    Telegram.WebApp.BackButton.onClick(() => {
        if (window.location.pathname.includes('line')) {
            window.location.href = 'index.html';
        } else {
            window.history.back();
        }
    });
}

function initDataSender() {
    window.sendToTelegram = (data) => {
        if (window.Telegram?.WebApp) {
            Telegram.WebApp.sendData(JSON.stringify(data));
        }
    };
}

function openMainMenu() {
    // Здесь можно реализовать открытие меню
    console.log('Main menu opened');
    sendToTelegram({ action: 'open_menu' });
}

// ==================== UI Functions ====================
function setupUI() {
    setupAnimations();
    setupFavoriteButtons();
    setupLineCards();
    setupStationCards();
    hideLoadingScreen();
}

function setupAnimations() {
    // Анимация появления элементов
    const animateElements = (selector, delay = 0.1) => {
        document.querySelectorAll(selector).forEach((el, i) => {
            el.style.animationDelay = `${i * delay}s`;
            el.classList.add('animate-in');
        });
    };
    
    animateElements('.line-card');
    animateElements('.station-card');
    animateElements('.feature-icon', 0.05);
}

function setupFavoriteButtons() {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleFavorite(this);
        });
    });
}

function toggleFavorite(btn) {
    const stationId = btn.dataset.stationId;
    const isFavorite = btn.classList.toggle('active');
    
    // Сохраняем в localStorage
    const favorites = JSON.parse(localStorage.getItem('metro-favorites')) || {};
    favorites[stationId] = isFavorite;
    localStorage.setItem('metro-favorites', JSON.stringify(favorites));
    
    // Анимация
    btn.style.transform = 'scale(1.3)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 300);
    
    // Отправляем данные в Telegram, если нужно
    if (window.Telegram?.WebApp) {
        sendToTelegram({
            action: 'toggle_favorite',
            stationId,
            isFavorite
        });
    }
}

function setupLineCards() {
    document.querySelectorAll('.line-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('a, .favorite-btn')) {
                this.querySelector('a')?.click();
            }
        });
    });
}

function setupStationCards() {
    // Дополнительные обработчики для карточек станций
    document.querySelectorAll('.station-card').forEach(card => {
        card.addEventListener('click', function() {
            // Можно реализовать подробный просмотр станции
            console.log('Station clicked:', this.dataset.stationId);
        });
    });
}

// ==================== Service Worker ====================
function setupServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful:', registration);
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed:', error);
                });
        });
    }
}

// ==================== User Preferences ====================
function loadUserPreferences() {
    loadFavorites();
    loadTheme();
}

function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('metro-favorites')) || {};
    Object.entries(favorites).forEach(([id, isFavorite]) => {
        const btn = document.querySelector(`.favorite-btn[data-station-id="${id}"]`);
        if (btn && isFavorite) btn.classList.add('active');
    });
}

function loadTheme() {
    const savedTheme = localStorage.getItem('metro-theme') || 'dark';
    document.body.classList.add(savedTheme);
}

// ==================== Loading Screen ====================
function initLoadingScreen() {
    // Показываем экран загрузки
    document.body.style.opacity = '0';
}

function hideLoadingScreen() {
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.querySelector('.loading-overlay')?.remove();
    }, 500);
}

// ==================== Analytics ====================
function logPageView() {
    // Здесь можно добавить аналитику
    console.log('Page viewed:', window.location.pathname);
}

// ==================== Utility Functions ====================
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

// Экспортируем функции для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initApp,
        toggleFavorite,
        sendToTelegram
    };
}