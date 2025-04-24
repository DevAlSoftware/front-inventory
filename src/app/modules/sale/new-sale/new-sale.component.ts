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
  availableQuantity: number = 0;
  availableSizes: any[] = [];  // Esta es la propiedad que necesitamos
  selectedPriceType: 'RETAIL' | 'WHOLESALER' = 'RETAIL';
  selectedProfitPercentage: number = 0;  
  manualDiscount: number = 0;
  
  selectedProductId: number | null = null;
  selectedProduct: any = null;
  selectedSize: string = 'S';  // Tamaño por defecto
  selectedQuantity: number = 1;

  currentPrice: number = 0; // este guarda el precio calculado según tipo
  
  // Variables para el cálculo de la venta
  subtotalSinGanancia: number = 0;
  ganancia: number = 0;
  gananciaTotal: number = 0;
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
      console.log('Respuesta de productos:', res);  
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

  // Agregar el producto a la venta
  addProductToSale() {
    if (!this.selectedProduct || !this.selectedSize) {
      alert('Selecciona un producto y una talla.');
      return;
    }
  
    this.updatePrice();
  
    const sizeInfo = this.selectedProduct.sizes?.find((s: ProductSize) => s.size === this.selectedSize);
    if (!sizeInfo) {
      alert('No se encontró la talla seleccionada para este producto.');
      return;
    }
  
    const availableQuantity = sizeInfo.account || 0;
  
    if (this.selectedQuantity > availableQuantity) {
      alert(`No puedes vender más de ${availableQuantity} unidades disponibles.`);
      return;
    }
  
    const subtotalItem = sizeInfo.product.price * this.selectedQuantity; // ✅ Corregido
    const totalItem = this.currentPrice * this.selectedQuantity;
    const gananciaItem = totalItem - subtotalItem;
  
    const item: SaleDetail = {
      productSize: sizeInfo,
      quantity: this.selectedQuantity,
      price: this.currentPrice,
      profitPercentage: this.selectedProfitPercentage || 0,
      priceType: this.selectedPriceType, // Asegúrate de que sea 'RETAIL' | 'WHOLESALER'
      total: totalItem,
      ganancia: gananciaItem
    };
  
    this.saleDetails.push(item);
    this.dataSource.data = [...this.saleDetails];
  
    this.subtotalSinGanancia = this.saleDetails.reduce((sum, i) => {
      return sum + (i.price * i.quantity); //  Corregido
    }, 0);
  
    this.totalVenta = this.saleDetails.reduce((sum, i) => sum + i.total, 0);
    this.gananciaTotal = this.totalVenta - this.subtotalSinGanancia;
  
    //  Asegúrate de que estos tipos acepten null si los vas a resetear
    this.selectedProduct = null as any; // o tipa como `Product | null`
    this.selectedSize = null as any;    // o tipa como `string | null`
    this.selectedQuantity = 1;
    this.selectedProfitPercentage = 0;
    this.currentPrice = 0;
    this.selectedPriceType = 'RETAIL'; //  en mayúscula
  }
  
  updateTotal(item: SaleDetail) {
    item.total = item.price * (1 + item.profitPercentage / 100) * item.quantity;
    // Actualizar el resumen de la venta después de cada actualización del total
    this.updateResumenVenta();
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

  /// Función para actualizar el resumen con el descuento manual
  updateResumenVenta() {
    // Convertir manualDiscount a número si es necesario
    this.manualDiscount = parseFloat(this.manualDiscount.toString()) || 0;

    // Calcular el subtotal sin ganancia
    this.subtotalSinGanancia = this.saleDetails.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    // Ganancia es el descuento manual ingresado
    this.ganancia = this.manualDiscount;

    // Total venta es el subtotal menos el descuento
    this.totalVenta = this.subtotalSinGanancia - this.ganancia;
  }

  // Guardar la venta
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
        price: item.productSize.price, 
        profitPercentage: item.profitPercentage,
        total: item.total,
        priceType: item.selectedPrice
      }))
    };

    console.log('Sale payload:', salePayload);

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
