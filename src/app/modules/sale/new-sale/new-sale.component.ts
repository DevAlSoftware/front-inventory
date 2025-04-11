import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SaleService } from '../../shared/services/sale.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MaterialModule } from '../../shared/material.module';
import { FormsModule } from '@angular/forms';
import { MonedaPipe } from '../../../moneda.pipe';

interface SaleDetail {
  product: any;
  quantity: number;
  price: number;
  profitPercentage: number;
  total: number;
}

@Component({
  selector: 'app-new-sale',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSnackBarModule, MatDialogModule,
    MaterialModule, FormsModule, MonedaPipe],
  templateUrl: './new-sale.component.html',
  styleUrls: ['./new-sale.component.css']
})
export class NewSaleComponent {

  customers: any[] = [];
  products: any[] = [];

  selectedCustomer: number | null = null;
  saleDate = new Date();
  saleDetails: SaleDetail[] = [];

  selectedProductId: number | null = null;

  constructor(
    private saleService: SaleService,
    private dialogRef: MatDialogRef<NewSaleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.getCustomers();
    this.getProducts();
  }

  getCustomers() {
    this.customers = [
      { id: 1, name: 'Cliente 1' },
      { id: 2, name: 'Cliente 2' }
    ];
  }

  getProducts() {
    this.saleService.getProducts().subscribe((res: any) => {
      this.products = res.product.products;
    });
  }

addProductToSale() {
  if (this.selectedProductId === null) return;

  const product = this.products.find(p => p.id === this.selectedProductId);
  if (!product) return;

  const alreadyInSale = this.saleDetails.find(item => item.product.id === product.id);
  if (alreadyInSale) {
    this.snackBar.open('Este producto ya fue agregado', 'OK', { duration: 2000 });
    return;
  }

  const newItem = {
    product: product,
    quantity: 1,
    price: product.price,
    profitPercentage: 0.1,
    total: this.calculateTotal(product.price, 1, 0.1)
  };

  this.saleDetails.push(newItem);
  this.selectedProductId = null;
}

updateTotal(item: any) {
  item.total = this.calculateTotal(item.price, item.quantity, item.profitPercentage);
}

calculateTotal(price: number, quantity: number, profit: number): number {
  return (price + (price * profit)) * quantity;
}

getTotalSale(): number {
  return this.saleDetails.reduce((acc, item) => acc + item.total, 0);
}

  saveSale() {
    const salePayload = {
      customer: {
        id: this.selectedCustomer
      },
      saleDate: this.saleDate,
      total: this.getTotalSale(),
      saleDetails: this.saleDetails.map(item => ({
        product: { id: item.product.id },
        quantity: item.quantity,
        price: item.price,
        profitPercentage: item.profitPercentage,
        total: item.total
      }))
    };

    this.saleService.saveSale(salePayload).subscribe({
      next: () => this.dialogRef.close(1),
      error: () => this.dialogRef.close(2)
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  removeProduct(index: number) {
    if (index > -1 && index < this.saleDetails.length) {
      this.saleDetails.splice(index, 1);
      this.snackBar.open('Producto eliminado', 'OK', { duration: 2000 });
    }
  }
}
