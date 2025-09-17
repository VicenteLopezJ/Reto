import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../interfaces/cliente';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private http = inject(HttpClient);
  private urlBackEnd = `${environment.urlBackEnd}/v1/api/clientes`;

  constructor() {}

  findAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.urlBackEnd);
  }

  findById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlBackEnd}/${id}`);
  }

  findByEstado(estado: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.urlBackEnd}/estado/${estado}`);
  }

  save(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.urlBackEnd}/save`, cliente);
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.urlBackEnd}/update`, cliente);
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

  reportPdf() {
    return this.http.get(`${this.urlBackEnd}/pdf`, { responseType: 'blob' });
  }
}
