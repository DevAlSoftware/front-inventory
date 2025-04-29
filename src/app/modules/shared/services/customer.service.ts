import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  /**
   * get all customers
   */
  getCustomers(){

    const endpoint = `${this.baseUrl}/customers`;
    return this.http.get(endpoint);

  }

  /**
   * save the customers
   */
  saveCustomers(body: any) {
    const endpoint = `${this.baseUrl}/customers`;
    return this.http.post(endpoint, body);
  }

  /**
   * update customers
   */
  updateCustomers(body: any, id: any){
    const endpoint = `${this.baseUrl}/customers/ ${id}`;
    return this.http.put(endpoint, body);
  }

  /**
   * update customers
   */
  deleteCustomers(id: any){
    const endpoint = `${this.baseUrl}/customers/ ${id}`;
    return this.http.delete(endpoint);
  }

  /**
   * update customers
   */
  geCustomerById(id: any){
    const endpoint = `${this.baseUrl}/customers/ ${id}`;
    return this.http.get(endpoint);
  }

  /**
   * search by name
   */
  getCustomerByFullName(fullName: any){
    const endpoint = `${this.baseUrl}/customers/filter/${fullName}`;
    return this.http.get(endpoint);
  }


  /**
   * export excel customers
   */
  exportCustomers(){
    const endpoint = `${this.baseUrl}/customers/export/excel`;
    return this.http.get(endpoint, {
      responseType: 'blob'
    });
  }
}