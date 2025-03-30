import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeTableComponent } from "../../../../shared/tables/employee-table/employee-table.component";
import { MenuComponent } from "../../../../shared/menu/menu/menu.component";
import { FooterComponent } from "../../../../shared/footer/footer/footer.component";
import {NgIf} from "@angular/common";
import {ToastrService} from "ngx-toastr";
import { Modal } from "bootstrap";
import {EmployeeService} from "../../../../core/services/employee.service";
import {SidebarPanelComponent} from "../../../../shared/sidebar-panel/sidebar-panel.component";
import {CopyrightComponent} from "../../../../shared/copyright/copyright.component";

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    EmployeeTableComponent,
    MenuComponent,
    FooterComponent,
    ReactiveFormsModule,
    NgIf,
    SidebarPanelComponent,
    CopyrightComponent
  ],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  employees: any[] = [];
  employeeForm!: FormGroup;
  selectedEmployee: any = null;
  employeeIdToDelete: number | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadEmployees();
  }

  initializeForm(): void {
    this.employeeForm = this.fb.group({
      name_employee: ['', [ Validators.required, Validators.minLength(2), Validators.maxLength(50),
        Validators.pattern('^[a-zA-Zà-ÿÀ-Ÿ\\s.-]{2,50}$') ]],
      middle_name: ['', [ Validators.required, Validators.minLength(2), Validators.maxLength(50),
        Validators.pattern('^[a-zA-Zà-ÿÀ-Ÿ\\s.-]{2,50}$') ]],
      last_name: ['', [  ]],
      street_address: ['', [  ]],
      city_address: ['', [  ]],
      postal_code: ['', [  ]],
      cellphone_number: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        console.log("Datos obtenidos de la API:", data);

        if (Array.isArray(data)) {
          this.employees = data.map(emp => ({
            id: emp.id,
            name_employee: emp.name_employee,
            middle_name: emp.middle_name,
            last_name: emp.last_name,
            street_address: emp.street_address,
            city_address: emp.city_address,
            postal_code: emp.postal_code,
            cellphone_number: emp.cellphone_number
          }));
        } else {
          console.error("La API devolvió un formato inesperado", data);
          this.toastr.error("Error al procesar la lista de empleados");
        }
      },
      error: (error) => {
        this.toastr.error('Error al obtener los empleados', 'Error');
        console.error('Error al obtener empleados:', error);
      }
    });
  }

  addEmployee(): void {
    if (this.employeeForm.invalid) {
      this.toastr.warning('Por favor, complete todos los campos correctamente.', 'Advertencia');
      return;
    }

    this.employeeService.createEmployee(this.employeeForm.value).subscribe({
      next: () => {
        this.toastr.success('Empleado agregado exitosamente', 'Éxito');
        this.employeeForm.reset();
        this.loadEmployees();
      },
      error: (error) => {
        this.toastr.error('Error al agregar empleado', 'Error');
        console.error('Error en agregar empleado:', error);
      }
    });
  }

  editEmployee(employeeId: number): void {
    // Buscamos el empleado en el arreglo
    const emp = this.employees.find(e => e.id === employeeId);
    if (!emp) return;
    this.selectedEmployee = emp;

    this.employeeForm.patchValue({
      name_employee: emp.name_employee,
      middle_name: emp.middle_name,
      last_name: emp.last_name,
      street_address: emp.street_address,
      city_address: emp.city_address,
      postal_code: emp.postal_code,
      cellphone_number: emp.cellphone_number
    });
  }

  updateEmployee(): void {
    if (!this.selectedEmployee) return;
    if (this.employeeForm.invalid) return;

    // Datos del formulario
    const updatedData = this.employeeForm.value;

    // Llamada al servicio para editar
    this.employeeService.updateEmployee(this.selectedEmployee.id, updatedData).subscribe({
      next: () => {
        // Una vez actualizado, limpiamos
        this.selectedEmployee = null;
        this.employeeForm.reset();
        // Recargamos la lista
        this.loadEmployees();
      },
      error: (err) => {
        console.error('Error al actualizar empleado', err);
      }
    });
  }

  // Cancelar la edición y volver a modo “agregar”
  cancelEdit(): void {
    this.selectedEmployee = null;
    this.employeeForm.reset();
  }

  confirmDelete(employeeId: number): void {
    this.employeeIdToDelete = employeeId;
    const modalElement = document.getElementById('deleteEmployeeModal');
    if (modalElement) {
      const modalBootstrap = Modal.getOrCreateInstance(modalElement);
      modalBootstrap.show();
    }
  }


  deleteEmployee(): void {
    if (!this.employeeIdToDelete) return;

    this.employeeService.deleteEmployee(this.employeeIdToDelete).subscribe({
      next: () => {
        // Cierra el modal
        const modalElement = document.getElementById('deleteEmployeeModal');
        if (modalElement) {
          const modalBootstrap = Modal.getInstance(modalElement);
          if (modalBootstrap) {
            modalBootstrap.hide();
          }
        }

        // Limpia la variable y recarga la lista
        this.employeeIdToDelete = null;
        this.loadEmployees();
      },
      error: (err) => {
        console.error('Error al eliminar empleado', err);
      }
    });
  }


}
