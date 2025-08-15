export interface ReporteEstudiante {
  idEstudiante: number;
  nombre: string;
  apellido: string;
  email: string;
  fechaIngreso: string;
  fechaNacimiento: string;
  totalPuntuacion: number;
  tiempoTotal: string;
  cantidadJuegos: number;
  promedioPuntuacion: number;
}

export interface ReporteJuego {
  idJuego: number;
  nombreJuego: string;
  descripcion: string;
  concepto: string;
  nivelDificultad: string;
  operador: string;
  fechaCreacion: string;
  activo: boolean;
  totalJugadores: number;
  puntuacionPromedio: number;
  tiempoPromedio: string;
}

export interface ReporteGeneral {
  totalEstudiantes: number;
  totalJuegos: number;
  totalProgresos: number;
  puntuacionPromedio: number;
  tiempoPromedio: string;
}

export interface JugadorPorJuego {
  idProgreso: number;
  nombreEstudiante: string;
  apellidoEstudiante: string;
  emailEstudiante: string;
  puntuacion: number;
  tiempoJugado: string;
  fechaIntento: string;
  nombreJuego: string;
}
