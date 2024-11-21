import { Component } from '@angular/core';
import { IProduct } from '../../../../interfaces/Product';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../../service/product.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [FormsModule, RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css'
})
export class ProductEditComponent {
  product: IProduct = {} as IProduct;
  productForm: FormGroup = {} as FormGroup;
  productId: string | null = null;
  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      image: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(1)]],
      discount: ['', [Validators.required, Validators.min(0)]],
      rate: ['', [Validators.required, Validators.max(5), Validators.min(1)]],
      desc: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

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

  loadProduct() {
    if (this.productId) {
      this.productService
        .getProductById(this.productId)
        .subscribe((product) => {
          this.product = product;
          this.productForm.patchValue(product);
        });
    }
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.loadProduct();
  }
  handleSubmit() {
    if (this.productForm.valid && this.productId !== null) {
      this.productService
        .updateProduct(this.productId, this.productForm.value)
        .subscribe((data) => {
          alert('Cập nhập thành công!');
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
