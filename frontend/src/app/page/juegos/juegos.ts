import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { JuegosService } from '../../api/juegos.service';
import { Juego, NivelDificultad, Operador } from '../../models/juego';
import { Progreso } from '../../models/progreso';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-juegos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './juegos.html',
  styleUrls: ['./juegos.css']
})
export class JuegosComponent implements OnInit {

  grupos: { operador: Operador; juegos: (Juego & { progreso?: Progreso })[] }[] = [];
  loading = true;
  error: string | null = null;

  constructor(private router: Router, private juegosService: JuegosService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    const usuario = typeof localStorage !== 'undefined' ? (localStorage.getItem('sessionUser') || localStorage.getItem('usuario') || '') : '';

    const juegos$ = this.juegosService.listar();
    const progresos$ = usuario ? this.juegosService.obtenerProgresos(usuario) : of<Progreso[]>([]);

    forkJoin([juegos$, progresos$]).subscribe({
      next: ([juegos, progresos]) => {

        const ordenados = [...progresos].sort((a, b) => new Date(b.fechaIntento).getTime() - new Date(a.fechaIntento).getTime());
        const mapa = new Map<number, Progreso>();
        for (const p of ordenados) {
          if (!mapa.has(p.juego.idJuego)) mapa.set(p.juego.idJuego, p);
        }
        const conProgreso = juegos.map(j => ({ ...j, progreso: mapa.get(j.idJuego) }));

        this.grupos = this.agruparYOrdenar(conProgreso);

        this.loading = false;
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando juegos:', err);
        this.error = 'No se pudieron cargar los juegos.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private agruparYOrdenar(juegos: (Juego & { progreso?: Progreso })[]): { operador: Operador; juegos: (Juego & { progreso?: Progreso })[] }[] {
    const dificultadOrden = [NivelDificultad.FACIL, NivelDificultad.MEDIO, NivelDificultad.DIFICIL];
    const grupos = new Map<Operador, (Juego & { progreso?: Progreso })[]>();
    for (const j of juegos) {
      const arr = grupos.get(j.operador) || [];
      arr.push(j);
      grupos.set(j.operador, arr);
    }
    const resultado: { operador: Operador; juegos: (Juego & { progreso?: Progreso })[] }[] = [];
    for (const [operador, lista] of grupos.entries()) {
      lista.sort((a, b) => dificultadOrden.indexOf(a.nivelDificultad) - dificultadOrden.indexOf(b.nivelDificultad));
      resultado.push({ operador, juegos: lista });
    }

    const ordenOperador = [Operador.MAYOR, Operador.MENOR, Operador.IGUAL];
    resultado.sort((a, b) => ordenOperador.indexOf(a.operador) - ordenOperador.indexOf(b.operador));
    return resultado;
  }

  jugarJuego(url?: string): void {
    if (!url) return;
    window.open(url, '_blank', 'width=1024,height=768,scrollbars=yes,resizable=yes');
  }

  getOperadorSimbolo(op: Operador): string {
    switch (op) {
      case Operador.MAYOR: return '>';
      case Operador.MENOR: return '<';
      case Operador.IGUAL: return '=';
      default: return String(op);
    }
  }

  volverInicio(): void {
    this.router.navigate(['/inicio']);
  }
}

