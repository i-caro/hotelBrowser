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
    this.syncWithRemote();
  }

  async syncWithRemote(): Promise<void> {
    try {
        const remoteResponse = await lastValueFrom(this.apiModel.getAll(this.type));
        
        if (!remoteResponse || !remoteResponse.data) {
            console.warn("No remote data found to sync.");
            return;
        }
        const formattedData = remoteResponse.data.map((remote: any) => mapRemoteToLocalUser(remote));
        await this.db.insertAll(formattedData);

        console.log(`Synchronized ${formattedData.length} records with the local database.`);
    } catch (error) {
        console.error("Error synchronizing with remote data:", error);
    }
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
      const response = await lastValueFrom(this.apiModel.getById(this.type, user.id));
      const strapiId = response.data[0]?.id;
      if (strapiId) {
        await lastValueFrom(this.apiModel.update(strapiId, payload, this.type));
      }
    } catch (error) {
      console.error('Error al actualizar el usuario remotamente:', error);
    }

    await this.db.update(user);
  }

  async deleteUsuario(id: string): Promise<void> {
    try {
      const response = await lastValueFrom(this.apiModel.getById(this.type, id));
      const strapiId = response.data[0]?.id;
      if (strapiId) {
        await lastValueFrom(this.apiModel.delete(strapiId, this.type));
      }
    } catch (error) {
      console.error('Error al eliminar remotamente:', error);
    }

    await this.db.delete(id);
  }

}
