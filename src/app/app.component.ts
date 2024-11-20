import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './autenticacion/auth.service';
import { SyncService } from './strapi/sync.service';

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
    private ngZone: NgZone,
    private syncService: SyncService
  ) {}

  async ngOnInit() {
    await this.syncService.syncServices();
    this.authForm = this.fb.group({
      username: ['', Validators.required, Validators.min(3)],
      surname: ['', Validators.required, Validators.min(3)],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    });


    this.isAuthenticated = this.authService.isLoggedIn();
  if (this.isAuthenticated) {
    const user = await this.authService.getAuthenticatedUser();
    this.userName = user?.username || '';
    this.userEmail = user?.email || '';
  }


  this.authService.authStatus.subscribe(async (isAuthenticated) => {
    this.ngZone.run(async () => {
      this.isAuthenticated = isAuthenticated;
      if (isAuthenticated) {
        const user = await this.authService.getAuthenticatedUser();
        this.userName = user?.username || '';
        this.userEmail = user?.email || '';
      } else {
        this.router.navigate(['/folder']);
      }
    });
  });
  }

  async onAuthSubmit() {
    const { username, surname, password, email, phone } = this.authForm.value;
    const imgUrl = 'assets/default-user.png';
  
    if (this.isRegisterMode) {
      const success = await this.authService.register(username, surname, password, email, phone, imgUrl);
      if (success) {
        this.isRegisterMode = false;
        this.authForm.reset();
      } else {
        alert('El usuario ya existe o hubo un error');
      }
    } else {
      const success = await this.authService.login(username, password);
      if (success) {
        this.ngZone.run(async () => {
          this.isAuthenticated = true;
          const user = await this.authService.getAuthenticatedUser();
          this.userName = user?.username || '';
          this.userEmail = user?.email || '';
          location.reload();
        });
        this.router.navigate(['/folder']);
      } else {
        alert('Credenciales incorrectas');
      }
    }
  }

  toggleAuthMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.authForm.reset();
  }
}