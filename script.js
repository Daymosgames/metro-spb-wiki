// Проверяем, открыто ли в Telegram WebApp
if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.expand(); // Разворачиваем на весь экран
    Telegram.WebApp.enableClosingConfirmation(); // Подтверждение выхода
}

// Можно добавить логику отправки данных в бота
function sendDataToBot(data) {
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.sendData(JSON.stringify(data));
    }
}
