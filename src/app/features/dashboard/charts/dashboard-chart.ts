import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';

import { ApexChartView } from './to-apex';

@Component({
  selector: 'app-dashboard-chart',
  imports: [ChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <apx-chart
      [series]="view().series"
      [chart]="view().chart"
      [xaxis]="view().xaxis"
      [yaxis]="view().yaxis"
      [colors]="view().colors"
      [stroke]="view().stroke"
      [fill]="view().fill"
      [legend]="view().legend"
      [grid]="view().grid"
      [tooltip]="view().tooltip"
      [dataLabels]="view().dataLabels"
      [markers]="view().markers"
      [plotOptions]="view().plotOptions"
      [noData]="view().noData"
    />
  `,
})
export class DashboardChart {
  readonly view = input.required<ApexChartView>();
}
