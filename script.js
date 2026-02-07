// Конфигурация поисковых систем
const SEARCH_ENGINES = {
    google: {
        name: 'Google',
        url: 'https://www.google.com/search?q=',
        icon: 'fab fa-google',
        color: '#4285f4'
    },
    yandex: {
        name: 'Yandex',
        url: 'https://yandex.ru/search/?text=',
        icon: 'yandex-icon',
        color: '#ff0000'
    },
    bing: {
        name: 'Microsoft Bing',
        url: 'https://www.bing.com/search?q=',
        icon: 'fab fa-microsoft',
        color: '#0078d4'
    },
    duckduckgo: {
        name: 'DuckDuckGo',
        url: 'https://duckduckgo.com/?q=',
        icon: 'fas fa-search',
        color: '#de5833'
    }
};

// Текущее состояние приложения
const appState = {
    currentEngine: 'google',
    history: [],
    searchCount: 0,
    isInitialized: false
};

// Инициализация приложения
function initializeApp() {
    console.log('🚀 Big Search запускается...');
    
    // Загружаем данные
    loadData();
    
    // Настраиваем обработчики событий
    setupEventListeners();
    
    // Обновляем интерфейс
    updateUI();
    
    // Фокусируемся на поле ввода
    setTimeout(() => {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.focus();
    }, 100);
    
    appState.isInitialized = true;
    console.log('✅ Big Search готов к работе');
}

// Загрузка данных из localStorage
function loadData() {
    try {
        // Загружаем историю
        const savedHistory = localStorage.getItem('bigSearch_history');
        if (savedHistory) {
            appState.history = JSON.parse(savedHistory);
        }
        
        // Загружаем выбранную поисковую систему
        const savedEngine = localStorage.getItem('bigSearch_engine');
        if (savedEngine && SEARCH_ENGINES[savedEngine]) {
            appState.currentEngine = savedEngine;
        }
        
        // Загружаем счетчик поисков
        const savedCount = localStorage.getItem('bigSearch_count');
        if (savedCount) {
            appState.searchCount = parseInt(savedCount);
        }
        
    } catch (error) {
        console.warn('Не удалось загрузить данные:', error);
        // Создаем пустые данные
        appState.history = [];
        appState.currentEngine = 'google';
        appState.searchCount = 0;
    }
}

// Сохранение данных в localStorage
function saveData() {
    try {
        localStorage.setItem('bigSearch_history', JSON.stringify(appState.history));
        localStorage.setItem('bigSearch_engine', appState.currentEngine);
        localStorage.setItem('bigSearch_count', appState.searchCount.toString());
    } catch (error) {
        console.warn('Не удалось сохранить данные:', error);
        showNotification('Не удалось сохранить данные', 'error');
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    console.log('⚙ Настройка обработчиков событий...');
    
    // Основная кнопка поиска
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        console.log('✅ Кнопка поиска подключена');
    }
    
    // Поле ввода поиска
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        // Поиск по нажатию Enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Кнопка очистки
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                searchInput.value = '';
                searchInput.focus();
                clearBtn.style.display = 'none';
            });
            
            // Показывать/скрывать кнопку очистки
            searchInput.addEventListener('input', function() {
                clearBtn.style.display = this.value.trim() ? 'block' : 'none';
            });
            
            // Изначальное состояние
            clearBtn.style.display = searchInput.value.trim() ? 'block' : 'none';
        }
        
        console.log('✅ Поле ввода подключено');
    }
    
    // Выбор поисковой системы
    document.querySelectorAll('.engine-option').forEach(option => {
        option.addEventListener('click', function() {
            const engine = this.getAttribute('data-engine');
            if (engine && SEARCH_ENGINES[engine]) {
                selectEngine(engine);
            }
        });
    });
    
    // Быстрые запросы
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const query = this.getAttribute('data-query');
            if (query && searchInput) {
                searchInput.value = query;
                performSearch();
            }
        });
    });
    
    // Очистка истории
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', function() {
            if (appState.history.length > 0 && confirm('Очистить всю историю поиска?')) {
                clearHistory();
            }
        });
        console.log('✅ Кнопка очистки истории подключена');
    }
    
    // Клик по истории
    document.addEventListener('click', function(e) {
        const historyItem = e.target.closest('.history-item');
        if (historyItem) {
            const query = historyItem.querySelector('.history-query').textContent;
            if (query && searchInput) {
                searchInput.value = query;
                performSearch();
            }
        }
    });
    
    console.log('✅ Все обработчики событий настроены');
}

