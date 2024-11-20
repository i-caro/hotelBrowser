import { Injectable } from '@angular/core';
import { Booking } from '../model/booking.model';
import { LocalDatabase } from '../localDatabase/local-database';
import { ApiModel } from '../strapi/api-model';
import { lastValueFrom } from 'rxjs';
import { mapLocalToRemoteBooking, mapRemoteToLocalBooking } from '../mappings/booking-mapper';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BookingsRepository {
  private type: string = 'bookings';
  private db: LocalDatabase<Booking>;
  private initialized: Promise<void>;
  private apiModel: ApiModel<Booking>;

  constructor(private http: HttpClient) {
    this.db = new LocalDatabase<Booking>('AppDB', 'bookings');
    this.initialized = this.db.init();
    this.apiModel = new ApiModel<Booking>(http);
    this.syncWithRemote();
  }

  async syncWithRemote(): Promise<void> {
    try {
        const remoteData = await lastValueFrom(this.apiModel.getAll(this.type));
        const formattedData = remoteData.data.map((remote: any) => mapRemoteToLocalBooking(remote));
        await this.db.insertAll(formattedData);
        console.log(`Database synchronized with remote data for ${this.type}`);
    } catch (error) {
        console.error("Error synchronizing with remote data:", error);
    }
  }

  async addReserva(booking: Booking): Promise<void> {
    const payload = mapLocalToRemoteBooking(booking);

    try {
      await lastValueFrom(this.apiModel.add(payload, this.type));
    } catch (error) {
      console.error('Error al añadir la reserva remotamente:', error);
    }

    await this.db.add(booking);
  }

  async getReservas(): Promise<Booking[]> {
    const localData = await this.db.getAll();

    try {
      const remoteResponse = await lastValueFrom(this.apiModel.getAll(this.type));
      return remoteResponse.data.map((remote: any) => mapRemoteToLocalBooking(remote));
    } catch (error) {
      console.error('Error al obtener datos remotos:', error);
      return localData;
    }
  }

  async updateReserva(booking: Booking): Promise<void> {
    const payload = mapLocalToRemoteBooking(booking);

    try {
      const response = await lastValueFrom(this.apiModel.getById(this.type, booking.id));
      const strapiId = response.data[0]?.id;
      if (strapiId) {
        await lastValueFrom(this.apiModel.update(strapiId, payload, this.type));
      }
    } catch (error) {
      console.error('Error al actualizar la reserva remotamente:', error);
    }

    await this.db.update(booking);
  }

  async deleteReserva(id: string): Promise<void> {
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