import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../interfaces/order.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private urlBackEnd = `${environment.urlBackEnd}/v1/api/orders`;

  constructor() {}

  findAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.urlBackEnd);
  }

  findById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.urlBackEnd}/${id}`);
  }

  findByEstado(estado: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.urlBackEnd}/status/${estado}`); 
  }

  save(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.urlBackEnd}/save`, order);
  }

  update(order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.urlBackEnd}/update`, order);
  }

  deleteLogico(id: number): Observable<string> {
    return this.http.delete<string>(`${this.urlBackEnd}/delete-logico/${id}`, {
      responseType: 'text' as 'json',
    });
  }

  deleteFisico(id: number): Observable<string> {
    return this.http.delete(`${this.urlBackEnd}/delete-fisico/${id}`, {
      responseType: 'text',
    });
  }

  restore(id: number): Observable<string> {
    return this.http.put(`${this.urlBackEnd}/restore/${id}`, null, {
      responseType: 'text',
    });
  }

  generateOrderReport(orderId: number): Observable<Blob> {
    return this.http.get(`${this.urlBackEnd}/report/${orderId}`, {
      responseType: 'blob', 
    });
  }
}