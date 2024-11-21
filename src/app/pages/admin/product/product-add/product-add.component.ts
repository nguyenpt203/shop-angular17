import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IProduct } from '../../../../interfaces/Product';
import { ProductService } from '../../../../service/product.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [FormsModule, RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './product-add.component.html',
  styleUrl: './product-add.component.css'
})
export class ProductAddComponent {
  product: IProduct = {} as IProduct;
  productForm: FormGroup = {} as FormGroup;
  constructor(
    private productService: ProductService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      image: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(1)]],
      discount: ['', [Validators.required, Validators.min(1)]],
      rate: ['', [Validators.required, Validators.max(5), Validators.min(1)]],
      desc: ['', [Validators.required, Validators.minLength(3)]],
    });
  }
  ngOnInit(): void {}

  getErrorMessage(controlName: string): string {
    const control = this.productForm.get(controlName);
    if (control?.errors?.['required']) {
      return 'Bắt buộc phải nhập';
    } else if (control?.errors?.['minlength']) {
      return 'Phải nhập lớn hơn 3';
    } else if (control?.errors?.['min']) {
      return 'Phải nhập lớn hơn 0';
    } else if (control?.errors?.['max']) {
      return 'Phải nhập nhỏ hơn 5'
    }
    return '';
  }
  handleSubmit() {
    if (this.productForm.valid) {
      this.productService
        .createProduct(this.productForm.value)
        .subscribe((data) => {
          alert('Thêm thành công!');
          this.router.navigate(['/admin/list_products']);
        });
    }
  }

  handleCancel() {
    const confirmCancel = window.confirm('Bạn có chắc chắn muốn hủy không?');
    if (confirmCancel) {
      this.router.navigate(['/admin']);
    }
  }
}
