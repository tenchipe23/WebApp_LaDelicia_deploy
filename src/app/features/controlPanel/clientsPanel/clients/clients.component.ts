import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Modal } from 'bootstrap';
import { ClientService } from "../../../../core/services/client.service";
import {ClientTableComponent} from "../../../../shared/tables/client-table/client-table.component";
import {FooterComponent} from "../../../../shared/footer/footer/footer.component";
import {NavbarComponent} from "../../../../shared/navbar/navbar/navbar.component";
import {NgIf} from "@angular/common";
import {MenuComponent} from "../../../../shared/menu/menu/menu.component";
import {CopyrightComponent} from "../../../../shared/copyright/copyright.component";
import {SidebarPanelComponent} from "../../../../shared/sidebar-panel/sidebar-panel.component";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  imports: [
    ClientTableComponent,
    FooterComponent,
    NavbarComponent,
    NgIf,
    ReactiveFormsModule,
    MenuComponent,
    CopyrightComponent,
    SidebarPanelComponent
  ],
  standalone: true
})
export class ClientsComponent implements OnInit {
  clients: any[] = [];
  clientForm!: FormGroup;
  selectedClient: any = null;
  clientIdToDelete: number | null = null;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadClients();
  }

  initializeForm(): void {
    this.clientForm = this.fb.group({
      name: ['', [ Validators.required, Validators.minLength(2), Validators.maxLength(50),
        Validators.pattern('^[a-zA-Zà-ÿÀ-Ÿ\\s.-]{2,50}$') ]],
      first_surname: ['', [ Validators.required, Validators.minLength(2), Validators.maxLength(50),
        Validators.pattern('^[a-zA-Zà-ÿÀ-Ÿ\\s.-]{2,50}$') ]],
      last_surname: ['', [ Validators.minLength(2), Validators.maxLength(50),
        Validators.pattern('^[a-zA-Zà-ÿÀ-Ÿ\\s.-]{2,50}$') ]],
      phone_number: ['', [ Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]+$') ]],
      email: ['', [ Validators.required, Validators.email, Validators.minLength(10), Validators.maxLength(60),
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$') ]],
      username: ['',[ Validators.required, Validators.minLength(1), Validators.maxLength(30),
        Validators.pattern('^[a-zA-Z0-9._@#-]{3,32}$') ]],
      password: ['',[ Validators.required, Validators.minLength(6), Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z0-9._@#-]{6,10}$') ]],
      city: ['', [ Validators.required, Validators.minLength(2), Validators.maxLength(100),
        Validators.pattern('^[a-zA-Zà-ÿÀ-Ÿ\\s.-]{2,50}$') ]],
      date_of_birth: ['', [ Validators.required,
        Validators.pattern('^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$') ]],
      postal_code: ['', [ Validators.required,
        Validators.pattern('^[1-9]\\d{4}$') ]],
      id_preferred_payment_method: [1]
    });
  }

  loadClients(): void {
    this.clientService.getClients().subscribe({
      next: (res) => {
        const dataArr: any[] = res.data || [];
        const all = dataArr.map((item: any) => {
          const userObj: any = item.user || {};
          const authObj: any = item.auth || {};
          const clientObj: any = item.client || {};
          return {
            id: userObj.id,
            name: userObj.name,
            first_surname: userObj.first_surname,
            last_surname: userObj.last_surname,
            phone_number: userObj.phone_number,
            email: authObj.email,
            username: authObj.username,
            password: '',
            city: clientObj.city,
            date_of_birth: clientObj.date_of_birth,
            postal_code: clientObj.postal_code,
            id_preferred_payment_method: clientObj.id_preferred_payment_method
          };
        });
        this.clients = all.filter((c: any) => c.role !== 'admin');
      },
      error: (err) => console.error('Error al cargar clientes:', err)
    });
  }

  addClient(): void {
    if (this.clientForm.invalid) return;
    const formData = this.clientForm.value;

    this.clientService.createClient(formData).subscribe({
      next: () => {
        this.clientForm.reset();
        this.loadClients();
      },
      error: (err) => console.error('Error al agregar cliente:', err)
    });
  }

  editClient(clientData: any): void {
    this.selectedClient = clientData;
    this.clientForm.patchValue({
      name: clientData.name,
      first_surname: clientData.first_surname,
      last_surname: clientData.last_surname,
      phone_number: clientData.phone_number,
      email: clientData.email,
      username: clientData.username,
      password: '',
      city: clientData.city,
      date_of_birth: clientData.date_of_birth,
      postal_code: clientData.postal_code,
      id_preferred_payment_method: clientData.id_preferred_payment_method
    });
  }

  updateClient(): void {
    if (!this.selectedClient) return;
    if (this.clientForm.invalid) return;

    const updatedData = this.clientForm.value;
    this.clientService.updateClient(this.selectedClient.id, updatedData).subscribe({
      next: () => {
        this.selectedClient = null;
        this.clientForm.reset();
        this.loadClients();
      },
      error: (err) => console.error('Error al actualizar cliente:', err)
    });
  }

  confirmDelete(clientId: number): void {
    this.clientIdToDelete = clientId;
    const modalEl = document.getElementById('deleteClientModal');
    if (modalEl) {
      const modalBootstrap = Modal.getOrCreateInstance(modalEl);
      modalBootstrap.show();
    }
  }

  deleteClient(): void {
    if (!this.clientIdToDelete) return;

    this.clientService.deleteClient(this.clientIdToDelete).subscribe({
      next: () => {
        const modalEl = document.getElementById('deleteClientModal');
        if (modalEl) {
          const modalBootstrap = Modal.getInstance(modalEl);
          if (modalBootstrap) {
            modalBootstrap.hide();
          }
        }
        this.clientIdToDelete = null;
        this.loadClients();
      },
      error: (err) => console.error('Error al eliminar cliente:', err)
    });
  }

  cancelEdit(): void {
    this.selectedClient = null;
    this.clientForm.reset();
  }
}
