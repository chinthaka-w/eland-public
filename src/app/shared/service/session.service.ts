import {Injectable} from '@angular/core';
import {PublicUserDetail} from '../dto/public-user-detail.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() {
  }

  setUser(user) {

    window.sessionStorage.setItem('user', JSON.stringify(user));
    console.log(user.id);
  }

  getUser(): PublicUserDetail {
    return JSON.parse(window.sessionStorage.getItem('user'));
  }
}
