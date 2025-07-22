import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class PersonService {
	constructor(
		private httpClient: HttpClient
	) {}

	public getData(): Observable<any> {
		return this.httpClient.get(`http://localhost:8080/person/getdata`);
	}

	public login(formData: FormData): Observable<any> {
		return this.httpClient.post(`http://localhost:8080/person/login`, formData);
	}

	public insert(formData: FormData): Observable<any> {
		return this.httpClient.post(`http://localhost:8080/person/insert`, formData);
	}

	public getAll(): Observable<any> {
		return this.httpClient.get(`http://localhost:8080/person/getall`);
	}

	public delete(idPerson: string): Observable<any> {
		return this.httpClient.delete(`http://localhost:8080/person/delete/${idPerson}`);
	}
}