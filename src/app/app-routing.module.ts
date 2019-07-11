import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPageComponent } from './componentes/login-page/login-page.component';
import { WelcomePageComponent } from './componentes/welcome-page/welcome-page.component';
import { NotFoundPageComponent } from './componentes/not-found-page/not-found-page.component';

import { HomeComponent } from './componentes/opciones/home/home.component';
import { ForecastComponent } from './componentes/opciones/forecast/forecast.component';
import { GatesComponent } from './componentes/opciones/gates/gates.component';
import { OutstandingComponent } from './componentes/opciones/outstanding/outstanding.component';
import { Rep6040Component } from './componentes/opciones/rep6040/rep6040.component';
import { RetirosComponent } from './componentes/opciones/retiros/retiros.component';
import { TransbordoComponent } from './componentes/opciones/transbordo/transbordo.component';
import { ProyeccionesComponent } from './componentes/opciones/proyecciones/proyecciones.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'welcome/:noUsua', component: WelcomePageComponent, children: [
    { path: 'home', component: HomeComponent },
    { path: 'forecast', component: ForecastComponent },
    { path: 'gates', component: GatesComponent },
    { path: 'outstanding', component: OutstandingComponent },
    { path: 'rep6040', component: Rep6040Component },
    { path: 'retiros', component: RetirosComponent },
    { path: 'transbordo', component: TransbordoComponent },
    { path: 'proyecciones', component: ProyeccionesComponent },
    { path: '', redirectTo: 'home', pathMatch: 'prefix' },
    { path: '**', redirectTo: 'home', pathMatch: 'prefix' }
  ] },
  { path: 'not-found', component: NotFoundPageComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
