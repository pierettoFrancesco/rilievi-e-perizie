import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { VerticalNavbarComponent } from './home/vertical-navbar/vertical-navbar.component';
import { MainComponent } from './home/main/main.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { EditPeriziaComponent } from './home/edit-perizia/edit-perizia.component';
import { GalleryComponent } from './home/gallery/gallery.component';
import { UsersComponent } from './home/users/users.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    VerticalNavbarComponent,
    MainComponent,
    EditPeriziaComponent,
    GalleryComponent,
    UsersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    GoogleMapsModule,
    MatIconModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
