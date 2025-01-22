import { Service } from '../model/service.model';

export const mapRemoteToLocalService = (remoteData: any): Service => {
  const attributes = remoteData.attributes || {};
  return {
    id: remoteData.id,
    name: attributes.name || '',
    type: attributes.type || '',
    description: attributes.description || '',
    location: attributes.location || '',
    available: attributes.available || 'disponible',
    price: attributes.price || 0,
    imgUrl: attributes.imageUrl || '',
    latitud: 0, 
    longitud: 0, 
  };
};

export const mapLocalToRemoteService = (localData: Service): any => {
  return {
    data: {
      name: localData.name,
      type: localData.type,
      description: localData.description,
      location: localData.location,
      available: localData.available,
      price: localData.price,
      imageUrl: localData.imgUrl,
    },
  };
};

export function mapLocalToFirebaseService(localData: Service): any {
  return {
    id: localData.id,
    name: localData.name,
    type: localData.type,
    description: localData.description,
    location: localData.location,
    price: localData.price,
    available: localData.available,
  };
};

export function mapFirebaseToLocalService(firebaseData: any): Service {
  return {
    id: firebaseData.id,
    name: firebaseData.name,
    type: firebaseData.type,
    description: firebaseData.description,
    location: firebaseData.location,
    price: firebaseData.price,
    available: firebaseData.available,
    imgUrl: firebaseData.imgUrl,
    latitud: 0,
    longitud: 0
  };
}