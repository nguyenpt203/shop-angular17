import { Component } from '@angular/core';
import { IProduct } from '../../../../interfaces/Product';
import { ProductService } from '../../../../service/product.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { RatingComponent } from '../../../client/component/rating/rating.component';

@Component({
  selector: 'app-list-products',
  standalone: true,
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.css',
  imports: [CommonModule, RouterModule, RatingComponent],
})
export class ListProductsComponent {
  products: IProduct[] | undefined;
  constructor(private productService: ProductService) {}
  loadProducts() {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }
  ngOnInit() {
    this.loadProducts();
  }

  handleDelete(id: string | number | undefined) {
    if (confirm('Bạn có chắc chắn muốn xóa không?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        alert('Xóa thành công!');
        this.loadProducts(); // Reload the products after deletion
      });
    }
  }

  handleRating(rate: number) {
    alert('Sản phẩm được đánh giá: ' + rate + ' sao');
  }
}
