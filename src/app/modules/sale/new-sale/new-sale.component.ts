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
import { Product } from '../sale-form/sale-form.component';


export interface ProductSize {
  id: number;
  size: string; // S, M, L, XL
  account: number; // Stock disponible por talla
  price: number;
  product: Product;
}

export interface SaleDetail {
  productSize: ProductSize;
  quantity: number;
  price: number;
  profitPercentage: number;
  total: number;
  priceType: 'RETAIL' | 'WHOLESALER';
  subtotalSinGanancia?: number;
  ganancia?: number;
  selectedPrice?: number;
}

@Component({
  selector: 'app-new-sale',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSnackBarModule,
    MaterialModule, FormsModule, MonedaPipe ],
  templateUrl: './new-sale.component.html',
  styleUrls: ['./new-sale.component.css']
})
export class NewSaleComponent  {

  customers: any[] = [];
  products: any[] = [];
  sizes: string[] = []; // Las tallas disponibles
  
  selectedCustomer: number | null = null;
  saleDate = new Date();
  saleDetails: SaleDetail[] = [];
  detalles: SaleDetail[] = []; // inicializás esto
  availableQuantity: number = 0;
  availableSizes: any[] = [];  // Esta es la propiedad que necesitamos
  selectedPriceType: 'RETAIL' | 'WHOLESALER' = 'RETAIL';
  selectedProfitPercentage: number = 0;  
  
  selectedProductId: number | null = null;
  selectedProduct: any = null;
  selectedSize: string = 'S';  // Tamaño por defecto
  selectedQuantity: number = 1;

  currentPrice: number = 0; // este guarda el precio calculado según tipo
  
  // Variables para el cálculo de la venta
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
      console.log('Respuesta de productos:', res);  // Esta línea es crucial para entender la estructura.
      if (res.product && res.product.products) {
        this.products = res.product.products;
      }
    });
  }

  onProductSelected(productId: number) {
    this.selectedProduct = this.products.find(p => p.id === productId) || null;
  
    if (this.selectedProduct) {
      // Asignar tipo de precio por defecto (por ejemplo, "RETAIL")
      this.selectedPriceType = 'RETAIL';  // O 'WHOLESALER', dependiendo de lo que necesites
      this.updatePrice();  // Actualizar el precio inmediatamente
  
      // Llamar al backend para obtener las tallas de este producto
      this.saleService.getSizesByProduct(productId).subscribe({
        next: (res: any) => {
          const sizes = res.productSizes.productSizes;
          this.selectedProduct.sizes = sizes;
          this.availableSizes = sizes;
          this.selectedSize = 'S';  // Talla por defecto
          const sizeInfo = sizes.find((s: ProductSize) => s.size === this.selectedSize);
          this.availableQuantity = sizeInfo?.account || 0;
          this.selectedQuantity = 1;
        },
        error: () => {
          this.snackBar.open('Error al cargar tallas del producto', 'OK', { duration: 2000 });
        }
      });
    }
  }

  onPriceTypeChange() {
    this.updatePrice();
  }

  updatePrice() {
    if (!this.selectedProduct) {
      return;
    }
  
    if (this.selectedPriceType === 'RETAIL') {
      this.currentPrice = this.selectedProduct.retail ?? 0;
    } else {
      this.currentPrice = this.selectedProduct.wholesaler ?? 0;
    }
  
    console.log(`Nuevo precio (${this.selectedPriceType}):`, this.currentPrice);
  }
  

  processSale() {
    if (this.selectedProduct && this.selectedSize) {
      const sizeInfo = this.selectedProduct.sizes.find((size: ProductSize) => size.size === this.selectedSize);
  
      if (sizeInfo && sizeInfo.account >= this.selectedQuantity) {
        // Si hay suficiente stock, proceder con la venta
        this.saleService.recordSale(this.selectedProduct, this.selectedSize, this.selectedQuantity).subscribe({
          next: () => {
            // Reducir el stock de la talla seleccionada en el frontend
            sizeInfo.account -= this.selectedQuantity;
  
            // Puedes también enviar la actualización al backend para reflejar el cambio en el stock
            this.snackBar.open('Venta realizada correctamente', 'OK', { duration: 2000 });
          },
          error: () => {
            this.snackBar.open('Error al procesar la venta', 'OK', { duration: 2000 });
          }
        });
      } else {
        this.snackBar.open('No hay suficiente stock de esta talla', 'OK', { duration: 2000 });
      }
    }
  }
  

  onSizeSelected(size: string) {
    this.selectedSize = size;
  
    const sizeInfo = this.selectedProduct?.sizes?.find((s: ProductSize) => s.size === size);
    this.availableQuantity = sizeInfo?.quantity || 0;
  
    this.validateStock(); // Para ajustar de una vez si hay exceso
  }

  onSizeChange() {
    // Obtener la información de la talla seleccionada
    const sizeInfo = this.selectedProduct.sizes.find((size: ProductSize) => size.size === this.selectedSize);
  
    // Si la talla existe, actualizar la cantidad disponible
    if (sizeInfo) {
      this.availableQuantity = sizeInfo.account;  // Asegúrate de que `account` sea el campo que tiene el stock
    }
  }

  addProductToSale() {
    if (!this.selectedProduct || !this.selectedSize) return;
  
    // Asegúrate que el precio esté actualizado
    this.updatePrice();
  
    const sizeInfo = this.selectedProduct.sizes?.find((s: ProductSize) => s.size === this.selectedSize);
    const availableQuantity = sizeInfo?.account || 0;
  
    if (this.selectedQuantity > availableQuantity) {
      alert(`No puedes vender más de ${availableQuantity} unidades disponibles.`);
      return;
    }
  
    const item: SaleDetail = {
      productSize: sizeInfo!,
      quantity: this.selectedQuantity,
      price: this.currentPrice, // Precio ya actualizado aquí
      profitPercentage: this.selectedProfitPercentage || 0,
      total: 0,
      priceType: this.selectedPriceType
    };
  
    this.updateTotal(item);
  
    this.saleDetails.push(item);
    this.dataSource.data = [...this.saleDetails];
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

    // Aquí creamos el payload de la venta
    const salePayload = {
      customer: { id: this.selectedCustomer },
      saleDate: this.saleDate,
      total: this.getTotalSale(),
      saleDetails: this.saleDetails.map(item => ({
        productSize: { id: item.productSize.id },
        quantity: item.quantity,
        price: item.productSize.price, // Aquí va el coste base de la prenda
        profitPercentage: item.profitPercentage,
        total: item.total,
        priceType: item.selectedPrice // RETAIL o WHOLESALER
      }))
    };
    

    // Ahora aseguramos que al final el precio correcto (retail o wholesaler) se envíe con base en la selección
    console.log('Sale payload:', salePayload); // Imprime el payload para verificar

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

  validateStock() {
    if (this.selectedQuantity > this.availableQuantity) {
      this.selectedQuantity = this.availableQuantity;
      alert(`Solo hay ${this.availableQuantity} unidades disponibles de esta talla.`);
    }
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
