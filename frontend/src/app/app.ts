import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InicioComponent } from "./page/inicio/inicio";
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  person: any = {};
  

	constructor(private router: Router) {}

	public existsLogin() {
		return localStorage.getItem('sessionJwtToken') != undefined
		&& localStorage.getItem('sessionJwtToken') != null
		&& localStorage.getItem('sessionJwtToken') != 'undefined';
	}

  navigate(ruta: string): void {
    this.router.navigate([ruta]);
  }
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
