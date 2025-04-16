import { Component, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  imports: [
    RouterModule, 
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatMenuModule,
    NgFor,
    CommonModule
  ]
})
export class SidenavComponent {
  mobileQuery: MediaQueryList;
  email: string = 'valu@gmail.com';  // Default email in case of an error
  username: string = '';  // We’ll set this when the user profile is loaded

  menuNav = [
    { name: "Home", route: "home", icon: "home" },
    { name: "Nueva Venta", route: "new-sale", icon: "attach_money" },
    { name: "Categorías", route: "category", icon: "category" },
    { name: "Productos", route: "product", icon: "inventory_2" },
    { name: "Clientes", route: "customer", icon: "group" },
    { name: "Ventas", route: "saleList", icon: "supervisor_account" },
  ];

  constructor(
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }

  
}
