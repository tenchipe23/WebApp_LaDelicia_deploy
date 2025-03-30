import { NgForOf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-oven-table',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './oven-table.component.html',
  styleUrl: './oven-table.component.css'
})
export class OvenTableComponent {
 @Input() products: any[] = [];
 @Output() cookProduct = new EventEmitter<string>(); // Emite el ID del producto
//  @Output() deleteProduct = new EventEmitter<number>(); // Emite el ID del producto (number)


  onCook(productId: string): void {
    this.cookProduct.emit(productId); // Emite el _ID del producto seleccionado
  }

  //FUNCION PARA ELIMINAR PRODUCTO DESDE LA API DE ARDUINO
  // onDelete(productId: number): void {
  //   this.deleteProduct.emit(productId); // Emite el ID del producto
  // }
}
