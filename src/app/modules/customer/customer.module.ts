import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryComponent } from '../category/components/category/category.component';
import { NewCategoryComponent } from '../category/components/new-category/new-category.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule, 
    CategoryComponent, 
    NewCategoryComponent
  ]
})
export class CustomerModule { }
