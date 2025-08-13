class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        
        // Estado del juego
        this.gameState = {
            targetNumber: 0,
            balloonGroups: [],
            gameCompleted: false,
            selectedGroups: new Set(),
            correctGroups: [],
            score: 0
        };
        
        // Configuración del juego
        this.gameConfig = {
            maxBalloons: 6,
            minBalloons: 1,
            numberOfGroups: 3,
            balloonColors: ['red', 'blue', 'green', 'yellow', 'purple'],
            groupPositions: [
                { x: 150, y: 300 },
                { x: 400, y: 300 },
                { x: 650, y: 300 }
            ]
        };
        
        // Grupos de objetos
        this.balloonGroupSprites = [];
        this.groupBackgrounds = [];
        
        // UI Elements
        this.targetText = null;
        this.instructionText = null;
        this.feedbackText = null;
        this.scoreText = null;
        
        // Sonidos
        this.sounds = {};
    }
    
    preload() {
        // Cargar assets de globos
        this.load.image('balloon-red', 'assets/images/balloon_red.png');
        this.load.image('balloon-blue', 'assets/images/balloon_blue.png');
        this.load.image('balloon-green', 'assets/images/balloon_green.png');
        this.load.image('balloon-yellow', 'assets/images/balloon_yellow.png');
        this.load.image('balloon-purple', 'assets/images/balloon_purple.png');
        
        // Cargar otros assets
        this.load.image('sky-background', 'assets/images/sky_background.png');
        this.load.image('basket', 'assets/images/basket.png');
    }
    
    create() {
        // Configurar el mundo del juego
        this.setupWorld();
        
        // Configurar sonidos
        this.setupSounds();
        
        // Configurar UI
        this.setupUI();
        
        // Configurar eventos de entrada (CLIC en lugar de arrastre)
        this.setupInput();
        
        // Iniciar nuevo problema
        this.setupNewProblem();
        
        console.log('🎮 GameScene mejorado creado correctamente');
    }
    
    setupWorld() {
        // Fondo del cielo con imagen
        const background = this.add.image(400, 300, 'sky-background');
        background.setDisplaySize(800, 600);
        
        // Sol animado
        const sun = this.add.circle(700, 100, 40, 0xFFD700);
        sun.setStrokeStyle(3, 0xFFA500);
        
        // Rayos del sol (animados)
        this.createSunRays();
        
        console.log('🌍 Mundo del juego mejorado configurado');
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
        }
    }
    
    setupSounds() {
        // Sonidos sintéticos simples
        console.log('🔊 Sonidos configurados');
    }
    
    setupUI() {
        // Título del juego
        this.add.text(400, 50, 'Juego de Menor Que - Globos (Mejorado)', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#2F4F4F',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Instrucción
        this.instructionText = this.add.text(400, 90, 'Haz clic en TODOS los grupos con MENOS globos que:', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#4169E1',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Número objetivo
        this.targetText = this.add.text(400, 120, '0', {
            fontSize: '36px',
            fontFamily: 'Arial',
            color: '#FF6347',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Fondo blanco para el número
        this.targetBackground = this.add.rectangle(400, 120, 80, 50, 0xFFFFFF);
        this.targetBackground.setStrokeStyle(2, 0x4169E1);
        this.targetText.setDepth(1);
        
        // Mensaje de retroalimentación
        this.feedbackText = this.add.text(400, 500, '', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#FF6347',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);
        
        // Texto de puntuación
        this.scoreText = this.add.text(400, 530, '', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#4169E1',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);
        
        console.log('🎨 UI mejorada configurada');
    }
    
    setupInput() {
        // Configurar eventos de CLIC en lugar de arrastre
        this.input.on('gameobjectdown', (pointer, gameObject) => {
            if (gameObject.groupIndex !== undefined && !this.gameState.gameCompleted) {
                this.selectGroup(gameObject.groupIndex);
            }
        });
        
        console.log('🖱️ Eventos de clic configurados');
    }
    
    selectGroup(groupIndex) {
        const selectedGroup = this.gameState.balloonGroups[groupIndex];
        const isCorrect = selectedGroup.count < this.gameState.targetNumber;
        
        // Si ya fue seleccionado, deseleccionar
        if (this.gameState.selectedGroups.has(groupIndex)) {
            this.gameState.selectedGroups.delete(groupIndex);
            this.unhighlightGroup(groupIndex);
            this.playDeselectSound();
            this.updateScoreDisplay();
            return;
        }
        
        console.log(`🎯 Seleccionando grupo ${groupIndex}: ${selectedGroup.count} globos, Objetivo: < ${this.gameState.targetNumber}, Correcto: ${isCorrect}`);
        
        if (isCorrect) {
            // ¡Correcto!
            this.gameState.selectedGroups.add(groupIndex);
            this.highlightGroup(groupIndex, 'correct');
            this.playCorrectSound();
            
            // Verificar si se completó el juego
            this.checkGameCompletion();
            
        } else {
            // Incorrecto
            this.highlightGroup(groupIndex, 'incorrect');
            this.showFeedback(`¡Ups! ${selectedGroup.count} NO es menor que ${this.gameState.targetNumber}`, 'incorrect');
            this.playIncorrectSound();
            
            // Quitar el resaltado después de un momento
            this.time.delayedCall(1000, () => {
                this.unhighlightGroup(groupIndex);
            });
        }
        
        this.updateScoreDisplay();
    }
    
    highlightGroup(groupIndex, type) {
        const groupSprites = this.balloonGroupSprites[groupIndex];
        const background = this.groupBackgrounds[groupIndex];
        
        if (type === 'correct') {
            // Resaltar en verde para correcto
            background.setFillStyle(0x32CD32, 0.3);
            background.setStrokeStyle(3, 0x228B22);
            groupSprites.forEach(balloon => {
                balloon.setTint(0xFFFFFF); // Sin tinte para mantener colores originales
            });
            
            // Animación de éxito
            this.tweens.add({
                targets: groupSprites,
                scale: 0.45,
                duration: 200,
                yoyo: true,
                ease: 'Back.easeOut'
            });
            
        } else if (type === 'incorrect') {
            // Resaltar en rojo para incorrecto
            background.setFillStyle(0xFF6347, 0.3);
            background.setStrokeStyle(3, 0xDC143C);
            groupSprites.forEach(balloon => {
                balloon.setTint(0xFF6347);
            });
            
            // Animación de error (sacudir)
            this.tweens.add({
                targets: groupSprites,
                x: '+=10',
                duration: 100,
                yoyo: true,
                repeat: 3,
                ease: 'Power2.easeInOut'
            });
        }
    }
    
    unhighlightGroup(groupIndex) {
        const groupSprites = this.balloonGroupSprites[groupIndex];
        const background = this.groupBackgrounds[groupIndex];
        
        // Restaurar apariencia normal
        background.setFillStyle(0xFFFFFF, 0.1);
        background.setStrokeStyle(2, 0x87CEEB);
        groupSprites.forEach(balloon => {
            balloon.clearTint();
            balloon.setScale(0.4); // Restaurar escala original
        });
    }
    
    checkGameCompletion() {
        const correctGroupsCount = this.gameState.correctGroups.length;
        const selectedCorrectCount = Array.from(this.gameState.selectedGroups).filter(index => 
            this.gameState.correctGroups.includes(index)
        ).length;
        
        if (selectedCorrectCount === correctGroupsCount) {
            // ¡Juego completado!
            this.gameState.gameCompleted = true;
            this.gameState.score += correctGroupsCount * 10;
            
            this.showFeedback(`¡EXCELENTE! Encontraste todos los ${correctGroupsCount} grupos correctos`, 'complete');
            this.createCelebrationEffect();
            
            // Nuevo problema después de un momento
            this.time.delayedCall(4000, () => {
                this.setupNewProblem();
            });
        } else {
            // Mostrar progreso
            this.showFeedback(`¡Bien! Grupo correcto. Busca ${correctGroupsCount - selectedCorrectCount} más`, 'progress');
        }
    }
    
    setupNewProblem() {
        console.log('🔄 Configurando nuevo problema mejorado...');
        
        // Limpiar estado anterior
        this.clearGame();
        
        // Generar nuevo problema
        this.gameState.targetNumber = Phaser.Math.Between(2, this.gameConfig.maxBalloons);
        this.gameState.balloonGroups = [];
        this.gameState.gameCompleted = false;
        this.gameState.selectedGroups.clear();
        this.gameState.correctGroups = [];
        
        // Generar grupos de globos
        this.generateBalloonGroups();
        
        // Crear sprites de los grupos
        this.createBalloonGroupSprites();
        
        // Actualizar display
        this.updateDisplay();
        
        // Limpiar mensajes
        this.feedbackText.setText('');
        this.updateScoreDisplay();
        
        console.log('🎈 Nuevo problema mejorado generado:', this.gameState);
    }
    
    generateBalloonGroups() {
        const usedCounts = new Set();
        
        for (let i = 0; i < this.gameConfig.numberOfGroups; i++) {
            let count;
            
            // Generar cantidad única
            do {
                count = Phaser.Math.Between(1, this.gameConfig.maxBalloons);
            } while (usedCounts.has(count));
            
            usedCounts.add(count);
            
            const color = this.gameConfig.balloonColors[i % this.gameConfig.balloonColors.length];
            
            this.gameState.balloonGroups.push({
                count: count,
                color: color,
                position: this.gameConfig.groupPositions[i]
            });
            
            // Marcar como correcto si es menor que el objetivo
            if (count < this.gameState.targetNumber) {
                this.gameState.correctGroups.push(i);
            }
        }
        
        // Asegurar que haya al menos un grupo correcto
        if (this.gameState.correctGroups.length === 0) {
            // Cambiar el primer grupo para que sea correcto
            this.gameState.balloonGroups[0].count = this.gameState.targetNumber - 1;
            this.gameState.correctGroups.push(0);
        }
        
        // Mezclar las posiciones para mayor variedad
        const positions = [...this.gameConfig.groupPositions];
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }
        
        this.gameState.balloonGroups.forEach((group, index) => {
            group.position = positions[index];
        });
    }
    
    createBalloonGroupSprites() {
        this.balloonGroupSprites = [];
        this.groupBackgrounds = [];
        
        this.gameState.balloonGroups.forEach((group, groupIndex) => {
            const groupSprites = [];
            const baseX = group.position.x;
            const baseY = group.position.y;
            
            // Crear fondo del grupo (área clickeable)
            const background = this.add.rectangle(baseX, baseY, 120, 120, 0xFFFFFF, 0.1);
            background.setStrokeStyle(2, 0x87CEEB);
            background.setInteractive();
            background.groupIndex = groupIndex;
            this.groupBackgrounds.push(background);
            
            // Crear etiqueta con el número de globos
            const countLabel = this.add.text(baseX, baseY + 70, group.count.toString(), {
                fontSize: '20px',
                fontFamily: 'Arial',
                color: '#2F4F4F',
                fontStyle: 'bold',
                backgroundColor: '#FFFFFF',
                padding: { x: 8, y: 4 }
            }).setOrigin(0.5);
            countLabel.setInteractive();
            countLabel.groupIndex = groupIndex;
            
            for (let i = 0; i < group.count; i++) {
                // Posicionar globos en una formación más compacta
                const angle = (i / group.count) * Math.PI * 2;
                const radius = Math.min(30, 15 + group.count * 3);
                const x = baseX + Math.cos(angle) * radius;
                const y = baseY + Math.sin(angle) * radius - 10;
                
                const balloon = this.add.image(x, y, `balloon-${group.color}`);
                balloon.setScale(0.4);
                balloon.setInteractive();
                
                // Guardar información del grupo
                balloon.groupIndex = groupIndex;
                balloon.originalX = x;
                balloon.originalY = y;
                balloon.originalScale = 0.4;
                
                // Animación de entrada
                balloon.setScale(0);
                this.tweens.add({
                    targets: balloon,
                    scale: 0.4,
                    duration: 300,
                    delay: i * 100,
                    ease: 'Back.easeOut'
                });
                
                // Animación de flotación
                this.tweens.add({
                    targets: balloon,
                    y: y - 5,
                    duration: 2000 + Math.random() * 1000,
                    repeat: -1,
                    yoyo: true,
                    ease: 'Sine.easeInOut'
                });
                
                groupSprites.push(balloon);
            }
            
            this.balloonGroupSprites.push(groupSprites);
        });
    }
    
    clearGame() {
        // Limpiar globos existentes
        this.balloonGroupSprites.forEach(group => {
            group.forEach(balloon => {
                balloon.destroy();
            });
        });
        this.balloonGroupSprites = [];
        
        // Limpiar fondos de grupos
        this.groupBackgrounds.forEach(bg => bg.destroy());
        this.groupBackgrounds = [];
        
        console.log('🧹 Juego mejorado limpiado');
    }
    
    updateDisplay() {
        this.targetText.setText(this.gameState.targetNumber.toString());
        
        // Actualizar contador en el DOM
        const correctCountElement = document.getElementById('correct-count');
        const totalCorrectElement = document.getElementById('total-correct');
        
        if (correctCountElement && totalCorrectElement) {
            correctCountElement.textContent = this.gameState.selectedGroups.size;
            totalCorrectElement.textContent = this.gameState.correctGroups.length;
        }
        
        console.log(`📊 Display actualizado: Objetivo: < ${this.gameState.targetNumber}, Grupos correctos: ${this.gameState.correctGroups.length}`);
    }
    
    updateScoreDisplay() {
        const selectedCorrectCount = Array.from(this.gameState.selectedGroups).filter(index => 
            this.gameState.correctGroups.includes(index)
        ).length;
        
        this.scoreText.setText(`Puntuación: ${this.gameState.score} | Seleccionados: ${selectedCorrectCount}/${this.gameState.correctGroups.length}`);
        
        // Actualizar contador en el DOM
        const correctCountElement = document.getElementById('correct-count');
        if (correctCountElement) {
            correctCountElement.textContent = selectedCorrectCount;
        }
    }
    
    showFeedback(message, type) {
        this.feedbackText.setText(message);
        
        if (type === 'correct' || type === 'complete' || type === 'progress') {
            this.feedbackText.setColor('#32CD32');
        } else {
            this.feedbackText.setColor('#FF6347');
        }
        
        // Animación del texto
        this.feedbackText.setScale(0);
        this.tweens.add({
            targets: this.feedbackText,
            scale: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });
        
        // Limpiar mensaje después de un tiempo
        const delay = type === 'complete' ? 4000 : 2000;
        this.time.delayedCall(delay, () => {
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
        // Crear partículas de celebración con globos
        const centerX = 400;
        const centerY = 300;
        
        // Crear globos de celebración
        for (let i = 0; i < 15; i++) {
            const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            const celebrationBalloon = this.add.image(
                centerX + Phaser.Math.Between(-150, 150),
                centerY + Phaser.Math.Between(-100, 100),
                `balloon-${color}`
            );
            
            celebrationBalloon.setScale(0.3);
            celebrationBalloon.setAlpha(0.8);
            
            this.tweens.add({
                targets: celebrationBalloon,
                y: celebrationBalloon.y - 300,
                alpha: 0,
                rotation: Math.PI * 2,
                duration: 3000,
                delay: i * 100,
                ease: 'Power2.easeOut',
                onComplete: () => {
                    celebrationBalloon.destroy();
                }
            });
        }
        
        // Crear estrellas doradas
        for (let i = 0; i < 12; i++) {
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
                rotation: Math.PI * 2,
                duration: 2000,
                delay: i * 150,
                ease: 'Power2.easeOut',
                onComplete: () => {
                    star.destroy();
                }
            });
        }
        
        console.log('🎉 Efecto de celebración mejorado creado');
    }
    
    playCorrectSound() {
        console.log('🔊 Sonido de respuesta correcta');
    }
    
    playIncorrectSound() {
        console.log('🔊 Sonido de respuesta incorrecta');
    }
    
    playDeselectSound() {
        console.log('🔊 Sonido de deselección');
    }
    
    // Método público para reiniciar el juego
    resetGame() {
        this.setupNewProblem();
        console.log('🔄 Juego mejorado reiniciado');
    }
}

