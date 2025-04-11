import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const base_url = "http://localhost:8080/api/v1";

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(private http: HttpClient) { }

  /**
   * Obtener todas las ventas
   */
  getSales() {
    const endpoint = `${base_url}/sales`;
    return this.http.get(endpoint);
  }

  /**
   * Registrar una nueva venta
   */
  saveSale(body: any) {
    const endpoint = `${base_url}/sales`;
    return this.http.post(endpoint, body);
  }

  /**
   * Eliminar una venta
   */
  deleteSale(id: any) {
    const endpoint = `${base_url}/sales/${id}`;
    return this.http.delete(endpoint);
  }

  /**
   * Buscar ventas por nombre de cliente
   */
  getSalesByCustomer(name: string) {
    const endpoint = `${base_url}/sales/filter/${name}`;
    return this.http.get(endpoint);
  }

  /**
   * Exportar ventas a Excel
   */
  exportSales() {
    const endpoint = `${base_url}/sales/export/excel`;
    return this.http.get(endpoint, {
      responseType: 'blob'
    });
  }

  /**
   * Obtener productos disponibles (por si necesitas mostrar productos para agregar en saleDetails)
   */
  getProducts() {
    const endpoint = `${base_url}/products`;
    return this.http.get(endpoint);
  }
}
