import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../model/user.model';
import { UsersRepository } from '../repositories/users.repository';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'app_users';
  private readonly LOGGED_IN_USER_KEY = 'logged_in_user';
  private readonly TOKEN_KEY = 'auth_token';
  public authStatus = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(private usersRepository: UsersRepository) {
  }


  async register(name: string, surname: string, password: string, email: string, phone: string, imgUrl: string): Promise<boolean> {
    const existingUsers = await this.usersRepository.getUsuarios();
    if (existingUsers.some(user => user.name === name)) {
      return false;
    }

    const newUser: User = {
      id: this.generateHexId(8),
      name,
      surname,
      password,
      email,
      phone,
      imgUrl
    };

    try {
      await this.usersRepository.addUsuario(newUser);
      return true;
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      return false;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.usersRepository.getUsuarios();
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      return [];
    }
  }


  async login(username: string, password: string): Promise<boolean> {
    try {
      const users = await this.usersRepository.getUsuarios();
      
      const user = users.find((u) => u.name === username && u.password === password);
  
      if (user) {
        const token = this.generateHexId(16)
        localStorage.setItem(this.LOGGED_IN_USER_KEY, JSON.stringify(user));
        localStorage.setItem(this.TOKEN_KEY, token)
        this.authStatus.next(true);
        return true;
      }
  
      return false;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(this.LOGGED_IN_USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY)
    this.authStatus.next(false);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY)
    return !!token
  }

  async getAuthenticatedUser(): Promise<{ id: string; username: string; email: string } | null> {
    const user = localStorage.getItem(this.LOGGED_IN_USER_KEY);
    if (!user) {
      return null;
    }
  
    const parsedUser = JSON.parse(user);
    try {
      const usuarios = await this.usersRepository.getUsuarios();
      const authenticatedUser = usuarios.find(u => u.id === parsedUser.id);
  
      if (authenticatedUser) {
        return { id: authenticatedUser.id, username: authenticatedUser.name, email: authenticatedUser.email };
      }
      return null;
    } catch (error) {
      console.error('Error al obtener el usuario autenticado:', error);
      return null;
    }
  }

  private generateHexId(length: number): string {
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
}