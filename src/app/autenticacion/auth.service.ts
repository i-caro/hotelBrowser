import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'app_users';
  private readonly LOGGED_IN_USER_KEY = 'logged_in_user';
  public authStatus = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor() {}

  register(username: string, password: string, email: string): boolean {
    const users = this.getUsers();
    if (users[username]) {
      return false;
    }
    users[username] = { password, email };
    this.saveUsers(users);
    return true;
  }

  login(username: string, password: string): boolean {
    const users = this.getUsers();
    if (users[username] && users[username].password === password) {
      localStorage.setItem(this.LOGGED_IN_USER_KEY, JSON.stringify({ username, email: users[username].email }));
      this.authStatus.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.LOGGED_IN_USER_KEY);
    this.authStatus.next(false);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.LOGGED_IN_USER_KEY);
  }

  getAuthenticatedUser(): { username: string; email: string } | null {
    const user = localStorage.getItem(this.LOGGED_IN_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  private getUsers(): { [username: string]: { password: string; email: string } } {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '{}');
  }

  private saveUsers(users: { [username: string]: { password: string; email: string } }): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }
}