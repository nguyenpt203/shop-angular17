import { FooterComponent } from './../layouts/footer/footer.component';
import { Component } from '@angular/core';
import { HeaderComponent } from '../layouts/header/header.component';
import { RouterModule } from '@angular/router';
import { BannerComponent } from '../layouts/banner/banner.component';

@Component({
  selector: 'app-layout-client',
  standalone: true,
  templateUrl: './layout-client.component.html',
  styleUrl: './layout-client.component.css',
  imports: [HeaderComponent, RouterModule, FooterComponent, BannerComponent],
})
export class LayoutClientComponent {}
