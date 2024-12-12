import { Injectable } from '@angular/core';
import { commonOption } from '../chart.model';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  constructor() {}

  getTempretureOption(data=[], additionalOptions?) {
    return {
      ...commonOption,
      ...{
        title: {
          text: 'Temperature',
        },
        axisX: {
          valueFormatString: "HH:mm:ss", 
          labelFormatter: (e) => e.value.toLocaleString(),
        },
        axisY: {
          suffix: '℃',
        },
        data,
      },
      ...additionalOptions,
    };
  }

  getpressureOption(data=[], additionalOptions?) {
    return {
      ...commonOption,
      ...{
        title: {
          text: 'Pressure',
        },
        axisX: {
          valueFormatString: "HH:mm:ss", 
          labelFormatter: (e) => e.value.toLocaleString(),
        },
        axisY: {
          suffix: 'hPa',
        },
        data,
      },
      ...additionalOptions,
    };
  }

  // retain last {windowsize} of data point to ensure the chart is properly displayed with conpact data
  handleWindowSize(dataSets: any[][], windowSize = 30) {
    for (let dataset of dataSets) {
      if (dataset.length > windowSize) {
        dataset = dataset.shift();
      }
    }
  }
}
