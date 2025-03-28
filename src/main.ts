import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router'; // Agregado
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes'; // Importa tus rutas

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(routes, withComponentInputBinding()) // 🔥 Agregamos el router
  ],
}).catch(err => console.error(err));
