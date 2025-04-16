import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from '../../shared/components/sidenav/sidenav.component';


@Component({
  selector: 'app-dashborad',
  standalone: true,
  imports: [RouterModule,
    SidenavComponent 
  ],
  templateUrl: './dashborad.component.html',
  styleUrl: './dashborad.component.css'
})
export class DashboradComponent {

  

}
