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
    const userId = this.generateHexId(8); 
    users[username] = { id: userId, password, email };
    this.saveUsers(users);
    return true;
  }


  login(username: string, password: string): boolean {
    const users = this.getUsers();
    if (users[username] && users[username].password === password) {
      const userData = { id: users[username].id, username, email: users[username].email };
      localStorage.setItem(this.LOGGED_IN_USER_KEY, JSON.stringify(userData));
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

  getAuthenticatedUser(): { id: string; username: string; email: string } | null {
    const user = localStorage.getItem(this.LOGGED_IN_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  private generateHexId(length: number): string {
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  private getUsers(): { [username: string]: { id: string; password: string; email: string } } {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '{}');
  }

  private saveUsers(users: { [username: string]: { id: string; password: string; email: string } }): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }
}