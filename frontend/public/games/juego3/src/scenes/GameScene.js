class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        
        // Estado del juego
        this.gameState = {
            targetQuantity: 0,
            collectedQuantity: 0,
            applesOnTree: 0,
            totalApples: 0,
            gameCompleted: false
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
        
        // Sonidos
        this.sounds = {};
    }
    
    preload() {
        // Cargar assets
        this.load.image('background', 'assets/images/background.png');
        this.load.image('tree', 'assets/images/tree.png');
        this.load.image('apple', 'assets/images/apple.png');
        this.load.image('collection-box', 'assets/images/collection-box.png');
        
        // Cargar sonidos
        this.load.audio('correct', 'assets/sounds/correct.wav');
        this.load.audio('incorrect', 'assets/sounds/incorrect.wav');
        
        // Crear formas simples para elementos que no tengan imagen
        this.load.image('sun', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==');
    }
    
    create() {
        // Configurar el mundo del juego
        this.setupWorld();
        
        // Configurar sonidos
        this.setupSounds();
        
        // Configurar UI
        this.setupUI();
        
        // Configurar grupos de objetos
        this.setupGroups();
        
        // Configurar zona de recolección
        this.setupCollectionZone();
        
        // Configurar eventos de entrada
        this.setupInput();
        
        // Iniciar nuevo problema
        this.setupNewProblem();
        
        console.log('🎮 GameScene creada correctamente');
    }
    
    setupWorld() {
        // Fondo del cielo
        this.add.rectangle(400, 300, 800, 600, 0x87CEEB);
        
        // Sol
        const sun = this.add.circle(700, 100, 40, 0xFFD700);
        sun.setStrokeStyle(3, 0xFFA500);
        
        // Rayos del sol (animados)
        this.createSunRays();
        
        // Césped
        this.add.rectangle(400, 550, 800, 100, 0x90EE90);
        
        // Árbol
        this.treeSprite = this.add.image(300, 350, 'tree');
        this.treeSprite.setScale(0.8);
        
        console.log('🌍 Mundo del juego configurado');
    }
    
    createSunRays() {
        const sunX = 700;
        const sunY = 100;
        const rayLength = 60;
        const rayCount = 8;
        
        this.sunRaysGroup = this.add.group();
        
        for (let i = 0; i < rayCount; i++) {
            const angle = (i * 45) * Math.PI / 180;
            const startX = sunX + Math.cos(angle) * 45;
            const startY = sunY + Math.sin(angle) * 45;
            const endX = sunX + Math.cos(angle) * rayLength;
            const endY = sunY + Math.sin(angle) * rayLength;
            
            const ray = this.add.line(0, 0, startX, startY, endX, endY, 0xFFD700);
            ray.setLineWidth(4);
            ray.setOrigin(0, 0);
            ray.setAlpha(0.8);
            
            this.sunRaysGroup.add(ray);
            
            // Animación de rotación suave
            this.tweens.add({
                targets: ray,
                rotation: Math.PI * 2,
                duration: 12000,
                repeat: -1,
                ease: 'Linear'
            });
            
            // Animación de pulsación
            this.tweens.add({
                targets: ray,
                alpha: { from: 0.8, to: 0.4 },
                duration: 2000,
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
        }
        
        // Crear partículas de brillo alrededor del sol
        this.createSunParticles(sunX, sunY);
    }
    
    createSunParticles(sunX, sunY) {
        // Crear partículas brillantes alrededor del sol
        for (let i = 0; i < 6; i++) {
            const particle = this.add.circle(
                sunX + Phaser.Math.Between(-20, 20),
                sunY + Phaser.Math.Between(-20, 20),
                Phaser.Math.Between(2, 4),
                0xFFFFFF
            );
            
            particle.setAlpha(0);
            
            this.tweens.add({
                targets: particle,
                alpha: { from: 0, to: 1 },
                scale: { from: 0.5, to: 1.5 },
                duration: 1500,
                delay: i * 250,
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
        }
    }
    
    setupSounds() {
        this.sounds.correct = this.sound.add('correct', { volume: 0.7 });
        this.sounds.incorrect = this.sound.add('incorrect', { volume: 0.7 });
        
        console.log('🔊 Sonidos configurados');
    }
    
    setupUI() {
        // Título del juego
        this.add.text(400, 50, 'Juego de Igualdad - Manzanas', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#2F4F4F',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Objetivo
        this.add.text(50, 100, 'Objetivo:', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#8B4513',
            fontStyle: 'bold'
        });
        
        this.targetText = this.add.text(150, 100, '0', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#FF6347',
            fontStyle: 'bold'
        });
        
        // Recolectado
        this.add.text(50, 130, 'Recolectado:', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#8B4513',
            fontStyle: 'bold'
        });
        
        this.collectedText = this.add.text(180, 130, '0', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#32CD32',
            fontStyle: 'bold'
        });
        
        // Mensaje de retroalimentación
        this.feedbackText = this.add.text(400, 500, '', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#FF6347',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);
        
        console.log('🎨 UI configurada');
    }
    
    setupGroups() {
        // Grupo para manzanas en el árbol
        this.applesGroup = this.add.group();
        
        // Grupo para manzanas recolectadas
        this.collectedApplesGroup = this.add.group();
        
        console.log('👥 Grupos de objetos configurados');
    }
    
    setupCollectionZone() {
        // Zona de recolección visual
        this.collectionZone = this.add.rectangle(600, 400, 150, 100, 0x8B4513, 0.3);
        this.collectionZone.setStrokeStyle(3, 0x8B4513);
        
        // Etiqueta de la zona
        this.add.text(600, 350, 'Zona de\nRecolección', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#8B4513',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);
        
        console.log('📦 Zona de recolección configurada');
    }
    
    setupInput() {
        // Configurar eventos de arrastre
        this.input.on('dragstart', (pointer, gameObject) => {
            gameObject.setTint(0xffff00); // Resaltar en amarillo
            
            // Animación de escalado suave
            this.tweens.add({
                targets: gameObject,
                scale: 1.2,
                duration: 200,
                ease: 'Back.easeOut'
            });
            
            // Crear efecto de brillo
            this.createGlowEffect(gameObject);
            
            this.playPickupSound();
        });
        
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            
            // Crear rastro de partículas
            this.createDragTrail(gameObject);
            
            // Verificar si está sobre la zona de recolección
            if (this.isOverCollectionZone(gameObject)) {
                this.collectionZone.setFillStyle(0x32CD32, 0.6); // Verde brillante
                this.collectionZone.setStrokeStyle(4, 0x228B22);
                
                // Efecto de pulsación en la zona
                if (!this.collectionZone.isPulsing) {
                    this.collectionZone.isPulsing = true;
                    this.tweens.add({
                        targets: this.collectionZone,
                        scale: { from: 1, to: 1.1 },
                        duration: 300,
                        repeat: -1,
                        yoyo: true,
                        ease: 'Sine.easeInOut'
                    });
                }
            } else {
                this.collectionZone.setFillStyle(0x8B4513, 0.3); // Marrón normal
                this.collectionZone.setStrokeStyle(3, 0x8B4513);
                
                // Detener pulsación
                if (this.collectionZone.isPulsing) {
                    this.collectionZone.isPulsing = false;
                    this.tweens.killTweensOf(this.collectionZone);
                    this.collectionZone.setScale(1);
                }
            }
        });
        
        this.input.on('dragend', (pointer, gameObject) => {
            gameObject.clearTint();
            
            // Restaurar escala con animación
            this.tweens.add({
                targets: gameObject,
                scale: 1.0,
                duration: 200,
                ease: 'Back.easeOut'
            });
            
            // Limpiar efecto de brillo
            this.clearGlowEffect(gameObject);
            
            // Restaurar zona de recolección
            this.collectionZone.setFillStyle(0x8B4513, 0.3);
            this.collectionZone.setStrokeStyle(3, 0x8B4513);
            if (this.collectionZone.isPulsing) {
                this.collectionZone.isPulsing = false;
                this.tweens.killTweensOf(this.collectionZone);
                this.collectionZone.setScale(1);
            }
            
            // Verificar si se soltó en la zona de recolección
            if (this.isOverCollectionZone(gameObject)) {
                this.collectApple(gameObject);
            } else {
                // Regresar a posición original con animación elástica
                this.tweens.add({
                    targets: gameObject,
                    x: gameObject.originalX,
                    y: gameObject.originalY,
                    duration: 500,
                    ease: 'Elastic.easeOut'
                });
            }
        });
        
        console.log('🖱️ Eventos de entrada configurados');
    }
    
    createGlowEffect(gameObject) {
        // Crear efecto de brillo alrededor del objeto
        const glow = this.add.circle(gameObject.x, gameObject.y, 25, 0xFFFF00, 0.3);
        gameObject.glowEffect = glow;
        
        this.tweens.add({
            targets: glow,
            scale: { from: 0.8, to: 1.2 },
            alpha: { from: 0.3, to: 0.1 },
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
        // Crear partículas de rastro durante el arrastre
        if (Math.random() < 0.3) { // Solo crear algunas partículas
            const trail = this.add.circle(
                gameObject.x + Phaser.Math.Between(-10, 10),
                gameObject.y + Phaser.Math.Between(-10, 10),
                Phaser.Math.Between(2, 4),
                0xFFD700,
                0.6
            );
            
            this.tweens.add({
                targets: trail,
                scale: { from: 1, to: 0 },
                alpha: { from: 0.6, to: 0 },
                duration: 500,
                ease: 'Power2.easeOut',
                onComplete: () => {
                    trail.destroy();
                }
            });
        }
    }
    
    isOverCollectionZone(gameObject) {
        const bounds = this.collectionZone.getBounds();
        return Phaser.Geom.Rectangle.Contains(bounds, gameObject.x, gameObject.y);
    }
    
    collectApple(appleSprite) {
        // Remover del grupo de manzanas del árbol
        this.applesGroup.remove(appleSprite);
        
        // Animar la manzana hacia la zona de recolección
        this.tweens.add({
            targets: appleSprite,
            x: 600 + (this.gameState.collectedQuantity * 30) - 60,
            y: 400,
            scale: 0.8,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                // Añadir al grupo de recolectadas
                this.collectedApplesGroup.add(appleSprite);
                appleSprite.disableInteractive();
                
                // Actualizar estado
                this.gameState.collectedQuantity++;
                this.gameState.applesOnTree--;
                
                // Actualizar UI
                this.updateDisplay();
                
                // Verificar completación
                this.checkGameCompletion();
                
                this.playDropSound();
            }
        });
        
        console.log('🍎 Manzana recolectada');
    }
    
    setupNewProblem() {
        console.log('🔄 Configurando nuevo problema...');
        
        // Limpiar estado anterior
        this.clearGame();
        
        // Generar nuevo problema
        this.gameState.targetQuantity = Phaser.Math.Between(this.gameConfig.minApples, this.gameConfig.maxApples);
        this.gameState.collectedQuantity = 0;
        this.gameState.applesOnTree = Phaser.Math.Between(this.gameState.targetQuantity, this.gameConfig.maxApples);
        this.gameState.totalApples = this.gameState.applesOnTree;
        this.gameState.gameCompleted = false;
        
        // Crear manzanas en el árbol
        this.createApplesOnTree();
        
        // Actualizar display
        this.updateDisplay();
        
        // Limpiar mensaje de retroalimentación
        this.feedbackText.setText('');
        
        console.log('🍎 Nuevo problema generado:', this.gameState);
    }
    
    clearGame() {
        // Limpiar manzanas existentes
        this.applesGroup.clear(true, true);
        this.collectedApplesGroup.clear(true, true);
        
        console.log('🧹 Juego limpiado');
    }
    
    createApplesOnTree() {
        for (let i = 0; i < this.gameState.applesOnTree; i++) {
            const position = this.gameConfig.treePositions[i % this.gameConfig.treePositions.length];
            const apple = this.add.image(position.x, position.y, 'apple');
            
            apple.setScale(0.6);
            apple.setInteractive({ draggable: true });
            
            // Guardar posición original
            apple.originalX = position.x;
            apple.originalY = position.y;
            
            // Añadir al grupo
            this.applesGroup.add(apple);
            
            // Animación de entrada
            apple.setScale(0);
            this.tweens.add({
                targets: apple,
                scale: 0.6,
                duration: 300,
                delay: i * 100,
                ease: 'Back.easeOut'
            });
        }
        
        console.log(`🍎 ${this.gameState.applesOnTree} manzanas creadas en el árbol`);
    }
    
    updateDisplay() {
        this.targetText.setText(this.gameState.targetQuantity.toString());
        this.collectedText.setText(this.gameState.collectedQuantity.toString());
        
        console.log(`📊 Display actualizado: Objetivo: ${this.gameState.targetQuantity}, Recolectado: ${this.gameState.collectedQuantity}`);
    }
    
    checkGameCompletion() {
        console.log(`🎯 Verificando completación: Objetivo: ${this.gameState.targetQuantity}, Recolectado: ${this.gameState.collectedQuantity}`);
        
        if (this.gameState.collectedQuantity === this.gameState.targetQuantity) {
            // ¡Correcto!
            this.showFeedback('¡Excelente! Has recolectado la cantidad correcta de manzanas', 'correct');
            this.gameState.gameCompleted = true;
            
            // Deshabilitar manzanas restantes
            this.applesGroup.children.entries.forEach(apple => {
                apple.disableInteractive();
                apple.setTint(0x888888);
            });
            
            // Efectos de celebración
            this.createCelebrationEffect();
            
        } else if (this.gameState.collectedQuantity > this.gameState.targetQuantity) {
            // Demasiadas manzanas
            this.showFeedback('¡Ups! Has recolectado demasiadas manzanas. Inténtalo de nuevo', 'incorrect');
            
            // Reiniciar después de un momento
            this.time.delayedCall(2000, () => {
                this.setupNewProblem();
            });
        }
        // Si aún no se alcanza el objetivo, continuar jugando
    }
    
    showFeedback(message, type) {
        this.feedbackText.setText(message);
        
        if (type === 'correct') {
            this.feedbackText.setColor('#32CD32');
            this.sounds.correct.play();
        } else {
            this.feedbackText.setColor('#FF6347');
            this.sounds.incorrect.play();
        }
        
        // Animación del texto
        this.feedbackText.setScale(0);
        this.tweens.add({
            targets: this.feedbackText,
            scale: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });
        
        // Limpiar mensaje después de 4 segundos
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
        // Crear partículas de celebración más elaboradas
        const centerX = 400;
        const centerY = 300;
        
        // Crear estrellas doradas
        for (let i = 0; i < 15; i++) {
            const star = this.add.star(
                centerX + Phaser.Math.Between(-200, 200),
                centerY + Phaser.Math.Between(-150, 150),
                5, 8, 16,
                0xFFD700
            );
            
            star.setScale(0);
            
            this.tweens.add({
                targets: star,
                scale: { from: 0, to: 1.5 },
                alpha: { from: 1, to: 0 },
                rotation: Math.PI * 4,
                duration: 2000,
                delay: i * 100,
                ease: 'Power2.easeOut',
                onComplete: () => {
                    star.destroy();
                }
            });
        }
        
        // Crear círculos de colores
        const colors = [0xFF6B6B, 0x4ECDC4, 0x45B7D1, 0x96CEB4, 0xFECA57];
        for (let i = 0; i < 10; i++) {
            const circle = this.add.circle(
                centerX,
                centerY,
                Phaser.Math.Between(5, 15),
                colors[i % colors.length]
            );
            
            const angle = (i / 10) * Math.PI * 2;
            const distance = Phaser.Math.Between(100, 200);
            
            this.tweens.add({
                targets: circle,
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                scale: { from: 0, to: 1 },
                alpha: { from: 1, to: 0 },
                duration: 1500,
                delay: i * 50,
                ease: 'Power2.easeOut',
                onComplete: () => {
                    circle.destroy();
                }
            });
        }
        
        // Crear efecto de ondas expansivas
        for (let i = 0; i < 3; i++) {
            const wave = this.add.circle(centerX, centerY, 10, 0xFFFFFF, 0);
            wave.setStrokeStyle(4, 0x32CD32, 0.8);
            
            this.tweens.add({
                targets: wave,
                scale: { from: 0, to: 8 },
                alpha: { from: 0.8, to: 0 },
                duration: 1000,
                delay: i * 300,
                ease: 'Power2.easeOut',
                onComplete: () => {
                    wave.destroy();
                }
            });
        }
        
        // Hacer que el árbol se mueva ligeramente
        this.tweens.add({
            targets: this.treeSprite,
            scale: { from: 0.8, to: 0.9 },
            duration: 300,
            repeat: 3,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });
        
        console.log('🎉 Efecto de celebración mejorado creado');
    }
    
    playPickupSound() {
        // Sonido sintético para recoger
        this.createSyntheticSound(600, 800, 0.1);
    }
    
    playDropSound() {
        // Sonido sintético para soltar
        this.createSyntheticSound(400, 300, 0.2);
    }
    
    createSyntheticSound(startFreq, endFreq, duration) {
        // Implementación simplificada usando Phaser
        console.log(`🔊 Reproduciendo sonido sintético: ${startFreq}Hz -> ${endFreq}Hz`);
    }
    
    // Método público para reiniciar el juego
    resetGame() {
        this.setupNewProblem();
        console.log('🔄 Juego reiniciado');
    }
}

