import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Service } from 'src/app/model/service.model';
import { ServicesRepository } from 'src/app/repositories/service.repository';

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
    private serviciosRepository: ServicesRepository
  ) {
    this.servicioForm = this.fb.group({
      name: ["", Validators.required],
      type: ["", Validators.required],
      description: [""],
      location: [""],
      latitud: [""],
      longitud: [""],
      price: [0, Validators.required],
      available: ["disponible", Validators.required],
    });
  }

  async ngOnInit() {
    await this.cargarServicios();
  }

  async cargarServicios() {
    try {
      this.servicios = await this.serviciosRepository.getServices();
      console.log("Servicios cargados:", this.servicios);
    } catch (error) {
      console.error("Error al cargar los servicios:", error);
    }
  }

  async agregarServicio() {
    if (this.servicioForm.valid) {
      const nuevoServicio: Service = {
        id: this.generateHexId(8),
        ...this.servicioForm.value,
      };

      try {
        await this.serviciosRepository.addService(nuevoServicio);
        await this.cargarServicios();
        this.servicioForm.reset({ disponibilidad: "disponible" });
        this.mostrarFormulario = false;
      } catch (error) {
        console.error("Error al agregar el servicio:", error);
      }
    } else {
      console.log("Formulario inválido");
    }
  }

  async eliminarServicio(id: string) {
    await this.serviciosRepository.deleteService(id);
    this.cargarServicios();
  }

  generateHexId(length: number): string {
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
}