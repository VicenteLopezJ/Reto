import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SupplierProduct } from '../interfaces/supplier-product';
import { environment } from '../../../environments/environment';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupplierProductService {

  constructor() { }

  private http = inject(HttpClient);
  private urlBackEnd = `${environment.urlBackEnd}/v1/api/supplier_product`;

  findAll(): Observable<SupplierProduct[]> {
    return this.http.get<SupplierProduct[]>(this.urlBackEnd);
  }

  save(supplierProduct: SupplierProduct): Observable<SupplierProduct> {
    return this.http.post<SupplierProduct>(`${this.urlBackEnd}/save`, supplierProduct);
  }

  update(supplierProduct: SupplierProduct): Observable<SupplierProduct> {
    return this.http.put<SupplierProduct>(`${this.urlBackEnd}/update`, supplierProduct);
  }

  deleteLogico(id: number): Observable<string> {
    return this.http.put(`${this.urlBackEnd}/delete-logico/${id}`, {}, { responseType: 'text' });
  }

  restore(id: number): Observable<string> {
    return this.http.put(`${this.urlBackEnd}/restore/${id}`, {}, { responseType: 'text' });
  }

  generateReportBySupplier(id: number): Observable<Blob> {
    return this.http.get(`${this.urlBackEnd}/pdf/${id}`, { responseType: 'blob' });
  }
}
