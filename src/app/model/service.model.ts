export interface Service{
    id: string;
    name: string;
    type: string;
    description: string;
    location: string;
    latitud?: number;
    longitud?: number;
    price: number;
    imgUrl: string;
    available: string;
}