import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './componentes/login-page/login-page.component';
import { WelcomePageComponent } from './componentes/welcome-page/welcome-page.component';
import { NotFoundPageComponent } from './componentes/not-found-page/not-found-page.component';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NavBarComponent } from './componentes/nav-bar/nav-bar.component';
import { SideBarComponent } from './componentes/side-bar/side-bar.component';
import { ForecastComponent } from './componentes/opciones/forecast/forecast.component';
import { RetirosComponent } from './componentes/opciones/retiros/retiros.component';
import { Rep6040Component } from './componentes/opciones/rep6040/rep6040.component';
import { GatesComponent } from './componentes/opciones/gates/gates.component';
import { TransbordoComponent } from './componentes/opciones/transbordo/transbordo.component';
import { OutstandingComponent } from './componentes/opciones/outstanding/outstanding.component';
import { HomeComponent } from './componentes/opciones/home/home.component';
import { ProyeccionesComponent } from './componentes/opciones/proyecciones/proyecciones.component';
import { CapitalizadoPipe } from './pipes/capitalizado.pipe';
import { StatusBarComponent } from './componentes/status-bar/status-bar.component';
import { PerfilComponent } from './componentes/opciones/perfil/perfil.component';
import { PasswordComponent } from './componentes/password/password.component';
import { FechaPipe } from './pipes/fecha.pipe';
import { UsuarioComponent } from './componentes/usuario/usuario.component';
import { ImagenUsuarioComponent } from './componentes/imagen-usuario/imagen-usuario.component';
import { CalendarioComponent } from './componentes/opciones/calendario/calendario.component';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { ProyventasComponent } from './componentes/opciones/proyventas/proyventas.component';


import { MaterialModule } from './material.module';
import { BuscarProyventasolDialogComponent } from './componentes/opciones/proyventas/buscar-proyventasol-dialog/buscar-proyventasol-dialog.component';
import { DetproyventasComponent } from './componentes/opciones/proyventas/detproyventas/detproyventas.component';
import { NavesComponent } from './componentes/opciones/maestros/naves/naves.component';
import { DialogListarNavesComponent } from './componentes/opciones/maestros/naves/dialog-listar-naves/dialog-listar-naves.component';
import { DialogRegistrarNavesComponent } from './componentes/opciones/maestros/naves/dialog-registrar-naves/dialog-registrar-naves.component';
import { MayusculaDirective } from './directivas/mayuscula.directive';
import { RegistroNavesComponent } from './componentes/opciones/maestros/naves/registro-naves/registro-naves.component';
import { ProyeccionVentasComponent } from './componentes/proyeccion-ventas/proyeccion-ventas.component';
import { ProyeccionEquiposComponent } from './componentes/proyeccion-equipos/proyeccion-equipos.component';
import { RatioDevolucionComponent } from './componentes/ratio-devolucion/ratio-devolucion.component';
import { FileMtc1r999Component } from './componentes/file-mtc1r999/file-mtc1r999.component';
import { ProyeccionVentaActivaComponent } from './componentes/proyeccion-venta-activa/proyeccion-venta-activa.component';
import { ProyeccionVentaDetalleComponent } from './componentes/proyeccion-venta-detalle/proyeccion-venta-detalle.component';
import { ProyeccionEquiposDetalleComponent } from './componentes/proyeccion-equipos-detalle/proyeccion-equipos-detalle.component';

@NgModule({
  entryComponents: [
    BuscarProyventasolDialogComponent,
    DialogListarNavesComponent,
    DialogRegistrarNavesComponent
  ],
  declarations: [
    AppComponent,
    LoginPageComponent,
    WelcomePageComponent,
    NotFoundPageComponent,
    NavBarComponent,
    SideBarComponent,
    ForecastComponent,
    RetirosComponent,
    Rep6040Component,
    GatesComponent,
    TransbordoComponent,
    OutstandingComponent,
    HomeComponent,
    ProyeccionesComponent,
    CapitalizadoPipe,
    StatusBarComponent,
    PerfilComponent,
    PasswordComponent,
    FechaPipe,
    UsuarioComponent,
    ImagenUsuarioComponent,
    CalendarioComponent,
    ProyventasComponent,
    BuscarProyventasolDialogComponent,
    DetproyventasComponent,
    NavesComponent,
    DialogListarNavesComponent,
    DialogRegistrarNavesComponent,
    MayusculaDirective,
    RegistroNavesComponent,
    ProyeccionVentasComponent,
    ProyeccionEquiposComponent,
    RatioDevolucionComponent,
    FileMtc1r999Component,
    ProyeccionVentaActivaComponent,
    ProyeccionVentaDetalleComponent,
    ProyeccionEquiposDetalleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    CalendarModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
