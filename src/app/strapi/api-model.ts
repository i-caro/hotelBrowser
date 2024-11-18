import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiModel<T> {
  private baseUrl = 'https://hotelbrowserstrapi-service.onrender.com';

  constructor(private http: HttpClient) {}

  getAll(type: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/${type}`);
  }

  getById(id: string, type: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/${type}/${id}?`);
  }

  add(model: { data: T }, type: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/${type}`, model);
  }

  update(id: string, model: { data: T }, type: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/api/${type}/${id}`, model);
  }

  delete(id: string, type: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/${type}/${id}`);
  }
  findByCustomId(type: string, customId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/${type}?filters[id][$eq]=${customId}`);
  }
}