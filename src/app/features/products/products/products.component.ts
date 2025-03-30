import {Component, inject, OnInit} from '@angular/core';
import { NavbarComponent } from "../../../shared/navbar/navbar/navbar.component";
import { FooterComponent } from "../../../shared/footer/footer/footer.component";
import { CloudinaryService } from "../../../core/services/cloudinary.service";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, NgForOf, NgIf],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit{
  products: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private productService: CloudinaryService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data.map((product: any) => ({
          id: product.id,
          name: product.name_product,
          price: product.price_product,
          image: product.image || '../assets/images/pan_integral.png'
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al recuperar productos:', error);
        this.errorMessage = error.error?.message || 'Error al cargar productos.';
        this.isLoading = false;
      }
    });
  }

  }
