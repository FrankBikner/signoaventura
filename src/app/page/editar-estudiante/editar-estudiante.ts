import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../../api/person.service';
import { RequestEstDto } from '../../models/requestEstDto';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-editar-estudiante',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './editar-estudiante.html',
  styleUrls: ['./editar-estudiante.css']
})
export class EditarEstudianteComponent implements OnInit {
  estudianteForm: FormGroup;
  usuarioOriginal: string = '';
  loading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  showPassword = false;
  roles: string[] = ['ESTUDIANTE', 'PROFESOR', 'ADMINISTRADOR'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private personService: PersonService
  ) {
    this.estudianteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      apellido: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      usuario: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      contrasenia: ['', [Validators.minLength(6)]],
      fechaNacimiento: ['']
    });
  }

  ngOnInit(): void {
    this.usuarioOriginal = this.route.snapshot.paramMap.get('usuario') || '';
    
    if (!this.usuarioOriginal) {
      this.errorMessage = 'No se ha especificado un estudiante para editar';
      this.loading = false;
      return;
    }

    this.cargarEstudiante();
  }

  cargarEstudiante(): void {
    this.loading = true;
    this.errorMessage = null;

    this.personService.getEstudiantePorUsuario(this.usuarioOriginal)
      .subscribe({
        next: (estudiante) => {
          if (estudiante) {
            this.estudianteForm.patchValue({
              nombre: estudiante.nombre,
              apellido: estudiante.apellido,
              usuario: estudiante.usuario,
              email: estudiante.email,
              fechaNacimiento: this.formatDateForInput(estudiante.fechaNacimiento)
            });
          }
          console.log(estudiante)
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Error al cargar los datos del estudiante';
          this.loading = false;
        }
      });
  }

  private formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (e) {
      console.warn('Formato de fecha inválido:', dateString);
      return '';
    }
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  guardarCambios(): void {
    if (this.estudianteForm.invalid) {
      this.errorMessage = 'Por favor complete todos los campos requeridos correctamente';
      return;
    }

    const formValue = this.estudianteForm.value;
    const datosActualizados: RequestEstDto = {
      nombre: formValue.nombre,
      apellido: formValue.apellido,
      usuario: formValue.usuario,
      email: formValue.email,
      contrasenia: formValue.contrasenia || '',
      fechaNacimiento: formValue.fechaNacimiento,
      nombreRol: formValue.nombreRol,
      activo: formValue.activo
    };

    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.personService.actualizarEstudiante(datosActualizados)
      .pipe(
        catchError(error => {
          console.error('Error al actualizar:', error);
          this.errorMessage = 'Error al actualizar el estudiante';
          this.loading = false;
          return of(null);
        })
      )
      .subscribe({
        next: () => {
          this.successMessage = 'Estudiante actualizado correctamente';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/estudiantes']);
          }, 2000);
        }
      });
  }

  cancelarEdicion(): void {
    if (confirm('¿Está seguro que desea cancelar? Los cambios no guardados se perderán.')) {
      this.router.navigate(['/getall']);
    }
  }
}