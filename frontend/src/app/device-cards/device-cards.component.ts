import { Component, OnInit } from '@angular/core';
import { SensorService } from '../main-layout/services/sensor.service';
import { INode } from './device.model';

@Component({
  selector: 'app-device-cards',
  templateUrl: './device-cards.component.html',
  styleUrls: ['./device-cards.component.scss']
})
export class DeviceCardsComponent implements OnInit {

  nodes: INode[];
  showSensorList  =false;
  selectedNode = null;
  constructor(
    private sensorService: SensorService
  ) { }

  ngOnInit(): void {
    this.getNodeList();
    setInterval(() => {
      this.getNodeList();
    }, 5000)
  }

  getNodeList() {
    this.sensorService.getNodeList().subscribe(res=>{
      if(res?.data) {
        this.nodes = res.data.results;
        // this.nodes[0].is_active =false;
      }
    })
  }

  sensorList(node:INode) {
    this.showSensorList = true;
    this.selectedNode = node;
  }

  closeList() {
    this.showSensorList = false;
    this.selectedNode = null;
  }

}
