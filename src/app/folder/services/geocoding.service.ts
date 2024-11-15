import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private readonly API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

  constructor(private http: HttpClient) {}

  getCoordinates(address: string): Observable<{ lat: number; lng: number }> {
    const url = `${this.API_URL}?address=${encodeURIComponent(address)}&key=AIzaSyCNmcDkjVdpo9GJE3KFJGfJaMRajbyzoMs`;
    return this.http.get<any>(url).pipe(
      map((response) => {
        if (response.status === 'OK' && response.results.length > 0) {
          const location = response.results[0].geometry.location;
          return { lat: location.lat, lng: location.lng };
        } else {
          throw new Error('No se encontraron coordenadas para la dirección proporcionada.');
        }
      })
    );
  }
}