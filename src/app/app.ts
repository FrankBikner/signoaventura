
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
		CommonModule,
    RouterModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  person: any = {};
  router: any;

	constructor() {}

	public existsLogin() {
		return localStorage.getItem('sessionJwtToken') != undefined
		&& localStorage.getItem('sessionJwtToken') != null
		&& localStorage.getItem('sessionJwtToken') != 'undefined';
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
