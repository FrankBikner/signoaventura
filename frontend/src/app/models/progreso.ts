import { Juego } from './juego';

export interface Progreso {
  idProgreso: number;
  juego: Juego;
  puntuacion: number;
  fechaIntento: string;
  tiempoJugado: string;
  urlImagen?: string;
  urlJuego?: string;
}



