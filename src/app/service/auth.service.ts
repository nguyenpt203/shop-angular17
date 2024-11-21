import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { IUser } from '../interfaces/Auth';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUser: any;
  private baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(user: IUser): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, user).pipe(
      tap((response) => {
        this.cookieService.set('userInfo', JSON.stringify(response));
        this.setCurrentUser(response);
      })
    );
  }
  register(user: IUser): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, user);
  }

  setCurrentUser(user: any) {
    this.currentUser = user;
  }

  getCurrentUser() {
    return this.currentUser;
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
  initCurrentUser() {
    const userInfo = this.getUserInfoFromCookie();
    if (userInfo) {
      this.setCurrentUser(userInfo);
    }
  }
  isAdmin(): boolean {
    if (
      this.getUserInfoFromCookie() &&
      this.getUserInfoFromCookie().user.role == 'admin'
    ) {
      return true;
    }
    return false;
  }
}
