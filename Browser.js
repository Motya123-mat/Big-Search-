// Простые утилиты браузера
console.log('🌐 Утилиты браузера загружены (упрощенная версия)');

// Минимальная версия утилит
const BrowserUtils = {
    // Получить информацию о браузере
    getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';
        let os = 'Unknown';
        
        // Определение браузера
        if (ua.includes('Chrome')) browser = 'Chrome';
        else if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('Safari')) browser = 'Safari';
        else if (ua.includes('Edge')) browser = 'Edge';
        
        // Определение ОС
        if (ua.includes('Android')) os = 'Android';
        else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
        else if (ua.includes('Windows')) os = 'Windows';
        else if (ua.includes('Mac')) os = 'macOS';
        else if (ua.includes('Linux')) os = 'Linux';
        
        return {
            browser: browser,
            os: os,
            isMobile: /Android|iPhone|iPad/i.test(ua),
            language: navigator.language || 'ru-RU'
        };
    },
    
    // Проверить поддержку функций
    checkSupport() {
        return {
            localStorage: !!window.localStorage,
            geolocation: 'geolocation' in navigator,
            online: navigator.onLine
        };
    },
    
    // Открыть URL безопасно
    openUrl(url) {
        try {
            window.open(url, '_blank');
            return true;
        } catch (e) {
            console.error('Ошибка при открытии URL:', e);
            return false;
        }
    }
};

// Экспортируем для использования
window.BrowserUtils = BrowserUtils;

// Выводим информацию в консоль
const info = BrowserUtils.getBrowserInfo();
const support = BrowserUtils.checkSupport();

console.log('📱 Информация о браузере:', info);
console.log('🔧 Поддержка функций:', support);