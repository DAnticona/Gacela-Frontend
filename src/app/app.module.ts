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

@NgModule({
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
    ImagenUsuarioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
