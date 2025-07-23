import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { PersonService } from '../../api/person.service'; // ← 🔒 Descomenta cuando tu backend esté listo

@Component({
  selector: 'getall',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './getall.html',
  styleUrls: ['./getall.css']
})
export class GetAllComponent implements OnInit {
  listPerson: any[] = [];

  // constructor(private personService: PersonService) {} ← 🔒 Habilitar cuando conectes al backend

  constructor() {}

  ngOnInit(): void {
    // 🔴 Esta parte está usando datos simulados
    this.listPerson = [
      { dni: '12345678', nombre: 'Ana', apellido: 'Pérez' },
      { dni: '87654321', nombre: 'Luis', apellido: 'García' },
    ];

    /*
    // ✅ Descomenta esto cuando tengas backend
    this.personService.getAll().subscribe({
      next: (response: any) => {
        this.listPerson = response.dto.listPerson;
      },
      error: (err: any) => {
        console.error(err);
      }
    });
    */
  }
}
