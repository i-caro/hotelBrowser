import { Injectable } from '@angular/core';
import { User } from '../model/user.model';
import { LocalDatabase } from '../localDatabase/local-database';
import { ApiModel } from '../strapi/api-model';
import { lastValueFrom } from 'rxjs';
import { mapLocalToRemoteUser, mapRemoteToLocalUser } from '../mappings/user-mapper';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsersRepository {
  private type: string = 'usuarios';
  private db: LocalDatabase<User>;
  private initialized: Promise<void>;
  private apiModel: ApiModel<User>;

  constructor(private http: HttpClient) {
    this.db = new LocalDatabase<User>('AppDB', 'users');
    this.initialized = this.db.init();
    this.apiModel = new ApiModel<User>(http);
  }

  async addUsuario(user: User): Promise<void> {
    const payload = mapLocalToRemoteUser(user);

    try {
      await lastValueFrom(this.apiModel.add(payload, this.type));
    } catch (error) {
      console.error('Error al añadir el usuario remotamente:', error);
    }

    await this.db.add(user);
  }

  async getUsuarios(): Promise<User[]> {
    const localData = await this.db.getAll();

    try {
      const remoteResponse = await lastValueFrom(this.apiModel.getAll(this.type));
      return remoteResponse.data.map((remote: any) => mapRemoteToLocalUser(remote));
    } catch (error) {
      console.error('Error al obtener datos remotos:', error);
      return localData;
    }
  }

  async updateUsuario(user: User): Promise<void> {
    const payload = mapLocalToRemoteUser(user);

    try {
        await lastValueFrom(this.apiModel.update(user.id, payload, this.type));
    } catch (error) {
      console.error('Error al actualizar el usuario remotamente:', error);
    }

    await this.db.update(user);
  }

  async deleteUsuario(id: string): Promise<void> {
    try {
        await lastValueFrom(this.apiModel.delete(id, this.type));
    } catch (error) {
      console.error('Error al eliminar remotamente:', error);
    }

    await this.db.delete(id);
  }

}
