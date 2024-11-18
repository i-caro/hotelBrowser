import { Injectable } from '@angular/core';
import { Service } from '../model/service.model';
import { LocalDatabase } from '../localDatabase/local-database';
import { from, lastValueFrom, map, Observable, switchMap } from 'rxjs';
import { mapLocalToRemoteService, mapRemoteToLocalService } from '../mappings/service-mapper';
import { ApiModel } from '../strapi/api-model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServicesRepository {
  private type: string = 'services';
  private db: LocalDatabase<Service>;
  private initialized: Promise<void>;
  private apiModel: ApiModel<Service>;

  constructor(private http: HttpClient) {
    this.db = new LocalDatabase<Service>('AppDB', 'services');
    this.initialized = this.db.init();
    this.apiModel = new ApiModel<Service>(http)
  }

  getAvailableServices(): Observable<Service[]> {
    return from(this.db.getAll()).pipe(
      map((services: Service[]) => services.filter(service => service.available === 'disponible'))
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
      await lastValueFrom(this.apiModel.add(payload, this.type));
    } catch (error) {
      console.error("Error al añadir el servicio remotamente:", error);
    }
  
    await this.db.add(service);
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
      const response = await lastValueFrom(this.apiModel.findByCustomId(this.type, service.id));
      const strapiId = response.data[0]?.id;
      if (strapiId) {
        await lastValueFrom(this.apiModel.update(strapiId, payload, this.type));
      }
    } catch (error) {
      console.error('Error al actualizar el servicio remotamente:', error);
    }

    await this.db.update(service);
  }
  async deleteService(id: string): Promise<void> {
    try {
      const response = await lastValueFrom(this.apiModel.findByCustomId(this.type, id));
      const strapiId = response.data[0]?.id;
      if (strapiId) {
        await lastValueFrom(this.apiModel.delete(strapiId, this.type));
      }
    } catch (error) {
      console.error("Error al eliminar remotamente:", error);
    }
  
    await this.db.delete(id);
  }
}