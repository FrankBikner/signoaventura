# 🚗 Carrera Mayor Que - Versión Mejorada 🏁

Un juego educativo desarrollado en Phaser.js para enseñar el concepto matemático de "mayor que" a través de una carrera de carritos interactiva.

## 🎮 Características del Juego

### Mecánica Principal
- **Carritos en movimiento**: Dos carritos avanzan lentamente por carriles separados hacia la meta
- **Selección por tiempo**: Los jugadores tienen 10 segundos para seleccionar el carrito correcto
- **Aceleración**: El carrito con el número correcto acelera y desaparece al salir del área de juego
- **Progresión**: Sistema de niveles y puntuación que aumenta la dificultad gradualmente

### Características Visuales
- **Dos carriles definidos**: Pista de carreras con líneas divisorias claras
- **Interfaz moderna**: Diseño atractivo con gradientes y elementos visuales mejorados
- **Animaciones fluidas**: Movimientos suaves y efectos de celebración
- **Feedback visual**: Mensajes claros para respuestas correctas, incorrectas y tiempo agotado

### Sistema de Tiempo
- **Temporizador visual**: Cuenta regresiva de 10 segundos en tiempo real
- **Barra de progreso**: Indicador visual que cambia de color según el tiempo restante
- **Manejo de tiempo agotado**: Acción automática cuando se acaba el tiempo

## 🛠️ Tecnologías Utilizadas

- **Phaser.js 3.70.0**: Framework de juegos HTML5
- **HTML5 Canvas**: Renderizado de gráficos
- **JavaScript ES6**: Lógica del juego
- **CSS3**: Estilos y diseño responsivo

## 📁 Estructura del Proyecto

```
CarreraMayorQue_Mejorado/
├── index.html                 # Página principal del juego
├── src/
│   ├── main.js               # Configuración principal y constantes globales
│   └── scenes/
│       └── CarreraMayorQueScene.js  # Escena principal del juego
├── assets/
│   ├── images/               # Recursos gráficos
│   └── sounds/               # Recursos de audio (para futuras mejoras)
└── README.md                 # Documentación del proyecto
```

## 🚀 Cómo Ejecutar el Juego

### Opción 1: Servidor Local
```bash
# Navegar al directorio del proyecto
cd CarreraMayorQue_Mejorado

# Iniciar servidor HTTP simple
python3 -m http.server 8080

# Abrir en el navegador
http://localhost:8080
```

### Opción 2: Abrir Directamente
Simplemente abrir el archivo `index.html` en cualquier navegador moderno.

## 🎯 Cómo Jugar

1. **Observa** el número objetivo mostrado en la parte superior
2. **Mira** los números en los dos carritos que avanzan hacia la meta
3. **Haz clic** en el carrito que tenga un número MAYOR que el objetivo
4. **¡Tienes 10 segundos** para decidir antes de que sea demasiado tarde!
5. **Gana puntos** y avanza de nivel con cada respuesta correcta

## ⚙️ Configuración del Juego

El archivo `src/main.js` contiene las configuraciones principales:

```javascript
window.GAME_CONFIG = {
    CAR_BASE_SPEED: 50,        // Velocidad base (píxeles/segundo)
    CAR_FAST_SPEED: 200,       // Velocidad acelerada
    SELECTION_TIME: 10,        // Tiempo límite (segundos)
    FINISH_LINE_X: 700,        // Posición de la meta
    DISAPPEAR_X: 850,          // Punto de desaparición
    // ... más configuraciones
};
```

## 🔧 Mejoras Implementadas

### Respecto a la Versión Original:

#### Nuevas Mecánicas:
- ✅ Movimiento automático y constante de los carritos
- ✅ Sistema de tiempo límite con cuenta regresiva
- ✅ Aceleración del carrito correcto al seleccionar
- ✅ Desaparición automática al salir del área de juego

#### Mejoras Visuales:
- ✅ Dos carriles claramente definidos con líneas divisorias
- ✅ Interfaz de usuario moderna y atractiva
- ✅ Efectos de celebración mejorados (estrellas y confeti)
- ✅ Animaciones más fluidas y profesionales

#### Mejoras Técnicas:
- ✅ Código mejor organizado y documentado
- ✅ Sistema de configuración centralizada
- ✅ Manejo de estados más robusto
- ✅ Separación clara de responsabilidades

## 🎨 Elementos Visuales

### Colores Principales:
- **Fondo**: Gradiente azul cielo a verde claro
- **Pista**: Gris oscuro con líneas amarillas y blancas
- **Carritos**: Rojo y azul con detalles realistas
- **UI**: Verde para botones principales, azul para secundarios

### Efectos Especiales:
- **Sol animado** con efecto de pulsación
- **Nubes flotantes** con movimiento continuo
- **Árboles decorativos** en los laterales
- **Efectos de partículas** para celebraciones

## 📚 Valor Educativo

Este juego está diseñado para:
- **Enseñar** el concepto matemático de "mayor que" (>)
- **Desarrollar** habilidades de comparación numérica
- **Mejorar** la velocidad de procesamiento mental
- **Fomentar** el aprendizaje a través del juego

## 🔮 Futuras Mejoras

### Características Potenciales:
- [ ] Sonidos y efectos de audio
- [ ] Modo multijugador
- [ ] Más tipos de comparaciones (menor que, igual a)
- [ ] Sistema de logros y medallas
- [ ] Estadísticas detalladas de progreso
- [ ] Temas visuales alternativos

### Mejoras Técnicas:
- [ ] Optimización para dispositivos móviles
- [ ] Sistema de guardado de progreso
- [ ] Integración con APIs educativas
- [ ] Modo offline completo

## 👨‍💻 Desarrollo

### Requisitos de Desarrollo:
- Navegador moderno con soporte HTML5
- Editor de código (VS Code recomendado)
- Servidor web local para pruebas

### Estructura del Código:
- **Modular**: Separación clara entre configuración, lógica y presentación
- **Documentado**: Comentarios explicativos en funciones clave
- **Escalable**: Fácil agregar nuevas características
- **Mantenible**: Código limpio y bien organizado

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

**¡Disfruta aprendiendo matemáticas con la Carrera Mayor Que!** 🚗💨

