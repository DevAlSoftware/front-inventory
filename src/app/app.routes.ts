import { Routes, provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { RouterChildModule } from './modules/dashboard/router-child.module';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
    { path: 'dashboard', loadComponent: () => import('./modules/dashboard/pages/dashborad.component').then(m => m.DashboradComponent) }
];

export const appRoutingProviders = [
    provideRouter(
        routes,
        withHashLocation(), 
        withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }) // ✅ Corrige navegación con rutas internas
    ),
    importProvidersFrom(RouterChildModule)
];
