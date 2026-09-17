import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexNoData,
  ApexPlotOptions,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';

import {
  areaChart,
  areaFill,
  attendeesAxis,
  barChart,
  barFill,
  barPlotOptions,
  CHART_SERIES_COLORS,
  chartDataLabels,
  chartGrid,
  chartInk,
  chartLegend,
  chartMarkers,
  chartStroke,
  chartTooltip,
  hiddenLegend,
  lineChart,
  noChartData,
} from './chart-theme';
import { DateRange, NamedSeries, NamedValue, XAxisDensity } from './named-series';

const DAY_MS = 24 * 60 * 60 * 1000;
const SUNDAY_SERVICE_SUFFIX = ' Sunday Service';

export interface ApexChartView {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  colors: string[];
  stroke: ApexStroke;
  fill: ApexFill;
  legend: ApexLegend;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  plotOptions: ApexPlotOptions;
  noData: ApexNoData;
}

export function parsePointName(name: string): number | null {
  const timestamp = Date.parse(name);
  return Number.isNaN(timestamp) ? null : timestamp;
}

export function xAxisDensity(start: Date, end: Date): XAxisDensity {
  const days = Math.abs(end.getTime() - start.getTime()) / DAY_MS;
  if (days >= 180) {
    return 'month';
  }
  if (days >= 45) {
    return 'week';
  }
  return 'day';
}

export function wrapCategoryLabel(name: string): string {
  if (name.endsWith(SUNDAY_SERVICE_SUFFIX)) {
    return `${name.slice(0, -SUNDAY_SERVICE_SUFFIX.length)}\nSunday Service`;
  }
  if (name.length <= 20) {
    return name;
  }
  const breakAt = name.lastIndexOf(' ', 20);
  if (breakAt > 8) {
    return `${name.slice(0, breakAt)}\n${name.slice(breakAt + 1)}`;
  }
  return name;
}

export function toAreaChartView(groups: NamedSeries[], range?: DateRange): ApexChartView {
  return toTimeSeriesView(groups, range, {
    chart: areaChart(),
    fill: areaFill,
    legend: groups.length > 1 ? chartLegend : hiddenLegend,
    emptyText: 'No attendance data for this range',
  });
}

export function toLineChartView(groups: NamedSeries[], range?: DateRange): ApexChartView {
  return toTimeSeriesView(groups, range, {
    chart: lineChart(),
    fill: { type: 'solid', opacity: 0 },
    legend: chartLegend,
    emptyText: 'Leader trends are not available yet',
  });
}

export function toGroupedBarView(groups: NamedSeries[]): ApexChartView {
  const years = collectNames(groups.flatMap((group) => group.series)).sort();
  const categories = groups.map((group) => wrapCategoryLabel(group.name));
  const series: ApexAxisChartSeries = years.map((year) => ({
    name: year,
    data: groups.map((group) => group.series.find((point) => point.name === year)?.value ?? null),
  }));

  return {
    series,
    chart: barChart(),
    colors: [...CHART_SERIES_COLORS],
    stroke: { show: true, width: 0 },
    fill: barFill,
    legend: chartLegend,
    grid: chartGrid,
    tooltip: {
      ...chartTooltip,
      x: { formatter: (value) => String(value).replaceAll('\n', ' ') },
    },
    dataLabels: chartDataLabels,
    markers: chartMarkers,
    plotOptions: barPlotOptions,
    noData: noChartData('No service comparison data yet'),
    yaxis: attendeesAxis,
    xaxis: {
      type: 'category',
      categories,
      tickPlacement: 'between',
      labels: {
        rotate: 0,
        rotateAlways: false,
        hideOverlappingLabels: false,
        trim: false,
        maxHeight: 80,
        style: {
          colors: chartInk.muted,
          fontSize: '12px',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 500,
          cssClass: 'dashboard-chart-category',
        },
      },
      axisBorder: { color: chartInk.line },
      axisTicks: { color: chartInk.line },
    },
  };
}

