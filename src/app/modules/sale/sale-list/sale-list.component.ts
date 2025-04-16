import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MonedaPipe } from '../../../moneda.pipe';
import { SaleService } from '../../shared/services/sale.service';

@Component({
  selector: 'app-sale-list',
  imports: [MonedaPipe, MatTableModule],
  templateUrl: './sale-list.component.html',
  styleUrl: './sale-list.component.css',
  standalone: true
})
export class SaleListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'customer', 'saleDate', 'subtotal', 'ganancia', 'details'];
  dataSource = new MatTableDataSource<any>();

  constructor(
    private saleService: SaleService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getSales();  // Cargar las ventas completas al inicio
  }

  getSales() {
    this.saleService.getSales().subscribe({
      next: (response: any) => {
        console.log('Respuesta recibida:', response);
        if (response?.saleResponse?.sale) {
          const ventas = response.saleResponse.sale;
  
          // Procesar cada venta para calcular subtotal y ganancia
          const ventasConTotales = ventas.map((venta: any) => {
            let subtotal = 0;
            let total = 0;
  
            venta.saleDetails.forEach((detalle: any) => {
              console.log('Detalle:', detalle);
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
          console.log('Venta con totales:', ventasConTotales);
  
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
}
