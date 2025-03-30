import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Modal } from 'bootstrap';
import { UserService } from "../../../../core/services/user.service";
import {FooterComponent} from "../../../../shared/footer/footer/footer.component";
import {MenuComponent} from "../../../../shared/menu/menu/menu.component";
import {UserTableComponent} from "../../../../shared/tables/user-table/user-table.component";
import {NgIf} from "@angular/common";
import {NavbarComponent} from "../../../../shared/navbar/navbar/navbar.component";
import {CopyrightComponent} from "../../../../shared/copyright/copyright.component";
import {SidebarPanelComponent} from "../../../../shared/sidebar-panel/sidebar-panel.component";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  imports: [
    FooterComponent,
    MenuComponent,
    UserTableComponent,
    NgIf,
    ReactiveFormsModule,
    NavbarComponent,
    CopyrightComponent,
    SidebarPanelComponent
  ],
  standalone: true
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  userForm!: FormGroup;
  selectedUser: any = null;
  userIdToDelete: number | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadUsers();
  }

  initializeForm(): void {
    this.userForm = this.fb.group({
      name: ['', [ Validators.required, Validators.minLength(2), Validators.maxLength(50),
        Validators.pattern('^[a-zA-Zà-ÿÀ-Ÿ\\s.-]{2,50}$') ]],
      first_surname: ['', [ Validators.required, Validators.minLength(2), Validators.maxLength(50),
        Validators.pattern('^[a-zA-Zà-ÿÀ-Ÿ\\s.-]{2,50}$') ]],
      last_surname: ['', [ Validators.minLength(2), Validators.maxLength(50),
        Validators.pattern('^[a-zA-Zà-ÿÀ-Ÿ\\s.-]{2,50}$') ]],
      phone_number: ['', [ Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]+$') ]],
      email: ['', [ Validators.required, Validators.email, Validators.minLength(10), Validators.maxLength(60),
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
         ]],
      username: ['', [ Validators.required, Validators.minLength(1), Validators.maxLength(30),
        Validators.pattern('^[a-zA-Z0-9._@#-]{3,32}$') ]],
      password: ['',[ Validators.required, Validators.minLength(6), Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z0-9._@#-]{6,10}$') ]]
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (res) => {
        const dataArr: any[] = res.data || [];
        const all = dataArr.map((item: any) => {
          const userObj: any = item.user || {};
          const authObj: any = item.auth || {};
          return {
            id: userObj.id,
            name: userObj.name,
            first_surname: userObj.first_surname,
            last_surname: userObj.last_surname,
            phone_number: userObj.phone_number,
            email: authObj.email,
            username: authObj.username,
            password: '' // no se pasa la contraseña real
          };
        });

        this.users = all;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.users = [];
      }
    });
  }

  addUser(): void {
    if (this.userForm.invalid) return;

    const formData = this.userForm.value;
    this.userService.createUser(formData).subscribe({
      next: () => {
        this.userForm.reset();
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
      }
    });
  }

  editUser(userData: any): void {
    this.selectedUser = userData;
    this.userForm.patchValue({
      name: userData.name,
      first_surname: userData.first_surname,
      last_surname: userData.last_surname,
      phone_number: userData.phone_number,
      email: userData.email,
      username: userData.username,
      password: '' // no se pasa la real
    });
  }

  updateUser(): void {
    if (!this.selectedUser) return;
    if (this.userForm.invalid) return;

    const updatedData = this.userForm.value;
    this.userService.updateUser(this.selectedUser.id, updatedData).subscribe({
      next: () => {
        this.selectedUser = null;
        this.userForm.reset();
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error al actualizar usuario:', err);
      }
    });
  }

  confirmDelete(userId: number): void {
    this.userIdToDelete = userId;
    const modalElement = document.getElementById('deleteUserModal');
    if (modalElement) {
      const modalBootstrap = Modal.getOrCreateInstance(modalElement);
      modalBootstrap.show();
    }
  }

  deleteUser(): void {
    if (!this.userIdToDelete) return;

    this.userService.deleteUser(this.userIdToDelete).subscribe({
      next: () => {
        const modalElement = document.getElementById('deleteUserModal');
        if (modalElement) {
          const modalBootstrap = Modal.getInstance(modalElement);
          if (modalBootstrap) {
            modalBootstrap.hide();
          }
        }
        this.userIdToDelete = null;
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error al eliminar usuario:', err);
      }
    });
  }

  cancelEdit(): void {
    this.selectedUser = null;
    this.userForm.reset();
  }
}
