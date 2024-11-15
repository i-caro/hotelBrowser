import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user.model';
import { UsersRepository } from 'src/app/repositories/users.repository';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  users: User[] = [];

  constructor(private usersRepository: UsersRepository) {}

  async ngOnInit() {
    this.users = await this.usersRepository.getUsuarios();
  }
}