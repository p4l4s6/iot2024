import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '../base-http.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(
    private baseHttp: BaseHttpService
  ) { }
    
  test(): Observable<any> {
    return this.baseHttp.get('data/?limit=1&offset=1&sensor=1');
  }

}
