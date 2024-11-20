import { Injectable } from '@angular/core';
import { mapRemoteToLocalService } from '../mappings/service-mapper';
import { ServicesRepository } from '../repositories/service.repository';
import { BookingsRepository } from '../repositories/bookings.repository';
import { UsersRepository } from '../repositories/users.repository';
import { mapRemoteToLocalUser } from '../mappings/user-mapper';
import { mapRemoteToLocalBooking } from '../mappings/booking-mapper';

@Injectable({
  providedIn: 'root',
})
export class SyncService {
  constructor(
    private servicesRepository: ServicesRepository,
    private bookingsRepository: BookingsRepository,
    private usersRepository: UsersRepository
) {}

  async syncServices(): Promise<void> {
    try {
      const remoteServices = await this.servicesRepository.getRemoteServices();

      const localServices = await this.servicesRepository.getLocalServices();

      const localIds = new Set(localServices.map((service) => service.id));

      const newServices = remoteServices.filter((remoteService) => {
        const localId = localIds.has(remoteService.id);
        return !localId;
      });

      for (const remoteService of newServices) {
        const localService = mapRemoteToLocalService(remoteService);
        await this.servicesRepository.addLocalService(localService);
      }

      console.log('Sincronización completada: Servicios actualizados');
    } catch (error) {
      console.error('Error durante la sincronización de servicios:', error);
    }
  }

  async syncBookings(): Promise<void> {
    try {
      const remoteBookings = await this.bookingsRepository.getRemoteBookings();

      const localBookings = await this.bookingsRepository.getLocalBookings();

      const localIds = new Set(localBookings.map((booking) => booking.id));

      const newBookings = remoteBookings.filter((remoteBooking) => {
        const localId = localIds.has(remoteBooking.id);
        return !localId;
      });

      for (const remoteBooking of newBookings) {
        const localBooking = mapRemoteToLocalBooking(remoteBooking);
        await this.bookingsRepository.addLocalBooking(localBooking);
      }

      console.log('Sincronización completada: Reservas actualizadas');
    } catch (error) {
      console.error('Error durante la sincronización de reservas:', error);
    }
  }

  async syncUsers(): Promise<void> {
    try {
      const remoteUsers = await this.usersRepository.getRemoteUsers();

      const localUsers = await this.usersRepository.getLocalUsers();

      const localIds = new Set(localUsers.map((user) => user.id));

      const newUsers = remoteUsers.filter((remoteUser) => {
        const localId = localIds.has(remoteUser.id);
        return !localId;
      });

      for (const remoteUser of newUsers) {
        const localUser = mapRemoteToLocalUser(remoteUser);
        await this.usersRepository.addLocalUser(localUser);
      }

      console.log('Sincronización completada: Usuarios actualizados');
    } catch (error) {
      console.error('Error durante la sincronización de usuarios:', error);
    }
  }
}