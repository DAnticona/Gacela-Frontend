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
import { PerfilComponent } from './componentes/opciones/perfil/perfil.component';
import { PasswordComponent } from './componentes/password/password.component';
import { UsuarioComponent } from './componentes/usuario/usuario.component';
import { CalendarioComponent } from './componentes/opciones/calendario/calendario.component';
import { ProyventasComponent } from './componentes/opciones/proyventas/proyventas.component';
import { DetproyventasComponent } from './componentes/opciones/proyventas/detproyventas/detproyventas.component';
import { NavesComponent } from './componentes/opciones/maestros/naves/naves.component';
import { RegistroNavesComponent } from './componentes/opciones/maestros/naves/registro-naves/registro-naves.component';
import { ProyeccionEquiposComponent } from './componentes/proyeccion-equipos/proyeccion-equipos.component';
import { ProyeccionVentasComponent } from './componentes/proyeccion-ventas/proyeccion-ventas.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'welcome', component: WelcomePageComponent, children: [
    { path: 'home/:noUsua', component: HomeComponent },
    { path: 'perfil/:noUsua', component: PerfilComponent },
    { path: 'usuario/:noUsua', component: UsuarioComponent },
    { path: 'password/:noUsua', component: PasswordComponent },
    { path: 'forecast/:noUsua', component: ForecastComponent },
    { path: 'gates/:noUsua', component: GatesComponent },
    { path: 'outstanding/:noUsua', component: OutstandingComponent },
    { path: 'rep6040/:noUsua', component: Rep6040Component },
    { path: 'retiros/:noUsua', component: RetirosComponent },
    { path: 'transbordo/:noUsua', component: TransbordoComponent },
    // { path: 'proyecciones/:noUsua', component: ProyeccionesComponent },
    { path: 'proyecciones/equipos/:noUsua', component: ProyeccionEquiposComponent },
    // { path: 'proyecciones/ventas/:noUsua', component: ProyeccionVentasComponent },
    { path: 'calendario/:noUsua', component: CalendarioComponent },
    // { path: 'proyventas/:noUsua', component: ProyventasComponent },
    { path: 'proyventas/:noUsua', component: ProyventasComponent },
    { path: 'proyventas/:noUsua/:coProy', component: DetproyventasComponent },
    { path: 'naves/:noUsua', component: NavesComponent },
    { path: 'naves/:noUsua/:coNave', component: RegistroNavesComponent },
    { path: '', redirectTo: 'home/:noUsua', pathMatch: 'prefix' },
    { path: '**', redirectTo: 'home/:noUsua', pathMatch: 'prefix' }
  ] },
  { path: 'not-found', component: NotFoundPageComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true, onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
