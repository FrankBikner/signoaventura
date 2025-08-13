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
    TRACK_HEIGHT: 200
};

console.log('🎮 Juego de Carrera Mayor Que - Versión Mejorada iniciado');

