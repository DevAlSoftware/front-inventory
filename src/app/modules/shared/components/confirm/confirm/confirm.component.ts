import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from '../../../services/category.service';
import { ProductService } from '../../../services/product.service';
import { CustomerService } from '../../../services/customer.service';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-confirm',
  standalone: true,
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent {

  private categoryService = inject(CategoryService);
  private dialogRef = inject(MatDialogRef<ConfirmComponent>);
  public data = inject(MAT_DIALOG_DATA);
  private snackBar = inject(MatSnackBar);
  private productService= inject(ProductService);
  private customerService = inject(CustomerService)

  onNoClick(): void {
    this.dialogRef.close(3);
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000
    });
  }

  delete() {
    if (!this.data) return this.dialogRef.close(2);
  
    const cleanId = typeof this.data.id === 'string' ? this.data.id.trim() : this.data.id;
  
    const handleError = (error: any) => {
      const msg = error?.error?.metadata?.[0]?.message || 'Error al eliminar';
      this.snackBar.open(msg, 'Error', { duration: 3000 });
      this.dialogRef.close(2);
    };
  
    if (this.data.module === 'category') {
      this.categoryService.deleteCategorie(cleanId).subscribe({
        next: () => this.dialogRef.close(1),
        error: handleError
      });
    } else if (this.data.module === 'product') {
      this.productService.deleteProduct(cleanId).subscribe({
        next: () => this.dialogRef.close(1),
        error: handleError
      });
    } else if (this.data.module === 'customer') {
      this.customerService.deleteCustomers(cleanId).subscribe({
        next: () => this.dialogRef.close(1),
        error: handleError
      });
    } else {
      this.dialogRef.close(2);
    }
  }
  
}