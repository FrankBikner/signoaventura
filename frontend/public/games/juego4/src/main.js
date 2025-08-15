import { GameScene } from './scenes/GameScene.js';

const config = {
    type: Phaser.AUTO,
    title: 'El Cohete Espacial - Juego de Matemáticas',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#0a0a0a',
    scene: GameScene,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 640,
            height: 360
        },
        max: {
            width: 1920,
            height: 1080
        }
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    render: {
        antialias: true,
        pixelArt: false,
        roundPixels: false
    },
    audio: {
        disableWebAudio: false
    }
};

// Configuración global del juego
window.GAME_CONFIG = {
    // Configuración del juego del cohete
    MAX_LEVEL: 10,
    MIN_LEVEL: 1,
    ROCKET_SPEED: 200,
    
    // Configuración de progreso
    GAME_ID: 4,                // ID del juego en la base de datos
    API_BASE_URL: 'http://localhost:8080/api/pcontrolador'
};

// Funciones para manejar el progreso
window.PROGRESS_MANAGER = {
    getCurrentUser: function() {
        const sessionStudentId = localStorage.getItem('sessionStudentId');
        const sessionUser = localStorage.getItem('sessionUser');
        
        if (!sessionStudentId || !sessionUser) {
            return null;
        }
        
        return {
            id: parseInt(sessionStudentId),
            usuario: sessionUser
        };
    },
    
    loadProgress: async function() {
        const user = this.getCurrentUser();
        if (!user) return null;
        
        try {
            const response = await fetch(`${window.GAME_CONFIG.API_BASE_URL}/progreso/${user.id}/${window.GAME_CONFIG.GAME_ID}`);
            if (response.ok) {
                const progreso = await response.json();
                return progreso;
            } else if (response.status === 404) {
                return null;
            }
        } catch (error) {
            console.error('Error cargando progreso:', error);
        }
        return null;
    },
    
    saveProgress: async function(puntuacion, tiempoJugado) {
        const user = this.getCurrentUser();
        if (!user) {
            return false;
        }
        
        const progresoData = {
            idEstudiante: user.id,
            idJuego: window.GAME_CONFIG.GAME_ID,
            puntuacion: puntuacion,
            fechaIntento: new Date().toISOString(),
            tiempoJugado: tiempoJugado
        };
        
        try {
            const response = await fetch(`${window.GAME_CONFIG.API_BASE_URL}/guardarProgreso`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(progresoData)
            });
            
            if (response.ok) {
                const savedProgress = await response.json();
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }
};

// Crear el juego
window.game = new Phaser.Game(config);

// Eventos globales del juego
window.game.events.on('ready', () => {
    console.log('🚀 El Cohete Espacial - Juego iniciado correctamente');
});

// Manejo de errores
window.addEventListener('error', (event) => {
    console.error('Error en el juego:', event.error);
});

// Manejo de visibilidad de la página
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pausar el juego cuando la pestaña no está visible
        if (window.game && window.game.scene.isActive('GameScene')) {
            window.game.scene.pause('GameScene');
        }
    } else {
        // Reanudar el juego cuando la pestaña vuelve a estar visible
        if (window.game && window.game.scene.isPaused('GameScene')) {
            window.game.scene.resume('GameScene');
        }
    }
});

// Información del juego para debugging
console.log('🚀 El Cohete Espacial - Juego de Matemáticas');
console.log('Versión: 2.0');
console.log('Phaser:', Phaser.VERSION);
console.log('Desarrollado con Phaser 3.90.0');

