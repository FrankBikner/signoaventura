export enum NivelDificultad {
  FACIL = 'FACIL',
  MEDIO = 'MEDIO',
  DIFICIL = 'DIFICIL'
}

export enum Operador {
  MENOR = 'MENOR',
  MAYOR = 'MAYOR',
  IGUAL = 'IGUAL'
}

export interface Juego {
  idJuego: number;
  nombreJuego: string;
  descripcion: string;
  operador: Operador;
  nivelDificultad: NivelDificultad;
  activo: boolean;
  fechaCreacion: string;
  urlImagen?: string;
  urlJuego?: string;
}

export interface RequestJuegoDto {
  nombreJuego: string;
  descripcion: string;
  operador: Operador;
  nivelDificultad: NivelDificultad;
  activo?: boolean;
  urlImagen?: string;
  urlJuego?: string;
}


