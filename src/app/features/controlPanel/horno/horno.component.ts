import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../shared/navbar/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer/footer.component';
import { OvenTableComponent } from '../../../shared/tables/oven-table/oven-table.component';
import { ProductService } from '../../../core/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { Modal } from "bootstrap";
import {CopyrightComponent} from "../../../shared/copyright/copyright.component";
import {SidebarPanelComponent} from "../../../shared/sidebar-panel/sidebar-panel.component";


@Component({
  selector: 'app-horno',
  standalone: true,
  imports: [CommonModule, OvenTableComponent, CopyrightComponent, SidebarPanelComponent],
  templateUrl: './horno.component.html',
  styleUrls: ['./horno.component.css']
})
export class HornoComponent implements OnInit {
  products: any[] = [];
  timerValue: string = '0:00';  // Valor que se muestra en el temporizador
  timer: any;
  seconds: number = 0;  // Almacena los segundos restantes
  isRunning: boolean = false;
  inputValue: string = ''; // Almacena el valor ingresado desde el teclado numérico
  initialTime: number = 0;  // Almacena el tiempo inicial en segundos para calcular el tiempo restante
  currentProductId: string = ''; // Almacena el ID del producto actualmente en el horno
  productIdToDelete: number | null = null;
  id_bread: string = '';


  constructor(
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllBreads().subscribe({
      next: (response) => {
        console.log('📢 Productos obtenidos de la API secundaria:', response);

        // Manejo de datos de respuesta de la API de forma más robusta
        if (response?.data && Array.isArray(response.data)) {
          this.products = response.data.map((bread: any) => ({
            id: bread._id,
            name_product: bread.name,
            ingredients: bread.ingredients,
            baking_time: bread.bakingTime,
          }));
        } else {
          console.error('❌ Error: La respuesta no contiene un array en data');
          this.toastr.error('No se pudieron cargar los productos.', 'Error');
        }
      },
      error: (error) => {
        console.error('❌ Error al obtener productos:', error);
        this.toastr.error('No se pudieron cargar los productos.', 'Error');
      },
    });
  }

  // Método para mostrar el tiempo formateado (minutos:segundos)
  getFormattedTime(): string {
    const minutes = Math.floor(this.seconds / 60);
    const secs = this.seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Método para ingresar números desde el teclado numérico
  enterDigit(num: string | number): void {
    const number = typeof num === 'string' ? parseInt(num, 10) : num;
    if (this.inputValue.length < 3) {
      this.inputValue += number.toString();
    }

    this.updateTimeFromInput();
  }

  // Función para eliminar el último dígito
  deleteLastDigit(): void {
    this.inputValue = this.inputValue.slice(0, -1);
    this.updateTimeFromInput();
  }

// Actualiza el tiempo desde el valor de input
private updateTimeFromInput(): void {
  const minutes = Number(this.inputValue);

  if (isNaN(minutes)) {
    return; // Si no es un número, no hacemos nada
  }

  if (minutes > 80) {
    this.toastr.warning('El tiempo máximo de horneado es de 80 minutos.', 'Advertencia');
    this.inputValue = '80'; // Establecemos el valor máximo permitido
    this.seconds = 80 * 60; // Asignamos el máximo permitido en segundos
  } else {
    this.seconds = minutes * 60;
  }

  this.initialTime = this.seconds;
  this.updateTimerDisplay();

  // Actualizar el tiempo en la API si hay un producto en el horno
  if (this.currentProductId) {
    this.productService.updateBakingTime(this.currentProductId, minutes).subscribe({
      next: (response) => {
        this.loadProducts();
        console.log('✅ Tiempo de horneado actualizado:', response);
        this.toastr.success('Tiempo de horneado actualizado con éxito.');
      },
      error: (error) => {
        console.error('❌ Error al actualizar el tiempo de horneado:', error);
        this.toastr.error('No se pudo actualizar el tiempo de horneado.', 'Error');
      }
    });
  }
}


  // Método para manejar el evento de cocinar
  onCook(bakingTime: number, productId: string): void {
    this.currentProductId = productId; // Guardamos el ID del producto que se está cocinando
    this.seconds = bakingTime * 60;
    this.initialTime = this.seconds;
    this.updateTimerDisplay();

  }

  onCookProduct(productId: string): void {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      this.onCook(product.baking_time, product.id);  // Inicia el temporizador con el tiempo de horneado del producto
    }
  }


  startTimer(): void {
    if (!this.isRunning && this.seconds > 0) {
      this.isRunning = true;
      this.timer = setInterval(() => {
        if (this.seconds > 0) {
          this.seconds--;
          this.updateTimerDisplay();

          if (this.seconds <= this.initialTime / 2) {
            this.timerValue = `<span style="color: yellow">${this.getFormattedTime()}</span>`;
          }
        } else {
          this.stopTimer();
        }
      }, 1000);
    }
  }


//Función para pausar
  stopTimer(): void {
    if (this.isRunning) {
      this.isRunning = false;
      clearInterval(this.timer);
    }
  }


  //funcion para reiniCIAR EL TIEMPO
  // resetTimer(): void {
  //   this.isRunning = false;
  //   clearInterval(this.timer);
  //   this.seconds = 0;
  //   this.inputValue = '';
  //   this.updateTimerDisplay();
  // }

  private updateTimerDisplay(): void {
    const minutes = Math.floor(this.seconds / 60);
    const secs = this.seconds % 60;
    this.timerValue = `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  getRedButtonClass(): string {
    return this.isRunning ? 'red-button opaque' : 'red-button';
  }

  getGreenButtonRgbClass(): string {
    return this.isRunning ? 'green-button-rgb active' : 'green-button-rgb';
  }

  getFinishedButtonClass(): string {
    return !this.isRunning && this.seconds === 0 ? 'green-button finish' : 'green-button';
  }


  confirmDelete(productId: number): void {
      this.productIdToDelete = productId;

      // Abre la modal (id="deleteModal") con la API de Bootstrap
      const modalElement = document.getElementById('deleteModal');
      if (modalElement) {
        const modalBootstrap = Modal.getOrCreateInstance(modalElement);
        modalBootstrap.show();
      }
    }

    deleteProduct(): void {
      if (!this.productIdToDelete) return;

      this.productService.deleteBread(this.productIdToDelete.toString()).subscribe({
        next: () => {
          // Cerrar modal
          const modalElement = document.getElementById('deleteModal');
          if (modalElement) {
            const modalBootstrap = Modal.getInstance(modalElement);
            if (modalBootstrap) {
              modalBootstrap.hide();
            }
          }
          // Limpia variable y recarga la lista
          this.productIdToDelete = null;
          this.loadProducts();
        },
        error: (err) => {
          console.error('Error al eliminar producto:', err);
          this.toastr.error('Error al eliminar producto', 'Error');
        }
      });
    }

    startBaking(): void {
      if (this.isRunning) {
        this.toastr.warning('No se puede iniciar otro horneado hasta que termine el temporizador en curso.', 'Por favor espere.');
        return;
      }

      const product = this.products.find(p => p.id);
      if (!product) {
        this.toastr.error('No se encontró un producto para hornear.', 'Error');
        return;
      }

      this.productService.startBaking(product.id).subscribe(
        response => {
          console.log('Respuesta del servidor:', response);
          this.toastr.success('Horneado iniciado con éxito.');

          this.startTimer();
        },
        error => {
          console.error('Error en la API:', error);
          this.toastr.error('Hubo un error al iniciar el horneado.', 'Error');
        }
      );
    }

}
