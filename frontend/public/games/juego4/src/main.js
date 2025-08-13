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

// Crear el juego
window.game = new Phaser.Game(config);

// Eventos globales del juego
window.game.events.on('ready', () => {
    console.log('El Cohete Espacial - Juego iniciado correctamente');
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

