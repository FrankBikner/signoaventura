// Configuración principal del juego
const config = {
    type: Phaser.AUTO,
    width: 900,
    height: 600,
    parent: 'phaser-game',
    backgroundColor: '#87CEEB',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [CarreraMayorQueScene]
};

// Inicializar el juego
const game = new Phaser.Game(config);

// Configuración global del juego
window.GAME_CONFIG = {
    // Configuración de carritos
    CAR_BASE_SPEED: 50,        // Velocidad base en píxeles/segundo
    CAR_FAST_SPEED: 200,       // Velocidad rápida cuando es correcto
    CAR_START_X: 100,          // Posición inicial X de los carritos
    CAR_LANE_Y: [350, 450],    // Posiciones Y de los dos carriles
    FINISH_LINE_X: 700,        // Posición X de la línea de meta
    DISAPPEAR_X: 850,          // Posición X donde desaparecen los carritos
    
    // Configuración de tiempo
    SELECTION_TIME: 10,        // Tiempo límite para seleccionar (segundos)
    
    // Configuración de números
    MIN_NUMBER: 1,
    MAX_NUMBER: 10,
    
    // Configuración visual
    LANE_WIDTH: 80,
    TRACK_HEIGHT: 200,
    
    // Configuración de progreso
    GAME_ID: 1,                // ID del juego en la base de datos
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

console.log('🎮 Juego de Carrera Mayor Que - Versión Mejorada iniciado');

