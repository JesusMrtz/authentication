import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators';
import { IfStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private apiKey = 'AIzaSyBno04qtQNhhEEf-nlax6E60Wr8Gxt3Zsw';
  userToken = '';

  // Crear nuevo usuario
  //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  //Login 
  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor(private http: HttpClient) {
    this.leerToken();
   }

  logout() {
    localStorage.removeItem('token');
  }

  login(usuario: UsuarioModel) {
    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true
    };

    return this.http.post(
      `${this.url}signInWithPassword?key=${this.apiKey}`,
      authData
    ).pipe(
      map( request => {
        console.log('Entró en el map');
        this.guardarToken(request['idToken']);
        return request;
      })
    );
  }

  nuevoUsuario(usuario: UsuarioModel) {
    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true
    };

    return this.http.post(
      `${this.url}signUp?key=${this.apiKey}`,
      authData
    ).pipe(
      map( request => {
        console.log('Entró en el map');
        this.guardarToken(request['idToken']);
        return request;
      })
    );
  }

  private guardarToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem('token', this.userToken);

    let hoy = new Date();
    hoy.setSeconds(3600);
    localStorage.setItem('expired', hoy.getTime().toString());
  }

  leerToken() {
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
    }

    return this.userToken;
  }

  estaAutenticado(): boolean {
    if( this.userToken.length < 2 ) {
      return false;
    }

    const expired = Number(localStorage.getItem('expired'));
    const expiredDate = new Date();
    expiredDate.setTime(expired);

    if (expiredDate >  new Date()) {
      return true;
    } else {
      return false;
    }
  }
}
