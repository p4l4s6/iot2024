import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ChartService } from './services/chart.service';
import { commonDataDef, ISensorMap } from './chart.model';
import { SensorService } from 'src/app/main-layout/services/sensor.service';
import { formatDate } from '@angular/common';

// import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
@Component({
  selector: 'real-time-view',
  templateUrl: './real-time-view.component.html',
  styleUrls: ['./real-time-view.component.scss'],
})
export class RealTimeViewComponent implements OnInit, AfterViewInit {
  tempretureOptions: any = [];
  pressureOptions: any = [];
  tempretureChart: any = null;
  pressureChart: any = null;

  sensorMap = new Map<string, ISensorMap>(); // key: sensorId

  constructor(
    private chartService: ChartService,
    private sensorService: SensorService
  ) {}

  ngOnInit(): void {
    this.getSensorList();
    this.getTempretureOption();
    this.getpressureOption();
  }

  getTempretureOption() {
    this.tempretureOptions = this.chartService.getTempretureOption();
  }
  getpressureOption() {
    this.pressureOptions = this.chartService.getpressureOption();
  }

  ngAfterViewInit() {
    setInterval(() => {
      this.updateChart();
    }, 5000);
  }

  updateChart() {
    Array.from(this.sensorMap.keys()).forEach((sensorId) => {
      if (!this.sensorMap.get(sensorId)) {
        return;
      }

      this.getSensorData(sensorId);
    });
  }

  getSensorList() {
    this.sensorService.getSensorList().subscribe((res) => {
      if (res?.data?.results?.length) {
        res.data.results.forEach((sensor) => {
          this.sensorMap.set(sensor.id, null);
        });
        Array.from(this.sensorMap.keys()).forEach((sensorId) => {
          this.getSensorData(sensorId);
        });
      }
    });
  }

  getSensorData(sensorId: string) {
    this.sensorService.getSensorDataRealTime(sensorId).subscribe((res) => {
      if (res?.data?.results?.length) {
        this.sensorMap.set(sensorId, {
          latestSensorData: res.data.results[0],
          temPoints: res.data.results.map((p) => {
            return {
              x: new Date(p.created_at).getTime(),
              y: JSON.parse(p.data).temp,
            };
          }),
          pressurePoints: res.data.results.map((p) => {
            return {
              x: new Date(p.created_at).getTime(),
              y: JSON.parse(p.data).pressure,
            };
          }),
        });
        this.updateChartOptions(sensorId);
        this.tempretureChart.render();
        this.pressureChart.render();
      }
    });
  }

  updateChartOptions(sensorId: string) {
    this.updateTemChart(sensorId);
    this.updatePressureChart(sensorId);
  }

  updateTemChart(sensorId: string) {
    const d = this.tempretureOptions.data.find((data) => data.id == sensorId);
    if (d?.dataPoints?.length) {
      d.dataPoints = this.sensorMap.get(sensorId).temPoints;
    } else {
      this.tempretureOptions.data.push({
        id: sensorId,
        name: 'Sensor ' + sensorId,
        dataPoints: this.sensorMap.get(sensorId).temPoints,
        toolTipContent: `{x}: Sensor ${sensorId}: {y} °C`,
        ...commonDataDef,
      });
    }
  }

  updatePressureChart(sensorId: string) {
    const d = this.pressureOptions.data.find((data) => data.id == sensorId);
    if (d?.dataPoints?.length) {
      d.dataPoints = this.sensorMap.get(sensorId).pressurePoints;
    } else {
      this.pressureOptions.data.push({
        id: sensorId,
        name: 'Sensor ' + sensorId,
        dataPoints: this.sensorMap.get(sensorId).pressurePoints,
        toolTipContent: `{x}: Sensor ${sensorId}: {y} hPa`,
        ...commonDataDef,
      });
    }
  }

  getChartInstanceTempreture(chart: any) {
    this.tempretureChart = chart;
  }
  getChartInstancepressure(chart: any) {
    this.pressureChart = chart;
  }
}
