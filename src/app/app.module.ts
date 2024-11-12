import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


const dbConfig: DBConfig = {
  name: 'AdminAppDB',
  version: 1,
  objectStoresMeta: [
    {
      store: 'bookings',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'servicioId', keypath: 'servicioId', options: { unique: false } },
        { name: 'userId', keypath: 'userId', options: { unique: false } },
        { name: 'startDate', keypath: 'startDate', options: { unique: false } },
        { name: 'endDate', keypath: 'endDate', options: { unique: false } },
        { name: 'peopleAmount', keypath: 'peopleAmount', options: { unique: false } },
        { name: 'preferences', keypath: 'preferences', options: { unique: false } },
        { name: 'state', keypath: 'state', options: { unique: false } },
        { name: 'totalPayed', keypath: 'totalPayed', options: { unique: false } },
      ]
    },
    {
      store: 'users',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'surname', keypath: 'surname', options: { unique: true } },
        { name: 'email', keypath: 'email', options: { unique: false } },
        { name: 'phone', keypath: 'phone', options: { unique: false } },
        { name: 'adress', keypath: 'adress', options: { unique: false } },
        { name: 'imgUrl', keypath: 'imgUrl', options: { unique: false } },
      ]
    },
    {
      store: 'services',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'type', keypath: 'type', options: { unique: true } },
        { name: 'description', keypath: 'description', options: { unique: false } },
        { name: 'location', keypath: 'location', options: { unique: false } },
        { name: 'latitud', keypath: 'latitud', options: { unique: false } },
        { name: 'longitud', keypath: 'longitud', options: { unique: false } },
        { name: 'price', keypath: 'price', options: { unique: false } },
        { name: 'imgUrl', keypath: 'imgUrl', options: { unique: false } },
        { name: 'available', keypath: 'available', options: { unique: false } },
      ]
    }
  ]
};

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, NgxIndexedDBModule.forRoot(dbConfig)],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
