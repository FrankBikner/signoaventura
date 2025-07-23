import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { PersonService } from '../../api/person.service';
import { NotifyComponent } from "../notify/notify";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Importar Router para la redirección

@Component({
  selector: 'app-insert',
  standalone: true, // Asegúrate de que sea standalone si no está en un módulo
  imports: [
    CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NotifyComponent
  ],
  templateUrl: './insert.html',
  styleUrl: './insert.css'
})
export class InsertComponent {
  frmPersonInsert: UntypedFormGroup;

	get dniFb() { return this.frmPersonInsert.controls['dni']; }
	get passwordFb() { return this.frmPersonInsert.controls['password']; }
	get passwordRetypeFb() { return this.frmPersonInsert.controls['passwordRetype']; }
	get firstNameFb() { return this.frmPersonInsert.controls['firstName']; }
	get surNameFb() { return this.frmPersonInsert.controls['surName']; }
	get emailFb() { return this.frmPersonInsert.controls['email']; } // Aunque no se usa en HTML, se mantiene
	get birthDateFb() { return this.frmPersonInsert.controls['birthDate']; }
	get genderFb() { return this.frmPersonInsert.controls['gender']; }

	typeResponse: string = '';
	listMessageResponse: string[] = [];

	constructor(
		private formBuilder: FormBuilder,
		private personService: PersonService,
    private router: Router // Inyectar el servicio Router
	) {
		this.frmPersonInsert = this.formBuilder.group({
			dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
			password: ['', [Validators.required]],
			passwordRetype: ['', []], // No se requiere validación 'required' aquí, ya que se compara con password
			firstName: ['', [Validators.required]],
			surName: ['', [Validators.required]],
			birthDate: ['', [Validators.required]],
			gender: ['', [Validators.required]]
		});
	}

	public diffPassword(): boolean {	
		// Solo compara si ambos campos tienen valor para evitar errores al inicio
		if (this.passwordFb.value && this.passwordRetypeFb.value && this.passwordFb.value !== this.passwordRetypeFb.value) {
			return true;
		}
		return false;
	}

	public save(): void {
		// Marcar todos los controles como tocados y sucios para mostrar errores de validación
		if(!this.frmPersonInsert.valid || this.diffPassword()) {
			this.frmPersonInsert.markAllAsTouched();
			// No es necesario markAsDirty() para el formulario completo si ya se marcan los controles
			return;
		}

		let formData = new FormData();

		formData.append('dni', this.dniFb.value);
		formData.append('firstName', this.firstNameFb.value);
		formData.append('surName', this.surNameFb.value);
		formData.append('birthDate', this.birthDateFb.value);
		formData.append('gender', this.genderFb.value);
		formData.append('password', this.passwordFb.value);

		this.personService.insert(formData).subscribe({
			next: (response: any) => {
				this.typeResponse = response.mo.type;
				this.listMessageResponse = response.mo.listMessage;

				switch(response.mo.type) {
					case 'success':
						this.frmPersonInsert.reset(); // Limpiar el formulario
            // Redirigir a la página de listado de estudiantes después de un registro exitoso
            this.router.navigate(['/person/getall']);
						break;
				}
			},
			error: (error: any) => {
				console.log(error);
        // Opcional: Mostrar un mensaje de error genérico si la API falla
        this.typeResponse = 'error';
        this.listMessageResponse = ['Ocurrió un error al registrar la persona.'];
			}
		});
	}
	 logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // 🔧 ESTA es la función que te faltaba:
  navigate(ruta: string): void {
    this.router.navigate([ruta]);
  }
}
