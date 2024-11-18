import { User } from '../model/user.model';

export const mapRemoteToLocalUser = (remoteData: any): User => {
  const attributes = remoteData.attributes || {};
  return {
    id: '',
    name: attributes.name || '',
    surname: attributes.surname || '',
    password: attributes.password || '',
    email: attributes.email || '',
    phone: attributes.phone || '',
    imgUrl: attributes.imgUrl || 'assets/default-user.png',
  };
};

export const mapLocalToRemoteUser = (localData: User): any => {
  return {
    data: {
      name: localData.name,
      surname: localData.surname,
      password: localData.password,
      email: localData.email,
      phone: localData.phone,
      imgUrl: localData.imgUrl,
    },
  };
};