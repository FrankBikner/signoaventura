import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { PersonService } from '../../api/person.service';
import { Router } from '@angular/router';
import { NotifyComponent } from '../notify/notify';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
     // Añadido el componente de notificaciones
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private formBuilder = inject(FormBuilder);
  private personService = inject(PersonService);
  private router = inject(Router);

  // Formulario reactivo con validación de 2 caracteres para contraseña
  frmPersonLogin = this.formBuilder.group({
    usuario: ['', [Validators.required, Validators.minLength(4)]],
    contrasenia: ['', [Validators.required, Validators.minLength(2)]] // Cambiado a 2 caracteres
  });

  // Estados del componente
  loading: boolean = false;
  showPassword: boolean = false;
  errorMessage: string | null = null;

  // Getters para acceder fácilmente a los controles
  get usuario() { return this.frmPersonLogin.get('usuario'); }
  get contrasenia() { return this.frmPersonLogin.get('contrasenia'); }

  // Método de login
  public login(): void {
    if (this.frmPersonLogin.invalid) {
      this.markFormGroupTouched(this.frmPersonLogin);
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const credentials = {
      usuario: this.usuario?.value?.trim() || '',
      contrasenia: this.contrasenia?.value || ''
    };

    this.personService.login(credentials).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('username', response.username);
          this.router.navigate(['/inicio']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = this.getErrorMessage(error);
        console.error('Login error:', error);
      }
    });
  }

  // Manejo de mensajes de error
  private getErrorMessage(error: any): string {
    if (error.status === 401) {
      return 'Credenciales incorrectas';
    }
    if (error.error?.message) {
      return error.error.message;
    }
    return 'Error en el servidor. Por favor intente más tarde.';
  }

  // Alternar visibilidad de contraseña
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Marcar todos los campos como tocados
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control: AbstractControl) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}