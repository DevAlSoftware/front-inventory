import { Routes, provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { RouterChildModule } from './modules/dashboard/router-child.module';
import { authGuard } from './modules/models/auth.guard';

// app-routing.module.ts
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    loadComponent: () => import('./modules/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./modules/dashboard/pages/dashborad.component').then(m => m.DashboradComponent),
    children: [
      { path: 'home', loadComponent: () => import('./modules/dashboard/components/home/home.component').then(m => m.HomeComponent) },
      { path: 'category', loadComponent: () => import('./modules/category/components/category/category.component').then(m => m.CategoryComponent) },
      { path: 'product', loadComponent: () => import('./modules/product/product/product.component').then(m => m.ProductComponent) },
      { path: 'productSize', loadComponent: () => import('./modules/productSize/product-size/product-size.component').then(m => m.ProductSizeComponent) },
      { path: 'customer', loadComponent: () => import('./modules/customer/components/customer/customer.component').then(m => m.CustomerComponent) },
      { path: 'sale-form', loadComponent: () => import('./modules/sale/sale-form/sale-form.component').then(m => m.SaleFormComponent) },
      { path: 'new-sale', loadComponent: () => import('./modules/sale/new-sale/new-sale.component').then(m => m.NewSaleComponent) },
      { path: 'saleList', loadComponent: () => import('./modules/sale/sale-list/sale-list.component').then(m => m.SaleListComponent) }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
  

export const appRoutingProviders = [
    provideRouter(
        routes,
        withHashLocation(), 
        withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }) 
    ),
    importProvidersFrom(RouterChildModule)
];