function toTimeSeriesView(
  groups: NamedSeries[],
  range: DateRange | undefined,
  options: { chart: ApexChart; fill: ApexFill; legend: ApexLegend; emptyText: string },
): ApexChartView {
  const categories = collectCategories(groups);
  const parsed = categories.map(parsePointName);
  const useDatetime = categories.length > 0 && parsed.every((value) => value !== null);
  const density = resolveDensity(parsed, range);

  const series: ApexAxisChartSeries = useDatetime
    ? groups.map((group) => ({
        name: group.name,
        data: group.series.map((point) => ({
          x: parsePointName(point.name) ?? point.name,
          y: point.value,
        })),
      }))
    : groups.map((group) => ({
        name: group.name,
        data: categories.map(
          (category) => group.series.find((point) => point.name === category)?.value ?? null,
        ),
      }));

  return {
    series,
    chart: options.chart,
    colors: [...CHART_SERIES_COLORS],
    stroke: chartStroke,
    fill: options.fill,
    legend: options.legend,
    grid: chartGrid,
    tooltip: {
      ...chartTooltip,
      x: useDatetime
        ? { format: density === 'month' ? 'MMM yyyy' : 'MMM d, yyyy' }
        : undefined,
    },
    dataLabels: chartDataLabels,
    markers: chartMarkers,
    plotOptions: {},
    noData: noChartData(options.emptyText),
    yaxis: attendeesAxis,
    xaxis: useDatetime
      ? datetimeAxis(density, parsed as number[])
      : categoryAxis(categories, density),
  };
}

function collectCategories(groups: NamedSeries[]): string[] {
  const names = collectNames(groups.flatMap((group) => group.series));
  const parsed = names.map(parsePointName);
  if (parsed.some((value) => value === null)) {
    return names;
  }
  return names
    .map((name, index) => ({ name, time: parsed[index] as number }))
    .sort((left, right) => left.time - right.time)
    .map((item) => item.name);
}

function collectNames(points: NamedValue[]): string[] {
  const names: string[] = [];
  for (const point of points) {
    if (!names.includes(point.name)) {
      names.push(point.name);
    }
  }
  return names;
}

function resolveDensity(parsed: Array<number | null>, range?: DateRange): XAxisDensity {
  const start = range?.start ?? (parsed[0] != null ? new Date(parsed[0]) : null);
  const end =
    range?.end ??
    (parsed[parsed.length - 1] != null ? new Date(parsed[parsed.length - 1] as number) : null);
  if (!start || !end) {
    return parsed.length > 20 ? 'month' : parsed.length > 8 ? 'week' : 'day';
  }
  return xAxisDensity(start, end);
}

function datetimeAxis(density: XAxisDensity, timestamps: number[]): ApexXAxis {
  const min = timestamps.length ? Math.min(...timestamps) : undefined;
  const max = timestamps.length ? Math.max(...timestamps) : undefined;
  const tickAmount =
    density === 'month' ? Math.min(12, Math.max(4, monthSpan(min, max))) : density === 'week' ? 8 : undefined;

  return {
    type: 'datetime',
    min,
    max,
    tickAmount,
    labels: {
      datetimeUTC: false,
      hideOverlappingLabels: true,
      rotate: 0,
      trim: false,
      style: { colors: chartInk.muted, fontSize: '12px', fontFamily: 'Inter, system-ui, sans-serif' },
      formatter: (_value, timestamp) => formatTick(timestamp ?? Number(_value), density),
    },
    axisBorder: { color: chartInk.line },
    axisTicks: { color: chartInk.line },
    tooltip: { enabled: false },
  };
}

function categoryAxis(categories: string[], density: XAxisDensity): ApexXAxis {
  const tickAmount =
    density === 'month'
      ? Math.min(12, categories.length)
      : density === 'week'
        ? Math.min(8, categories.length)
        : undefined;

  return {
    type: 'category',
    categories,
    tickAmount,
    labels: {
      rotate: 0,
      hideOverlappingLabels: true,
      trim: false,
      style: { colors: chartInk.muted, fontSize: '12px', fontFamily: 'Inter, system-ui, sans-serif' },
    },
    axisBorder: { color: chartInk.line },
    axisTicks: { color: chartInk.line },
  };
}

function formatTick(timestamp: number, density: XAxisDensity): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  if (density === 'month') {
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function monthSpan(min?: number, max?: number): number {
  if (min == null || max == null) {
    return 12;
  }
  const start = new Date(min);
  const end = new Date(max);
  return Math.max(1, (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1);
}
