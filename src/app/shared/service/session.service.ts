import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  setUser(user){
    
    window.sessionStorage.setItem('user', JSON.stringify(user));
  }

  getUser(){
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    return user;
  }
}
