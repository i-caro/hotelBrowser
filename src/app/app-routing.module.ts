import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ProfilePage } from './folder/profile/profile.page';
import { BookingsPage } from './folder/bookings/bookings.page';
import { MapPage } from './folder/map/map.page';
import { HotelsPage } from './folder/hotels/hotels.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Inbox',
    pathMatch: 'full'
  },
  {
    path: 'profile',
    loadChildren: () => import('./folder/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'hotels',
    loadChildren: () => import('./folder/hotels/hotels.module').then( m => m.HotelsPageModule)
  },
  {
    path: 'bookings',
    loadChildren: () => import('./folder/bookings/bookings.module').then( m => m.BookingsPageModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./folder/map/map.module').then( m => m.MapPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
