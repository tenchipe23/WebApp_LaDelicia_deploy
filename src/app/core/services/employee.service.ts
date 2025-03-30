import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {AuthService} from "./auth.service";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = environment.employeeServiceUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // Obtiene el token del servicio de autenticación
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  getEmployees(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get/employees`, { headers: this.getAuthHeaders() });
  }

  createEmployee(employeeData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create/employee`, employeeData, { headers: this.getAuthHeaders() });
  }

  updateEmployee(id: string, employeeData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/employee/${id}`, employeeData, { headers: this.getAuthHeaders() });
  }

  deleteEmployee(id: number): Observable<any> {
    // Debe apuntar a /api/employees/delete/employees/:id
    return this.http.delete<any>(`${this.baseUrl}/delete/employees/${id}`, { headers: this.getAuthHeaders() });
  }

}
