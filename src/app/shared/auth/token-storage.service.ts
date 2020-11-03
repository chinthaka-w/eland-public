import {Injectable} from '@angular/core';
import {UserDetails} from '../dto/user-details.model';
import {SessionService} from '../service/session.service';

const ACCESS_TOKEN_KEY = 'AccessToken';
const REFRESH_TOKEN_KEY = 'RefreshToken';
const USER_KEY = 'UserToken';
const LANGUAGE_KEY = 'DefaultLanguage';

@Injectable()
export class TokenStorageService {

  private loggedUser: string;

  public NEW_NOTARY_REGISTRATION_KEY = 'NewNotaryRegistration';

  constructor(private sessionService: SessionService) {
  }

  signOut() {
    window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.clear();
  }

  public saveAccessToken(token: string) {
    window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    window.sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  }

  public saveRefreshToken(token: string) {
    window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    window.sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
  }

  public getAccessToken(): string {
    return window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }

  public getRefreshToken(): string {
    return window.sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }

  public saveUserObjectToken(token: any): void {
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

  public getDefualtLanguage(): string {
    return window.sessionStorage.getItem(LANGUAGE_KEY);
  }

  public saveFormData(key: string, data: string) {
    window.sessionStorage.setItem(key, data);
  }

  public getFormData(key: string) {
    return window.sessionStorage.getItem(key);
  }

}
