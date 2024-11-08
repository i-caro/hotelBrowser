import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Profile', url: '/folder/profile', icon: 'person' },
    { title: 'Hotels', url: '/folder/hotels', icon: 'bed' },
    { title: 'Bookings', url: '/folder/bookings', icon: 'book' },
    { title: 'Map', url: '/folder/map', icon: 'location' },
  ];
  constructor() {}
}
