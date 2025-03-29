import { Component } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  imports: [
    RouterModule, // 👈 Importa RouterModule para que <router-outlet> funcione
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatMenuModule,
    NgFor
  ]
})
export class SidenavComponent {
  mobileQuery: MediaQueryList;
  email: string = 'valu@gmail.com';

  menuNav = [
    { name: "Home", route: "/home", icon: "home" },
    { name: "Categorías", route: "/categorias", icon: "category" },
    { name: "Productos", route: "/productos", icon: "inventory_2" }, 
    { name: "Ventas", route: "home", icon: "point_of_sale" },
    { name: "Maestros", route: "home", icon: "supervisor_account" } 
];

  constructor(media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }
}

