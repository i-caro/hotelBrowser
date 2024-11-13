import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalDatabase } from '../localDatabase/local-database';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  constructor(private navCtrl: NavController, private localDatabase: LocalDatabase<{ username: string; password: string }>) {}

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.checkLogin();
  }


  async checkLogin() {
    const isLoggedIn = await this.localDatabase.isUserLoggedIn();
    if (!isLoggedIn) {
      this.navCtrl.navigateRoot('/login');
    }
  }
}
