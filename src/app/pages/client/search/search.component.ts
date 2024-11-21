import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IProduct } from '../../../interfaces/Product';
import { ProductService } from '../../../service/product.service'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  keywords: string | undefined;
  products: IProduct[] = [];
  searchText: any;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService // Inject ProductService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.keywords = params['keywords'];
      if (this.keywords) {
        this.searchProducts(this.keywords);
      }
    });
  }

  searchProducts(keywords: string) {
    this.productService.searchProducts(keywords).subscribe(
      (data: IProduct[]) => {
        this.products = data;
      }
    );
  }
}