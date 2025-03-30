import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  navItems = [
    { label: 'Inicio', link: '/dashboard', active: true },
    { label: 'Productos', link: '/products', active: false },
    { label: 'Nosotros', link: '/about', active: false },
    { label: 'Contacto', link: '/contact', active: false },
    { label: 'Iniciar Sesión', link: '/login', active: false }

  ];
}
