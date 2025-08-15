import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReportesService } from '../../api/reportes.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-tr from-blue-800 via-gray-900 to-blue-700 text-white">
      <!-- Sidebar -->
      <aside class="w-64 p-6 bg-gray-900 flex flex-col justify-between fixed h-full">
        <div>
          <h3 class="text-2xl font-bold mb-2">Signo Aventura</h3>
          <p class="text-sm text-gray-400 mb-6">Módulo de Reportes</p>

          <nav>
            <ul class="space-y-2">
              <li><button (click)="navigate('/inicio')" class="w-full text-left px-4 py-2 rounded hover:bg-blue-700">🏠 Home</button></li>
              <li><button (click)="navigate('/insert')" class="w-full text-left px-4 py-2 rounded hover:bg-blue-700">➕ Agregar Estudiantes</button></li>
              <li><button (click)="navigate('/getall')" class="w-full text-left px-4 py-2 rounded hover:bg-blue-700">📋 Listar Estudiantes</button></li>
              <li><button (click)="navigate('/reportes')" class="w-full text-left px-4 py-2 rounded bg-blue-700">📊 Reportes</button></li>
              <li><button (click)="navigate('/juegos')" class="w-full text-left px-4 py-2 rounded hover:bg-blue-700">🎮 Juegos</button></li>
              <li><button (click)="navigate('/juegos-admin')" class="w-full text-left px-4 py-2 rounded hover:bg-blue-700">🛠️ Administrar Juegos</button></li>
            </ul>
          </nav>
        </div>

        <button class="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white" (click)="logout()">🚪 Log Out</button>
      </aside>

      <!-- Main Content -->
      <main class="ml-64 p-8">
        <div class="space-y-8">
          <!-- Header -->
          <div class="text-center">
            <h1 class="text-4xl font-bold mb-4">📊 Módulo de Reportes</h1>
            <p class="text-xl text-gray-300">Genera y descarga reportes en formato PDF</p>
          </div>

          <!-- Report Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <!-- Reporte General -->
            <div class="bg-white rounded-lg shadow-lg p-6 text-gray-800 hover:shadow-xl transition-shadow duration-300">
              <div class="text-center mb-4">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span class="text-3xl">📈</span>
                </div>
                <h3 class="text-xl font-bold text-gray-800">Reporte General</h3>
                <p class="text-gray-600 text-sm mt-2">Estadísticas generales del sistema</p>
              </div>
              <ul class="text-sm text-gray-600 mb-4 space-y-1">
                <li>• Total de estudiantes</li>
                <li>• Total de juegos</li>
                <li>• Progresos registrados</li>
                <li>• Promedios del sistema</li>
              </ul>
              <button 
                (click)="descargarPDFGeneral()" 
                [disabled]="descargandoGeneral"
                class="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200">
                <span *ngIf="!descargandoGeneral">📥 Descargar PDF</span>
                <span *ngIf="descargandoGeneral">⏳ Generando...</span>
              </button>
            </div>

            <!-- Reporte de Estudiantes -->
            <div class="bg-white rounded-lg shadow-lg p-6 text-gray-800 hover:shadow-xl transition-shadow duration-300">
              <div class="text-center mb-4">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span class="text-3xl">👥</span>
                </div>
                <h3 class="text-xl font-bold text-gray-800">Reporte de Estudiantes</h3>
                <p class="text-gray-600 text-sm mt-2">Rendimiento de todos los estudiantes</p>
              </div>
              <ul class="text-sm text-gray-600 mb-4 space-y-1">
                <li>• Puntuaciones totales</li>
                <li>• Tiempo jugado</li>
                <li>• Juegos completados</li>
                <li>• Promedios por estudiante</li>
              </ul>
              <button 
                (click)="descargarPDFEstudiantes()" 
                [disabled]="descargandoEstudiantes"
                class="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200">
                <span *ngIf="!descargandoEstudiantes">📥 Descargar PDF</span>
                <span *ngIf="descargandoEstudiantes">⏳ Generando...</span>
              </button>
            </div>

            <!-- Reporte de Juegos -->
            <div class="bg-white rounded-lg shadow-lg p-6 text-gray-800 hover:shadow-xl transition-shadow duration-300">
              <div class="text-center mb-4">
                <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span class="text-3xl">🎮</span>
                </div>
                <h3 class="text-xl font-bold text-gray-800">Reporte de Juegos</h3>
                <p class="text-gray-600 text-sm mt-2">Estadísticas de todos los juegos</p>
              </div>
              <ul class="text-sm text-gray-600 mb-4 space-y-1">
                <li>• Jugadores por juego</li>
                <li>• Puntuaciones promedio</li>
                <li>• Tiempos promedio</li>
                <li>• Estado de los juegos</li>
              </ul>
              <button 
                (click)="descargarPDFJuegos()" 
                [disabled]="descargandoJuegos"
                class="w-full bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200">
                <span *ngIf="!descargandoJuegos">📥 Descargar PDF</span>
                <span *ngIf="descargandoJuegos">⏳ Generando...</span>
              </button>
            </div>

            <!-- Reporte por Operador -->
            <div class="bg-white rounded-lg shadow-lg p-6 text-gray-800 hover:shadow-xl transition-shadow duration-300">
              <div class="text-center mb-4">
                <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span class="text-3xl">🔢</span>
                </div>
                <h3 class="text-xl font-bold text-gray-800">Reporte por Operador</h3>
                <p class="text-gray-600 text-sm mt-2">Jugadores por tipo de operador</p>
              </div>
              <ul class="text-sm text-gray-600 mb-4 space-y-1">
                <li>• Juegos por operador</li>
                <li>• Jugadores específicos</li>
                <li>• Puntuaciones individuales</li>
                <li>• Tiempos de juego</li>
              </ul>
              <button 
                (click)="descargarPDFOperadores()" 
                [disabled]="descargandoOperadores"
                class="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200">
                <span *ngIf="!descargandoOperadores">📥 Descargar PDF</span>
                <span *ngIf="descargandoOperadores">⏳ Generando...</span>
              </button>
            </div>

            <!-- Top Estudiantes -->
            <div class="bg-white rounded-lg shadow-lg p-6 text-gray-800 hover:shadow-xl transition-shadow duration-300">
              <div class="text-center mb-4">
                <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span class="text-3xl">🏆</span>
                </div>
                <h3 class="text-xl font-bold text-gray-800">Top Estudiantes</h3>
                <p class="text-gray-600 text-sm mt-2">Los mejores 10 estudiantes</p>
              </div>
              <ul class="text-sm text-gray-600 mb-4 space-y-1">
                <li>• Ranking por puntuación</li>
                <li>• Tiempo total jugado</li>
                <li>• Cantidad de juegos</li>
                <li>• Rendimiento destacado</li>
              </ul>
              <button 
                (click)="descargarPDFTopEstudiantes()" 
                [disabled]="descargandoTop"
                class="w-full bg-yellow-500 text-white py-3 px-4 rounded-lg hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200">
                <span *ngIf="!descargandoTop">📥 Descargar PDF</span>
                <span *ngIf="descargandoTop">⏳ Generando...</span>
              </button>
            </div>

            <!-- Reporte Detallado -->
            <div class="bg-white rounded-lg shadow-lg p-6 text-gray-800 hover:shadow-xl transition-shadow duration-300">
              <div class="text-center mb-4">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span class="text-3xl">📋</span>
                </div>
                <h3 class="text-xl font-bold text-gray-800">Reporte Detallado</h3>
                <p class="text-gray-600 text-sm mt-2">Información completa del sistema</p>
              </div>
              <ul class="text-sm text-gray-600 mb-4 space-y-1">
                <li>• Todos los datos combinados</li>
                <li>• Análisis completo</li>
                <li>• Estadísticas detalladas</li>
                <li>• Información para análisis</li>
              </ul>
              <button 
                (click)="descargarPDFDetallado()" 
                [disabled]="descargandoDetallado"
                class="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200">
                <span *ngIf="!descargandoDetallado">📥 Descargar PDF</span>
                <span *ngIf="descargandoDetallado">⏳ Generando...</span>
              </button>
            </div>

          </div>

          <!-- Info Section -->
          <div class="bg-white rounded-lg shadow-lg p-6 text-gray-800 mt-8">
            <h3 class="text-xl font-bold mb-4 text-center">ℹ️ Información sobre los Reportes</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-semibold text-blue-600 mb-2">📊 Tipos de Reportes:</h4>
                <ul class="text-sm space-y-1">
                  <li>• <strong>General:</strong> Estadísticas globales del sistema</li>
                  <li>• <strong>Estudiantes:</strong> Rendimiento individual de cada estudiante</li>
                  <li>• <strong>Juegos:</strong> Análisis de cada juego y sus jugadores</li>
                  <li>• <strong>Operadores:</strong> Reportes filtrados por tipo de operador matemático</li>
                  <li>• <strong>Top:</strong> Los mejores estudiantes del sistema</li>
                  <li>• <strong>Detallado:</strong> Información completa y combinada</li>
                </ul>
              </div>
              <div>
                <h4 class="font-semibold text-green-600 mb-2">📥 Descarga de PDFs:</h4>
                <ul class="text-sm space-y-1">
                  <li>• Los reportes se generan automáticamente</li>
                  <li>• Formato profesional con tablas organizadas</li>
                  <li>• Compatible con todos los lectores de PDF</li>
                  <li>• Descarga directa al dispositivo</li>
                  <li>• Nombres descriptivos para fácil identificación</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  `,
  styles: []
})
export class ReportesComponent {
  descargandoGeneral = false;
  descargandoEstudiantes = false;
  descargandoJuegos = false;
  descargandoOperadores = false;
  descargandoTop = false;
  descargandoDetallado = false;

  constructor(
    private reportesService: ReportesService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  navigate(ruta: string): void {
    this.router.navigate([ruta]);
  }

  logout(): void {
    localStorage.clear();
    this.navigate('/login');
  }

  descargarPDFGeneral(): void {
    this.descargandoGeneral = true;
    this.cdr.detectChanges();
    
    this.reportesService.descargarPDFGeneral().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte_general_sistema.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        this.descargandoGeneral = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al descargar reporte general:', error);
        alert('Error al generar el reporte. Intente nuevamente.');
        this.descargandoGeneral = false;
        this.cdr.detectChanges();
      }
    });
  }

  descargarPDFEstudiantes(): void {
    this.descargandoEstudiantes = true;
    this.cdr.detectChanges();
    
    this.reportesService.descargarPDFEstudiantes().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte_estudiantes.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        this.descargandoEstudiantes = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al descargar reporte estudiantes:', error);
        alert('Error al generar el reporte. Intente nuevamente.');
        this.descargandoEstudiantes = false;
        this.cdr.detectChanges();
      }
    });
  }

  descargarPDFJuegos(): void {
    this.descargandoJuegos = true;
    this.cdr.detectChanges();
    
    this.reportesService.descargarPDFJuegos().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte_juegos.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        this.descargandoJuegos = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al descargar reporte juegos:', error);
        alert('Error al generar el reporte. Intente nuevamente.');
        this.descargandoJuegos = false;
        this.cdr.detectChanges();
      }
    });
  }

  descargarPDFOperadores(): void {
    this.descargandoOperadores = true;
    this.cdr.detectChanges();
    
    // Por ahora usamos el reporte de juegos como base para operadores
    this.reportesService.descargarPDFJuegos().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte_por_operadores.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        this.descargandoOperadores = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al descargar reporte operadores:', error);
        alert('Error al generar el reporte. Intente nuevamente.');
        this.descargandoOperadores = false;
        this.cdr.detectChanges();
      }
    });
  }

  descargarPDFTopEstudiantes(): void {
    this.descargandoTop = true;
    this.cdr.detectChanges();
    
    // Por ahora usamos el reporte de estudiantes como base para top
    this.reportesService.descargarPDFEstudiantes().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'top_estudiantes.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        this.descargandoTop = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al descargar top estudiantes:', error);
        alert('Error al generar el reporte. Intente nuevamente.');
        this.descargandoTop = false;
        this.cdr.detectChanges();
      }
    });
  }

  descargarPDFDetallado(): void {
    this.descargandoDetallado = true;
    this.cdr.detectChanges();
    
    this.reportesService.descargarPDFDetallado().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte_detallado_completo.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        this.descargandoDetallado = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al descargar reporte detallado:', error);
        alert('Error al generar el reporte. Intente nuevamente.');
        this.descargandoDetallado = false;
        this.cdr.detectChanges();
      }
    });
  }
}
