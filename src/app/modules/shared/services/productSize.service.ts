import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/enviroments/enviroment';


@Injectable({
  providedIn: 'root'
})
export class ProductSizeService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  /**
   * Obtener todas las tallas
   */
  getProductSizes() {
    const endpoint = `${this.baseUrl}/product-sizes`;
    return this.http.get(endpoint);
  }

  getProducts() {
    const endpoint = `${this.baseUrl}/products`;
    return this.http.get(endpoint);
  }

  /**
   * Guardar una talla para un producto
   */
  saveProductSize(body: any) {
    const endpoint = `${this.baseUrl}/product-sizes`;
    return this.http.post(endpoint, body);
  }

  /**
   * Actualizar talla
   */
  updateProductSize(body: any, id: number) {
    const endpoint = `${this.baseUrl}/product-sizes/${id}`;
    return this.http.post(endpoint, body);
  }

  /**
   * Eliminar una talla
   */
  deleteProductSize(id: number) {
    const endpoint = `${this.baseUrl}/product-sizes/${id}`;
    return this.http.delete(endpoint);
  }

  /**
   * Buscar talla por ID
   */
  getProductSizeById(id: number) {
    const endpoint = `${this.baseUrl}/product-sizes/${id}`;
    return this.http.get(endpoint);
  }

  /**
   * Buscar todas las tallas de un producto
   */
  getProductSizesByProductId(productId: number) {
    const endpoint = `${this.baseUrl}/product-sizes/product/${productId}`;
    return this.http.get(endpoint);
  }

  /**
   * Buscar producto por nombre
   */
  getProductSizesByProductName(productName: string) {
    const endpoint = `${this.baseUrl}/product-sizes/product-name/${productName}`;
    return this.http.get(endpoint);
  }

  /**
   * export excel productSize
   */
  exportProductSize(){
    const endpoint = `${this.baseUrl}/product-sizes/export/excel`;
    return this.http.get(endpoint, {
      responseType: 'blob'
    });
  }

}
