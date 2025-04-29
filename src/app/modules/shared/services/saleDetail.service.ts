import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class SaleDetailService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  /**
   * Obtener todos los detalles de ventas
   */
  getSaleDetails() {
    const endpoint = `${this.baseUrl}/sales-detail`;
    return this.http.get(endpoint);
  }

  /**
   * Obtener detalle de venta por ID
   */
  getSaleDetailById(id: number) {
    const endpoint = `${this.baseUrl}/sales-detail/${id}`;
    return this.http.get(endpoint);
  }

  /**
   * Crear un nuevo detalle de venta
   */
  createSaleDetail(saleDetail: any) {
    const endpoint = `${this.baseUrl}/sales-detail`;
    return this.http.post(endpoint, saleDetail);
  }

  /**
   * Actualizar un detalle de venta
   */
  updateSaleDetail(id: number, saleDetail: any) {
    const endpoint = `${this.baseUrl}/sales-detail/${id}`;
    return this.http.put(endpoint, saleDetail);
  }

  /**
   * Eliminar un detalle de venta
   */
  deleteSaleDetail(id: number) {
    const endpoint = `${this.baseUrl}/sales-detail/${id}`;
    return this.http.delete(endpoint);
  }

  getDetailsBySaleId(saleId: number) {
    return this.http.get(`${this.baseUrl}/sales-detail/sale/${saleId}`);
  }
}
