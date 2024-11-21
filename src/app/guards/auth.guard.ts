import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { UserService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: UserService, private router: Router) {}

  canActivate(route: any, state: any): boolean | UrlTree {
    const url = state.url;

    if (this.authService.isAdmin()) {
      if (url === '/admin') {
        return true;
      } else {
        return this.router.createUrlTree(['/admin']);
      }
    } else {
      return this.router.createUrlTree(['/']);
    }
  }
}
