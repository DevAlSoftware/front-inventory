import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  baseUrl = environment.baseUrl;

  public loginStatusSubjec = new Subject<boolean>();

  constructor(private http:HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  

  //generamos el token
  public generateToken(loginData:any){
    return this.http.post(`${this.baseUrl}/generate-token`,loginData);
  }

  public getCurrentUser(){
    return this.http.get(`${this.baseUrl}/login`);
  }

  //iniciamos sesión y establecemos el token en el localStorage
  public loginUser(token: string) {
    const cleanedToken = token.trim();
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', cleanedToken);
    }
    return true;
  }
  

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('user');
    }
    return false;
  }

  //cerranis sesion y eliminamos el token del localStorage
  public logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return true;
  }

  //obtenemos el token
  public getToken() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }
  public setUser(user: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  public getUser() {
    if (isPlatformBrowser(this.platformId)) {
      let userStr = localStorage.getItem('user');
      if (userStr != null) {
        return JSON.parse(userStr);
      } else {
        this.logout();
        return null;
      }
    }
    return null;
  }

  public getUserRole() {
    const user = this.getUser();
    return user?.authorities?.[0]?.authority ?? null;
  }
}