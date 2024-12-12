import { Injectable } from '@angular/core';
import { IUser } from '../../shared/shared.model';
import { BaseHttpService } from 'src/app/base-http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: IUser = {};

  constructor() {}

  setUser(user: IUser) {
    this.user = user;
  }
  getUserInfo() {
    if(this.user && Object.keys(this.user).length > 0) {
        return this.user;
    } else {
        return JSON.parse(localStorage.getItem("user") as any)
    }
    
  }
}
