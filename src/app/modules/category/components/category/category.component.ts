import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { NewCategoryComponent } from '../new-category/new-category.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { CategoryService } from '../../../shared/services/category.service';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm/confirm.component';


@Component({
  selector: 'app-category',
  standalone: true,
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  imports: [CommonModule, MaterialModule]
})
export class CategoryComponent implements OnInit {

  private categoryService = inject(CategoryService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);

  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<CategoryElement>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.categoryService.getCategories()
      .subscribe((data: any) => {
        console.log('respuesta categories: ', data);
        this.processCategoriesResponse(data);
      }, (error: any) => {
        console.log('error: ', error);
      });
  }

  processCategoriesResponse(resp: any) {
    const dataCategory: CategoryElement[] = [];
    if (resp.metadata[0].code === '00') {
      let listCategory = resp.categoryResponse.category;
      listCategory.forEach((element: CategoryElement) => {
        dataCategory.push(element);
      });
      this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory);
      this.dataSource.paginator = this.paginator;
    }
  }

  openCategoryDialog() {
    const dialogRef = this.dialog.open(NewCategoryComponent, { width: '450px' });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar('Categoria Agregada', 'Exitosa');
        this.getCategories();
      } else if (result === 2) {
        this.openSnackBar('Se produjo un error al guardar categoria', 'Error');
      }
    });
  }

  edit(id: number, name: string, description: string) {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px',
      data: { id, name, description }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar('Categoria Actualizada', 'Exitosa');
        this.getCategories();
      } else if (result === 2) {
        this.openSnackBar('Se produjo un error al actualizar categoria', 'Error');
      }
    });
  }

  delete(id: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, { data: { id, module: 'category' } });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar('Categoria Eliminada', 'Exitosa');
        this.getCategories();
      } else if (result === 2) {
        this.openSnackBar('Se produjo un error al eliminar categoria', 'Error');
      }
    });
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return this.getCategories();
    }
    this.categoryService.getCategorieById(termino)
      .subscribe((resp: any) => {
        this.processCategoriesResponse(resp);
      });
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, { duration: 2000 });
  }
}

export interface CategoryElement {
  description: string;
  id: number;
  name: string;
}
