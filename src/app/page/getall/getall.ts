import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PersonService } from '../../api/person.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-estudiantes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './getall.html',
  styleUrls: ['./getall.css']
})
export class GetAllComponent implements OnInit {
  estudiantes: any[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  searchTerm: string = '';
  filteredEstudiantes: any[] = [];

  constructor(
    private personService: PersonService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // 🔧 ESTA es la función que te faltaba:
  navigate(ruta: string): void {
    this.router.navigate([ruta]);
  }

  cargarEstudiantes(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.personService.getAll().subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.estudiantes = response;
          this.filteredEstudiantes = [...response];
        } else if (response && response.data) {
          this.estudiantes = response.data;
          this.filteredEstudiantes = [...response.data];
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener estudiantes:', error);
        this.errorMessage = 'Error al cargar la lista de estudiantes';
        this.loading = false;
      }
    });
  }

  cambiarEstado(usuario: string, nuevoEstado: boolean): void {
    const accion = nuevoEstado ? 'habilitar' : 'inhabilitar';
    if (confirm(`¿Está seguro que desea ${accion} este estudiante?`)) {
      this.personService.cambiarEstado(usuario, nuevoEstado).subscribe({
        next: () => {
          // Actualizar el estado localmente sin recargar
          const estudiante = this.estudiantes.find(e => e.usuario === usuario);
          if (estudiante) {
            estudiante.activo = nuevoEstado;
          }
          this.filteredEstudiantes = [...this.estudiantes];
        },
        error: (error) => {
          console.log(error)
          console.error(`Error al ${accion} estudiante:`, error);
          alert(`No se pudo ${accion} el estudiante`);
        }
      });
    }
  }

  filtrarEstudiantes(): void {
    if (!this.searchTerm) {
      this.filteredEstudiantes = [...this.estudiantes];
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredEstudiantes = this.estudiantes.filter(est =>
      (est.nombre?.toLowerCase().includes(term)) ||
      (est.apellido?.toLowerCase().includes(term)) ||
      (est.email?.toLowerCase().includes(term)) ||
      (est.usuario?.toLowerCase().includes(term))
    );
  }
}