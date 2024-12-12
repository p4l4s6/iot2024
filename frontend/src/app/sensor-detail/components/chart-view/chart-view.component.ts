import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { commonDataDef } from 'src/app/dashboard/components/real-time-view/chart.model';
import { ChartService } from 'src/app/dashboard/components/real-time-view/services/chart.service';
import { SensorService } from 'src/app/main-layout/services/sensor.service';
import { ISensor } from 'src/app/sensor-list/sensor_list.model';

@Component({
  selector: 'app-chart-view',
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.scss'],
})
export class ChartViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() sensorInfo: ISensor;
  sensorData: any[] = [];
  anomolyData: any[] = [];
  limit = 30;
  tempretureOptions ;
  pressureOptions ;
  tempretureChart: any = null;
  pressureChart: any = null;
  sub=null;

  constructor(
    private chartService: ChartService,
    private sensorService: SensorService
  ) {}

  ngOnDestroy(): void {
    if(this.sub) {
      clearInterval(this.sub);
    }
  }
  

  ngAfterViewInit() {
    this.sub = setInterval(() => {
      this.updateChart();
    }, 600);
  }

  ngOnInit(): void {
    this.getChartOptions();
  }

  getChartOptions() {
    this.tempretureOptions = this.chartService.getTempretureOption(
      this.getTempretureDataDef()
    );

    this.tempretureChart?.render();
    this.pressureOptions = this.chartService.getpressureOption(
      this.getPressureDataDef()
    );
  }

  getTempretureDataDef() {
    return [
      {
        name: `Sensor ${this.sensorInfo.id}`,
        dataPoints: this.getTempretureData(this.sensorData),
        toolTipContent: `{x}: Sensor ${this.sensorInfo.id}: {y} °C`,
        ...commonDataDef,
      }, {
        name: `Sensor ${this.sensorInfo.id} - Anomoly`,
        dataPoints: this.getTempretureData(this.anomolyData),
        toolTipContent: `{x}: Sensor ${this.sensorInfo.id}: {y} °C`,
        fillOpacity: 0.6,
        ...commonDataDef,
      }
    ];
  }

  getTempretureData(sensorData) {
    return sensorData.map((dp) => {
      return {
        x: new Date(dp.created_at),
        y: dp.data.temp,
        color: dp.data.is_anomaly? 'red':''
      };
    });
  }

  getPressureData(sensorData) {
    return sensorData.map((dp) => {
      return {
        x: new Date(dp.created_at),
        y: dp.data.pressure,
        color: dp.data.is_anomaly? 'red':''
      };
    });
  }

  getPressureDataDef() {
    return [
      {
        name: `Sensor ${this.sensorInfo.id}`,
        dataPoints: this.getPressureData(this.sensorData),
        toolTipContent: `{x}: Sensor ${this.sensorInfo.id}: {y} hPa`,
        ...commonDataDef,
      },{
        name: `Sensor ${this.sensorInfo.id} - Anomoly`,
        dataPoints: this.getPressureData(this.anomolyData),
        toolTipContent: `{x}: Sensor ${this.sensorInfo.id}: {y} hPa`,
        fillOpacity: 0.6,
        ...commonDataDef,
      }
    ];
  }

  getChartInstanceTempreture(chart: any) {
    this.tempretureChart = chart;
  }
  getChartInstancePressure(chart: any) {
    this.pressureOptions = chart;
  }
  

  updateChart() {
    console.time('sensor data');
    this.sensorService
    .getSensorDataById(this.sensorInfo.id, this.limit)
    .subscribe((res) => {
      console.timeEnd('sensor data');
      this.sensorData = res.data.results;
      this.anomolyData =this.sensorData.filter(sensor=>sensor.data.is_anomaly);
      this.getChartOptions();

      this.tempretureChart?.render();
      this.pressureChart?.render();
    });
  }


}
