import {Injectable} from '@angular/core';
import {UserDetails} from '../dto/user-details.model';

const TOKEN_KEY = 'AuthToken';
const REFRESH_TOKEN = 'AuthToken';
const AUTH_TOKEN = 'AuthToken';
const USER_KEY = 'UserToken';
const LANGUAGE_KEY = 'DefaultLanguage';

@Injectable()
export class TokenStorageService {

  private loggedUser: string;

  constructor() {
  }

  signOut() {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.clear();
  }

  public saveToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUserObjectToken(token: UserDetails): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(token));
  }

  public getUserObjectToken(): UserDetails {
    return JSON.parse(window.sessionStorage.getItem(USER_KEY));
  }

  public setDefualtLanguage(language: string): void {
    window.sessionStorage.removeItem(LANGUAGE_KEY);
    window.sessionStorage.setItem(LANGUAGE_KEY, language);
  }

  public getDefualtLanguage(): string{
    return window.sessionStorage.getItem(LANGUAGE_KEY);
  }

}
