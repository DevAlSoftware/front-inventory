import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';
import { CategoryService } from '../../shared/services/category.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../shared/services/product.service';
import { NotificationService } from '../../shared/services/notification.service';

export interface Category {
  description: string;
  id: number;
  name: string;
}

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule]
})
export class NewProductComponent implements OnInit {
  
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private dialogRef = inject(MatDialogRef<NewProductComponent>);
  public data = inject(MAT_DIALOG_DATA);
  private productService = inject(ProductService);
  private notificationService = inject(NotificationService);

  public productForm!: FormGroup;
  estadoFormulario: string = '';
  categories: Category[] = [];
  selectedFile: File | null = null;
  nameImg: string = '';

  ngOnInit(): void {
    this.getCategories();
    this.estadoFormulario = this.data ? 'Actualizar' : 'Agregar';
    this.initForm();
  }

  private initForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      account: ['', Validators.required],
      code: ['', Validators.required],
      ubication: ['', Validators.required],
      category: ['', Validators.required],
      picture: ['', Validators.required]
    });

    if (this.data) {
      this.updateForm(this.data);
    }
  }

  onSave() {
    if (!this.selectedFile) {
      console.error('No file selected');
      return;
    }

    const uploadImageData = new FormData();
    uploadImageData.append('picture', this.selectedFile, this.selectedFile.name);
    uploadImageData.append('name', this.productForm.get('name')?.value);
    uploadImageData.append('price', this.productForm.get('price')?.value);
    uploadImageData.append('account', this.productForm.get('account')?.value);
    uploadImageData.append('code', this.productForm.get('code')?.value);
    uploadImageData.append('ubication', this.productForm.get('ubication')?.value);
    uploadImageData.append('categoryId', this.productForm.get('category')?.value);

    const request = this.data
      ? this.productService.updateProduct(uploadImageData, this.data.id)
      : this.productService.saveProduct(uploadImageData);

      request.subscribe(
        () => {
          const productName = this.productForm.get('name')?.value;
this.notificationService.sendNotification(
  this.data
    ? ` Producto "${productName}" actualizado con éxito`
    : ` Producto "${productName}" creado con éxito`
);
         
          this.dialogRef.close(1);
        },
        () => {
          this.notificationService.sendNotification(' Error al guardar el producto');
          this.dialogRef.close(2);
        }
      );
  }


  onCancel() {
    this.dialogRef.close(3);
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(
      (data: any) => {
        this.categories = data.categoryResponse.category;
      },
      () => console.error('Error al consultar categorías')
    );
  }

  onFileChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.nameImg = this.selectedFile.name;
    }
  }

  private updateForm(data: any) {
    this.productForm.patchValue({
      code: data.code,
      name: data.name,
      price: data.price,
      account: data.account,
      ubication: data.ubication,
      category: data.category.id,
      picture: ''
    });
  }
}