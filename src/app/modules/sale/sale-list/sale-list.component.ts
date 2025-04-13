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
  displayedColumns: string[] = ['id', 'customer', 'saleDate', 'details'];
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
          this.dataSource.data = response.saleResponse.sale;
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
