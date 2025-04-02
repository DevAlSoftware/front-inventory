import { Routes, provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { RouterChildModule } from './modules/dashboard/router-child.module';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/dashboard/home' },
    { 
        path: 'dashboard', 
        loadComponent: () => import('./modules/dashboard/pages/dashborad.component').then(m => m.DashboradComponent),
        children: [ 
            { path: 'home', loadComponent: () => import('./modules/dashboard/components/home/home.component').then(m => m.HomeComponent) },
            { path: 'category', loadComponent: () => import('./modules/category/components/category/category.component').then(m => m.CategoryComponent) },
            { path: 'product', loadComponent: () => import('./modules/product/product/product.component').then(m => m.ProductComponent) },
            { path: 'customer', loadComponent: () => import('./modules/customer/components/customer/customer.component').then(m => m.CustomerComponent) }
        ]
    }
];

export const appRoutingProviders = [
    provideRouter(
        routes,
        withHashLocation(), 
        withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }) // ✅ Corrige navegación con rutas internas
    ),
    importProvidersFrom(RouterChildModule)
];
