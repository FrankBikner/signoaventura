import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

import { RequestEstDto } from '../models/requestEstDto';
import { LoginRequest, LoginResponse } from '../models/auth.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private apiUrl = "http://localhost:8080";

  constructor(
    private httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getToken(): string | null {
    if (typeof window !== 'undefined' && isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? {'Authorization': `Bearer ${token}`} : {})
    });
  }

  public getData(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/person/getdata`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  public login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(
      `${this.apiUrl}/login`, 
      credentials, 
      { headers: new HttpHeaders({'Content-Type': 'application/json'}) }
    ).pipe(
      catchError(this.handleError)
    );
  }

  public insert(formData: RequestEstDto): Observable<any> {
    return this.httpClient.post(
      `${this.apiUrl}/EControlador/guardarEst`,
      formData,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  public getAll(): Observable<any> {
    return this.httpClient.get(
      `${this.apiUrl}/EControlador/obtenerEstudiantes`,
      { headers: this.getHeaders() }
    ).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  public cambiarEstado(usuario: string, estado : boolean): Observable<any> {
    return this.httpClient.delete(
      `${this.apiUrl}/EControlador/estadoEst/${usuario}/${estado}`,
      { headers: this.getHeaders() }
    )
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en PersonService:', error);
    let errorMessage = 'Ocurrió un error';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código: ${error.status}\nMensaje: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  // Método corregido para obtener estudiante
  public getEstudiantePorUsuario(usuario: string): Observable<any> {
    return this.httpClient.get<RequestEstDto>(
          `${this.apiUrl}/EControlador/obtenerEst/${usuario}`,
          { 
            headers: this.getHeaders(),
          }

          );
  }
  public actualizarEstudiante(est : RequestEstDto) : Observable<any>{
    return this.httpClient.put(`${this.apiUrl}/EControlador/actualizarEst/`,est)

  }
}