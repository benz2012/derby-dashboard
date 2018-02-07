
export default class LineConfig {
  constructor(values, color, scale) {
    const blankLabels = new Array(values.length).fill('_') // never shown
    this.data = {
      labels: blankLabels,
      datasets: [{
        data: values,
        fill: false,
        borderColor: color,
        pointBorderWidth: 0,
        pointRadius: 0,
        pointBackgroundColor: color,
        pointHoverRadius: 3,
        pointHitRadius: 3,
        lineTension: 0,
        borderJoinStyle: 'round',
      }],
    }

    this.options = {
      layout: {
        padding: {
          left: 10, right: 20, top: 10, bottom: 16,
        },
      },
      legend: {
        display: false,
      },
      scales: {
        // yAxes: [{
        //   ticks: {
        //     max: scale,
        //     min: 0,
        //     stepSize: scale / 2,
        //   },
        // }],
        xAxes: [{
          display: false,
        }],
      },
    }
  }
}
