import { Component, inject } from '@angular/core';
import { SaleService } from '../../shared/services/sale.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MonedaPipe } from '../../../moneda.pipe';
import { Router } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';

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
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSnackBarModule,
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
  selectedProduct: any = null;
  selectedQuantity: number = 1;

  private saleService = inject(SaleService);

  constructor(
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.getCustomers();
    this.getProducts();
  }

  getCustomers() {
    this.saleService.getCustomers().subscribe({
      next: (res: any) => {
        console.log('👉 Respuesta de clientes:', res);
        this.customers = res.customerResponse.customer;
      },
      error: () => {
        this.snackBar.open('Error al obtener clientes', 'OK', { duration: 2000 });
      }
    });
  }  

  getProducts() {
    this.saleService.getProducts().subscribe((res: any) => {
      this.products = res.product.products;
    });
  }

  onProductSelected(productId: number) {
    this.selectedProduct = this.products.find(p => p.id === productId) || null;
    this.selectedQuantity = 1;
  }

  addProductToSale() {
    if (!this.selectedProduct || this.selectedQuantity < 1) return;

    if (this.selectedQuantity > this.selectedProduct.account) {
      this.snackBar.open('Cantidad excede el stock disponible', 'OK', { duration: 2000 });
      return;
    }

    const alreadyInSale = this.saleDetails.find(item => item.product.id === this.selectedProduct.id);
    if (alreadyInSale) {
      this.snackBar.open('Este producto ya fue agregado', 'OK', { duration: 2000 });
      return;
    }

    const newItem = {
      product: this.selectedProduct,
      quantity: this.selectedQuantity,
      price: this.selectedProduct.price,
      profitPercentage: 0.1,
      total: this.calculateTotal(this.selectedProduct.price, this.selectedQuantity, 0.1)
    };

    this.saleDetails = [...this.saleDetails, newItem];
    this.selectedProductId = null;
    this.selectedProduct = null;
    this.selectedQuantity = 1;
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
      customer: { id: this.selectedCustomer },
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
      next: (res: any) => {
        console.log('Respuesta del backend:', res); // Esto te permite ver la respuesta en consola
  
        // Acceder al ID correctamente
        const saleId = res.saleResponse?.sale?.[0]?.id; // Cambiar la forma de acceder al ID
  
        if (saleId) {
          this.snackBar.open('Venta guardada con éxito', 'OK', { duration: 2000 });
  
          // Aquí es donde actualizamos la lista de productos con stock actualizado
          this.getProducts();
  
          // Navegar a la vista de detalles de la venta
          this.router.navigate(['/dashboard/saleDetail', saleId]);
        } else {
          this.snackBar.open('ID de venta no encontrado en la respuesta', 'OK', { duration: 2000 });
        }
      },
      error: () => {
        this.snackBar.open('Error al guardar venta', 'OK', { duration: 2000 });
      }
    });
  }  

  cancel() {
    this.router.navigate(['/ventas']);
  }

  removeProduct(index: number) {
    if (index > -1 && index < this.saleDetails.length) {
      this.saleDetails.splice(index, 1);
      this.snackBar.open('Producto eliminado', 'OK', { duration: 2000 });
    }
  }
}
