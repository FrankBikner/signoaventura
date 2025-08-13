import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-juegos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './juegos.html',
  styleUrls: ['./juegos.css']
})
export class JuegosComponent implements OnInit {
  
  juegos = [
    {
      id: 1,
      titulo: 'Carrera Mayor Que',
      descripcion: 'Aprende el concepto de "mayor que" con una divertida carrera de autos.',
      imagen: '/games/juego1/assets/images/car_blue.png',
      url: '/games/juego1/index.html',
      concepto: 'Mayor que (>)'
    },
    {
      id: 2,
      titulo: 'Globos Menor Que',
      descripcion: 'Identifica grupos con menos elementos usando globos coloridos.',
      imagen: '/games/juego2/assets/images/balloon_blue.png',
      url: '/games/juego2/index.html',
      concepto: 'Menor que (<)'
    },
    {
      id: 3,
      titulo: 'Manzanas Iguales',
      descripcion: 'Recolecta la cantidad exacta de manzanas para aprender igualdad.',
      imagen: '/games/juego3/assets/images/apple.png',
      url: '/games/juego3/index_mejorado.html',
      concepto: 'Igual que (=)'
    }, 
    {
      id: 4,
      titulo: 'Cohete mayor que',
      descripcion: 'formas cifras y despliqga el cohete.',
      imagen: '/games/juego4/assets/images/cohete.png',
      url: '/games/juego4/index.html',
      concepto: 'Comparación de números'
    }

  ]; 

  constructor(private router: Router) {}

  ngOnInit(): void {}

  jugarJuego(url: string): void {
    window.open(url, '_blank', 'width=1024,height=768,scrollbars=yes,resizable=yes');
  }

  volverInicio(): void {
    this.router.navigate(['/inicio']);
  }
}

