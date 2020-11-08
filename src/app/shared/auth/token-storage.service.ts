import {Injectable} from '@angular/core';
import {UserDetails} from '../dto/user-details.model';
import {SessionService} from '../service/session.service';
import {RequestData} from '../dto/request-data.model';

const ACCESS_TOKEN_KEY = 'AccessToken';
const REFRESH_TOKEN_KEY = 'RefreshToken';
const USER_KEY = 'UserToken';
const LANGUAGE_KEY = 'DefaultLanguage';

@Injectable()
export class TokenStorageService {

  private loggedUser: string;

  public NEW_NOTARY_REGISTRATION_KEY = 'NewNotaryRegistration';
  public NEW_NOTARY_NAME_CHANGE_KEY = 'NewNotaryNameChange';
  public NEW_NOTARY_JUDICIAL_CHANGE_KEY = 'NewNotaryJudicialChange';
  public NEW_NOTARY_LANGUAGE_CHANGE_KEY = 'NewNotaryLanguageChange';
  public CITIZEN_REGISTRATION_KEY = 'CitizenRegistration';
  public SEARCH_REQUEST_KEY = 'SearchRequest';
  public EXTRACT_REQUEST_KEY = 'ExtractRequest';

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

  public saveFormData(key: string, data: any) {
    window.sessionStorage.setItem(key, JSON.stringify(data));
  }

  public getFormData(key: string) : any{
    return JSON.parse(window.sessionStorage.getItem(key));
  }

  public removeFormData(key: string) {
    window.sessionStorage.removeItem(key);
  }
}
