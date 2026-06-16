// Конфигурация подарков с моделями
const giftConfigs = {
    1: {
        name: 'Подарок 1',
        description: '🎁 Это пока у тебя нет настоящего!!! ✨',
        modelUrl: 'presents/vanity_table.glb',
        color: '#FFD700',
        arScale: '1 1 1'
    },
    2: {
        name: 'Подарок 2',
        description: '💎 Это чтобы можно было ездить!!! 🌟',
        modelUrl: 'presents/2017_Aston_Martin_Vanquish_Zagato_by_Ddiaz_Design.glb',
        color: '#4ECDC4',
        arScale: '0.8 0.8 0.8'
    },
    3: {
        name: 'Подарок 3',
        description: '🌟 Красивый домик!!! Если что, потом можно поменять на квартиру 🚀',
        modelUrl: 'presents/house_by_viking1.glb',
        color: '#45B7D1',
        arScale: '1.2 1.2 1.2'
    }
};

// Основное приложение
const App = {
    elements: {
        startScreen: document.getElementById('start-screen'),
        giftModal: document.getElementById('gift-modal'),
        giftModelViewer: document.getElementById('gift-model-viewer'),
        giftDescriptionText: document.getElementById('gift-description-text'),
        closeModal: document.getElementById('close-modal'),
        arViewBtn: document.getElementById('ar-view-btn'),
        giftCards: document.querySelectorAll('.gift-card')
    },

    currentGift: null,

    init() {
        this.setupEventListeners();
        this.setupModelViewer();
    },

    setupEventListeners() {
        // Обработчики для карточек подарков
        this.elements.giftCards.forEach(card => {
            card.addEventListener('click', () => {
                const giftId = card.dataset.gift;
                this.openGift(giftId);
            });
        });

        // Закрытие модального окна
        this.elements.closeModal.addEventListener('click', () => this.closeGift());

        // Кнопка AR просмотра
        this.elements.arViewBtn.addEventListener('click', () => this.startAR());

        // Закрытие по клику вне модального окна
        this.elements.giftModal.addEventListener('click', (e) => {
            if (e.target === this.elements.giftModal) {
                this.closeGift();
            }
        });

        // Обработка клавиши Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.elements.giftModal.classList.contains('hidden')) {
                this.closeGift();
            }
        });
    },

    setupModelViewer() {
        const modelViewer = this.elements.giftModelViewer;
        
        // Обработчики событий model-viewer
        modelViewer.addEventListener('load', () => {
            console.log('Модель загружена');
            this.hideLoading();
        });

        modelViewer.addEventListener('error', (error) => {
            console.error('Ошибка загрузки модели:', error);
            this.hideLoading();
            // Показываем заглушку если модель не загрузилась
            this.elements.giftDescriptionText.textContent += '\n\n(Модель временно недоступна, но ты все равно можешь попробовать AR режим!)';
        });

        modelViewer.addEventListener('ar-status', (event) => {
            const status = event.detail.status;
            console.log('AR статус:', status);
            
            if (status === 'session-started') {
                console.log('AR сессия началась');
            } else if (status === 'session-ended') {
                console.log('AR сессия завершена');
            } else if (status === 'not-supported') {
                alert('AR не поддерживается на вашем устройстве. Попробуйте открыть в Chrome на Android или Safari на iOS.');
            }
        });
    },

    async openGift(giftId) {
        this.currentGift = giftId;
        const gift = giftConfigs[giftId];
        
        this.showLoading();
        
        // Обновляем model-viewer
        const modelViewer = this.elements.giftModelViewer;
        modelViewer.src = gift.modelUrl;
        modelViewer.style.backgroundColor = gift.color;
        
        // Обновляем описание
        this.elements.giftDescriptionText.textContent = gift.description;
        
        // Показываем модальное окно
        this.elements.giftModal.classList.remove('hidden');
        
        // Запускаем анимацию появления
        setTimeout(() => {
            this.animateModalIn();
        }, 100);
    },

    closeGift() {
        this.animateModalOut(() => {
            this.elements.giftModal.classList.add('hidden');
            this.currentGift = null;
            
            // Очищаем модель
            const modelViewer = this.elements.giftModelViewer;
            modelViewer.src = '';
        });
    },

    startAR() {
        const modelViewer = this.elements.giftModelViewer;
        
        if (modelViewer.canActivateAR) {
            modelViewer.activateAR();
        } else {
            // Показываем инструкцию в зависимости от устройства
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const isAndroid = /Android/.test(navigator.userAgent);
            
            if (isIOS) {
                alert('📱 Чтобы посмотреть в AR:\n\n1. Откройте эту страницу в Safari\n2. Нажмите на кнопку "Открыть в AR"\n3. Наведите камеру на плоскую поверхность');
            } else if (isAndroid) {
                alert('📱 Чтобы посмотреть в AR:\n\n1. Убедитесь, что у вас установлены Google Play Services для AR\n2. Нажмите на кнопку "Открыть в AR"\n3. Наведите камеру на плоскую поверхность');
            } else {
                alert('AR режим доступен только на мобильных устройствах. Откройте эту страницу на телефоне или планшете.');
            }
        }
    },

    showLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('hidden');
        }
    },

    hideLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
    },

    animateModalIn() {
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.animation = 'none';
            modalContent.offsetHeight; // Trigger reflow
            modalContent.style.animation = 'modalIn 0.5s ease-out';
        }
    },

    animateModalOut(callback) {
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.animation = 'modalOut 0.3s ease-in';
            setTimeout(callback, 300);
        } else {
            callback();
        }
    }
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Экспорт для использования в других модулях
window.GiftApp = App;