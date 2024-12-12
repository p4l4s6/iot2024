import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from 'src/app/base-http.service';

@Injectable({
  providedIn: 'root',
})
export class SensorService {
  constructor(private baseHttp: BaseHttpService) {}

  getSensorListByDevice(deviceId: number): Observable<any> {
    return this.baseHttp.get(`sensor?device=${deviceId}`);
  }

  getSensorList(): Observable<any> {
    return this.baseHttp.get(`sensor`);
  }


  getSensorDataById(sensorId:number,limit=null, offset=null): Observable<any> {
    return this.baseHttp.get(`data?sensor=${sensorId}&limit=${limit}`)
  }

  getNodeList(): Observable<any> {
    return this.baseHttp.get(`device`)
  }

  getSensorDataRealTime(sensorId: string, url?): Observable<any> {
    if(url) {
      return this.getSensorDataRealTimeWithDirectURL(url);
    } else {
      return this.baseHttp.get(`data?sensor=${sensorId}`)
    }
  }
  getSensorDataRealTimeWithDirectURL(url): Observable<any> {
    return this.baseHttp.get(url, true)
  }

  sendMsgToDisplay(sensorId: number, data) {
    return this.baseHttp.post(`sensor/publish/${sensorId}/`, data)
  }
}
