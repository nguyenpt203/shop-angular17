import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { IUser } from '../../../interfaces/Auth';
import { UserService } from '../../../service/auth.service';
import { CartService } from '../../../service/cart.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  [x: string]: any;
  isLogin: boolean = false;
  userInfo: any = {} as any;
  searchForm = new FormGroup({
    keywords: new FormControl(''),
  });
  totalItems: number = 0;
  constructor(
    private cartService: CartService,
    private router: Router,
    private userService: UserService,
    private cookieService: CookieService
  ) {}
  ngOnInit(): void {
    this.loadCartItems();
    this.cartService.getCartUpdated().subscribe(() => {
      this.loadCartItems();
    });
    if (typeof window !== 'undefined') {
      this.isLogin = this.cookieService.get('accessToken') ? true : false;
    } else {
      this.isLogin = false;
    }
    this.userInfo = this.getUserInfoFromCookie();
  }
  ngAfterViewChecked(): void {
    this.cartService.getCartUpdated().subscribe(() => {
      this.loadCartItems();
    });
  }
  loadCartItems(): void {
    this.cartService.getItems().subscribe((items) => {
      this.totalItems = items.length;
    });
  }
  getUserInfoFromCookie() {
    const userInfoString = this.cookieService.get('userInfo');
    if (userInfoString) {
      try {
        return JSON.parse(userInfoString);
      } catch (error) {
        console.error('Error parsing userInfo from cookie:', error);
        return null;
      }
    }
    return null;
  }
  getUserInfoFromLocalStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userInfoString = window.localStorage.getItem('user-info');
      if (userInfoString) {
        return JSON.parse(userInfoString);
      }
    }
    return null;
  }
  onSearch() {
    const keywords = this.searchForm.controls.keywords.value;
    this.router.navigate(['search'], {
      queryParams: { keywords: keywords },
    });
  }
  extractUsername(value: string) {
    const regex = /^(\w+)@/;
    const match = value?.match(regex);
    if (match) {
      return match[1];
    } else {
      return null;
    }
  }
  logout() {
    this.cookieService.deleteAll();
    this.userService.setCurrentUser(null);
    localStorage.clear(); // Xóa tất cả dữ liệu trong LocalStorage
    this.router.navigate(['/login']); // Chuyển hướng đến trang đăng nhập
  }

  cart(): void {
    this.router.navigate(['/cart']);
  }
  handleDashboard() {
    this.router.navigate(['/admin']);
  }
}
