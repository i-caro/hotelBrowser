import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersRepository {

  constructor(private dbService: NgxIndexedDBService) {}

  addUser(user: User){
    this.dbService.add('users', user);
  }

  getUsers(): Observable<User[]> {
    return this.dbService.getAll('users');
  }

  updateUser(user: User): Observable<User> {
    return this.dbService.update('users', user);
  }

  deleteUser(id: string): Observable<User[]> {
    return this.dbService.delete('users', id);
  }
}