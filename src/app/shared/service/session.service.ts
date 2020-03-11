import {Injectable} from '@angular/core';
import {PublicUserDetails} from '../dto/public-user-detail.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() {
  }

  setUser(user) {
    window.localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): PublicUserDetails {
    var user = JSON.parse(window.localStorage.getItem('user'));
    if(user){
      return user;
    }
    else{

      user = new PublicUserDetails;
      return user;
    }
  }

  removeUser() {
    window.localStorage.removeItem('user');
  }
}
