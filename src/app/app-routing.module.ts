import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

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
    path: 'bookings',
    loadChildren: () => import('./folder/bookings/bookings.module').then( m => m.BookingsPageModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./folder/map/map.module').then( m => m.MapPageModule)
  },
  {
    path: 'services',
    loadChildren: () => import('./folder/services/services.module').then( m => m.ServicesPageModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./folder/users/users.module').then( m => m.UsersPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
