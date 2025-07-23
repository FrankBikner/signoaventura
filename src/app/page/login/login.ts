import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { PersonService } from '../../api/person.service';
import { Router } from '@angular/router';
import { NotifyComponent } from '../notify/notify';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule
],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  frmPersonLogin: UntypedFormGroup;

	typeResponse: string = '';
	listMessageResponse: string[] = [];

	get dniFb() { return this.frmPersonLogin.controls['dni']; }
	get passwordFb() { return this.frmPersonLogin.controls['password']; }

	constructor(
		private formBuilder: FormBuilder,
		private personService: PersonService,
		private router: Router
	) {
		this.frmPersonLogin = this.formBuilder.group({
			dni: ['', []],
			password: ['', []]
		});
	}

	public login(): void {
		let formData = new FormData();

		formData.append('dni', this.dniFb.value);
		formData.append('password', this.passwordFb.value);

		this.personService.login(formData).subscribe({
			next: (response: any) => {
				this.typeResponse = response.mo.type;
				this.listMessageResponse = response.mo.listMessage;

				switch(response.mo.type) {
					case 'success':
						localStorage.setItem('sessionJwtToken', response.dto.person.jwtToken);
						localStorage.setItem('sessionIdPerson', response.dto.person.idPerson);
						localStorage.setItem('sessionFirstName', response.dto.person.firstName);

						this.router.navigate(['getall']);

						break;
				}
			},
			error: (error: any) => {
				console.log(error);
			}
		});
	}
		logout() {
	// Limpiar sesión o tokens si los usas
	localStorage.clear();
	this.router.navigate(['/login']);
}
}
