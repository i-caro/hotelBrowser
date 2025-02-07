import { Injectable } from '@angular/core';
import { Service } from '../model/service.model';
import { LocalDatabase } from '../localDatabase/local-database';
import { from, lastValueFrom, map, Observable, switchMap } from 'rxjs';
import { mapLocalToRemoteService, mapRemoteToLocalService } from '../mappings/service-mapper';
import { ApiModel } from '../strapi/api-model';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ServicesRepository {
  private type: string = 'services';
  private db: LocalDatabase<Service>;
  private initialized: Promise<void>;
  private apiModel: ApiModel<Service>;

  constructor(private http: HttpClient, private firestore: AngularFirestore) {
    this.db = new LocalDatabase<Service>('AppDB', 'services');
    this.initialized = this.db.init();
    this.apiModel = new ApiModel<Service>(http);
  }

  getAvailableServices(): Observable<Service[]> {
    return this.apiModel.getAll(this.type).pipe(
      map((response: any) => {
        return response.data
          .map((remote: any) => mapRemoteToLocalService(remote))
          .filter((service: Service) => service.available === 'disponible');
      })
    );
  }

  markAsReserved(serviceId: string): Observable<void> {
    return from(this.db.getById(serviceId)).pipe(
      switchMap((service: Service) => {
        service.available = 'reservado';
        return from(this.db.update(service));
      })
    );
  }

  async addService(service: Service): Promise<void> {
    const payload = mapLocalToRemoteService(service);

    try {
      const docRef = await this.firestore.collection(this.type).add(payload);
      service.id = docRef.id;
    } catch (error) {
      console.warn('Error al agregar en Firebase, intentando con Strapi:', error);
    }
  
    try {
      const response = await lastValueFrom(this.apiModel.add(payload, this.type));
      service.id = response.data.id
    } catch (error) {
      console.error("Error al añadir el servicio remotamente:", error);
    }
  }


  async getServices(): Promise<Service[]> {
    const localData = await this.db.getAll();
  
    try {
      const remoteResponse = await lastValueFrom(this.apiModel.getAll(this.type));
      return remoteResponse.data.map((remote: any) => mapRemoteToLocalService(remote));
    } catch (error) {
      console.error("Error al obtener datos remotos:", error);
      return localData;
    }
  }

  async updateService(service: Service): Promise<void> {
    const payload = mapLocalToRemoteService(service);

    try {
      await lastValueFrom(this.apiModel.update(service.id, payload, this.type));
    } catch (error) {
      console.error('Error al actualizar el servicio remotamente:', error);
    }

    await this.db.update(service);
  }
  
  async deleteService(id: string): Promise<void> {
    try {
        await lastValueFrom(this.apiModel.delete(id, this.type));
    } catch (error) {
      console.error("Error al eliminar remotamente:", error);
    }
  }
}