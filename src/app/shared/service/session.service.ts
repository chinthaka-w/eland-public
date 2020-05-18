import {Injectable} from '@angular/core';
import {PublicUserDetails} from '../dto/public-user-detail.model';

const TOKEN_KEY = 'AuthToken';
const REFRESH_TOKEN = 'AuthToken';
const AUTH_TOKEN = 'AuthToken';
const USER_KEY = 'UserToken';
const LANGUAGE_KEY = 'DefaultLanguage';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() {
  }

  setUser(user) {
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser(): PublicUserDetails {
    return JSON.parse(window.sessionStorage.getItem(USER_KEY));
  }

  removeUser() {
    window.sessionStorage.removeItem(USER_KEY);
  }
}
