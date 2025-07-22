import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonService } from '../../api/person.service';
import { NotifyComponent } from '../notify/notify';

@Component({
	selector: 'getall',
	standalone: true,
	imports: [
		CommonModule,
		NotifyComponent
	],
	templateUrl: './getall.html',
	styleUrls: ['./getall.css']
})

export class GetAllComponent {
	listPerson: any[] = [];

	typeResponse: string = '';
	listMessageResponse: string[] = [];

	constructor(
		private personService: PersonService
	) {}

	ngOnInit() {
		this.personService.getAll().subscribe({
			next: (response: any) => {
				this.listPerson = response.dto.listPerson;
			},
			error: (error: any) => {
				console.log(error);
			}
		});
	}

	delete(idPerson: string): void {
		this.personService.delete(idPerson).subscribe({
			next: (response: any) => {
				this.typeResponse = response.mo.type;
				this.listMessageResponse = response.mo.listMessage;

				switch(response.mo.type) {
					case 'success':
						this.listPerson = this.listPerson.filter(x => x.idPerson != idPerson);

						break;
				}
			},
			error: (error: any) => {
				console.log(error);
			}
		});
	}
}