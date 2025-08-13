import { HttpClient, } from '@angular/common/http';
import { Injectable,  } from '@angular/core';
import { Observable,} from 'rxjs';

import { RequestEstDto } from '../models/requestEstDto';
import { LoginRequest, LoginResponse } from '../models/auth.interfaces';
import { RequestDctDto } from '../models/requestDctDto';
import { EditDTO } from '../models/editDTO';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
 // private apiUrl = "/back" // ✅ Nombre del servicio en Docker

  private apiUrl = "http://localhost:8080"; 

  constructor(
    private httpClient: HttpClient,
  ) {}


  public getData(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/person/getdata`)
  }

   public login(credentials: LoginRequest): Observable<boolean> {
    return this.httpClient.get<boolean>(
      `${this.apiUrl}/api/auth/login/${credentials.usuario}/${credentials.contrasenia}`
    );
  }
  public insert(formData: RequestEstDto): Observable<any> {
    return this.httpClient.post(
      `${this.apiUrl}/EControlador/guardarEst`,
      formData
    )
  }

  public getAll(): Observable<any> {
    return this.httpClient.get(
      `${this.apiUrl}/EControlador/obtenerEstudiantes`
    )

  }

  public cambiarEstado(usuario: string, estado : boolean): Observable<any> {
    return this.httpClient.delete(
      `${this.apiUrl}/EControlador/estadoEst/${usuario}/${estado}`
    )
  }


  // Método corregido para obtener estudiante
  public getEstudiantePorUsuario(usuario: string): Observable<any> {
    return this.httpClient.get<RequestEstDto>(
          `${this.apiUrl}/EControlador/obtenerEst/${usuario}`

          );
  }
  public actualizarEstudiante(est : EditDTO) : Observable<any>{
    return this.httpClient.put(`${this.apiUrl}/EControlador/actualizarEst`,est)

  }

  public obtenerUsuario(usuario:String):Observable<any>{
    return this.httpClient.get( `${this.apiUrl}/api/auth/usuario/${usuario}`); 
  }

  public insertDocente(formData: RequestDctDto): Observable<any> {
    return this.httpClient.post(
      `${this.apiUrl}/DControlador/guardarDct`,
      formData
    )
  }
}