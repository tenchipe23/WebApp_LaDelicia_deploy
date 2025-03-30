import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private secondaryApiUrl = environment.arduinoServiceUrl;
  private secondaryApiUrlAux = environment.arduinoServiceUrlAux;

  constructor(private http: HttpClient) {}

  // Enviar un nuevo pan a la API secundaria (retorna el ID generado)
  createBread(breadData: any): Observable<any> {
    return this.http.post(`${this.secondaryApiUrl}/create`, breadData)
      .pipe(
        map((response: any) => {
          if (response?._id) {
            console.log('Nuevo pan creado con ID:', response._id);
            return response;
          }
          throw new Error('No se recibió un ID del servidor.');
        }),
        catchError(this.handleError)
      );
  }

  // Modificar el tiempo de horneado (requiere ID generado previamente)
  updateBakingTime(id: string, bakingTime: number): Observable<any> {
    if (!id) {
      return throwError(() => new Error('ID no válido.'));
    }
    return this.http.patch(`${this.secondaryApiUrl}/update/baking-time/${id}`, { bakingTime })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener pan por ID
  getBreadById(id: string): Observable<any> {
    if (!id) {
      return throwError(() => new Error('ID no válido.'));
    }
    return this.http.get(`${this.secondaryApiUrl}/get/${id}`)
      .pipe(
        map(response => response || {}), // Evitar devolver undefined
        catchError(this.handleError)
      );
  }

  // Obtener solo el tiempo de horneado
  getBakingTime(id: string): Observable<any> {
    if (!id) {
      return throwError(() => new Error('ID no válido.'));
    }
    return this.http.get(`${this.secondaryApiUrl}/get/baking-time/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener pan por nombre
  getBreadByName(name: string): Observable<any> {
    return this.http.get(`${this.secondaryApiUrl}/get/name/${name}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener todos los productos de pan
  getAllBreads(): Observable<any> {
    return this.http.get(`${this.secondaryApiUrl}/all`)
      .pipe(
        map(response => response || []), // Evitar devolver undefined
        catchError(this.handleError)
      );
  }

  // Eliminar pan por ID
deleteBread(id: string): Observable<any> {
    if (!id) {
      return throwError(() => new Error('ID no válido.'));
    }
    return this.http.delete(`${this.secondaryApiUrl}/delete/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  

 

  // Buscar panes con filtros
  searchBreads(query: string): Observable<any> {
    const params = new HttpParams().set('query', query);
    return this.http.get(`${this.secondaryApiUrl}/search`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Método para manejar errores
  private handleError(error: HttpErrorResponse) {
    console.error('Error en la API secundaria:', error);
    return throwError(() => new Error('Hubo un problema con la solicitud, inténtalo de nuevo más tarde.'));
  }
  
  startBaking(id_bread: string): Observable<any> {
    return this.http.post(`${this.secondaryApiUrlAux}/start-baking`, { id_bread });
  }
  
}
