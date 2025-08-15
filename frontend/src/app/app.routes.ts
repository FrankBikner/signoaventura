import { Routes } from '@angular/router';

import { GetAllComponent } from './page/getall/getall';
import { LoginComponent } from './page/login/login';
import { InicioComponent } from './page/inicio/inicio';
import { InsertComponent } from './page/insert/insert';
import { EditarEstudianteComponent } from './page/editar-estudiante/editar-estudiante';
import { JuegosComponent } from './page/juegos/juegos';
import { JuegosAdminComponent } from './page/juegos-admin/juegos-admin';
import { RegistroUsuario } from './page/registro-usuario/registro-usuario';
import { ReportesComponent } from './page/reportes/reportes';



export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{ path: 'inicio', component: InicioComponent},
	{ path: 'insert', component: InsertComponent},
	{ path: 'getall', component: GetAllComponent},	
	{ path: 'app-editar-estudiante/:usuario', component: EditarEstudianteComponent },
	{ path: 'juegos', component: JuegosComponent }, 
	{ path: 'juegos-admin', component: JuegosAdminComponent }, 
	{ path: 'registro', component: RegistroUsuario }, 
	{ path: 'reportes', component: ReportesComponent }, 
];
