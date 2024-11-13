import { Injectable } from '@angular/core';
import { Service } from '../model/service.model';
import { LocalDatabase } from '../localDatabase/local-database';

@Injectable({
  providedIn: 'root'
})
export class ServicesRepository {
  private db: LocalDatabase<Service>;
  private initialized: Promise<void>;

  constructor() {
    this.db = new LocalDatabase<Service>('AppDB', 'services');
    this.initialized = this.db.init();
  }


  async addService(service: Service): Promise<string> {
    await this.initialized;
    return this.db.add(service);
  }


  async getServices(): Promise<Service[]> {
    await this.initialized;
    return this.db.getAll();
  }

  async updateService(service: Service): Promise<void> {
    await this.initialized;
    return this.db.update(service);
  }

  async deleteService(id: string): Promise<void> {
    await this.initialized;
    return this.db.delete(id);
  }
}