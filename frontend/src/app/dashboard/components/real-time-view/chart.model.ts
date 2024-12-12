export const commonOption = {
  toolTip: {
    shared: true,
  },
  zoomEnabled: true,
  legend: {
    cursor: 'pointer',
    verticalAlign: 'top',
    fontSize: 18,
    fontColor: 'dimGrey',
    itemclick: function (e: any) {
      if (typeof e.dataSeries.visible === 'undefined' || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      } else {
        e.dataSeries.visible = true;
      }
      e.chart.render();
    },
  },
};

export const commonDataDef = {
  type: 'area',
  markerType: "circle",
  markerSize: 8, 
  xValueType: 'dateTime',
  xValueFormatString: 'hh:mm:ss TT',
  showInLegend: true,
};

export interface ISensorMap {
  latestSensorData?: any;
  temPoints?: {x: string, y: number}[],
  pressurePoints?:{x: string, y: number}[]
}
