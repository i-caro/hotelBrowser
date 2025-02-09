import { Component, OnInit, ViewChild } from '@angular/core';
import { ServicesRepository } from 'src/app/repositories/service.repository';
import { Service } from 'src/app/model/service.model';
import { lastValueFrom } from 'rxjs';
import { GeocodingService } from '../services/geocoding.service';
import { MapInfoWindow } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  zoom = 12;
  center = { lat: 36.71689342477487, lng: -4.425805904213521 };
  markers: {
    position: { lat: number; lng: number };
    label: string;
  }[] = [];

  constructor(
    private servicesRepository: ServicesRepository,
    private geocodingService: GeocodingService
  ) {}

  async ngOnInit() {
    const services: Service[] = await this.servicesRepository.getServices();

    for (const service of services) {
      try {
        const coords = await lastValueFrom(
          this.geocodingService.getCoordinates(service.location)
        );
        service.latitud = coords.lat;
        service.longitud = coords.lng;

        this.markers.push({
          position: { lat: coords.lat, lng: coords.lng },
          label: `${(service.type).charAt(0).toUpperCase()}`,
        });
      } catch (error) {
        console.error(`Error obteniendo coordenadas para ${service.name}:`, error);
      }
    }

    if (this.markers.length > 0) {
      this.center = this.markers[0].position;
    }
  }
}