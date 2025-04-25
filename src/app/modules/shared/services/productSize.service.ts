import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const base_url = "http://localhost:8080/api/v1";

@Injectable({
  providedIn: 'root'
})
export class ProductSizeService {

  constructor(private http: HttpClient) { }

  /**
   * Obtener todas las tallas
   */
  getProductSizes() {
    const endpoint = `${base_url}/product-sizes`;
    return this.http.get(endpoint);
  }

  getProducts() {
    const endpoint = `${base_url}/products`;
    return this.http.get(endpoint);
  }

  /**
   * Guardar una talla para un producto
   */
  saveProductSize(body: any) {
    const endpoint = `${base_url}/product-sizes`;
    return this.http.post(endpoint, body);
  }

  /**
   * Actualizar talla
   */
  updateProductSize(body: any, id: number) {
    const endpoint = `${base_url}/product-sizes/${id}`;
    return this.http.post(endpoint, body);
  }

  /**
   * Eliminar una talla
   */
  deleteProductSize(id: number) {
    const endpoint = `${base_url}/product-sizes/${id}`;
    return this.http.delete(endpoint);
  }

  /**
   * Buscar talla por ID
   */
  getProductSizeById(id: number) {
    const endpoint = `${base_url}/product-sizes/${id}`;
    return this.http.get(endpoint);
  }

  /**
   * Buscar todas las tallas de un producto
   */
  getProductSizesByProductId(productId: number) {
    const endpoint = `${base_url}/product-sizes/product/${productId}`;
    return this.http.get(endpoint);
  }

  /**
   * Buscar producto por nombre
   */
  getProductSizesByProductName(productName: string) {
    const endpoint = `${base_url}/product-sizes/product-name/${productName}`;
    return this.http.get(endpoint);
  }

  /**
   * export excel productSize
   */
  exportProductSize(){
    const endpoint = `${base_url}/product-sizes/export/excel`;
    return this.http.get(endpoint, {
      responseType: 'blob'
    });
  }

}
