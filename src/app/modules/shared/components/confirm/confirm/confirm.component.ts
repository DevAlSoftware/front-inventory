import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from '../../../services/category.service';
import { ProductService } from '../../../services/product.service';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-confirm',
  standalone: true,
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent {

  private categoryService = inject(CategoryService);
  private dialogRef = inject(MatDialogRef<ConfirmComponent>);
  public data = inject(MAT_DIALOG_DATA);
  private productService= inject(ProductService);
  private customerService = inject(CustomerService)

  onNoClick(): void {
    this.dialogRef.close(3);
  }

  delete(){
    if (this.data != null){

      if (this.data.module == "category") {
      
        this.categoryService.deleteCategorie(this.data.id).
              subscribe( (data:any) =>{
                this.dialogRef.close(1);
              }, (error: any) => {
                this.dialogRef.close(2);
              })
      } else if ( this.data.module == "product" )  {
            this.productService.deleteProduct(this.data.id).
              subscribe( (data:any) =>{
                this.dialogRef.close(1);
              }, (error: any) => {
                this.dialogRef.close(2);
              })
      } else if ( this.data.module == "customer" )  {
        this.customerService.deleteCustomers(this.data.id).
          subscribe( (data:any) =>{
            this.dialogRef.close(1);
          }, (error: any) => {
            this.dialogRef.close(2);
          })

    } else {
      this.dialogRef.close(2);
    }
  }

  }
}
