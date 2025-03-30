import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe, NgForOf } from "@angular/common";

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgForOf
  ],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.css'
})
export class ProductTableComponent {

  @Input() products: any[] = [];
  @Output() deleteProduct = new EventEmitter<number>(); // Emite el ID del producto (number)
  @Output() updateProduct = new EventEmitter<number>(); // Emite el ID del producto (number)
  @Output() cookProduct = new EventEmitter<number>(); // Nuevo evento


  onDelete(productId: number): void {
    this.deleteProduct.emit(productId); // Emite el ID del producto
  }

  onUpdate(productId: number): void {
    this.updateProduct.emit(productId); // Emite el ID del producto
  }
}