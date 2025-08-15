class CarreraMayorQueScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CarreraMayorQueScene' });
        
        // Estado del juego
        this.gameState = {
            targetNumber: 5,
            carNumbers: [7, 3],
            correctCarIndex: 0,
            level: 1,
            score: 0,
            gameActive: false,
            timeRemaining: 10,
            carsMoving: false,
            gamePhase: 'waiting', // 'waiting', 'moving', 'finished'
            selectionMade: false,
            sessionStartTime: null,
            totalPlayTime: 0
        };

        // Objetos del juego
        this.cars = [];
        this.carNumbers = [];
        this.carMovementTweens = [];
        this.finishLine = null;
        this.instructionText = null;
        this.targetNumberText = null;
        this.levelText = null;
        this.scoreText = null;
        this.feedbackText = null;
        this.timerText = null;
        this.timerBar = null;
        this.timerBarBg = null;
        this.countdownTimer = null;
        
        // Estado del progreso
        this.userProgress = null;
        this.progressLoaded = false;
    }

    preload() {
        this.createAssets();
        console.log('🚗 Assets del juego mejorado cargados');
    }

   createAssets() {
        // Crear sprite de coche rojo mejorado - estilo deportivo convertible (más grande y claro)
        this.add.graphics()
            // Cuerpo principal del coche con forma aerodinámica
            .fillStyle(0xFF0000) // Rojo brillante
            .beginPath()
            .moveTo(20, 50) // Inicio parte delantera
            .lineTo(30, 30) // Capó inclinado
            .lineTo(50, 20) // Parte superior delantera
            .lineTo(110, 20) // Techo/línea superior
            .lineTo(140, 30) // Bajada trasera
            .lineTo(150, 50) // Final trasero
            .lineTo(150, 60) // Parte inferior trasera
            .lineTo(20, 60) // Parte inferior delantera
            .closePath()
            .fill()
            
            // Detalles del cuerpo
            .fillStyle(0xDD0000) // Rojo más oscuro para sombras
            .fillRoundedRect(24, 36, 120, 24, 8) // Línea central del cuerpo
            
            // Ruedas más grandes y realistas
            .fillStyle(0x444444) // Llantas
            .fillCircle(44, 70, 18) // Rueda delantera
            .fillCircle(126, 70, 18) // Rueda trasera
            .fillStyle(0x666666) // Detalles de las llantas
            .fillCircle(44, 70, 12)
            .fillCircle(126, 70, 12)
            .fillStyle(0x888888) // Centro de las llantas
            .fillCircle(44, 70, 6)
            .fillCircle(126, 70, 6)
            
            // Faros delanteros más realistas y claramente frontales
            .fillStyle(0xFFFFFF)
            .fillEllipse(25, 40, 12, 8) // Faro delantero principal
            .fillEllipse(25, 50, 10, 6) // Faro delantero secundario
            .fillStyle(0xF0F0F0) // Reflejo en los faros
            .fillEllipse(25, 38, 6, 4)
            .fillEllipse(25, 48, 5, 3)
            
            // Parabrisas y detalles (más grande y definido)
            .fillStyle(0x87CEEB) // Azul claro para simular cristal
            .fillRoundedRect(56, 24, 50, 16, 4) // Parabrisas principal
            
            // Marco del parabrisas para mayor claridad
            .lineStyle(2, 0x333333)
            .strokeRoundedRect(56, 24, 50, 16, 4)
            
            // Detalles adicionales del convertible
            .fillStyle(0x333333) // Detalles negros
            .fillRect(50, 40, 4, 16) // Pilar A
            .fillRect(116, 40, 4, 16) // Pilar B
            
            // Luces traseras claramente identificables
            .fillStyle(0xFF6666)
            .fillEllipse(144, 40, 6, 8) // Luz trasera superior
            .fillEllipse(144, 50, 6, 8) // Luz trasera inferior
            
            // Indicador de dirección frontal (para clarificar la parte delantera)
            .fillStyle(0xFFA500) // Naranja para intermitente
            .fillEllipse(30, 35, 4, 3) // Intermitente delantero
            
            // Rejilla delantera para mayor claridad
            .fillStyle(0x666666)
            .fillRoundedRect(20, 42, 8, 12, 2) // Rejilla frontal
            
            .generateTexture('car_red', 170, 100);

        // Crear sprite de coche azul mejorado - mismo estilo
        this.add.graphics()
            // Cuerpo principal del coche con forma aerodinámica
            .fillStyle(0x0066FF) // Azul brillante
            .beginPath()
            .moveTo(20, 50)
            .lineTo(30, 30)
            .lineTo(50, 20)
            .lineTo(110, 20)
            .lineTo(140, 30)
            .lineTo(150, 50)
            .lineTo(150, 60)
            .lineTo(20, 60)
            .closePath()
            .fill()
            
            // Detalles del cuerpo
            .fillStyle(0x0044DD)
            .fillRoundedRect(24, 36, 120, 24, 8)
            
            // Ruedas más grandes y realistas
            .fillStyle(0x444444)
            .fillCircle(44, 70, 18)
            .fillCircle(126, 70, 18)
            .fillStyle(0x666666)
            .fillCircle(44, 70, 12)
            .fillCircle(126, 70, 12)
            .fillStyle(0x888888)
            .fillCircle(44, 70, 6)
            .fillCircle(126, 70, 6)
            
            // Faros delanteros más realistas y claramente frontales
            .fillStyle(0xFFFFFF)
            .fillEllipse(25, 40, 12, 8)
            .fillEllipse(25, 50, 10, 6)
            .fillStyle(0xF0F0F0)
            .fillEllipse(25, 38, 6, 4)
            .fillEllipse(25, 48, 5, 3)
            
            // Parabrisas y detalles (más grande y definido)
            .fillStyle(0x87CEEB)
            .fillRoundedRect(56, 24, 50, 16, 4)
            
            // Marco del parabrisas para mayor claridad
            .lineStyle(2, 0x333333)
            .strokeRoundedRect(56, 24, 50, 16, 4)
            
            // Detalles adicionales del convertible
            .fillStyle(0x333333)
            .fillRect(50, 40, 4, 16)
            .fillRect(116, 40, 4, 16)
            
            // Luces traseras claramente identificables
            .fillStyle(0x6666FF)
            .fillEllipse(144, 40, 6, 8)
            .fillEllipse(144, 50, 6, 8)
            
            // Indicador de dirección frontal
            .fillStyle(0xFFA500)
            .fillEllipse(30, 35, 4, 3)
            
            // Rejilla delantera para mayor claridad
            .fillStyle(0x666666)
            .fillRoundedRect(20, 42, 8, 12, 2)
            
            .generateTexture('car_blue', 170, 100);
            
        // Crear línea de meta mejorada
        const graphics = this.add.graphics();
        for (let i = 0; i < 8; i++) {
            const color = i % 2 === 0 ? 0x000000 : 0xFFFFFF;
            graphics.fillStyle(color);
            graphics.fillRect(0, i * 25, 30, 25);
        }
        graphics.generateTexture('finish_line', 30, 200);
        graphics.destroy();

        // Crear textura de pista mejorada
        const trackGraphics = this.add.graphics();
        // Fondo de la pista
        trackGraphics.fillStyle(0x404040);
        trackGraphics.fillRect(0, 0, 900, 200);
        
        // Líneas de los carriles
        trackGraphics.lineStyle(4, 0xFFFFFF);
        trackGraphics.lineBetween(0, 100, 900, 100); // Línea central
        
        // Líneas discontinuas en los carriles
        trackGraphics.lineStyle(2, 0xFFFF00);
        for (let i = 0; i < 18; i++) {
            trackGraphics.lineBetween(i * 50 + 25, 50, i * 50 + 45, 50);   // Carril superior
            trackGraphics.lineBetween(i * 50 + 25, 150, i * 50 + 45, 150); // Carril inferior
        }
        
        trackGraphics.generateTexture('track_improved', 900, 200);
        trackGraphics.destroy();

        // Crear botones mejorados
        this.add.graphics()
            .fillStyle(0x4CAF50)
            .fillRoundedRect(0, 0, 150, 40, 8)
            .lineStyle(2, 0x45a049)
            .strokeRoundedRect(0, 0, 150, 40, 8)
            .generateTexture('button_green', 150, 40);

        this.add.graphics()
            .fillStyle(0x2196F3)
            .fillRoundedRect(0, 0, 150, 40, 8)
            .lineStyle(2, 0x1976D2)
            .strokeRoundedRect(0, 0, 150, 40, 8)
            .generateTexture('button_blue', 150, 40);
    }

    create() {
        this.setupWorld();
        this.setupUI();
        this.setupInput();
        this.loadUserProgress();
        console.log('🎮 CarreraMayorQueScene mejorada creada correctamente');
    }

    setupWorld() {
        // Fondo del cielo con gradiente
        const sky = this.add.graphics();
        sky.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xE0F6FF, 0xE0F6FF);
        sky.fillRect(0, 0, 900, 600);
        
        // Sol animado
        const sun = this.add.circle(750, 80, 35, 0xFFD700);
        sun.setStrokeStyle(3, 0xFFA500);
        this.tweens.add({
            targets: sun,
            scale: { from: 1, to: 1.1 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Nubes animadas
        this.createAnimatedClouds();
        
        // Césped
        this.add.rectangle(450, 550, 900, 100, 0x90EE90);
        
        // Árboles decorativos - CORREGIDO: Posicionados para no ser tapados por la pista
        this.createTrees();
        
        // Pista de carreras mejorada
        this.track = this.add.image(450, 400, 'track_improved');
        
        // Línea de meta
        this.finishLine = this.add.image(window.GAME_CONFIG.FINISH_LINE_X, 400, 'finish_line');
        
        // Etiqueta de meta
        this.add.text(window.GAME_CONFIG.FINISH_LINE_X, 280, 'META', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#FF6347',
            fontStyle: 'bold',
            backgroundColor: '#FFFFFF',
            padding: { x: 10, y: 6 }
        }).setOrigin(0.5);
    }

    createAnimatedClouds() {
        // Nube 1
        const cloud1 = this.add.group();
        cloud1.add(this.add.circle(150, 100, 25, 0xFFFFFF, 0.8));
        cloud1.add(this.add.circle(170, 90, 30, 0xFFFFFF, 0.8));
        cloud1.add(this.add.circle(190, 100, 25, 0xFFFFFF, 0.8));
        
        // Nube 2
        const cloud2 = this.add.group();
        cloud2.add(this.add.circle(500, 120, 20, 0xFFFFFF, 0.8));
        cloud2.add(this.add.circle(515, 115, 25, 0xFFFFFF, 0.8));
        cloud2.add(this.add.circle(530, 120, 20, 0xFFFFFF, 0.8));
        
        // Animación de flotación
        this.tweens.add({
            targets: cloud1.children.entries,
            x: '+=200',
            duration: 40000,
            repeat: -1,
            ease: 'Linear'
        });
        
        this.tweens.add({
            targets: cloud2.children.entries,
            x: '+=150',
            duration: 35000,
            repeat: -1,
            ease: 'Linear'
        });
    }

    createTrees() {
        // Árboles a los lados de la pista - CORREGIDO: Posicionados más abajo para no ser tapados
        const treePositions = [
            { x: 50, y: 570 }, { x: 120, y: 580 }, { x: 780, y: 575 }, { x: 850, y: 585 }
        ];
        
        treePositions.forEach(pos => {
            // Tronco
            this.add.rectangle(pos.x, pos.y, 15, 40, 0x8B4513);
            // Copa
            this.add.circle(pos.x, pos.y - 25, 25, 0x228B22);
        });
    }

    setupUI() {
        // Título del juego
        this.add.text(450, 50, '🚗 Carrera Mayor Que 🏁', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#2F4F4F',
            fontStyle: 'bold',
            stroke: '#FFFFFF',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Panel de información superior
        const infoPanel = this.add.rectangle(450, 120, 800, 80, 0xFFFFFF, 0.9);
        infoPanel.setStrokeStyle(2, 0x4CAF50);
        
        // Instrucción
        this.instructionText = this.add.text(450, 100, '', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#2F4F4F',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Número objetivo
        this.targetNumberText = this.add.text(450, 130, '', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#FF6347',
            fontStyle: 'bold',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5);
        
        // Información de nivel y puntos (esquina superior izquierda)
        this.levelText = this.add.text(30, 30, 'Nivel: 1', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#2F4F4F',
            fontStyle: 'bold',
            padding: { x: 12, y: 8 }
        });
        
        this.scoreText = this.add.text(30, 65, 'Puntos: 0', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#2F4F4F',
            fontStyle: 'bold',
            padding: { x: 12, y: 8 }
        });
        
        // Timer (esquina superior derecha)
        this.timerText = this.add.text(870, 30, 'Tiempo: 10', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#FF6347',
            fontStyle: 'bold',
            padding: { x: 12, y: 8 }
        }).setOrigin(1, 0);
        
        // Barra de tiempo - CORREGIDO: Ahora se llena de izquierda a derecha
        this.timerBarBg = this.add.rectangle(750, 65, 200, 15, 0x666666);

        // Crea la barra con un ancho inicial de 200
        this.timerBar = this.add.rectangle(650, 65, 200, 15, 0x4CAF50);
        this.timerBar.setOrigin(0, 0.5); // Muy importante: origen a la izquierda
        this.timerBar.setDisplaySize(0, 15); // Luego la haces invisible
        
        // Mensaje de retroalimentación
        this.feedbackText = this.add.text(450, 200, '', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#32CD32',
            fontStyle: 'bold',
            padding: { x: 20, y: 15 }
        }).setOrigin(0.5);
        this.feedbackText.setVisible(false);
        
        // Botones
        this.createButtons();
    }

    createButtons() {
        // Botón Nuevo Problema
        const newProblemBtn = this.add.image(300, 550, 'button_green');
        const newProblemText = this.add.text(300, 550, 'Nuevo Problema', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        newProblemBtn.setInteractive({ useHandCursor: true });
        newProblemBtn.on('pointerdown', () => this.setupNewProblem());
        newProblemBtn.on('pointerover', () => newProblemBtn.setTint(0x45a049));
        newProblemBtn.on('pointerout', () => newProblemBtn.clearTint());
        
        // Botón Ayuda
        const helpBtn = this.add.image(600, 550, 'button_blue');
        const helpText = this.add.text(600, 550, 'Ayuda', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        helpBtn.setInteractive({ useHandCursor: true });
        helpBtn.on('pointerdown', () => this.showHelp());
        helpBtn.on('pointerover', () => helpBtn.setTint(0x1976D2));
        helpBtn.on('pointerout', () => helpBtn.clearTint());
    }

    setupInput() {
        // Los eventos de clic se configurarán cuando se creen los coches
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
        const welcomeText = this.add.text(450, 250, `¡Bienvenido de vuelta! 🎮\nTu puntuación anterior: ${this.userProgress.puntuacion} puntos`, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#4CAF50',
            fontStyle: 'bold',
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: { x: 20, y: 15 },
            align: 'center'
        }).setOrigin(0.5);
        
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

    setupNewProblem() {
        this.clearGame();
        this.generateProblem();
        this.createCars();
        this.updateDisplay();
        this.clearFeedback();
        this.startCarMovement();
        this.startTimer();
        
        // Inicializar tiempo de sesión si es la primera vez
        if (!this.gameState.sessionStartTime) {
            this.gameState.sessionStartTime = Date.now();
        }
        
        this.gameState.gameActive = true;
        this.gameState.gamePhase = 'moving';
        this.gameState.selectionMade = false;
        
        console.log('🚗 Nuevo problema generado:', this.gameState);
    }

    clearGame() {
        // Limpiar carritos
        this.cars.forEach(car => {
            if (car) car.destroy();
        });
        this.cars = [];
        
        // Limpiar números de carritos
        this.carNumbers.forEach(number => {
            if (number) number.destroy();
        });
        this.carNumbers = [];
        
        // Detener tweens de movimiento
        this.carMovementTweens.forEach(tween => {
            if (tween) tween.stop();
        });
        this.carMovementTweens = [];
        
        // Detener timer
        if (this.countdownTimer) {
            this.countdownTimer.remove();
            this.countdownTimer = null;
        }
        
        this.gameState.carsMoving = false;
        this.gameState.gamePhase = 'waiting';
    }

    generateProblem() {
        // Ajustar rango según el nivel
        const levelMultiplier = Math.floor((this.gameState.level - 1) / 3);
        const maxNum = Math.min(window.GAME_CONFIG.MAX_NUMBER + levelMultiplier * 2, 15);
        
        // Generar número objetivo
        this.gameState.targetNumber = Math.floor(Math.random() * (maxNum - 2)) + window.GAME_CONFIG.MIN_NUMBER;
        
        // Generar números para los coches
        const correctNumber = Math.floor(Math.random() * (maxNum - this.gameState.targetNumber)) + this.gameState.targetNumber + 1;
        const incorrectNumber = Math.floor(Math.random() * this.gameState.targetNumber) + window.GAME_CONFIG.MIN_NUMBER;
        
        // Asignar aleatoriamente a los coches
        if (Math.random() < 0.5) {
            this.gameState.carNumbers = [correctNumber, incorrectNumber];
            this.gameState.correctCarIndex = 0;
        } else {
            this.gameState.carNumbers = [incorrectNumber, correctNumber];
            this.gameState.correctCarIndex = 1;
        }
        
        // Resetear tiempo
        this.gameState.timeRemaining = window.GAME_CONFIG.SELECTION_TIME;
    }

    createCars() {
        const carTypes = ['car_red', 'car_blue'];
        
        for (let i = 0; i < 2; i++) {
            const startX = window.GAME_CONFIG.CAR_START_X;
            const laneY = window.GAME_CONFIG.CAR_LANE_Y[i];
            
            // Crear coche
            const car = this.add.image(startX, laneY, carTypes[i]);
            car.setScale(0.8);
            car.setInteractive({ useHandCursor: true });
            
            // Configurar eventos del coche
            car.on('pointerdown', () => this.selectCar(i));
            car.on('pointerover', () => {
                if (this.gameState.gameActive) {
                    car.setScale(0.9);
                    car.setTint(0xFFFFAA);
                }
            });
            car.on('pointerout', () => {
                car.setScale(0.8);
                car.clearTint();
            });
            
            // Crear número del coche
            const numberText = this.add.text(startX, laneY - 50, this.gameState.carNumbers[i].toString(), {
                fontSize: '32px',
                fontFamily: 'Arial',
                color: '#FFFFFF',
                fontStyle: 'bold',
                backgroundColor: '#000000',
                padding: { x: 15, y: 10 }
            }).setOrigin(0.5);
            
            // Animación de entrada
            car.setScale(0);
            numberText.setScale(0);
            
            this.tweens.add({
                targets: car,
                scale: 0.8,
                duration: 400,
                delay: i * 150,
                ease: 'Back.easeOut'
            });
            
            this.tweens.add({
                targets: numberText,
                scale: 1,
                duration: 400,
                delay: i * 150 + 200,
                ease: 'Back.easeOut'
            });
            
            this.cars.push(car);
            this.carNumbers.push(numberText);
        }
    }

    startCarMovement() {
        this.gameState.carsMoving = true;
        
        // Iniciar movimiento lento de ambos carritos
        for (let i = 0; i < 2; i++) {
            const car = this.cars[i];
            const numberText = this.carNumbers[i];
            
            // Calcular duración para velocidad constante
            const distance = window.GAME_CONFIG.FINISH_LINE_X - window.GAME_CONFIG.CAR_START_X;
            const duration = (distance / window.GAME_CONFIG.CAR_BASE_SPEED) * 1000;
            
            // Crear tween de movimiento lento
            const movementTween = this.tweens.add({
                targets: [car, numberText],
                x: window.GAME_CONFIG.FINISH_LINE_X,
                duration: duration,
                ease: 'Linear',
                onComplete: () => {
                    // Si llegan a la meta sin selección, continuar hasta desaparecer
                    if (this.gameState.gamePhase === 'moving') {
                        this.moveCarsToDisappear(i);
                    }
                }
            });
            
            this.carMovementTweens.push(movementTween);
        }
    }

    moveCarsToDisappear(carIndex) {
        const car = this.cars[carIndex];
        const numberText = this.carNumbers[carIndex];
        
        if (!car || !numberText) return;
        
        // Continuar movimiento hasta desaparecer
        const remainingDistance = window.GAME_CONFIG.DISAPPEAR_X - window.GAME_CONFIG.FINISH_LINE_X;
        const duration = (remainingDistance / window.GAME_CONFIG.CAR_BASE_SPEED) * 1000;
        
        this.tweens.add({
            targets: [car, numberText],
            x: window.GAME_CONFIG.DISAPPEAR_X,
            duration: duration,
            ease: 'Linear',
            onComplete: () => {
                car.setVisible(false);
                numberText.setVisible(false);
            }
        });
    }

    startTimer() {
        this.gameState.timeRemaining = window.GAME_CONFIG.SELECTION_TIME;
        
        this.countdownTimer = this.time.addEvent({
            delay: 100,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    updateTimer() {
        this.gameState.timeRemaining -= 0.1;
        
        if (this.gameState.timeRemaining <= 0) {
            this.gameState.timeRemaining = 0;
            this.handleTimeUp();
            return;
        }
        
        // Actualizar display del timer
        this.timerText.setText(`Tiempo: ${Math.ceil(this.gameState.timeRemaining)}`);
        
        // CORREGIDO: Actualizar barra de tiempo para que se llene de izquierda a derecha
        const timePercent = this.gameState.timeRemaining / window.GAME_CONFIG.SELECTION_TIME;
        this.timerBar.setDisplaySize(200 * (1 - timePercent), 15); // Se llena conforme pasa el tiempo
        
        // Cambiar color de la barra según el tiempo restante
        if (timePercent > 0.5) {
            this.timerBar.setFillStyle(0x4CAF50); // Verde
        } else if (timePercent > 0.25) {
            this.timerBar.setFillStyle(0xFFA500); // Naranja
        } else {
            this.timerBar.setFillStyle(0xFF4444); // Rojo
        }
    }

    async handleTimeUp() {
        if (this.countdownTimer) {
            this.countdownTimer.remove();
            this.countdownTimer = null;
        }
        
        this.gameState.gameActive = false;
        this.gameState.gamePhase = 'finished';
        
        const correctNumber = this.gameState.carNumbers[this.gameState.correctCarIndex];
        this.showFeedback(`¡Se acabó el tiempo! ${correctNumber} era mayor que ${this.gameState.targetNumber}`, 'timeout');
        
        // CORREGIDO: Solo acelerar el carrito correcto si no se hizo selección
        if (!this.gameState.selectionMade) {
            this.accelerateCorrectCar();
        }
        
        // Guardar progreso en la base de datos
        await this.saveProgress();
        
        // Nuevo problema después de un momento
        this.time.delayedCall(4000, () => {
            this.setupNewProblem();
        });
    }

    selectCar(carIndex) {
        if (!this.gameState.gameActive || this.gameState.gamePhase !== 'moving') return;
        
        // Marcar que se hizo una selección
        this.gameState.selectionMade = true;
        
        // Detener timer
        if (this.countdownTimer) {
            this.countdownTimer.remove();
            this.countdownTimer = null;
        }
        
        this.gameState.gameActive = false;
        this.gameState.gamePhase = 'finished';
        
        const isCorrect = carIndex === this.gameState.correctCarIndex;
        const selectedCar = this.cars[carIndex];
        
        // Animación de selección
        this.tweens.add({
            targets: selectedCar,
            scale: { from: 0.8, to: 1.0, to: 0.8 },
            duration: 200,
            repeat: 2,
            ease: 'Sine.easeInOut'
        });
        
        if (isCorrect) {
            this.handleCorrectAnswer(carIndex);
        } else {
            this.handleIncorrectAnswer(carIndex);
        }
    }

    async handleCorrectAnswer(carIndex) {
        this.gameState.score += 10;
        const correctNumber = this.gameState.carNumbers[carIndex];
        this.showFeedback(`¡Excelente! ${correctNumber} es mayor que ${this.gameState.targetNumber}`, 'correct');
        
        // CORREGIDO: Acelerar solo el carrito correcto cuando la selección es correcta
        this.accelerateCorrectCar();
        
        // Crear efecto de celebración
        this.createCelebrationEffect();
        
        // Avanzar nivel cada 3 respuestas correctas
        if (this.gameState.score % 30 === 0) {
            this.gameState.level++;
        }
        
        // Guardar progreso en la base de datos
        await this.saveProgress();
        
        // Nuevo problema después de un momento
        this.time.delayedCall(4000, () => {
            this.setupNewProblem();
        });
    }

    handleIncorrectAnswer(carIndex) {
        const correctNumber = this.gameState.carNumbers[this.gameState.correctCarIndex];
        const selectedNumber = this.gameState.carNumbers[carIndex];
        this.showFeedback(`¡Ups! Seleccionaste ${selectedNumber}. ${correctNumber} es mayor que ${this.gameState.targetNumber}`, 'incorrect');
        
        // CORREGIDO: NO acelerar ningún carrito cuando la selección es incorrecta
        // Los carritos continúan a velocidad normal
        
        // Nuevo problema después de un momento
        this.time.delayedCall(4000, () => {
            this.setupNewProblem();
        });
    }

    accelerateCorrectCar() {
        const correctCarIndex = this.gameState.correctCarIndex;
        const car = this.cars[correctCarIndex];
        const numberText = this.carNumbers[correctCarIndex];
        
        if (!car || !numberText) return;
        
        // Detener el movimiento lento actual
        if (this.carMovementTweens[correctCarIndex]) {
            this.carMovementTweens[correctCarIndex].stop();
        }
        
        // Calcular distancia restante hasta desaparecer
        const currentX = car.x;
        const remainingDistance = window.GAME_CONFIG.DISAPPEAR_X - currentX;
        const duration = (remainingDistance / window.GAME_CONFIG.CAR_FAST_SPEED) * 1000;
        
        // Acelerar hacia la desaparición
        this.tweens.add({
            targets: [car, numberText],
            x: window.GAME_CONFIG.DISAPPEAR_X,
            duration: duration,
            ease: 'Power2.easeOut',
            onComplete: () => {
                car.setVisible(false);
                numberText.setVisible(false);
            }
        });
        
        // Efecto visual de aceleración
        this.tweens.add({
            targets: car,
            scaleX: { from: 0.8, to: 1.2, to: 0.8 },
            duration: 300,
            ease: 'Sine.easeInOut'
        });
    }

    showFeedback(message, type) {
        this.feedbackText.setText(message);
        
        if (type === 'correct') {
            this.feedbackText.setColor('#32CD32');
            this.feedbackText.setStyle({ backgroundColor: 'rgba(50,205,50,0.1)' });
        } else if (type === 'incorrect') {
            this.feedbackText.setColor('#FF6347');
            this.feedbackText.setStyle({ backgroundColor: 'rgba(255,99,71,0.1)' });
        } else if (type === 'timeout') {
            this.feedbackText.setColor('#FFA500');
            this.feedbackText.setStyle({ backgroundColor: 'rgba(255,165,0,0.1)' });
        }
        
        this.feedbackText.setVisible(true);
        this.feedbackText.setScale(0);
        
        this.tweens.add({
            targets: this.feedbackText,
            scale: 1,
            duration: 400,
            ease: 'Back.easeOut'
        });
    }

    clearFeedback() {
        this.feedbackText.setVisible(false);
    }

    createCelebrationEffect() {
        const centerX = 450;
        const centerY = 300;
        
        // Crear estrellas doradas
        for (let i = 0; i < 12; i++) {
            const star = this.add.star(
                centerX + Phaser.Math.Between(-250, 250),
                centerY + Phaser.Math.Between(-150, 150),
                5, 10, 20,
                0xFFD700
            );
            
            star.setScale(0);
            
            this.tweens.add({
                targets: star,
                scale: { from: 0, to: 1.5 },
                alpha: { from: 1, to: 0 },
                rotation: Math.PI * 6,
                duration: 2500,
                delay: i * 100,
                ease: 'Power2.easeOut',
                onComplete: () => star.destroy()
            });
        }
        
        // Efecto de confeti
        for (let i = 0; i < 20; i++) {
            const colors = [0xFF6B6B, 0x4ECDC4, 0x45B7D1, 0xFFA07A, 0x98D8C8];
            const confetti = this.add.rectangle(
                centerX + Phaser.Math.Between(-100, 100),
                centerY - 100,
                8, 8,
                colors[i % colors.length]
            );
            
            this.tweens.add({
                targets: confetti,
                y: centerY + 200,
                x: confetti.x + Phaser.Math.Between(-50, 50),
                rotation: Math.PI * 4,
                alpha: { from: 1, to: 0 },
                duration: 3000,
                delay: i * 50,
                ease: 'Cubic.easeOut',
                onComplete: () => confetti.destroy()
            });
        }
    }

    updateDisplay() {
        this.instructionText.setText('¡Selecciona el coche con número MAYOR antes de que lleguen a la meta!');
        this.targetNumberText.setText(`Número objetivo: ${this.gameState.targetNumber}`);
        this.levelText.setText(`Nivel: ${this.gameState.level}`);
        this.scoreText.setText(`Puntos: ${this.gameState.score}`);
        this.timerText.setText(`Tiempo: ${Math.ceil(this.gameState.timeRemaining)}`);
        
        // CORREGIDO: Resetear barra de tiempo
        this.timerBar.setDisplaySize(0, 15);
        this.timerBar.setFillStyle(0x4CAF50);
    }

    showHelp() {
        const helpMessage = `🚗 CÓMO JUGAR:

1. Los dos carritos avanzan lentamente hacia la meta
2. Observa el número objetivo y los números en los carritos
3. Haz clic en el carrito que tenga un número MAYOR que el objetivo
4. ¡Tienes ${window.GAME_CONFIG.SELECTION_TIME} segundos para decidir!
5. El carrito correcto acelerará y desaparecerá al salir del juego

🎯 OBJETIVO: Aprender el concepto de "mayor que" (>)

💡 CONSEJO: Un número es mayor si tiene un valor más alto
Ejemplo: 8 > 5 (8 es mayor que 5)

⏰ ¡Decide rápido antes de que se acabe el tiempo!`;
        
        // Crear ventana de ayuda
        const helpWindow = this.add.rectangle(450, 300, 600, 400, 0x000000, 0.8);
        const helpBorder = this.add.rectangle(450, 300, 600, 400);
        helpBorder.setStrokeStyle(4, 0x4CAF50);
        helpBorder.setFillStyle();
        
        const helpTextObj = this.add.text(450, 300, helpMessage, {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            align: 'left',
            wordWrap: { width: 550 }
        }).setOrigin(0.5);
        
        const closeBtn = this.add.rectangle(450, 480, 120, 40, 0x4CAF50);
        const closeBtnText = this.add.text(450, 480, 'Cerrar', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        closeBtn.setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => {
            helpWindow.destroy();
            helpBorder.destroy();
            helpTextObj.destroy();
            closeBtn.destroy();
            closeBtnText.destroy();
        });
        
        closeBtn.on('pointerover', () => closeBtn.setFillStyle(0x45a049));
        closeBtn.on('pointerout', () => closeBtn.setFillStyle(0x4CAF50));
    }

    async saveProgress() {
        if (!window.PROGRESS_MANAGER) {
            console.warn('⚠️ PROGRESS_MANAGER no está disponible');
            return;
        }

        try {
            // Calcular tiempo total jugado en esta sesión
            const currentTime = Date.now();
            const sessionTime = this.gameState.sessionStartTime ? 
                Math.floor((currentTime - this.gameState.sessionStartTime) / 1000) : 0;
            
            // Convertir a formato HH:mm:ss
            const hours = Math.floor(sessionTime / 3600);
            const minutes = Math.floor((sessionTime % 3600) / 60);
            const seconds = sessionTime % 60;
            const tiempoJugado = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            console.log('💾 Guardando/actualizando progreso:', {
                puntuacion: this.gameState.score,
                tiempoJugado: tiempoJugado
            });
            
            const success = await window.PROGRESS_MANAGER.saveProgress(10, tiempoJugado);
            
            if (success) {
                console.log('✅ Progreso guardado/actualizado exitosamente');
                // Mostrar indicador visual de guardado
                this.showSaveIndicator();
            } else {
                console.error('❌ Error guardando progreso');
            }
        } catch (error) {
            console.error('❌ Error en saveProgress:', error);
        }
    }

    showSaveIndicator() {
        const saveText = this.add.text(450, 180, '💾 Progreso actualizado', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#4CAF50',
            fontStyle: 'bold',
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);
        
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

