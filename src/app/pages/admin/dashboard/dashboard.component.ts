import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../service/product.service';
import { CommonModule } from '@angular/common';
import { IUser } from '../../../interfaces/Auth';
import { UserInfoService } from '../../../service/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  users: IUser[] | undefined;
  constructor(private userService: UserInfoService) {}
  loadProducts() {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }
  ngOnInit() {
    this.loadProducts();
  }

  handleDelete(id: string | number | undefined) {
    if (confirm('Bạn có chắc chắn muốn xóa không?')) {
      this.userService.deleteUser(id).subscribe(() => {
        alert('Xóa thành công!');
        this.loadProducts(); // Reload the products after deletion
      });
    }
  }
}
