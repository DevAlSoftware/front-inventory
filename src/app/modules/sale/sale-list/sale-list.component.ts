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

  displayedColumns: string[] = ['id', 'customer', 'saleDate', 'subtotal', 'ganancia', 'details'];
  dataSource = new MatTableDataSource<any>();

  constructor(
    private saleService: SaleService,
    private snackBar: MatSnackBar
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getSales(); 
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
              const aumento = detalle.profitPercentage  || 0;
  
              const subtotalDetalle = precio * cantidad;
              const totalDetalle = subtotalDetalle * (1 + aumento / 100);
  
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
          //console.log('Venta con totales:', ventasConTotales);
  
          this.dataSource.data = ventasConTotales;
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

  buscar(nombreProducto: string) {
    if (!nombreProducto.trim()) {
      this.getSales();
      return;
    }
  
    this.saleService.getSalesByProductName(nombreProducto).subscribe({
      next: (res: any) => {
        this.dataSource.data = res?.saleResponse?.sale || [];
      },
      error: () => {
        this.snackBar.open('Error al buscar ventas por producto', 'OK', { duration: 2000 });
      }
    });
  }
}

export interface SaleDetailElement {
  productName: string;
  quantity: number;
  price: number;
  profitPercentage: number;
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
