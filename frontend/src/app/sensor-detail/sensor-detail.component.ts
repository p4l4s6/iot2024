import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SensorService } from '../main-layout/services/sensor.service';
import { ISensor } from '../sensor-list/sensor_list.model';
import { ChartService } from '../dashboard/components/real-time-view/services/chart.service';
import { ViewType } from '../shared/shared.model';

@Component({
  selector: 'app-sensor-detail',
  templateUrl: './sensor-detail.component.html',
  styleUrls: ['./sensor-detail.component.scss'],
})
export class SensorDetailComponent implements OnInit {
  @Input() display: boolean = false;
  @Input() sensorInfo: ISensor;
  @Output() closePopup: EventEmitter<boolean> = new EventEmitter<boolean>();
  showChartView = true;
  viewType = ViewType;
  sensorData = [];

  constructor(
    private sensorService: SensorService
  ) {}

  ngOnInit(): void {
    this.getSensorHistoricalData();
  }

  getSensorHistoricalData() {
    this.sensorService
      .getSensorDataById(this.sensorInfo.id)
      .subscribe((res) => {
        this.sensorData = res.data.results;
      });
  }

  switchViewHandler(view: ViewType) {
    switch(view) {
      case ViewType.CHART_VIEW:
        this.showChartView  =true;
        break;

      case ViewType.TABLE_VIEW:
        this.showChartView  =false;
        break;
    }
  }

  close() {
    this.display = false;
    this.closePopup.emit(this.display);
  }

}
