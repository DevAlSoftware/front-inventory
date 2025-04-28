import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/enviroments/enviroment';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.baseUrl;

    constructor(private httpClient: HttpClient) { }

    public añadirUsuario(user:any){
      return this.httpClient.post(`${this.baseUrl}/usuarios/`,user);
    }



}