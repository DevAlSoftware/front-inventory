import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import baserUrl from '../../models/helper';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public loginStatusSubjec = new Subject<boolean>();

  constructor(private http:HttpClient) { }

  //generamos el token
  public generateToken(loginData:any){
    return this.http.post(`${baserUrl}/generate-token`,loginData);
  }

  public getCurrentUser(){
    return this.http.get(`${baserUrl}/login`);
  }

  //iniciamos sesión y establecemos el token en el localStorage
  public loginUser(token: string) {
    const cleanedToken = token.trim();
    localStorage.setItem('token', cleanedToken); 
    return true;
  }
  

  public isLoggedIn(){
    let tokenStr = localStorage.getItem('token');
    if(tokenStr == undefined || tokenStr == '' || tokenStr == null){
      return false;
    }else{
      return true;
    }
  }

  //cerranis sesion y eliminamos el token del localStorage
  public logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return true;
  }

  //obtenemos el token
  public getToken(){
    return localStorage.getItem('token');
  }

  public setUser(user:any){
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUser(){
    let userStr = localStorage.getItem('user');
    if(userStr != null){
      return JSON.parse(userStr);
    }else{
      this.logout();
      return null;
    }
  }

  public getUserRole(){
    let user = this.getUser();
    return user.authorities[0].authority;
  }
}