import {CanActivateFn, Router} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const userRole = authService.getUserRole();
  console.log('Intentando acceder con rol:', userRole);

  if (authService.isAuthenticated()) {
    const requiredRole = route.data?.['role'];

    if (!requiredRole || userRole === 'admin' || userRole === requiredRole) {
      return true;
    }
    toastr.warning('Acceso denegado: rol insuficiente', 'Aviso');
    router.navigate(['/dashboard']);
    return false;
  }

  toastr.error('Acceso denegado: usuario no autenticado', 'Error');
  router.navigate(['/dashboard']);
  return false;
};
