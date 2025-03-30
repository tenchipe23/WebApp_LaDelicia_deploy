import { Injectable } from '@angular/core';
import {Observable, of, tap} from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { jwtDecode } from 'jwt-decode';
import {environment} from "../../../environments/environment";
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //Url de la api para realizar la autenticación de los usuarios
  private baseUrl = environment.authServiceUrl;
  //  private apiUrl = 'https://6236-189-161-134-145.ngrok-free.app';

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: { username?: string; email?: string; password: string }): Observable<any> {
    console.log('Llamada al servicio de autenticación:', credentials);
    return this.http.post(`${this.baseUrl}/login/user`, credentials, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      tap(response => console.log('Respuesta del servidor:', response),
        (error) => console.error('Error en el login:', error))
    );
  }


  handleLoginResponse(response: any): void {
    console.log('Ejecutando handleLoginResponse:', response);

    if (response.token) {
      sessionStorage.setItem('authToken', response.token);

      try {
        const decodedToken: any = jwtDecode(response.token);
        const userRole = decodedToken.role;

        if (!userRole) {
          console.error('El rol no está presente en el token.');
          return;
        }

        sessionStorage.setItem('userRole', userRole);

        console.log('Token guardado:', sessionStorage.getItem('authToken'));
        console.log('Rol guardado:', sessionStorage.getItem('userRole'));

        if (userRole === 'admin') {
          this.router.navigate(['control-panel/clients']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }


  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('authToken');
  }

  getUserRole(): string | null {
    return sessionStorage.getItem('userRole');
  }

  hasRole(requiredRole: string): boolean {
    return this.getUserRole() === requiredRole;
  }

  logout(): void {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return sessionStorage.getItem('authToken');
  }

}
