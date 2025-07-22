import { Routes } from '@angular/router';

import { GetAllComponent } from './page/getall/getall';
import { LoginComponent } from './page/login/login';
import { InicioComponent } from './page/inicio/inicio';
import { InsertComponent } from './page/insert/insert';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{ path: 'inicio', component: InicioComponent},
	{ path: 'insert', component: InsertComponent},
	{ path: 'getall', component: GetAllComponent}	
];
