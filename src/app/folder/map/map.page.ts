import { Component, OnInit } from '@angular/core';
import { ServicesRepository } from 'src/app/repositories/service.repository';
import { Service } from 'src/app/model/service.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  zoom = 12;
  center = { lat: 40.416775, lng: -3.703790 };
  markers: { position: { lat: number; lng: number }; label: string }[] = [];

  constructor(private servicesRepository: ServicesRepository) {}

  async ngOnInit() {
    const services: Service[] = await this.servicesRepository.getServices();

    this.markers = services
      .filter(service => service.latitud && service.longitud)
      .map(service => ({
        position: { lat: +service.latitud!, lng: +service.longitud! },
        label: service.type.charAt(0), 
      }));

    if (this.markers.length > 0) {
      this.center = this.markers[0].position;
    }
  }
}