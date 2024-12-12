import { Component, OnDestroy, OnInit } from '@angular/core';
import { SensorService } from '../main-layout/services/sensor.service';
import { INode } from './device.model';

@Component({
  selector: 'app-device-cards',
  templateUrl: './device-cards.component.html',
  styleUrls: ['./device-cards.component.scss']
})
export class DeviceCardsComponent implements OnInit, OnDestroy {

  nodes: INode[];
  showSensorList  =false;
  selectedNode = null;
  sub=null;

  constructor(
    private sensorService: SensorService
  ) { }

  ngOnDestroy(): void {
    if(this.sub) {
      clearInterval(this.sub);
    }
  }
  
  ngOnInit(): void {
    this.getNodeList();
    this.sub = setInterval(() => {
      this.getNodeList();
    }, 5000)
  }

  getNodeList() {
    console.time('device');
    this.sensorService.getNodeList().subscribe(res=>{
      if(res?.data) {
        console.timeEnd('device');
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
