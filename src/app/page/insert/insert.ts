import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { PersonService } from '../../api/person.service';
import { NotifyComponent } from "../notify/notify";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-insert',
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
	get emailFb() { return this.frmPersonInsert.controls['email']; }
	get birthDateFb() { return this.frmPersonInsert.controls['birthDate']; }
	get genderFb() { return this.frmPersonInsert.controls['gender']; }

	typeResponse: string = '';
	listMessageResponse: string[] = [];

	constructor(
		private formBuilder: FormBuilder,
		private personService: PersonService
	) {
		this.frmPersonInsert = this.formBuilder.group({
			dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
			password: ['', [Validators.required]],
			passwordRetype: ['', []],
			firstName: ['', [Validators.required]],
			surName: ['', [Validators.required]],
			birthDate: ['', [Validators.required]],
			gender: ['', [Validators.required]]
		});
	}

	public diffPassword(): boolean {	
		if(this.passwordFb.value != this.passwordRetypeFb.value) {
			return true;
		}
	
		return false;
	}

	public save(): void {
		if(!this.frmPersonInsert.valid || this.diffPassword()) {
			this.frmPersonInsert.markAllAsTouched();
			this.frmPersonInsert.markAsDirty();

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
						this.frmPersonInsert.reset();

						break;
				}
			},
			error: (error: any) => {
				console.log(error);
			}
		});
	}
}
