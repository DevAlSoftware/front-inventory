import { Component, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { LoginService } from '../../services/login.service';



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
    NgIf,
    CommonModule
  ]
})
export class SidenavComponent implements OnInit {
  mobileQuery: MediaQueryList;
  username: string = '';
  isLoggedIn = false;
  user: any = null;

  menuNav = [
    { name: "Home", route: "home", icon: "home" },
    { name: "Nueva Venta", route: "new-sale", icon: "attach_money" },
    { name: "Categorías", route: "category", icon: "category" },
    { name: "Productos", route: "product", icon: "inventory_2" },
    { name: "Clientes", route: "customer", icon: "group" },
    { name: "Ventas", route: "saleList", icon: "supervisor_account" },
  ];

  constructor(
    private media: MediaMatcher,
    private login: LoginService,
    private router: Router
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }

  ngOnInit(): void {
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.username = this.user?.username || 'Invitado';

    this.login.loginStatusSubjec.asObservable().subscribe(() => {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
      this.username = this.user?.username || 'Invitado';
    });
  }

  logout(): void {
    this.login.logout();
    this.router.navigate(['/login']);
  }
}
