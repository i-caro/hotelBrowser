import { Injectable } from '@angular/core';
import { LocalDatabase } from '../localDatabase/local-database';
import { Booking } from '../model/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingsRepository {
  private db: LocalDatabase<Booking>;
  private initialized: Promise<void>;

  constructor() {
    this.db = new LocalDatabase<Booking>('AppDB', 'bookings');
    this.initialized = this.db.init();
  }


  async addReserva(reserva: Booking): Promise<string> {
    await this.initialized;
    return this.db.add(reserva);
  }


  async getReservas(): Promise<Booking[]> {
    await this.initialized;
    return this.db.getAll();
  }

  async updateReserva(reserva: Booking): Promise<void> {
    await this.initialized;
    return this.db.update(reserva);
  }

  async deleteReserva(id: string): Promise<void> {
    await this.initialized;
    return this.db.delete(id);
  }
}