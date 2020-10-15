import {EventEmitter, Injectable, Output} from '@angular/core';
import {PublicUserDetails} from '../dto/public-user-detail.model';

const USER_KEY = 'UserToken';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  userDetailsChange = new EventEmitter<PublicUserDetails>();

  constructor() {
  }

  setUser(user) {
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    this.userDetailsChange.emit(this.getUser());
  }

  getUser(): PublicUserDetails {
    return JSON.parse(window.sessionStorage.getItem(USER_KEY));
  }

  removeUser() {
    window.sessionStorage.removeItem(USER_KEY);
  }
}
