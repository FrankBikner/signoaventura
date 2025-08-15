export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        
        // Variables del juego
        this.targetNumber = 0;
        this.fuel = 0;
        this.maxFuel = 100;
        this.score = 0;
        this.asteroids = [];
        this.gameStarted = false;
        this.rocketLaunched = false;
        this.correctAnswersNeeded = 5; // Número de respuestas correctas para despegar
        this.correctAnswers = 0;
        this.level = 1;
        this.maxLevel = 5;
        this.asteroidSpeed = 0.1; // Velocidad inicial muy reducida
        this.difficultyMultiplier = 1;
        this.maxAsteroids = 6; // Aumentado para tener más opciones
        
        // Variables para la nueva mecánica de selección de dos asteroides
        this.selectedAsteroids = [];
        this.maxSelectedAsteroids = 2;
        this.selectionMode = true;

        // Pool de asteroides para reutilización
        this.asteroidPool = [];
        this.poolSize = 10; // Tamaño del pool

        this.lastTargetNumber = -1; // Para asegurar que el nuevo objetivo sea diferente
        
        // Estado del progreso
        this.userProgress = null;
        this.progressLoaded = false;
        this.sessionStartTime = null;
    }

    preload() {
        // Cargar assets
        this.load.image("background", "assets/images/fondo.png");
        this.load.image("rocket", "assets/images/cohete.png");
        this.load.image("base", "assets/images/base_del_cohete.png");
        
        // Crear un pixel blanco para usar en partículas y efectos
        this.load.image("pixel", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==");
    }

    create() {
        console.log("GameScene create() called");
        
        // Configurar depths para evitar problemas de orden de dibujo
        this.setupDepths();

        // Fondo espacial con estrellas
        this.createBackground();
        
        // Base del cohete
        this.rocketBase = this.add.image(200, 580, "base").setScale(0.5);
        this.rocketBase.setDepth(this.DEPTHS.ROCKET_BASE);
        
        // Cohete
        this.rocket = this.add.image(200, 500, "rocket").setScale(0.6);
        this.rocket.setOrigin(0.63, 0.9);
        this.rocket.setDepth(this.DEPTHS.ROCKET);
        
        // Crear UI
        this.createUI();

        // Inicializar pool de asteroides
        this.initializeAsteroidPool();
        
        // Cargar progreso del usuario
        this.loadUserProgress();
        
        console.log("GameScene created successfully");
    }

    async loadUserProgress() {
        try {
            console.log('📊 Cargando progreso del usuario...');
            
            if (window.PROGRESS_MANAGER) {
                this.userProgress = await window.PROGRESS_MANAGER.loadProgress();
                
                if (this.userProgress) {
                    this.score = this.userProgress.puntuacion || 0;
                    
                    this.showWelcomeMessage();
                } else {
                    this.score = 0;
                }
            } else {
                this.score = 0;
            }
        } catch (error) {
            this.score = 0;
        }
        
        this.progressLoaded = true;
        this.startNewRound();
    }

    showWelcomeMessage() {
        const welcomeText = this.add.text(640, 10, `¡Bienvenido de vuelta! 🚀\nTu puntuación anterior: ${this.userProgress.puntuacion} puntos`, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#00ffff',
            fontStyle: 'bold',
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: { x: 20, y: 15 },
            align: 'center'
        }).setOrigin(0.5);
        welcomeText.setDepth(this.DEPTHS.FEEDBACK);
        
        welcomeText.setScale(0);
        this.tweens.add({
            targets: welcomeText,
            scale: 1,
            duration: 800,
            ease: 'Back.easeOut',
            onComplete: () => {
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

    async saveProgress() {
        if (!window.PROGRESS_MANAGER) {
            return;
        }

        try {
            const currentTime = Date.now();
            const sessionTime = this.sessionStartTime ? 
                Math.floor((currentTime - this.sessionStartTime) / 1000) : 0;
            
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
        const saveText = this.add.text(640, 10, '💾 Progreso actualizado', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#00ff00',
            fontStyle: 'bold',
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);
        saveText.setDepth(this.DEPTHS.FEEDBACK);
        
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

    setupDepths() {
        // Definir constantes de depth para mantener orden consistente
        this.DEPTHS = {
            BACKGROUND: 0,
            STARS: 1,
            UI_BACKGROUND: 5,
            ROCKET_BASE: 10,
            ROCKET: 15,
            ASTEROIDS: 20,
            ASTEROID_TEXT: 25,
            CRATERS: 22,
            UI_ELEMENTS: 30,
            BUTTONS: 35,
            FEEDBACK: 40,
            PARTICLES: 45
        };
    }

    createBackground() {
        // Fondo base
        this.background = this.add.tileSprite(640, 360, 1280, 720, "background");
        this.background.setDepth(this.DEPTHS.BACKGROUND);
        
        // Crear estrellas adicionales para más ambiente
        this.stars = this.add.group();
        for (let i = 0; i < 100; i++) {
            const star = this.add.circle(
                Phaser.Math.Between(0, 1280),
                Phaser.Math.Between(0, 720),
                Phaser.Math.Between(1, 3),
                0xffffff
            );
            star.setAlpha(Phaser.Math.FloatBetween(0.3, 1));
            star.setDepth(this.DEPTHS.STARS);
            this.stars.add(star);
        }
    }

    createUI() {
        // Panel de información con gráficos en lugar de rectangle con stroke
        this.uiPanelBg = this.add.graphics();
        this.uiPanelBg.fillStyle(0xffffff, 0.9);
        this.uiPanelBg.fillRoundedRect(40, 130, 250, 60, 10);
        this.uiPanelBg.lineStyle(3, 0x000000);
        this.uiPanelBg.setDepth(this.DEPTHS.UI_BACKGROUND);
        
        // Texto del objetivo
        this.targetText = this.add.text(980, 169, "Objetivo:\n0", {
            fontSize: "29px",
            fontFamily: "Arial",
            color: "#FFB700",
            fontStyle: "bold",
            align: "center"
        }).setOrigin(0.5);
        this.targetText.setDepth(this.DEPTHS.UI_ELEMENTS);
        
        // Barra de combustible
        this.fuelBarBg = this.add.graphics();
        this.fuelBarBg.fillStyle(0x333333);
        this.fuelBarBg.fillRect(60, 150, 200, 20);
        this.fuelBarBg.setDepth(this.DEPTHS.UI_BACKGROUND);
        
        this.fuelBar = this.add.graphics();
        this.fuelBar.setDepth(this.DEPTHS.UI_ELEMENTS);
        this.updateFuelBar();
        
        // Texto de combustible
        this.fuelText = this.add.text(150, 179, "Combustible: 0/100", {
            fontSize: "16px",
            fontFamily: "Arial",
            color: "#0000000"
        }).setOrigin(0.5);
        this.fuelText.setDepth(this.DEPTHS.UI_ELEMENTS);
        
        // Puntuación
        this.scoreText = this.add.text(1200, 50, "Puntuación: 0", {
            fontSize: "24px",
            fontFamily: "Arial",
            color: "#ffffff"
        }).setOrigin(1, 0);
        this.scoreText.setDepth(this.DEPTHS.UI_ELEMENTS);
        
        // Contador de respuestas correctas
        this.correctAnswersText = this.add.text(1200, 80, "Aciertos: 0/5", {
            fontSize: "20px",
            fontFamily: "Arial",
            color: "#00ff00"
        }).setOrigin(1, 0);
        this.correctAnswersText.setDepth(this.DEPTHS.UI_ELEMENTS);
        
        // Nivel actual
        this.levelText = this.add.text(1200, 110, "Nivel: 1", {
            fontSize: "18px",
            fontFamily: "Arial",
            color: "#ffff00"
        }).setOrigin(1, 0);
        this.levelText.setDepth(this.DEPTHS.UI_ELEMENTS);
        
        // Texto de selección actual
        this.selectionText = this.add.text(640, 150, "Selecciona 2 asteroides para formar un número", {
            fontSize: "20px",
            fontFamily: "Arial",
            color: "#00ffff",
            fontStyle: "bold",
            align: "center"
        }).setOrigin(0.5);
        this.selectionText.setDepth(this.DEPTHS.UI_ELEMENTS);
        
        // Texto del número formado
        this.formedNumberText = this.add.text(640, 180, "Número formado: --", {
            fontSize: "24px",
            fontFamily: "Arial",
            color: "#ffff00",
            fontStyle: "bold",
            align: "center"
        }).setOrigin(0.5);
        this.formedNumberText.setDepth(this.DEPTHS.UI_ELEMENTS);
        
        // Botón de ayuda
        this.createButton(1200, 660, 100, 50, 0x4fc3f7, "Ayuda", () => {
            this.showHelp();
        });
        
        // Instrucciones iniciales
        this.instructionText = this.add.text(640, 100, "Selecciona 2 asteroides para formar un número MAYOR que el objetivo", {
            fontSize: "24px",
            fontFamily: "Arial",
            color: "#ffff00",
            fontStyle: "bold",
            align: "center"
        }).setOrigin(0.5);
        this.instructionText.setDepth(this.DEPTHS.UI_ELEMENTS);
    }

    createButton(x, y, width, height, color, text, callback) {
        const button = this.add.graphics();
        button.fillStyle(color);
        button.fillRoundedRect(x - width/2, y - height/2, width, height, 10);
        button.lineStyle(2, 0x000000);
        button.strokeRoundedRect(x - width/2, y - height/2, width, height, 10);
        button.setDepth(this.DEPTHS.BUTTONS);
        
        const buttonText = this.add.text(x, y, text, {
            fontSize: "14px",
            fontFamily: "Arial",
            color: "#000000",
            align: "center",
            fontStyle: "bold"
        }).setOrigin(0.5);
        buttonText.setDepth(this.DEPTHS.BUTTONS);
        
        // Hacer interactivo
        const hitArea = new Phaser.Geom.Rectangle(x - width/2, y - height/2, width, height);
        button.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
        
        button.on("pointerdown", callback);
        button.on("pointerover", () => {
            button.clear();
            button.fillStyle(color, 0.8);
            button.fillRoundedRect(x - width/2, y - height/2, width, height, 10);
            button.lineStyle(2, 0x000000);
            button.strokeRoundedRect(x - width/2, y - height/2, width, height, 10);
        });
        button.on("pointerout", () => {
            button.clear();
            button.fillStyle(color);
            button.fillRoundedRect(x - width/2, y - height/2, width, height, 10);
            button.lineStyle(2, 0x000000);
            button.strokeRoundedRect(x - width/2, y - height/2, width, height, 10);
        });
        
        return { button, text: buttonText };
    }

    updateFuelBar() {
        this.fuelBar.clear();
        const fuelPercentage = this.fuel / this.maxFuel;
        const barWidth = 200 * fuelPercentage;
        
        // Color según el nivel de combustible
        let color = 0xff0000; // Rojo
        if (fuelPercentage > 0.7) {
            color = 0x00ff00; // Verde
        } else if (fuelPercentage > 0.3) {
            color = 0xffa500; // Naranja
        }
        
        this.fuelBar.fillStyle(color);
        // Corregir la orientación: llenar de derecha a izquierda
        this.fuelBar.fillRect(60 + (200 - barWidth), 150, barWidth, 20);
    }

    // Métodos para gestión segura de fuel y score
    addFuel(amount) {
        this.fuel = Phaser.Math.Clamp(this.fuel + amount, 0, this.maxFuel);
        this.updateFuelBar();
        this.updateUI();
    }

    subtractFuel(amount) {
        this.fuel = Phaser.Math.Clamp(this.fuel - amount, 0, this.maxFuel);
        this.updateFuelBar();
        this.updateUI();
        if (this.fuel <= 0) {
            this.gameOver();
        }
    }

    async addScore(amount) {
        this.score += amount;
        this.updateUI();
        
        await this.saveProgress();
    }

    startNewRound() {
        console.log("Starting new round");
        
        if (!this.sessionStartTime) {
            this.sessionStartTime = Date.now();
        }
        
        // Resetear variables
        this.fuel = 0;
        this.correctAnswers = 0;
        this.gameStarted = true;
        this.rocketLaunched = false;
        this.selectedAsteroids = [];
        
        // Ajustar dificultad según el nivel - velocidades más moderadas
        this.asteroidSpeed = 0.1 + (this.level * 0.02); // Velocidad mucho más lenta
        this.difficultyMultiplier = 1 + (this.level * 0.2);
        
        // Resetear posición del cohete
        this.rocket.setPosition(200, 500);
        this.rocket.setRotation(0);
        this.rocket.setScale(0.6);
        
        // Limpiar y regenerar asteroides
        this.clearAsteroids();
        this.generateInitialAsteroids();
        
        // Generar un nuevo número objetivo que sea alcanzable
        this.generateNewTargetNumber();

        // Actualizar UI
        this.updateUI();
        
        // Mostrar instrucciones
        this.instructionText.setVisible(true);
        this.time.delayedCall(4000, () => {
            if (this.instructionText) {
                this.instructionText.setVisible(false);
            }
        });
    }

    initializeAsteroidPool() {
        // Crear pool de asteroides reutilizables para evitar acumulación
        this.asteroidPool = [];
        for (let i = 0; i < this.poolSize; i++) {
            const pooledAsteroid = {
                sprite: null,
                text: null,
                craters: [],
                number: 0,
                velocityX: 0,
                velocityY: 0,
                selected: false,
                originalColor: 0xcd853f,
                active: false,
                craterOffsets: [], // Offsets fijos para evitar vibración
                craterAngles: [] // Ángulos para rotación de cráteres
            };
            this.asteroidPool.push(pooledAsteroid);
        }
    }

    generateInitialAsteroids() {
        this.asteroids = []; // Asegurarse de que la lista de asteroides activos esté vacía
        
        // Generar 6 asteroides con números del 1 al 5
        for (let i = 0; i < this.maxAsteroids; i++) {
            this.createAsteroid();
        }
    }

    getPooledAsteroid() {
        // Buscar un asteroide inactivo en el pool
        for (let i = 0; i < this.asteroidPool.length; i++) {
            if (!this.asteroidPool[i].active) {
                return this.asteroidPool[i];
            }
        }
        return null; // No hay asteroides disponibles en el pool
    }

    createAsteroid() {
        // Obtener asteroide del pool
        const asteroidData = this.getPooledAsteroid();
        if (!asteroidData) {
            console.warn("No hay asteroides disponibles en el pool");
            return;
        }
        
        // Posición aleatoria en la parte derecha de la pantalla
        const x = Phaser.Math.Between(500, 1100);
        const y = Phaser.Math.Between(280, 550);
        
        // Crear asteroide visual con gráficos
        if (!asteroidData.sprite) {
            asteroidData.sprite = this.add.graphics();
        }
        asteroidData.sprite.clear();
        asteroidData.sprite.fillStyle(0xcd853f);
        asteroidData.sprite.fillCircle(0, 0, 50);
        asteroidData.sprite.lineStyle(3, 0x8b4513);
        asteroidData.sprite.strokeCircle(0, 0, 50);
        asteroidData.sprite.setPosition(x, y);
        asteroidData.sprite.setDepth(this.DEPTHS.ASTEROIDS);
        asteroidData.sprite.setVisible(true);
        asteroidData.sprite.setInteractive();
        
        // Generar offsets fijos y ángulos para cráteres (evita vibración y permite rotación)
        if (asteroidData.craterOffsets.length === 0) {
            for (let i = 0; i < 3; i++) {
                asteroidData.craterOffsets.push({
                    x: Phaser.Math.Between(-25, 25),
                    y: Phaser.Math.Between(-25, 25),
                    radius: Phaser.Math.Between(3, 8)
                });
                asteroidData.craterAngles.push(Phaser.Math.Between(0, 360)); // Ángulo inicial
            }
        }
        
        // Limpiar cráteres existentes
        asteroidData.craters.forEach(crater => {
            if (crater && crater.active) {
                crater.destroy();
            }
        });
        asteroidData.craters = [];
        
        // Añadir cráteres con posiciones fijas y rotación
        for (let i = 0; i < asteroidData.craterOffsets.length; i++) {
            const offset = asteroidData.craterOffsets[i];
            const crater = this.add.circle(
                x + offset.x,
                y + offset.y,
                offset.radius,
                0x8b4513
            );
            crater.setAlpha(0.7);
            crater.setDepth(this.DEPTHS.CRATERS);
            crater.setVisible(true);
            asteroidData.craters.push(crater);
        }
        
        // Generar número del 1 al 5
        asteroidData.number = Phaser.Math.Between(1, 5);
        
        // Texto del número
        if (!asteroidData.text) {
            asteroidData.text = this.add.text(x, y, asteroidData.number.toString(), {
                fontSize: "32px",
                fontFamily: "Arial",
                color: "#000000",
                fontStyle: "bold",
                stroke: "#ffffff",
                strokeThickness: 3
            }).setOrigin(0.5);
        } else {
            asteroidData.text.setText(asteroidData.number.toString());
            asteroidData.text.setPosition(x, y);
        }
        asteroidData.text.setDepth(this.DEPTHS.ASTEROID_TEXT);
        asteroidData.text.setVisible(true);
        
        // Configurar propiedades
        asteroidData.velocityX = Phaser.Math.FloatBetween(-5 * this.asteroidSpeed, -2 * this.asteroidSpeed); // Velocidades más lentas
        asteroidData.velocityY = Phaser.Math.FloatBetween(-2 * this.asteroidSpeed, 2 * this.asteroidSpeed);
        asteroidData.selected = false;
        asteroidData.originalColor = 0xcd853f;
        asteroidData.active = true;
        
        // Hacer interactivo DESPUÉS de configurar asteroidData
        const hitArea = new Phaser.Geom.Circle(0, 0, 50);
        asteroidData.sprite.setInteractive(hitArea, Phaser.Geom.Circle.Contains);
        
        // Limpiar eventos anteriores
        asteroidData.sprite.removeAllListeners();
        
        asteroidData.sprite.on("pointerdown", () => {
            if (this.gameStarted && !this.rocketLaunched) {
                this.selectAsteroid(asteroidData);
            }
        });
        
        // Añadir hover effect
        asteroidData.sprite.on("pointerover", () => {
            if (!asteroidData.selected) {
                asteroidData.sprite.clear();
                asteroidData.sprite.fillStyle(0xdaa520); // Color más claro al hacer hover
                asteroidData.sprite.fillCircle(0, 0, 50);
                asteroidData.sprite.lineStyle(3, 0x8b4513);
                asteroidData.sprite.strokeCircle(0, 0, 50);
            }
        });
        
        asteroidData.sprite.on("pointerout", () => {
            if (!asteroidData.selected) {
                asteroidData.sprite.clear();
                asteroidData.sprite.fillStyle(asteroidData.originalColor);
                asteroidData.sprite.fillCircle(0, 0, 50);
                asteroidData.sprite.lineStyle(3, 0x8b4513);
                asteroidData.sprite.strokeCircle(0, 0, 50);
            }
        });
        
        this.asteroids.push(asteroidData);
    }

    selectAsteroid(asteroidData) {
        // Bloquear selección si el asteroide ya está en selectedAsteroids
        if (this.selectedAsteroids.includes(asteroidData)) {
            this.deselectAsteroid(asteroidData);
        } else if (this.selectedAsteroids.length < this.maxSelectedAsteroids) {
            // Seleccionar asteroide
            asteroidData.selected = true;
            this.selectedAsteroids.push(asteroidData);
            
            // Cambiar color visual para indicar selección
            asteroidData.sprite.clear();
            asteroidData.sprite.fillStyle(0x00ff00); // Verde para seleccionado
            asteroidData.sprite.fillCircle(0, 0, 50);
            asteroidData.sprite.lineStyle(4, 0x008000);
            asteroidData.sprite.strokeCircle(0, 0, 50);
            
            this.updateSelectionUI();

            // Si ya se seleccionaron 2 asteroides, activar la lógica de comparación
            if (this.selectedAsteroids.length === this.maxSelectedAsteroids) {
                this.time.delayedCall(500, async () => { // Pequeño retraso para que el usuario vea la selección
                    await this.processSelection();
                });
            }
        }
    }

    deselectAsteroid(asteroidData) {
        asteroidData.selected = false;
        const index = this.selectedAsteroids.indexOf(asteroidData);
        if (index > -1) {
            this.selectedAsteroids.splice(index, 1);
        }
        
        // Restaurar color original
        asteroidData.sprite.clear();
        asteroidData.sprite.fillStyle(asteroidData.originalColor);
        asteroidData.sprite.fillCircle(0, 0, 50);
        asteroidData.sprite.lineStyle(3, 0x8b4513);
        asteroidData.sprite.strokeCircle(0, 0, 50);
        
        this.updateSelectionUI();
    }

    clearSelection() {
        // Deseleccionar todos los asteroides y restaurar su color
        this.selectedAsteroids.forEach(asteroidData => {
            asteroidData.selected = false;
            asteroidData.sprite.clear();
            asteroidData.sprite.fillStyle(asteroidData.originalColor);
            asteroidData.sprite.fillCircle(0, 0, 50);
            asteroidData.sprite.lineStyle(3, 0x8b4513);
            asteroidData.sprite.strokeCircle(0, 0, 50);
        });
        this.selectedAsteroids = [];
        this.updateSelectionUI();
    }

    updateSelectionUI() {
        if (this.selectedAsteroids.length === 0) {
            this.selectionText.setText("Selecciona 2 asteroides para formar un número");
            this.formedNumberText.setText("Número formado: --");
        } else if (this.selectedAsteroids.length === 1) {
            this.selectionText.setText(`Seleccionado: ${this.selectedAsteroids[0].number}. Selecciona otro asteroide`);
            this.formedNumberText.setText("Número formado: --");
        } else if (this.selectedAsteroids.length === 2) {
            const formedNumber = parseInt(this.selectedAsteroids[0].number.toString() + this.selectedAsteroids[1].number.toString());
            this.selectionText.setText(`Asteroides seleccionados: ${this.selectedAsteroids[0].number} y ${this.selectedAsteroids[1].number}`);
            this.formedNumberText.setText(`Número formado: ${formedNumber}`);
        }
    }

    async processSelection() {
        if (this.selectedAsteroids.length !== 2) return;
        
        const formedNumber = parseInt(this.selectedAsteroids[0].number.toString() + this.selectedAsteroids[1].number.toString());
        
        console.log(`Checking formed number: ${formedNumber} vs target: ${this.targetNumber}`);
        
        if (formedNumber > this.targetNumber) {
            // Respuesta correcta - el número formado es MAYOR que el objetivo
            this.addFuel(20);
            await this.addScore(10 * this.level);
            this.correctAnswers++;
            
            // Efecto visual de acierto
            this.showFeedback(640, 300, `¡Correcto! ${formedNumber} > ${this.targetNumber}\n+20 combustible`, 0x00ff00);
            
            // Verificar si se alcanzó el objetivo para lanzar el cohete
            if (this.correctAnswers >= this.correctAnswersNeeded) {
                this.time.delayedCall(1000, () => {
                    this.launchRocket();
                });
            } else {
                // Generar nuevos asteroides y un nuevo objetivo alcanzable
                this.time.delayedCall(1000, () => {
                    this.destroySelectedAsteroids();
                    this.generateNewAsteroids();
                    this.generateNewTargetNumber();
                });
            }
            
        } else {
            // Respuesta incorrecta
            this.subtractFuel(10);
            
            // Efecto visual de error
            this.showFeedback(640, 300, `¡Error! ${formedNumber} <= ${this.targetNumber}\n-10 combustible`, 0xff0000);
            
            // Generar nuevos asteroides y un nuevo objetivo alcanzable
            this.time.delayedCall(1000, () => {
                this.destroySelectedAsteroids();
                this.generateNewAsteroids();
                this.generateNewTargetNumber();
            });
        }
        
        // Limpiar selección después de procesar
        this.clearSelection();
    }

    destroySelectedAsteroids() {
        this.selectedAsteroids.forEach(asteroidData => {
            this.destroyAsteroid(asteroidData);
        });
        this.selectedAsteroids = [];
    }

    generateNewAsteroids() {
        // Asegurarse de que haya suficientes asteroides activos
        while (this.asteroids.length < this.maxAsteroids) {
            this.createAsteroid();
        }
        // Después de generar nuevos asteroides, verificar si el objetivo actual sigue siendo alcanzable
        if (!this.isTargetAchievable(this.targetNumber)) {
            this.generateNewTargetNumber(); // Generar un nuevo objetivo si el actual no es alcanzable
        }
    }

    generateNewTargetNumber() {
        let newTarget = -1;
        let attempts = 0;
        const maxAttempts = 100; // Evitar bucles infinitos

        while (attempts < maxAttempts) {
            newTarget = Phaser.Math.Between(20 + (this.level * 5), 60 + (this.level * 5));
            if (newTarget !== this.lastTargetNumber && this.isTargetAchievable(newTarget)) {
                this.targetNumber = newTarget;
                this.lastTargetNumber = newTarget;
                this.updateUI();
                return;
            }
            attempts++;
        }
        console.warn("No se pudo generar un nuevo número objetivo alcanzable después de varios intentos. Reiniciando asteroides.");
        // Fallback: si no se encuentra un objetivo alcanzable, regenerar todos los asteroides y reintentar
        this.clearAsteroids();
        this.generateInitialAsteroids();
        this.generateNewTargetNumber(); // Reintentar con nuevos asteroides
    }

    isTargetAchievable(target) {
        // Verificar si existe al menos una combinación de 2 asteroides que supere el objetivo
        const currentNumbers = this.asteroids.filter(a => a.active).map(a => a.number); // Solo asteroides activos
        if (currentNumbers.length < 2) return false; // No hay suficientes asteroides

        for (let i = 0; i < currentNumbers.length; i++) {
            for (let j = i + 1; j < currentNumbers.length; j++) {
                const num1 = currentNumbers[i];
                const num2 = currentNumbers[j];
                const formedNumber1 = parseInt(num1.toString() + num2.toString());
                const formedNumber2 = parseInt(num2.toString() + num1.toString());

                if (formedNumber1 > target || formedNumber2 > target) {
                    return true;
                }
            }
        }
        return false;
    }

    showFeedback(x, y, text, color) {
        const feedback = this.add.text(x, y, text, {
            fontSize: "20px",
            fontFamily: "Arial",
            color: color === 0x00ff00 ? "#00ff00" : "#ff0000",
            fontStyle: "bold",
            stroke: "#000000",
            strokeThickness: 2,
            align: "center"
        }).setOrigin(0.5);
        feedback.setDepth(this.DEPTHS.FEEDBACK);
        
        // Animación de feedback
        this.tweens.add({
            targets: feedback,
            y: y - 50,
            alpha: 0,
            duration: 2000,
            ease: "Power2",
            onComplete: () => {
                feedback.destroy();
            }
        });
    }

    destroyAsteroid(asteroidData) {
        // Efecto de explosión
        this.createExplosion(asteroidData.sprite.x, asteroidData.sprite.y);
        
        // Marcar como inactivo en lugar de destruir (para reutilizar)
        asteroidData.active = false;
        asteroidData.selected = false;
        
        // Ocultar elementos
        if (asteroidData.sprite) {
            asteroidData.sprite.setVisible(false);
            asteroidData.sprite.disableInteractive();
        }
        if (asteroidData.text) {
            asteroidData.text.setVisible(false);
        }
        if (asteroidData.craters) {
            asteroidData.craters.forEach(crater => {
                if (crater) {
                    crater.setVisible(false);
                }
            });
        }
        
        // Remover de la lista activa (importante para isTargetAchievable)
        const index = this.asteroids.indexOf(asteroidData);
        if (index > -1) {
            this.asteroids.splice(index, 1);
        }

        // Después de destruir un asteroide, verificar si el juego puede continuar
        if (this.asteroids.filter(a => a.active).length < 2 && !this.rocketLaunched) {
            // Si no quedan suficientes asteroides activos para formar una combinación
            // y el cohete no ha sido lanzado, es un Game Over por falta de combinaciones
            this.time.delayedCall(1500, () => {
                if (!this.isTargetAchievable(this.targetNumber)) {
                    this.gameOver("¡No hay más combinaciones posibles!");
                }
            });
        }
    }

    createExplosion(x, y) {
        // Crear partículas de explosión
        for (let i = 0; i < 8; i++) {
            const particle = this.add.circle(x, y, 3, 0xffa500);
            particle.setDepth(this.DEPTHS.PARTICLES);
            this.tweens.add({
                targets: particle,
                x: x + Phaser.Math.Between(-50, 50),
                y: y + Phaser.Math.Between(-50, 50),
                alpha: 0,
                duration: 500,
                ease: "Power2",
                onComplete: () => {
                    particle.destroy();
                }
            });
        }
    }

    clearAsteroids() {
        // Limpiar todos los asteroides y devolverlos al pool
        this.asteroids.forEach(asteroidData => {
            asteroidData.active = false;
            asteroidData.selected = false;
            if (asteroidData.sprite) {
                asteroidData.sprite.setVisible(false);
                asteroidData.sprite.disableInteractive();
            }
            if (asteroidData.text) {
                asteroidData.text.setVisible(false);
            }
            if (asteroidData.craters) {
                asteroidData.craters.forEach(crater => {
                    if (crater) {
                        crater.setVisible(false);
                    }
                });
            }
        });
        this.asteroids = [];
        this.selectedAsteroids = [];
    }

    launchRocket() {
        console.log("Launching rocket!");
        this.rocketLaunched = true;
        this.gameStarted = false;
        
        // Limpiar asteroides restantes
        this.clearAsteroids();
        
        // Efecto de propulsión (sin animación de fuego aún)
        this.createRocketThrust();
        
        // Animación de despegue
        this.tweens.add({
            targets: this.rocket,
            y: -100,
            rotation: 0,
            scale: 0.3,
            duration: 3000,
            ease: "Power2",
            onComplete: () => {
                this.showLevelComplete();
            }
        });
        
        // Mensaje de éxito
        this.showFeedback(640, 400, "¡DESPEGUE EXITOSO!\n¡El cohete ha llegado al espacio!", 0x00ff00);
    }

    createRocketThrust() {
        // Calcular la posición exacta de la cola del cohete basándose en su origen y escala
        const rocketScale = this.rocket.scaleX;
        const rocketHeight = this.rocket.height * rocketScale;
        const rocketWidth = this.rocket.width * rocketScale;
        
        // El cohete tiene origen en (0.63, 0.9), así que calculamos la posición de la cola
        const thrustX = this.rocket.x - (rocketWidth * 0.13); // Centrado horizontalmente
        const thrustY = this.rocket.y + (rocketHeight * 0.1); // En la cola del cohete
        
        // Emisor principal de fuego (llamas naranjas/rojas intensas)
        const mainThrustEmitter = this.add.particles(thrustX, thrustY, "pixel", {
            speed: { min: 180, max: 350 },
            scale: { start: 1.5, end: 0.1 },
            tint: [0xff1100, 0xff3300, 0xff4400, 0xff6600, 0xff8800],
            lifespan: 500,
            quantity: 12,
            angle: { min: 75, max: 105 }, // Dirigir hacia abajo
            gravityY: -40,
            alpha: { start: 1, end: 0 },
            blendMode: 'ADD' // Efecto de brillo
        });
        mainThrustEmitter.setDepth(this.DEPTHS.PARTICLES);
        
        // Emisor del núcleo de fuego (llamas amarillas/blancas muy calientes)
        const coreThrustEmitter = this.add.particles(thrustX, thrustY - 5, "pixel", {
            speed: { min: 220, max: 450 },
            scale: { start: 1.0, end: 0.1 },
            tint: [0xffff00, 0xffffff, 0xffdd00, 0xffaa00],
            lifespan: 350,
            quantity: 8,
            angle: { min: 82, max: 98 }, // Más concentrado en el centro
            gravityY: -25,
            alpha: { start: 1, end: 0 },
            blendMode: 'ADD'
        });
        coreThrustEmitter.setDepth(this.DEPTHS.PARTICLES + 1);
        
        // Emisor de chispas brillantes (partículas pequeñas y rápidas)
        const sparkEmitter = this.add.particles(thrustX, thrustY + 10, "pixel", {
            speed: { min: 80, max: 200 },
            scale: { start: 0.4, end: 0.1 },
            tint: [0xffffff, 0xffff88, 0xff8888, 0xffaa44],
            lifespan: 300,
            quantity: 15,
            angle: { min: 65, max: 115 },
            gravityY: 120,
            alpha: { start: 1, end: 0 },
            blendMode: 'ADD'
        });
        sparkEmitter.setDepth(this.DEPTHS.PARTICLES + 2);
        
        // Emisor de humo denso (partículas grises que se expanden)
        const smokeEmitter = this.add.particles(thrustX, thrustY + 20, "pixel", {
            speed: { min: 40, max: 100 },
            scale: { start: 0.8, end: 3.0 },
            tint: [0x444444, 0x666666, 0x888888, 0x555555],
            lifespan: 1000,
            quantity: 5,
            angle: { min: 70, max: 110 },
            gravityY: -15,
            alpha: { start: 0.8, end: 0 }
        });
        smokeEmitter.setDepth(this.DEPTHS.PARTICLES - 1);
        
        // Emisor de llamas exteriores (efecto de turbulencia)
        const outerFlameEmitter = this.add.particles(thrustX, thrustY + 15, "pixel", {
            speed: { min: 120, max: 250 },
            scale: { start: 2.0, end: 0.2 },
            tint: [0xcc2200, 0xdd3300, 0xee4400],
            lifespan: 600,
            quantity: 6,
            angle: { min: 70, max: 110 },
            gravityY: -30,
            alpha: { start: 0.7, end: 0 },
            blendMode: 'ADD'
        });
        outerFlameEmitter.setDepth(this.DEPTHS.PARTICLES - 0.5);
        
        // Almacenar referencias para poder seguir al cohete
        this.thrustEmitters = [mainThrustEmitter, coreThrustEmitter, sparkEmitter, smokeEmitter, outerFlameEmitter];
        
        // Función para actualizar la posición de los emisores siguiendo al cohete
        const updateThrustPosition = () => {
            if (this.thrustEmitters && this.rocket) {
                const currentScale = this.rocket.scaleX;
                const currentHeight = this.rocket.height * currentScale;
                const currentWidth = this.rocket.width * currentScale;
                
                const currentThrustX = this.rocket.x - (currentWidth * 0.13);
                const currentThrustY = this.rocket.y + (currentHeight * 0.1);
                
                // Offsets específicos para cada emisor
                const offsets = [
                    { x: 0, y: 0 },      // mainThrust
                    { x: 0, y: -5 },     // coreThrust
                    { x: 0, y: 10 },     // sparks
                    { x: 0, y: 20 },     // smoke
                    { x: 0, y: 15 }      // outerFlame
                ];
                
                this.thrustEmitters.forEach((emitter, index) => {
                    if (emitter && emitter.active) {
                        const offset = offsets[index];
                        emitter.setPosition(
                            currentThrustX + offset.x, 
                            currentThrustY + offset.y
                        );
                    }
                });
            }
        };
        
        // Crear un timer que actualice la posición de los emisores
        this.thrustUpdateTimer = this.time.addEvent({
            delay: 16, // ~60 FPS
            callback: updateThrustPosition,
            loop: true
        });
        
        // Detener los emisores y limpiar después del despegue
        this.time.delayedCall(3000, () => {
            if (this.thrustEmitters) {
                this.thrustEmitters.forEach(emitter => {
                    if (emitter && emitter.active) {
                        emitter.stop();
                        // Destruir después de que las partículas existentes desaparezcan
                        this.time.delayedCall(1000, () => {
                            if (emitter) emitter.destroy();
                        });
                    }
                });
            }
            if (this.thrustUpdateTimer) {
                this.thrustUpdateTimer.destroy();
            }
        });
        
        // Efecto adicional: ondas de calor (círculos que se expanden)
        this.createHeatWaves(thrustX, thrustY);
    }
    
    createHeatWaves(thrustX, thrustY) {
        // Crear ondas de calor que se expanden desde la cola del cohete
        const createWave = () => {
            if (this.rocket && this.rocket.active) {
                // Recalcular la posición actual del cohete para las ondas
                const currentScale = this.rocket.scaleX;
                const currentHeight = this.rocket.height * currentScale;
                const currentWidth = this.rocket.width * currentScale;
                
                const currentThrustX = this.rocket.x - (currentWidth * 0.13);
                const currentThrustY = this.rocket.y + (currentHeight * 0.1);
                
                const wave = this.add.circle(currentThrustX, currentThrustY + 25, 8, 0xff4400, 0.4);
                wave.setDepth(this.DEPTHS.PARTICLES - 2);
                
                this.tweens.add({
                    targets: wave,
                    scaleX: 10,
                    scaleY: 5, // Más ancho que alto para simular ondas de calor
                    alpha: 0,
                    duration: 700,
                    ease: "Power2",
                    onComplete: () => {
                        wave.destroy();
                    }
                });
            }
        };
        
        // Crear ondas cada 150ms durante el despegue
        this.heatWaveTimer = this.time.addEvent({
            delay: 150,
            callback: createWave,
            repeat: 20 // Durante 3 segundos
        });
    }

    showLevelComplete() {
        // Incrementar nivel
        this.level = Math.min(this.level + 1, this.maxLevel);
        
        // Mostrar mensaje de nivel completado
        const levelCompleteText = this.add.text(640, 360, `¡NIVEL ${this.level - 1} COMPLETADO!\n\nPuntuación: ${this.score}\nNivel siguiente: ${this.level}`, {
            fontSize: "32px",
            fontFamily: "Arial",
            color: "#ffff00",
            fontStyle: "bold",
            align: "center",
            stroke: "#000000",
            strokeThickness: 3
        }).setOrigin(0.5);
        levelCompleteText.setDepth(this.DEPTHS.FEEDBACK);
        
        // Botón para continuar
        const continueButton = this.createButton(640, 500, 200, 60, 0x00ff00, "Continuar\nSiguiente Nivel", () => {
            levelCompleteText.destroy();
            continueButton.button.destroy();
            continueButton.text.destroy();
            this.startNewRound();
        });
    }

    gameOver(reason = "") {
        this.gameStarted = false;
        this.clearAsteroids();

        let gameOverMessage = "¡JUEGO TERMINADO!\n";
        if (reason) {
            gameOverMessage += reason + "\n";
        } else {
            gameOverMessage += "Te quedaste sin combustible.\n";
        }
        gameOverMessage += "\nPuntuación final: " + this.score;

        const gameOverText = this.add.text(640, 360, gameOverMessage, {
            fontSize: "32px",
            fontFamily: "Arial",
            color: "#ff0000",
            fontStyle: "bold",
            align: "center",
            stroke: "#000000",
            strokeThickness: 3
        }).setOrigin(0.5);
        gameOverText.setDepth(this.DEPTHS.FEEDBACK);

        const restartButton = this.createButton(640, 500, 200, 60, 0xffa500, "Reiniciar Juego", () => {
            gameOverText.destroy();
            restartButton.button.destroy();
            restartButton.text.destroy();
            this.level = 1; // Reiniciar nivel al perder
            this.startNewRound();
        });
    }

    showHelp() {
        const helpText = this.add.text(640, 360, 
            "CÓMO JUGAR:\n\n" +
            "1. Selecciona 2 asteroides con números del 1 al 5\n" +
            "2. Los números se combinan para formar un número de 2 dígitos\n" +
            "3. El número formado debe ser MAYOR que el objetivo\n" +
            "4. Si es correcto, ganas combustible (+20)\n" +
            "5. Si es incorrecto, pierdes combustible (-10)\n" +
            "6. Necesitas 5 aciertos para que el cohete despegue\n\n" +
            "Ejemplo: Asteroides 3 y 4 → Número 34\n" +
            "Si el objetivo es 25, entonces 34 > 25 = ¡CORRECTO!", 
            {
                fontSize: "18px",
                fontFamily: "Arial",
                color: "#ffffff",
                align: "center",
                backgroundColor: "#000000",
                padding: { x: 20, y: 20 }
            }
        ).setOrigin(0.5);
        helpText.setDepth(this.DEPTHS.FEEDBACK);
        
        // Botón para cerrar ayuda
        const closeButton = this.createButton(640, 600, 100, 40, 0xff0000, "Cerrar", () => {
            helpText.destroy();
            closeButton.button.destroy();
            closeButton.text.destroy();
        });
    }

    updateUI() {
        // Actualizar todos los textos de la UI
        this.targetText.setText(`Objetivo:\n${this.targetNumber}`);
        this.fuelText.setText(`Combustible: ${this.fuel}/${this.maxFuel}`);
        this.scoreText.setText(`Puntuación: ${this.score}`);
        this.correctAnswersText.setText(`Aciertos: ${this.correctAnswers}/${this.correctAnswersNeeded}`);
        this.levelText.setText(`Nivel: ${this.level}`);
    }

    update() {
        if (!this.gameStarted || this.rocketLaunched) return;
        
        // Mover asteroides
        this.asteroids.forEach(asteroidData => {
            if (!asteroidData.active) return;
            
            asteroidData.sprite.x += asteroidData.velocityX;
            asteroidData.sprite.y += asteroidData.velocityY;
            
            // Actualizar posición del texto
            asteroidData.text.setPosition(asteroidData.sprite.x, asteroidData.sprite.y);
            
            // Actualizar posición y rotación de los cráteres
            asteroidData.craters.forEach((crater, index) => {
                if (crater && asteroidData.craterOffsets[index]) {
                    const offset = asteroidData.craterOffsets[index];
                    const angle = asteroidData.craterAngles[index];

                    // Rotar el offset alrededor del centro del asteroide
                    const rotatedX = offset.x * Math.cos(angle) - offset.y * Math.sin(angle);
                    const rotatedY = offset.x * Math.sin(angle) + offset.y * Math.cos(angle);

                    crater.setPosition(
                        asteroidData.sprite.x + rotatedX,
                        asteroidData.sprite.y + rotatedY
                    );
                    // Incrementar el ángulo para la próxima actualización
                    asteroidData.craterAngles[index] += 0.05; // Ajusta la velocidad de rotación aquí
                }
            });
            
            // Rebote en los bordes
            if (asteroidData.sprite.x < 450 || asteroidData.sprite.x > 1230) {
                asteroidData.velocityX *= -1;
            }
            if (asteroidData.sprite.y < 280 || asteroidData.sprite.y > 570) {
                asteroidData.velocityY *= -1;
            }
        });
    }
}

