import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { PersonService } from '../../api/person.service';
import { Router } from '@angular/router';
import { NotifyComponent } from '../notify/notify';
import { CommonModule } from '@angular/common';
import { response } from 'express';

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

  frmPersonLogin = this.formBuilder.group({
    usuario: ['', [Validators.required, Validators.minLength(4)]],
    contrasenia: ['', [Validators.required, Validators.minLength(2)]]
  });

  loading: boolean = false;
  showPassword: boolean = false;
  errorMessage: string | null = null;

  get usuario() { return this.frmPersonLogin.get('usuario'); }
  get contrasenia() { return this.frmPersonLogin.get('contrasenia'); }

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
      next: (ok) => {
        if (!ok) {
          this.loading = false;
          this.errorMessage = 'Credenciales incorrectas';
          return;
        }
        this.personService.obtenerUsuarioConInfo(credentials.usuario).subscribe({
          next: (usr) => {
            try {
              localStorage.setItem('sessionUser', credentials.usuario);
              localStorage.setItem('sessionUserId', String(usr.idUsuario ?? ''));
              localStorage.setItem('sessionFirstName', usr.nombre ?? '');
              localStorage.setItem('sessionLastName', usr.apellido ?? '');
              localStorage.setItem('sessionEmail', usr.email ?? '');
              localStorage.setItem('sessionRole', usr.rol?.nombreRol ?? '');
              localStorage.setItem('sessionActive', String(usr.activo ?? ''));
              
              if (usr.esEstudiante && usr.idEstudiante) {
                localStorage.setItem('sessionStudentId', String(usr.idEstudiante));
                console.log('✅ ID del estudiante guardado:', usr.idEstudiante);
              }
            } catch {}

            this.loading = false;
            const tipoRol = usr.rol?.nombreRol;
            if (tipoRol === 'DOCENTE') {
              this.router.navigate(['/inicio']);
            } else if (tipoRol === 'ESTUDIANTE') {
              this.router.navigate(['/juegos']);
            } else {
              this.router.navigate(['/login']);
            }
          },
          error: (error) => {
            this.loading = false;
            this.errorMessage = this.getErrorMessage(error);
            console.error('Error al obtener usuario:', error);
          }
        });
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = this.getErrorMessage(error);
        console.error('Login error:', error);
      }
    });
  }

  private getErrorMessage(error: any): string {
    if (error.status === 401) {
      return 'Credenciales incorrectas';
    }
    if (error.error?.message) {
      return error.error.message;
    }
    return 'Error en el servidor. Por favor intente más tarde.';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control: AbstractControl) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}