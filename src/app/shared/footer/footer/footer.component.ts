import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  footerItems = [
    { label: 'Inicio', link: '/dashboard' },
    { label: 'Productos', link: '/products' },
    { label: 'Acerca de', link: '/about' },
    { label: 'Contáctanos', link: '/contact' },
  ];
  contactDetails =[
    { icon: 'fas fa-home', text: 'Calle 6 Av 1 Cuitlahuac Ver.' },
    { icon: 'fas fa-envelope', text: 'Email: Nayro13@gmail.com' },
    { icon: 'fas fa-phone', text: 'Num. de Tel: +51-271-729-0306' },
    { icon: 'fas fa-print', text: 'Num. de Tel: +51-274-111-9206' }
  ];

  socialLinks = [
    { platform: 'Facebook', link: 'https://www.facebook.com', iconClass: 'bi2 bi-facebook' },
    { platform: 'Instagram', link: 'https://www.instagram.com', iconClass: 'bi2 bi-instagram' }
  ];

}
