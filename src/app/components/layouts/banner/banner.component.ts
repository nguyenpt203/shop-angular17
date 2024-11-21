import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css',
})
export class BannerComponent {
  @ViewChild('carouselElement', { static: true })
  carouselElement!: ElementRef<any>;
  images = [
    'https://sohanews.sohacdn.com/160588918557773824/2022/8/3/photo-1-1659509584546766342306.png',
    'https://aphoto.vn/wp-content/uploads/2018/02/anh-dep-chup-va-blend-bang-dien-thoai-8.jpg',
    'https://aphoto.vn/wp-content/uploads/2018/02/anh-dep-chup-va-blend-bang-dien-thoai-7.jpg',
  ];
  ngOnInit(): void {}
}
