import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router'; // Agregado
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes'; // Importa tus rutas
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(routes, withComponentInputBinding()), // 🔥 Agregamos el router
    importProvidersFrom(HttpClientModule) 
  ],
}).catch(err => console.error(err));
