import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../../api/person.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EditDTO } from '../../models/editDTO';


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
  errorMessage: string | null = null;
  successMessage: string | null = null;
  showPassword = false;

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
      return;
    }

    this.cargarEstudiante();
  }

  cargarEstudiante(): void {
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
            this.estudianteForm.get('usuario')?.disable(); // 🚀 Deshabilitar edición
          }
        },
        error: () => {
          this.errorMessage = 'Error al cargar los datos del estudiante';
        }
      });
  }

  private formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
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

    const formValue = this.estudianteForm.getRawValue(); // getRawValue para incluir campo usuario deshabilitado
    const datosActualizados: EditDTO = {
      nombre: formValue.nombre,
      apellido: formValue.apellido,
      usuario: this.usuarioOriginal, // 🚀 Siempre enviamos el original
      email: formValue.email,
      contrasenia: formValue.contrasenia || '',
      fechaNacimiento: formValue.fechaNacimiento
    };

    this.errorMessage = null;
    this.successMessage = null;

    this.personService.actualizarEstudiante(datosActualizados)
      .subscribe({
        next: () => {
          this.successMessage = 'Estudiante actualizado correctamente';
          setTimeout(() => {
            this.router.navigate(['/getall']);
          }, 2000);
        }, 
        error: (err) => {
          console.log(datosActualizados);
          this.errorMessage = 'Error al actualizar el estudiante';
          console.error('Error al actualizar estudiante:', err);
        }
      });
  }

  cancelarEdicion(): void {
    if (confirm('¿Está seguro que desea cancelar? Los cambios no guardados se perderán.')) {
      this.router.navigate(['/getall']);
    }
  }

   navigate(ruta: string): void {
    this.router.navigate([ruta]);
  }
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
