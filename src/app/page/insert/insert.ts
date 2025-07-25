import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { PersonService } from '../../api/person.service';
import { NotifyComponent } from "../notify/notify";
import { CommonModule } from '@angular/common';
import { RequestEstDto } from '../../models/requestEstDto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-insert',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    //NotifyComponent
  ],
  templateUrl: './insert.html',
  styleUrls: ['./insert.css']
})
export class InsertComponent {
  frmPersonInsert: FormGroup;
  showPassword = false;
  loading = false;
  today = new Date().toISOString().split('T')[0];

  // Propiedades para notificaciones
  typeResponse: string = '';
  listMessageResponse: string[] = [];

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
      fechaNacimiento: ['', [Validators.required]],
      contrasenia: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasenia: ['', [Validators.required]],
      activo: [true, [Validators.required]],
      rol: ['ESTUDIANTE']
    });
  }

  navigate(ruta: string): void {
    this.router.navigate([ruta]);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
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
    if (this.frmPersonInsert.invalid || this.passwordsDontMatch()) {
      this.frmPersonInsert.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.typeResponse = '';
    this.listMessageResponse = [];

    const formData: RequestEstDto = {
      nombre: this.frmPersonInsert.get('nombre')?.value,
      apellido: this.frmPersonInsert.get('apellido')?.value,
      email: this.frmPersonInsert.get('email')?.value,
      usuario: this.frmPersonInsert.get('usuario')?.value,
      contrasenia: this.frmPersonInsert.get('contrasenia')?.value,
      fechaNacimiento: this.frmPersonInsert.get('fechaNacimiento')?.value,
      activo: this.frmPersonInsert.get('activo')?.value,
      nombreRol: this.frmPersonInsert.get('rol')?.value
    };

    this.personService.insert(formData).subscribe({
      next: (response: any) => {
        this.typeResponse = 'success';
        this.listMessageResponse = ['Estudiante registrado exitosamente'];
        
        // Resetear el formulario
        this.frmPersonInsert.reset();
        this.frmPersonInsert.get('rol')?.setValue('ESTUDIANTE');
        this.frmPersonInsert.get('activo')?.setValue(true);
        
        this.loading = false;
      },
      error: (error: any) => {
        console.error(error);
        this.typeResponse = 'error';
        this.listMessageResponse = error.error?.listMessage || ['Ocurrió un error al registrar el estudiante'];
        this.loading = false;
      },
      complete: () => {
        this.loading = false; // Asegurarse que loading sea false al completarse
      }
    });
  }
}