import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './autenticacion/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  isAuthenticated = false;
  authForm!: FormGroup;
  isRegisterMode = false; 
  userName = '';
  userEmail = '';

  public appPages = [
    { title: 'Perfil', url: '/folder/profile', icon: 'person' },
    { title: 'Servicios', url: '/folder/services', icon: 'bed' },
    { title: 'Reservas', url: '/folder/bookings', icon: 'book' },
    { title: 'Usuarios', url: '/folder/users', icon: 'people' },
    { title: 'Mapa', url: '/folder/map', icon: 'location' },
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.authForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.email]
    });

    this.isAuthenticated = this.authService.isLoggedIn();
    if (this.isAuthenticated) {
      const user = this.authService.getAuthenticatedUser();
      this.userName = user?.username || '';
      this.userEmail = user?.email || '';
    }

    this.authService.authStatus.subscribe((isAuthenticated) => {
      this.ngZone.run(() => {
        this.isAuthenticated = isAuthenticated;
        if (isAuthenticated) {
          const user = this.authService.getAuthenticatedUser();
          this.userName = user?.username || '';
          this.userEmail = user?.email || '';
        } else {
          this.router.navigate(['/login']);
        }
      });
    });
  }

  onAuthSubmit() {
    const { username, password, email } = this.authForm.value;

    if (this.isRegisterMode) {
      if (this.authService.register(username, password, email)) {
        alert('Registro exitoso');
        this.isRegisterMode = false;
        this.authForm.reset();
      } else {
        alert('El usuario ya existe');
      }
    } else {
      if (this.authService.login(username, password)) {
        this.ngZone.run(() => {
          this.isAuthenticated = true;
          const user = this.authService.getAuthenticatedUser();
          this.userName = user?.username || '';
          this.userEmail = user?.email || '';
        });this.router.navigate(['/folder']);
      } else {
        alert('Credenciales incorrectas');
      }
    }
  }

  toggleAuthMode() {
    this.isRegisterMode = !this.isRegisterMode;
  }
}
