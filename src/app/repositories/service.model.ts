import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs';
import { Service } from '../model/service.model';

@Injectable({
  providedIn: 'root'
})
export class UsersRepository {

  constructor(private dbService: NgxIndexedDBService) {}

  addService(service: Service){
    this.dbService.add('services', service);
  }

  getServices(): Observable<Service[]> {
    return this.dbService.getAll('services');
  }

  updateService(service: Service): Observable<Service> {
    return this.dbService.update('services', service);
  }

  deleteService(id: string): Observable<Service[]> {
    return this.dbService.delete('services', id);
  }
}