import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './autenticacion/auth.guard';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/folder', 
    pathMatch: 'full' 
  },
  { 
    path: 'folder', 
    loadChildren: () => import('./folder/folder.module').then(m => m.FolderPageModule),
    canActivate: [AuthGuard] 
  },
  {
    path: 'profile',
    loadChildren: () => import('./folder/profile/profile.module').then(m => m.ProfilePageModule),
    canActivate: [AuthGuard] 
  },
  {
    path: 'bookings',
    loadChildren: () => import('./folder/bookings/bookings.module').then(m => m.BookingsPageModule),
    canActivate: [AuthGuard] 
  },
  {
    path: 'map',
    loadChildren: () => import('./folder/map/map.module').then(m => m.MapPageModule),
    canActivate: [AuthGuard] 
  },
  {
    path: 'services',
    loadChildren: () => import('./folder/services/services.module').then(m => m.ServicesPageModule),
    canActivate: [AuthGuard] 
  },
  {
    path: 'users',
    loadChildren: () => import('./folder/users/users.module').then(m => m.UsersPageModule),
    canActivate: [AuthGuard] 
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
