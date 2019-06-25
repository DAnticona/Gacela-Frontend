import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './componentes/login-page/login-page.component';
import { WelcomePageComponent } from './componentes/welcome-page/welcome-page.component';
import { NotFoundPageComponent } from './componentes/not-found-page/not-found-page.component';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NavBarComponent } from './componentes/nav-bar/nav-bar.component';
import { SideBarComponent } from './componentes/side-bar/side-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    WelcomePageComponent,
    NotFoundPageComponent,
    NavBarComponent,
    SideBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }