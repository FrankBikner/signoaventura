
export interface LoginRequest {
  usuario: string;
  contrasenia: string;
}

export interface LoginResponse {
  Message: string;
  token: string;
  username: string;
}