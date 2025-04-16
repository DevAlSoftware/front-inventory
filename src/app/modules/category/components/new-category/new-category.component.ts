import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoryService } from '../../../shared/services/category.service';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MaterialModule]
})
export class NewCategoryComponent implements OnInit {

  public categoryForm!: FormGroup;
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private dialogRef = inject(MatDialogRef<NewCategoryComponent>);
  public data = inject(MAT_DIALOG_DATA, { optional: true });
  estadoFormulario: string = "Agregar";

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],        
      code: ['', Validators.required]        
    });

    if (this.data) {
      this.updateForm(this.data);
      this.estadoFormulario = "Actualizar";
    }
  }

  onSave() {
    const data = this.categoryForm.value;
    
    if (this.data) {
      this.categoryService.updateCategorie(data, this.data.id).subscribe({
        next: () => this.dialogRef.close(1),
        error: () => this.dialogRef.close(2)
      });
    } else {
      this.categoryService.saveCategorie(data).subscribe({
        next: () => this.dialogRef.close(1),
        error: () => this.dialogRef.close(2)
      });
    }
  }

  onCancel() {
    this.dialogRef.close(3);
  }

  updateForm(data: any) {
    this.categoryForm.patchValue(data);
  }
}
