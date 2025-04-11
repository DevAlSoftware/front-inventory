import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MaterialModule } from '../../shared/material.module';
import { FormsModule } from '@angular/forms';
import { MonedaPipe } from '../../../moneda.pipe';
import { ConfirmComponent } from '../../shared/components/confirm/confirm/confirm.component';
import { SaleService } from '../../shared/services/sale.service';
import { NewSaleComponent } from '../new-sale/new-sale.component';

export interface Customer {
  id: number;
  name: string;
}

export interface Product {
  id: number;
}

export interface SaleDetail {
  product: Product;
  quantity: number;
  price: number;
  profitPercentage: number;
  total: number;
}

export interface Sale {
  id: number;
  customer: Customer;
  saleDate: string;
  total: number;
  saleDetails: SaleDetail[];
}

@Component({
  selector: 'app-sale-form',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSnackBarModule, MatDialogModule,
    MaterialModule, FormsModule, MonedaPipe],
  templateUrl: './sale-form.component.html',
  styleUrl: './sale-form.component.css'
})
export class SaleFormComponent implements OnInit {

  private saleService = inject(SaleService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);

  displayedColumns: string[] = ['id', 'customer', 'saleDate', 'total', 'detalle', 'actions'];
  dataSource = new MatTableDataSource<Sale>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getSales();
  }

  getSales() {
    this.saleService.getSales().subscribe(
      (data: any) => {
        console.log("Respuesta de ventas:", data);
        this.processSalesResponse(data);
      },
      (error: any) => {
        console.log("Error en ventas:", error);
      }
    );
  }

  processSalesResponse(resp: any) {
    if (resp.metadata[0].code === "00") {
      const sales = resp.sale.sales.map((element: Sale) => ({
        ...element,
      }));
      this.dataSource = new MatTableDataSource<Sale>(sales);
      this.dataSource.paginator = this.paginator;
    }
  }

  openSaleDialog() {
    const dialogRef = this.dialog.open(NewSaleComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar("Venta registrada correctamente", "Éxito");
        this.getSales();
      } else if (result === 2) {
        this.openSnackBar("Se produjo un error al registrar la venta", "Error");
      }
    });
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000
    });
  }

  view(id: number) {
    // Aquí podrías abrir un modal o navegar a una vista de detalle
    console.log("Ver detalles de la venta con ID:", id);
  }

  delete(id: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '450px',
      data: { id, module: "sale" }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.saleService.deleteSale(id).subscribe(() => {
          this.openSnackBar("Venta eliminada", "Éxito");
          this.getSales();
        }, () => {
          this.openSnackBar("Error al eliminar venta", "Error");
        });
      }
    });
  }

  buscar(cliente: string) {
    if (!cliente.trim()) {
      return this.getSales();
    }

    this.saleService.getSalesByCustomer(cliente).subscribe((resp: any) => {
      this.processSalesResponse(resp);
    });
  }

  exportExcel() {
    this.saleService.exportSales().subscribe(
      (data: any) => {
        const file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const fileUrl = URL.createObjectURL(file);
        const anchor = document.createElement("a");
        anchor.download = "sales.xlsx";
        anchor.href = fileUrl;
        anchor.click();

        this.openSnackBar("Archivo exportado correctamente", "Éxito");
      },
      (error: any) => {
        this.openSnackBar("No se pudo exportar el archivo", "Error");
      }
    );
  }
}
