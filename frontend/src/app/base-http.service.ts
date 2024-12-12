import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from './shared/shared.model';

@Injectable({
  providedIn: 'root'
})
export class BaseHttpService {
  headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(
    private http: HttpClient
  ) { }

  get(url:string, skipBase = false) {
    return this.http.get(skipBase?url: BASE_URL + url, {headers: this.headers});
  }

  
  post(url:string, body, skipBase = false) {
    return this.http.post(skipBase?url: BASE_URL + url, body, {headers: this.headers});
  }
}
