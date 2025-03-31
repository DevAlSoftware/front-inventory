import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NewProductComponent } from "./new-product/new-product.component";
import { ProductComponent } from "./product/product.component";
import { MaterialModule } from "../shared/material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

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
export class ProductModule {}
