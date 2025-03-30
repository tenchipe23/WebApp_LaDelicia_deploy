import {Component, Input, Output, EventEmitter} from '@angular/core';
import {CurrencyPipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './employee-table.component.html',
  styleUrl: './employee-table.component.css'
})
export class EmployeeTableComponent {

  @Input() employees: any[] = []; // Lista de empleados
  @Output() editEmployeeEvent = new EventEmitter<number>();
  @Output() deleteEmployeeEvent = new EventEmitter<number>();


  abrirModal(employeeId: number) {
    // Emite el ID para edición
    this.editEmployeeEvent.emit(employeeId);
  }

  abrirModalEliminar(employeeId: number): void {
    this.deleteEmployeeEvent.emit(employeeId);
  }

}
