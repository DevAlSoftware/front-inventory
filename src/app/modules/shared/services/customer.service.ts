import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const base_url = "http://localhost:8080/api/v1";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  /**
   * get all customers
   */
  getCustomers(){

    const endpoint = `${base_url}/customers`;
    return this.http.get(endpoint);

  }

  /**
   * save the customers
   */
  saveCustomers(body: any) {
    const endpoint = `${base_url}/customers`;
    return this.http.post(endpoint, body);
  }

  /**
   * update customers
   */
  updateCustomers(body: any, id: any){
    const endpoint = `${base_url}/customers/ ${id}`;
    return this.http.put(endpoint, body);
  }

  /**
   * update customers
   */
  deleteCustomers(id: any){
    const endpoint = `${base_url}/customers/ ${id}`;
    return this.http.delete(endpoint);
  }

  /**
   * update customers
   */
  geCustomerById(id: any){
    const endpoint = `${base_url}/customers/ ${id}`;
    return this.http.get(endpoint);
  }

  /**
   * search by name
   */
  getCustomerByFullName(fullName: any){
    const endpoint = `${base_url}/customers/filter/${fullName}`;
    return this.http.get(endpoint);
  }


  /**
   * export excel customers
   */
  exportCustomers(){
    const endpoint = `${base_url}/customers/export/excel`;
    return this.http.get(endpoint, {
      responseType: 'blob'
    });
  }
}