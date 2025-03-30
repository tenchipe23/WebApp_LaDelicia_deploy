import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'login', loadComponent: () => import('./features/login/login/login.component').then(m => m.LoginComponent) },
  { path: 'about', loadComponent: () => import('./features/about/about-us/about-us.component').then(m => m.AboutUsComponent) },
  { path: 'contact', loadComponent: () => import('./features/contact_us/contactus/contactus.component').then(m => m.ContactusComponent) },
  { path: 'products', loadComponent: () => import('./features/products/products/products.component').then(m => m.ProductsComponent) },
  { path: 'forgot-password', loadComponent: () => import('./shared/forgotPassword/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  // Rutas Hijas del Panel de Control
  {
    path: 'control-panel',
    canActivate: [authGuard], // Protección para toda la sección
    data: { role: 'admin' }, // Restricción por rol
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'clients', loadComponent: () => import('./features/controlPanel/clientsPanel/clients/clients.component').then(m => m.ClientsComponent), canActivate: [authGuard], data: { role: 'admin' } },
      { path: 'employees', loadComponent: () => import('./features/controlPanel/employeesPanel/employees/employees.component').then(m => m.EmployeesComponent), canActivate: [authGuard], data: { role: 'admin' } },
      { path: 'product-panel', loadComponent: () => import('./features/controlPanel/productsPanel/products-panel/products-panel.component').then(m => m.ProductsPanelComponent), canActivate: [authGuard], data: { role: 'admin' } },
      { path: 'users', loadComponent: () => import('./features/controlPanel/usersPanel/users/users.component').then(m => m.UsersComponent), canActivate: [authGuard], data: { role: 'admin' } },
      {
        path: 'cooking-timer',
        loadComponent: () => import('./features/controlPanel/horno/horno.component').then(m => m.HornoComponent),
        canActivate: [authGuard],
        data: { role: 'admin' }
      }
    ]
  },

  { path: '**', redirectTo: 'dashboard' },
];
