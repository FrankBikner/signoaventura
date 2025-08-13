import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { PersonService } from '../../api/person.service';
import { NotifyComponent } from '../notify/notify';
import { CommonModule } from '@angular/common';
import { RequestEstDto } from '../../models/requestEstDto';
import { Router } from '@angular/router';
import { RequestDctDto } from '../../models/requestDctDto';

@Component({
  selector: 'app-registro-usuario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NotifyComponent
  ],
  templateUrl: './registro-usuario.html',
  styleUrls: ['./registro-usuario.css']
})
export class RegistroUsuario {
  frmPersonInsert: FormGroup;
  showPassword = false;
  loading = false;
  today = new Date().toISOString().split('T')[0];
  userType: 'ESTUDIANTE' | 'DOCENTE' | null = null;

  // Propiedades para notificaciones
  typeResponse: string = '';
  messages: string[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private personService: PersonService
  ) {
    this.frmPersonInsert = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      usuario: ['', [Validators.required, Validators.minLength(4)]],
      fechaNacimiento: [''],
      contrasenia: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasenia: ['', [Validators.required]],
      activo: [true, [Validators.required]]
    });
  }

  selectUserType(type: 'ESTUDIANTE' | 'DOCENTE'): void {
    this.userType = type;
    const fechaNacimientoControl = this.frmPersonInsert.get('fechaNacimiento');
    if (type === 'ESTUDIANTE') {
      fechaNacimientoControl?.setValidators([Validators.required]);
    } else {
      fechaNacimientoControl?.clearValidators();
      fechaNacimientoControl?.setValue('');
    }
    fechaNacimientoControl?.updateValueAndValidity();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  passwordsDontMatch(): boolean {
    const pass = this.frmPersonInsert.get('contrasenia')?.value;
    const confirmPass = this.frmPersonInsert.get('confirmarContrasenia')?.value;
    return pass !== confirmPass;
  }

  public save(): void {
    if (this.frmPersonInsert.invalid || this.passwordsDontMatch() || !this.userType) {
      this.frmPersonInsert.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.typeResponse = '';
    this.messages = [];

    const successMessage = this.userType === 'ESTUDIANTE' 
      ? 'Estudiante registrado exitosamente' 
      : 'Docente registrado exitosamente';

    const errorMessage = this.userType === 'ESTUDIANTE'
      ? 'Ocurrió un error al registrar el estudiante'
      : 'Ocurrió un error al registrar el docente';

    const observable = this.userType === 'ESTUDIANTE'
      ? this.personService.insert(this.getStudentData())
      : this.personService.insertDocente(this.getTeacherData());

    observable.subscribe({
      next: (response: any) => {
        this.typeResponse = 'success';
        this.messages = [successMessage, 'Ya puedes iniciar sesión'];
        this.resetForm();
        this.loading = false;
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error: any) => {
        console.error(error);
        this.typeResponse = 'error';
        this.messages = error.error?.listMessage || [errorMessage];
        this.loading = false;
      }
    });
  }

  private getStudentData(): RequestEstDto {
    return {
      nombre: this.frmPersonInsert.get('nombre')?.value,
      apellido: this.frmPersonInsert.get('apellido')?.value,
      email: this.frmPersonInsert.get('email')?.value,
      usuario: this.frmPersonInsert.get('usuario')?.value,
      contrasenia: this.frmPersonInsert.get('contrasenia')?.value,
      fechaNacimiento: this.frmPersonInsert.get('fechaNacimiento')?.value,
      activo: this.frmPersonInsert.get('activo')?.value,
      nombreRol: 'ESTUDIANTE'
    };
  }

  private getTeacherData(): RequestDctDto {
    return {
      nombre: this.frmPersonInsert.get('nombre')?.value,
      apellido: this.frmPersonInsert.get('apellido')?.value,
      email: this.frmPersonInsert.get('email')?.value,
      usuario: this.frmPersonInsert.get('usuario')?.value,
      contrasenia: this.frmPersonInsert.get('contrasenia')?.value,
      activo: this.frmPersonInsert.get('activo')?.value,
      nombreRol: 'DOCENTE'
    };
  }

  private resetForm(): void {
    this.frmPersonInsert.reset();
    this.frmPersonInsert.get('activo')?.setValue(true);
    this.userType = null;
  }
}