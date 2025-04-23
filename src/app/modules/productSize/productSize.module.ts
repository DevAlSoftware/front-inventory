import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductComponent } from '../product/product/product.component';
import { NewProductComponent } from '../product/new-product/new-product.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ProductComponent,
    NewProductComponent
  ]
})
export class ProductSizeModule {}
