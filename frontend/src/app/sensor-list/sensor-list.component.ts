import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ISensor, SENSOR_COLUMN } from './sensor_list.model';
import { SensorService } from '../main-layout/services/sensor.service';
import { INode } from '../device-cards/device.model';

@Component({
  selector: 'app-sensor-list',
  templateUrl: './sensor-list.component.html',
  styleUrls: ['./sensor-list.component.scss'],
})
export class SensorListComponent implements OnInit {
  @Input() node: INode = null;
  @Output() returnToParent: EventEmitter<boolean> = new EventEmitter<boolean>();

  cols = SENSOR_COLUMN;
  sensors: ISensor[] = [];
  showDetail = false;
  selectedSensor: ISensor = null;
  showDisplayPopup = false;
  constructor(private sensorService: SensorService) {}

  ngOnInit(): void {
    this.getSensorListByDevice();
  }

  getSensorListByDevice() {
    console.time('sensors');
    this.sensorService.getSensorListByDevice(this.node.id).subscribe((res) => {
      console.timeEnd('sensors');
      if (res?.data) {
        this.sensors = res.data.results.sort((a, b) => a.id - b.id);
      }
    });
  }

  openSensorDetail(index: number) {
    this.selectedSensor = this.sensors[index];
    this.showDetail = true;
  }
  onClose(e: any) {
    console.log('closed:', e);
    this.showDetail = false;
    this.selectedSensor = null;
  }

  returnToNode() {
    this.returnToParent.emit(true);
  }

  openPopupDisplay(index: number) {
    this.selectedSensor = this.sensors[index];
    this.showDisplayPopup = true;
  }

  closeDisplayPopup(e) {
    this.showDisplayPopup = false;
    this.selectedSensor = null;
  }
}
