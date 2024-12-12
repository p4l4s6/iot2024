import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { SensorService } from 'src/app/main-layout/services/sensor.service';
import { ISensor } from 'src/app/sensor-list/sensor_list.model';

@Component({
  selector: 'app-historical-table-view',
  templateUrl: './historical-table-view.component.html',
  styleUrls: ['./historical-table-view.component.scss'],
})
export class HistoricalTableViewComponent implements OnInit {
  @Input() sensorData: any[];
  @Input() sensorInfo: ISensor;
  columns = [];
  
  constructor(
    private sensorService: SensorService
  ) {}

  ngOnInit(): void {
    this.sensorService
    .getSensorDataById(this.sensorInfo.id)
    .subscribe((res) => {
      this.sensorData = res.data.results;
      this.sensorData.forEach(data=>{
        data.tempreture = data.data.temp;
        data.pressure = data.data.pressure;
        data.isAnomaly = data.data.is_anomaly;
        data.created_at= formatDate(data.created_at, 'medium', 'en-US')
      
        data.updated_at= formatDate(data.updated_at, 'medium', 'en-US')
      });
  
      this.columns = [
        { field: 'id', header: 'ID', type: 'text' },
        // { field: 'sensor', header: 'Sensor', type: 'text' },
        { field: 'created_at', header: 'Created Date', type: 'date' },
        { field: 'updated_at', header: 'Updated Date', type: 'date' },
        { field: 'tempreture', header: 'Temperature (℃)', type: 'text' },
        { field: 'pressure', header: 'Pressure (hPa)', type: 'text' },
        {field: 'isAnomaly', header: 'Is Anomaly', type:'text'}
      ];
    });
   
  
  }

 
}
