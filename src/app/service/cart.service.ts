import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  Subject,
  forkJoin,
  map,
  mapTo,
  switchMap,
  tap,
} from 'rxjs';
import { ICart } from '../interfaces/Cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = 'http://localhost:3000/cart';
  private base = 'http://localhost:3000/cart?_expand=product';
  private cartUpdated = new Subject<void>();
  private cartItems: ICart[] = [];
  private cartItemsChanged = new Subject<ICart[]>();
  constructor(private http: HttpClient) {}

  getItems(): Observable<ICart[]> {
    return this.http.get<ICart[]>(this.base);
  }
  getSingleCartItem(id: string): Observable<ICart> {
    return this.http.get<ICart>(`${this.base}/${id}`);
  }
  addItem(productId: number, quantity: number): Observable<ICart> {
    return this.http.post<ICart>(this.baseUrl, { productId, quantity }).pipe(
      tap(() => this.cartUpdated.next()) // Phát sự kiện khi thêm sản phẩm vào giỏ hàng
    );
  }
  addCartItem(
    productId: number,
    body: ICart,
    quantity: number
  ): Observable<ICart> {
    return this.http.post<ICart>(this.base, { productId, body, quantity }).pipe(
      tap(() => this.cartUpdated.next()) // Phát sự kiện khi thêm sản phẩm vào giỏ hàng
    );
  }
  removeItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.cartUpdated.next()) // Phát sự kiện khi thêm sản phẩm vào giỏ hàng
    );
  }

  updateCartItem(item: ICart): Observable<ICart> {
    const url = `${this.baseUrl}/${item.id}`;
    return this.http.put<ICart>(url, item);
  }

  getCartUpdated(): Observable<void> {
    return this.cartUpdated.asObservable();
  }
  clearCart(): Observable<void> {
    return this.getItems().pipe(
      switchMap((items) => {
        const deleteRequests = items.map((item) =>
          this.http.delete<void>(`${this.baseUrl}/${item.id}`)
        );
        return forkJoin(deleteRequests).pipe(
          tap(() => {
            this.cartUpdated.next();
            this.cartUpdated.complete();
          }),
          map(() => void 0) // Chuyển đổi kết quả thành `void`
        );
      })
    );
  }
  getCartItems(): ICart[] {
    return this.cartItems;
  }

  getCartItemsChangedObservable(): Observable<ICart[]> {
    return this.cartItemsChanged.asObservable();
  }
  private saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }
  setCartItems(items: ICart[]) {
    this.cartItems = items;
    this.cartItemsChanged.next(this.cartItems);
    this.saveCartToStorage();
  }

  updateItemQuantity(productId: any, newQuantity: number): Observable<boolean> {
    return this.getItems().pipe(
      tap((cartItems) => {
        // Tìm sản phẩm có productId trùng khớp
        const itemIndex = cartItems.findIndex((item) => item.id === productId);

        if (itemIndex !== -1) {
          // Cập nhật số lượng sản phẩm
          cartItems[itemIndex].quantity = newQuantity;

          // Lưu lại danh sách sản phẩm mới vào local storage
          this.setCartItems(cartItems);

          // Thông báo thay đổi
          this.cartItemsChanged.next(cartItems);
        } else {
          // Nếu không tìm thấy sản phẩm, ném ra lỗi
          throw new Error('Sản phẩm không tồn tại trong giỏ hàng');
        }
      }),
      mapTo(true)
    );
  }
  updateCartQuantity(id: string | number | undefined, quantity: number) {
    const body = { quantity };
    return this.http.patch(`${this.baseUrl}/${id}`, body);
  }
}
