import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboradComponent } from './pages/dashborad.component';
import { HomeComponent } from './components/home/home.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../shared/material.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule, DashboradComponent, HomeComponent, RouterModule, MaterialModule
  ]
})
export class DashboardModule { }
