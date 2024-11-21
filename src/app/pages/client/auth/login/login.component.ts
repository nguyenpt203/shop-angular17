import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IUser } from '../../../../interfaces/Auth';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../../service/auth.service';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  user: IUser = {} as IUser;
  userForm: FormGroup = {} as FormGroup;
  loginError: string | null = null;
  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private cookieService: CookieService
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  ngOnInit(): void {}

  getErrorMessage(controlName: string): string {
    const control = this.userForm.get(controlName);
    if (control?.errors?.['required']) {
      return 'Bắt buộc phải nhập';
    } else if (control?.errors?.['minlength']) {
      return 'Bắt buộc phải nhập lớn hơn 6';
    } else if (control?.errors?.['email']) {
      return 'Phải đúng định dạng email';
    }
    return '';
  }
  handleSubmit() {
    if (this.userForm.valid) {
      this.userService.login(this.userForm.value).subscribe({
        next: (data) => {
          // localStorage.setItem('accessToken', data.accessToken);
          // localStorage.setItem('role', data.user.role);
          // localStorage.setItem('user-info', JSON.stringify(data.user));
          this.cookieService.set('accessToken', data.accessToken);
          this.cookieService.set('role', data.user.role);
          this.cookieService.set('user-info', JSON.stringify(data.user));
          if (data.user.role === 'admin') {
            this.router.navigate(['/']);
          } else {
            this.router.navigate(['/']);
          }
          alert('Đăng nhập thành công!');
        },
        error: (err) => {
          if (err.status === 400) {
            if (err.error === 'Cannot find user') {
              this.loginError = 'Email không tồn tại';
            } else if (err.error === 'Incorrect password') {
              this.loginError = 'Mật khẩu không đúng';
            } else {
              this.loginError = 'Email hoặc mật khẩu không đúng';
            }
          } else {
            this.loginError = 'Đăng nhập thất bại. Vui lòng thử lại sau.';
          }
        },
      });
    }
  }
}
