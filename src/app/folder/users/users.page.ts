import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/autenticacion/auth.service';
import { User } from 'src/app/model/user.model';
import { UsersRepository } from 'src/app/repositories/users.repository';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  users: User[] = [];

  constructor(
    private usersRepository: UsersRepository,
    private authService: AuthService,
  ) {}


  public appPages = [
    { title: 'PROFILE', url: '/folder/profile', icon: 'person' },
    { title: 'SERVICES', url: '/folder/services', icon: 'bed' },
    { title: 'RESERVATIONS', url: '/folder/bookings', icon: 'book' },
    { title: 'USERS', url: '/folder/users', icon: 'people' },
    { title: 'MAP', url: '/folder/map', icon: 'location' },
  ];


  async ngOnInit() {
    this.users = await this.usersRepository.getUsuarios();
  }


  async eliminarUsuario(userId: string) {
    const authenticatedUser = await this.authService.getAuthenticatedUser();
    if (authenticatedUser?.id === userId) {
      alert('No puedes eliminar el usuario que tiene la sesión iniciada.');
      return;
    }
  
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este usuario?');
    if (confirmDelete) {
      try {
        await this.usersRepository.deleteUsuario(userId);

        this.users = this.users.filter(user => user.id !== userId);
  
        alert('Usuario eliminado exitosamente.');
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        alert('Hubo un error al intentar eliminar el usuario.');
      }
    }
  }
}