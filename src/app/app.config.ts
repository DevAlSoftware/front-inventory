import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideKeycloak } from 'keycloak-angular';
import { routes } from './app.routes';

// Verificación de que estamos en el navegador
const isBrowser = typeof window !== 'undefined';

export const appConfig: ApplicationConfig = {
  providers: [
    // Solo configuramos Keycloak si estamos en el navegador
    ...(isBrowser
      ? [
          provideKeycloak({
            config: {
              url: 'http://localhost:8082/',        // URL de tu servidor Keycloak
              realm: 'inventory',                  // El nombre de tu realm
              clientId: 'angular-client',          // Tu clientId en Keycloak
            },
            initOptions: {
              onLoad: 'login-required',            // Esto hace que se logueen automáticamente
              flow: 'standard',
              silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
            }
          })
        ]
      : []),
    provideZoneChangeDetection(),
    provideRouter(routes) // Aquí se proporcionan las rutas de la aplicación
  ]
};
