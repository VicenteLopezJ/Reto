import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../interfaces/producto';
import { environment } from '../../../environments/environment';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProductoService {

  constructor() { }

  private http = inject(HttpClient);
  private urlBackEnd = `${environment.urlBackEnd}/v1/api/products`;

  findAll(): Observable<Producto[]> { // Añadir tipo de retorno
    return this.http.get<Producto[]>(this.urlBackEnd);
  }

  // NUEVO MÉTODO: findById
  findById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.urlBackEnd}/${id}`);
  }

  save(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(`${this.urlBackEnd}/save`, producto);
  }

  update(producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.urlBackEnd}/update`, producto);
  }

  deleteLogico(id: number): Observable<string> { //  Añadir tipo de retorno
    return this.http.put(`${this.urlBackEnd}/delete-logico/${id}`, {}, { responseType: 'text' });
  }

  reportPdf() {
    return this.http.get(`${this.urlBackEnd}/pdf`, { responseType: 'blob' });
  }

}