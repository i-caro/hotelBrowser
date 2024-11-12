import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs';
import { Booking } from '../model/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingsRepository {

  constructor(private dbService: NgxIndexedDBService) {}

  addReserva(reserva: Booking){
    this.dbService.add('bookings', reserva);
  }

  getReservas(): Observable<Booking[]> {
    return this.dbService.getAll('bookings');
  }

  updateReserva(reserva: Booking): Observable<Booking> {
    return this.dbService.update('bookings', reserva);
  }

  deleteReserva(id: string): Observable<Booking[]> {
    return this.dbService.delete('bookings', id);
  }
}