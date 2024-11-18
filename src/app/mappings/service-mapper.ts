import { Service } from '../model/service.model';

export const mapRemoteToLocalService = (remoteData: any): Service => {
  const attributes = remoteData.attributes || {};
  return {
    id:'',
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