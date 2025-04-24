import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';
import { ProductSizeService } from '../../shared/services/productSize.service'; // Nuevo servicio para product sizes
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '../../shared/services/notification.service';
import { ProductService } from '../../shared/services/product.service';

export interface Product {
  id: number;
  name: string;
  price: number;
  account: number;
  code: string;
  ubication: string;
  category: any;
  picture: any;
}

@Component({
  selector: 'app-new-product-size',
  templateUrl: './new-product-size.component.html',
  styleUrls: ['./new-product-size.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule]
})
export class NewProductSizeComponent implements OnInit {
  
  private fb = inject(FormBuilder);
  private productSizeService = inject(ProductSizeService); // Usamos el servicio para product sizes
  private productService = inject(ProductService); // Usamos el servicio para product sizes
  private dialogRef = inject(MatDialogRef<NewProductSizeComponent>);
  public data = inject(MAT_DIALOG_DATA);
  private notificationService = inject(NotificationService);

  public productSizeForm!: FormGroup;
  estadoFormulario: string = '';
  products: Product[] = []; // Lista de productos
  productss = [];
  subtotal: number = 0;

  ngOnInit(): void {
    this.getProducts(); // Obtener los productos
    this.estadoFormulario = this.data ? 'Actualizar' : 'Agregar';
    this.initForm();
  }

  private initForm() {
    this.productSizeForm = this.fb.group({
      size: ['', Validators.required],
      account: ['', Validators.required],
      product: ['', Validators.required] // Campo de producto asociado
    });

    if (this.data) {
      this.updateForm(this.data);
    }
  }

  onSave() {
    const productSizeData = new FormData();
    productSizeData.append('size', this.productSizeForm.get('size')?.value);
    productSizeData.append('account', this.productSizeForm.get('account')?.value);
    productSizeData.append('productId', this.productSizeForm.get('product')?.value);
      
    const request = this.data
      ? this.productSizeService.updateProductSize(productSizeData, this.data.id)
      : this.productSizeService.saveProductSize(productSizeData);
  
    request.subscribe(
      () => {
        const productSizeName = this.productSizeForm.get('size')?.value;
        this.notificationService.sendNotification(
        this.data
          ? ` Talla "${productSizeName}" actualizado con éxito`
          : ` Talla "${productSizeName}" creado con éxito`
        );
       
        this.dialogRef.close(1);
      },
      () => {
        this.notificationService.sendNotification(' Error al guardar la talla');
        this.dialogRef.close(2);
      }
    );
}
  onCancel() {
    this.dialogRef.close(3);
  }

  calculateSubtotal() {
    const productId = this.productSizeForm.get('product')?.value;
    const quantity = this.productSizeForm.get('account')?.value;
    const selectedProduct = this.products.find(product => product.id === productId);
    
    if (selectedProduct && quantity) {
      this.subtotal = selectedProduct.price * quantity;
    } else {
      this.subtotal = 0;
    }
  }

  getProducts() {
    this.productSizeService.getProducts().subscribe((res: any) => {
      this.products = res.product.products;
    });
  }

  private updateForm(data: any) {
    this.productSizeForm.patchValue({
      size: data.size,
      account: data.account,
      product: data.product.id // Relacionamos con el producto correspondiente
    });
  }
}
