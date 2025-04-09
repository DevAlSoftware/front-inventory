import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashborad',
  standalone: true, // 👈 Esto es lo que te faltaba
  imports: [RouterModule], // ✅ Para usar <router-outlet>
  templateUrl: './dashborad.component.html',
  styleUrls: ['./dashborad.component.css'] // 👈 También corregido
})
export class DashboradComponent { }
