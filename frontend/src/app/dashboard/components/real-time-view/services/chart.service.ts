import { Injectable } from '@angular/core';
import { commonOption } from '../chart.model';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  constructor() {}

  getTempretureOption(data = [], additionalOptions?) {
    return {
      ...commonOption,
      ...{
        title: {
          text: 'Temperature',
        },
        axisX: {
          labelAngle: 40,
          valueFormatString: 'HH:mm:ss',
          labelFormatter: (e) => {
            const date = new Date(e.value);
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
            return `${hours}:${minutes}:${seconds}.${milliseconds}`;
          },
        },
        axisY: {
          suffix: '℃',
        },
        data,
      },
      ...additionalOptions,
    };
  }

  getpressureOption(data = [], additionalOptions?) {
    return {
      ...commonOption,
      ...{
        title: {
          text: 'Pressure',
        },
        axisX: {
          labelAngle: 40,
          valueFormatString: 'HH:mm:ss',
          labelFormatter: (e) => {
            const date = new Date(e.value);
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
            return `${hours}:${minutes}:${seconds}.${milliseconds}`;
          },
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
