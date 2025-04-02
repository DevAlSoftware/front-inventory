import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm/confirm.component';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../../shared/services/customer.service';
import { NewCustomerComponent } from '../new-customer/new-customer.component';


@Component({
  selector: 'app-customer',
  standalone: true,
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  imports: [CommonModule, 
    MaterialModule,
    MatTableModule, 
    MatPaginatorModule, 
    MatDialogModule, 
    MatSnackBarModule,
    FormsModule]
})
export class CustomerComponent implements OnInit, AfterViewInit {

  private customerService = inject(CustomerService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);

  displayedColumns: string[] = ['id', 'fullName', 'document', 'phone', 'actions'];
  dataSource = new MatTableDataSource<CustomerElement>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers(): void {
    this.customerService.getCustomers()
      .subscribe((data: any) => {
        console.log('respuesta clientes: ', data);
        this.processCustomersResponse(data);
      }, (error: any) => {
        console.log('error: ', error);
      });
  }

  processCustomersResponse(resp: any) {
    const dataCustomer: CustomerElement[] = [];
    if (resp.metadata[0].code === '00') {
      let listCustomer = resp.customerResponse.customer;
      listCustomer.forEach((element: CustomerElement) => {
        dataCustomer.push(element);
      });
      this.dataSource = new MatTableDataSource<CustomerElement>(dataCustomer);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      });
    }
  }

  openCustomerDialog() {
    const dialogRef = this.dialog.open(NewCustomerComponent, { width: '450px' });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar('Cliente Agregado', 'Exitosa');
        this.getCustomers();
      } else if (result === 2) {
        this.openSnackBar('Se produjo un error al guardar cliente', 'Error');
      }
    });
  }

  edit(id: number, fullName: string, document: string, phone: string) {
    const dialogRef = this.dialog.open(NewCustomerComponent, {
      width: '450px',
      data: { id, fullName, document, phone }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar('Cliente Actualizado', 'Exitosa');
        this.getCustomers();
      } else if (result === 2) {
        this.openSnackBar('Se produjo un error al actualizar cliente', 'Error');
      }
    });
  }

  delete(id: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, { data: { id, module: 'customer' } });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar('Cliente Eliminado', 'Exitosa');
        this.getCustomers();
      } else if (result === 2) {
        this.openSnackBar('Se produjo un error al eliminar cliente', 'Error');
      }
    });
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return this.getCustomers();
    }
    this.customerService.geCustomerById(termino)
      .subscribe((resp: any) => {
        this.processCustomersResponse(resp);
      });
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, { duration: 2000 });
  }
}

export interface CustomerElement {
  document: string;
  id: number;
  fullName: string;
  phone: string
}
