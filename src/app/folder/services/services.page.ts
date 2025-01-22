import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Service } from 'src/app/model/service.model';
import { ServicesRepository } from 'src/app/repositories/service.repository';
import { GeocodingService } from './geocoding.service';
import { lastValueFrom } from 'rxjs';
import { mapFirebaseToLocalService, mapLocalToRemoteService } from 'src/app/mappings/service-mapper';
import { FirestoreService } from 'src/app/firebase/firestore.service';
import { mapLocalToFirebaseService } from 'src/app/mappings/user-mapper';

@Component({
  selector: 'app-servicios',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {
  mostrarFormulario = false;
  servicioForm: FormGroup;
  servicios: Service[] = [];

  constructor(
    private fb: FormBuilder,
    private serviciosRepository: ServicesRepository,
    private geocodingService: GeocodingService,
    private firestore: FirestoreService
  ) {
    this.servicioForm = this.fb.group({
      name: ["", Validators.required],
      type: ["", Validators.required],
      description: [""],
      location: [""],
      price: [0, Validators.required],
      available: ["disponible", Validators.required],
    });
  }

  async ngOnInit() {
    await this.cargarServicios();
  }

  async cargarServicios() {
    let success = true;
    try {
      let sv: Service;
      const snapshot = await lastValueFrom(this.firestore.getCollection('services'));
        this.servicios = snapshot.map(doc => {
          const data = doc.data();
          if (typeof data === 'object' && data !== null) {
            return mapFirebaseToLocalService({ id: doc.id, ...data });
          } else {
            console.warn(`Los datos del documento con ID ${doc.id} no son válidos:`, data);
            return sv;
          }
        });
  
      console.log('Servicios cargados desde Firebase:', this.servicios);
    } catch (error) {
      console.error("Error al cargar desde firebase, intentado con strapi: ", error)
      success = false;
    }

    if(!success){
      try {
        this.servicios = await this.serviciosRepository.getServices();
        console.log("Servicios cargados:", this.servicios);
      } catch (error) {
        console.error("Error al cargar los servicios:", error);
      }
    }
  }

  async agregarServicio() {
    if (this.servicioForm.valid) {
      const nuevoServicio: Service = {
        ...this.servicioForm.value,
      };
  
      try {
        const coords = await lastValueFrom(this.geocodingService.getCoordinates(nuevoServicio.location));
  
        nuevoServicio.latitud = coords.lat;
        nuevoServicio.longitud = coords.lng;
        
        await this.firestore.addDocument('services', mapLocalToRemoteService(nuevoServicio))
        await this.serviciosRepository.addService(nuevoServicio);
        
        await this.cargarServicios();
        
        this.servicioForm.reset({ disponibilidad: 'disponible' });
        this.mostrarFormulario = false;
  
        console.log("Servicio agregado con éxito:", nuevoServicio);
      } catch (error) {
        console.error("Error al agregar el servicio:", error);
        alert("Hubo un problema al obtener las coordenadas o guardar el servicio.");
      }
    } else {
      console.log("Formulario inválido");
      alert("Por favor, completa todos los campos obligatorios.");
    }
  }

  async eliminarServicio(id: string) {
    await this.serviciosRepository.deleteService(id);
    this.cargarServicios();
  }
}