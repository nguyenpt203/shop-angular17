import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Thaivm2';
  info = {
    name: 'thaivm2',
    email: 'thaivm2@fpt.edu.vn',
    gender: 'male',
  }
  name='';
  count = 0;
  //khai báo hàm: 
  //khai báo kiểu dữ liệu trả về: tenHam(): kieuDulieu {}
  //ko khai báo kiểu dữ liệu trả về: tenHam() {} 
  countClick(): void {
    this.count = this.count + 1; //tăng giá trị của count lên 1 đơn vị
  }
  
  logout(): void {
    const userinfo = localStorage.getItem('user');
    if (userinfo !== null) { //đang tồn tại biến user trong localStorage
      localStorage.removeItem('user'); //xóa user khỏi localStorage-> kết thúc phiên đăng nhập
    }
  }
}
