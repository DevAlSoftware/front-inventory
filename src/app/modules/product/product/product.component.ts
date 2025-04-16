import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSnackBar, MatSnackBarModule, MatSnackBarRef, SimpleSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { ProductService } from "../../shared/services/product.service";
import { NewProductComponent } from "../new-product/new-product.component";
import { ConfirmComponent } from "../../shared/components/confirm/confirm/confirm.component";
import { MaterialModule } from "../../shared/material.module";
import { FormsModule } from "@angular/forms";
import { MonedaPipe } from "../../../moneda.pipe";

export interface ProductElement {
  id: number;
  name: string;
  price: number;
  account: number;
  code: string;
  ubication: string;
  category: any;
  picture: any;
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSnackBarModule, MatDialogModule,
    MaterialModule,
    FormsModule, MonedaPipe]
})
export class ProductComponent implements OnInit {
  
  private productService = inject(ProductService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);

  displayedColumns: string[] = ['id', 'name', 'price', 'account', 'code', 'ubication', 'category', 'picture', 'actions'];
  dataSource = new MatTableDataSource<ProductElement>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts().subscribe(
      (data: any) => {
        console.log("Respuesta de productos:", data);
        this.processProductResponse(data);
      },
      (error: any) => {
        console.log("Error en productos:", error);
      }
    );
  }

  processProductResponse(resp: any) {
    if (resp.metadata[0].code === "00") {
      const products = resp.product.products.map((element: ProductElement) => ({
        ...element,
        picture: `data:image/jpeg;base64,${element.picture}`
      }));
      
      this.dataSource = new MatTableDataSource<ProductElement>(products);
      this.dataSource.paginator = this.paginator;
    }
  }

  openProductDialog() {
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar("Producto Agregado", "Exitosa");
        this.getProducts();
      } else if (result === 2) {
        this.openSnackBar("Se produjo un error al guardar producto", "Error");
      }
    });
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000
    });
  }

  edit(id: number, name: string, price: number, account: number, code: string, ubication: string, category: any) {
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: '450px',
      data: { id, name, price, account, code, ubication, category }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar("Producto editado", "Exitosa");
        this.getProducts();
      } else if (result === 2) {
        this.openSnackBar("Se produjo un error al editar producto", "Error");
      }
    });
  }

  delete(id: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '450px',
      data: { id, module: "product" }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar("Producto eliminado", "Exitosa");
        this.getProducts();
      } else if (result === 2) {
        this.openSnackBar("Se produjo un error al eliminar producto", "Error");
      }
    });
  }

  buscar(name: string) {
    if (!name.trim()) {
      return this.getProducts();
    }

    this.productService.getProductByName(name).subscribe((resp: any) => {
      this.processProductResponse(resp);
    });
  }

  exportExcel(){

    this.productService.exportProduct()
        .subscribe( (data: any) => {
          let file = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          let fileUrl = URL.createObjectURL(file);
          var anchor = document.createElement("a");
          anchor.download = "products.xlsx";
          anchor.href = fileUrl;
          anchor.click();

          this.openSnackBar("Archivo exportado correctamente", "Exitosa");
        }, (error: any) =>{
          this.openSnackBar("No se pudo exportar el archivo", "Error");
        })

  }

}

export interface ProductElement {
  id: number;
  name: string;
  price: number;
  account: number;
  code: string;
  ubication: string;
  category: any;
  picture: any;
}
