import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {GC_AUTH_TOKEN, GC_USER_ID} from './constants';

@Injectable({
  providedIn: 'root'
})


@Injectable()
export class AuthService {

  private userId: string = null;
  // store the URL so we can redirect after logging in
  redirectUrl: string;
  private _isAuthenticated = new BehaviorSubject(false);

  constructor() {
  }

  get isAuthenticated(): Observable<any> {
    return this._isAuthenticated.asObservable();
  }

  get isSetUser() {
    return !!this.userId;
  }

  saveUserData(id: string, token: string) {

    localStorage.setItem(GC_USER_ID, id);
    localStorage.setItem(GC_AUTH_TOKEN, token);
    this.setUserId(id);
  }

  setUserId(id: string) {
    this.userId = id;
    this._isAuthenticated.next(true);
  }

  logout() {
    localStorage.removeItem(GC_USER_ID);
    localStorage.removeItem(GC_AUTH_TOKEN);
    this.userId = null;
    this._isAuthenticated.next(false);
  }

  autoLogin() {
    const id = localStorage.getItem(GC_USER_ID);

    if (id) {
      this.setUserId(id);
    }
  }
}
