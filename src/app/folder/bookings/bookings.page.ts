import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Booking } from 'src/app/model/booking.model';
import { BookingsRepository } from 'src/app/repositories/bookings.repository';

@Component({
  selector: 'app-reservas',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {

  mostrarFormulario = false;
  servicioForm: FormGroup;
  bookings: Booking[] = [];

  constructor(
    private fb: FormBuilder,
    private bookingsRepository: BookingsRepository
  ) {
    this.servicioForm = this.fb.group({
      id: ["", Validators.required],
      serviceId: ["", Validators.required], 
      userId: ["", Validators.required], 
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      peopleAmount: ["", Validators.required],
      preferences: ["", Validators.required],
      estado: ["", Validators.required],
      totalPayed: ["", Validators.required]
    });
  }

  async ngOnInit() {
    await this.cargarServicios();
  }

  async cargarServicios() {
    try {
      this.bookings = await this.bookingsRepository.getReservas();
      console.log("Reservas cargadas:", this.bookings);
    } catch (error) {
      console.error("Error al cargar las reservas:", error);
    }
  }

  async agregarServicio() {
    if (this.servicioForm.valid) {
      const nuevaReserva: Booking = {
        id: this.generateHexId(8),
        ...this.servicioForm.value,
      };

      try {
        await this.bookingsRepository.addReserva(nuevaReserva);
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
    await this.bookingsRepository.deleteReserva(id);
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
