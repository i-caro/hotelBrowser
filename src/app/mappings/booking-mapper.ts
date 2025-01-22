import { Booking } from '../model/booking.model';

export const mapRemoteToLocalBooking = (remoteData: any): Booking => {
  const attributes = remoteData.attributes || {};
  return {
    id: remoteData.id,
    serviceId: attributes.serviceId || '',
    userId: attributes.userId || '',
    startDate: attributes.startDate || '',
    endDate: attributes.endDate || '',
    peopleAmount: attributes.peopleAmount || 0,
    preferences: attributes.preferences || '',
    estado: attributes.estado || 'pendiente',
    totalPayed: attributes.totalPayed || 0,
  };
};

export const mapLocalToRemoteBooking = (localData: Booking): any => {
  return {
    data: {
      serviceId: localData.serviceId,
      userId: localData.userId,
      startDate: localData.startDate,
      endDate: localData.endDate,
      peopleAmount: localData.peopleAmount,
      preferences: localData.preferences,
      estado: localData.estado,
      totalPayed: localData.totalPayed,
    },
  };
};

export function mapLocalToFirebaseService(localData: Booking): any {
  return {
    id: localData.id,
    serviceId: localData.serviceId,
    userId: localData.userId,
    startDate: localData.startDate,
    endDate: localData.endDate,
    peopleAmount: localData.peopleAmount,
    preferences: localData.preferences,
    estado: localData.estado,
    totalPayed: localData.totalPayed,
  };
};

export function mapFirebaseToLocalService(firebaseData: any): Booking {
  return {
    id: firebaseData.id,
    serviceId: firebaseData.serviceId,
    userId: firebaseData.userId,
    startDate: firebaseData.startDate,
    endDate: firebaseData.endDate,
    peopleAmount: firebaseData.peopleAmount,
    preferences: firebaseData.preferences,
    estado: firebaseData.estado,
    totalPayed: firebaseData.totalPayed,
  };
}