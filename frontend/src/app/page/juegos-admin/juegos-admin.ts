import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { JuegosService } from '../../api/juegos.service';
import { Juego, NivelDificultad, Operador, RequestJuegoDto } from '../../models/juego';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-juegos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './juegos-admin.html',
  styleUrls: ['./juegos-admin.css']
})
export class JuegosAdminComponent implements OnInit {

  juegos$!: Observable<Juego[]>;
  form: FormGroup;
  editId: number | null = null;
  dificultades = Object.values(NivelDificultad);
  operadores = Object.values(Operador);

  constructor(private fb: FormBuilder, private juegosService: JuegosService) {
    this.form = this.fb.group({
      nombreJuego: ['', Validators.required],
      descripcion: ['', Validators.required],
      operador: [Operador.MAYOR, Validators.required],
      nivelDificultad: [NivelDificultad.FACIL, Validators.required],
      activo: [true],
      urlImagen: [''],
      urlJuego: ['']
    });
  }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.juegos$ = this.juegosService.listar();
  }

  editar(juego: Juego): void {
    this.editId = juego.idJuego;
    this.form.patchValue({
      nombreJuego: juego.nombreJuego,
      descripcion: juego.descripcion,
      operador: juego.operador,
      nivelDificultad: juego.nivelDificultad,
      activo: juego.activo,
      urlImagen: juego.urlImagen || '',
      urlJuego: juego.urlJuego || ''
    });
  }

  limpiar(): void {
    this.editId = null;
    this.form.reset({
      nombreJuego: '',
      descripcion: '',
      operador: Operador.MAYOR,
      nivelDificultad: NivelDificultad.FACIL,
      activo: true,
      urlImagen: '',
      urlJuego: ''
    });
  }

  guardar(): void {
    if (this.form.invalid) return;
    const dto: RequestJuegoDto = this.form.value;
    if (this.editId == null) {
      this.juegosService.crear(dto).subscribe(() => { this.cargar(); this.limpiar(); });
    } else {
      this.juegosService.actualizar(this.editId, dto).subscribe(() => { this.cargar(); this.limpiar(); });
    }
  }

  eliminar(idJuego: number): void {
    this.juegosService.eliminar(idJuego).subscribe(() => this.cargar());
  }

  getOperadorSimbolo(op: Operador): string {
    switch (op) {
      case Operador.MAYOR:
        return '>';
      case Operador.MENOR:
        return '<';
      case Operador.IGUAL:
        return '=';
      default:
        return String(op);
    }
  }
}


