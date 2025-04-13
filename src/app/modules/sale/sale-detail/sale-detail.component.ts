import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { SaleDetailService } from '../../shared/services/saleDetail.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sale-detail',
  standalone: true,  
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSnackBarModule, MatDialogModule,
    MaterialModule, FormsModule],
  templateUrl: './sale-detail.component.html',
  styleUrls: ['./sale-detail.component.css']
})
export class SaleDetailComponent implements OnInit {

  displayedColumns: string[] = ['id', 'product', 'quantity', 'price', 'profitPercentage', 'total', 'actions'];
  dataSource = new MatTableDataSource<any>();  // MatTableDataSource para la tabla de detalles de ventas

  @ViewChild(MatPaginator) paginator!: MatPaginator;  // Paginación para la tabla

  constructor(
    private saleDetailService: SaleDetailService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id']; // saleId
    this.getDetails(id);
  }

  // Obtener detalles de ventas
  getSaleDetails(): void {
    this.saleDetailService.getSaleDetails().subscribe(
      (response: any) => {
        this.dataSource.data = response.saleDetails;  // Asumimos que la respuesta es un objeto con una propiedad saleDetails
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.error('Error al cargar los detalles de la venta:', error);
        this.openSnackBar('Error al cargar los detalles de la venta', 'Error');
      }
    );
  }

  // Método para mostrar un mensaje en el snack bar
  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }

  // Método para eliminar un detalle de venta
  deleteSaleDetail(id: number): void {
    this.saleDetailService.deleteSaleDetail(id).subscribe(() => {
      this.openSnackBar('Detalle de venta eliminado', 'Éxito');
      this.getSaleDetails();  // Recargar detalles después de la eliminación
    }, (error) => {
      this.openSnackBar('Error al eliminar el detalle de venta', 'Error');
    });
  }
  getDetails(id: number) {
    this.saleDetailService.getDetailsBySaleId(id).subscribe(
      (resp: any) => {
        console.log("Detalles:", resp);
        if (resp?.saleDetail?.saleDetails) {  // Verifica que saleDetails exista
          this.dataSource.data = resp.saleDetail.saleDetails;
        } else {
          this.openSnackBar('No se encontraron detalles para esta venta', 'Error');
        }
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.error("Error al cargar los detalles de la venta:", error);
        this.openSnackBar('Error al cargar los detalles de la venta', 'Error');
      }
    );
  }
  
}
