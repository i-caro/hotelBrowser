import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FolderPage } from './folder.page';
import { ProfilePage } from './profile/profile.page';
import { BookingsPage } from './bookings/bookings.page';
import { MapPage } from './map/map.page';
import { ServicesPage } from './services/services.page';
import { UsersPage } from './users/users.page';

const routes: Routes = [
  {
    path: 'profile',
    component: ProfilePage,
  },
  {
    path: 'services',
    component: ServicesPage,
  },
  {
    path: 'bookings',
    component: BookingsPage,
  },
  {
    path: 'users',
    component: UsersPage,
  },
  {
    path: 'map',
    component: MapPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FolderPageRoutingModule {}
