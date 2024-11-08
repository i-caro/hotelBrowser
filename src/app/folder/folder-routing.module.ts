import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FolderPage } from './folder.page';
import { ProfilePage } from './profile/profile.page';
import { HotelsPage } from './hotels/hotels.page';
import { BookingsPage } from './bookings/bookings.page';
import { MapPage } from './map/map.page';

const routes: Routes = [
  {
    path: 'profile',
    component: ProfilePage,
  },
  {
    path: 'hotels',
    component: HotelsPage,
  },
  {
    path: 'bookings',
    component: BookingsPage,
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
