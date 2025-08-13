// Configuración principal del juego Phaser
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-canvas',
    backgroundColor: '#87CEEB',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [GameScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 400,
            height: 300
        },
        max: {
            width: 1200,
            height: 900
        }
    }
};

// Crear el juego
const game = new Phaser.Game(config);

// Variables globales para acceso desde HTML
let gameScene = null;

// Cuando el juego esté listo
game.events.on('ready', () => {
    gameScene = game.scene.getScene('GameScene');
    console.log('🎮 Juego de Manzanas Phaser iniciado correctamente');
});

// Event listeners para los botones del HTML
document.addEventListener('DOMContentLoaded', () => {
    const resetBtn = document.getElementById('reset-btn');
    const helpBtn = document.getElementById('help-btn');
    const gameStatus = document.getElementById('game-status');
    
    // Botón de reinicio
    resetBtn.addEventListener('click', () => {
        if (gameScene) {
            gameScene.resetGame();
            gameStatus.textContent = '¡Nuevo problema generado! Arrastra las manzanas.';
        }
    });
    
    // Botón de ayuda
    helpBtn.addEventListener('click', () => {
        const helpMessage = `
🍎 CÓMO JUGAR:

1. Observa el número objetivo en la esquina superior izquierda
2. Arrastra las manzanas del árbol hacia la zona de recolección
3. Recolecta exactamente la cantidad de manzanas que se pide
4. ¡No recolectes más de las necesarias!

🎯 OBJETIVO: Aprender el concepto de igualdad matemática
        `;
        
        alert(helpMessage);
    });
    
    console.log('🎮 Event listeners configurados');
});

// Funciones globales para integración
function getGameStats() {
    if (gameScene) {
        return {
            currentProblem: gameScene.gameState,
            timestamp: new Date().toISOString()
        };
    }
    return null;
}

function setGameDifficulty(minApples, maxApples) {
    if (gameScene) {
        gameScene.gameConfig.minApples = Math.max(1, minApples);
        gameScene.gameConfig.maxApples = Math.min(6, maxApples);
        console.log('⚙️ Dificultad actualizada:', { 
            min: gameScene.gameConfig.minApples, 
            max: gameScene.gameConfig.maxApples 
        });
    }
}

console.log('📱 Juego de Igualdad de Manzanas - Versión Phaser cargado');

