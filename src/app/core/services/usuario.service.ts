import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private urlBackEnd = `${environment.urlBackEnd}/v1/api/usuarios`;

  constructor() {}

  findAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.urlBackEnd);
  }

  findById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.urlBackEnd}/${id}`);
  }

  save(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.urlBackEnd}/save`, usuario);
  }

  update(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.urlBackEnd}/update`, usuario);
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.urlBackEnd}/delete-logico/${id}`, {
      responseType: 'text',
    });
  }

  deletePermanente(id: number): Observable<string> {
    return this.http.delete(`${this.urlBackEnd}/delete-fisico/${id}`, {
      responseType: 'text',
    });
  }

  findByEstado(estado: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.urlBackEnd}/estado/${estado}`);
  }

  restore(id: number): Observable<string> {
    return this.http.put(`${this.urlBackEnd}/restore/${id}`, {}, {
      responseType: 'text',
    });
  }

  registerSale(id: number, amount: number, quantity: number): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.urlBackEnd}/register-sale/${id}`, {
      saleAmount: amount, 
      quantity: quantity,
    });
  }
}