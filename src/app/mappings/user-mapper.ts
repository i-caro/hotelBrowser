import { User } from '../model/user.model';

export const mapRemoteToLocalUser = (remoteData: any): User => {
  const attributes = remoteData.attributes || {};
  return {
    id: remoteData.id,
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

export function mapLocalToFirebaseService(localData: User): any {
  return {
    id: localData.id,
    name: localData.name,
    surname: localData.surname,
    password: localData.password,
    email: localData.email,
    phone: localData.phone,
    imgUrl: localData.imgUrl,
  };
};

export function mapFirebaseToLocalService(firebaseData: any): User {
  return {
    id: firebaseData.id,
    name: firebaseData.name,
    surname: firebaseData.surname,
    password: firebaseData.password,
    email: firebaseData.email,
    phone: firebaseData.phone,
    imgUrl: firebaseData.imgUrl,
  };
}