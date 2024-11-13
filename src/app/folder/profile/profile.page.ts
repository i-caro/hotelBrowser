import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/autenticacion/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userName = ''; 
  userEmail = ''; 

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getAuthenticatedUser();
    if (user) {
      this.userName = user.username;
      this.userEmail = user.email;
    }
  }

  logout() {
    this.authService.logout();
  }
}
