class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        
        // Estado del juego
        this.gameState = {
            targetQuantity: 0,
            collectedQuantity: 0,
            applesOnTree: 0,
            totalApples: 0,
            gameCompleted: false,
            gameMode: 'equality', // 'equality', 'greater', 'lesser'
            currentLevel: 1,
            score: 0,
            sessionStartTime: null,
            totalPlayTime: 0
        };
        
        // Configuración del juego
        this.gameConfig = {
            maxApples: 6,
            minApples: 1,
            treePositions: [
                { x: 150, y: 200 },
                { x: 200, y: 180 },
                { x: 250, y: 190 },
                { x: 180, y: 240 },
                { x: 220, y: 250 },
                { x: 270, y: 230 }
            ]
        };
        
        // Grupos de objetos
        this.applesGroup = null;
        this.collectedApplesGroup = null;
        this.collectionZone = null;
        
        // UI Elements
        this.targetText = null;
        this.collectedText = null;
        this.feedbackText = null;
        this.levelText = null;
        this.modeText = null;
        this.instructionText = null;
        this.scoreText = null;
        
        // Sonidos
        this.sounds = {};
        
        // Estado del progreso
        this.userProgress = null;
        this.progressLoaded = false;
    }
    
    preload() {
        // Crear formas simples como fallback si no se cargan las imágenes
        this.createSimpleAssets();
        
        // Intentar cargar assets reales
        this.load.image('background', 'assets/images/background.png');
        this.load.image('tree', 'assets/images/tree.png');
        this.load.image('apple', 'assets/images/apple.png');
        this.load.image('collection-box', 'assets/images/collection-box.png');
        
        // Cargar sonidos
        this.load.audio('correct', 'assets/sounds/correct.wav');
        this.load.audio('incorrect', 'assets/sounds/incorrect.wav');
        
        // Manejar errores de carga
        this.load.on('loaderror', (file) => {
            console.warn('Error cargando:', file.key);
        });
    }
    
    createSimpleAssets() {
        // Crear assets simples como fallback
        const graphics = this.add.graphics();
        
        // Crear una manzana simple
        graphics.fillStyle(0xFF0000);
        graphics.fillCircle(20, 20, 15);
        graphics.fillStyle(0x00FF00);
        graphics.fillRect(18, 5, 4, 8);
        graphics.generateTexture('simple-apple', 40, 40);
        
        // Crear un árbol simple
        graphics.clear();
        graphics.fillStyle(0x8B4513);
        graphics.fillRect(45, 60, 10, 40);
        graphics.fillStyle(0x228B22);
        graphics.fillCircle(50, 50, 30);
        graphics.generateTexture('simple-tree', 100, 100);
        
        // Crear caja de recolección simple
        graphics.clear();
        graphics.fillStyle(0x8B4513);
        graphics.fillRect(0, 0, 80, 60);
        graphics.fillStyle(0xD2691E);
        graphics.fillRect(5, 5, 70, 50);
        graphics.generateTexture('simple-box', 80, 60);
        
        graphics.destroy();
    }
    
    create() {
        // Configurar el mundo del juego
        this.setupWorld();
        
        // Configurar sonidos
        this.setupSounds();
        
        // Configurar UI mejorada
        this.setupImprovedUI();
        
        // Configurar grupos de objetos
        this.setupGroups();
        
        // Configurar zona de recolección
        this.setupCollectionZone();
        
        // Configurar eventos de entrada
        this.setupInput();
        
        // Cargar progreso del usuario
        this.loadUserProgress();
        
        console.log('🎮 GameScene mejorada creada correctamente');
    }
    
    async loadUserProgress() {
        try {
            console.log('📊 Cargando progreso del usuario...');
            
            if (window.PROGRESS_MANAGER) {
                this.userProgress = await window.PROGRESS_MANAGER.loadProgress();
                
                if (this.userProgress) {
                    console.log('✅ Progreso cargado:', this.userProgress);
                    this.gameState.score = this.userProgress.puntuacion || 0;
                    
                    // Mostrar mensaje de bienvenida con progreso anterior
                    this.showWelcomeMessage();
                } else {
                    console.log('ℹ️ No se encontró progreso previo para este juego');
                    this.gameState.score = 0;
                }
            } else {
                console.warn('⚠️ PROGRESS_MANAGER no está disponible');
                this.gameState.score = 0;
            }
        } catch (error) {
            console.error('❌ Error cargando progreso:', error);
            this.gameState.score = 0;
        }
        
        this.progressLoaded = true;
        this.setupNewProblem();
    }

    showWelcomeMessage() {
        const welcomeText = this.add.text(400, 250, `¡Bienvenido de vuelta! 🍎\nTu puntuación anterior: ${this.userProgress.puntuacion} puntos`, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#4CAF50',
            fontStyle: 'bold',
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: { x: 20, y: 15 },
            align: 'center'
        }).setOrigin(0.5);
        welcomeText.setDepth(1004); // Máxima profundidad para mensaje de bienvenida
        
        // Animación de entrada
        welcomeText.setScale(0);
        this.tweens.add({
            targets: welcomeText,
            scale: 1,
            duration: 800,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Desaparecer después de 3 segundos
                this.time.delayedCall(3000, () => {
                    this.tweens.add({
                        targets: welcomeText,
                        alpha: 0,
                        duration: 500,
                        onComplete: () => welcomeText.destroy()
                    });
                });
            }
        });
    }

    setupWorld() {
        // Fondo del cielo con gradiente mejorado
        const sky = this.add.graphics();
        sky.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x98FB98, 0x98FB98);
        sky.fillRect(0, 0, 800, 600);
        
        // Sol mejorado
        const sun = this.add.circle(700, 100, 40, 0xFFD700);
        sun.setStrokeStyle(3, 0xFFA500);
        
        // Rayos del sol más visibles
        this.createImprovedSunRays();
        
        // Césped con textura
        const grass = this.add.graphics();
        grass.fillStyle(0x90EE90);
        grass.fillRect(0, 500, 800, 100);
        
        // Agregar algunas flores decorativas
        this.createFlowers();
        
        // Árbol (usar fallback si no se carga la imagen)
        this.treeSprite = this.add.image(300, 350, 'tree');
        this.treeSprite.setScale(0.8);
        this.treeSprite.on('error', () => {
            this.treeSprite.setTexture('simple-tree');
        });
        
        console.log('🌍 Mundo del juego mejorado configurado');
    }
    
    createImprovedSunRays() {
        const sunX = 700;
        const sunY = 100;
        const rayLength = 60;
        const rayCount = 8;
        
        for (let i = 0; i < rayCount; i++) {
            const angle = (i * 45) * Math.PI / 180;
            const startX = sunX + Math.cos(angle) * 45;
            const startY = sunY + Math.sin(angle) * 45;
            const endX = sunX + Math.cos(angle) * rayLength;
            const endY = sunY + Math.sin(angle) * rayLength;
            
            const ray = this.add.line(0, 0, startX, startY, endX, endY, 0xFFD700);
            ray.setLineWidth(6);
            ray.setOrigin(0, 0);
            ray.setAlpha(0.9);
            
            // Animación de rotación más suave
            this.tweens.add({
                targets: ray,
                rotation: Math.PI * 2,
                duration: 15000,
                repeat: -1,
                ease: 'Linear'
            });
        }
    }
    
    createFlowers() {
        const flowerPositions = [
            { x: 100, y: 520 },
            { x: 500, y: 530 },
            { x: 650, y: 525 },
            { x: 750, y: 535 }
        ];
        
        flowerPositions.forEach(pos => {
            // Tallo
            const stem = this.add.rectangle(pos.x, pos.y, 3, 20, 0x228B22);
            
            // Flor
            const flower = this.add.circle(pos.x, pos.y - 10, 8, 0xFF69B4);
            flower.setStrokeStyle(2, 0xFF1493);
            
            // Animación suave
            this.tweens.add({
                targets: [stem, flower],
                y: pos.y + 2,
                duration: 2000,
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
        });
    }
    
    setupImprovedUI() {
        // Panel de información mejorado
        const infoPanel = this.add.graphics();
        infoPanel.fillStyle(0xFFFFFF, 0.9);
        infoPanel.fillRoundedRect(20, 20, 300, 120, 10);
        infoPanel.lineStyle(3, 0x8B4513);
        infoPanel.strokeRoundedRect(20, 20, 300, 120, 10);
        
        // Título del juego más prominente - SIEMPRE ADELANTE
        const titleText = this.add.text(400, 30, 'Signo Aventura', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#2F4F4F',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        titleText.setDepth(1003); // Máxima profundidad para título
        
        // Modo de juego - SIEMPRE ADELANTE
        const modeLabel = this.add.text(30, 40, 'Modo:', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#8B4513',
            fontStyle: 'bold'
        });
        modeLabel.setDepth(1003);
        
        this.modeText = this.add.text(80, 40, 'Igualdad (=)', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#FF6347',
            fontStyle: 'bold'
        });
        this.modeText.setDepth(1003);
        
        // Nivel - SIEMPRE ADELANTE
        const levelLabel = this.add.text(30, 65, 'Nivel:', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#8B4513',
            fontStyle: 'bold'
        });
        levelLabel.setDepth(1003);
        
        this.levelText = this.add.text(80, 65, '1', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#32CD32',
            fontStyle: 'bold'
        });
        this.levelText.setDepth(1003);
        
        // Objetivo más claro - SIEMPRE ADELANTE
        const targetLabel = this.add.text(30, 90, 'Objetivo:', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#8B4513',
            fontStyle: 'bold'
        });
        targetLabel.setDepth(1003);
        
        this.targetText = this.add.text(120, 90, '0', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#FF6347',
            fontStyle: 'bold',
            backgroundColor: '#FFFFE0',
            padding: { x: 8, y: 4 }
        });
        this.targetText.setDepth(1003);
        
        // Recolectado más claro - SIEMPRE ADELANTE
        const collectedLabel = this.add.text(30, 115, 'Recolectado:', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#8B4513',
            fontStyle: 'bold'
        });
        collectedLabel.setDepth(1003);
        
        this.collectedText = this.add.text(150, 115, '0', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#32CD32',
            fontStyle: 'bold',
            backgroundColor: '#F0FFF0',
            padding: { x: 8, y: 4 }
        });
        this.collectedText.setDepth(1003);
        
        // Instrucciones más claras - SIEMPRE ADELANTE
        this.instructionText = this.add.text(400, 70, 'Arrastra las manzanas rojas del árbol hacia la caja', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#2F4F4F',
            fontStyle: 'bold',
            align: 'center',
            wordWrap: { width: 350 }
        }).setOrigin(0.5);
        this.instructionText.setDepth(1003);
        
        // Mensaje de retroalimentación mejorado - SIEMPRE ADELANTE
        this.feedbackText = this.add.text(400, 500, '', {
            fontSize: '22px',
            fontFamily: 'Arial',
            color: '#FF6347',
            fontStyle: 'bold',
            align: 'center',
            backgroundColor: '#FFFFFF',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5);
        this.feedbackText.setDepth(1004); // Máxima profundidad para mensajes de feedback
        
        // Texto de puntuación - SIEMPRE ADELANTE
        this.scoreText = this.add.text(400, 530, 'Puntuación: 0', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#4169E1',
            fontStyle: 'bold',
            align: 'center',
            backgroundColor: '#F0F8FF',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);
        this.scoreText.setDepth(1003);
        
        console.log('🎨 UI mejorada configurada');
    }
    
    setupSounds() {
        // Crear sonidos sintéticos como fallback
        this.sounds.correct = this.sound.add('correct', { volume: 0.7 });
        this.sounds.incorrect = this.sound.add('incorrect', { volume: 0.7 });
        
        // Fallback para sonidos
        this.sounds.correct.on('error', () => {
            console.log('Usando sonido sintético para correcto');
        });
        
        this.sounds.incorrect.on('error', () => {
            console.log('Usando sonido sintético para incorrecto');
        });
        
        console.log('🔊 Sonidos configurados');
    }
    
    setupGroups() {
        this.applesGroup = this.add.group();
        this.collectedApplesGroup = this.add.group();
        console.log('👥 Grupos de objetos configurados');
    }
    
    setupCollectionZone() {
        // Zona de recolección ULTRA EXPANDIDA - INVISIBLE pero funcional
        this.collectionZone = this.add.graphics();
        // Zona ultra expandida: 450px de ancho y 420px de alto - INVISIBLE
        this.collectionZone.fillRoundedRect(350, 180, 450, 420, 15);
        // Sin color ni línea para hacerla invisible
        this.collectionZone.setVisible(false); // Hacer invisible pero mantener funcionalidad
        
        // Icono de caja reducido en 10% y centrado en la nueva zona expandida
        const box = this.add.image(590, 390, 'collection-box');
        box.setScale(0.63); // Reducido de 0.7 a 0.63 (10% menos)
        box.setDepth(999); // Fondo de la zona de recolección
        box.on('error', () => {
            box.setTexture('simple-box');
        });
        
        // Etiqueta más clara y prominente - SIEMPRE VISIBLE ADELANTE
        const dragLabel = this.add.text(590, 220, 'ARRASTRA AQUÍ', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#8B4513',
            fontStyle: 'bold',
            align: 'center',
            backgroundColor: '#FFFFE0',
            padding: { x: 12, y: 6 }
        }).setOrigin(0.5);
        
        // Sistema de profundidades organizado:
        // - Mensajes temporales: 1004 (máxima prioridad - bienvenida, progreso, ¡GENIAL!, feedback)
        // - Todas las etiquetas: 1003 (alta prioridad, siempre adelante)
        // - Manzanas arrastrando: 1002 (alta prioridad)
        // - Manzanas recolectadas: 1001 (adelante de caja)
        // - Etiqueta "ARRASTRA AQUÍ": 1003 (guía visual, siempre adelante)
        // - Caja de recolección: 999 (fondo de la zona)
        // - Zona de colisión: INVISIBLE (solo detección)
        // - Manzanas en árbol: 998 (árbol y elementos del juego)
        
        // Asegurar que la etiqueta esté siempre adelante de todo
        dragLabel.setDepth(1003);
        

        
        console.log('📦 Zona de recolección MUCHO más grande configurada');
    }
    
    setupInput() {
        this.input.on('dragstart', (pointer, gameObject) => {
            gameObject.setTint(0xffff00);
            
            // Asegurar que la manzana que se arrastra esté adelante de todo
            gameObject.setDepth(1002);
            
            this.tweens.add({
                targets: gameObject,
                scale: 1.3,
                duration: 200,
                ease: 'Back.easeOut'
            });
            
            this.createGlowEffect(gameObject);
        });
        
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            
            this.createDragTrail(gameObject);
            
            if (this.isOverCollectionZone(gameObject)) {
                this.highlightCollectionZone(true);
            } else {
                this.highlightCollectionZone(false);
            }
        });
        
        this.input.on('dragend', (pointer, gameObject) => {
            gameObject.clearTint();
            
            this.tweens.add({
                targets: gameObject,
                scale: 1.0,
                duration: 200,
                ease: 'Back.easeOut'
            });
            
            this.clearGlowEffect(gameObject);
            this.highlightCollectionZone(false);
            
            if (this.isOverCollectionZone(gameObject)) {
                this.collectApple(gameObject);
            } else {
                // Restaurar profundidad normal si no se recolecta
                gameObject.setDepth(998);
                this.tweens.add({
                    targets: gameObject,
                    x: gameObject.originalX,
                    y: gameObject.originalY,
                    duration: 500,
                    ease: 'Elastic.easeOut'
                });
            }
        });
        
        console.log('🖱️ Eventos de entrada mejorados configurados');
    }
    
    highlightCollectionZone(highlight) {
        // Zona de colisión invisible - no mostrar efectos visuales
        // La funcionalidad se mantiene pero sin elementos visuales
        if (highlight) {
            // Opcional: podrías agregar un efecto sutil aquí si lo deseas
            // Por ahora, mantener invisible
        } else {
            // Mantener invisible
        }
    }
    
    createGlowEffect(gameObject) {
        const glow = this.add.circle(gameObject.x, gameObject.y, 30, 0xFFFF00, 0.4);
        gameObject.glowEffect = glow;
        
        this.tweens.add({
            targets: glow,
            scale: { from: 0.8, to: 1.4 },
            alpha: { from: 0.4, to: 0.1 },
            duration: 800,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });
    }
    
    clearGlowEffect(gameObject) {
        if (gameObject.glowEffect) {
            this.tweens.killTweensOf(gameObject.glowEffect);
            gameObject.glowEffect.destroy();
            gameObject.glowEffect = null;
        }
    }
    
    createDragTrail(gameObject) {
        if (Math.random() < 0.4) {
            const trail = this.add.circle(
                gameObject.x + Phaser.Math.Between(-15, 15),
                gameObject.y + Phaser.Math.Between(-15, 15),
                Phaser.Math.Between(3, 6),
                0xFFD700,
                0.7
            );
            
            this.tweens.add({
                targets: trail,
                scale: { from: 1, to: 0 },
                alpha: { from: 0.7, to: 0 },
                duration: 600,
                ease: 'Power2.easeOut',
                onComplete: () => {
                    trail.destroy();
                }
            });
        }
    }
    
    isOverCollectionZone(gameObject) {
        // Zona de detección ULTRA EXPANDIDA: incluye toda el área derecha y más
        return gameObject.x >= 350 && gameObject.x <= 800 && 
               gameObject.y >= 180 && gameObject.y <= 600;
    }
    
    collectApple(appleSprite) {
        this.applesGroup.remove(appleSprite);
        
        // Posicionar manzanas recolectadas en una fila dentro de la zona
        const targetX = 550 + (this.gameState.collectedQuantity * 30);
        const targetY = 425;
        
        this.tweens.add({
            targets: appleSprite,
            x: targetX,
            y: targetY,
            scale: 0.6,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                this.collectedApplesGroup.add(appleSprite);
                appleSprite.disableInteractive();
                
                // Configurar profundidad: adelante de todo (etiqueta y caja)
                appleSprite.setDepth(1001);
                
                this.gameState.collectedQuantity++;
                this.gameState.applesOnTree--;
                
                this.updateDisplay();
                this.checkGameCompletion();
                
                // Efecto de sonido
                this.playCollectSound();
                
                // Efecto visual de confirmación
                this.createCollectionEffect(targetX, targetY);
            }
        });
        
        console.log('🍎 Manzana recolectada exitosamente');
    }
    
    createCollectionEffect(x, y) {
        // Efecto de partículas cuando se recolecta una manzana
        for (let i = 0; i < 8; i++) {
            const particle = this.add.circle(x, y, 3, 0xFFD700);
            
            this.tweens.add({
                targets: particle,
                x: x + Phaser.Math.Between(-30, 30),
                y: y + Phaser.Math.Between(-30, 30),
                alpha: { from: 1, to: 0 },
                scale: { from: 1, to: 0 },
                duration: 800,
                ease: 'Power2.easeOut',
                onComplete: () => {
                    particle.destroy();
                }
            });
        }
    }
    
    setupNewProblem() {
        console.log('🔄 Configurando nuevo problema...');
        
        this.clearGame();
        
        // Inicializar tiempo de sesión si es la primera vez
        if (!this.gameState.sessionStartTime) {
            this.gameState.sessionStartTime = Date.now();
        }
        
        // Generar problema según el modo
        switch (this.gameState.gameMode) {
            case 'equality':
                this.generateEqualityProblem();
                break;
            case 'greater':
                this.generateGreaterProblem();
                break;
            case 'lesser':
                this.generateLesserProblem();
                break;
        }
        
        this.createApplesOnTree();
        this.updateDisplay();
        this.feedbackText.setText('');
        
        console.log('🍎 Nuevo problema generado:', this.gameState);
    }
    
    generateEqualityProblem() {
        this.gameState.targetQuantity = Phaser.Math.Between(this.gameConfig.minApples, this.gameConfig.maxApples);
        this.gameState.applesOnTree = this.gameState.targetQuantity + Phaser.Math.Between(0, 2);
        this.gameState.collectedQuantity = 0;
        this.gameState.gameCompleted = false;
        
        this.instructionText.setText('Recolecta EXACTAMENTE ' + this.gameState.targetQuantity + ' manzanas');
    }
    
    generateGreaterProblem() {
        this.gameState.targetQuantity = Phaser.Math.Between(this.gameConfig.minApples, this.gameConfig.maxApples - 1);
        this.gameState.applesOnTree = this.gameConfig.maxApples;
        this.gameState.collectedQuantity = 0;
        this.gameState.gameCompleted = false;
        
        this.instructionText.setText('Recolecta MÁS de ' + this.gameState.targetQuantity + ' manzanas');
    }
    
    generateLesserProblem() {
        this.gameState.targetQuantity = Phaser.Math.Between(this.gameConfig.minApples + 1, this.gameConfig.maxApples);
        this.gameState.applesOnTree = this.gameConfig.maxApples;
        this.gameState.collectedQuantity = 0;
        this.gameState.gameCompleted = false;
        
        this.instructionText.setText('Recolecta MENOS de ' + this.gameState.targetQuantity + ' manzanas');
    }
    
    clearGame() {
        this.applesGroup.clear(true, true);
        this.collectedApplesGroup.clear(true, true);
        console.log('🧹 Juego limpiado');
    }
    
    createApplesOnTree() {
        for (let i = 0; i < this.gameState.applesOnTree; i++) {
            const position = this.gameConfig.treePositions[i % this.gameConfig.treePositions.length];
            
            // Usar asset simple como fallback
            let apple;
            try {
                apple = this.add.image(position.x, position.y, 'apple');
            } catch (error) {
                apple = this.add.image(position.x, position.y, 'simple-apple');
            }
            
            apple.setScale(0.8);
            apple.setInteractive({ draggable: true });
            apple.setDepth(998); // Profundidad para manzanas en el árbol
            
            apple.originalX = position.x;
            apple.originalY = position.y;
            
            this.applesGroup.add(apple);
            
            // Animación de entrada más llamativa
            apple.setScale(0);
            apple.setAlpha(0);
            this.tweens.add({
                targets: apple,
                scale: 0.8,
                alpha: 1,
                duration: 400,
                delay: i * 150,
                ease: 'Back.easeOut'
            });
            
            // Animación de flotación sutil
            this.tweens.add({
                targets: apple,
                y: position.y + 5,
                duration: 2000,
                delay: i * 150,
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
        }
        
        console.log(`🍎 ${this.gameState.applesOnTree} manzanas creadas en el árbol`);
    }
    
    updateDisplay() {
        this.targetText.setText(this.gameState.targetQuantity.toString());
        this.collectedText.setText(this.gameState.collectedQuantity.toString());
        this.levelText.setText(this.gameState.currentLevel.toString());
        this.scoreText.setText(`Puntuación: ${this.gameState.score}`);
        
        // Actualizar texto del modo
        const modeTexts = {
            'equality': 'Igualdad (=)',
            'greater': 'Mayor que (>)',
            'lesser': 'Menor que (<)'
        };
        this.modeText.setText(modeTexts[this.gameState.gameMode]);
        
        console.log(`📊 Display actualizado`);
    }
    
    checkGameCompletion() {
        let isCorrect = false;
        let message = '';
        
        switch (this.gameState.gameMode) {
            case 'equality':
                isCorrect = this.gameState.collectedQuantity === this.gameState.targetQuantity;
                if (isCorrect) {
                    message = '¡Perfecto! Recolectaste exactamente ' + this.gameState.targetQuantity + ' manzanas';
                } else if (this.gameState.collectedQuantity > this.gameState.targetQuantity) {
                    message = '¡Ups! Recolectaste demasiadas manzanas. Inténtalo de nuevo';
                }
                break;
                
            case 'greater':
                isCorrect = this.gameState.collectedQuantity > this.gameState.targetQuantity;
                if (isCorrect) {
                    message = '¡Excelente! Recolectaste más de ' + this.gameState.targetQuantity + ' manzanas';
                } else {
                    message = 'Necesitas recolectar más manzanas';
                }
                break;
                
            case 'lesser':
                isCorrect = this.gameState.collectedQuantity < this.gameState.targetQuantity;
                if (isCorrect) {
                    message = '¡Muy bien! Recolectaste menos de ' + this.gameState.targetQuantity + ' manzanas';
                } else if (this.gameState.collectedQuantity >= this.gameState.targetQuantity) {
                    message = 'Recolectaste demasiadas manzanas. Inténtalo de nuevo';
                }
                break;
        }
        
        if (isCorrect) {
            this.showFeedback(message, 'correct');
            this.gameState.gameCompleted = true;
            this.gameState.score += 10; // Sumar puntos por completar
            
            // Deshabilitar manzanas restantes
            this.applesGroup.children.entries.forEach(apple => {
                apple.disableInteractive();
                apple.setTint(0x888888);
            });
            
            this.createCelebrationEffect();
            
            // Guardar progreso en la base de datos
            this.saveProgress();
            
            // Avanzar nivel después de un tiempo
            this.time.delayedCall(3000, () => {
                this.gameState.currentLevel++;
                this.setupNewProblem();
            });
            
        } else if (message) {
            this.showFeedback(message, 'incorrect');
            
            // Reiniciar después de un momento
            this.time.delayedCall(2500, () => {
                this.setupNewProblem();
            });
        }
    }
    
    showFeedback(message, type) {
        this.feedbackText.setText(message);
        
        if (type === 'correct') {
            this.feedbackText.setColor('#32CD32');
            this.feedbackText.setBackgroundColor('#F0FFF0');
            this.playSuccessSound();
        } else {
            this.feedbackText.setColor('#FF6347');
            this.feedbackText.setBackgroundColor('#FFE4E1');
            this.playErrorSound();
        }
        
        this.feedbackText.setScale(0);
        this.tweens.add({
            targets: this.feedbackText,
            scale: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });
        
        this.time.delayedCall(4000, () => {
            this.tweens.add({
                targets: this.feedbackText,
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    this.feedbackText.setText('');
                    this.feedbackText.setAlpha(1);
                }
            });
        });
        
        console.log(`💬 Feedback mostrado: ${message} (${type})`);
    }
    
    createCelebrationEffect() {
        const centerX = 400;
        const centerY = 300;
        
        // Crear confeti colorido
        const colors = [0xFF6B6B, 0x4ECDC4, 0x45B7D1, 0x96CEB4, 0xFECA57, 0xFF9FF3];
        
        for (let i = 0; i < 20; i++) {
            const confetti = this.add.rectangle(
                centerX + Phaser.Math.Between(-100, 100),
                centerY + Phaser.Math.Between(-100, 100),
                Phaser.Math.Between(8, 15),
                Phaser.Math.Between(8, 15),
                colors[i % colors.length]
            );
            
            confetti.setRotation(Phaser.Math.Between(0, Math.PI * 2));
            
            this.tweens.add({
                targets: confetti,
                y: confetti.y + Phaser.Math.Between(200, 400),
                x: confetti.x + Phaser.Math.Between(-100, 100),
                rotation: confetti.rotation + Math.PI * 4,
                alpha: { from: 1, to: 0 },
                scale: { from: 1, to: 0.3 },
                duration: 2000,
                delay: i * 50,
                ease: 'Power2.easeOut',
                onComplete: () => {
                    confetti.destroy();
                }
            });
        }
        
        // Efecto de texto flotante - SIEMPRE ADELANTE
        const successText = this.add.text(centerX, centerY - 50, '¡GENIAL!', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#FFD700',
            fontStyle: 'bold',
            stroke: '#FF6347',
            strokeThickness: 4
        }).setOrigin(0.5);
        successText.setDepth(1004); // Máxima profundidad para mensaje de éxito
        
        successText.setScale(0);
        this.tweens.add({
            targets: successText,
            scale: { from: 0, to: 1.2 },
            duration: 500,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.tweens.add({
                    targets: successText,
                    y: successText.y - 100,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Power2.easeOut',
                    onComplete: () => {
                        successText.destroy();
                    }
                });
            }
        });
        
        console.log('🎉 Efecto de celebración mejorado creado');
    }
    
    playCollectSound() {
        // Sonido sintético para recoger
        console.log('🔊 Sonido de recolección');
    }
    
    playSuccessSound() {
        try {
            this.sounds.correct.play();
        } catch (error) {
            console.log('🔊 Sonido de éxito sintético');
        }
    }
    
    playErrorSound() {
        try {
            this.sounds.incorrect.play();
        } catch (error) {
            console.log('🔊 Sonido de error sintético');
        }
    }
    
    // Métodos públicos para control externo
    resetGame() {
        this.setupNewProblem();
        console.log('🔄 Juego reiniciado');
    }
    
    changeGameMode(mode) {
        if (['equality', 'greater', 'lesser'].includes(mode)) {
            this.gameState.gameMode = mode;
            this.gameState.currentLevel = 1;
            this.setupNewProblem();
            console.log('🎮 Modo cambiado a:', mode);
        }
    }
    
    setDifficulty(minApples, maxApples) {
        this.gameConfig.minApples = Math.max(1, minApples);
        this.gameConfig.maxApples = Math.min(8, maxApples);
        this.setupNewProblem();
        console.log('⚙️ Dificultad actualizada');
    }

    async saveProgress() {
        if (!window.PROGRESS_MANAGER) {
            console.warn('⚠️ PROGRESS_MANAGER no está disponible');
            return;
        }

        try {
            const currentTime = Date.now();
            const sessionTime = this.gameState.sessionStartTime ? 
                Math.floor((currentTime - this.gameState.sessionStartTime) / 1000) : 0;
            
            const hours = Math.floor(sessionTime / 3600);
            const minutes = Math.floor((sessionTime % 3600) / 60);
            const seconds = sessionTime % 60;
            const tiempoJugado = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            const success = await window.PROGRESS_MANAGER.saveProgress(10, tiempoJugado);
            
            if (success) {
                this.showSaveIndicator();
            } else {
                console.error('Error guardando progreso');
            }
        } catch (error) {
            console.error('Error en saveProgress:', error);
        }
    }

    showSaveIndicator() {
        const saveText = this.add.text(400, 180, '💾 Progreso actualizado', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#4CAF50',
            fontStyle: 'bold',
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);
        saveText.setDepth(1004); // Máxima profundidad para mensaje de progreso
        
        saveText.setScale(0);
        this.tweens.add({
            targets: saveText,
            scale: 1,
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.time.delayedCall(2000, () => {
                    this.tweens.add({
                        targets: saveText,
                        alpha: 0,
                        duration: 300,
                        onComplete: () => saveText.destroy()
                    });
                });
            }
        });
    }
}

