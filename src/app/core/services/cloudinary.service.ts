import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  
  private baseUrl = environment.productServiceUrl;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any> {
    const token = sessionStorage.getItem('authToken'); // Recuperar el token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.baseUrl}/get/products`, { headers });
  }

  createProduct(product: any, image: File): Observable<any> {
    const token = sessionStorage.getItem('authToken'); // Recuperar el token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const formData = new FormData();
    formData.append('name_product', product.name_product);
    formData.append('price_product', product.price_product);
    formData.append('categoryid', product.categoryid);
    formData.append('stock', product.stock);
    formData.append('ingredients', product.ingredients);
    formData.append('baking_time', product.baking_time);
    formData.append('image', image);

    return this.http.post(`${this.baseUrl}/create/product`, formData, { headers })
      .pipe(
        catchError(error => {
          console.error('Error al crear producto:', error);
          return throwError(error);
        })
      );
  }

  deleteProduct(productId: string): Observable<any> {
    const token = sessionStorage.getItem('authToken'); // Recuperar el token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete(`${this.baseUrl}/delete/product/${productId}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error al eliminar producto:', error);
          return throwError(error);
        })
      );
  }

  updateProduct(product: any): Observable<any> {
    const token = sessionStorage.getItem('authToken'); // Recuperar el token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const formData = new FormData();
    formData.append('name_product', product.name_product);
    formData.append('price_product', product.price_product);
    formData.append('categoryid', product.categoryid);
    formData.append('stock', product.stock);
    formData.append('ingredients', product.ingredients);
    formData.append('baking_time', product.baking_time);
    if (product.image) {
      formData.append('image', product.image);
    }

    return this.http.put(`${this.baseUrl}/update/product/${product.id}`, formData, { headers })
      .pipe(
        catchError(error => {
          console.error('Error al actualizar producto:', error);
          return throwError(error);
        })
      );
  }




  
}
