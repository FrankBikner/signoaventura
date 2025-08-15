import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Juego, RequestJuegoDto } from '../models/juego';
import { Progreso } from '../models/progreso';

@Injectable({ providedIn: 'root' })
export class JuegosService {

  private apiUrl = 'http://localhost:8080/api/juegos';

  constructor(private http: HttpClient) {}

  listar(): Observable<Juego[]> {
    return this.http.get<Juego[]>(`${this.apiUrl}`);
  }

  obtener(id: number): Observable<Juego> {
    return this.http.get<Juego>(`${this.apiUrl}/${id}`);
  }

  crear(dto: RequestJuegoDto): Observable<Juego> {
    return this.http.post<Juego>(`${this.apiUrl}`, dto);
  }

  actualizar(id: number, dto: RequestJuegoDto): Observable<Juego> {
    return this.http.put<Juego>(`${this.apiUrl}/${id}`, dto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  obtenerProgresos(usuario: string): Observable<Progreso[]> {
    return this.http.get<Progreso[]>(`http://localhost:8080/api/pcontrolador/progresos/${usuario}`);
  }
}


