import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MaterialModule } from '../../../shared/material.module';
import { CustomerService } from '../../../shared/services/customer.service';

@Component({
  selector: 'app-new-customer',
  
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MaterialModule],
  templateUrl: './new-customer.component.html',
  styleUrl: './new-customer.component.css'
})
export class NewCustomerComponent implements OnInit {

  public customerForm!: FormGroup;
  private fb = inject(FormBuilder);
  private customerService = inject(CustomerService);
  private dialogRef = inject(MatDialogRef<NewCustomerComponent>);
  public data = inject(MAT_DIALOG_DATA, { optional: true });
  estadoFormulario: string = "Agregar";

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      fullName: ['', Validators.required],
      document: ['', Validators.required],
      phone: ['', Validators.required]
    });

    if (this.data) {
      this.updateForm(this.data);
      this.estadoFormulario = "Actualizar";
    }
  }

  onSave() {
    const data = this.customerForm.value;
    
    if (this.data) {
      this.customerService.updateCustomers(data, this.data.id).subscribe({
        next: () => this.dialogRef.close(1),
        error: () => this.dialogRef.close(2)
      });
    } else {
      this.customerService.saveCustomers(data).subscribe({
        next: () => this.dialogRef.close(1),
        error: () => this.dialogRef.close(2)
      });
    }
  }

  onCancel() {
    this.dialogRef.close(3);
  }

  updateForm(data: any) {
    this.customerForm.patchValue(data);
  }
}
