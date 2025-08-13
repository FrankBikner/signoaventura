# El Cohete Espacial - Juego de Matemáticas

Un juego educativo desarrollado en Phaser donde el jugador debe ayudar a un cohete a obtener combustible resolviendo operaciones matemáticas.

## Descripción del Juego

El cohete necesita combustible para despegar. Los asteroides flotan por el espacio con operaciones matemáticas (sumas y restas). El jugador debe hacer clic en los asteroides cuyo resultado sea **MAYOR** que el número objetivo del cohete para ganar combustible.

## Mecánicas del Juego

- **Objetivo**: Hacer clic en asteroides con resultados mayores al número objetivo
- **Combustible**: Se gana +20 por respuesta correcta, se pierde -10 por respuesta incorrecta
- **Despegue**: Se necesitan 100 puntos de combustible para que el cohete despegue
- **Dificultad**: Operaciones de suma y resta con números de hasta dos dígitos
- **Movimiento**: Los asteroides se mueven constantemente por la pantalla

## Controles

- **Clic izquierdo**: Seleccionar asteroide
- **Botón "Nuevo Lanzamiento"**: Reiniciar el juego
- **Botón "Ayuda"**: Mostrar instrucciones

## Características

- Animaciones fluidas de asteroides y cohete
- Efectos de fuego y humo al despegar
- Sistema de puntuación
- Interfaz intuitiva con barra de combustible
- Efectos visuales para aciertos y errores
- Asteroides con rotación y movimiento realista

## Cómo Ejecutar

1. Abrir una terminal en la carpeta del proyecto
2. Ejecutar un servidor HTTP local:
   ```bash
   python3 -m http.server 8000
   ```
3. Abrir el navegador en `http://localhost:8000`

## Archivos del Proyecto

- `index.html` - Página principal del juego
- `src/main.js` - Configuración principal de Phaser
- `src/scenes/GameScene.js` - Lógica principal del juego
- `assets/images/` - Recursos gráficos (cohete, base, fondo)
- `phaser.js` - Biblioteca Phaser 3

## Tecnologías Utilizadas

- **Phaser 3** - Motor de juegos HTML5
- **JavaScript ES6** - Programación del juego
- **HTML5 Canvas** - Renderizado gráfico
- **CSS3** - Estilos de la página

## Objetivos Educativos

- Práctica de operaciones matemáticas básicas
- Desarrollo del cálculo mental
- Mejora de la velocidad de procesamiento numérico
- Coordinación ojo-mano con elementos en movimiento

¡Disfruta ayudando al cohete a despegar mientras practicas matemáticas!

