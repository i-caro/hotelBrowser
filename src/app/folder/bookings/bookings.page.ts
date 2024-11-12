import { Component, OnInit } from '@angular/core';
import { Booking } from 'src/app/model/booking.model';
import { BookingsRepository } from 'src/app/repositories/bookings.repository';

@Component({
  selector: 'app-reservas',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {

  bookings: Booking[] = [];

  constructor(private bookingsRepository: BookingsRepository) {}

  ngOnInit() {
    this.cargarBookings();
  }

  cargarBookings() {
    this.bookingsRepository.getReservas().subscribe((data) => {
      this.bookings = data;
    });
  }

  agregarReserva(nuevaReserva:Booking) {
    this.bookingsRepository.addReserva(nuevaReserva);
  }
}
