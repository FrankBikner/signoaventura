// Configuración principal del juego
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
    scene: [GameScene]
};

// Crear el juego
const game = new Phaser.Game(config);

// Configuración global del juego
window.GAME_CONFIG = {
    // Configuración del juego de globos
    MAX_BALLOONS: 6,
    MIN_BALLOONS: 1,
    NUMBER_OF_GROUPS: 3,
    BALLOON_COLORS: ['red', 'blue', 'green', 'yellow', 'purple'],
    
    // Configuración de progreso
    GAME_ID: 2,                // ID del juego en la base de datos
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

// Configurar controles del DOM
document.addEventListener('DOMContentLoaded', function() {
    const resetBtn = document.getElementById('reset-btn');
    const helpBtn = document.getElementById('help-btn');
    const gameStatus = document.getElementById('game-status');
    
    // Botón de reinicio
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            if (game.scene.scenes[0]) {
                game.scene.scenes[0].resetGame();
                gameStatus.textContent = '¡Arrastra el grupo de globos que tenga MENOS cantidad que el número indicado!';
            }
        });
    }
    
    // Botón de ayuda
    if (helpBtn) {
        helpBtn.addEventListener('click', function() {
            alert('INSTRUCCIONES:\\n\\n' +
                  '1. Observa el número en la parte superior\\n' +
                  '2. Busca TODOS los grupos de globos que tengan MENOS globos que ese número\\n' +
                  '3. Haz clic en cada grupo correcto\\n' +
                  '4. Puedes seleccionar múltiples grupos si son correctos\\n' +
                  '5. ¡Gana puntos por cada grupo correcto!\\n\\n' +
                  'Ejemplo: Si el número es 4, puedes seleccionar grupos con 1, 2 o 3 globos.');
        });
    }
    
    console.log('🎮 Controles del DOM configurados');
});

// Funciones de utilidad
window.gameUtils = {
    // Función para obtener información del estado del juego
    getGameState: function() {
        if (game.scene.scenes[0]) {
            return game.scene.scenes[0].gameState;
        }
        return null;
    },
    
    // Función para reiniciar el juego desde el exterior
    resetGame: function() {
        if (game.scene.scenes[0]) {
            game.scene.scenes[0].resetGame();
        }
    }
};

console.log('🎈 Juego de Globos "Menor Que" - Versión con Progreso iniciado');

