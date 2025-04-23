import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSnackBar, MatSnackBarModule, MatSnackBarRef, SimpleSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { NewProductSizeComponent } from "../new-product-size/new-product-size.component";
import { ConfirmComponent } from "../../shared/components/confirm/confirm/confirm.component";
import { MaterialModule } from "../../shared/material.module";
import { FormsModule } from "@angular/forms";
import { ProductSizeService } from "../../shared/services/productSize.service";
import { MonedaPipe } from "src/app/moneda.pipe";

export interface ProductSizeElement {
  id: number;
  size: string;
  account: string;
  product: any;
}

@Component({
  selector: 'app-product-size',
  templateUrl: './product-size.component.html',
  styleUrls: ['./product-size.component.css'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSnackBarModule, MatDialogModule,
    MaterialModule, FormsModule]
})
export class ProductSizeComponent implements OnInit {

  private productSizeService = inject(ProductSizeService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);

  displayedColumns: string[] = ['id', 'size', 'account', 'product', 'actions'];
  dataSource = new MatTableDataSource<ProductSizeElement>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getProductSizes();
  }

  getProductSizes() {
    this.productSizeService.getProductSizes().subscribe(
      (data: any) => {
        console.log("Respuesta de tallas:", data);
        this.processProductSizeResponse(data);
      },
      (error: any) => {
        console.log("Error en tallas:", error);
      }
    );
  }

  openProductSizeDialog() {
      const dialogRef = this.dialog.open(NewProductSizeComponent, {
        width: '450px'
      });
  
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result === 1) {
          this.openSnackBar("Talla Agregada", "Exitosa");
          this.getProductSizes();
        } else if (result === 2) {
          this.openSnackBar("Se produjo un error al guardar la talla", "Error");
        }
      });
    }

    processProductSizeResponse(resp: any) {
      console.log('Respuesta completa:', resp); // Verifica toda la respuesta
      
      if (resp.metadata?.[0]?.code === "00") {
        const productSizes = Array.isArray(resp.productSizes?.productSizes) ? resp.productSizes.productSizes : [];
    
        console.log('Tallas extraídas:', productSizes); // Verifica que las tallas están siendo extraídas correctamente
    
        const rows: ProductSizeElement[] = productSizes.map((element: any) => {
          console.log('Elemento actual:', element); // Muestra cada elemento y su estructura
    
          return {
            id: element.id,
            size: `${element.size}`,
            account: `${element.account}`,
            product: element.product // Muestra el producto tal como viene
          };
        });
    
        console.log('Filas mapeadas:', rows); // Verifica las filas que se pasarán a la tabla
    
        // Asignar las filas a dataSource
        this.dataSource = new MatTableDataSource<ProductSizeElement>(rows);
        this.dataSource.paginator = this.paginator;
      } else {
        console.error('Error en el código de la respuesta:', resp.metadata?.[0]?.code);
        this.dataSource = new MatTableDataSource<ProductSizeElement>([]);
      }
    }
    
  edit(id: number, size: string, account: number, product: any) {
    const dialogRef = this.dialog.open(NewProductSizeComponent, {
      width: '450px',
      data: { id, size, account, product }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar("Talla editada", "Exitosa");
        this.getProductSizes();
      } else if (result === 2) {
        this.openSnackBar("Error al editar la talla", "Error");
      }
    });
  }

  delete(id: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '450px',
      data: { id, module: "productSize" }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar("Talla eliminada", "Exitosa");
        this.getProductSizes();
      } else if (result === 2) {
        this.openSnackBar("Error al eliminar la talla", "Error");
      }
    });
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000
    });
  }

  buscar(productIdInput: string) {
    const productId = Number(productIdInput);
    if (!productId || isNaN(productId)) {
      this.getProductSizes(); // Mostrar todos si no se digita un ID válido
      return;
    }
  
    this.productSizeService.getProductSizesByProductId(productId).subscribe((resp: any) => {
      this.processProductSizeResponse(resp);
    }, (error: any) => {
      console.log("Error al buscar tallas por producto:", error);
      this.openSnackBar("Producto no encontrado o sin tallas", "Error");
    });
  }
}
