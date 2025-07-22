import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  imports: [
    CommonModule
  ],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class InicioComponent {
  docenteNombre = 'User';

  totalAlumnos = 30;
  registrados = 20;
  evaluados = 19;
  finalizados = 8;

  alumnos = [
    { nombre: 'Alumno 1', progreso: '06/27', estado: 'Activo', nota: 'Alumno frecuente.', comparacion: 'Mayor que', dificultad: 'Difícil' },
    { nombre: 'Alumno 2', progreso: '04/27', estado: 'Activo', nota: 'Alumno frecuente con ciertas variaciones en clase.', comparacion: 'Menor que', dificultad: 'Difícil' },
    { nombre: 'Alumno 3', progreso: '03/27', estado: 'Activo', nota: '', comparacion: 'Igual que', dificultad: 'Difícil' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const nombre = localStorage.getItem('sessionFirstName');
      if (nombre) {
        this.docenteNombre = nombre;
      }
    }
  }

  logout(): void {
    localStorage.clear(); // O puedes remover solo las claves necesarias
    this.router.navigate(['/person/login']);
  }
}
