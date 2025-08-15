import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReporteEstudiante, ReporteJuego, ReporteGeneral, JugadorPorJuego } from '../models/reportes';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private baseUrl = 'http://localhost:8080/api/reportes';

  constructor(private http: HttpClient) { }

  obtenerReporteEstudiantes(): Observable<ReporteEstudiante[]> {
    return this.http.get<ReporteEstudiante[]>(`${this.baseUrl}/estudiantes`);
  }

  obtenerReporteJuegos(): Observable<ReporteJuego[]> {
    return this.http.get<ReporteJuego[]>(`${this.baseUrl}/juegos`);
  }

  obtenerReporteGeneral(): Observable<ReporteGeneral> {
    return this.http.get<ReporteGeneral>(`${this.baseUrl}/general`);
  }

  obtenerJugadoresPorJuego(idJuego: number): Observable<JugadorPorJuego[]> {
    return this.http.get<JugadorPorJuego[]>(`${this.baseUrl}/jugadores-juego/${idJuego}`);
  }

  obtenerTopEstudiantes(): Observable<ReporteEstudiante[]> {
    return this.http.get<ReporteEstudiante[]>(`${this.baseUrl}/top-estudiantes`);
  }

  descargarPDFEstudiantes(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/estudiantes/pdf`, { responseType: 'blob' });
  }

  descargarPDFJuegos(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/juegos/pdf`, { responseType: 'blob' });
  }

  descargarPDFGeneral(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/general/pdf`, { responseType: 'blob' });
  }

  descargarPDFDetallado(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/detallado/pdf`, { responseType: 'blob' });
  }

  descargarPDFJugadoresPorJuego(idJuego: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/jugadores-juego/${idJuego}/pdf`, { responseType: 'blob' });
  }
}
