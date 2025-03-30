import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
  ],
  exports: [SidenavComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,    
    SidenavComponent,
    HttpClientModule
  ]
})
export class SharedModule { }
