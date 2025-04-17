import { Component, inject } from '@angular/core';
import { SaleService } from '../../shared/services/sale.service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
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
    MaterialModule, FormsModule, MonedaPipe ],
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

  
  subtotalSinGanancia: number = 0;
  ganancia: number = 0;
  totalVenta: number = 0;

  dataSource = new MatTableDataSource<any>(this.saleDetails);

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
        console.log(' Respuesta de clientes:', res);
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
    const selectedProduct = this.products.find(p => p.id === this.selectedProductId);
  
    if (!selectedProduct || !this.selectedQuantity || this.selectedQuantity <= 0) return;
  
    const profitPercentage = 0;
  
    const detail = {
      product: selectedProduct,
      quantity: this.selectedQuantity,
      price: selectedProduct.price,
      profitPercentage: profitPercentage,
      total: selectedProduct.price * (1 + profitPercentage / 100) * this.selectedQuantity
    };
  
    this.saleDetails.push(detail);
    this.dataSource.data = [...this.saleDetails]; // 🔥 ¡ESTO ACTUALIZA LA TABLA!
  
    this.selectedQuantity = 1;
    this.selectedProductId = null;
    this.selectedProduct = null;
  
    this.updateResumenVenta();
  }
  
  

  updateTotal(item: any) {
    item.total = item.price * (1 + item.profitPercentage / 100) * item.quantity;
    this.updateResumenVenta();
    this.dataSource.data = [...this.saleDetails];
  }

  calculateTotal(price: number, quantity: number, profit: number): number {
    return (price + (price * profit)) * quantity;
  }

  getTotalSale(): number {
    return this.saleDetails.reduce((acc, item) => acc + item.total, 0);
  }

  getTotalVentaSinGanancia(): number {
    return this.saleDetails.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
  
  getGanancia(): number {
    return this.saleDetails.reduce((sum, item) => {
      const subtotalConGanancia = item.price * (1 + (item.profitPercentage / 100)) * item.quantity;
      const subtotalSinGanancia = item.price * item.quantity;
      return sum + (subtotalConGanancia - subtotalSinGanancia);
    }, 0);
  }

  updateResumenVenta() {
    this.subtotalSinGanancia = this.saleDetails.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  
    this.ganancia = this.saleDetails.reduce((sum, item) => {
      const totalSinGanancia = item.price * item.quantity;
      const totalConGanancia = item.total;
      return sum + (totalConGanancia - totalSinGanancia);
    }, 0);
  
    this.totalVenta = this.subtotalSinGanancia + this.ganancia;
  }
  

  saveSale() {
    if (!this.selectedCustomer) {
      this.snackBar.open('El cliente es obligatorio para crear una venta', 'OK', { duration: 3000 });
      return;
    }
  
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
        const saleId = res.saleResponse?.sale?.[0]?.id;
  
        if (saleId) {
          this.snackBar.open('Venta guardada con éxito', 'OK', { duration: 2000 });
          this.getProducts();
          this.router.navigate(['/dashboard/home']);
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
    this.saleDetails.splice(index, 1);
    this.dataSource.data = [...this.saleDetails];
    this.updateResumenVenta();
  }
}
