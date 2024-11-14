import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicesRepository } from 'src/app/repositories/service.repository';
import { BookingsRepository } from 'src/app/repositories/bookings.repository';
import { Booking } from 'src/app/model/booking.model';
import { Service } from 'src/app/model/service.model';
import { AuthService } from 'src/app/autenticacion/auth.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  mostrarFormulario = false;
  bookingForm: FormGroup;
  availableServices: Service[] = [];
  bookings: Booking[] = [];
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private servicesRepository: ServicesRepository,
    private bookingsRepository: BookingsRepository,
    private authService: AuthService
  ) {
    this.bookingForm = this.fb.group({
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
    await this.cargarReservas();
    this.servicesRepository.getAvailableServices().subscribe((services) => {
      this.availableServices = services;
    });

    const user = this.authService.getAuthenticatedUser();
    if (user) {
      this.userId = user.id;
      this.bookingForm.patchValue({ userId: this.userId });
    }
  }

  async addBooking() {
    if (this.bookingForm.valid) {
      const nuevaReserva: Booking = {
        id: this.generateHexId(8),
        ...this.bookingForm.value,
        userId: this.authService.getAuthenticatedUser()?.id
      };
  
      try {
        await this.bookingsRepository.addReserva(nuevaReserva);
        await this.cargarReservas();
        this.bookingForm.reset({ serviceId: "", date: "" });
        this.mostrarFormulario = false;
      } catch (error) {
        console.error("Error al agregar la reserva:", error);
      }
    } else {
      console.log("Formulario inválido");
    }
  }

  loadAvailableServices() {
    this.servicesRepository.getAvailableServices().subscribe((services) => {
      this.availableServices = services;
    });
  }

  async cargarReservas() {
    try {
      this.bookings = await this.bookingsRepository.getReservas();
      console.log("Reservas cargadas:", this.bookings);
    } catch (error) {
      console.error("Error al cargar las reservas:", error);
    }
  }

  async eliminarReserva(id: string) {
    await this.bookingsRepository.deleteReserva(id);
    this.cargarReservas();
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