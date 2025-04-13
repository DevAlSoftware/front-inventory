import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const base_url = "http://localhost:8080/api/v1";

@Injectable({
  providedIn: 'root'
})
export class SaleDetailService {

  constructor(private http: HttpClient) { }

  /**
   * Obtener todos los detalles de ventas
   */
  getSaleDetails() {
    const endpoint = `${base_url}/sales-detail`;
    return this.http.get(endpoint);
  }

  /**
   * Obtener detalle de venta por ID
   */
  getSaleDetailById(id: number) {
    const endpoint = `${base_url}/sales-detail/${id}`;
    return this.http.get(endpoint);
  }

  /**
   * Crear un nuevo detalle de venta
   */
  createSaleDetail(saleDetail: any) {
    const endpoint = `${base_url}/sales-detail`;
    return this.http.post(endpoint, saleDetail);
  }

  /**
   * Actualizar un detalle de venta
   */
  updateSaleDetail(id: number, saleDetail: any) {
    const endpoint = `${base_url}/sales-detail/${id}`;
    return this.http.put(endpoint, saleDetail);
  }

  /**
   * Eliminar un detalle de venta
   */
  deleteSaleDetail(id: number) {
    const endpoint = `${base_url}/sales-detail/${id}`;
    return this.http.delete(endpoint);
  }

  getDetailsBySaleId(saleId: number) {
    return this.http.get(`${base_url}/sales-detail/sale/${saleId}`);
  }
}
