import { Injectable } from '@angular/core';
import { LocalDatabase } from '../localDatabase/local-database';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersRepository {
  private db: LocalDatabase<User>;
  private initialized: Promise<void>;

  constructor() {
    this.db = new LocalDatabase<User>('AppDB', 'users');
    this.initialized = this.db.init();
  }


  async addUsuario(usuario: User): Promise<string> {
    await this.initialized;
    return this.db.add(usuario);
  }


  async getUsuarios(): Promise<User[]> {
    await this.initialized;
    return this.db.getAll();
  }

  async updateUsuario(usuario: User): Promise<void> {
    await this.initialized;
    return this.db.update(usuario);
  }

  async deleteUsuario(id: string): Promise<void> {
    await this.initialized;
    return this.db.delete(id);
  }
}