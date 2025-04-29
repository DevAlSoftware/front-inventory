import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class SaleService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  /**
   * Obtener todas las ventas
   */
  getSales() {
    const endpoint = `${this.baseUrl}/sales`;
    return this.http.get(endpoint);
  }

  /**
   * Registrar una nueva venta
   */
  saveSale(body: any) {
    const endpoint = `${this.baseUrl}/sales`;
    return this.http.post(endpoint, body);
  }

  /**
   * Eliminar una venta
   */
  deleteSale(id: any) {
    const endpoint = `${this.baseUrl}/sales/${id}`;
    return this.http.delete(endpoint);
  }

  /**
   * Buscar ventas por nombre de cliente
   */
  getSalesByCustomer(name: string) {
    const endpoint = `${this.baseUrl}/sales/filter/${name}`;
    return this.http.get(endpoint);
  }
  /**
   * Obtener productos disponibles (por si necesitas mostrar productos para agregar en saleDetails)
   */
  getProducts() {
    const endpoint = `${this.baseUrl}/products`;
    return this.http.get(endpoint);
  }

  /**
   * Obtener productos disponibles (por si necesitas mostrar productos para agregar en saleDetails)
   */
  getCustomers() {
    const endpoint = `${this.baseUrl}/customers`;
    return this.http.get(endpoint);
  }

  /**
 * Exportar ventas a Excel
 */
  exportSales() {
    const endpoint = `${this.baseUrl}/sales/export/excel`;
    return this.http.get(endpoint, {
      responseType: 'blob'
    });
  }

  getSalesByProductId(productId: number) {
    const endpoint = `${this.baseUrl}/sales/by-product-id?id=${productId}`;
    return this.http.get(endpoint);
  }

  getSizesByProduct(productId: number) {
    const endpoint = `${this.baseUrl}/product-sizes/product/${productId}`;
    return this.http.get(endpoint);
  }

  /**
   * Método para registrar la venta y actualizar stock
   */
  recordSale(productId: number, size: string, quantity: number) {
    // Aquí es donde simplemente mandamos los datos necesarios al backend
    const body = {
      productId,
      size,
      quantity
    };
    const endpoint = `${this.baseUrl}/sales/record`;
    return this.http.post(endpoint, body);
  }
}