// Выполнить поиск
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) {
        showNotification('Ошибка: поле поиска не найдено', 'error');
        return;
    }
    
    const query = searchInput.value.trim();
    
    // Проверка на пустой запрос
    if (!query) {
        showNotification('Введите поисковый запрос', 'warning');
        searchInput.focus();
        return;
    }
    
    // Проверка на слишком длинный запрос
    if (query.length > 200) {
        showNotification('Запрос слишком длинный (максимум 200 символов)', 'warning');
        return;
    }
    
    console.log(`🔍 Поиск: "${query}" в ${appState.currentEngine}`);
    
    // Получаем конфигурацию поисковой системы
    const engine = SEARCH_ENGINES[appState.currentEngine];
    if (!engine) {
        showNotification('Ошибка: неизвестная поисковая система', 'error');
        return;
    }
    
    // Формируем URL для поиска
    const searchUrl = engine.url + encodeURIComponent(query);
    console.log(`🔗 URL: ${searchUrl}`);
    
    // Пытаемся открыть в новой вкладке
    try {
        const newWindow = window.open(searchUrl, '_blank');
        
        // Проверяем, не заблокировал ли браузер открытие
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            // Если открытие заблокировано, показываем ссылку
            showNotification('Разрешите всплывающие окна или нажмите на ссылку в уведомлении', 'warning');
            
            // Создаем временное уведомление с ссылкой
            const linkNotification = document.createElement('div');
            linkNotification.className = 'notification show';
            linkNotification.style.backgroundColor = '#4285f4';
            linkNotification.innerHTML = `
                <a href="${searchUrl}" target="_blank" 
                   style="color: white; text-decoration: underline;">
                   Нажмите здесь для поиска
                </a>
            `;
            document.body.appendChild(linkNotification);
            
            setTimeout(() => {
                if (linkNotification.parentNode) {
                    linkNotification.parentNode.removeChild(linkNotification);
                }
            }, 5000);
            
        } else {
            // Фокусируемся на новой вкладке
            try {
                newWindow.focus();
            } catch (e) {
                // Игнорируем ошибку фокусировки
            }
        }
        
        // Добавляем в историю
        addToHistory(query, appState.currentEngine);
        
        // Увеличиваем счетчик поисков
        appState.searchCount++;
        
        // Сохраняем данные
        saveData();
        
        // Обновляем интерфейс
        updateUI();
        
        // Очищаем поле ввода
        searchInput.value = '';
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) clearBtn.style.display = 'none';
        
        console.log('✅ Поиск выполнен успешно');
        
    } catch (error) {
        console.error('❌ Ошибка при открытии поиска:', error);
        showNotification('Ошибка при выполнении поиска', 'error');
    }
}

// Выбрать поисковую систему
function selectEngine(engineId) {
    if (!SEARCH_ENGINES[engineId]) {
        console.error(`Неизвестная поисковая система: ${engineId}`);
        return;
    }
    
    // Обновляем состояние
    appState.currentEngine = engineId;
    
    // Обновляем интерфейс
    document.querySelectorAll('.engine-option').forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-engine') === engineId) {
            option.classList.add('active');
        }
    });
    
    // Сохраняем выбор
    saveData();
    
    // Показываем уведомление
    showNotification(`Выбрана ${SEARCH_ENGINES[engineId].name}`, 'info');
    
    console.log(`✅ Выбрана поисковая система: ${engineId}`);
}

// Добавить в историю
function addToHistory(query, engineId) {
    const historyItem = {
        query: query,
        engine: engineId,
        time: new Date().toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        }),
        timestamp: Date.now()
    };
    
    // Добавляем в начало массива
    appState.history.unshift(historyItem);
    
    // Ограничиваем историю 20 записями
    if (appState.history.length > 20) {
        appState.history = appState.history.slice(0, 20);
    }
    
    // Сохраняем историю
    saveData();
}

// Очистить историю
function clearHistory() {
    appState.history = [];
    saveData();
    updateHistoryList();
    showNotification('История очищена', 'success');
}

// Обновить интерфейс
function updateUI() {
    updateHistoryList();
}

// Обновить список истории
function updateHistoryList() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    if (appState.history.length === 0) {
        historyList.innerHTML = `
            <div class="history-empty">
                <i class="fas fa-search"></i>
                <p>История поиска пуста</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    appState.history.forEach((item, index) => {
        const engine = SEARCH_ENGINES[item.engine] || SEARCH_ENGINES.google;
        html += `
            <div class="history-item" data-index="${index}">
                <div class="history-query">${escapeHtml(item.query)}</div>
                <div class="history-info">
                    <span>${engine.name}</span>
                    <span>•</span>
                    <span>${item.time}</span>
                </div>
            </div>
        `;
    });
    
    historyList.innerHTML = html;
}

// Показать уведомление
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    // Устанавливаем цвет в зависимости от типа
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196F3'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    notification.textContent = message;
    notification.classList.add('show');
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Экранирование HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initializeApp);

// Обработка ошибок
window.addEventListener('error', function(event) {
    console.error('❌ Глобальная ошибка:', event.error);
    
    if (appState.isInitialized) {
        showNotification('Произошла ошибка. Попробуйте обновить страницу.', 'error');
    }
});

// Обработка отключения от сети
window.addEventListener('offline', function() {
    if (appState.isInitialized) {
        showNotification('Нет подключения к интернету', 'warning');
    }
});

window.addEventListener('online', function() {
    if (appState.isInitialized) {
        showNotification('Подключение к интернету восстановлено', 'success');
    }
});