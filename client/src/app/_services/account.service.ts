import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of, ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { UserRegister } from '../_models/user-register';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  
  private readonly url = environment.apiUrl + 'account/';

  private readonly userKey = 'UsuarioBibliotecaDoBairro';
  private readonly currentUserSource = new ReplaySubject<User>(1);

  readonly currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  login(username: string, password: string) {
    return this.http.post(this.url + 'login', { username, password })
      .pipe(map((user: Partial<User>) => user && this.setCurrentUser(user)));
  }

  setCurrentUser(user: Partial<User>) {
    if (!user || !user.token) return this.currentUserSource.next(null);
    const decodedToken = this.getDecodedToken(user);
    user.id = +decodedToken.nameid;
    user.roles = [decodedToken.role].flat();
    
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUserSource.next(<User>user);
  }

  getAndSetUser() {
    const user: User = JSON.parse(localStorage.getItem(this.userKey));
    this.setCurrentUser(user);
  }

  register(user: UserRegister) {
    return this.http.post<string>(this.url + 'register', user);
  }

  usernameExists(username?: string) {
		if (!username || username.length < 1) return of(false);
		return this.http.get(`${this.url}user-exists/${username}`).pipe(take(1));
  }

  logout() {
		localStorage.removeItem(this.userKey);
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/login');
	}
  
  private getDecodedToken(user: Partial<User>) {
    return JSON.parse(atob(user.token.split('.')[1]));
  }
}
