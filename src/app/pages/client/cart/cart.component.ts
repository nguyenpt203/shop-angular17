import { Component, OnInit } from '@angular/core';
import { ICart } from '../../../interfaces/Cart';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../service/cart.service';
import { Router } from '@angular/router';
import { RatingComponent } from '../component/rating/rating.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [CommonModule, RatingComponent],
})
export class CartComponent implements OnInit {
  items: ICart[] = [];
  totalItems: number = 0;
  subtotal: number = 0;
  newItems: any[] = [];
  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadCartItems();
  }
  createNewItems() {
    const itemMap: { [key: number]: any } = {};

    this.items.forEach((item: any) => {
      if (itemMap[item.productId]) {
        itemMap[item.productId].quantity += item.quantity;
      } else {
        itemMap[item.productId] = { ...item };
      }
    });

    this.newItems = Object.values(itemMap);
  }
  loadCartItems(): void {
    this.cartService.getItems().subscribe((itemCart) => {
      this.items = itemCart;
      this.updateCartSummary();
    });
  }

  updateCartSummary(): void {
    this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.subtotal = this.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }

  increaseQuantity(index: number): void {
    this.items[index].quantity += 1;
    this.updateCartItem(this.items[index]);
  }

  decreaseQuantity(index: number): void {
    if (this.items[index].quantity > 1) {
      this.items[index].quantity -= 1;
      this.updateCartItem(this.items[index]);
    }
  }

  updateCartItem(item: ICart): void {
    this.cartService.updateCartItem(item).subscribe(() => {
      this.updateCartSummary();
    });
  }

  removeItem(id: number | undefined): void {
    if (id !== undefined && confirm('Bạn chắc chắn sản phẩm này không!')) {
      this.cartService.removeItem(id).subscribe(() => {
        this.items = this.items.filter((item) => item.id !== id);
      });
    }
  }

  getTotalCost(): number {
    return this.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }
  clearCart(): void {
    if (confirm('Bạn có muốn thanh toán không!')) {
      this.cartService.clearCart().subscribe(() => {
        this.items = [];
        alert('Thanh toán thành công!');
        this.router.navigate(['/']);
      });
    }
  }
  formatCurrency(amount: number): string {
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    const formattedAmount = formatter.format(amount);
    return formattedAmount.replace('.00', '');
  }
}
