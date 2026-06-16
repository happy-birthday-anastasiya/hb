// Модуль для создания AR сцены с подарками
const ARScene = {
    scene: null,
    
    // Конфигурация подарков
    giftConfigs: [
        { type: 'box', color: '#FF6B6B', size: '0.15 0.15 0.15' },
        { type: 'sphere', color: '#4ECDC4', size: '0.12 0.12 0.12' },
        { type: 'cylinder', color: '#45B7D1', size: '0.1 0.15 0.1' },
        { type: 'cone', color: '#96CEB4', size: '0.12 0.15 0.12' },
        { type: 'torus', color: '#FFEAA7', size: '0.12 0.04 0.12' },
        { type: 'octahedron', color: '#DDA0DD', size: '0.13 0.13 0.13' },
        { type: 'dodecahedron', color: '#F0E68C', size: '0.12 0.12 0.12' },
        { type: 'icosahedron', color: '#87CEEB', size: '0.13 0.13 0.13' },
        { type: 'box', color: '#FF69B4', size: '0.14 0.14 0.14' },
        { type: 'sphere', color: '#98FB98', size: '0.11 0.11 0.11' }
    ],
    
    // Создание AR сцены
    create(container) {
        // Выбираем случайные подарки
        const selectedGifts = this.selectRandomGifts(6, 10);
        
        // Создаем HTML для A-Frame сцены
        const sceneHTML = this.generateSceneHTML(selectedGifts);
        
        // Вставляем в контейнер
        container.innerHTML = sceneHTML;
        
        // Сохраняем ссылку на сцену
        this.scene = container.querySelector('a-scene');
        
        // Добавляем обработчики для сцены
        this.setupSceneHandlers();
    },
    
    // Выбор случайных подарков
    selectRandomGifts(min, max) {
        const count = Math.floor(Math.random() * (max - min + 1)) + min;
        const shuffled = [...this.giftConfigs].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    },
    
    // Генерация позиций для подарков по кругу
    generateGiftPositions(count, radius = 2) {
        const positions = [];
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = Math.random() * 1.5 + 0.5;
            positions.push({ x, y, z, angle });
        }
        return positions;
    },
    
    // Генерация HTML сцены
    generateSceneHTML(gifts) {
        const positions = this.generateGiftPositions(gifts.length);
        
        return `
            <a-scene 
                embedded 
                arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
                renderer="antialias: true; alpha: true">
                
                <!-- Освещение -->
                <a-entity light="type: ambient; color: #BBB; intensity: 0.6"></a-entity>
                <a-entity light="type: directional; color: #FFF; intensity: 1.0" position="1 2 2"></a-entity>
                
                <!-- Камера -->
                <a-entity camera></a-entity>
                
                <!-- Маркер для AR -->
                <a-marker preset="hiro">
                    
                    <!-- Подарки -->
                    ${gifts.map((gift, index) => {
                        const pos = positions[index];
                        const scale = 0.8 + Math.random() * 1.2;
                        
                        return `
                        <a-entity
                            position="${pos.x.toFixed(2)} ${pos.y.toFixed(2)} ${pos.z.toFixed(2)}"
                            rotation="0 ${pos.angle * 180 / Math.PI} 0"
                            scale="${scale} ${scale} ${scale}"
                            animation="property: rotation; to: 0 ${pos.angle * 180 / Math.PI + 360} 0; loop: true; dur: ${8000 + index * 1000}; easing: linear">
                            
                            <!-- Основная форма подарка -->
                            <a-${gift.type} 
                                color="${gift.color}"
                                material="shader: standard; metalness: 0.3; roughness: 0.4;"
                                scale="${gift.size}">
                            </a-${gift.type}>
                            
                            <!-- Ленточки для коробок -->
                            ${gift.type === 'box' ? this.generateRibbonHTML(gift.color) : ''}
                            
                            <!-- Свечение -->
                            <a-${gift.type}
                                color="${gift.color}"
                                material="shader: flat; opacity: 0.1; transparent: true;"
                                scale="${parseFloat(gift.size.split(' ')[0]) * 1.3} ${parseFloat(gift.size.split(' ')[1]) * 1.3} ${parseFloat(gift.size.split(' ')[2]) * 1.3}">
                            </a-${gift.type}>
                            
                            <!-- Частицы -->
                            <a-entity
                                particle-system="preset: snow; particleCount: 20; color: ${gift.color}; size: 0.03;"
                                position="0 0 0">
                            </a-entity>
                            
                        </a-entity>
                        `;
                    }).join('')}
                    
                    <!-- Текст поздравления -->
                    <a-text 
                        value="С Днём\\nРождения! 🎉"
                        position="0 2.5 0"
                        align="center"
                        color="#FF1493"
                        width="3"
                        scale="1.5 1.5 1.5"
                        animation="property: scale; from: 1 1 1; to: 1.5 1.5 1.5; loop: true; dir: alternate; dur: 2000; easing: easeInOutSine">
                    </a-text>
                    
                    <!-- Конфетти -->
                    <a-entity 
                        position="0 1.5 0"
                        particle-system="preset: rain; particleCount: 300; color: #FF6B6B,#4ECDC4,#45B7D1,#FFD700,#FF69B4; size: 0.05; duration: 2; velocityValue: 0 2 0;">
                    </a-entity>
                    
                    <!-- Круг из света -->
                    <a-ring
                        position="0 0.01 0"
                        rotation="-90 0 0"
                        radius-inner="1.8"
                        radius-outer="2"
                        color="#FFD700"
                        material="shader: flat; opacity: 0.3; transparent: true;"
                        animation="property: rotation; to: -90 0 360; loop: true; dur: 20000; easing: linear">
                    </a-ring>
                    
                </a-marker>
                
            </a-scene>
        `;
    },
    
    // Генерация ленточек для коробок
    generateRibbonHTML(color) {
        return `
            <a-box color="#FFD700" 
                width="0.06" height="${parseFloat(color.size) * 0.9}" depth="${parseFloat(color.size) * 0.9}"
                position="0 0 0"
                material="shader: standard; metalness: 0.5; roughness: 0.3;">
            </a-box>
            <a-box color="#FFD700" 
                width="${parseFloat(color.size) * 0.9}" height="0.06" depth="${parseFloat(color.size) * 0.9}"
                position="0 0 0"
                material="shader: standard; metalness: 0.5; roughness: 0.3;">
            </a-box>
            <a-cone color="#FF1493" 
                radius-bottom="0.04" radius-top="0" height="0.08"
                position="0 0.13 0"
                material="shader: standard; metalness: 0.4; roughness: 0.5;">
            </a-cone>
        `;
    },
    
    // Настройка обработчиков сцены
    setupSceneHandlers() {
        if (this.scene) {
            this.scene.addEventListener('loaded', () => {
                console.log('AR сцена загружена');
            });
            
            this.scene.addEventListener('arError', (error) => {
                console.error('Ошибка AR:', error);
            });
        }
    },
    
    // Уничтожение сцены
    destroy() {
        if (this.scene) {
            // Останавливаем все анимации
            const animations = this.scene.querySelectorAll('[animation]');
            animations.forEach(el => {
                el.removeAttribute('animation');
            });
            
            // Очищаем сцену
            this.scene.innerHTML = '';
            this.scene = null;
        }
    }
};