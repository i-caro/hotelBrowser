import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Profile', url: '/profile', icon: 'person' },
    { title: 'Services', url: '/services', icon: 'bed' },
    { title: 'Bookings', url: '/bookings', icon: 'book' },
    { title: 'Users', url: '/users', icon: 'people' },
    { title: 'Map', url: '/map', icon: 'location' },
  ];
  constructor() {}
}
