import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar, MatSnackBarModule, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MonedaPipe } from '../../../moneda.pipe';
import { SaleService } from '../../shared/services/sale.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../shared/services/product.service';
import { Product, Sale } from '../sale-form/sale-form.component';
import { ProductSize } from '../new-sale/new-sale.component';


@Component({
  selector: 'app-sale-list',
  imports: [MonedaPipe, CommonModule,
    MaterialModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule],
  templateUrl: './sale-list.component.html',
  styleUrl: './sale-list.component.css',
  standalone: true
})
export class SaleListComponent implements OnInit, AfterViewInit {

  public dialog = inject(MatDialog);

  displayedColumns: string[] = ['id', 'customer', 'saleDate', 'details'];
  innerColumns: string[] = ['productName','size','quantity','priceType','price','subtotal'];

  dataSource = new MatTableDataSource<any>();
  products: any[] = [];
  selectedProductId: number = 0;
  sales: any[] = [];

  constructor(
    private saleService: SaleService,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getSales();
    this.getProducts(); 
  }

  getSales() {
    this.saleService.getSales().subscribe({
      next: (response: any) => {
        if (response?.saleResponse?.sale) {
          const ventas = response.saleResponse.sale;
  
          // Procesar cada venta para calcular subtotal y ganancia
          const ventasConTotales = ventas.map((venta: any) => {
            let subtotal = 0;
            let total = 0;
  
            venta.saleDetails.forEach((detalle: any) => {
              const precio = detalle.product.price || 0;
              const cantidad = detalle.quantity || 0;
              const ganancia = detalle.ganancia || 0;
  
              const subtotalDetalle = precio * cantidad;
              const totalDetalle = subtotalDetalle + ganancia;
  
              detalle.subtotalSinGanancia = subtotalDetalle;
              detalle.total = totalDetalle;
              detalle.descuento = 0; // Si aún no tenés descuento calculado

              subtotal += subtotalDetalle;
              total += totalDetalle;
            });
  
            // Agregar los campos calculados
            return {
              ...venta,
              subtotalSinGanancia: subtotal,
              ganancia: total - subtotal,
            };
          });
  
          this.dataSource.data = ventasConTotales;
          this.sales = ventasConTotales; // <- AQUÍ estaba la falta
        } else {
          this.snackBar.open('No se encontraron ventas', 'OK', { duration: 2000 });
        }
      },
      error: (error) => {
        console.error("Error al cargar las ventas:", error);
        this.snackBar.open('Error al cargar las ventas', 'OK', { duration: 2000 });
      }
    });
  }

  getSubtotalVenta(sale: any): number {
    return sale.saleDetails.reduce((sum: number, item: any) => sum + item.subtotalSinGanancia, 0);
  }
  
  getTotalVenta(sale: any): number {
    return sale.saleDetails.reduce((sum: number, item: any) => sum + item.total, 0);
  }
 

  openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action, {
      duration: 2000
    })

  }

  exportExcel() {
    this.saleService.exportSales()
      .subscribe((data: any) => {
        const file = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const fileUrl = URL.createObjectURL(file);
        const anchor = document.createElement("a");
        anchor.href = fileUrl;
        anchor.download = "ventas.xlsx";
        anchor.click();
  
        this.openSnackBar("Archivo exportado correctamente", "Exitosa");
      }, (error: any) => {
        this.openSnackBar("No se pudo exportar el archivo", "Error");
      });
  }

  getProducts() {
    this.saleService.getProducts().subscribe((res: any) => {
      this.products = res.product.products;
    });
  }

  onProductSelected(event: any) {
    if (this.selectedProductId === 0) {
      this.dataSource.data = this.sales;
      return;
    }
  
    this.dataSource.data = this.sales.filter(sale =>
      sale.saleDetails.some((detail: any) => detail.product.id === this.selectedProductId)
    );
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

}


export interface SaleDetailElement {
  productName: string;
  quantity: number;
  price: number;
  profitPercentage: number;
  priceType: string;
}

export interface SaleElement {
  id: number;
  customerName: string;
  saleDate: string;
  subtotalSinGanancia: number;
  ganancia: number;
  total: number;
  saleDetails: SaleDetailElement[];
}
